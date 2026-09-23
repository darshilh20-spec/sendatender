// mockGovChecks.js – Mock Government Registry & Multi-Stage Verification Engine
// SIH 2026 Problem Statement PS-26100
// DISCLAIMER: MOCK GOVERNMENT CHECK — SIH DEMO (Simulates API Setu, GSTN, NSDL PAN, Udyam MSME, and MCA21)

// Canonical Mock Registry Database containing verified government records
const MOCK_REGISTRY = {
  gst: {
    '27AAQCA1234F1ZP': {
      legalName: 'Aarav Industrial Solutions Pvt. Ltd.',
      pan: 'AAQCA1234F',
      stateCode: '27',
      state: 'Maharashtra',
      status: 'ACTIVE',
      filingCompliant: true,
      lastGstr3b: 'August 2026'
    },
    '29AABCN5521K1ZQ': {
      legalName: 'NexGen Infra Systems LLP',
      pan: 'AABCN5521K',
      stateCode: '29',
      state: 'Karnataka',
      status: 'ACTIVE',
      filingCompliant: true,
      lastGstr3b: 'July 2026'
    },
    '33AABCK8899P1ZM': {
      legalName: 'Kaveri Steel & Forgings Ltd.',
      pan: 'AABCK8899P',
      stateCode: '33',
      state: 'Tamil Nadu',
      status: 'ACTIVE',
      filingCompliant: true,
      lastGstr3b: 'August 2026'
    },
    '07AAACS9988G1ZQ': {
      legalName: 'Shree Krishna Heavy Engineering Private Limited',
      pan: 'AAACS9988G',
      stateCode: '07',
      state: 'Delhi',
      status: 'ACTIVE',
      filingCompliant: true,
      lastGstr3b: 'July 2026'
    },
    '06AAACV1298E1Z4': {
      legalName: 'Vertex Global Supplies Ltd.',
      pan: 'AAACV1298E',
      stateCode: '06',
      state: 'Haryana',
      status: 'SUSPENDED',
      filingCompliant: false,
      lastGstr3b: 'January 2025'
    }
  },

  pan: {
    'AAQCA1234F': {
      name: 'Aarav Industrial Solutions Pvt. Ltd.',
      category: 'Company',
      status: 'VALID',
      aadhaarLinked: true
    },
    'AABCN5521K': {
      name: 'NexGen Infra Systems LLP',
      category: 'LLP',
      status: 'VALID',
      aadhaarLinked: true
    },
    'AABCK8899P': {
      name: 'Kaveri Steel & Forgings Ltd.',
      category: 'Company',
      status: 'VALID',
      aadhaarLinked: true
    },
    'AAACS9988G': {
      name: 'SK Heavy Eng Works Sole Prop',
      category: 'Individual / Prop',
      status: 'VALID',
      aadhaarLinked: true
    },
    'AAACV1298E': {
      name: 'Vertex Global Supplies Ltd.',
      category: 'Company',
      status: 'VALID',
      aadhaarLinked: true
    }
  },

  udyam: {
    'UDYAM-MH-01-0012345': {
      enterpriseName: 'Aarav Industrial Solutions Pvt. Ltd.',
      classification: 'Medium (Manufacturing)',
      status: 'ACTIVE'
    },
    'UDYAM-TN-02-0098765': {
      enterpriseName: 'Kaveri Steel & Forgings Ltd.',
      classification: 'Small (Manufacturing)',
      status: 'ACTIVE'
    },
    'UDYAM-DL-01-0044556': {
      enterpriseName: 'Shree Krishna Heavy Engineering',
      classification: 'Micro (Manufacturing)',
      status: 'ACTIVE'
    },
    'UDYAM-HR-03-0077889': {
      enterpriseName: 'Vertex Global Supplies Ltd.',
      classification: 'Trading Enterprise',
      status: 'ACTIVE'
    }
  },

  mca: {
    'U28100MH2018PTC310234': {
      companyName: 'Aarav Industrial Solutions Pvt. Ltd.',
      status: 'ACTIVE',
      roc: 'ROC Mumbai',
      category: 'Company limited by Shares'
    },
    'L27100TN1995PLC031245': {
      companyName: 'Kaveri Steel & Forgings Ltd.',
      status: 'ACTIVE',
      roc: 'ROC Chennai',
      category: 'Public Listed Company'
    },
    'U29100DL2015PTC284910': {
      companyName: 'Shree Krishna Heavy Engineering Private Limited',
      status: 'ACTIVE',
      roc: 'ROC Delhi',
      category: 'Private Company'
    },
    'U51909HR2021PLC092100': {
      companyName: 'Vertex Global Supplies Ltd.',
      status: 'UNDER_SCRUTINY',
      roc: 'ROC Delhi/Haryana',
      category: 'Public Company'
    }
  }
};

