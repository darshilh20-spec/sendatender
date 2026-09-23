// mockGemini.js – deterministic mock extraction based on filename patterns
// This module simulates Gemini document extraction for the demo.
// It inspects the filename (lower‑cased) for keywords and returns a structured
// object containing vendor information and a set of documents.

const path = require('path');

function extract(filePath) {
  const fileName = path.basename(filePath).toLowerCase();
  let type = 'unknown';
  if (fileName.includes('compliant')) type = 'compliant';
  else if (fileName.includes('missing')) type = 'missing';
  else if (fileName.includes('expired')) type = 'expired';
  else if (fileName.includes('mismatch')) type = 'mismatch';
  else if (fileName.includes('multiple')) type = 'multiple';

  // base vendor data – same for all demo bidders
  const base = {
    vendorName: 'Acme Corp',
    gstNumber: '27AAECS1234F1Z5',
    panNumber: 'AAECS1234F',
    udyamId: 'U123456789012',
    mcaCin: 'U12345MH2020PTC123456',
    documents: { tender: true, technical: true, financial: true, taxClearance: true },
  };

  switch (type) {
    case 'compliant':
      return { ...base, status: 'compliant' };
    case 'missing':
      return { ...base, documents: { ...base.documents, taxClearance: false }, status: 'missing' };
    case 'expired':
      return { ...base, gstNumber: 'EXPIRED', status: 'expired' };
    case 'mismatch':
      return { ...base, vendorName: 'Wrong Name', status: 'mismatch' };
    case 'multiple':
      return { ...base, documents: { ...base.documents, financial: false }, gstNumber: 'INVALID', status: 'multipleIssues' };
    default:
      return { ...base, status: 'unknown' };
  }
}

module.exports = { extract };
