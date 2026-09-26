const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const scratchDir = path.join(__dirname, 'test_pdfs');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

function createPdf(filename, textLines) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(scratchDir, filename);
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);
    textLines.forEach(line => {
      doc.fontSize(12).text(line);
      doc.moveDown(0.5);
    });
    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

async function run() {
  console.log('Generating test PDF files...');

  // A. Random blank PDF
  const pdfA = await createPdf('blank_doc.pdf', []);

  // B. Random PDF with no statutory info
  const pdfB = await createPdf('random_prose.pdf', [
    'Annual Corporate Wellness and Office Supplies Overview',
    'This document outlines ergonomic chairs, sit-stand desks, coffee machines, and seasonal stationery.',
    'There is no tax, statutory, registration, or procurement number in this memorandum.'
  ]);

  // C. Fake PDF with formatted but unknown GSTIN
  const pdfC = await createPdf('fake_gst_unknown.pdf', [
    'GOODS AND SERVICES TAX REGISTRATION CERTIFICATE',
    'Legal Name: Alpha Omega Synthetics Pvt Ltd',
    'GSTIN: 27ABCDE1234F1Z5',
    'State: Maharashtra'
  ]);

  // D. Fake PDF with formatted but unknown PAN
  const pdfD = await createPdf('fake_pan_unknown.pdf', [
    'INCOME TAX DEPARTMENT - GOVT OF INDIA',
    'PERMANENT ACCOUNT NUMBER CARD',
    'PAN: ABCDE1234F',
    'Name: Sigma Delta Global Enterprises'
  ]);

  // E. Known GSTIN but wrong company name
  const pdfE = await createPdf('known_gst_wrong_name.pdf', [
    'GOODS AND SERVICES TAX CERTIFICATE',
    'Legal Name: Completely Wrong Company Name Ltd',
    'GSTIN: 27AAQCA1234F1ZP',
    'State: Maharashtra'
  ]);

  // F. Document with expired certificate
  const pdfF = await createPdf('expired_cert.pdf', [
    'TAX CLEARANCE AND BID COMPLIANCE CERTIFICATE',
    'Legal Name: Kaveri Steel & Forgings Ltd.',
    'GSTIN: 33AABCK8899P1ZM',
    'NOTICE: THIS CERTIFICATE HAS EXPIRED ON 31-DEC-2025. VALIDITY LAPSED.'
  ]);

  // G. Valid demo document with known mock registry identifiers
  const pdfG = await createPdf('valid_demo_full.pdf', [
    'NOTICE INVITING TENDER - BID SUBMISSION DOSSIER',
    'Legal Name: Aarav Industrial Solutions Pvt. Ltd.',
    'GSTIN: 27AAQCA1234F1ZP',
    'PAN: AAQCA1234F',
    'Udyam Registration: UDYAM-MH-01-0012345',
    'Ministry of Corporate Affairs CIN: U28100MH2018PTC310234',
    'Tender Reference: Tender #S26-104 (Valves & Piping)',
    'Status: Active and fully compliant with statutory norms.'
  ]);

  // H. Package with GST and PAN but NO MCA/CIN
  const pdfH = await createPdf('no_mca_doc.pdf', [
    'VENDOR SUBMISSION',
    'Legal Name: Aarav Industrial Solutions Pvt. Ltd.',
    'GSTIN: 27AAQCA1234F1ZP',
    'PAN: AAQCA1234F'
  ]);

  // I. Fake document renamed to valid_gst.pdf
  const pdfI = await createPdf('valid_gst.pdf', [
    'GOODS AND SERVICES TAX REGISTRATION CERTIFICATE',
    'Legal Name: Fake Disguised Entity',
    'GSTIN: 27ABCDE1234F1Z5'
  ]);

  // J. Invalid expired document renamed to valid.pdf
  const pdfJ = await createPdf('valid.pdf', [
    'CERTIFICATE OF STATUTORY CLEARANCE',
    'GSTIN: 27AAQCA1234F1ZP',
    'EXPIRED ON 15-JAN-2026. VALIDITY LAPSED.'
  ]);

  console.log('Test PDFs successfully created.');

  // Helper to send multipart POST request
  async function testUpload(filePath, customFields = {}) {
    const fileBuf = fs.readFileSync(filePath);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const filename = path.basename(filePath);

    let postData = '';
    for (const [k, v] of Object.entries(customFields)) {
      postData += `--${boundary}\r\n`;
      postData += `Content-Disposition: form-data; name="${k}"\r\n\r\n`;
      postData += `${v}\r\n`;
    }

    postData += `--${boundary}\r\n`;
    postData += `Content-Disposition: form-data; name="documents"; filename="${filename}"\r\n`;
    postData += `Content-Type: application/pdf\r\n\r\n`;

    const headBuf = Buffer.from(postData, 'utf8');
    const tailBuf = Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8');
    const fullBody = Buffer.concat([headBuf, fileBuf, tailBuf]);

    const res = await fetch('http://localhost:3000/api/process-bidder', {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': fullBody.length
      },
      body: fullBody
    });

    return await res.json();
  }

  console.log('\n=======================================================');
  console.log('  RUNNING TESTS A TO J ON HARDENED SENDA TENDER ENGINE');
  console.log('=======================================================\n');

  const results = {};

  // Test A
  try {
    const resA = await testUpload(pdfA);
    const pass = resA.bidder.matrix.documents.status === 'FAIL' || resA.bidder.status === 'Flagged';
    results['A'] = {
      test: 'A. Random blank PDF',
      expected: 'FAIL / Flagged',
      actual: `Doc Suite: ${resA.bidder.matrix.documents.status}, Overall: ${resA.bidder.status} (${resA.bidder.score}%)`,
      passed: pass
    };
  } catch (e) {
    results['A'] = { test: 'A. Random blank PDF', passed: false, error: e.message };
  }

  // Test B
  try {
    const resB = await testUpload(pdfB);
    const pass = resB.bidder.matrix.documents.status === 'FAIL' || resB.bidder.status === 'Flagged';
    results['B'] = {
      test: 'B. Random PDF with no statutory information',
      expected: 'FAIL / Flagged (No statutory info)',
      actual: `Doc Suite: ${resB.bidder.matrix.documents.status}, GST: ${resB.bidder.matrix.gst.status}, Overall: ${resB.bidder.status}`,
      passed: pass
    };
  } catch (e) {
    results['B'] = { test: 'B. Random PDF with no statutory information', passed: false, error: e.message };
  }

  // Test C
  try {
    const resC = await testUpload(pdfC);
    // Fake GST: valid format, but unknown in mock registry -> must NOT PASS
    const pass = resC.bidder.matrix.gst.status !== 'PASS';
    results['C'] = {
      test: 'C. Fake PDF containing correctly formatted but unknown GSTIN',
      expected: 'NOT PASS (REVIEW / NOT FOUND)',
      actual: `GST Status: ${resC.bidder.matrix.gst.status}, Evidence: ${resC.bidder.matrix.gst.evidence}`,
      passed: pass
    };
  } catch (e) {
    results['C'] = { test: 'C. Fake PDF containing correctly formatted but unknown GSTIN', passed: false, error: e.message };
  }

  // Test D
  try {
    const resD = await testUpload(pdfD);
    // Fake PAN: valid format, but unknown in mock registry -> must NOT PASS
    const pass = resD.bidder.matrix.pan.status !== 'PASS';
    results['D'] = {
      test: 'D. Fake PDF containing correctly formatted but unknown PAN',
      expected: 'NOT PASS (REVIEW / NOT FOUND)',
      actual: `PAN Status: ${resD.bidder.matrix.pan.status}, Evidence: ${resD.bidder.matrix.pan.evidence}`,
      passed: pass
    };
  } catch (e) {
    results['D'] = { test: 'D. Fake PDF containing correctly formatted but unknown PAN', passed: false, error: e.message };
  }

  // Test E
  try {
    const resE = await testUpload(pdfE, { name: 'Completely Wrong Company Name Ltd' });
    // Known GSTIN but wrong company name -> REVIEW or FAIL
    const pass = resE.bidder.matrix.gst.status !== 'PASS' || resE.bidder.matrix.documents.status === 'REVIEW' || resE.bidder.flags.some(f => f.toLowerCase().includes('match'));
    results['E'] = {
      test: 'E. Document containing known GSTIN but wrong company name',
      expected: 'REVIEW / FAIL (Mismatch detected)',
      actual: `GST Status: ${resE.bidder.matrix.gst.status}, Flags: ${JSON.stringify(resE.bidder.flags)}`,
      passed: pass
    };
  } catch (e) {
    results['E'] = { test: 'E. Document containing known GSTIN but wrong company name', passed: false, error: e.message };
  }

  // Test F
  try {
    const resF = await testUpload(pdfF);
    // Expired certificate -> FAIL
    const pass = resF.bidder.matrix.documents.status === 'FAIL' || resF.bidder.matrix.gst.status === 'FAIL';
    results['F'] = {
      test: 'F. Document with expired certificate',
      expected: 'FAIL / Flagged',
      actual: `Doc Suite: ${resF.bidder.matrix.documents.status}, GST: ${resF.bidder.matrix.gst.status}, Overall: ${resF.bidder.status}`,
      passed: pass
    };
  } catch (e) {
    results['F'] = { test: 'F. Document with expired certificate', passed: false, error: e.message };
  }

  // Test G
  try {
    const resG = await testUpload(pdfG, { name: 'Aarav Industrial Solutions Pvt. Ltd.' });
    // Valid demo document with known mock registry identifiers -> PASS
    const pass = resG.bidder.matrix.gst.status === 'PASS' && resG.bidder.matrix.pan.status === 'PASS' && resG.bidder.status === 'Ready for review';
    results['G'] = {
      test: 'G. Valid demo document with known mock registry identifiers',
      expected: 'PASS (Score >= 80, Ready for review)',
      actual: `GST: ${resG.bidder.matrix.gst.status}, PAN: ${resG.bidder.matrix.pan.status}, Score: ${resG.bidder.score}%, Status: ${resG.bidder.status}`,
      passed: pass
    };
  } catch (e) {
    results['G'] = { test: 'G. Valid demo document with known mock registry identifiers', passed: false, error: e.message };
  }

  // Test H
  try {
    const resH = await testUpload(pdfH);
    // No CIN/MCA evidence -> NOT PASS (MISSING or REVIEW)
    const pass = resH.bidder.matrix.mca.status !== 'PASS';
    results['H'] = {
      test: 'H. No CIN/MCA evidence',
      expected: 'NOT PASS (MISSING / REVIEW)',
      actual: `MCA Status: ${resH.bidder.matrix.mca.status}, Evidence: ${resH.bidder.matrix.mca.evidence}`,
      passed: pass
    };
  } catch (e) {
    results['H'] = { test: 'H. No CIN/MCA evidence', passed: false, error: e.message };
  }

  // Test I
  try {
    const resI = await testUpload(pdfI);
    // Fake doc renamed to valid_gst.pdf -> MUST REMAIN BASED ON CONTENT, NOT FILENAME
    const pass = resI.bidder.matrix.gst.status !== 'PASS';
    results['I'] = {
      test: 'I. Rename fake document from random.pdf to valid_gst.pdf',
      expected: 'NOT PASS (Content evaluated: fake GSTIN unknown in mock registry)',
      actual: `Filename: valid_gst.pdf -> GST Status: ${resI.bidder.matrix.gst.status}, Evidence: ${resI.bidder.matrix.gst.evidence}`,
      passed: pass
    };
  } catch (e) {
    results['I'] = { test: 'I. Rename fake document from random.pdf to valid_gst.pdf', passed: false, error: e.message };
  }

  // Test J
  try {
    const resJ = await testUpload(pdfJ);
    // Invalid expired doc renamed to valid.pdf -> MUST REMAIN INVALID
    const pass = resJ.bidder.matrix.documents.status === 'FAIL' || resJ.bidder.matrix.gst.status === 'FAIL';
    results['J'] = {
      test: 'J. Rename an invalid document to valid.pdf',
      expected: 'FAIL (Content evaluated: expired text detected)',
      actual: `Filename: valid.pdf -> Doc Suite: ${resJ.bidder.matrix.documents.status}, GST: ${resJ.bidder.matrix.gst.status}`,
      passed: pass
    };
  } catch (e) {
    results['J'] = { test: 'J. Rename an invalid document to valid.pdf', passed: false, error: e.message };
  }

  console.log(JSON.stringify(results, null, 2));

  let allPass = true;
  for (const [k, r] of Object.entries(results)) {
    if (!r.passed) allPass = false;
    console.log(`[${r.passed ? 'PASS' : 'FAIL'}] Test ${k}: ${r.test} -> Actual: ${r.actual}`);
  }

  console.log(`\nOVERALL TEST SUITE RESULT: ${allPass ? 'ALL 10 TESTS PASSED (10/10)' : 'SOME TESTS FAILED'}`);
}

run().catch(console.error);
