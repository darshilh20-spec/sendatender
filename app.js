const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

let bidders = [];
let files = [];
let selectedId = null;
let officerAuthenticated = false;

// Notification toast
function toast(m, isErr = false) {
  let t = $('#toast');
  t.textContent = m;
  t.style.background = isErr ? '#DC2626' : '#0F172A';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// Fetch all bidders from Node.js backend
async function fetchBidders() {
  try {
    const res = await fetch('/api/bidders');
    const data = await res.json();
    if (data.success && Array.isArray(data.bidders)) {
      bidders = data.bidders;
      renderBidders();
      if (selectedId) {
        selectBidder(selectedId);
      } else if (bidders.length > 0) {
        selectBidder(bidders[0].id);
      }
    }
  } catch (err) {
    console.error('Failed to load bidders from backend:', err);
    toast('Error connecting to SendaTender backend', true);
  }
}

// Check saved officer session
function checkOfficerSession() {
  const token = sessionStorage.getItem('sendatender-officer-token');
  const name = sessionStorage.getItem('sendatender-officer-name');
  if (token) {
    officerAuthenticated = true;
    if ($('#officer-display-name')) $('#officer-display-name').textContent = name || 'Desk Officer';
    if ($('#officer-avatar')) $('#officer-avatar').textContent = 'DO';
  } else {
    officerAuthenticated = false;
    if ($('#officer-display-name')) $('#officer-display-name').textContent = 'Restricted';
    if ($('#officer-avatar')) $('#officer-avatar').textContent = '🔒';
  }
}

// Navigation with Officer Gate
function nav(view) {
  if (view === 'officer' && !officerAuthenticated) {
    openOfficerModal();
    return;
  }

  $$('.view').forEach(v => v.classList.toggle('active', v.id === view));
  $$('#nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  $('#page-title').textContent = view === 'home' ? 'Tender compliance workspace' : view === 'vendor' ? 'Upload tender and vendor documents' : 'Officer review desk';
  $('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

$$('#nav button').forEach(b => b.onclick = () => nav(b.dataset.view));
$$('[data-go]').forEach(b => b.onclick = () => nav(b.dataset.go));
$('#menu').onclick = () => $('.sidebar').classList.toggle('open');

// Officer Modal Management
function openOfficerModal() {
  const modal = $('#officer-modal');
  const err = $('#login-error');
  if (err) err.style.display = 'none';
  if (modal) modal.classList.remove('hidden');
  $('#officer-id').value = '';
  $('#officer-pass').value = '';
  setTimeout(() => $('#officer-id').focus(), 100);
}
window.openOfficerModal = openOfficerModal;

function closeOfficerModal() {
  const modal = $('#officer-modal');
  if (modal) modal.classList.add('hidden');
}
window.closeOfficerModal = closeOfficerModal;

async function handleOfficerLogin() {
  const officerId = $('#officer-id').value.trim();
  const password = $('#officer-pass').value;
  const errorBox = $('#login-error');
  const btn = $('#btn-login-submit');

  btn.disabled = true;
  btn.textContent = 'Verifying credentials...';
  if (errorBox) errorBox.style.display = 'none';

  try {
    const res = await fetch('/api/officer/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ officerId, password })
    });

    const data = await res.json();

    if (data.success) {
      officerAuthenticated = true;
      sessionStorage.setItem('sendatender-officer-token', data.token);
      sessionStorage.setItem('sendatender-officer-name', data.officer.name);
      if ($('#officer-display-name')) $('#officer-display-name').textContent = data.officer.name;
      if ($('#officer-avatar')) $('#officer-avatar').textContent = 'DO';

      closeOfficerModal();
      toast('Officer authenticated successfully');
      nav('officer');
    } else {
      if (errorBox) {
        errorBox.textContent = data.error || 'Invalid officer credentials. Access denied.';
        errorBox.style.display = 'block';
      }
      toast('Access denied: Invalid credentials', true);
    }
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = 'Server connection error during login';
      errorBox.style.display = 'block';
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Login →';
  }
}
window.handleOfficerLogin = handleOfficerLogin;

// Officer Logout
if ($('#officer-logout')) {
  $('#officer-logout').onclick = () => {
    sessionStorage.removeItem('sendatender-officer-token');
    sessionStorage.removeItem('sendatender-officer-name');
    officerAuthenticated = false;
    checkOfficerSession();
    nav('home');
    toast('Officer workspace locked');
  };
}

// Document classification helper
function typeFor(name, forced) {
  if (forced && forced !== 'Auto-detect') return forced;
  let n = name.toLowerCase();
  if (n.includes('gst')) return 'GST Registration Certificate';
  if (n.includes('pan')) return 'PAN Card';
  if (n.includes('udyam') || n.includes('msme')) return 'Udyam Registration';
  if (n.includes('itr') || n.includes('tax')) return 'Income Tax Return';
  if (n.includes('bank')) return 'Bank Account Proof';
  if (n.includes('technical')) return 'Technical Proposal';
  if (n.includes('tender') || n.includes('nit') || n.includes('rfp')) return 'Tender / NIT / RFP';
  if (n.includes('boq') || n.includes('specification')) return 'BOQ / Technical Specification';
  return 'Supporting document';
}

function addFiles(list, forced) {
  [...list].slice(0, 20 - files.length).forEach(f => files.push({ name: f.name, size: f.size, type: typeFor(f.name, forced), raw: f }));
  renderFiles();
  if (list.length) toast(`${Math.min(list.length, 20)} document${list.length !== 1 ? 's' : ''} added to package`);
}

function renderFiles() {
  $('#file-count').textContent = `${files.length} file${files.length !== 1 ? 's' : ''}`;
  $('#verify').disabled = !files.length;
  $('#file-list').innerHTML = files.length ? files.map((f, i) => `
    <div class="file-row">
      <div class="file-icon">${f.name.split('.').pop().toUpperCase().slice(0, 4)}</div>
      <div class="file-info">
        <b>${esc(f.name)}</b>
        <small>${f.type} · ${Math.max(1, Math.round(f.size / 1024))} KB</small>
      </div>
      <span class="doc-label">Ready for Inspection</span>
      <button class="row-action remove" onclick="removeFile(${i})">Remove</button>
    </div>
  `).join('') : '<div class="empty">Your uploaded documents will appear here.</div>';
}

function esc(s) {
  return String(s || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c]));
}

function removeFile(i) {
  files.splice(i, 1);
  renderFiles();
}
window.removeFile = removeFile;

$('#bulk-input').onchange = e => addFiles(e.target.files);
$('#single-input').onchange = e => { addFiles(e.target.files, $('#doc-type').value); e.target.value = ''; };

let drop = $('#dropzone');
['dragenter', 'dragover'].forEach(x => drop.addEventListener(x, e => { e.preventDefault(); drop.classList.add('drag'); }));
['dragleave', 'drop'].forEach(x => drop.addEventListener(x, e => { e.preventDefault(); drop.classList.remove('drag'); }));
drop.addEventListener('drop', e => addFiles(e.dataTransfer.files));

// Helper: Render multi-stage reasoning stages (EXTRACTED -> FORMAT -> CROSS-MATCH -> MOCK REGISTRY -> FINAL)
function renderMultiStageEvidence(evidenceText) {
  if (!evidenceText) return '';
  const parts = evidenceText.split(' | ');
  if (parts.length >= 3) {
    return `
      <div class="evidence-pipeline" style="display:flex; flex-wrap:wrap; gap:4px; margin-top:5px; align-items:center;">
        ${parts.map((part, idx) => {
          const isFinal = idx === parts.length - 1;
          const isPass = part.includes('PASS') || part.includes('ACTIVE') || part.includes('VALID');
          const isFail = part.includes('FAIL') || part.includes('SUSPENDED') || part.includes('REJECTED');
          const isRev = part.includes('REVIEW') || part.includes('NOT FOUND') || part.includes('MISMATCH') || part.includes('PENDING');
          const bg = isFinal 
            ? (isPass ? '#dcfce7' : isFail ? '#fee2e2' : '#fef3c7') 
            : '#f1f5f9';
          const fg = isFinal 
            ? (isPass ? '#15803d' : isFail ? '#b91c1c' : '#b45309') 
            : '#334155';
          return `<span style="font-size:10px; background:${bg}; color:${fg}; padding:2px 6px; border-radius:4px; font-weight:${isFinal ? '750' : '500'}; font-family:monospace;">${esc(part)}</span>${idx < parts.length - 1 ? '<span style="color:#94a3b8; font-size:10px; font-weight:bold;">→</span>' : ''}`;
        }).join('')}
      </div>
    `;
  }
  return `<p style="margin:3px 0 0 0; font-size:11px; color:#64748b; line-height:1.4;">${esc(evidenceText)}</p>`;
}

// ACTUAL MULTIPART UPLOAD & REAL DOCUMENT VERIFICATION (NEVER AUTO-PASS)
$('#verify').onclick = async () => {
  if (!files.length) return;
  const verifyBtn = $('#verify');
  verifyBtn.disabled = true;
  verifyBtn.innerHTML = 'Analyzing document contents & verifying...';

  try {
    const formData = new FormData();
    files.forEach(f => {
      formData.append('documents', f.raw);
    });

    // Collect Vendor Profile fields (declared legal entity profile)
    const declaredName = $('#vendor-profile-name') ? $('#vendor-profile-name').value.trim() : '';
    const declaredGst = $('#vendor-profile-gst') ? $('#vendor-profile-gst').value.trim() : '';
    const declaredPan = $('#vendor-profile-pan') ? $('#vendor-profile-pan').value.trim() : '';
    const declaredUdyam = $('#vendor-profile-udyam') ? $('#vendor-profile-udyam').value.trim() : '';
    const declaredAddress = $('#vendor-profile-address') ? $('#vendor-profile-address').value.trim() : '';

    if (declaredName) formData.append('name', declaredName);
    if (declaredGst) formData.append('gst', declaredGst);
    if (declaredPan) formData.append('pan', declaredPan);
    if (declaredUdyam) formData.append('udyam', declaredUdyam);
    if (declaredAddress) formData.append('address', declaredAddress);
    formData.append('package', 'Tender #S26-104 (Valves & Piping)');

    const res = await fetch('/api/process-bidder', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || 'Verification failed');

    const bidder = result.bidder;
    // Add real uploaded bidder without overwriting preloaded demo bidders
    bidders = bidders.filter(b => b.id !== bidder.id);
    bidders.unshift(bidder);
    renderBidders();

    $('#step2').classList.add('done');
    $('#step3').classList.add('done');
    $('#report').classList.remove('hidden');

    const matrixEntries = Object.entries(bidder.matrix || {});
    const matrixHtml = matrixEntries.map(([k, m]) => `
      <div class="check-item" style="margin-bottom:12px; border-bottom:1px dashed #e2e8f0; padding-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b style="font-size:12px; color:#1e293b;">${esc(m.label || k.toUpperCase())}</b>
          <span class="badge ${m.status.toLowerCase()}" style="font-weight:800; padding:3px 9px; border-radius:4px; font-size:10px; letter-spacing:0.4px; background:${m.status === 'PASS' ? '#dcfce7' : m.status === 'FAIL' ? '#fee2e2' : m.status === 'MISSING' ? '#f1f5f9' : '#fef3c7'}; color:${m.status === 'PASS' ? '#15803d' : m.status === 'FAIL' ? '#b91c1c' : m.status === 'MISSING' ? '#475569' : '#b45309'};">
            ${m.status}
          </span>
        </div>
        ${renderMultiStageEvidence(m.evidence)}
      </div>
    `).join('');

    $('#report').innerHTML = `
      <div class="report-top">
        <div class="score-ring" style="--score:${bidder.score * 3.6}deg"><b>${bidder.score}%</b></div>
        <div>
          <h3>Document Verification Result <span class="risk ${bidder.risk.toLowerCase()}">${bidder.risk} risk</span></h3>
          <p>Multi-stage verification: Document Extraction → Format Validation → Cross-Match → Mock Registry Lookup.</p>
          <div style="margin-top:5px; font-size:11px; font-weight:700; color:#0369a1;">
            🔒 MOCK GOVERNMENT CHECK — SIH DEMO (API Setu / GSTN / NSDL PAN / Udyam / MCA21)
          </div>
        </div>
        <button class="secondary download" onclick="downloadPdfReport('${bidder.id}')">Download PDF Dossier</button>
      </div>
      <div class="report-grid">
        <div>
          <h3 style="margin-bottom:12px; font-size:12px; text-transform:uppercase; color:#0f172a;">Statutory Compliance Matrix</h3>
          ${matrixHtml}
        </div>
        <div>
          <h3 style="margin-bottom:12px; font-size:12px; text-transform:uppercase; color:#0f172a;">Findings & Discrepancies</h3>
          ${bidder.findings.length ? bidder.findings.map(x => `<div class="check-item"><span class="${x.includes('zero') ? 'ok' : 'warn'}">${x.includes('zero') ? '✓' : '!'}</span> ${esc(x)}</div>`).join('') : '<div class="check-item"><span class="ok">✓</span> No material discrepancies detected</div>'}
          <div class="check-item" style="margin-top:12px; font-size:11px; color:#64748b;">
            <span class="ok">✓</span> MOCK GOVERNMENT CHECK — SIH DEMO: Evaluated against mock statutory registry
          </div>
        </div>
      </div>
    `;

    toast(`Verification finished: ${bidder.status} (${bidder.score}%)`);
    $('#report').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.error(err);
    toast('Verification request failed: ' + err.message, true);
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = 'Start AI verification <b>→</b>';
  }
};

// Download actual PDF report from backend
window.downloadPdfReport = function(id) {
  toast('Generating official PDF report...');
  window.open(`/api/report/${id}`, '_blank');
};

// Render Bidders table in Officer portal
function renderBidders() {
  let q = ($('#search')?.value || '').toLowerCase();
  let s = $('#status-filter')?.value || 'All';
  let r = $('#risk-filter')?.value || 'All';

  let rows = bidders.filter(b => 
    (s === 'All' || b.status === s) &&
    (r === 'All' || b.risk === r) &&
    (`${b.name} ${b.gst} ${b.package} ${b.demoType}`).toLowerCase().includes(q)
  );

  $('#bidder-list').innerHTML = rows.length ? rows.map(b => `
    <tr onclick="selectBidder('${b.id}')" style="cursor:pointer;" class="${selectedId === b.id ? 'selected-row' : ''}">
      <td>
        <span class="company" style="font-weight:700; color:#0f172a; display:block;">${esc(b.name)}</span>
        <span class="sub" style="font-size:11px; color:#64748b;">${esc(b.gst)} · <span style="font-weight:600; color:#0369a1;">${esc(b.demoType || '')}</span></span>
      </td>
      <td>${esc(b.package)}<span class="sub" style="font-size:11px; color:#64748b; display:block;">${b.docs} documents</span></td>
      <td><span class="score" style="font-weight:800; color:${b.score >= 80 ? '#16a34a' : b.score >= 60 ? '#ca8a04' : '#dc2626'}">${b.score}%</span></td>
      <td><span class="risk ${b.risk.toLowerCase()}">${b.risk}</span></td>
      <td><span class="status ${(b.status || '').replace(/\s+/g, '-').toLowerCase()}">${b.status}</span></td>
    </tr>
  `).join('') : '<tr><td colspan="5" class="empty">No bidders match these filters.</td></tr>';

  if ($('#stat-bidders')) $('#stat-bidders').textContent = bidders.length;
  if ($('#stat-score')) $('#stat-score').textContent = bidders.length ? Math.round(bidders.reduce((a, b) => a + b.score, 0) / bidders.length) + '%' : '0%';
  if ($('#stat-review')) $('#stat-review').textContent = bidders.filter(b => b.status === 'Ready for review' || b.status === 'Needs review').length;
}

// Select Bidder and show Detail / Compliance / Evidence / Explain Why
function selectBidder(id) {
  selectedId = id;
  const b = bidders.find(x => x.id === id);
  if (!b) return;

  const matrix = b.matrix || {};
  const matrixHtml = Object.entries(matrix).map(([k, m]) => `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <b style="font-size:12px; color:#0f172a;">${esc(m.label || k.toUpperCase())}</b>
        <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; letter-spacing:0.4px; background:${m.status === 'PASS' ? '#dcfce7' : m.status === 'FAIL' ? '#fee2e2' : m.status === 'MISSING' ? '#f1f5f9' : '#fef3c7'}; color:${m.status === 'PASS' ? '#15803d' : m.status === 'FAIL' ? '#b91c1c' : m.status === 'MISSING' ? '#475569' : '#b45309'};">
          ${m.status}
        </span>
      </div>
      <div style="font-size:11px; color:#475569; margin-top:4px; line-height:1.4;">
        ${renderMultiStageEvidence(m.evidence)}
      </div>
    </div>
  `).join('');

  $('#review-panel').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
      <div>
        <span class="eyebrow" style="color:#0284c7; font-weight:700; font-size:10px;">BIDDER DOSSIER</span>
        <h3 style="margin:2px 0 0 0; font-size:16px; color:#0f172a;">${esc(b.name)}</h3>
      </div>
      <button class="secondary" style="font-size:11px; padding:5px 12px;" onclick="downloadPdfReport('${b.id}')">📄 PDF Report</button>
    </div>

    <div class="detail-meta" style="font-size:11px; color:#64748b; margin-bottom:12px;">
      <b>GSTIN:</b> ${esc(b.gst)} · <b>PAN:</b> ${esc(b.pan || 'N/A')}<br>
      <b>Verification Type:</b> <span style="color:#0369a1; font-weight:600;">${esc(b.typeDescription || b.demoType || '')}</span>
    </div>

    <div class="detail-score" style="margin-bottom:14px; background:#f1f5f9; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <b style="font-size:15px; color:#0f172a;">${b.score}% compliance</b>
        <div class="detail-meta" style="font-size:11px; color:#64748b;">${b.docs} statutory documents analyzed</div>
      </div>
      <span class="risk ${b.risk.toLowerCase()}">${b.risk} risk</span>
    </div>

    <!-- EXPLAIN WHY SECTION -->
    <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:10px 12px; margin-bottom:14px;">
      <b style="font-size:11px; color:#1e40af; text-transform:uppercase;">💡 Explain Why: Scoring Rationale</b>
      <p style="font-size:11px; color:#1e3a8a; margin:4px 0 0 0; line-height:1.45;">
        ${b.score >= 85 ? 'High compliance score: zero discrepancies detected across GSTN, PAN, MCA21, and Udyam checks.' : b.score >= 60 ? 'Moderate compliance score: documents show issues requiring officer scrutiny (missing statutory certificates, expiry, or entity name discrepancies).' : 'Critical risk score: severe non-compliance detected such as suspended GST registration, expired EMD guarantee, or CVC negative list matches.'}
      </p>
    </div>

    <!-- STATUTORY COMPLIANCE MATRIX -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#475569; margin:0 0 8px 0;">Statutory Compliance Matrix</h4>
      ${matrixHtml}
    </div>

    <!-- VERIFICATION FINDINGS -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#475569; margin:0 0 6px 0;">Discrepancies & Findings</h4>
      ${(b.findings || []).length ? b.findings.map(f => `<div class="check-item"><span class="warn">!</span> ${esc(f)}</div>`).join('') : '<div class="check-item"><span class="ok">✓</span> Zero discrepancies found in this submission</div>'}
    </div>

    <!-- OFFICER DECISION BUTTONS -->
    <div style="margin-bottom:16px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#475569; margin:0 0 6px 0;">Officer Decision Panel</h4>
      <div class="action-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
        <button style="background:#16a34a; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Approved')">Approve</button>
        <button style="background:#d97706; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Needs review')">Request More</button>
        <button style="background:#dc2626; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Flagged')">Flag</button>
      </div>
    </div>

    <!-- AUDIT TRAIL -->
    <div class="audit" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; color:#475569; margin:0 0 6px 0;">Hash-Chained Audit Trail</h4>
      ${(b.audit || []).map(a => `
        <div class="audit-item" style="font-size:11px; padding:5px 0; border-bottom:1px solid #f1f5f9; color:#334155;">
          <b>${esc(a.action || 'Action')}:</b> ${esc(a.user || 'System')} <span style="color:#94a3b8; font-size:10px;">(${esc(a.timestamp)})</span>
          ${a.remarks ? `<div style="color:#64748b; font-style:italic;">"${esc(a.remarks)}"</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}
window.selectBidder = selectBidder;

// Submit decision to backend
async function submitDecision(id, decision) {
  try {
    toast(`Recording ${decision} on backend...`);
    const officerName = sessionStorage.getItem('sendatender-officer-name') || 'Desk Officer (SIH 26100)';
    const res = await fetch('/api/decision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        decision,
        officerName,
        officerRemarks: `Officer marked status as ${decision}`
      })
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update decision');

    const index = bidders.findIndex(x => x.id === id);
    if (index !== -1) {
      bidders[index] = data.bidder;
    }

    renderBidders();
    selectBidder(id);
    toast(`Bidder successfully marked as ${decision}`);
  } catch (err) {
    console.error(err);
    toast('Failed to record decision', true);
  }
}
window.submitDecision = submitDecision;

// Reset demo data via backend
$('#seed').onclick = async () => {
  try {
    const res = await fetch('/api/reset-demo', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      bidders = data.bidders;
      renderBidders();
      if (bidders.length) selectBidder(bidders[0].id);
      toast('Demo bidders restored from backend');
    }
  } catch (err) {
    toast('Error resetting demo bidders', true);
  }
};

['#search', '#status-filter', '#risk-filter'].forEach(x => {
  const el = $(x);
  if (el) el.addEventListener(x === '#search' ? 'input' : 'change', renderBidders);
});

// Initial boot
renderFiles();
checkOfficerSession();
fetchBidders();
