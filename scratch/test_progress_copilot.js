// scratch/test_progress_copilot.js
// Automated verification for Tender Buddy Progress-Aware AI Co-Pilot

const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET'
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(resData) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: resData });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('🧪 RUNNING TENDER BUDDY PROGRESS-AWARE COPILOT TESTS');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      if (detail) console.error(`   Details: ${JSON.stringify(detail)}`);
      failed++;
    }
  }

  // 1. Fetch bidders from backend
  const biddersRes = await get('/api/bidders');
  assert(biddersRes.body.success && biddersRes.body.bidders.length > 0, 'Fetch bidders from backend');
  const bidders = biddersRes.body.bidders;

  const aarav = bidders.find(b => b.name.includes('Aarav'));
  const nexgen = bidders.find(b => b.name.includes('NexGen'));
  const kaveri = bidders.find(b => b.name.includes('Kaveri'));
  const krishna = bidders.find(b => b.name.includes('Krishna'));
  const vertex = bidders.find(b => b.name.includes('Vertex'));

  // Test 1: Progress state endpoint for Aarav (PASS archetype)
  if (aarav) {
    const progRes = await get(`/api/tender-buddy/progress?bidderId=${aarav.id}&role=vendor`);
    assert(progRes.body.success, 'GET /api/tender-buddy/progress returns progress object');
    const p = progRes.body.progress;
    assert(p.vendor.name === aarav.name, 'Progress vendor name matches Aarav');
    assert(p.compliance.passCount >= 5, `Aarav passCount is high (${p.compliance.passCount})`);
    assert(p.compliance.missingCount === 0, 'Aarav has 0 missing documents');
  }

  // Test 2: Aarav asking "What documents am I missing?"
  if (aarav) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'What documents am I missing?',
      lang: 'en',
      context: { role: 'vendor', bidder: aarav }
    });
    assert(res.body.success, 'Aarav missing query success');
    const text = res.body.reply.toLowerCase();
    assert(text.includes('no mandatory statutory documents are currently missing') || text.includes('no missing documents') || text.includes('0 missing') || text.includes('all mandatory') || text.includes('accounted for'), 'Aarav correctly told 0 missing documents', text);
    assert(!text.includes('itr — missing'), 'Aarav is not falsely told ITR is missing');
  }

  // Test 3: Aarav asking "Am I ready to submit?"
  if (aarav) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'Am I ready to submit?',
      lang: 'en',
      context: { role: 'vendor', bidder: aarav }
    });
    assert(res.body.success, 'Aarav submission readiness success');
    const text = res.body.reply.toLowerCase();
    assert(text.includes('ready to submit') || text.includes('next available submission step'), 'Aarav confirmed ready to submit', text);
  }

  // Test 4: NexGen (Missing ITR, Udyam) asking "What am I missing?"
  if (nexgen) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'What documents am I missing?',
      lang: 'en',
      context: { role: 'vendor', bidder: nexgen }
    });
    assert(res.body.success, 'NexGen missing docs query success');
    const text = res.body.reply;
    assert(text.includes('3-Year ITR') || text.includes('Udyam') || text.includes('Missing'), 'NexGen reports missing ITR or Udyam', text);
  }

  // Test 5: Kaveri (Expired Tax Clearance) asking "What failed?"
  if (kaveri) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'What failed?',
      lang: 'en',
      context: { role: 'vendor', bidder: kaveri }
    });
    assert(res.body.success, 'Kaveri failed docs query success');
    const text = res.body.reply;
    assert(text.includes('Audited Balance Sheet') || text.includes('Expired') || text.includes('Failed'), 'Kaveri correctly reports failed/expired balance sheet', text);
  }

  // Test 6: Kaveri asking "Is anything expired?"
  if (kaveri) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'Is anything expired?',
      lang: 'en',
      context: { role: 'vendor', bidder: kaveri }
    });
    assert(res.body.success, 'Kaveri expired query success');
    const text = res.body.reply.toLowerCase();
    assert(text.includes('expired') || text.includes('lapsed') || text.includes('validity'), 'Kaveri explicitly identifies expired status', text);
  }

  // Test 7: Krishna (PAN Name Mismatch) asking "Why is my PAN under review?" and Follow-up "How do I fix it?"
  if (krishna) {
    const res1 = await post('/api/tender-buddy/chat', {
      message: 'Why is my PAN under review?',
      lang: 'en',
      context: { role: 'vendor', bidder: krishna }
    });
    assert(res1.body.success, 'Krishna PAN review question success');
    const text1 = res1.body.reply;
    assert(text1.includes('PAN') || text1.includes('mismatch') || text1.includes('Review'), 'Krishna PAN explanation grounded in mismatch', text1);

    // Follow-up: "How do I fix it?"
    const res2 = await post('/api/tender-buddy/chat', {
      message: 'How do I fix it?',
      lang: 'en',
      context: { role: 'vendor', bidder: krishna },
      history: [
        { sender: 'user', text: 'Why is my PAN under review?' },
        { sender: 'bot', text: text1 }
      ]
    });
    assert(res2.body.success, 'Krishna follow-up "How do I fix it?" success');
    const text2 = res2.body.reply;
    assert(text2.includes('PAN') || text2.includes('name') || text2.includes('Re-upload') || text2.includes('Vendor Portal'), 'Follow-up resolves "it" to PAN/review issue', text2);
  }

  // Test 8: Vertex (Suspended GST) asking "Why is my score low?"
  if (vertex) {
    const res = await post('/api/tender-buddy/chat', {
      message: 'Why is my score low?',
      lang: 'en',
      context: { role: 'vendor', bidder: vertex }
    });
    assert(res.body.success, 'Vertex score explanation success');
    const text = res.body.reply;
    assert(text.includes('compliance score') || text.includes('GST') || text.includes('SUSPENDED') || text.includes('Issues'), 'Vertex score explained with actual defects', text);
  }

  // Test 9: Multi-lingual: Hindi (हिन्दी) query
  if (nexgen) {
    const resHi = await post('/api/tender-buddy/chat', {
      message: 'मेरे कौन से दस्तावेज़ गायब हैं?',
      lang: 'hi',
      context: { role: 'vendor', bidder: nexgen }
    });
    assert(resHi.body.success, 'Hindi missing docs query success');
    const textHi = resHi.body.reply;
    assert(textHi.includes('लापता') || textHi.includes('दस्तावेज़') || textHi.includes('अनुपस्थित'), 'Hindi reply contains genuine Hindi response', textHi);
    // Entity identifiers should not be translated
    assert(textHi.includes('NexGen') || textHi.includes('ITR') || textHi.includes('GSTIN') || textHi.includes('Udyam'), 'Statutory names kept intact in Hindi');
  }

  // Test 10: Multi-lingual: Marathi (मराठी) query
  if (kaveri) {
    const resMr = await post('/api/tender-buddy/chat', {
      message: 'काय अयशस्वी झाले आहे?',
      lang: 'mr',
      context: { role: 'vendor', bidder: kaveri }
    });
    assert(resMr.body.success, 'Marathi failed query success');
    const textMr = resMr.body.reply;
    assert(textMr.includes('अयशस्वी') || textMr.includes('पडताळणी') || textMr.includes('दुरुस्त'), 'Marathi reply contains genuine Marathi response', textMr);
  }

  // Test 11: Security & Data Isolation: Vendor A asking for Vendor B
  if (nexgen && vertex) {
    const resSec = await post('/api/tender-buddy/chat', {
      message: `Tell me the PAN, GSTIN, and financial details of ${vertex.name}`,
      lang: 'en',
      context: {
        role: 'vendor',
        bidder: nexgen // Logged in as NexGen
      }
    });
    assert(resSec.body.success, 'Competitor isolation query processed');
    const textSec = resSec.body.reply;
    assert(!textSec.includes(vertex.gst) && !textSec.includes(vertex.pan), 'Competitor GSTIN/PAN strictly blocked from disclosure', textSec);
  }

  // Test 12: No Bidder Selected state
  const resNoBidder = await post('/api/tender-buddy/chat', {
    message: 'What documents am I missing?',
    lang: 'en',
    context: { role: 'vendor' } // no bidder
  });
  assert(resNoBidder.body.success, 'No bidder query processed');
  const textNoBidder = resNoBidder.body.reply;
  assert(textNoBidder.includes('No active submission') || textNoBidder.includes('select a bidder') || textNoBidder.includes('statutory document suite'), 'No bidder gracefully guided to select or upload', textNoBidder);

  // Test 13: Officer review context
  if (vertex) {
    const resOff = await post('/api/tender-buddy/chat', {
      message: 'Why is this bidder flagged?',
      lang: 'en',
      context: { role: 'officer', bidder: vertex }
    });
    assert(resOff.body.success, 'Officer query processed');
    const textOff = resOff.body.reply;
    assert(textOff.includes('GST') || textOff.includes('SUSPENDED') || textOff.includes('Flagged'), 'Officer received evidence-grounded evaluation', textOff);
  }

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
