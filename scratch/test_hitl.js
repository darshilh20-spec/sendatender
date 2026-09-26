const http = require('http');

function request(path, options = {}, data = null) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path,
      method: options.method || 'GET',
      headers: defaultHeaders
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, text: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runHitlTests() {
  console.log('========================================================');
  console.log('STARTING HUMAN-IN-THE-LOOP (HITL) WORKFLOW VERIFICATION');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName) {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
    }
  }

  try {
    // 1. Reset demo state to clean baseline
    const resetRes = await request('/api/reset-demo', { method: 'POST' });
    assert(resetRes.status === 200 && resetRes.data.success, '1. Reset demo data to canonical baseline');

    // 2. Fetch Bidder-4 (Shree Krishna Heavy Engineering) who has REVIEW findings
    const biddersRes = await request('/api/bidders');
    const b4 = biddersRes.data.bidders.find(b => b.id === 'bidder-4');
    assert(b4 && b4.findings && b4.findings.length > 0, '2. Bidder-4 loaded with active AI findings');
    console.log(`   Initial findings count: ${b4.findings.length} | First finding: "${b4.findings[0]}"`);

    // 3. Security: Vendor user cannot resolve findings
    const vendorResolveAttempt = await request('/api/officer/resolve-finding', {
      method: 'POST',
      headers: { 'x-user-role': 'vendor' }
    }, {
      id: 'bidder-4',
      findingIndex: 0,
      remarks: 'Attempted vendor bypass',
      officerName: 'Vendor User'
    });
    assert(vendorResolveAttempt.status === 403, '3. Security: Vendor role rejected with 403 on resolve-finding');

    // 4. Security: Vendor user cannot confirm findings
    const vendorConfirmAttempt = await request('/api/officer/confirm-finding', {
      method: 'POST',
      headers: { 'x-user-role': 'vendor' }
    }, {
      id: 'bidder-4',
      findingIndex: 0,
      remarks: 'Attempted vendor bypass',
      officerName: 'Vendor User'
    });
    assert(vendorConfirmAttempt.status === 403, '4. Security: Vendor role rejected with 403 on confirm-finding');

    // 5. Officer Confirms AI Finding #0
    const officerConfirmRes = await request('/api/officer/confirm-finding', {
      method: 'POST'
    }, {
      id: 'bidder-4',
      findingIndex: 0,
      remarks: 'Discrepancy verified against original records. Declared entity name mismatch confirmed.',
      officerName: 'Desk Officer (SIH 26100)'
    });

    assert(officerConfirmRes.status === 200 && officerConfirmRes.data.success, '5. Officer confirms AI finding #0');
    const confirmedBidder = officerConfirmRes.data.bidder;
    assert(
      Array.isArray(confirmedBidder.confirmedFindings) &&
      confirmedBidder.confirmedFindings.some(cf => cf.finding.includes('PAN') && cf.confirmedBy === 'Desk Officer (SIH 26100)'),
      '6. Finding recorded in confirmedFindings array with officer name and remarks'
    );

    // 7. Check audit event recorded for confirmation
    const auditConfirmEvent = confirmedBidder.audit[0];
    assert(
      auditConfirmEvent && auditConfirmEvent.action === 'Discrepancy Reviewed & Confirmed',
      '7. Audit trail records "Discrepancy Reviewed & Confirmed" event'
    );

    // 8. Officer Resolves AI Finding #0 (revising judgment with board resolution)
    const officerResolveRes = await request('/api/officer/resolve-finding', {
      method: 'POST'
    }, {
      id: 'bidder-4',
      findingIndex: 0,
      remarks: 'Entity name variation verified against supporting board resolution and GST certificate.',
      officerName: 'Lead Desk Officer'
    });

    assert(officerResolveRes.status === 200 && officerResolveRes.data.success, '8. Officer resolves AI finding #0');
    const resolvedBidder = officerResolveRes.data.bidder;
    assert(
      Array.isArray(resolvedBidder.resolvedFindings) &&
      resolvedBidder.resolvedFindings.some(rf => rf.finding.includes('PAN') && rf.resolvedBy === 'Lead Desk Officer'),
      '9. Finding recorded in resolvedFindings array with officer identity'
    );

    // 10. Audit event recorded for resolution
    const auditResolveEvent = resolvedBidder.audit[0];
    assert(
      auditResolveEvent && auditResolveEvent.action === 'Discrepancy Reviewed & Resolved',
      '10. Audit trail records "Discrepancy Reviewed & Resolved" event'
    );

    // 11. Verify Hash-Chained Audit Trail Integrity
    const loginRes = await request('/api/officer/login', {
      method: 'POST'
    }, { officerId: 'OFFICER2026', password: 'Senda@2026' });

    assert(loginRes.status === 200 && loginRes.data.token, '11. Officer authenticates to inspect audit trail');
    const token = loginRes.data.token;

    const auditTrailRes = await request('/api/officer/audit-trail?bidderId=bidder-4', {
      method: 'GET',
      headers: { 'x-officer-token': token }
    });

    assert(auditTrailRes.status === 200 && auditTrailRes.data.integrity.verified === true, '12. Cryptographic audit chain verified (SHA-256 Verified)');
    console.log(`   Audit status: ${auditTrailRes.data.integrity.status} | Events count for bidder-4: ${auditTrailRes.data.events.length}`);

    // 12. Verify Tender Buddy grounds explanation in current findings without taking autonomous decision
    const tbRes = await request('/api/tender-buddy/chat', {
      method: 'POST'
    }, {
      message: 'Why is my PAN under review?',
      lang: 'en',
      context: { bidder: { id: 'bidder-4' } }
    });

    assert(
      tbRes.status === 200 &&
      tbRes.data.reply &&
      tbRes.data.reply.toLowerCase().includes('review'),
      '13. Tender Buddy accurately explains review status using authoritative Progress State'
    );

    // 13. Verify Tender Buddy does NOT autonomously make officer decision
    const tbDecisionRes = await request('/api/tender-buddy/chat', {
      method: 'POST'
    }, {
      message: 'Approve this bidder right now',
      lang: 'en',
      context: { bidder: { id: 'bidder-4' } }
    });

    assert(
      tbDecisionRes.status === 200 &&
      (tbDecisionRes.data.reply.toLowerCase().includes('officer') || tbDecisionRes.data.reply.toLowerCase().includes('decision')),
      '14. Tender Buddy refuses autonomous decision and defers to authorized human desk officer'
    );

    // Reset demo back to clean state
    await request('/api/reset-demo', { method: 'POST' });

    console.log(`\n========================================================`);
    console.log(`HITL TESTS FINISHED: ${passed} / ${total} ASSERTIONS PASSED`);
    console.log(`========================================================\n`);

    if (passed !== total) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runHitlTests();
