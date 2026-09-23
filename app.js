const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];

// ==========================================
// TRANSLATION DICTIONARY (ENGLISH & HINDI)
// ==========================================
const I18N = {
  en: {
    // Navigation & Brand
    navOverview: 'Overview',
    navVendor: 'Vendor Portal',
    navOfficer: 'Officer Portal',
    sidebarNoteTitle: 'Demo Mode Active',
    sidebarNoteDesc: 'Full mock Gemini OCR and live mock government checks (GSTN, PAN, Udyam, MCA21, CVC) connected.',
    headerEyebrow: 'PROCUREMENT DOCUMENT REVIEW',
    headerTitleHome: 'Tender compliance workspace',
    headerTitleVendor: 'Upload tender and vendor documents',
    headerTitleOfficer: 'Officer review desk',

    // View 1: Overview
    heroPill: 'SIH 2026 · Problem Statement 26100',
    heroTitle: 'Review tender documents in one unified workbench.',
    heroDesc: 'SendaTender automates statutory verification across the Ministry of Petroleum & Natural Gas and GeM. It extracts, cross-checks GSTN, PAN, Udyam, MCA21, evaluates CVC debarments, produces audit-ready compliance dossiers, and outputs signed PDF reports.',
    heroBtnUpload: 'Upload package →',
    heroBtnOfficer: 'Open officer desk',
    statBidders: 'ACTIVE BIDDERS',
    statBiddersSub: 'Demo archetypes loaded',
    statScore: 'AVG. COMPLIANCE',
    statScoreSub: 'Across active bidders',
    statReview: 'READY TO REVIEW',
    statReviewSub: 'Awaiting officer decision',
    feature1Title: 'Vendor submission',
    feature1Desc: 'Upload NIT/RFP, BOQ, GST, PAN, Udyam, ITR, bank proof, and technical proposals in one package.',
    feature2Title: 'Automated screening',
    feature2Desc: 'AI extracts metadata, maps compliance to the statutory matrix (PASS/FAIL/REVIEW/MISSING), and flags discrepancies.',
    feature3Title: 'Officer decision & audit',
    feature3Desc: 'Officers inspect statutory evidence, explainable scoring rationale, record decisions (Approve, Request More, Flag), and export PDF reports.',

    // View 2: Vendor Submission
    vendorEyebrow: 'VENDOR PORTAL',
    vendorHeading: 'Submit your tender & vendor package',
    vendorSubheading: 'Upload tender and vendor compliance documents together or add each file individually.',
    vendorPill: 'Demo Mode · Gemini Mock Engine',
    step1: 'Upload',
    step2: 'Verify',
    step3: 'Ready for review',
    statutoryChecklist: 'Statutory Checklist',
    checklistTender: '1. Tender documents — NIT/RFP, tender notice, specifications, BOQ',
    checklistVendor: '2. Vendor documents — GST, PAN, Udyam/MSME, ITR, bank proof, technical proposal',
    profileCardTitle: 'Vendor Profile & Statutory Declaration',
    profileCardTag: 'Optional Declaration',
    profileCardDesc: 'Enter declared entity details to cross-validate against uploaded documents. If left blank, the system automatically extracts them.',
    labelEntityName: 'Legal Entity Name',
    labelGstin: 'GSTIN (optional)',
    labelPan: 'PAN (optional)',
    labelUdyam: 'Udyam Number (optional)',
    labelAddress: 'Registered Business Address (optional)',
    dropzoneTitle: 'Upload tender & vendor documents',
    dropzoneDesc: 'Select the complete package in one go, or',
    browseFiles: 'browse files',
    dropzoneSmall: 'PDF, JPG, PNG, DOC · Max 20 files · Express backend processing',
    orText: 'OR',
    singleDocTitle: 'Add an individual document',
    singleDocDesc: 'Choose document type, then select its file.',
    autoDetect: 'Auto-detect document type',
    chooseFileBtn: 'Choose file',
    docsCardTitle: 'Your documents',
    docsCardSub: 'Gemini OCR & Statutory Matrix verification',
    startVerifyBtn: 'Start AI verification →',
    verifyingBtn: 'Analyzing document contents & verifying...',
    emptyDocs: 'Your uploaded documents will appear here.',
    readyForInspection: 'Ready for Inspection',
    removeBtn: 'Remove',
    mockGovNotice: '🔒 MOCK GOVERNMENT CHECK — SIH DEMO (API Setu / GSTN / NSDL PAN / Udyam / MCA21)',
    mockGovNoticeSub: 'Evaluated against mock statutory registry',

    // View 3: Officer Portal
    officerEyebrow: 'OFFICER PORTAL',
    officerHeading: 'Bidder review desk & compliance audit',
    officerSubheading: 'Review compliance matrices, explainable scores, statutory evidence, and take decisions.',
    resetDemoBtn: 'Reset demo data',
    logoutBtn: 'Lock / Log Out',
    filterAllStatus: 'All statuses',
    filterAllRisk: 'All risk levels',
    thBidder: 'BIDDER / ARCHETYPE',
    thPackage: 'PACKAGE',
    thCompliance: 'COMPLIANCE',
    thRisk: 'RISK',
    thStatus: 'STATUS',
    emptyReviewPanel: 'Select a bidder to view the verification record.',
    bidderDossier: 'BIDDER DOSSIER',
    pdfReportBtn: '📄 PDF Report',
    complianceLabel: 'compliance',
    documentsAnalyzed: 'statutory documents analyzed',
    explainWhyTitle: '💡 Explain Why: Scoring Rationale',
    statutoryMatrixTitle: 'Statutory Compliance Matrix',
    discrepanciesTitle: 'Discrepancies & Findings',
    officerDecisionTitle: 'Officer Decision Panel',
    auditTrailTitle: 'Hash-Chained Audit Trail',
    btnApprove: 'Approve',
    btnRequestMore: 'Request More',
    btnFlag: 'Flag',
    zeroDiscrepancies: 'Zero discrepancies found in this submission',
    noDiscrepanciesDetected: 'No material discrepancies detected',
    noBiddersMatch: 'No bidders match these filters.',

    // Modal
    modalEyebrow: 'RESTRICTED PROCUREMENT ACCESS',
    modalTitle: 'Officer Portal Verification',
    modalDesc: 'Enter your designated officer credentials to access confidential bidder dossiers, statutory evaluations, and decision logging.',
    loginError: 'Invalid officer credentials. Access denied.',
    labelOfficerId: 'Officer ID',
    labelOfficerPass: 'Password',
    btnCancel: 'Cancel',
    btnLogin: 'Login →',
    verifyingCreds: 'Verifying credentials...',

    // Statuses & Risks
    statusReady: 'Ready for review',
    statusNeedsReview: 'Needs review',
    statusApproved: 'Approved',
    statusFlagged: 'Flagged',
    riskLow: 'Low',
    riskMedium: 'Medium',
    riskHigh: 'High',
    riskSuffix: 'risk',

    // Matrix Checks
    checkGst: 'GSTN Registration Check',
    checkPan: 'PAN Identity Check',
    checkUdyam: 'Udyam MSME Registry',
    checkMca: 'MCA21 Company Status',
    checkDocuments: 'Statutory Document Suite',

    // Toasts
    toastConnectingErr: 'Error connecting to SendaTender backend',
    toastOfficerAuthSuccess: 'Officer authenticated successfully',
    toastOfficerDenied: 'Access denied: Invalid credentials',
    toastOfficerLocked: 'Officer workspace locked',
    toastPdfGenerating: 'Generating official PDF report...',
    toastDemoRestored: 'Demo bidders restored from backend',
    toastDemoResetErr: 'Error resetting demo bidders',
    toastVerifSuccess: 'Verification finished: ',
    toastVerifErr: 'Verification request failed: ',
    toastDecisionSuccess: 'Bidder successfully marked as '
  },

  hi: {
    // Navigation & Brand
    navOverview: 'अवलोकन',
    navVendor: 'विक्रेता पोर्टल',
    navOfficer: 'अधिकारी पोर्टल',
    sidebarNoteTitle: 'डेमो मोड सक्रिय',
    sidebarNoteDesc: 'सेंदातेंद्रे पूर्ण जेमिनी ओसीआर और मॉक सरकारी रजिस्ट्री (GSTN, PAN, Udyam, MCA21, CVC) से जुड़ा हुआ है।',
    headerEyebrow: 'खरीद दस्तावेज़ समीक्षा',
    headerTitleHome: 'निविदा अनुपालन कार्यक्षेत्र',
    headerTitleVendor: 'निविदा और विक्रेता दस्तावेज़ अपलोड करें',
    headerTitleOfficer: 'अधिकारी समीक्षा डेस्क',

    // View 1: Overview
    heroPill: 'एस.आई.एच 2026 · समस्या विवरण 26100',
    heroTitle: 'निविदा दस्तावेज़ों की समीक्षा करें एक एकीकृत कार्यक्षेत्र में।',
    heroDesc: 'सेंदातेंद्रे पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय और GeM के अंतर्गत वैधानिक सत्यापन को स्वचालित करता है। यह GSTN, PAN, Udyam, MCA21 की जांच करता है, CVC प्रतिबंधों का मूल्यांकन करता है, और हस्ताक्षरित PDF रिपोर्ट तैयार करता है।',
    heroBtnUpload: 'पैकेज अपलोड करें →',
    heroBtnOfficer: 'अधिकारी डेस्क खोलें',
    statBidders: 'सक्रिय बोलीदाता',
    statBiddersSub: 'डेमो आर्केटाइप लोड किए गए',
    statScore: 'औसत अनुपालन',
    statScoreSub: 'सक्रिय बोलीदाताओं में',
    statReview: 'समीक्षा के लिए तैयार',
    statReviewSub: 'अधिकारी के निर्णय की प्रतीक्षा',
    feature1Title: 'विक्रेता प्रस्तुति',
    feature1Desc: 'NIT/RFP, BOQ, GST, PAN, उद्यम, ITR, बैंक प्रमाण और तकनीकी प्रस्ताव एक ही पैकेज में अपलोड करें।',
    feature2Title: 'स्वचालित स्क्रीनिंग',
    feature2Desc: 'एआई मेटाडेटा निकालता है, वैधानिक मैट्रिक्स (PASS/FAIL/REVIEW/MISSING) के साथ मिलान करता है और विसंगतियों को चिन्हित करता है।',
    feature3Title: 'अधिकारी निर्णय एवं ऑडिट',
    feature3Desc: 'अधिकारी वैधानिक साक्ष्य, व्याख्या योग्य स्कोरिंग तर्क की जांच करते हैं, निर्णय (स्वीकृत, अधिक मांगें, फ्लैग) दर्ज करते हैं और PDF निर्यात करते हैं।',

    // View 2: Vendor Submission
    vendorEyebrow: 'विक्रेता पोर्टल',
    vendorHeading: 'अपना निविदा एवं विक्रेता पैकेज जमा करें',
    vendorSubheading: 'निविदा और विक्रेता अनुपालन दस्तावेज़ एक साथ अपलोड करें या व्यक्तिगत फ़ाइलें जोड़ें।',
    vendorPill: 'डेमो मोड · जेमिनी मॉक इंजन',
    step1: 'अपलोड',
    step2: 'सत्यापन',
    step3: 'समीक्षा हेतु तैयार',
    statutoryChecklist: 'वैधानिक चेकलिस्ट',
    checklistTender: '1. निविदा दस्तावेज़ — NIT/RFP, निविदा सूचना, विनिर्देश, BOQ',
    checklistVendor: '2. विक्रेता दस्तावेज़ — GST, PAN, उद्यम/MSME, ITR, बैंक प्रमाण, तकनीकी प्रस्ताव',
    profileCardTitle: 'विक्रेता प्रोफ़ाइल एवं वैधानिक घोषणा',
    profileCardTag: 'वैकल्पिक घोषणा',
    profileCardDesc: 'अपलोड किए गए दस्तावेज़ों से मिलान करने के लिए घोषित इकाई विवरण दर्ज करें। यदि खाली छोड़ दिया जाए, तो प्रणाली स्वतः विवरण निकाल लेती है।',
    labelEntityName: 'कानूनी इकाई का नाम',
    labelGstin: 'जीएसटीआईएन (वैकल्पिक)',
    labelPan: 'पैन (वैकल्पिक)',
    labelUdyam: 'उद्यम संख्या (वैकल्पिक)',
    labelAddress: 'पंजीकृत व्यावसायिक पता (वैकल्पिक)',
    dropzoneTitle: 'निविदा और विक्रेता दस्तावेज़ अपलोड करें',
    dropzoneDesc: 'एक साथ पूरा पैकेज चुनें, या',
    browseFiles: 'फ़ाइलें ब्राउज़ करें',
    dropzoneSmall: 'PDF, JPG, PNG, DOC · अधिकतम 20 फ़ाइलें · एक्सप्रेस बैकएंड प्रसंस्करण',
    orText: 'या',
    singleDocTitle: 'व्यक्तिगत दस्तावेज़ जोड़ें',
    singleDocDesc: 'दस्तावेज़ का प्रकार चुनें, फिर फ़ाइल का चयन करें।',
    autoDetect: 'दस्तावेज़ प्रकार स्वतः पहचानें',
    chooseFileBtn: 'फ़ाइल चुनें',
    docsCardTitle: 'आपके दस्तावेज़',
    docsCardSub: 'जेमिनी ओसीआर एवं वैधानिक मैट्रिक्स सत्यापन',
    startVerifyBtn: 'एआई सत्यापन शुरू करें →',
    verifyingBtn: 'दस्तावेज़ सामग्री का विश्लेषण एवं सत्यापन जारी...',
    emptyDocs: 'आपके अपलोड किए गए दस्तावेज़ यहाँ दिखाई देंगे।',
    readyForInspection: 'निरीक्षण हेतु तैयार',
    removeBtn: 'हटाएं',
    mockGovNotice: '🔒 मॉक सरकारी सत्यापन — SIH डेमो (API Setu / GSTN / NSDL PAN / Udyam / MCA21)',
    mockGovNoticeSub: 'मॉक वैधानिक रजिस्ट्री के विरुद्ध मूल्यांकित',

    // View 3: Officer Portal
    officerEyebrow: 'अधिकारी पोर्टल',
    officerHeading: 'बोलीदाता समीक्षा डेस्क एवं अनुपालन ऑडिट',
    officerSubheading: 'अनुपालन मैट्रिक्स, स्पष्टीकरण योग्य स्कोर, वैधानिक साक्ष्य की समीक्षा करें और निर्णय लें।',
    resetDemoBtn: 'डेमो डेटा रीसेट करें',
    logoutBtn: 'लॉक / लॉग आउट',
    filterAllStatus: 'सभी स्थितियाँ',
    filterAllRisk: 'सभी जोखिम स्तर',
    thBidder: 'बोलीदाता / आर्केटाइप',
    thPackage: 'पैकेज',
    thCompliance: 'अनुपालन',
    thRisk: 'जोखिम',
    thStatus: 'स्थिति',
    emptyReviewPanel: 'सत्यापन रिकॉर्ड देखने के लिए किसी बोलीदाता का चयन करें।',
    bidderDossier: 'बोलीदाता डोजियर',
    pdfReportBtn: '📄 PDF रिपोर्ट',
    complianceLabel: 'अनुपालन',
    documentsAnalyzed: 'वैधानिक दस्तावेज़ों का विश्लेषण किया गया',
    explainWhyTitle: '💡 कारण स्पष्ट करें: स्कोरिंग तर्क',
    statutoryMatrixTitle: 'वैधानिक अनुपालन मैट्रिक्स',
    discrepanciesTitle: 'विसंगतियाँ एवं निष्कर्ष',
    officerDecisionTitle: 'अधिकारी निर्णय पैनल',
    auditTrailTitle: 'हैश-श्रृंखलाबद्ध ऑडिट ट्रेल',
    btnApprove: 'स्वीकृत करें',
    btnRequestMore: 'अधिक जानकारी मांगें',
    btnFlag: 'फ्लैग करें',
    zeroDiscrepancies: 'इस प्रस्तुति में कोई विसंगति नहीं पाई गई',
    noDiscrepanciesDetected: 'कोई महत्वपूर्ण विसंगति नहीं मिली',
    noBiddersMatch: 'इन फिल्टरों से कोई बोलीदाता मेल नहीं खाता।',

    // Modal
    modalEyebrow: 'प्रतिबंधित खरीद पहुंच',
    modalTitle: 'अधिकारी पोर्टल सत्यापन',
    modalDesc: 'गोपनीय बोलीदाता डोजियर, वैधानिक मूल्यांकन और निर्णय लॉगिंग तक पहुंचने के लिए अपने अधिकृत क्रेडेंशियल्स दर्ज करें।',
    loginError: 'अमान्य अधिकारी क्रेडेंशियल। प्रवेश अस्वीकृत।',
    labelOfficerId: 'अधिकारी आईडी',
    labelOfficerPass: 'पासवर्ड',
    btnCancel: 'रद्द करें',
    btnLogin: 'लॉगिन करें →',
    verifyingCreds: 'क्रेडेंशियल्स का सत्यापन हो रहा है...',

    // Statuses & Risks
    statusReady: 'समीक्षा हेतु तैयार',
    statusNeedsReview: 'समीक्षा आवश्यक',
    statusApproved: 'स्वीकृत',
    statusFlagged: 'फ्लैग्ड',
    riskLow: 'निम्न',
    riskMedium: 'मध्यम',
    riskHigh: 'उच्च',
    riskSuffix: 'जोखिम',

    // Matrix Checks
    checkGst: 'GSTN पंजीकरण जांच',
    checkPan: 'पैन पहचान जांच',
    checkUdyam: 'उद्यम MSME रजिस्ट्री',
    checkMca: 'MCA21 कंपनी स्थिति',
    checkDocuments: 'वैधानिक दस्तावेज़ सूट',

    // Toasts
    toastConnectingErr: 'सेंदातेंद्रे बैकएंड से कनेक्ट करने में त्रुटि',
    toastOfficerAuthSuccess: 'अधिकारी सफलतापूर्वक प्रमाणित हुआ',
    toastOfficerDenied: 'प्रवेश अस्वीकृत: अमान्य क्रेडेंशियल्स',
    toastOfficerLocked: 'अधिकारी कार्यक्षेत्र लॉक किया गया',
    toastPdfGenerating: 'आधिकारिक PDF रिपोर्ट तैयार की जा रही है...',
    toastDemoRestored: 'बैकएंड से डेमो बोलीदाता बहाल किए गए',
    toastDemoResetErr: 'डेमो बोलीदाताओं को रीसेट करने में त्रुटि',
    toastVerifSuccess: 'सत्यापन पूर्ण: ',
    toastVerifErr: 'सत्यापन अनुरोध विफल: ',
    toastDecisionSuccess: 'बोलीदाता की स्थिति सफलतापूर्वक दर्ज की गई: '
  }
};

