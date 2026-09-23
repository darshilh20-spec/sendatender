// mockGovChecks.js – deterministic mock government verification
// Provides mock results for GST, PAN, Udyam, MCA based on input fields.

function mockGovCheck(bidder) {
  // GST check – fail if GST number is marked EXPIRED or INVALID
  const gstStatus = bidder.gstNumber === 'EXPIRED'
    ? '❌ FAIL (DEMO / EXPIRED)'
    : bidder.gstNumber === 'INVALID'
    ? '⚠️ REVIEW (DEMO / INVALID)'
    : '✅ PASS (DEMO)';

  // PAN check – assume always present; if missing, flag MISSING
  const panStatus = bidder.panNumber ? '✅ PASS (DEMO)' : '📄 MISSING (DEMO)';

  // Udyam check – similar logic
  const udyamStatus = bidder.udyamId ? '✅ PASS (DEMO)' : '📄 MISSING (DEMO)';

  // MCA check – similar logic
  const mcaStatus = bidder.mcaCin ? '✅ PASS (DEMO)' : '📄 MISSING (DEMO)';

  return {
    gst: gstStatus,
    pan: panStatus,
    udyam: udyamStatus,
    mca: mcaStatus,
  };
}

module.exports = { mockGovCheck };
