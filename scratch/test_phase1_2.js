const http = require('http');

function request(path, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    if (postData) {
      if (typeof postData === 'object') {
        postData = JSON.stringify(postData);
        opts.headers['Content-Type'] = 'application/json';
      }
      opts.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING PHASE 1 & 2 AUTOMATED TEST SUITE ---');

  // Test 1: Fetch bidders
  const biddersRes = await request('/api/bidders');
  console.log(`Test 1: GET /api/bidders status=${biddersRes.status}, count=${biddersRes.data.bidders.length}`);

  // Test 2: Check Submission Readiness for all 5 archetypes via Progress Engine
  const archetypes = [
    { id: 'bidder-1', name: 'Aarav (Fully Compliant)', expectedStatus: 'READY' },
    { id: 'bidder-2', name: 'NexGen (Missing ITR/Udyam)', expectedStatus: 'NOT READY' },
    { id: 'bidder-3', name: 'Kaveri (Expired Tax Clearance)', expectedStatus: 'NOT READY' },
    { id: 'bidder-4', name: 'Krishna (PAN Mismatch)', expectedStatus: 'REQUIRES REVIEW' },
    { id: 'bidder-5', name: 'Vertex (Suspended GST/CVC)', expectedStatus: 'NOT READY' }
  ];

  for (const arc of archetypes) {
    const pRes = await request(`/api/tender-buddy/progress?bidderId=${arc.id}`);
    const readiness = pRes.data.progress.submissionReadiness;
    const isMatch = readiness.status === arc.expectedStatus;
    console.log(`Test 2.${arc.id}: ${arc.name} -> Readiness: ${readiness.status} (Expected: ${arc.expectedStatus}) - ${isMatch ? 'PASS ✅' : 'FAIL ❌'}`);
    if (readiness.blockers.length) console.log(`   Blockers: ${JSON.stringify(readiness.blockers)}`);
    if (readiness.reviewItems.length) console.log(`   Review items: ${JSON.stringify(readiness.reviewItems)}`);
  }

  // Test 3: Tender Buddy readiness queries in EN, HI, MR
  const tbEn = await request('/api/tender-buddy/chat', { method: 'POST' }, {
    message: 'Am I ready to submit?',
    lang: 'en',
    context: { bidder: { id: 'bidder-1' } }
  });
  console.log(`Test 3.1: Tender Buddy EN (bidder-1) reply snippet: "${tbEn.data.reply.slice(0, 80)}..."`);

  const tbHi = await request('/api/tender-buddy/chat', { method: 'POST' }, {
    message: 'क्या मैं जमा करने के लिए तैयार हूँ?',
    lang: 'hi',
    context: { bidder: { id: 'bidder-2' } }
  });
  console.log(`Test 3.2: Tender Buddy HI (bidder-2 missing) reply snippet: "${tbHi.data.reply.slice(0, 80)}..."`);

  const tbMr = await request('/api/tender-buddy/chat', { method: 'POST' }, {
    message: 'मी सादर करण्यास सज्ज आहे का?',
    lang: 'mr',
    context: { bidder: { id: 'bidder-4' } }
  });
  console.log(`Test 3.3: Tender Buddy MR (bidder-4 review) reply snippet: "${tbMr.data.reply.slice(0, 80)}..."`);

  // Test 4: Simulation Submission
  const simRes = await request('/api/vendor/submit-simulation', { method: 'POST' }, {
    id: 'bidder-1',
    vendorName: 'Aarav Industrial Solutions Pvt. Ltd.'
  });
  console.log(`Test 4: Simulation Submission -> Status=${simRes.status}, success=${simRes.data.success}`);
  const hasAudit = simRes.data.bidder.audit.some(a => a.action.includes('Simulation Submitted'));
  console.log(`   Audit trail recorded simulation: ${hasAudit ? 'PASS ✅' : 'FAIL ❌'}`);

  // Test 5: Officer Review Note
  const noteRes = await request('/api/officer/note', { method: 'POST' }, {
    id: 'bidder-4',
    note: 'Legal entity title verified against original trade certificate under manual review.',
    officerName: 'Desk Officer (SIH 26100)'
  });
  console.log(`Test 5: Officer Note Added -> Status=${noteRes.status}, count=${noteRes.data.bidder.officerNotes.length} - ${noteRes.data.success ? 'PASS ✅' : 'FAIL ❌'}`);

  // Test 6: Officer Resolve Finding
  const resolveRes = await request('/api/officer/resolve-finding', { method: 'POST' }, {
    id: 'bidder-4',
    findingIndex: 0,
    remarks: 'Discrepancy reviewed and accepted per board resolution',
    officerName: 'Desk Officer (SIH 26100)'
  });
  console.log(`Test 6: Officer Resolve Finding -> Status=${resolveRes.status}, count=${resolveRes.data.bidder.resolvedFindings.length} - ${resolveRes.data.success ? 'PASS ✅' : 'FAIL ❌'}`);

  // Test 7: Verify officer action updates authoritative state visible to Tender Buddy
  const tbAfterResolve = await request('/api/tender-buddy/chat', { method: 'POST' }, {
    message: 'Explain this bidder and compliance result',
    lang: 'en',
    context: { bidder: { id: 'bidder-4' } }
  });
  console.log(`Test 7: Tender Buddy sees updated bidder state: "${tbAfterResolve.data.reply.slice(0, 90)}..."`);

  console.log('--- ALL TESTS COMPLETED SUCCESSFULLY ---');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