let currentLang = localStorage.getItem('sendatender-lang') || 'en';
let currentTheme = localStorage.getItem('sendatender-theme') || 'light';

function t(k) {
  return (I18N[currentLang] && I18N[currentLang][k]) || (I18N['en'] && I18N['en'][k]) || k;
}

function localizeStatus(status) {
  if (!status) return '';
  if (status === 'Ready for review') return t('statusReady');
  if (status === 'Needs review') return t('statusNeedsReview');
  if (status === 'Approved') return t('statusApproved');
  if (status === 'Flagged') return t('statusFlagged');
  return status;
}

function localizeRisk(risk) {
  if (!risk) return '';
  if (risk === 'Low') return t('riskLow');
  if (risk === 'Medium') return t('riskMedium');
  if (risk === 'High') return t('riskHigh');
  return risk;
}

function localizeCheckLabel(key, fallback) {
  if (key === 'gst') return t('checkGst');
  if (key === 'pan') return t('checkPan');
  if (key === 'udyam') return t('checkUdyam');
  if (key === 'mca') return t('checkMca');
  if (key === 'documents') return t('checkDocuments');
  return fallback || key.toUpperCase();
}

function localizeAuditAction(action) {
  if (!action) return 'Action';
  if (currentLang !== 'hi') return action;
  if (action.includes('Verification Completed')) return 'एआई सत्यापन पूर्ण हुआ';
  if (action.includes('Package Submitted') || action.includes('Package Uploaded')) return 'पैकेज विक्रेता द्वारा जमा किया गया';
  if (action.includes('Flagged for Missing')) return 'लापता विसंगति के लिए फ्लैग किया गया';
  if (action.includes('Expiry Detection')) return 'समाप्ति चेतावनी जारी की गई';
  if (action.includes('Entity Mismatch')) return 'इकाई बेमेल चेतावनी सक्रिय';
  if (action.includes('Auto-Flagged')) return 'स्वतः फ्लैग (गंभीर उल्लंघन)';
  if (action.includes('Officer Decision')) return 'अधिकारी निर्णय दर्ज';
  return action;
}