// Multi-stage verification helper
function verifyWithMockRegistry({ gstNumber, panNumber, udyamId, mcaCin, profileName }) {
  // 1. GST Verification Pipeline
  const gstResult = {
    extracted: gstNumber || null,
    formatValid: Boolean(gstNumber && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber)),
    crossMatch: 'NOT_TESTED',
    registryResult: 'NOT_FOUND',
    finalStatus: 'MISSING',
    evidence: ''
  };

  if (gstNumber) {
    if (!gstResult.formatValid) {
      gstResult.crossMatch = 'FAIL';
      gstResult.registryResult = 'INVALID_FORMAT';
      gstResult.finalStatus = 'FAIL';
      gstResult.evidence = `Extracted: ${gstNumber} | Format: INVALID (Syntax Error) | MOCK GST Registry: REJECTED | Final: FAIL`;
    } else {
      const regGst = MOCK_REGISTRY.gst[gstNumber];
      if (!regGst) {
        gstResult.crossMatch = 'PENDING';
        gstResult.registryResult = 'NOT_FOUND_IN_REGISTRY';
        gstResult.finalStatus = 'REVIEW';
        gstResult.evidence = `Extracted: ${gstNumber} | Format: VALID | MOCK GST Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: REVIEW`;
      } else if (regGst.status === 'SUSPENDED') {
        gstResult.crossMatch = 'PASS';
        gstResult.registryResult = 'SUSPENDED_BY_TAX_AUTHORITY';
        gstResult.finalStatus = 'FAIL';
        gstResult.evidence = `Extracted: ${gstNumber} | Format: VALID | MOCK GST Registry: SUSPENDED (Non-Filing of 3B) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: FAIL`;
      } else {
        // Cross match against profileName if provided
        const nameMatch = !profileName || profileName.toLowerCase().split(' ')[0] === regGst.legalName.toLowerCase().split(' ')[0];
        gstResult.crossMatch = nameMatch ? 'PASS' : 'NAME_MISMATCH';
        gstResult.registryResult = 'ACTIVE';
        gstResult.finalStatus = nameMatch ? 'PASS' : 'REVIEW';
        gstResult.evidence = `Extracted: ${gstNumber} | Format: VALID | Cross-match: ${nameMatch ? 'MATCHED' : 'ENTITY MISMATCH'} | MOCK GST Registry: ACTIVE (${regGst.state}) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: ${gstResult.finalStatus}`;
      }
    }
  } else {
    gstResult.evidence = 'Extracted: NONE | Format: MISSING | MOCK GST Registry: NOT QUERIED | Final: MISSING';
  }

  // 2. PAN Verification Pipeline
  const panResult = {
    extracted: panNumber || null,
    formatValid: Boolean(panNumber && /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(panNumber)),
    crossMatch: 'NOT_TESTED',
    registryResult: 'NOT_FOUND',
    finalStatus: 'MISSING',
    evidence: ''
  };

  if (panNumber) {
    if (!panResult.formatValid) {
      panResult.crossMatch = 'FAIL';
      panResult.registryResult = 'INVALID_FORMAT';
      panResult.finalStatus = 'FAIL';
      panResult.evidence = `Extracted: ${panNumber} | Format: INVALID (Syntax Error) | MOCK PAN Registry: REJECTED | Final: FAIL`;
    } else {
      const regPan = MOCK_REGISTRY.pan[panNumber];
      if (!regPan) {
        panResult.crossMatch = 'PENDING';
        panResult.registryResult = 'NOT_FOUND_IN_REGISTRY';
        panResult.finalStatus = 'REVIEW';
        panResult.evidence = `Extracted: ${panNumber} | Format: VALID | MOCK PAN Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: REVIEW`;
      } else {
        // Compare with GST PAN digits if GST present
        let gstPanMatch = true;
        if (gstNumber && gstNumber.length === 15) {
          gstPanMatch = (gstNumber.slice(2, 12) === panNumber);
        }
        panResult.crossMatch = gstPanMatch ? 'PASS' : 'PAN_GST_MISMATCH';
        panResult.registryResult = regPan.status;
        panResult.finalStatus = gstPanMatch ? 'PASS' : 'REVIEW';
        panResult.evidence = `Extracted: ${panNumber} | Format: VALID | Cross-match: ${gstPanMatch ? 'PASS (GST Linked)' : 'MISMATCH'} | MOCK PAN Registry: VALID (${regPan.category}) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: ${panResult.finalStatus}`;
      }
    }
  } else {
    panResult.evidence = 'Extracted: NONE | Format: MISSING | MOCK PAN Registry: NOT QUERIED | Final: MISSING';
  }

  // 3. Udyam Verification Pipeline
  const udyamResult = {
    extracted: udyamId || null,
    formatValid: Boolean(udyamId && /^UDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}$/i.test(udyamId)),
    crossMatch: 'NOT_TESTED',
    registryResult: 'NOT_FOUND',
    finalStatus: 'MISSING',
    evidence: ''
  };

  if (udyamId) {
    if (!udyamResult.formatValid) {
      udyamResult.crossMatch = 'FAIL';
      udyamResult.registryResult = 'INVALID_FORMAT';
      udyamResult.finalStatus = 'FAIL';
      udyamResult.evidence = `Extracted: ${udyamId} | Format: INVALID | MOCK Udyam Registry: REJECTED | Final: FAIL`;
    } else {
      const regUdyam = MOCK_REGISTRY.udyam[udyamId.toUpperCase()];
      if (!regUdyam) {
        udyamResult.crossMatch = 'PENDING';
        udyamResult.registryResult = 'NOT_FOUND_IN_REGISTRY';
        udyamResult.finalStatus = 'REVIEW';
        udyamResult.evidence = `Extracted: ${udyamId} | Format: VALID | MOCK Udyam Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: REVIEW`;
      } else {
        udyamResult.crossMatch = 'PASS';
        udyamResult.registryResult = regUdyam.classification;
        udyamResult.finalStatus = 'PASS';
        udyamResult.evidence = `Extracted: ${udyamId} | Format: VALID | Cross-match: PASS | MOCK Udyam Registry: ACTIVE (${regUdyam.classification}) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: PASS`;
      }
    }
  } else {
    udyamResult.evidence = 'Extracted: NONE | Format: MISSING | MOCK Udyam Registry: NOT QUERIED | Final: MISSING';
  }

  // 4. MCA Verification Pipeline (NEVER DEFAULTS TO PASS)
  const mcaResult = {
    extracted: mcaCin || null,
    formatValid: Boolean(mcaCin && /^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/.test(mcaCin)),
    crossMatch: 'NOT_TESTED',
    registryResult: 'NOT_FOUND',
    finalStatus: 'MISSING',
    evidence: ''
  };

  if (mcaCin) {
    if (!mcaResult.formatValid) {
      mcaResult.crossMatch = 'FAIL';
      mcaResult.registryResult = 'INVALID_FORMAT';
      mcaResult.finalStatus = 'FAIL';
      mcaResult.evidence = `Extracted: ${mcaCin} | Format: INVALID CIN | MOCK MCA21: REJECTED | Final: FAIL`;
    } else {
      const regMca = MOCK_REGISTRY.mca[mcaCin];
      if (!regMca) {
        mcaResult.crossMatch = 'PENDING';
        mcaResult.registryResult = 'NOT_FOUND_IN_REGISTRY';
        mcaResult.finalStatus = 'REVIEW';
        mcaResult.evidence = `Extracted: ${mcaCin} | Format: VALID | MOCK MCA21 Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: REVIEW`;
      } else if (regMca.status === 'UNDER_SCRUTINY') {
        mcaResult.crossMatch = 'REVIEW';
        mcaResult.registryResult = 'UNDER_SCRUTINY';
        mcaResult.finalStatus = 'REVIEW';
        mcaResult.evidence = `Extracted: ${mcaCin} | Format: VALID | MOCK MCA21 Registry: UNDER SCRUTINY (${regMca.roc}) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: REVIEW`;
      } else {
        mcaResult.crossMatch = 'PASS';
        mcaResult.registryResult = 'ACTIVE';
        mcaResult.finalStatus = 'PASS';
        mcaResult.evidence = `Extracted: ${mcaCin} | Format: VALID | Cross-match: PASS | MOCK MCA21 Registry: ACTIVE (${regMca.roc}) (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: PASS`;
      }
    }
  } else {
    // If no CIN extracted: explicitly MISSING or REVIEW, NEVER PASS
    mcaResult.finalStatus = 'MISSING';
    mcaResult.evidence = 'Extracted: NONE | Format: MISSING | MOCK MCA21 Registry: NO CIN PROVIDED (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: MISSING';
  }

  return {
    gst: gstResult,
    pan: panResult,
    udyam: udyamResult,
    mca: mcaResult
  };
}

module.exports = {
  MOCK_REGISTRY,
  verifyWithMockRegistry
};
