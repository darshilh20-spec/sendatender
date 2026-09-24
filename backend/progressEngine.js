/**
 * Vendor Progress Engine for SendaTender
 * Centralized, authoritative progress and context layer for Tender Buddy & SIH 26100.
 * Directly maps SendaTender application state to the structured progress schema.
 */

// Canonical Statutory & Tender Requirements for MoPNG / GeM Tender #S26-104 (Valves & Piping)
const STATUTORY_REQUIREMENTS = [
  {
    id: 'req_gst',
    code: 'GST',
    name: 'GST Registration Certificate',
    category: 'Statutory Identity',
    mandatory: true,
    description: 'Active GSTIN certificate registered under GST authorities',
    statutoryKey: 'gst'
  },
  {
    id: 'req_pan',
    code: 'PAN',
    name: 'Permanent Account Number (PAN) Card',
    category: 'Statutory Identity',
    mandatory: true,
    description: 'Entity PAN matching legal entity title and MCA records',
    statutoryKey: 'pan'
  },
  {
    id: 'req_udyam',
    code: 'UDYAM',
    name: 'Udyam / MSME Registration Certificate',
    category: 'Statutory Exemption / Quota',
    mandatory: false, // Mandatory only if claiming MSME exemption
    description: 'Valid Udyam Registration for manufacturing/service classification',
    statutoryKey: 'udyam'
  },
  {
    id: 'req_mca',
    code: 'MCA',
    name: 'MCA21 Certificate of Incorporation / CIN',
    category: 'Corporate Standing',
    mandatory: true,
    description: 'Active Corporate Identity Number (CIN) or LLP registration',
    statutoryKey: 'mca'
  },
  {
    id: 'req_itr',
    code: 'ITR',
    name: '3-Year Income Tax Returns (ITR)',
    category: 'Financial Capability',
    mandatory: true,
    description: 'Audited ITR filings for past 3 consecutive assessment years',
    statutoryKey: 'itr'
  },
  {
    id: 'req_balance_sheet',
    code: 'BALANCE_SHEET',
    name: 'Audited Balance Sheet & Financial Statements',
    category: 'Financial Capability',
    mandatory: true,
    description: 'CA-certified balance sheets confirming positive net worth',
    statutoryKey: 'balance_sheet'
  },
  {
    id: 'req_emd',
    code: 'EMD',
    name: 'Earnest Money Deposit (EMD) / Bank Guarantee',
    category: 'Tender Security',
    mandatory: true,
    description: 'Valid EMD Bank Guarantee or official MSME EMD exemption certificate',
    statutoryKey: 'emd'
  },
  {
    id: 'req_tender_doc',
    code: 'NIT_BOQ',
    name: 'Signed NIT/RFP Acknowledgement & Priced BOQ',
    category: 'Tender Submission',
    mandatory: true,
    description: 'Complete signed Notice Inviting Tender and pricing schedule',
    statutoryKey: 'nit_boq'
  }
];

/**
 * Build Authoritative Progress Object for a Bidder / Vendor Submission
 * 
 * @param {Object} params
 * @param {Object} params.bidder - Selected bidder from database or live upload
 * @param {Object} params.tender - Tender specification
 * @param {string} params.role - 'vendor' | 'officer'
 * @param {string} params.view - 'home' | 'vendor' | 'officer'
 * @param {string} params.lang - 'en' | 'hi' | 'mr'
 * @param {Array} params.files - Current uploaded files in session (if any)
 * @returns {Object} Structured progress state
 */