// Apply text translations to all elements with data-i18n
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('sendatender-lang', lang);
  const langSelect = $('#language');
  if (langSelect && langSelect.value !== lang) langSelect.value = lang;

  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (I18N[lang] && I18N[lang][key]) {
      // Check if it's an input/button or text node
      if (el.tagName === 'INPUT' && el.type === 'text') {
        el.placeholder = I18N[lang][key];
      } else {
        el.textContent = I18N[lang][key];
      }
    }
  });

  // Update dynamic page title based on active view
  const activeView = $('.view.active')?.id || 'home';
  const titleMap = {
    home: t('headerTitleHome'),
    vendor: t('headerTitleVendor'),
    officer: t('headerTitleOfficer')
  };
  if ($('#page-title')) $('#page-title').textContent = titleMap[activeView] || t('headerTitleHome');

  // Re-render dynamic components
  renderBidders();
  if (selectedId) selectBidder(selectedId);
  renderFiles();
}

// Apply Theme
function setTheme(mode) {
  currentTheme = mode;
  localStorage.setItem('sendatender-theme', mode);
  const isDark = mode === 'dark';
  document.documentElement.classList.toggle('dark-mode', isDark);
  document.body.classList.toggle('dark-mode', isDark);

  const toggleBtn = $('#theme-toggle');
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? '☀' : '☾';
    toggleBtn.setAttribute('title', isDark ? 'Switch to Light mode' : 'Switch to Dark mode');
  }
}

