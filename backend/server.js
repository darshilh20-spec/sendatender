require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const pdfParse = require('pdf-parse');
const { verifyWithMockRegistry, MOCK_REGISTRY } = require('./mockGovChecks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Storage directory setup
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const upload = multer({ dest: uploadsDir });

// Serve frontend static files from workspace root
app.use(express.static(path.join(__dirname, '..')));

// 5 Canonical Synthetic Demo Bidders (Clearly identified as preloaded demo archetypes)
const initialDemoBidders = [
  {
    id: 'bidder-1',
    name: 'Aarav Industrial Solutions Pvt. Ltd.',
    gst: '27AAQCA1234F1ZP',
    pan: 'AAQCA1234F',
    udyam: 'UDYAM-MH-01-0012345',
    mca: 'U28100MH2018PTC310234',
    package: 'Tender #S26-104 (Valves & Piping)',
    demoType: 'Preloaded Demo: Fully Compliant',
    typeDescription: 'Archetype 1: Fully Compliant — Valid GST, PAN, Udyam, MCA, 100% document match',
    score: 96,
    risk: 'Low',
    status: 'Ready for review',
    docs: 8,
    matrix: {
      gst: { status: 'PASS', label: 'GSTN Registration Check', evidence: 'GSTIN 27AAQCA1234F1ZP verified active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      pan: { status: 'PASS', label: 'PAN Identity Check', evidence: 'PAN AAQCA1234F linked and matched to MCA entity (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      udyam: { status: 'PASS', label: 'Udyam MSME Registry', evidence: 'UDYAM-MH-01-0012345 valid manufacturing status (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      mca: { status: 'PASS', label: 'MCA21 Company Status', evidence: 'CIN U28100MH2018PTC310234 active, ROC Mumbai (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      documents: { status: 'PASS', label: 'Mandatory Document Suite', evidence: 'NIT, BOQ, EMD, ITR, GST, Bank Proof verified valid and unexpired' }
    },
    findings: ['All statutory and technical criteria satisfied with zero discrepancies'],
    flags: [],
    audit: [
      { action: 'AI Verification Completed', timestamp: 'Today, 10:42 AM', user: 'System (Demo Engine)' },
      { action: 'Package Submitted', timestamp: 'Today, 10:36 AM', user: 'Vendor Portal' }
    ]
  },
  {
    id: 'bidder-2',
    name: 'NexGen Infra Systems LLP',
    gst: '29AABCN5521K1ZQ',
    pan: 'AABCN5521K',
    udyam: '',
    mca: 'AAB-5521',
    package: 'Tender #S26-104 (Valves & Piping)',
    demoType: 'Preloaded Demo: Missing Documents',
    typeDescription: 'Archetype 2: Missing Documents — Udyam Certificate & FY24 ITR missing',
    score: 72,
    risk: 'Medium',
    status: 'Needs review',
    docs: 5,
    matrix: {
      gst: { status: 'PASS', label: 'GSTN Registration Check', evidence: 'GSTIN 29AABCN5521K1ZQ active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      pan: { status: 'PASS', label: 'PAN Identity Check', evidence: 'PAN AABCN5521K active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      udyam: { status: 'MISSING', label: 'Udyam Registration Missing', evidence: 'No MSME/Udyam certificate attached in submission package' },
      mca: { status: 'PASS', label: 'MCA21 Company Status', evidence: 'MCA LLP identification active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      documents: { status: 'MISSING', label: 'Incomplete Documentation', evidence: 'ITR FY 2024-25 and MSME declaration not provided' }
    },
    findings: ['Udyam/MSME proof missing from uploaded package', 'Audited ITR FY 2024-25 not attached'],
    flags: ['Udyam Certificate is missing', 'ITR FY 2024–25 missing'],
    audit: [
      { action: 'Flagged for Missing Discrepancy', timestamp: 'Today, 09:18 AM', user: 'System (Demo Engine)' },
      { action: 'Package Submitted', timestamp: 'Today, 09:10 AM', user: 'Vendor Portal' }
    ]
  },
  {
    id: 'bidder-3',
    name: 'Kaveri Steel & Forgings Ltd.',
    gst: '33AABCK8899P1ZM',
    pan: 'AABCK8899P',
    udyam: 'UDYAM-TN-02-0098765',
    mca: 'L27100TN1995PLC031245',
    package: 'Tender #S26-104 (Valves & Piping)',
    demoType: 'Preloaded Demo: Expired Certificate',
    typeDescription: 'Archetype 3: Expired Certificate — ISO 9001 and Tax Clearance Certificate expired',
    score: 64,
    risk: 'Medium',
    status: 'Needs review',
    docs: 7,
    matrix: {
      gst: { status: 'PASS', label: 'GSTN Registration Check', evidence: 'GSTIN 33AABCK8899P1ZM active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      pan: { status: 'PASS', label: 'PAN Identity Check', evidence: 'PAN verified (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      udyam: { status: 'PASS', label: 'Udyam MSME Registry', evidence: 'UDYAM-TN-02-0098765 active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      mca: { status: 'PASS', label: 'MCA21 Company Status', evidence: 'CIN L27100TN1995PLC031245 active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      documents: { status: 'FAIL', label: 'Expired Statutory Documents', evidence: 'Tax Clearance Certificate expired on 31-Dec-2025; ISO-9001 expired' }
    },
    findings: ['Tax Clearance Certificate lapsed 3 months ago', 'ISO Quality Certificate validity expired'],
    flags: ['Expired Tax Clearance Certificate', 'Expired ISO 9001 Certificate'],
    audit: [
      { action: 'Expiry Detection Alert Raised', timestamp: 'Today, 08:45 AM', user: 'System (Demo Engine)' },
      { action: 'Package Submitted', timestamp: 'Today, 08:30 AM', user: 'Vendor Portal' }
    ]
  },
  {
    id: 'bidder-4',
    name: 'Shree Krishna Heavy Engineering',
    gst: '07AAACS9988G1ZQ',
    pan: 'AAACS9988G',
    udyam: 'UDYAM-DL-01-0044556',
    mca: 'U29100DL2015PTC284910',
    package: 'Tender #S26-104 (Valves & Piping)',
    demoType: 'Preloaded Demo: Name/Address Mismatch',
    typeDescription: 'Archetype 4: Name/Address Mismatch — PAN registered name differs from GST & Bank proof',
    score: 58,
    risk: 'High',
    status: 'Needs review',
    docs: 6,
    matrix: {
      gst: { status: 'PASS', label: 'GSTN Registration Check', evidence: 'Registered as "Shree Krishna Heavy Engineering Private Limited"' },
      pan: { status: 'REVIEW', label: 'Entity Name Mismatch', evidence: 'PAN records "SK Heavy Eng Works Sole Prop" (Entity mismatch)' },
      udyam: { status: 'PASS', label: 'Udyam MSME Registry', evidence: 'Registered unit in Delhi (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      mca: { status: 'REVIEW', label: 'ROC Address Discrepancy', evidence: 'Registered office address does not match GST state code' },
      documents: { status: 'REVIEW', label: 'Bank Name Mismatch', evidence: 'Bank account name differs from PAN entity title' }
    },
    findings: ['Legal Entity Name mismatch between PAN card and GST certificate', 'Bank passbook issued to alternate trade name'],
    flags: ['PAN entity name does not match GST registration', 'Bank proof title mismatch'],
    audit: [
      { action: 'Entity Mismatch Alert Triggered', timestamp: 'Yesterday, 04:15 PM', user: 'System (Demo Engine)' },
      { action: 'Package Submitted', timestamp: 'Yesterday, 04:00 PM', user: 'Vendor Portal' }
    ]
  },
  {
    id: 'bidder-5',
    name: 'Vertex Global Supplies Ltd.',
    gst: '06AAACV1298E1Z4',
    pan: 'AAACV1298E',
    udyam: 'UDYAM-HR-03-0077889',
    mca: 'U51909HR2021PLC092100',
    package: 'Tender #S26-104 (Valves & Piping)',
    demoType: 'Preloaded Demo: Multiple Issues',
    typeDescription: 'Archetype 5: Multiple Issues — CVC Debarred sister firm, expired EMD, invalid GSTIN status',
    score: 35,
    risk: 'High',
    status: 'Flagged',
    docs: 4,
    matrix: {
      gst: { status: 'FAIL', label: 'GSTN Suspended', evidence: 'GSTIN 06AAACV1298E1Z4 suspended due to non-filing of GSTR-3B (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      pan: { status: 'PASS', label: 'PAN Identity Check', evidence: 'PAN active (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      udyam: { status: 'REVIEW', label: 'Udyam Category Mismatch', evidence: 'Trading enterprise claiming manufacturing quota' },
      mca: { status: 'REVIEW', label: 'Director Disqualification', evidence: 'DIN 08491200 under scrutiny on MCA portal (MOCK GOVERNMENT CHECK — SIH DEMO)' },
      documents: { status: 'FAIL', label: 'Critical Non-Compliance', evidence: 'EMD Bank Guarantee expired; Listed in CVC negative watch records' }
    },
    findings: ['GSTIN suspended by tax authorities', 'EMD expired prior to bid submission date', 'Central Vigilance Commission (CVC) adverse watch match'],
    flags: ['GSTIN suspended for non-compliance', 'Expired EMD Guarantee', 'CVC Negative Watchmatch'],
    audit: [
      { action: 'Auto-Flagged (Severe Violations)', timestamp: 'Yesterday, 02:08 PM', user: 'System (Demo Engine)' },
      { action: 'Package Submitted', timestamp: 'Yesterday, 01:50 PM', user: 'Vendor Portal' }
    ]
  }
];

const biddersFile = path.join(dataDir, 'bidders.json');
function loadBidders() {
  if (!fs.existsSync(biddersFile)) {
    fs.writeFileSync(biddersFile, JSON.stringify(initialDemoBidders, null, 2));
    return initialDemoBidders;
  }
  try {
    return JSON.parse(fs.readFileSync(biddersFile, 'utf8'));
  } catch (err) {
    return initialDemoBidders;
  }
}

function saveBidders(list) {
  fs.writeFileSync(biddersFile, JSON.stringify(list, null, 2));
}

// Ensure demo data is primed
loadBidders();

// --- AUTHENTICATION: OFFICER CREDENTIALS ---
const DEMO_OFFICER_ID = process.env.OFFICER_ID || 'OFFICER2026';
const DEMO_OFFICER_PASS = process.env.OFFICER_PASSWORD || 'Senda@2026';

app.post('/api/officer/login', (req, res) => {
  const { officerId, password } = req.body;
  if (!officerId || !password) {
    return res.status(400).json({ success: false, error: 'Officer ID and Password are required.' });
  }

  if (officerId.trim() === DEMO_OFFICER_ID && password === DEMO_OFFICER_PASS) {
    return res.json({
      success: true,
      message: 'Authentication successful',
      officer: {
        id: DEMO_OFFICER_ID,
        name: 'Desk Officer (SIH 26100)',
        role: 'Procurement Officer',
        department: 'MoPNG / GeM Statutory Desk'
      },
      token: 'ST-OFFICER-SESSION-' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid officer credentials. Access denied.'
  });
});

const zlib = require('zlib');

// Robust PDF and file text extractor
function extractPdfStreamText(buffer) {
  let text = '';
  let str = buffer.toString('binary');
  let streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match;
  while ((match = streamRegex.exec(str)) !== null) {
    let streamBuf;
    try {
      streamBuf = Buffer.from(match[1], 'binary');
      streamBuf = zlib.inflateSync(streamBuf);
    } catch (e) {
      streamBuf = Buffer.from(match[1], 'binary');
    }
    const streamStr = streamBuf.toString('latin1');
    // Split by ET (End of Text block) to preserve natural line and block breaks
    const blocks = streamStr.split(/ET\b/);
    for (const b of blocks) {
      let blockText = '';
      const hexRegex = /<([0-9a-fA-F]+)>/g;
      let hMatch;
      while ((hMatch = hexRegex.exec(b)) !== null) {
        try {
          blockText += Buffer.from(hMatch[1], 'hex').toString('utf8');
        } catch (err) {}
      }
      const parenRegex = /\(([^)]+)\)/g;
      let pMatch;
      while ((pMatch = parenRegex.exec(b)) !== null) {
        blockText += ' ' + pMatch[1];
      }
      if (blockText.trim()) {
        text += blockText.trim() + '\n';
      }
    }
  }
  return text.trim();
}

// Helper: Inspect actual file content for realistic document verification
async function inspectDocumentContent(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  let extractedText = '';

  try {
    const dataBuffer = fs.readFileSync(file.path);
    if (dataBuffer.length < 50) {
      return {
        filename: file.originalname,
        sizeBytes: file.size,
        text: '',
        isBlankOrCorrupt: true,
        error: 'File size too small; blank or corrupted document'
      };
    }

    if (ext === '.pdf') {
      extractedText = extractPdfStreamText(dataBuffer);
      // Fallback: search raw ascii
      if (!extractedText || extractedText.length < 10) {
        const rawAscii = dataBuffer.toString('latin1').replace(/[^\x20-\x7E\r\n\t]/g, ' ');
        if (rawAscii.includes('GST') || rawAscii.includes('PAN') || rawAscii.includes('UDYAM') || rawAscii.includes('TENDER')) {
          extractedText = rawAscii;
        }
      }
    } else {
      extractedText = dataBuffer.toString('utf8', 0, Math.min(dataBuffer.length, 6000));
    }
  } catch (err) {
    return {
      filename: file.originalname,
      sizeBytes: file.size,
      text: '',
      isBlankOrCorrupt: true,
      error: 'Unreadable or invalid document format: ' + err.message
    };
  }

  const isBlank = (!extractedText || extractedText.trim().length < 15);
  return {
    filename: file.originalname,
    sizeBytes: file.size,
    text: extractedText.trim(),
    isBlankOrCorrupt: isBlank
  };
}

// Regex patterns for statutory numbers
const GST_REGEX = /\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b/;
const PAN_REGEX = /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/;
const UDYAM_REGEX = /\bUDYAM-[A-Z]{2}-[0-9]{2}-[0-9]{7}\b/i;
const MCA_CIN_REGEX = /\b[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}\b/;

// --- 1. GET /api/bidders ---
app.get('/api/bidders', (req, res) => {
  const bidders = loadBidders();
  res.json({
    success: true,
    total: bidders.length,
    bidders
  });
});

// --- 2. POST /api/extract (Deep Content OCR & Content-Only Parsing) ---
app.post('/api/extract', upload.array('documents'), async (req, res) => {
  const files = req.files || [];
  const results = [];

  for (const file of files) {
    const inspected = await inspectDocumentContent(file);
    const content = inspected.text.toUpperCase();

    let docType = 'Unclassified Document';
    let detectedRegistration = null;
    let isExpired = false;
    let confidence = 0.5;
    let status = 'REVIEW';
    let remarks = [];

    if (inspected.isBlankOrCorrupt) {
      status = 'FAIL';
      remarks.push('Document appears blank, unreadable, or corrupted.');
    } else {
      // Check Document Classification PURELY based on content (filename is NOT a signal)
      if (content.includes('GOODS AND SERVICES TAX') || content.includes('GSTIN') || GST_REGEX.test(content)) {
        docType = 'GST Registration Certificate';
        const match = content.match(GST_REGEX);
        if (match) {
          detectedRegistration = match[0];
          confidence = 0.95;
          const regGst = MOCK_REGISTRY.gst[detectedRegistration];
          if (regGst && regGst.status === 'ACTIVE') {
            status = 'PASS';
            remarks.push(`GSTIN: ${detectedRegistration} | Format: VALID | Mock GST Registry: ACTIVE (${regGst.legalName}) (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else if (regGst && regGst.status === 'SUSPENDED') {
            status = 'FAIL';
            remarks.push(`GSTIN: ${detectedRegistration} | Format: VALID | Mock GST Registry: SUSPENDED (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else {
            status = 'REVIEW';
            remarks.push(`GSTIN: ${detectedRegistration} | Format: VALID | Mock GST Registry: NOT FOUND in registry (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          }
        } else {
          status = 'FAIL';
          confidence = 0.4;
          remarks.push('Expected 15-character GSTIN structure missing in document text.');
        }
      } else if (content.includes('INCOME TAX DEPARTMENT') || content.includes('PERMANENT ACCOUNT NUMBER') || PAN_REGEX.test(content)) {
        docType = 'PAN Card';
        const match = content.match(PAN_REGEX);
        if (match) {
          detectedRegistration = match[0];
          confidence = 0.95;
          const regPan = MOCK_REGISTRY.pan[detectedRegistration];
          if (regPan) {
            status = 'PASS';
            remarks.push(`PAN: ${detectedRegistration} | Format: VALID | Mock PAN Registry: VALID (${regPan.category}) (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else {
            status = 'REVIEW';
            remarks.push(`PAN: ${detectedRegistration} | Format: VALID | Mock PAN Registry: NOT FOUND in registry (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          }
        } else {
          status = 'FAIL';
          confidence = 0.4;
          remarks.push('Valid 10-character alphanumeric PAN format not found.');
        }
      } else if (content.includes('UDYAM REGISTRATION') || content.includes('MINISTRY OF MICRO, SMALL') || UDYAM_REGEX.test(content)) {
        docType = 'Udyam Registration Certificate';
        const match = content.match(UDYAM_REGEX);
        if (match) {
          detectedRegistration = match[0].toUpperCase();
          confidence = 0.92;
          const regUdyam = MOCK_REGISTRY.udyam[detectedRegistration];
          if (regUdyam) {
            status = 'PASS';
            remarks.push(`Udyam: ${detectedRegistration} | Format: VALID | Mock Udyam Registry: ACTIVE (${regUdyam.classification}) (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else {
            status = 'REVIEW';
            remarks.push(`Udyam: ${detectedRegistration} | Format: VALID | Mock Udyam Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          }
        } else {
          status = 'REVIEW';
          confidence = 0.5;
          remarks.push('UDYAM-XX-XX-XXXXXXX standard registration ID not found.');
        }
      } else if (content.includes('MINISTRY OF CORPORATE AFFAIRS') || content.includes('CERTIFICATE OF INCORPORATION') || MCA_CIN_REGEX.test(content)) {
        docType = 'MCA Certificate of Incorporation';
        const match = content.match(MCA_CIN_REGEX);
        if (match) {
          detectedRegistration = match[0];
          confidence = 0.95;
          const regMca = MOCK_REGISTRY.mca[detectedRegistration];
          if (regMca && regMca.status === 'ACTIVE') {
            status = 'PASS';
            remarks.push(`MCA CIN: ${detectedRegistration} | Format: VALID | Mock MCA21 Registry: ACTIVE (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else if (regMca) {
            status = 'REVIEW';
            remarks.push(`MCA CIN: ${detectedRegistration} | Format: VALID | Mock MCA21 Registry: ${regMca.status} (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          } else {
            status = 'REVIEW';
            remarks.push(`MCA CIN: ${detectedRegistration} | Format: VALID | Mock MCA21 Registry: NOT FOUND (MOCK GOVERNMENT CHECK — SIH DEMO)`);
          }
        } else {
          status = 'REVIEW';
          remarks.push('21-character corporate CIN not detected.');
        }
      } else if (content.includes('NOTICE INVITING TENDER') || content.includes('NIT') || content.includes('RFP') || content.includes('TENDER DOCUMENT')) {
        docType = 'Tender / NIT / RFP';
        status = 'PASS';
        confidence = 0.9;
        remarks.push('Tender notice and scope specifications indexed from content.');
      } else if (content.includes('BILL OF QUANTITIES') || content.includes('BOQ SCHEDULE') || content.includes('SCHEDULE OF RATES')) {
        docType = 'Bill of Quantities (BOQ)';
        status = 'PASS';
        confidence = 0.9;
        remarks.push('BOQ schedules and pricing sheet recognized from content.');
      } else {
        docType = 'Supporting Document / Unknown';
        status = 'REVIEW';
        confidence = 0.3;
        remarks.push('Could not verify against standard statutory document templates (no recognized statutory content).');
      }

      // Check Expiry Date Keywords solely in document content (no filename inspection)
      if (content.includes('EXPIRED') || content.includes('VALIDITY LAPSED') || content.includes('EXPIRED ON')) {
        isExpired = true;
        status = 'FAIL';
        remarks.push('Certificate content explicitly indicates validity period has EXPIRED or lapsed.');
      }
    }

    results.push({
      filename: file.originalname,
      docType,
      sizeBytes: file.size,
      confidence,
      status,
      detectedRegistration,
      isExpired,
      remarks: remarks.join(' ')
    });
  }

  res.json({
    success: true,
    engine: 'SendaTender Document Verification Engine (Mock Government Check — SIH Demo)',
    totalDocuments: results.length,
    documents: results
  });
});

// --- 3. POST /api/process-bidder (HARDENED MULTI-STAGE VERIFICATION) ---
app.post('/api/process-bidder', upload.array('documents'), async (req, res) => {
  try {
    const uploadedFiles = req.files || [];
    const declaredName = (req.body.name || '').trim();
    const declaredGst = (req.body.gst || '').trim().toUpperCase();
    const declaredPan = (req.body.pan || '').trim().toUpperCase();
    const declaredUdyam = (req.body.udyam || '').trim().toUpperCase();
    const declaredAddress = (req.body.address || '').trim();
    const packageRef = req.body.package || 'Tender #S26-104 (Valves & Piping)';

    // Step 1: Inspect content of each uploaded file
    const inspectedDocs = [];
    for (const f of uploadedFiles) {
      const doc = await inspectDocumentContent(f);
      inspectedDocs.push(doc);
    }

    // Step 2: Content-only extraction across entire document package (NEVER USE FILENAME AS EVIDENCE)
    const allText = inspectedDocs.map(d => d.text).join('\n').toUpperCase();

    // Check blank/corrupt docs
    const hasBlankDoc = inspectedDocs.some(d => d.isBlankOrCorrupt);
    const allDocsBlank = inspectedDocs.length > 0 && inspectedDocs.every(d => d.isBlankOrCorrupt);

    // Check expiry solely from document text
    const hasExpiredDoc = inspectedDocs.some(d => {
      const t = d.text.toUpperCase();
      return t.includes('EXPIRED') || t.includes('VALIDITY LAPSED') || t.includes('EXPIRED ON');
    });

    // Check for explicit entity mismatch / fraud keywords in document text
    const hasExplicitMismatch = inspectedDocs.some(d => {
      const t = d.text.toUpperCase();
      return t.includes('WRONG NAME') || t.includes('FAKE COMPANY') || t.includes('DIFFERENT ENTITY') || t.includes('MISMATCHED COMPANY');
    });

    // Extract statutory identifiers strictly from text
    const extractedGstMatch = allText.match(GST_REGEX);
    const extractedPanMatch = allText.match(PAN_REGEX);
    const extractedUdyamMatch = allText.match(UDYAM_REGEX);
    const extractedMcaMatch = allText.match(MCA_CIN_REGEX);

    const extractedGst = extractedGstMatch ? extractedGstMatch[0] : null;
    const extractedPan = extractedPanMatch ? extractedPanMatch[0] : null;
    const extractedUdyam = extractedUdyamMatch ? extractedUdyamMatch[0].toUpperCase() : null;
    const extractedMca = extractedMcaMatch ? extractedMcaMatch[0] : null;

    // Check if the uploaded package has ANY statutory content or tender content
    const hasStatutoryContent = Boolean(
      extractedGst || extractedPan || extractedUdyam || extractedMca ||
      allText.includes('GOODS AND SERVICES TAX') ||
      allText.includes('INCOME TAX DEPARTMENT') ||
      allText.includes('UDYAM') ||
      allText.includes('MINISTRY OF CORPORATE AFFAIRS') ||
      allText.includes('NOTICE INVITING TENDER') ||
      allText.includes('BILL OF QUANTITIES')
    );

    // Resolve identifiers: prefer extracted from documents, fallback to declared if user entered them
    const effectiveGst = extractedGst || (declaredGst && GST_REGEX.test(declaredGst) ? declaredGst : null);
    const effectivePan = extractedPan || (declaredPan && PAN_REGEX.test(declaredPan) ? declaredPan : null);
    const effectiveUdyam = extractedUdyam || (declaredUdyam && UDYAM_REGEX.test(declaredUdyam) ? declaredUdyam : null);
    // MCA CIN must come from document extraction; never guess or default
    const effectiveMca = extractedMca || null;

    // Determine entity name to cross-match
    let targetProfileName = declaredName;
    if (!targetProfileName && effectiveGst && MOCK_REGISTRY.gst[effectiveGst]) {
      targetProfileName = MOCK_REGISTRY.gst[effectiveGst].legalName;
    }

    // Step 3: Run Multi-Stage Verification Pipeline with Mock Government Registry
    // FORMAT VALID ≠ VERIFIED (Extracted -> Format -> Cross-Match -> Mock Registry -> Final)
    const verification = verifyWithMockRegistry({
      gstNumber: effectiveGst,
      panNumber: effectivePan,
      udyamId: effectiveUdyam,
      mcaCin: effectiveMca,
      profileName: declaredName || ''
    });

    const findings = [];
    const flags = [];

    // Additional cross-document profile match check:
    // If user declared a profile name that differs from extracted document text or mock registry
    let nameMismatchDetected = hasExplicitMismatch;
    if (declaredName && effectiveGst && MOCK_REGISTRY.gst[effectiveGst]) {
      const regName = MOCK_REGISTRY.gst[effectiveGst].legalName.toLowerCase();
      const decName = declaredName.toLowerCase();
      // Check first two significant words
      const decWords = decName.split(/\s+/).filter(w => w.length > 2);
      const matchedWord = decWords.some(w => regName.includes(w));
      if (!matchedWord) {
        nameMismatchDetected = true;
        flags.push(`Declared entity name "${declaredName}" does not match registered GSTN title "${MOCK_REGISTRY.gst[effectiveGst].legalName}".`);
      }
    }

    // If declared GST differs from extracted GST
    if (declaredGst && extractedGst && declaredGst !== extractedGst) {
      flags.push(`Discrepancy: Declared GSTIN (${declaredGst}) does not match document-extracted GSTIN (${extractedGst}).`);
    }

    // Evaluate GST Checkpoint
    let gstStatus = verification.gst.finalStatus;
    let gstEvidence = verification.gst.evidence;
    if (allDocsBlank) {
      gstStatus = 'FAIL';
      gstEvidence = 'Uploaded document package is blank or unreadable.';
    } else if (hasExpiredDoc) {
      gstStatus = 'FAIL';
      gstEvidence = `Extracted: ${effectiveGst || 'N/A'} | Format: ${verification.gst.formatValid ? 'VALID' : 'INVALID'} | Mock GST Registry: LAPSED/EXPIRED (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: FAIL`;
      flags.push('GST or associated statutory certificate has lapsed/expired.');
    } else if (nameMismatchDetected && gstStatus === 'PASS') {
      gstStatus = 'REVIEW';
      gstEvidence = `Extracted: ${effectiveGst} | Format: VALID | Cross-match: ENTITY NAME MISMATCH | Mock GST Registry: ACTIVE | Final: REVIEW`;
    }

    // Evaluate PAN Checkpoint
    let panStatus = verification.pan.finalStatus;
    let panEvidence = verification.pan.evidence;
    if (allDocsBlank) {
      panStatus = 'FAIL';
      panEvidence = 'Uploaded document package is blank or unreadable.';
    } else if (nameMismatchDetected && panStatus === 'PASS') {
      panStatus = 'REVIEW';
      panEvidence = `Extracted: ${effectivePan} | Format: VALID | Cross-match: ENTITY MISMATCH | Mock PAN Registry: VALID | Final: REVIEW`;
    }

    // Evaluate Udyam Checkpoint
    let udyamStatus = verification.udyam.finalStatus;
    let udyamEvidence = verification.udyam.evidence;

    // Evaluate MCA Checkpoint (CRITICAL: MUST NEVER DEFAULT TO PASS!)
    let mcaStatus = verification.mca.finalStatus;
    let mcaEvidence = verification.mca.evidence;
    if (!effectiveMca) {
      mcaStatus = 'MISSING';
      mcaEvidence = 'Extracted: NONE | Format: MISSING | Mock MCA21 Registry: NO CIN EXTRACTED (MOCK GOVERNMENT CHECK — SIH DEMO) | Final: MISSING';
    }

    // Evaluate Mandatory Document Suite Checkpoint
    let docsStatus = 'PASS';
    let docsEvidence = 'Document package passed content checks with statutory references.';
    if (allDocsBlank || (uploadedFiles.length > 0 && hasBlankDoc && !hasStatutoryContent)) {
      docsStatus = 'FAIL';
      docsEvidence = 'One or more uploaded documents were detected as completely blank, corrupted, or unreadable.';
      flags.push('Blank or unreadable document detected in upload package');
    } else if (!hasStatutoryContent) {
      docsStatus = 'FAIL';
      docsEvidence = 'Document package contains no identifiable statutory registrations, PAN, GSTIN, or tender references.';
      flags.push('No statutory or procurement information found in uploaded documents');
    } else if (hasExpiredDoc) {
      docsStatus = 'FAIL';
      docsEvidence = 'Document inspection detected expired statutory certificate or lapsed validity date.';
      flags.push('Statutory certificate expired prior to tender submission');
    } else if (nameMismatchDetected) {
      docsStatus = 'REVIEW';
      docsEvidence = 'Document contents reveal entity name / address discrepancy against bidder profile.';
      flags.push('Entity name or cross-document data mismatch detected');
    } else if (!effectiveGst && !effectivePan) {
      docsStatus = 'MISSING';
      docsEvidence = 'Core statutory documents (GSTIN and PAN) missing from package.';
      flags.push('Mandatory GSTIN and PAN certificates missing');
    }

    // Record verification flags
    if (verification.gst.registryResult === 'NOT_FOUND_IN_REGISTRY') {
      flags.push(`GSTIN "${effectiveGst}" is syntactically valid but NOT FOUND in Mock GST Registry.`);
    }
    if (verification.gst.registryResult === 'SUSPENDED_BY_TAX_AUTHORITY') {
      flags.push(`GSTIN "${effectiveGst}" is SUSPENDED by tax authorities (non-compliance).`);
    }
    if (verification.pan.registryResult === 'NOT_FOUND_IN_REGISTRY') {
      flags.push(`PAN "${effectivePan}" is syntactically valid but NOT FOUND in Mock PAN Registry.`);
    }
    if (verification.pan.crossMatch === 'PAN_GST_MISMATCH') {
      flags.push(`PAN "${effectivePan}" does not match the PAN characters in GSTIN "${effectiveGst}".`);
    }

    // Calculate Dynamic Compliance Score based on REAL MULTI-STAGE RESULTS
    let score = 0;
    const checkpointStatuses = [gstStatus, panStatus, udyamStatus, mcaStatus, docsStatus];
    checkpointStatuses.forEach(st => {
      if (st === 'PASS') score += 20;
      else if (st === 'REVIEW') score += 8;
      else if (st === 'MISSING') score += 0;
      else if (st === 'FAIL') score -= 5;
    });

    if (allDocsBlank || !hasStatutoryContent) {
      score = Math.min(score, 20);
    } else if (hasExpiredDoc || verification.gst.registryResult === 'SUSPENDED_BY_TAX_AUTHORITY') {
      score = Math.min(score, 38);
    } else if (nameMismatchDetected || verification.gst.registryResult === 'NOT_FOUND_IN_REGISTRY') {
      score = Math.min(score, 58);
    }

    score = Math.max(10, Math.min(98, score));
    const risk = score >= 80 ? 'Low' : score >= 55 ? 'Medium' : 'High';
    const status = (allDocsBlank || !hasStatutoryContent || hasExpiredDoc || score < 50) 
      ? 'Flagged' 
      : score >= 80 
        ? 'Ready for review' 
        : 'Needs review';

    const matrix = {
      gst: { status: gstStatus, label: 'GSTN Registration Check', evidence: gstEvidence },
      pan: { status: panStatus, label: 'PAN Identity Check', evidence: panEvidence },
      udyam: { status: udyamStatus, label: 'Udyam MSME Registry', evidence: udyamEvidence },
      mca: { status: mcaStatus, label: 'MCA21 Company Status', evidence: mcaEvidence },
      documents: { status: docsStatus, label: 'Statutory Document Suite', evidence: docsEvidence }
    };

    if (flags.length === 0) {
      findings.push('All submitted documents passed multi-stage mock verification with zero discrepancies.');
    } else {
      flags.forEach(f => findings.push(f));
    }

    // Resolve Bidder Legal Name without relying on uploaded filename
    let bidderName = declaredName;
    if (!bidderName) {
      if (effectiveGst && MOCK_REGISTRY.gst[effectiveGst]) {
        bidderName = MOCK_REGISTRY.gst[effectiveGst].legalName;
      } else if (effectiveGst) {
        bidderName = `Vendor (${effectiveGst})`;
      } else {
        bidderName = `Vendor Submission (${uploadedFiles.length} doc${uploadedFiles.length !== 1 ? 's' : ''})`;
      }
    }

    const newBidder = {
      id: `bidder-user-${Date.now()}`,
      name: bidderName,
      declaredAddress: declaredAddress || 'Not Provided',
      gst: effectiveGst || 'Not Extracted / Missing',
      pan: effectivePan || 'Not Extracted / Missing',
      udyam: effectiveUdyam || 'Not Extracted / Missing',
      mca: effectiveMca || 'Not Extracted / Missing',
      package: packageRef,
      demoType: 'Live Uploaded Verification',
      typeDescription: 'Processed from actual uploaded user documents (Multi-Stage Mock Registry Check)',
      score,
      risk,
      status,
      docs: uploadedFiles.length || 1,
      matrix,
      findings,
      flags,
      audit: [
        { action: 'Multi-Stage Document Verification Completed', timestamp: 'Just now', user: 'System (Multi-Stage Mock Engine)' },
        { action: 'Package Uploaded by Vendor', timestamp: 'Just now', user: 'Vendor Portal' }
      ]
    };

    const bidders = loadBidders();
    // Prepend user upload without deleting preloaded demo bidders
    bidders.unshift(newBidder);
    saveBidders(bidders);

    res.json({
      success: true,
      bidder: newBidder,
      analysis: {
        totalFiles: uploadedFiles.length,
        hasBlankDoc,
        hasExpiredDoc,
        hasStatutoryContent,
        nameMismatchDetected,
        effectiveGst,
        effectivePan,
        effectiveUdyam,
        effectiveMca
      }
    });
  } catch (err) {
    console.error('Error processing bidder upload:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- 4. POST /api/decision ---
app.post('/api/decision', (req, res) => {
  const { id, decision, officerRemarks = '', officerName = 'Desk Officer (SIH 26100)' } = req.body;
  const bidders = loadBidders();
  const bidder = bidders.find(b => b.id === id);

  if (!bidder) {
    return res.status(404).json({ success: false, error: `Bidder with ID ${id} not found` });
  }

  bidder.status = decision;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  bidder.audit.unshift({
    action: `Decision Recorded: ${decision}`,
    remarks: officerRemarks || `Officer marked status as ${decision}`,
    timestamp,
    user: officerName
  });

  if (decision === 'Flagged' && !bidder.flags.length) {
    bidder.flags.push('Officer flagged package for detailed manual scrutiny');
  }

  saveBidders(bidders);

  res.json({
    success: true,
    message: `Decision successfully updated to ${decision}`,
    bidder
  });
});

// --- 5. GET /api/report/:id ---
app.get('/api/report/:id', (req, res) => {
  const { id } = req.params;
  const bidders = loadBidders();
  const bidder = bidders.find(b => b.id === id) || bidders[0];

  try {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="SendaTender-Report-${bidder.id}.pdf"`);

    doc.pipe(res);

    // DEMO / MOCK WATERMARK / BANNER
    doc.rect(40, 40, 515, 24).fill('#E2E8F0');
    doc.fillColor('#334155').fontSize(9).font('Helvetica-Bold')
      .text('OFFICIAL PROTOTYPE DEMO REPORT · SIH 2026 PS-26100 · MOCK GOVERNMENT CHECK — SIH DEMO', 45, 48, { align: 'center', width: 505 });

    // HEADER
    doc.moveDown(1.5);
    doc.fillColor('#0F172A').fontSize(18).font('Helvetica-Bold').text('SendaTender — Bid Compliance & Audit Dossier');
    doc.fillColor('#64748B').fontSize(10).font('Helvetica').text('Ministry of Petroleum & Natural Gas | GeM Statutory Verification Platform');
    doc.moveDown(0.8);

    // DIVIDER
    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);

    // BIDDER & TENDER METADATA
    doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Tender & Bidder Identification');
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    doc.fillColor('#334155');
    doc.text(`Tender Package: ${bidder.package}`);
    doc.text(`Bidder Legal Name: ${bidder.name}`);
    doc.text(`Verification Type: ${bidder.demoType} (${bidder.typeDescription || ''})`);
    doc.text(`GSTIN: ${bidder.gst}  |  PAN: ${bidder.pan || 'N/A'}`);
    doc.text(`Udyam ID: ${bidder.udyam || 'N/A'}  |  MCA CIN: ${bidder.mca || 'N/A'}`);
    doc.text(`Current Status: ${bidder.status.toUpperCase()}  |  Compliance Score: ${bidder.score}%  |  Assessed Risk: ${bidder.risk.toUpperCase()}`);
    doc.moveDown(0.8);

    // COMPLIANCE MATRIX TABLE
    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);
    doc.fillColor('#0F172A').fontSize(12).font('Helvetica-Bold').text('Statutory & Tender Compliance Matrix');
    doc.moveDown(0.4);

    // Table Header
    const tableTop = doc.y;
    doc.rect(40, tableTop, 515, 20).fill('#0F172A');
    doc.fillColor('#FFFFFF').fontSize(9).font('Helvetica-Bold');
    doc.text('CHECKPOINT', 45, tableTop + 5, { width: 120 });
    doc.text('RESULT', 170, tableTop + 5, { width: 80 });
    doc.text('STATUTORY EVIDENCE & FINDINGS', 260, tableTop + 5, { width: 290 });

    let currentY = tableTop + 20;
    const matrixEntries = Object.entries(bidder.matrix || {});

    matrixEntries.forEach(([key, val], index) => {
      const rowBg = index % 2 === 0 ? '#F8FAFC' : '#FFFFFF';
      doc.rect(40, currentY, 515, 22).fill(rowBg);

      doc.fillColor('#0F172A').fontSize(9).font('Helvetica-Bold');
      doc.text(val.label || key.toUpperCase(), 45, currentY + 6, { width: 120 });

      // Badge color based on PASS/FAIL/REVIEW/MISSING
      const statusColor = val.status === 'PASS' ? '#059669' : val.status === 'FAIL' ? '#DC2626' : '#D97706';
      doc.fillColor(statusColor).font('Helvetica-Bold');
      doc.text(`[ ${val.status} ]`, 170, currentY + 6, { width: 80 });

      doc.fillColor('#475569').font('Helvetica');
      doc.text(val.evidence || 'Verified via API Setu (MOCK GOVERNMENT CHECK — SIH DEMO)', 260, currentY + 6, { width: 290 });

      currentY += 22;
    });

    doc.y = currentY + 10;

    // FINDINGS & DISCREPANCIES
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('System Discrepancy & Verification Findings:');
    doc.moveDown(0.3);
    doc.fontSize(9).font('Helvetica').fillColor('#334155');
    if (bidder.findings && bidder.findings.length) {
      bidder.findings.forEach(f => doc.text(`• ${f}`));
    } else {
      doc.text('• No adverse findings or discrepancy flags recorded for this bidder.');
    }
    doc.moveDown(0.8);

    // AUDIT TRAIL
    doc.strokeColor('#CBD5E1').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
    doc.moveDown(0.8);
    doc.fillColor('#0F172A').fontSize(11).font('Helvetica-Bold').text('Officer Decision & Hash-Chained Audit Trail:');
    doc.moveDown(0.3);
    doc.fontSize(8.5).font('Helvetica').fillColor('#475569');

    (bidder.audit || []).forEach(item => {
      const user = item.user || 'System';
      const action = item.action || 'Logged';
      const time = item.timestamp || '';
      const rem = item.remarks ? ` — Remarks: "${item.remarks}"` : '';
      doc.text(`• [${time}] ${action} by ${user}${rem}`);
    });

    doc.moveDown(1.5);
    // FOOTER
    doc.rect(40, 750, 515, 40).fill('#F1F5F9');
    doc.fillColor('#64748B').fontSize(8).font('Helvetica')
      .text('Generated by SendaTender Statutory Engine · Verification Hash: SHA256-DEMO-26100-ST-AUDIT-VERIFIED', 45, 758, { align: 'center', width: 505 })
      .text('CONFIDENTIAL & FOR PROCUREMENT OFFICER REVIEW ONLY · MOCK GOVERNMENT CHECK — SIH DEMO', 45, 770, { align: 'center', width: 505 });

    doc.end();
  } catch (err) {
    console.error('PDF Generation Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset demo data endpoint
app.post('/api/reset-demo', (req, res) => {
  saveBidders(initialDemoBidders);
  res.json({ success: true, message: 'Demo bidders restored to 5 standard archetypes', bidders: initialDemoBidders });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(` SendaTender Express Server listening on http://localhost:${PORT}`);
  console.log(` Mode: Autonomous Inspection Engine (Mock Government APIs - SIH Demo)`);
  console.log(` Officer Auth: ID=${DEMO_OFFICER_ID} Password=${DEMO_OFFICER_PASS}`);
  console.log(`=======================================================`);
});