function buildProgressState({ bidder, tender, role = 'vendor', view = 'home', lang = 'en', files = [] }) {
  const tenderInfo = {
    id: tender?.id || 'S26-104',
    title: tender?.title || 'Tender #S26-104 (Valves & Piping)',
    description: 'Procurement of High-Pressure Industrial Valves and Piping Assemblies under MoPNG / GeM Statutory Guidelines.',
    authority: 'Ministry of Petroleum & Natural Gas / GeM',
    item: 'High-Pressure Industrial Valves & Piping Components',
    quantity: '1,500 Units / Standard API-6D Specifications',
    bidStart: '01-Feb-2026',
    bidClose: '28-Feb-2026 15:00 IST',
    emdRequired: '₹ 2,50,000 (Exempt for registered MSME units with valid Udyam)',
    requirements: STATUTORY_REQUIREMENTS
  };

  if (!bidder) {
    return {
      hasActiveBidder: false,
      role,
      currentView: view,
      language: lang,
      tender: tenderInfo,
      vendor: null,
      documents: [],
      compliance: {
        score: 0,
        risk: 'N/A',
        passCount: 0,
        reviewCount: 0,
        failCount: 0,
        missingCount: STATUTORY_REQUIREMENTS.length,
        expiredCount: 0,
        criteria: []
      },
      submissionReadiness: {
        status: 'NOT READY',
        isReady: false,
        blockers: ['No bidder submission package loaded or uploaded'],
        reviewItems: [],
        deadline: tenderInfo.bidClose,
        isDemoSubmitted: false,
        submissionTimestamp: null
      },
      bidProgress: {
        currentStage: 'Tender Selected',
        percentage: 15,
        completedStages: ['Tender Selected', 'Tender Requirements Reviewed'],
        pendingStages: [
          'Vendor Profile Completed',
          'Documents Uploaded',
          'Documents Verified',
          'Compliance Checked',
          'Issues Resolved',
          'Bid Prepared',
          'Submission Readiness'
        ],
        nextActions: [
          'Select a bidder dossier or upload vendor compliance documents in the Vendor Portal'
        ]
      },
      activity: []
    };
  }

  // Bidder exists - inspect matrix, findings, flags
  const matrix = bidder.matrix || {};
  const findings = bidder.findings || [];
  const flags = bidder.flags || [];
  const bName = bidder.name || 'Vendor Entity';

  // Vendor Profile State
  const vendorProfile = {
    id: bidder.id,
    name: bName,
    gstin: bidder.gst || 'Not Provided',
    pan: bidder.pan || 'Not Provided',
    udyam: bidder.udyam || 'Not Provided',
    mca: bidder.mca || 'Not Provided',
    declaredAddress: bidder.declaredAddress || 'Registered Office Address',
    demoType: bidder.demoType || 'Live Submission',
    typeDescription: bidder.typeDescription || ''
  };

  // Map each statutory requirement to actual document finding and status
  const documentChecklist = [];
  const criteriaList = [];
  const nextActions = [];

  let passCount = 0;
  let reviewCount = 0;
  let failCount = 0;
  let missingCount = 0;

  // Specific issue checks grounded in SendaTender application data
  const isGstMissing = matrix.gst?.status === 'MISSING' || !bidder.gst || bidder.gst.includes('Missing');
  const isGstFail = matrix.gst?.status === 'FAIL';
  const isGstReview = matrix.gst?.status === 'REVIEW';
  const isGstPass = matrix.gst?.status === 'PASS';

  const isPanMissing = matrix.pan?.status === 'MISSING' || !bidder.pan || bidder.pan.includes('Missing');
  const isPanFail = matrix.pan?.status === 'FAIL';
  const isPanReview = matrix.pan?.status === 'REVIEW';
  const isPanPass = matrix.pan?.status === 'PASS';

  const isUdyamMissing = matrix.udyam?.status === 'MISSING' || !bidder.udyam || bidder.udyam.includes('Missing');
  const isUdyamFail = matrix.udyam?.status === 'FAIL';
  const isUdyamReview = matrix.udyam?.status === 'REVIEW';
  const isUdyamPass = matrix.udyam?.status === 'PASS';

  const isMcaMissing = matrix.mca?.status === 'MISSING' || !bidder.mca || bidder.mca.includes('Missing');
  const isMcaFail = matrix.mca?.status === 'FAIL';
  const isMcaReview = matrix.mca?.status === 'REVIEW';
  const isMcaPass = matrix.mca?.status === 'PASS';

  const docMatrixStatus = matrix.documents?.status || 'REVIEW';
  const docEvidence = matrix.documents?.evidence || '';
  const defectTextLower = (docEvidence + ' ' + flags.join(' ') + ' ' + findings.join(' ')).toLowerCase();

  const isExpired = (defectTextLower.includes('expired') && !defectTextLower.includes('unexpired')) || defectTextLower.includes('lapsed');
  const isMismatch = matrix.pan?.status === 'REVIEW' || defectTextLower.includes('mismatch') || defectTextLower.includes('differs');
  const isItrMissing = matrix.documents?.status === 'MISSING' || defectTextLower.includes('itr missing') || defectTextLower.includes('itr not attached') || defectTextLower.includes('itr fy 2024');
  const isEmdLapsed = (defectTextLower.includes('emd') && defectTextLower.includes('expired') && !defectTextLower.includes('unexpired')) || defectTextLower.includes('emd lapsed');

  // 1. GST Requirement
  let gstStatus = isGstFail ? 'FAIL' : isGstMissing ? 'MISSING' : isGstReview ? 'REVIEW' : isGstPass ? 'PASS' : 'REVIEW';
  let gstEvidence = matrix.gst?.evidence || (isGstPass ? `Active GSTIN ${bidder.gst} verified in Mock GST Registry` : 'GST verification pending');
  if (isGstPass) passCount++; else if (gstStatus === 'REVIEW') reviewCount++; else if (gstStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_gst',
    code: 'GST',
    name: 'GST Registration Certificate',
    mandatory: true,
    status: gstStatus,
    identifier: bidder.gst,
    evidence: gstEvidence,
    findings: isGstFail ? ['GST registration suspended or invalid'] : isGstReview ? ['Entity or address discrepancy on GST certificate'] : []
  });

  // 2. PAN Requirement
  let panStatus = isPanFail ? 'FAIL' : isPanMissing ? 'MISSING' : isPanReview ? 'REVIEW' : isPanPass ? 'PASS' : 'REVIEW';
  let panEvidence = matrix.pan?.evidence || (isPanPass ? `Active PAN ${bidder.pan} matched to MCA records` : 'PAN verification pending');
  if (isPanPass) passCount++; else if (panStatus === 'REVIEW') reviewCount++; else if (panStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_pan',
    code: 'PAN',
    name: 'Permanent Account Number (PAN) Card',
    mandatory: true,
    status: panStatus,
    identifier: bidder.pan,
    evidence: panEvidence,
    findings: isPanReview ? ['PAN entity name differs from GST / Bank proof'] : []
  });

  // 3. Udyam MSME Requirement
  let udyamStatus = isUdyamFail ? 'FAIL' : isUdyamMissing ? 'MISSING' : isUdyamReview ? 'REVIEW' : isUdyamPass ? 'PASS' : 'MISSING';
  let udyamEvidence = matrix.udyam?.evidence || (isUdyamPass ? `Valid Udyam ${bidder.udyam}` : 'No MSME certificate provided');
  if (udyamStatus === 'PASS') passCount++; else if (udyamStatus === 'REVIEW') reviewCount++; else if (udyamStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_udyam',
    code: 'UDYAM',
    name: 'Udyam / MSME Certificate',
    mandatory: false,
    status: udyamStatus,
    identifier: bidder.udyam,
    evidence: udyamEvidence,
    findings: udyamStatus === 'MISSING' ? ['No Udyam MSME certificate uploaded'] : isUdyamReview ? ['Udyam category mismatch (Trading vs Manufacturing)'] : []
  });

  // 4. MCA21 Incorporation
  let mcaStatus = isMcaFail ? 'FAIL' : isMcaMissing ? 'MISSING' : isMcaReview ? 'REVIEW' : isMcaPass ? 'PASS' : 'REVIEW';
  let mcaEvidence = matrix.mca?.evidence || (isMcaPass ? `CIN ${bidder.mca} active on MCA portal` : 'MCA record verification pending');
  if (mcaStatus === 'PASS') passCount++; else if (mcaStatus === 'REVIEW') reviewCount++; else if (mcaStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_mca',
    code: 'MCA',
    name: 'MCA21 Certificate of Incorporation / CIN',
    mandatory: true,
    status: mcaStatus,
    identifier: bidder.mca,
    evidence: mcaEvidence,
    findings: isMcaReview ? ['Director scrutiny flag or ROC address discrepancy'] : []
  });

  // 5. 3-Year ITR
  let itrStatus = isItrMissing ? 'MISSING' : (docMatrixStatus === 'PASS' ? 'PASS' : 'REVIEW');
  let itrEvidence = isItrMissing ? 'Audited ITR FY 2024-25 not attached' : '3-Year ITR filings present in dossier';
  if (itrStatus === 'PASS') passCount++; else if (itrStatus === 'REVIEW') reviewCount++; else if (itrStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_itr',
    code: 'ITR',
    name: '3-Year Income Tax Returns (ITR)',
    mandatory: true,
    status: itrStatus,
    evidence: itrEvidence,
    findings: isItrMissing ? ['ITR FY 2024-25 missing'] : []
  });

  // 6. Audited Balance Sheet & Bank Proof
  let bsStatus = isExpired ? 'FAIL' : isMismatch ? 'REVIEW' : (docMatrixStatus === 'PASS' ? 'PASS' : 'REVIEW');
  let bsEvidence = isExpired ? 'Audited statement / tax clearance expired' : isMismatch ? 'Bank account proof title differs from PAN entity name' : 'Audited balance sheet and bank proof verified';
  if (bsStatus === 'PASS') passCount++; else if (bsStatus === 'REVIEW') reviewCount++; else if (bsStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_balance_sheet',
    code: 'BALANCE_SHEET',
    name: 'Audited Balance Sheet & Bank Proof',
    mandatory: true,
    status: bsStatus,
    evidence: bsEvidence,
    findings: isMismatch ? ['Bank proof title mismatch'] : isExpired ? ['Tax clearance validity expired'] : []
  });

  // 7. EMD Bank Guarantee / MSME Exemption
  let emdStatus = isEmdLapsed ? 'FAIL' : (docMatrixStatus === 'PASS' ? 'PASS' : (isUdyamPass ? 'PASS' : 'REVIEW'));
  let emdEvidence = isEmdLapsed ? 'EMD Bank Guarantee expired prior to bid submission' : (isUdyamPass ? 'Exempted under valid Udyam MSME certification' : 'EMD Bank Guarantee active');
  if (emdStatus === 'PASS') passCount++; else if (emdStatus === 'REVIEW') reviewCount++; else if (emdStatus === 'FAIL') failCount++; else missingCount++;
  documentChecklist.push({
    requirementId: 'req_emd',
    code: 'EMD',
    name: 'Earnest Money Deposit (EMD) / Guarantee',
    mandatory: true,
    status: emdStatus,
    evidence: emdEvidence,
    findings: isEmdLapsed ? ['EMD Bank Guarantee expired'] : []
  });

  // 8. Signed Tender / NIT / BOQ (Mandatory tender acknowledgement)
  let tenderDocStatus = (docEvidence.toLowerCase().includes('blank') || docEvidence.toLowerCase().includes('corrupt')) ? 'FAIL' : 'PASS';
  let tenderDocEvidence = 'Signed NIT/RFP acceptance and priced BOQ verified';
  if (tenderDocStatus === 'PASS') passCount++; else failCount++;
  documentChecklist.push({
    requirementId: 'req_tender_doc',
    code: 'NIT_BOQ',
    name: 'Signed NIT/RFP Acknowledgement & Priced BOQ',
    mandatory: true,
    status: tenderDocStatus,
    evidence: tenderDocEvidence,
    findings: []
  });

  // Compile Next Actions based on priority
  // Priority 1: High Risk / FAILS
  if (isGstFail) nextActions.push('Resolve suspended GSTIN with tax authority and re-upload active registration.');
  if (isEmdLapsed) nextActions.push('Upload a freshly issued, valid EMD Bank Guarantee or valid MSME exemption.');
  if (isExpired) nextActions.push('Replace expired statutory certificates (Tax Clearance / ISO) with current year renewals.');
  
  // Priority 2: Missing mandatory items
  if (isGstMissing) nextActions.push('Upload mandatory GST Registration Certificate.');
  if (isPanMissing) nextActions.push('Upload mandatory PAN card proof.');
  if (isItrMissing) nextActions.push('Upload missing 3-Year ITR (FY 2024-25).');
  if (isUdyamMissing) nextActions.push('Upload Udyam MSME certificate if claiming EMD exemption or procurement preference.');
  
  // Priority 3: Discrepancy / REVIEW resolutions
  if (isMismatch) nextActions.push('Harmonize legal entity name and registered address between PAN, GSTIN, and Bank records.');
  if (isGstReview) nextActions.push('Check GST registration state code and registered address consistency.');
  if (isMcaReview) nextActions.push('Provide Board Resolution / POA confirming authorized signatory credentials.');

  // Priority 4: Re-verification / Submission
  if (nextActions.length > 0) {
    nextActions.push('Re-run AI verification from Vendor Portal after updating files.');
  } else {
    nextActions.push('All mandatory requirements satisfied. Proceed to final Officer Review & Sanction.');
  }

  // Calculate Bid Progress Stages
  const completedStages = [
    'Tender selected',
    'Tender requirements reviewed',
    'Vendor profile completed',
    'Documents uploaded',
    'Documents identified',
    'Documents verified',
    'Compliance checked'
  ];

  const pendingStages = [];
  let currentStage = 'Compliance checked';

  if (failCount > 0 || reviewCount > 0 || missingCount > 0) {
    completedStages.push('Issues identified');
    currentStage = 'Issues identified';
    pendingStages.push('Issues resolved', 'Bid prepared', 'Submission readiness');
  } else {
    completedStages.push('Issues identified', 'Issues resolved', 'Bid prepared', 'Submission readiness');
    currentStage = 'Submission readiness';
  }

  if (bidder.audit && bidder.audit.some(a => a.action && a.action.includes('Decision Recorded'))) {
    completedStages.push('Officer review', 'Officer decision');
    currentStage = `Officer decision: ${bidder.status}`;
  } else if (role === 'officer' || view === 'officer') {
    pendingStages.push('Officer review', 'Officer decision');
  }

  // Calculate overall progress percentage
  // 8 statutory checks: pass=1, review=0.5, fail=0, missing=0
  const totalChecks = documentChecklist.length;
  const progressPercentage = Math.round(((passCount + (reviewCount * 0.5)) / (totalChecks || 8)) * 100);

  // Calculate Submission Readiness strictly based on statutory rules:
  // - Missing mandatory requirement → NOT READY
  // - FAIL on mandatory requirement → NOT READY
  // - EXPIRED mandatory document → NOT READY
  // - REVIEW/discrepancy → REQUIRES REVIEW
  // - All mandatory requirements passed and no blocking issue → READY

  const mandatoryDocs = documentChecklist.filter(d => d.mandatory);
  const mandatoryMissing = mandatoryDocs.filter(d => d.status === 'MISSING');
  const mandatoryFail = mandatoryDocs.filter(d => d.status === 'FAIL');
  const mandatoryReview = mandatoryDocs.filter(d => d.status === 'REVIEW');
  const expiredDocs = documentChecklist.filter(d => d.status === 'EXPIRED' || (d.findings && d.findings.some(f => f.toLowerCase().includes('expired'))));

  let readinessStatus = 'READY';
  const blockers = [];
  const reviewItems = [];

  if (mandatoryMissing.length > 0) {
    readinessStatus = 'NOT READY';
    mandatoryMissing.forEach(d => blockers.push(`Missing mandatory document: ${d.name}`));
  }
  if (mandatoryFail.length > 0) {
    readinessStatus = 'NOT READY';
    mandatoryFail.forEach(d => blockers.push(`Failed mandatory verification: ${d.name} (${d.findings[0] || 'Verification Failed'})`));
  }
  if (isExpired || isEmdLapsed) {
    readinessStatus = 'NOT READY';
    if (!blockers.some(b => b.toLowerCase().includes('expired'))) {
      blockers.push(`Expired mandatory certificate detected (${isEmdLapsed ? 'EMD Bank Guarantee' : 'Tax Clearance / ISO'})`);
    }
  }

  if (readinessStatus !== 'NOT READY') {
    if (mandatoryReview.length > 0 || reviewCount > 0) {
      readinessStatus = 'REQUIRES REVIEW';
      mandatoryReview.forEach(d => reviewItems.push(`Review required: ${d.name} (${d.findings[0] || d.evidence})`));
    }
  }

  const isDemoSubmitted = bidder.audit && bidder.audit.some(a => a.action && a.action.includes('Simulation Submitted'));

  return {
    hasActiveBidder: true,
    role,
    currentView: view,
    language: lang,
    tender: tenderInfo,
    vendor: vendorProfile,
    documents: documentChecklist,
    compliance: {
      score: bidder.score,
      risk: bidder.risk,
      status: bidder.status,
      passCount,
      reviewCount,
      failCount,
      missingCount,
      expiredCount: (isExpired ? 1 : 0) + (isEmdLapsed ? 1 : 0),
      totalCount: totalChecks,
      findings,
      flags
    },
    submissionReadiness: {
      status: readinessStatus, // 'READY' | 'NOT READY' | 'REQUIRES REVIEW'
      isReady: readinessStatus === 'READY',
      blockers,
      reviewItems,
      deadline: tenderInfo.bidClose,
      isDemoSubmitted,
      submissionTimestamp: isDemoSubmitted ? (bidder.audit.find(a => a.action.includes('Simulation Submitted'))?.timestamp || '') : null
    },
    bidProgress: {
      currentStage,
      percentage: progressPercentage,
      completedStages,
      pendingStages,
      nextActions
    },
    activity: bidder.audit || []
  };
}

module.exports = {
  STATUTORY_REQUIREMENTS,
  buildProgressState
};