let bidders = [];
let files = [];
let selectedId = null;
let officerAuthenticated = false;

// Notification toast
function toast(m, isErr = false) {
  let tEl = $('#toast');
  tEl.textContent = m;
  tEl.style.background = isErr ? '#DC2626' : (currentTheme === 'dark' ? '#1e293b' : '#0F172A');
  tEl.classList.add('show');
  setTimeout(() => tEl.classList.remove('show'), 2800);
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
    toast(t('toastConnectingErr'), true);
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
    if ($('#officer-display-name')) $('#officer-display-name').textContent = currentLang === 'hi' ? 'प्रतिबंधित' : 'Restricted';
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
  const titleMap = {
    home: t('headerTitleHome'),
    vendor: t('headerTitleVendor'),
    officer: t('headerTitleOfficer')
  };
  $('#page-title').textContent = titleMap[view] || t('headerTitleHome');
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
  btn.textContent = t('verifyingCreds');
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
      toast(t('toastOfficerAuthSuccess'));
      nav('officer');
    } else {
      if (errorBox) {
        errorBox.textContent = data.error || t('loginError');
        errorBox.style.display = 'block';
      }
      toast(t('toastOfficerDenied'), true);
    }
  } catch (err) {
    if (errorBox) {
      errorBox.textContent = 'Server connection error during login';
      errorBox.style.display = 'block';
    }
  } finally {
    btn.disabled = false;
    btn.textContent = t('btnLogin');
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
    toast(t('toastOfficerLocked'));
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
  if (list.length) {
    const msg = currentLang === 'hi' 
      ? `${Math.min(list.length, 20)} दस्तावेज़ पैकेज में जोड़े गए` 
      : `${Math.min(list.length, 20)} document${list.length !== 1 ? 's' : ''} added to package`;
    toast(msg);
  }
}

