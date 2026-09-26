const http = require('http');

function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
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

async function runTests() {
  console.log('=== STARTING SENDA TENDER PHASE 3 AUTOMATED TESTS ===\n');
  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  try {
    // 1. Unauthenticated Comparison Access (Vendor / Public)
    const unauthComp = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/comparison',
      method: 'GET'
    });
    assert(unauthComp.status === 403, '1. Vendor/unauthenticated cannot access comparison (status 403)');

    // 2. Unauthenticated Audit Trail Access
    const unauthAudit = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/audit-trail',
      method: 'GET'
    });
    assert(unauthAudit.status === 403, '2. Vendor/unauthenticated cannot access audit trail (status 403)');

    // 3. Officer Authentication
    const loginRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { officerId: 'OFFICER2026', password: 'Senda@2026' });

    assert(loginRes.status === 200 && loginRes.data.success && loginRes.data.token, '3. Officer authentication succeeds with valid credentials');
    const token = loginRes.data.token;

    // 4. Officer Loads Bidder Comparison
    const compRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/comparison',
      method: 'GET',
      headers: { 'x-officer-token': token }
    });
    assert(compRes.status === 200 && compRes.data.success, '4. Officer can load bidder comparison');
    const biddersComp = compRes.data.comparison || [];
    assert(biddersComp.length >= 5, `5. All 5 demo bidders appear in comparison (found ${biddersComp.length})`);

    // Check authoritative Progress Engine metrics in comparison
    const b1 = biddersComp.find(b => b.id === 'bidder-1');
    assert(b1 && b1.submissionReadiness === 'READY' && b1.score === 96 && b1.counts.fail === 0, '6. Bidder-1 (Fully Compliant) has authoritative READY status and 96% score');

    const b2 = biddersComp.find(b => b.id === 'bidder-2');
    assert(b2 && b2.submissionReadiness === 'NOT READY' && b2.counts.missing > 0, '7. Bidder-2 (Missing Documents) has authoritative NOT READY status with missing items');

    const b3 = biddersComp.find(b => b.id === 'bidder-3');
    assert(b3 && b3.submissionReadiness === 'NOT READY' && b3.counts.expired > 0, '8. Bidder-3 (Expired Certificate) has authoritative NOT READY status with expired items');

    const b4 = biddersComp.find(b => b.id === 'bidder-4');
    assert(b4 && b4.submissionReadiness === 'REQUIRES REVIEW' && b4.reviewItemsCount > 0, '9. Bidder-4 (Name/Address Mismatch) has authoritative REQUIRES REVIEW status with review items');

    const b5 = biddersComp.find(b => b.id === 'bidder-5');
    assert(b5 && b5.submissionReadiness === 'NOT READY' && b5.counts.fail > 0, '10. Bidder-5 (Multiple Issues) has FAIL findings and authoritative NOT READY status');

    // 11. Hash-Chained Audit Trail Integrity
    const auditRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/audit-trail',
      method: 'GET',
      headers: { 'x-officer-token': token }
    });
    assert(auditRes.status === 200 && auditRes.data.success, '11. Officer can load hash-chained audit trail');
    assert(auditRes.data.integrity && auditRes.data.integrity.verified === true, '12. Audit chain cryptographic integrity is Verified (SHA-256)');

    // 12. Check that events contain hash and prevHash, and NO tokens/passwords
    const allEvents = auditRes.data.events || [];
    assert(allEvents.length > 0, `13. Audit events are populated from real workflows (count: ${allEvents.length})`);
    
    const sampleEvent = allEvents[0];
    assert(sampleEvent.hash && sampleEvent.prevHash, '14. Audit events contain cryptographic hash and prevHash chain');

    const serializedAudit = JSON.stringify(allEvents);
    const hasSecrets = serializedAudit.includes('Senda@2026') || serializedAudit.includes('ST-OFFICER-SESSION');
    assert(!hasSecrets, '15. No passwords, tokens, or secrets leak into audit records');

    // 16. Audit event created for Officer Note
    const noteRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/note',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { id: 'bidder-1', note: 'Phase 3 Verification Note: All criteria confirmed.', officerName: 'Lead Desk Officer' });
    assert(noteRes.status === 200 && noteRes.data.success, '16. Officer note recorded successfully');

    // 17. Verify Note appears in Audit Trail
    const auditAfterNote = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/audit-trail?actionType=Note',
      method: 'GET',
      headers: { 'x-officer-token': token }
    });
    const hasNoteEvent = (auditAfterNote.data.events || []).some(e => e.action.includes('Officer Note'));
    assert(hasNoteEvent, '17. Audit event created for officer note');

    // 18. Audit event created for Finding Resolution
    const resolveRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/resolve-finding',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { id: 'bidder-3', findingIndex: 0, remarks: 'Verified address discrepancy resolved.', officerName: 'Lead Desk Officer' });
    assert(resolveRes.status === 200 && resolveRes.data.success, '18. Finding resolution recorded successfully');

    // 19. Verify Finding Resolution in Audit Trail
    const auditAfterResolve = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/audit-trail?q=Discrepancy',
      method: 'GET',
      headers: { 'x-officer-token': token }
    });
    const hasResolveEvent = (auditAfterResolve.data.events || []).some(e => e.action.includes('Discrepancy Reviewed & Resolved'));
    assert(hasResolveEvent, '19. Audit event created for finding resolution');

    // 20. Simulation Submission audit event
    const submitRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/vendor/submit-simulation',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { id: 'bidder-1', vendorName: 'Aarav Submissions Desk' });
    assert(submitRes.status === 200 && submitRes.data.success, '20. Simulation submission executed successfully');

    const auditAfterSubmit = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/officer/audit-trail?actionType=Simulation',
      method: 'GET',
      headers: { 'x-officer-token': token }
    });
    const hasSubmitEvent = (auditAfterSubmit.data.events || []).some(e => e.action.includes('Simulation Submitted'));
    assert(hasSubmitEvent, '21. Audit event created for simulation submission');

    // 22. Tender Buddy Security: Vendor cannot access comparison
    const tbVendorRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tender-buddy/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      message: 'Compare all bidders for me',
      lang: 'en',
      context: { role: 'vendor', view: 'vendor' }
    });
    assert(tbVendorRes.data.success && tbVendorRes.data.reply.includes('Security Protection'), '22. Tender Buddy blocks vendor from competitor comparison');

    // 23. Tender Buddy Officer Access: Comparison
    const tbOfficerRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tender-buddy/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      message: 'Show me bidder comparison',
      lang: 'en',
      context: { role: 'officer', view: 'officer' }
    });
    assert(tbOfficerRes.data.success && tbOfficerRes.data.reply.includes('Officer Bidder Comparison Desk'), '23. Tender Buddy guides officer on bidder comparison');

    // 24. Tender Buddy Officer Access: Hindi
    const tbHiRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tender-buddy/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      message: 'बोलीदाताओं की तुलना दिखाएं',
      lang: 'hi',
      context: { role: 'officer', view: 'officer' }
    });
    assert(tbHiRes.data.success && tbHiRes.data.reply.includes('अधिकारी बोलीदाता तुलना डेस्क'), '24. Tender Buddy comparison responds in authentic Hindi');

    // 25. Tender Buddy Officer Access: Marathi
    const tbMrRes = await request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/tender-buddy/chat',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      message: 'बोलीदारांची तुलना दाखवा',
      lang: 'mr',
      context: { role: 'officer', view: 'officer' }
    });
    assert(tbMrRes.data.success && tbMrRes.data.reply.includes('अधिकारी बोलीदार तुलना डेस्क'), '25. Tender Buddy comparison responds in authentic Marathi');

    console.log(`\n=======================================================`);
    console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED`);
    console.log(`=======================================================\n`);

    if (passed === total) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
