/**
 * Command Center & Verification Matrix Integration Test
 * Verifies Part 1 & Part 2 requirements for SIH PS 26100.
 */
const http = require('http');

function get(path, headers = {}) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, { headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    }).on('error', reject);
  });
}

function post(path, body = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request('http://localhost:3000' + path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('COMMAND CENTER & VERIFICATION MATRIX AUTOMATED TEST');
  console.log('========================================================\n');

  // 1. Reset demo state
  const resetRes = await post('/api/reset-demo');
  if (resetRes.status !== 200) throw new Error('Failed to reset demo state');
  console.log('[PASS] 1. Demo state restored to canonical baseline');

  // 2. Fetch all bidders
  const biddersRes = await get('/api/bidders');
  const bidders = biddersRes.body.bidders;
  if (!Array.isArray(bidders) || bidders.length !== 5) throw new Error('Expected 5 bidders');
  console.log(`[PASS] 2. Bidders loaded: count = ${bidders.length}`);

  // 3. Verify Operational metrics matching Progress Engine
  // Aarav -> READY
  // NexGen, Kaveri, Vertex -> NOT READY
  // Krishna -> REQUIRES REVIEW
  const progressEngine = require('../backend/progressEngine.js');
  let readyCount = 0, reviewCount = 0, notReadyCount = 0;
  let totalDocs = 0;

  bidders.forEach(b => {
    const p = progressEngine.buildProgressState({ bidder: b });
    totalDocs += (b.docs || 0);
    if (p.submissionReadiness.status === 'READY') readyCount++;
    else if (p.submissionReadiness.status === 'REQUIRES REVIEW') reviewCount++;
    else notReadyCount++;
  });

  if (readyCount !== 1) throw new Error(`Expected readyCount=1, got ${readyCount}`);
  if (reviewCount !== 1) throw new Error(`Expected reviewCount=1, got ${reviewCount}`);
  if (notReadyCount !== 3) throw new Error(`Expected notReadyCount=3, got ${notReadyCount}`);
  if (totalDocs !== 30) throw new Error(`Expected totalDocs=30, got ${totalDocs}`);

  console.log(`[PASS] 3. Command Center Metrics verified: Ready=${readyCount}, Review=${reviewCount}, NotReady=${notReadyCount}, Docs=${totalDocs}`);

  // 4. Verify Canonical 8 Statutory Requirements in Progress Engine
  const reqs = progressEngine.STATUTORY_REQUIREMENTS;
  if (!Array.isArray(reqs) || reqs.length !== 8) throw new Error('Expected 8 statutory requirements');
  const expectedCodes = ['GST', 'PAN', 'UDYAM', 'MCA', 'ITR', 'BALANCE_SHEET', 'EMD', 'NIT_BOQ'];
  expectedCodes.forEach(code => {
    const found = reqs.find(r => r.code === code);
    if (!found) throw new Error(`Missing requirement code: ${code}`);
  });
  console.log('[PASS] 4. Canonical 8 Statutory Requirements defined and mapped');

  // 5. Test Shree Krishna Industries (bidder-4) Demo Archetype Review state
  const krishna = bidders.find(b => b.id === 'bidder-4');
  if (!krishna) throw new Error('Bidder 4 not found');
  const kp = progressEngine.buildProgressState({ bidder: krishna });
  if (kp.submissionReadiness.status !== 'REQUIRES REVIEW') throw new Error('Krishna must be REQUIRES REVIEW');
  console.log('[PASS] 5. Demo scenario: Bidder-4 (Krishna) has status REQUIRES REVIEW with genuine mismatch');

  // 6. Test Officer Resolution of Bidder-4 finding
  const loginRes = await post('/api/officer/login', { officerId: 'OFFICER2026', password: 'Senda@2026' });
  const token = loginRes.body.token;
  if (!token) throw new Error('Officer login failed');

  const resolveRes = await post('/api/officer/resolve-finding', {
    id: 'bidder-4',
    findingIndex: 0,
    remarks: 'Discrepancy resolved in test: Entity trade certificate verified',
    officerName: 'Desk Officer (Test)'
  }, { 'x-officer-token': token });

  if (resolveRes.status !== 200 || !resolveRes.body.success) throw new Error('Finding resolution failed');
  console.log('[PASS] 6. Officer resolution successfully recorded in audit chain for Bidder-4');

  // 7. Verify updated audit chain integrity
  const auditRes = await get('/api/officer/audit-trail?bidderId=bidder-4', { 'x-officer-token': token });
  if (auditRes.status !== 200 || !auditRes.body.integrity.verified) throw new Error('Audit integrity verification failed');
  console.log('[PASS] 7. Audit trail integrity verified: SHA-256 chain intact');

  // 8. Reset demo at end of test to keep clean state
  await post('/api/reset-demo');
  console.log('[PASS] 8. Clean state restored');

  console.log('\n========================================================');
  console.log('ALL COMMAND CENTER & MATRIX INTEGRATION TESTS PASSED!');
  console.log('========================================================');
}

runTests().catch(err => {
  console.error('Test Failed:', err);
  process.exit(1);
});