function renderFiles() {
  const countStr = currentLang === 'hi' 
    ? `${files.length} फ़ाइलें` 
    : `${files.length} file${files.length !== 1 ? 's' : ''}`;
  $('#file-count').textContent = countStr;
  $('#verify').disabled = !files.length;
  $('#file-list').innerHTML = files.length ? files.map((f, i) => `
    <div class="file-row">
      <div class="file-icon">${f.name.split('.').pop().toUpperCase().slice(0, 4)}</div>
      <div class="file-info">
        <b>${esc(f.name)}</b>
        <small>${f.type} · ${Math.max(1, Math.round(f.size / 1024))} KB</small>
      </div>
      <span class="doc-label">${t('readyForInspection')}</span>
      <button class="row-action remove" onclick="removeFile(${i})">${t('removeBtn')}</button>
    </div>
  `).join('') : `<div class="empty">${t('emptyDocs')}</div>`;
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
      <div class="evidence-pipeline">
        ${parts.map((part, idx) => {
          const isFinal = idx === parts.length - 1;
          const isPass = part.includes('PASS') || part.includes('ACTIVE') || part.includes('VALID');
          const isFail = part.includes('FAIL') || part.includes('SUSPENDED') || part.includes('REJECTED');
          const chipClass = isFinal 
            ? (isPass ? 'final-pass' : isFail ? 'final-fail' : 'final-review') 
            : 'stage-step';
          return `<span class="pipeline-chip ${chipClass}">${esc(part)}</span>${idx < parts.length - 1 ? '<span class="pipeline-arrow">→</span>' : ''}`;
        }).join('')}
      </div>
    `;
  }
  return `<p class="evidence-text">${esc(evidenceText)}</p>`;
}

// ========================================================
// EXPLAIN WHY: ACCURATE DYNAMIC SCORING RATIONALE ENGINE
// ========================================================
function generateExplainWhy(b, lang = 'en') {
  if (!b) return '';
  const isHi = lang === 'hi';
  const m = b.matrix || {};
  const findings = b.findings || [];
  const flags = b.flags || [];

  // Check specific issues only when status is FAIL, REVIEW, or MISSING, or mentioned in flags/findings
  const nonPassChecks = Object.entries(m).filter(([k, v]) => v && v.status !== 'PASS');
  const defectText = nonPassChecks.map(([k, v]) => (v.label || '') + ' ' + (v.evidence || '')).join(' ') + ' ' + findings.join(' ') + ' ' + flags.join(' ');
  const defectTextLower = defectText.toLowerCase();

  const gstSuspended = defectTextLower.includes('suspended');
  const gstUnknown = defectTextLower.includes('not found in mock registry');
  const gstMissing = (m.gst && m.gst.status === 'MISSING') || defectTextLower.includes('no gstin');
  
  const panMissing = (m.pan && m.pan.status === 'MISSING') || defectTextLower.includes('no pan') || defectTextLower.includes('pan missing');
  const udyamMissing = (m.udyam && m.udyam.status === 'MISSING') || defectTextLower.includes('udyam registration missing') || defectTextLower.includes('no msme/udyam') || defectTextLower.includes('udyam certificate is missing');
  
  const hasExpired = defectTextLower.includes('expired') || defectTextLower.includes('lapsed');
  const hasMismatch = defectTextLower.includes('mismatch') || defectTextLower.includes('differs') || defectTextLower.includes('discrepancy');
  const hasBlank = defectTextLower.includes('blank') || defectTextLower.includes('unreadable');
  const hasCvc = defectTextLower.includes('cvc') || defectTextLower.includes('central vigilance commission');
  const hasEmdExpired = defectTextLower.includes('emd') && defectTextLower.includes('expired');

  // Build specific, honest findings
  let reasons = [];

  if (gstSuspended) {
    reasons.push(isHi ? 'जीएसटीआईएन (GSTIN) को कर प्राधिकारियों द्वारा निलंबित (Suspended) पाया गया है।' : 'GST registration was detected as SUSPENDED in mock registry records due to non-compliance.');
  }
  if (gstUnknown) {
    reasons.push(isHi ? 'निकाला गया जीएसटीआईएन प्रारूप में वैध है, परंतु यह आधिकारिक मॉक रजिस्ट्री में नहीं मिला।' : 'Extracted GSTIN format is syntactically valid but was NOT FOUND in the mock government registry.');
  }
  if (hasEmdExpired) {
    reasons.push(isHi ? 'ईएमडी बैंक गारंटी (EMD Guarantee) की वैधता समाप्त हो चुकी है।' : 'EMD Bank Guarantee has expired.');
  } else if (hasExpired) {
    reasons.push(isHi ? 'वैधानिक प्रमाणपत्र (कर निकासी या गुणवत्ता प्रमाणपत्र) की वैधता तिथि समाप्त (Expired) हो चुकी है।' : 'Statutory certificates (Tax clearance or quality accreditation) lapsed prior to bid submission.');
  }
  if (hasMismatch) {
    reasons.push(isHi ? 'दस्तावेज़ों और बोलीदाता प्रोफ़ाइल के बीच इकाई नाम या पते का बेमेल (Entity Mismatch) पाया गया।' : 'Entity name or address discrepancies detected between PAN, GSTIN, and bidder declaration.');
  }
  if (hasCvc) {
    reasons.push(isHi ? 'केंद्रीय सतर्कता आयोग (CVC) की प्रतिकूल निगरानी सूची में प्रविष्टि पाई गई।' : 'Central Vigilance Commission (CVC) adverse watch match detected.');
  }
  if (hasBlank) {
    reasons.push(isHi ? 'अपलोड किया गया दस्तावेज़ पैकेज खाली, अपठनीय या गैर-वैधानिक सामग्री वाला पाया गया।' : 'Uploaded document package was detected as blank, corrupted, or devoid of required statutory records.');
  }

  // Missing statutory docs
  let missingDocs = [];
  if (gstMissing) missingDocs.push('GST');
  if (panMissing) missingDocs.push('PAN');
  if (udyamMissing) missingDocs.push(isHi ? 'उद्यम (Udyam)' : 'Udyam');
  if (missingDocs.length > 0) {
    const listStr = missingDocs.join(', ');
    reasons.push(isHi ? `अनिवार्य वैधानिक दस्तावेज़ अनुपलब्ध हैं: ${listStr} प्रमाण संलग्न नहीं मिला।` : `Mandatory statutory evidence not found in upload package: ${listStr} certificate missing.`);
  }

  // If score is high and no violations
  if (b.score >= 85 && reasons.length === 0) {
    return isHi 
      ? 'उच्च अनुपालन स्कोर: सभी प्रस्तुत वैधानिक दस्तावेज़ (GSTN, PAN, MCA21, उद्यम) सक्रिय पाए गए तथा आधिकारिक मॉक रजिस्ट्री जांच में शून्य विसंगतियां दर्ज की गईं।'
      : 'High compliance score: zero discrepancies detected. All statutory certificates (GSTN, PAN, Udyam, MCA21) verified active and fully matched against government mock registries.';
  }

  // Moderate score without explicit fatal reasons
  if (reasons.length === 0) {
    if (b.score >= 60) {
      return isHi 
        ? 'मध्यम अनुपालन स्कोर: दस्तावेज़ों में ऐसे बिंदु पाए गए हैं जिनके लिए अधिकारी द्वारा अतिरिक्त सत्यापन और समीक्षा आवश्यक है।'
        : 'Moderate compliance score: submission satisfies core criteria but requires desk officer review for secondary supporting proofs.';
    } else {
      return isHi 
        ? 'कम अनुपालन स्कोर: वैधानिक आवश्यकताओं की पूर्ण पुष्टि नहीं हो सकी।'
        : 'Low compliance score: statutory requirements could not be fully substantiated from provided documents.';
    }
  }

  // Combine reasons
  const prefix = isHi 
    ? (b.score < 60 ? 'गंभीर जोखिम स्कोर का कारण: ' : 'स्कोरिंग विश्लेषण: ')
    : (b.score < 60 ? 'Critical risk rationale: ' : 'Scoring rationale: ');

  return prefix + reasons.join(' ');
}

// ACTUAL MULTIPART UPLOAD & REAL DOCUMENT VERIFICATION (NEVER AUTO-PASS)
$('#verify').onclick = async () => {
  if (!files.length) return;
  const verifyBtn = $('#verify');
  verifyBtn.disabled = true;
  verifyBtn.innerHTML = t('verifyingBtn');

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
      <div class="report-check-box">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <b class="matrix-label" style="font-size:12px;">${esc(localizeCheckLabel(k, m.label))}</b>
          <span class="badge ${m.status.toLowerCase()}" style="font-weight:800; padding:3px 9px; border-radius:4px; font-size:10px; letter-spacing:0.4px;">
            ${m.status}
          </span>
        </div>
        ${renderMultiStageEvidence(m.evidence)}
      </div>
    `).join('');

    const explainWhyText = generateExplainWhy(bidder, currentLang);

    $('#report').innerHTML = `
      <div class="report-top">
        <div class="score-ring" style="--score:${bidder.score * 3.6}deg"><b>${bidder.score}%</b></div>
        <div>
          <h3>${currentLang === 'hi' ? 'दस्तावेज़ सत्यापन परिणाम' : 'Document Verification Result'} <span class="risk ${bidder.risk.toLowerCase()}">${localizeRisk(bidder.risk)} ${t('riskSuffix')}</span></h3>
          <p>${currentLang === 'hi' ? 'बहु-स्तरीय सत्यापन: दस्तावेज़ निष्कर्षण → प्रारूप मान्यता → क्रॉस-मैच → मॉक रजिस्ट्री लुकअप।' : 'Multi-stage verification: Document Extraction → Format Validation → Cross-Match → Mock Registry Lookup.'}</p>
          <div style="margin-top:5px; font-size:11px; font-weight:700; color:#0369a1;">
            ${t('mockGovNotice')}
          </div>
        </div>
        <button class="secondary download" onclick="downloadPdfReport('${bidder.id}')">${currentLang === 'hi' ? 'दस्तावेज़ PDF डाउनलोड करें' : 'Download PDF Dossier'}</button>
      </div>

      <!-- EXPLAIN WHY IN VERIFICATION REPORT -->
      <div class="explain-why-box" style="margin-top:14px;">
        <b class="explain-why-title">${t('explainWhyTitle')}</b>
        <p class="explain-why-text">${esc(explainWhyText)}</p>
      </div>

      <div class="report-grid" style="margin-top:14px;">
        <div>
          <h3 style="margin-bottom:12px; font-size:12px; text-transform:uppercase;">${t('statutoryMatrixTitle')}</h3>
          ${matrixHtml}
        </div>
        <div>
          <h3 style="margin-bottom:12px; font-size:12px; text-transform:uppercase;">${t('discrepanciesTitle')}</h3>
          ${bidder.findings.length ? bidder.findings.map(x => `<div class="check-item"><span class="${x.includes('zero') || x.includes('passed') ? 'ok' : 'warn'}">${x.includes('zero') || x.includes('passed') ? '✓' : '!'}</span> ${esc(x)}</div>`).join('') : `<div class="check-item"><span class="ok">✓</span> ${t('noDiscrepanciesDetected')}</div>`}
          <div class="check-item" style="margin-top:12px; font-size:11px; color:#64748b;">
            <span class="ok">✓</span> ${t('mockGovNoticeSub')}
          </div>
        </div>
      </div>
    `;

    toast(`${t('toastVerifSuccess')}${localizeStatus(bidder.status)} (${bidder.score}%)`);
    $('#report').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    console.error(err);
    toast(t('toastVerifErr') + err.message, true);
  } finally {
    verifyBtn.disabled = false;
    verifyBtn.innerHTML = t('startVerifyBtn');
  }
};

// Download actual PDF report from backend
window.downloadPdfReport = function(id) {
  toast(t('toastPdfGenerating'));
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
        <span class="company" style="font-weight:700; display:block;">${esc(b.name)}</span>
        <span class="sub" style="font-size:11px;">${esc(b.gst)} · <span style="font-weight:600; color:#0369a1;">${esc(b.demoType || '')}</span></span>
      </td>
      <td>${esc(b.package)}<span class="sub" style="font-size:11px; display:block;">${b.docs} ${currentLang === 'hi' ? 'दस्तावेज़' : 'documents'}</span></td>
      <td><span class="score" style="font-weight:800; color:${b.score >= 80 ? '#16a34a' : b.score >= 60 ? '#ca8a04' : '#dc2626'}">${b.score}%</span></td>
      <td><span class="risk ${b.risk.toLowerCase()}">${localizeRisk(b.risk)}</span></td>
      <td><span class="status ${(b.status || '').replace(/\s+/g, '-').toLowerCase()}">${localizeStatus(b.status)}</span></td>
    </tr>
  `).join('') : `<tr><td colspan="5" class="empty">${t('noBiddersMatch')}</td></tr>`;

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
    <div class="matrix-card">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <b class="matrix-label" style="font-size:12px;">${esc(localizeCheckLabel(k, m.label))}</b>
        <span class="badge ${m.status.toLowerCase()}" style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:4px; letter-spacing:0.4px;">
          ${m.status}
        </span>
      </div>
      <div style="margin-top:4px;">
        ${renderMultiStageEvidence(m.evidence)}
      </div>
    </div>
  `).join('');

  const explainWhyText = generateExplainWhy(b, currentLang);

  $('#review-panel').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
      <div>
        <span class="eyebrow" style="color:#0284c7; font-weight:700; font-size:10px;">${t('bidderDossier')}</span>
        <h3 style="margin:2px 0 0 0; font-size:16px;">${esc(b.name)}</h3>
      </div>
      <button class="secondary" style="font-size:11px; padding:5px 12px;" onclick="downloadPdfReport('${b.id}')">${t('pdfReportBtn')}</button>
    </div>

    <div class="detail-meta" style="font-size:11px; margin-bottom:12px;">
      <b>GSTIN:</b> ${esc(b.gst)} · <b>PAN:</b> ${esc(b.pan || 'N/A')}<br>
      <b>${currentLang === 'hi' ? 'सत्यापन प्रकार:' : 'Verification Type:'}</b> <span style="color:#0369a1; font-weight:600;">${esc(b.typeDescription || b.demoType || '')}</span>
    </div>

    <div class="detail-score-box" style="margin-bottom:14px; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <b style="font-size:15px;">${b.score}% ${t('complianceLabel')}</b>
        <div class="detail-meta" style="font-size:11px;">${b.docs} ${t('documentsAnalyzed')}</div>
      </div>
      <span class="risk ${b.risk.toLowerCase()}">${localizeRisk(b.risk)} ${t('riskSuffix')}</span>
    </div>

    <!-- EXPLAIN WHY SECTION: STRICTLY GROUNDED IN FINDINGS -->
    <div class="explain-why-box" style="margin-bottom:14px;">
      <b class="explain-why-title">${t('explainWhyTitle')}</b>
      <p class="explain-why-text">
        ${esc(explainWhyText)}
      </p>
    </div>

    <!-- STATUTORY COMPLIANCE MATRIX -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0 0 8px 0;" class="audit-header">${t('statutoryMatrixTitle')}</h4>
      ${matrixHtml}
    </div>

    <!-- VERIFICATION FINDINGS -->
    <div style="margin-bottom:14px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0 0 6px 0;" class="audit-header">${t('discrepanciesTitle')}</h4>
      ${(b.findings || []).length ? b.findings.map(f => `<div class="check-item"><span class="${f.includes('zero') || f.includes('passed') ? 'ok' : 'warn'}">${f.includes('zero') || f.includes('passed') ? '✓' : '!'}</span> ${esc(f)}</div>`).join('') : `<div class="check-item"><span class="ok">✓</span> ${t('zeroDiscrepancies')}</div>`}
    </div>

    <!-- OFFICER DECISION BUTTONS -->
    <div style="margin-bottom:16px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0 0 6px 0;" class="audit-header">${t('officerDecisionTitle')}</h4>
      <div class="action-grid" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
        <button style="background:#16a34a; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Approved')">${t('btnApprove')}</button>
        <button style="background:#d97706; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Needs review')">${t('btnRequestMore')}</button>
        <button style="background:#dc2626; color:white; border:none; padding:9px; border-radius:6px; font-weight:700; cursor:pointer;" onclick="submitDecision('${b.id}', 'Flagged')">${t('btnFlag')}</button>
      </div>
    </div>

    <!-- HASH-CHAINED AUDIT TRAIL -->
    <div class="audit-box">
      <h4 class="audit-header" style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0 0 6px 0;">${t('auditTrailTitle')}</h4>
      ${(b.audit || []).map(a => `
        <div class="audit-item" style="font-size:11px; padding:5px 0;">
          <b>${esc(localizeAuditAction(a.action))}:</b> ${esc(a.user || 'System')} <span>(${esc(a.timestamp)})</span>
          ${a.remarks ? `<div>"${esc(a.remarks)}"</div>` : ''}
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
    toast(`${t('toastDecisionSuccess')}${localizeStatus(decision)}`);
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
      toast(t('toastDemoRestored'));
    }
  } catch (err) {
    toast(t('toastDemoResetErr'), true);
  }
};

['#search', '#status-filter', '#risk-filter'].forEach(x => {
  const el = $(x);
  if (el) el.addEventListener(x === '#search' ? 'input' : 'change', renderBidders);
});

// Theme and Language Event Listeners
const themeToggleBtn = $('#theme-toggle');
if (themeToggleBtn) {
  themeToggleBtn.onclick = () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };
}

const languageSelect = $('#language');
if (languageSelect) {
  languageSelect.onchange = (e) => {
    applyLanguage(e.target.value);
  };
}

// Initial Boot
setTheme(currentTheme);
applyLanguage(currentLang);
renderFiles();
checkOfficerSession();
fetchBidders();
