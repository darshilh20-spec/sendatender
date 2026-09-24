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

    // Submission Readiness & Officer Desk
    readinessTitle: 'Submission Readiness Assessment',
    readinessSubtitle: 'Statutory compliance validation before bid finalization',
    readinessReady: 'READY',
    readinessNotReady: 'NOT READY',
    readinessRequiresReview: 'REQUIRES REVIEW',
    readinessReadyDesc: 'All mandatory statutory requirements passed verification. No blocking compliance issues found.',
    readinessNotReadyDesc: 'Mandatory statutory deficiencies prevent bid submission. Resolve blocking items below.',
    readinessRequiresReviewDesc: 'Discrepancies or entity mismatches detected. Requires manual review or clarification.',
    tenderDeadlineLabel: 'Tender Closing Deadline',
    statPass: 'PASS',
    statReview: 'REVIEW',
    statFail: 'FAIL',
    statMissing: 'MISSING',
    statExpired: 'EXPIRED',
    blockersTitle: 'Submission Blockers (Mandatory)',
    reviewItemsTitle: 'Discrepancy / Review Items',
    prioritizedActionsTitle: 'Prioritized Remediation Actions',
    btnSimulateSubmit: 'Submit Bid (Simulation Mode)',
    btnSimulateSubmitted: '✓ Bid Submitted (Simulation Mode)',
    simulationNotice: '🔒 Simulation Mode: Submission is recorded locally in demo audit trail. Not submitted to real GeM.',
    notReadyWarning: 'Submission blocked: resolve mandatory failures and missing certificates before submitting.',
    officerNotesTitle: 'Officer Review Notes',
    officerNotesEmpty: 'No officer notes recorded yet for this bidder.',
    btnAddNote: 'Add Review Note',
    notePlaceholder: 'Enter official review remarks, observations, or directives...',
    btnResolveFinding: 'Resolve Discrepancy',
    findingResolvedLabel: '✓ Resolved by Officer',
    aiVerificationHeading: 'AI Statutory Verification Findings',
    officerDeskHeading: 'Officer Decision & Discretionary Review',

    // Phase 3: Officer Tabs & Bidder Comparison & Audit Trail
    officerTabDossiers: 'Individual Dossiers',
    officerTabComparison: 'Bidder Comparison Desk',
    officerTabAuditTrail: 'Hash-Chained Audit Trail',
    comparisonTitle: 'Comparative Bidder Compliance Matrix',
    comparisonSub: 'Side-by-side statutory screening and compliance analysis across all 5 active archetypes',
    thEntityId: 'ENTITY ID',
    thReadiness: 'READINESS',
    thBlockers: 'BLOCKERS',
    thReviewItems: 'REVIEW ITEMS',
    thStatutorySuite: 'STATUTORY SUITE',
    thAction: 'ACTION',
    btnOpenDossier: 'Open Dossier →',
    auditTrailSub: 'Cryptographically sealed, tamper-evident chronological event ledger (SHA-256 Chained)',
    auditFilterAllBidders: 'All Bidders',
    auditFilterAllActions: 'All Actions',
    auditFilterAllActors: 'All Actors',
    auditFilterUpload: 'Uploads',
    auditFilterVerification: 'Verification',
    auditFilterNotes: 'Officer Notes',
    auditFilterDecisions: 'Decisions',
    auditFilterSimulation: 'Simulation Submissions',
    auditActorSystem: 'System Engines',
    auditActorOfficer: 'Officer',
    auditActorVendor: 'Vendor Portal',
    auditSearchPlaceholder: 'Search event, actor, remarks, hash…',
    auditIntegrityBadge: 'Audit Integrity: Verified (SHA-256)',
    auditTamperBadge: 'Audit Integrity: Tamper Detected',
    emptyAuditTrail: 'No audit trail events match the selected criteria.',
    statutoryGst: 'GST',
    statutoryPan: 'PAN',
    statutoryUdyam: 'Udyam',
    statutoryMca: 'MCA',

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
    toastDecisionSuccess: 'Bidder successfully marked as ',

    // Tender Buddy AI Assistant
    tbTrigger: 'Tender Buddy',
    tbHeaderTitle: 'Tender Buddy',
    tbHeaderSub: 'AI Procurement Co-Pilot',
    tbInputPlaceholder: 'Ask about tenders, documents, compliance...',
    tbContextGeneral: 'Context: General Navigation',
    tbContextBidder: 'Context: Bidder Dossier (',
    tbContextVendor: 'Context: Vendor Submission Portal',
    tbContextOfficer: 'Context: Officer Review Desk',
    tbWelcome: "Hi! I'm Tender Buddy, your AI procurement co-pilot. How can I help you today? Ask me about statutory documents, compliance checks, risk status, or navigating SendaTender.",
    tbSuggDocs: '📄 What documents do I need?',
    tbSuggFail: '🔍 Why did my document fail?',
    tbSuggScore: '📊 Explain my compliance score',
    tbSuggSubmit: '📝 How do I submit my bid?',
    tbSuggOfficerExplain: '🔍 Explain this bidder',
    tbSuggOfficerFlag: '📊 Why is this bidder flagged?',
    tbSuggOfficerMissing: '📄 Which documents are missing?',
    tbSuggOfficerDecision: '⚖️ Explain the compliance result',
    tbSuggMissingDocs: '📄 What documents am I missing?',
    tbSuggUploadNext: '📤 What should I upload next?',
    tbSuggWhatFailed: '❌ What failed?',
    tbSuggWhyFail: '🔎 Why did it fail?',
    tbSuggHowFix: '🛠️ How do I fix it?',
    tbSuggNeedsReview: '⚠️ What needs review?',
    tbSuggWhyReview: '🔎 Why is this under review?',
    tbSuggScoreLow: '📊 Why is my score low?',
    tbSuggFixFirst: '➡️ What should I fix first?',
    tbSuggNextSteps: '➡️ What should I do next?',
    tbSuggReadySubmit: '✅ Am I ready to submit?',
    tbSuggShowSummary: '📋 Show my verification summary'
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

    // Submission Readiness & Officer Desk
    readinessTitle: 'प्रस्तुति तत्परता मूल्यांकन',
    readinessSubtitle: 'बोली को अंतिम रूप देने से पूर्व वैधानिक अनुपालन सत्यापन',
    readinessReady: 'READY (तैयार)',
    readinessNotReady: 'NOT READY (तैयार नहीं)',
    readinessRequiresReview: 'REQUIRES REVIEW (समीक्षा आवश्यक)',
    readinessReadyDesc: 'सभी अनिवार्य वैधानिक आवश्यकताएं पूरी तरह सत्यापित हैं। कोई अवरोधक मुद्दा नहीं मिला।',
    readinessNotReadyDesc: 'अनिवार्य वैधानिक कमियों के कारण बोली प्रस्तुत नहीं की जा सकती। नीचे दिए गए अवरोधों को दूर करें।',
    readinessRequiresReviewDesc: 'विसंगति या इकाई बेमेल का पता चला है। मैन्युअल समीक्षा अथवा स्पष्टीकरण आवश्यक है।',
    tenderDeadlineLabel: 'निविदा अंतिम तिथि व समय',
    statPass: 'सत्यापित (PASS)',
    statReview: 'समीक्षा (REVIEW)',
    statFail: 'विफल (FAIL)',
    statMissing: 'लापता (MISSING)',
    statExpired: 'समाप्त (EXPIRED)',
    blockersTitle: 'प्रस्तुति अवरोधक (अनिवार्य)',
    reviewItemsTitle: 'विसंगति / समीक्षा बिंदु',
    prioritizedActionsTitle: 'प्राथमिकता के आधार पर उपचारात्मक कदम',
    btnSimulateSubmit: 'बोली प्रस्तुत करें (सिमुलेशन मोड)',
    btnSimulateSubmitted: '✓ बोली प्रस्तुत (सिमुलेशन मोड)',
    simulationNotice: '🔒 सिमुलेशन मोड: प्रस्तुति स्थानीय ऑडिट ट्रेल में दर्ज की गई है। वास्तविक GeM पर नहीं भेजी गई।',
    notReadyWarning: 'प्रस्तुति अवरुद्ध: प्रस्तुत करने से पहले अनिवार्य विफलताओं और लापता प्रमाणपत्रों को ठीक करें।',
    officerNotesTitle: 'अधिकारी समीक्षा टिप्पणियां',
    officerNotesEmpty: 'इस बोलीदाता के लिए अभी तक कोई अधिकारी टिप्पणी दर्ज नहीं है।',
    btnAddNote: 'समीक्षा टिप्पणी जोड़ें',
    notePlaceholder: 'आधिकारिक समीक्षा टिप्पणी, टिप्पणियां या निर्देश दर्ज करें...',
    btnResolveFinding: 'विसंगति सुलझाएं',
    findingResolvedLabel: '✓ अधिकारी द्वारा सुलझाया गया',
    aiVerificationHeading: 'एआई वैधानिक सत्यापन निष्कर्ष',
    officerDeskHeading: 'अधिकारी निर्णय एवं विवेकाधीन समीक्षा',

    // Phase 3: Officer Tabs & Bidder Comparison & Audit Trail
    officerTabDossiers: 'व्यक्तिगत संचिकाएं',
    officerTabComparison: 'बोलीदाता तुलना डेस्क',
    officerTabAuditTrail: 'हैश-श्रृंखलाबद्ध ऑडिट ट्रेल',
    comparisonTitle: 'तुलनात्मक बोलीदाता अनुपालन मैट्रिक्स',
    comparisonSub: 'सभी 5 सक्रिय डेमो आर्केटाइप्स की साथ-साथ वैधानिक जांच एवं अनुपालन तुलना',
    thEntityId: 'इकाई आईडी',
    thReadiness: 'तत्परता',
    thBlockers: 'अवरोधक',
    thReviewItems: 'समीक्षा बिंदु',
    thStatutorySuite: 'वैधानिक सूट',
    thAction: 'कार्रवाई',
    btnOpenDossier: 'डोजियर खोलें →',
    auditTrailSub: 'क्रिप्टोग्राफ़िक रूप से सीलबंद, छेड़छाड़-प्रूफ कालानुक्रमिक घटना खाता (SHA-256 Chained)',
    auditFilterAllBidders: 'सभी बोलीदाता',
    auditFilterAllActions: 'सभी कार्रवाइयां',
    auditFilterAllActors: 'सभी कर्ता (Actors)',
    auditFilterUpload: 'अपलोड',
    auditFilterVerification: 'सत्यापन',
    auditFilterNotes: 'अधिकारी टिप्पणियां',
    auditFilterDecisions: 'निर्णय',
    auditFilterSimulation: 'सिमुलेशन प्रस्तुतियां',
    auditActorSystem: 'सिस्टम इंजन',
    auditActorOfficer: 'अधिकारी',
    auditActorVendor: 'विक्रेता पोर्टल',
    auditSearchPlaceholder: 'घटना, कर्ता, टिप्पणी, हैश खोजें…',
    auditIntegrityBadge: 'ऑडिट अखंडता: सत्यापित (SHA-256)',
    auditTamperBadge: 'ऑडिट अखंडता: छेड़छाड़ पाई गई',
    emptyAuditTrail: 'चयनित मानदंडों से मेल खाने वाली कोई ऑडिट प्रविष्टि नहीं मिली।',
    statutoryGst: 'GST',
    statutoryPan: 'PAN',
    statutoryUdyam: 'उद्यम',
    statutoryMca: 'MCA',

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
    toastDecisionSuccess: 'बोलीदाता की स्थिति सफलतापूर्वक दर्ज की गई: ',

    // Tender Buddy AI Assistant
    tbTrigger: 'टेंडर बडी',
    tbHeaderTitle: 'टेंडर बडी (Tender Buddy)',
    tbHeaderSub: 'एआई खरीद सह-पायलट',
    tbInputPlaceholder: 'निविदा, दस्तावेज़, अनुपालन के बारे में पूछें...',
    tbContextGeneral: 'संदर्भ: सामान्य नेविगेशन',
    tbContextBidder: 'संदर्भ: बोलीदाता डोजियर (',
    tbContextVendor: 'संदर्भ: विक्रेता प्रस्तुति पोर्टल',
    tbContextOfficer: 'संदर्भ: अधिकारी समीक्षा डेस्क',
    tbWelcome: 'नमस्ते! मैं टेंडर बडी हूँ, आपका एआई खरीद सह-पायलट। मैं आपकी कैसे सहायता कर सकता हूँ? मुझसे निविदा आवश्यकताओं, दस्तावेज़ सत्यापन, जोखिम स्थिति या सेंदातेंद्रे नेविगेशन के बारे में पूछें।',
    tbSuggDocs: '📄 मुझे कौन से दस्तावेज़ चाहिए?',
    tbSuggFail: '🔍 मेरा दस्तावेज़ क्यों विफल हुआ?',
    tbSuggScore: '📊 मेरा अनुपालन स्कोर स्पष्ट करें',
    tbSuggSubmit: '📝 मैं अपनी बोली कैसे जमा करूँ?',
    tbSuggOfficerExplain: '🔍 इस बोलीदाता को स्पष्ट करें',
    tbSuggOfficerFlag: '📊 यह बोलीदाता क्यों फ्लैग किया गया?',
    tbSuggOfficerMissing: '📄 कौन से दस्तावेज़ गायब हैं?',
    tbSuggOfficerDecision: '⚖️ अनुपालन परिणाम स्पष्ट करें',
    tbSuggMissingDocs: '📄 कौन से दस्तावेज़ गायब हैं?',
    tbSuggUploadNext: '📤 मुझे आगे क्या अपलोड करना चाहिए?',
    tbSuggWhatFailed: '❌ क्या विफल हुआ?',
    tbSuggWhyFail: '🔎 यह क्यों विफल हुआ?',
    tbSuggHowFix: '🛠️ इसे कैसे ठीक करें?',
    tbSuggNeedsReview: '⚠️ किसमें समीक्षा की आवश्यकता है?',
    tbSuggWhyReview: '🔎 यह समीक्षाधीन क्यों है?',
    tbSuggScoreLow: '📊 मेरा स्कोर कम क्यों है?',
    tbSuggFixFirst: '➡️ मुझे पहले क्या ठीक करना चाहिए?',
    tbSuggNextSteps: '➡️ मुझे आगे क्या करना चाहिए?',
    tbSuggReadySubmit: '✅ क्या मैं जमा करने के लिए तैयार हूँ?',
    tbSuggShowSummary: '📋 मेरा सत्यापन सारांश दिखाएं'
  },

  mr: {
    // Navigation & Brand
    navOverview: 'विहंगावलोकन',
    navVendor: 'विक्रेता पोर्टल',
    navOfficer: 'अधिकारी पोर्टल',
    sidebarNoteTitle: 'डेमो मोड सक्रिय',
    sidebarNoteDesc: 'सेंदातेंद्रे पूर्ण जेमिनी ओसीआर आणि थेट मॉक शासकीय तपासण्यांशी (GSTN, PAN, Udyam, MCA21, CVC) जोडलेले आहे.',
    headerEyebrow: 'खरेदी दस्तऐवज पडताळणी',
    headerTitleHome: 'निविदा अनुपालन कार्यक्षेत्र',
    headerTitleVendor: 'निविदा व विक्रेता दस्तऐवज अपलोड करा',
    headerTitleOfficer: 'अधिकारी आढावा डेस्क',

    // View 1: Overview
    heroPill: 'SIH 2026 · समस्या विधान 26100',
    heroTitle: 'निविदा दस्तऐवजांची पडताळणी करा एकाच एकत्रित कार्यक्षेत्रात.',
    heroDesc: 'सेंदातेंद्रे पेट्रोलियम आणि नैसर्गिक वायू मंत्रालय तसेच GeM अंतर्गत वैधानिक पडताळणी स्वयंचलित करते. हे GSTN, PAN, Udyam, MCA21 ची तपासणी करते, CVC बंदीचे मूल्यांकन करते, ऑडिटसाठी तयार अनुपालन संचिका तयार करते आणि स्वाक्षरीकृत PDF अहवाल जारी करते.',
    heroBtnUpload: 'पॅकेज अपलोड करा →',
    heroBtnOfficer: 'अधिकारी डेस्क उघडा',
    statBidders: 'सक्रिय बोलीदार',
    statBiddersSub: 'डेमो आर्केटाईप्स लोड केले',
    statScore: 'सरासरी अनुपालन',
    statScoreSub: 'सक्रिय बोलीदारांमध्ये',
    statReview: 'आढाव्यासाठी तयार',
    statReviewSub: 'अधिकारी निर्णयाच्या प्रतीक्षेत',
    feature1Title: 'विक्रेता सबमिशन',
    feature1Desc: 'NIT/RFP, BOQ, GST, PAN, उद्यम, ITR, बँक पुरावा आणि तांत्रिक प्रस्ताव एकाच पॅकेजमध्ये अपलोड करा.',
    feature2Title: 'स्वयंचलित स्क्रिनिंग',
    feature2Desc: 'एआय मेटाडेटा काढते, वैधानिक मॅट्रिक्सशी (PASS/FAIL/REVIEW/MISSING) जुळवून अनुपालन तपासते आणि तफावती दर्शवते.',
    feature3Title: 'अधिकारी निर्णय व ऑडिट',
    feature3Desc: 'अधिकारी वैधानिक पुरावे, स्पष्टीकरणयोग्य स्कोअरिंग तर्काची तपासणी करतात, निर्णय (मंजूर, अधिक माहिती मागवा, फ्लॅग) नोंदवतात आणि PDF अहवाल डाउनलोड करतात.',

    // View 2: Vendor Submission
    vendorEyebrow: 'विक्रेता पोर्टल',
    vendorHeading: 'तुमचे निविदा व विक्रेता पॅकेज सादर करा',
    vendorSubheading: 'निविदा व विक्रेता अनुपालन दस्तऐवज एकत्र अपलोड करा किंवा प्रत्येक फाईल स्वतंत्रपणे जोडा.',
    vendorPill: 'डेमो मोड · जेमिनी मॉक इंजिन',
    step1: 'अपलोड',
    step2: 'पडताळणी',
    step3: 'आढाव्यासाठी सज्ज',
    statutoryChecklist: 'वैधानिक चेकलिस्ट',
    checklistTender: '१. निविदा दस्तऐवज — NIT/RFP, निविदा सूचना, तपशील, BOQ',
    checklistVendor: '२. विक्रेता दस्तऐवज — GST, PAN, उद्यम/MSME, ITR, बँक पुरावा, तांत्रिक प्रस्ताव',
    profileCardTitle: 'विक्रेता प्रोफाईल व वैधानिक घोषणा',
    profileCardTag: 'पर्यायी घोषणा',
    profileCardDesc: 'अपलोड केलेल्या दस्तऐवजांशी पडताळणी करण्यासाठी घोषित आस्थापनेचा तपशील प्रविष्ट करा. रिक्त ठेवल्यास, प्रणाली दस्तऐवजांतून माहिती स्वतः काढते.',
    labelEntityName: 'कायदेशीर आस्थापनेचे नाव',
    labelGstin: 'GSTIN (पर्यायी)',
    labelPan: 'PAN (पर्यायी)',
    labelUdyam: 'उद्यम क्रमांक (पर्यायी)',
    labelAddress: 'नोंदणीकृत व्यावसायिक पत्ता (पर्यायी)',
    dropzoneTitle: 'निविदा व विक्रेता दस्तऐवज अपलोड करा',
    dropzoneDesc: 'संपूर्ण पॅकेज एकाच वेळी निवडा, किंवा',
    browseFiles: 'फाईल्स ब्राउझ करा',
    dropzoneSmall: 'PDF, JPG, PNG, DOC · कमाल २० फाईल्स · एक्सप्रेस बॅकएंड प्रक्रिया',
    orText: 'किंवा',
    singleDocTitle: 'स्वतंत्र दस्तऐवज जोडा',
    singleDocDesc: 'दस्तऐवजाचा प्रकार निवडा, नंतर त्याची फाईल निवडा.',
    autoDetect: 'दस्तऐवज प्रकार स्वयंचलित ओळखा',
    chooseFileBtn: 'फाईल निवडा',
    docsCardTitle: 'तुमचे दस्तऐवज',
    docsCardSub: 'जेमिनी ओसीआर आणि वैधानिक मॅट्रिक्स पडताळणी',
    startVerifyBtn: 'एआय पडताळणी सुरू करा →',
    verifyingBtn: 'दस्तऐवजांतील मजकुराचे विश्लेषण व पडताळणी सुरू आहे...',
    emptyDocs: 'तुम्ही अपलोड केलेले दस्तऐवज येथे दिसतील.',
    readyForInspection: 'तपासणीसाठी तयार',
    removeBtn: 'काढून टाका',
    mockGovNotice: '🔒 मॉक शासकीय तपासणी — SIH डेमो (API Setu / GSTN / NSDL PAN / Udyam / MCA21)',
    mockGovNoticeSub: 'मॉक वैधानिक नोंदणी पुस्तिकेनुसार मूल्यमापन केले',

    // View 3: Officer Portal
    officerEyebrow: 'अधिकारी पोर्टल',
    officerHeading: 'बोलीदार आढावा डेस्क व अनुपालन ऑडिट',
    officerSubheading: 'अनुपालन मॅट्रिक्स, स्पष्टीकरणयोग्य स्कोअर, वैधानिक पुराव्यांची तपासणी करा आणि निर्णय घ्या.',
    resetDemoBtn: 'डेमो डेटा रीसेट करा',
    logoutBtn: 'लॉक / लॉग आउट',
    filterAllStatus: 'सर्व स्थिती',
    filterAllRisk: 'सर्व जोखीम स्तर',
    thBidder: 'बोलीदार / आर्केटाईप',
    thPackage: 'पॅकेज',
    thCompliance: 'अनुपालन',
    thRisk: 'जोखीम',
    thStatus: 'स्थिती',
    emptyReviewPanel: 'पडताळणी नोंद पाहण्यासाठी कोणत्याही बोलीदाराची निवड करा.',
    bidderDossier: 'बोलीदार संचिका',
    pdfReportBtn: '📄 PDF अहवाल',
    complianceLabel: 'अनुपालन',
    documentsAnalyzed: 'वैधानिक दस्तऐवजांचे विश्लेषण केले',
    explainWhyTitle: '💡 कारण स्पष्ट करा: स्कोअरिंग तर्क',
    statutoryMatrixTitle: 'वैधानिक अनुपालन मॅट्रिक्स',
    discrepanciesTitle: 'तफावती व निष्कर्ष',
    officerDecisionTitle: 'अधिकारी निर्णय पॅनल',
    auditTrailTitle: 'हॅश-साखळीबद्ध ऑडिट ट्रेल',
    btnApprove: 'मंजूर करा',
    btnRequestMore: 'अधिक माहिती मागवा',
    btnFlag: 'फ्लॅग करा',
    zeroDiscrepancies: 'या सादरीकरणात कोणतीही तफावत आढळली नाही',
    noDiscrepanciesDetected: 'कोणतीही महत्त्वपूर्ण तफावत आढळली नाही',
    noBiddersMatch: 'या फिल्टर्सशी कोणताही बोलीदार जुळत नाही.',

    // Modal
    modalEyebrow: 'मर्यादित खरेदी प्रवेश',
    modalTitle: 'अधिकारी पोर्टल पडताळणी',
    modalDesc: 'गोपनीय बोलीदार संचिका, वैधानिक मूल्यमापन आणि निर्णय नोंदणी पाहण्यासाठी आपले अधिकृत क्रेडेन्शियल्स प्रविष्ट करा.',
    loginError: 'अवैध अधिकारी क्रेडेन्शियल्स. प्रवेश नाकारला.',
    labelOfficerId: 'अधिकारी आयडी',
    labelOfficerPass: 'पासवर्ड',
    btnCancel: 'रद्द करा',
    btnLogin: 'लॉगिन करा →',
    verifyingCreds: 'क्रेडेन्शियल्सची पडताळणी होत आहे...',

    // Statuses & Risks
    statusReady: 'आढाव्यासाठी तयार',
    statusNeedsReview: 'आढावा आवश्यक',
    statusApproved: 'मंजूर',
    statusFlagged: 'फ्लॅग केलेले',
    riskLow: 'कमी',
    riskMedium: 'मध्यम',
    riskHigh: 'उच्च',
    riskSuffix: 'जोखीम',

    // Submission Readiness & Officer Desk
    readinessTitle: 'सादरीकरण सज्जता मूल्यमापन',
    readinessSubtitle: 'बोली अंतिम करण्यापूर्वी वैधानिक अनुपालन पडताळणी',
    readinessReady: 'READY (सज्ज)',
    readinessNotReady: 'NOT READY (सज्ज नाही)',
    readinessRequiresReview: 'REQUIRES REVIEW (आढावा आवश्यक)',
    readinessReadyDesc: 'सर्व अनिवार्य वैधानिक आवश्यकता यशस्वीरित्या पडताळल्या गेल्या आहेत. कोणतीही अडचण नाही.',
    readinessNotReadyDesc: 'अनिवार्य वैधानिक त्रुटींमुळे बोली सादर केली जाऊ शकत नाही. खालील अडथळे दूर करा.',
    readinessRequiresReviewDesc: 'काही बाबींमध्ये तफावत आढळली आहे. मॅन्युअल आढावा किंवा स्पष्टीकरण आवश्यक आहे.',
    tenderDeadlineLabel: 'निविदा अंतिम मुदत',
    statPass: 'उत्तीर्ण (PASS)',
    statReview: 'आढावा (REVIEW)',
    statFail: 'अयशस्वी (FAIL)',
    statMissing: 'गहाळ (MISSING)',
    statExpired: 'मुदत संपली (EXPIRED)',
    blockersTitle: 'सादरीकरण अडथळे (अनिवार्य)',
    reviewItemsTitle: 'तफावत / आढावा बाबी',
    prioritizedActionsTitle: 'प्राधान्याने करावयाच्या सुधारणा',
    btnSimulateSubmit: 'बोली सादर करा (सिम्युलेशन मोड)',
    btnSimulateSubmitted: '✓ बोली सादर केली (सिम्युलेशन मोड)',
    simulationNotice: '🔒 सिम्युलेशन मोड: सादरीकरण स्थानिक ऑडिट ट्रेलमध्ये नोंदवले आहे. वास्तविक GeM वर पाठवले नाही.',
    notReadyWarning: 'सादरीकरण रोखले: सादर करण्यापूर्वी अनिवार्य अपयश आणि गहाळ प्रमाणपत्रे दुरुस्त करा.',
    officerNotesTitle: 'अधिकारी आढावा नोंदी',
    officerNotesEmpty: 'या बोलीदारासाठी अद्याप कोणतीही अधिकारी नोंद केलेली नाही.',
    btnAddNote: 'आढावा नोंद जोडा',
    notePlaceholder: 'अधिकृत आढावा शेरा, निरीक्षणे किंवा सूचना प्रविष्ट करा...',
    btnResolveFinding: 'तफावत सोडवा',
    findingResolvedLabel: '✓ अधिकाऱ्याद्वारे सोडवले',
    aiVerificationHeading: 'एआय वैधानिक पडताळणी निष्कर्ष',
    officerDeskHeading: 'अधिकारी निर्णय व स्वेच्छाधिकार आढावा',

    // Phase 3: Officer Tabs & Bidder Comparison & Audit Trail
    officerTabDossiers: 'वैयक्तिक संचिका',
    officerTabComparison: 'बोलीदार तुलना डेस्क',
    officerTabAuditTrail: 'हॅश-साखळीबद्ध ऑडिट ट्रेल',
    comparisonTitle: 'तुलनात्मक बोलीदार अनुपालन मॅट्रिक्स',
    comparisonSub: 'सर्व ५ सक्रिय डेमो आर्केटाईप्सची एकाच वेळी वैधानिक तपासणी आणि अनुपालन तुलना',
    thEntityId: 'आस्थापना आयडी',
    thReadiness: 'सज्जता',
    thBlockers: 'अडथळे',
    thReviewItems: 'आढावा बाबी',
    thStatutorySuite: 'वैधानिक संच',
    thAction: 'कृती',
    btnOpenDossier: 'संचिका उघडा →',
    auditTrailSub: 'क्रिप्टोग्राफिकली सुरक्षित, फेरफार-प्रतिरोधक कालक्रमानुसार घटना नोंदवही (SHA-256 Chained)',
    auditFilterAllBidders: 'सर्व बोलीदार',
    auditFilterAllActions: 'सर्व कृती',
    auditFilterAllActors: 'सर्व कर्ते (Actors)',
    auditFilterUpload: 'अपलोड्स',
    auditFilterVerification: 'पडताळणी',
    auditFilterNotes: 'अधिकारी नोंदी',
    auditFilterDecisions: 'निर्णय',
    auditFilterSimulation: 'सिम्युलेशन सादरीकरण',
    auditActorSystem: 'सिस्टम इंजिन',
    auditActorOfficer: 'अधिकारी',
    auditActorVendor: 'विक्रेता पोर्टल',
    auditSearchPlaceholder: 'घटना, कर्ता, शेरा, हॅश शोधा…',
    auditIntegrityBadge: 'ऑडिट अखंडता: सत्यापित (SHA-256)',
    auditTamperBadge: 'ऑडिट अखंडता: फेरफार आढळली',
    emptyAuditTrail: 'निवडलेल्या निकषांनुसार कोणतीही ऑडिट नोंद आढळली नाही.',
    statutoryGst: 'GST',
    statutoryPan: 'PAN',
    statutoryUdyam: 'उद्यम',
    statutoryMca: 'MCA',

    // Matrix Checks
    checkGst: 'GSTN नोंदणी तपासणी',
    checkPan: 'PAN ओळख तपासणी',
    checkUdyam: 'उद्यम MSME नोंदणी',
    checkMca: 'MCA21 कंपनी स्थिती',
    checkDocuments: 'वैधानिक दस्तऐवज संच',

    // Toasts
    toastConnectingErr: 'सेंदातेंद्रे बॅकएंडशी जोडणी करताना त्रुटी आली',
    toastOfficerAuthSuccess: 'अधिकारी यशस्वीरित्या प्रमाणित झाले',
    toastOfficerDenied: 'प्रवेश नाकारला: अवैध क्रेडेन्शियल्स',
    toastOfficerLocked: 'अधिकारी कार्यक्षेत्र लॉक केले',
    toastPdfGenerating: 'अधिकृत PDF अहवाल तयार होत आहे...',
    toastDemoRestored: 'बॅकएंडवरून डेमो बोलीदार पुनर्प्राप्त केले',
    toastDemoResetErr: 'डेमो बोलीदार रीसेट करताना त्रुटी आली',
    toastVerifSuccess: 'पडताळणी पूर्ण झाली: ',
    toastVerifErr: 'पडताळणी विनंती अयशस्वी: ',
    toastDecisionSuccess: 'बोलीदाराची स्थिती यशस्वीरित्या नोंदवली: ',

    // Tender Buddy AI Assistant
    tbTrigger: 'टेंडर बडी',
    tbHeaderTitle: 'टेंडर बडी (Tender Buddy)',
    tbHeaderSub: 'एआय खरेदी सह-पायलट',
    tbInputPlaceholder: 'निविदा, दस्तऐवज, अनुपालनाबद्दल विचारा...',
    tbContextGeneral: 'संदर्भ: सामान्य नेव्हिगेशन',
    tbContextBidder: 'संदर्भ: बोलीदार संचिका (',
    tbContextVendor: 'संदर्भ: विक्रेता सादरीकरण पोर्टल',
    tbContextOfficer: 'संदर्भ: अधिकारी आढावा डेस्क',
    tbWelcome: 'नमस्कार! मी टेंडर बडी आहे, तुमचा एआय खरेदी सह-पायलट. मी तुमची कशी मदत करू शकतो? मला वैधानिक दस्तऐवज, अनुपालन तपासणी, जोखीम स्थिती किंवा सेंदातेंद्रे नेव्हिगेशनबद्दल विचारा.',
    tbSuggDocs: '📄 मला कोणती कागदपत्रे हवी आहेत?',
    tbSuggFail: '🔍 माझे दस्तऐवज का अयशस्वी झाले?',
    tbSuggScore: '📊 माझा अनुपालन स्कोअर स्पष्ट करा',
    tbSuggSubmit: '📝 मी माझी बोली कशी सादर करावी?',
    tbSuggOfficerExplain: '🔍 या बोलीदाराबद्दल सांगा',
    tbSuggOfficerFlag: '📊 हा बोलीदार का फ्लॅग केला आहे?',
    tbSuggOfficerMissing: '📄 कोणते दस्तऐवज गहाळ आहेत?',
    tbSuggOfficerDecision: '⚖️ अनुपालन निकाल स्पष्ट करा',
    tbSuggMissingDocs: '📄 कोणते दस्तऐवज गहाळ आहेत?',
    tbSuggUploadNext: '📤 मी पुढे काय अपलोड करावे?',
    tbSuggWhatFailed: '❌ काय अयशस्वी झाले?',
    tbSuggWhyFail: '🔎 हे का अयशस्वी झाले?',
    tbSuggHowFix: '🛠️ हे कसे दुरुस्त करावे?',
    tbSuggNeedsReview: '⚠️ कशाचा आढावा आवश्यक आहे?',
    tbSuggWhyReview: '🔎 हा आढाव्याखाली का आहे?',
    tbSuggScoreLow: '📊 माझा स्कोअर का कमी आहे?',
    tbSuggFixFirst: '➡️ मी आधी काय दुरुस्त करावे?',
    tbSuggNextSteps: '➡️ मी पुढे काय करावे?',
    tbSuggReadySubmit: '✅ मी सादर करण्यास सज्ज आहे का?',
    tbSuggShowSummary: '📋 माझा पडताळणी सारांश दाखवा'
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
  if (currentLang === 'mr') {
    if (action.includes('Verification Completed')) return 'एआय पडताळणी पूर्ण झाली';
    if (action.includes('Package Submitted') || action.includes('Package Uploaded')) return 'पॅकेज विक्रेत्याद्वारे सादर केले';
    if (action.includes('Flagged for Missing')) return 'गहाळ दस्तऐवजांसाठी फ्लॅग केले';
    if (action.includes('Expiry Detection')) return 'मुदत संपल्याची चेतावणी जारी केली';
    if (action.includes('Entity Mismatch')) return 'आस्थापना नाव/पत्ता तफावत चेतावणी';
    if (action.includes('Auto-Flagged')) return 'स्वयंचलित फ्लॅग (गंभीर उल्लंघन)';
    if (action.includes('Officer Decision')) return 'अधिकारी निर्णय नोंदवला';
    return action;
  }
  if (currentLang === 'hi') {
    if (action.includes('Verification Completed')) return 'एआई सत्यापन पूर्ण हुआ';
    if (action.includes('Package Submitted') || action.includes('Package Uploaded')) return 'पैकेज विक्रेता द्वारा जमा किया गया';
    if (action.includes('Flagged for Missing')) return 'लापता विसंगति के लिए फ्लैग किया गया';
    if (action.includes('Expiry Detection')) return 'समाप्ति चेतावनी जारी की गई';
    if (action.includes('Entity Mismatch')) return 'इकाई बेमेल चेतावनी सक्रिय';
    if (action.includes('Auto-Flagged')) return 'स्वतः फ्लैग (गंभीर उल्लंघन)';
    if (action.includes('Officer Decision')) return 'अधिकारी निर्णय दर्ज';
    return action;
  }
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
  if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
  if (typeof renderTenderBuddySuggestions === 'function') renderTenderBuddySuggestions();
  if (typeof currentOfficerTab !== 'undefined') {
    if (currentOfficerTab === 'comparison') renderComparisonTable();
    else if (currentOfficerTab === 'audit') {
      populateAuditBidderFilter();
      renderAuditTrail();
    }
  }
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
    if ($('#officer-display-name')) $('#officer-display-name').textContent = currentLang === 'mr' ? 'मर्यादित' : currentLang === 'hi' ? 'प्रतिबंधित' : 'Restricted';
    if ($('#officer-avatar')) $('#officer-avatar').textContent = '🔒';
  }
  if (typeof renderTenderBuddySuggestions === 'function') renderTenderBuddySuggestions();
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
  if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
  if (typeof renderTenderBuddySuggestions === 'function') renderTenderBuddySuggestions();
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
      switchOfficerTab('dossiers');
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
    switchOfficerTab('dossiers');
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
  if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
  if (list.length) {
    const msg = currentLang === 'mr'
      ? `${Math.min(list.length, 20)} दस्तऐवज पॅकेजमध्ये जोडले`
      : currentLang === 'hi' 
        ? `${Math.min(list.length, 20)} दस्तावेज़ पैकेज में जोड़े गए` 
        : `${Math.min(list.length, 20)} document${list.length !== 1 ? 's' : ''} added to package`;
    toast(msg);
  }
}

function renderFiles() {
  const countStr = currentLang === 'mr'
    ? `${files.length} फाईल्स`
    : currentLang === 'hi' 
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
  if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
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
  const isMr = lang === 'mr';
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
    if (isMr) {
      reasons.push('कर प्राधिकरणाकडून GSTIN नोंदणी निलंबित (Suspended) आढळली आहे.');
    } else if (isHi) {
      reasons.push('जीएसटीआईएन (GSTIN) को कर प्राधिकारियों द्वारा निलंबित (Suspended) पाया गया है।');
    } else {
      reasons.push('GST registration was detected as SUSPENDED in mock registry records due to non-compliance.');
    }
  }
  if (gstUnknown) {
    if (isMr) {
      reasons.push('काढलेला GSTIN संरचनेनुसार वैध आहे, परंतु अधिकृत मॉक शासकीय नोंदणी पुस्तिकेत आढळला नाही.');
    } else if (isHi) {
      reasons.push('निकाला गया जीएसटीआईएन प्रारूप में वैध है, परंतु यह आधिकारिक मॉक रजिस्ट्री में नहीं मिला।');
    } else {
      reasons.push('Extracted GSTIN format is syntactically valid but was NOT FOUND in the mock government registry.');
    }
  }
  if (hasEmdExpired) {
    if (isMr) {
      reasons.push('ईएमडी बँक हमीची (EMD Bank Guarantee) मुदत संपलेली आहे.');
    } else if (isHi) {
      reasons.push('ईएमडी बैंक गारंटी (EMD Guarantee) की वैधता समाप्त हो चुकी है।');
    } else {
      reasons.push('EMD Bank Guarantee has expired.');
    }
  } else if (hasExpired) {
    if (isMr) {
      reasons.push('वैधानिक प्रमाणपत्राची (कर मंजुरी किंवा गुणवत्ता प्रमाणपत्र) वैधता मुदत संपलेली (Expired) आहे.');
    } else if (isHi) {
      reasons.push('वैधानिक प्रमाणपत्र (कर निकासी या गुणवत्ता प्रमाणपत्र) की वैधता तिथि समाप्त (Expired) हो चुकी है।');
    } else {
      reasons.push('Statutory certificates (Tax clearance or quality accreditation) lapsed prior to bid submission.');
    }
  }
  if (hasMismatch) {
    if (isMr) {
      reasons.push('सादर दस्तऐवज आणि बोलीदार प्रोफाईलमध्ये आस्थापना नाव किंवा पत्त्यामध्ये तफावत (Entity Mismatch) आढळली.');
    } else if (isHi) {
      reasons.push('दस्तावेज़ों और बोलीदाता प्रोफ़ाइल के बीच इकाई नाम या पते का बेमेल (Entity Mismatch) पाया गया।');
    } else {
      reasons.push('Entity name or address discrepancies detected between PAN, GSTIN, and bidder declaration.');
    }
  }
  if (hasCvc) {
    if (isMr) {
      reasons.push('केंद्रीय दक्षता आयोगाच्या (CVC) प्रतिकूल वॉचलिस्टमध्ये नोंद आढळली.');
    } else if (isHi) {
      reasons.push('केंद्रीय सतर्कता आयोग (CVC) की प्रतिकूल निगरानी सूची में प्रविष्टि पाई गई।');
    } else {
      reasons.push('Central Vigilance Commission (CVC) adverse watch match detected.');
    }
  }
  if (hasBlank) {
    if (isMr) {
      reasons.push('अपलोड केलेले दस्तऐवज पॅकेज रिकामे, अस्पष्ट किंवा आवश्यक वैधानिक नोंदी नसलेले आढळले.');
    } else if (isHi) {
      reasons.push('अपलोड किया गया दस्तावेज़ पैकेज खाली, अपठनीय या गैर-वैधानिक सामग्री वाला पाया गया।');
    } else {
      reasons.push('Uploaded document package was detected as blank, corrupted, or devoid of required statutory records.');
    }
  }

  // Missing statutory docs
  let missingDocs = [];
  if (gstMissing) missingDocs.push('GST');
  if (panMissing) missingDocs.push('PAN');
  if (udyamMissing) missingDocs.push(isMr ? 'उद्यम (Udyam)' : isHi ? 'उद्यम (Udyam)' : 'Udyam');
  if (missingDocs.length > 0) {
    const listStr = missingDocs.join(', ');
    if (isMr) {
      reasons.push(`अनिवार्य वैधानिक दस्तऐवज गहाळ आहेत: ${listStr} प्रमाणपत्र जोडलेले आढळले नाही.`);
    } else if (isHi) {
      reasons.push(`अनिवार्य वैधानिक दस्तावेज़ अनुपलब्ध हैं: ${listStr} प्रमाण संलग्न नहीं मिला।`);
    } else {
      reasons.push(`Mandatory statutory evidence not found in upload package: ${listStr} certificate missing.`);
    }
  }

  // If score is high and no violations
  if (b.score >= 85 && reasons.length === 0) {
    if (isMr) {
      return 'उच्च अनुपालन स्कोअर: शून्य तफावत आढळली. सर्व वैधानिक प्रमाणपत्रे (GSTN, PAN, Udyam, MCA21) सक्रिय आढळली असून शासकीय मॉक नोंदणी पुस्तिकेशी पूर्णपणे जुळली आहेत.';
    } else if (isHi) {
      return 'उच्च अनुपालन स्कोर: सभी प्रस्तुत वैधानिक दस्तावेज़ (GSTN, PAN, MCA21, उद्यम) सक्रिय पाए गए तथा आधिकारिक मॉक रजिस्ट्री जांच में शून्य विसंगतियां दर्ज की गईं।';
    } else {
      return 'High compliance score: zero discrepancies detected. All statutory certificates (GSTN, PAN, Udyam, MCA21) verified active and fully matched against government mock registries.';
    }
  }

  // Moderate score without explicit fatal reasons
  if (reasons.length === 0) {
    if (b.score >= 60) {
      if (isMr) {
        return 'मध्यम अनुपालन स्कोअर: सादरीकरण मुख्य निकष पूर्ण करते परंतु दुय्यम पुराव्यांसाठी डेस्क अधिकाऱ्याकडून आढावा आवश्यक आहे.';
      } else if (isHi) {
        return 'मध्यम अनुपालन स्कोर: दस्तावेज़ों में ऐसे बिंदु पाए गए हैं जिनके लिए अधिकारी द्वारा अतिरिक्त सत्यापन और समीक्षा आवश्यक है।';
      } else {
        return 'Moderate compliance score: submission satisfies core criteria but requires desk officer review for secondary supporting proofs.';
      }
    } else {
      if (isMr) {
        return 'कमी अनुपालन स्कोअर: दिलेल्या दस्तऐवजांवरून वैधानिक आवश्यकता पूर्ण सिद्ध करता आल्या नाहीत.';
      } else if (isHi) {
        return 'कम अनुपालन स्कोर: वैधानिक आवश्यकताओं की पूर्ण पुष्टि नहीं हो सकी।';
      } else {
        return 'Low compliance score: statutory requirements could not be fully substantiated from provided documents.';
      }
    }
  }

  // Combine reasons
  const prefix = isMr
    ? (b.score < 60 ? 'गंभीर जोखीम स्कोअरचे कारण: ' : 'स्कोअरिंग विश्लेषण: ')
    : isHi 
      ? (b.score < 60 ? 'गंभीर जोखिम स्कोर का कारण: ' : 'स्कोरिंग विश्लेषण: ')
      : (b.score < 60 ? 'Critical risk rationale: ' : 'Scoring rationale: ');

  return prefix + reasons.join(isMr ? '; ' : isHi ? '; ' : '; ');
}

// ========================================================
// SINGLE SOURCE OF TRUTH: SUBMISSION READINESS CALCULATOR
// ========================================================
function calculateSubmissionReadiness(bidder) {
  if (!bidder) {
    return {
      status: 'NOT READY',
      isReady: false,
      score: 0,
      risk: 'N/A',
      counts: { pass: 0, review: 0, fail: 0, missing: 8, expired: 0 },
      blockers: ['No active bidder submission package loaded.'],
      reviewItems: [],
      prioritizedActions: ['Upload vendor compliance documents in the Vendor Portal.'],
      deadline: '28-Feb-2026 15:00 IST',
      isDemoSubmitted: false,
      submissionTimestamp: null
    };
  }

  const m = bidder.matrix || {};
  const findings = bidder.findings || [];
  const flags = bidder.flags || [];
  const audit = bidder.audit || [];
  const docEvidence = (m.documents?.evidence || '') + ' ' + findings.join(' ') + ' ' + flags.join(' ');
  const docEvidenceLower = docEvidence.toLowerCase();

  const isExpired = (docEvidenceLower.includes('expired') && !docEvidenceLower.includes('unexpired')) || docEvidenceLower.includes('lapsed');
  const isEmdLapsed = (docEvidenceLower.includes('emd') && docEvidenceLower.includes('expired') && !docEvidenceLower.includes('unexpired')) || docEvidenceLower.includes('emd lapsed');
  const isMismatch = m.pan?.status === 'REVIEW' || docEvidenceLower.includes('mismatch') || docEvidenceLower.includes('differs');
  const isItrMissing = m.documents?.status === 'MISSING' || docEvidenceLower.includes('itr missing') || docEvidenceLower.includes('itr not attached');

  const isGstPass = m.gst?.status === 'PASS';
  const isGstFail = m.gst?.status === 'FAIL';
  const isGstReview = m.gst?.status === 'REVIEW';
  const isGstMissing = m.gst?.status === 'MISSING' || !bidder.gst;

  const isPanPass = m.pan?.status === 'PASS';
  const isPanFail = m.pan?.status === 'FAIL';
  const isPanReview = m.pan?.status === 'REVIEW';
  const isPanMissing = m.pan?.status === 'MISSING' || !bidder.pan;

  const isUdyamPass = m.udyam?.status === 'PASS';
  const isUdyamFail = m.udyam?.status === 'FAIL';
  const isUdyamReview = m.udyam?.status === 'REVIEW';
  const isUdyamMissing = m.udyam?.status === 'MISSING' || !bidder.udyam;

  const isMcaPass = m.mca?.status === 'PASS';
  const isMcaFail = m.mca?.status === 'FAIL';
  const isMcaReview = m.mca?.status === 'REVIEW';
  const isMcaMissing = m.mca?.status === 'MISSING' || !bidder.mca;

  const docMatrixStatus = m.documents?.status || 'REVIEW';

  // 8 Canonical Checks:
  // 1. GST, 2. PAN, 3. UDYAM, 4. MCA, 5. ITR, 6. BALANCE_SHEET, 7. EMD, 8. NIT_BOQ
  let passCount = 0, reviewCount = 0, failCount = 0, missingCount = 0;
  if (isGstPass) passCount++; else if (isGstReview) reviewCount++; else if (isGstFail) failCount++; else missingCount++;
  if (isPanPass) passCount++; else if (isPanReview) reviewCount++; else if (isPanFail) failCount++; else missingCount++;
  if (isUdyamPass) passCount++; else if (isUdyamReview) reviewCount++; else if (isUdyamFail) failCount++; else missingCount++;
  if (isMcaPass) passCount++; else if (isMcaReview) reviewCount++; else if (isMcaFail) failCount++; else missingCount++;
  
  if (isItrMissing) missingCount++; else if (docMatrixStatus === 'PASS') passCount++; else reviewCount++;
  if (isExpired) failCount++; else if (isMismatch) reviewCount++; else if (docMatrixStatus === 'PASS') passCount++; else reviewCount++;
  if (isEmdLapsed) failCount++; else if (docMatrixStatus === 'PASS' || isUdyamPass) passCount++; else reviewCount++;
  passCount++; // NIT/BOQ

  const expiredCount = (isExpired ? 1 : 0) + (isEmdLapsed ? 1 : 0);

  // Strict statutory rules:
  // - Missing mandatory requirement -> NOT READY
  // - FAIL on mandatory requirement -> NOT READY
  // - EXPIRED mandatory document -> NOT READY
  // - REVIEW/discrepancy -> REQUIRES REVIEW
  // - All mandatory requirements passed and no blocking issue -> READY
  let status = 'READY';
  const blockers = [];
  const reviewItems = [];
  const prioritizedActions = [];

  if (isGstMissing) blockers.push(currentLang === 'mr' ? 'अनिवार्य GST नोंदणी प्रमाणपत्र गहाळ आहे' : currentLang === 'hi' ? 'अनिवार्य GST पंजीकरण प्रमाणपत्र गायब है' : 'Missing mandatory GST Registration Certificate');
  if (isPanMissing) blockers.push(currentLang === 'mr' ? 'अनिवार्य PAN कार्ड पुरावा गहाळ आहे' : currentLang === 'hi' ? 'अनिवार्य PAN कार्ड प्रमाण गायब है' : 'Missing mandatory PAN Card proof');
  if (isMcaMissing) blockers.push(currentLang === 'mr' ? 'अनिवार्य MCA21 कंपनी निगमन / CIN गहाळ आहे' : currentLang === 'hi' ? 'अनिवार्य MCA21 कंपनी निगमन / CIN गायब है' : 'Missing mandatory MCA21 Certificate of Incorporation / CIN');
  if (isItrMissing) blockers.push(currentLang === 'mr' ? '३ वर्षांचे ITR (FY 2024-25) संलग्न नाही' : currentLang === 'hi' ? '3 वर्षों का ITR (FY 2024-25) संलग्न नहीं है' : 'Missing mandatory 3-Year ITR filings (FY 2024-25)');

  if (isGstFail) blockers.push(currentLang === 'mr' ? 'GST नोंदणी कर प्राधिकरणाकडून निलंबित किंवा अवैध आढळली' : currentLang === 'hi' ? 'GST पंजीकरण कर प्राधिकरण द्वारा निलंबित या अमान्य पाया गया' : 'GST registration suspended or invalid in tax registry');
  if (isExpired) blockers.push(currentLang === 'mr' ? 'वैधानिक कर मंजुरी किंवा गुणवत्ता प्रमाणपत्राची मुदत संपलेली आहे' : currentLang === 'hi' ? 'वैधानिक कर निकासी या गुणवत्ता प्रमाणपत्र की वैधता समाप्त हो चुकी है' : 'Expired mandatory Tax Clearance / ISO statutory certificate');
  if (isEmdLapsed) blockers.push(currentLang === 'mr' ? 'ईएमडी बँक हमीची मुदत निविदा सादरीकरणापूर्वीच संपलेली आहे' : currentLang === 'hi' ? 'ईएमडी बैंक गारंटी की वैधता निविदा प्रस्तुति से पूर्व समाप्त हो चुकी है' : 'Expired EMD Bank Guarantee prior to tender closing');

  if (blockers.length > 0) {
    status = 'NOT READY';
  } else if (reviewCount > 0 || isMismatch || isGstReview || isPanReview || isMcaReview) {
    status = 'REQUIRES REVIEW';
    if (isMismatch) reviewItems.push(currentLang === 'mr' ? 'PAN, GST आणि बँक पुराव्यामध्ये कायदेशीर आस्थापना नाव/पत्ता तफावत' : currentLang === 'hi' ? 'PAN, GST और बैंक प्रमाण में कानूनी इकाई नाम/पता विसंगति' : 'Discrepancy: Legal entity name or address mismatch across PAN, GST, and Bank proofs');
    if (isGstReview) reviewItems.push(currentLang === 'mr' ? 'GST राज्य कोड किंवा नोंदणीकृत पत्ता सुसंगतता आढावा आवश्यक' : currentLang === 'hi' ? 'GST राज्य कोड या पंजीकृत पता निरंतरता समीक्षा आवश्यक' : 'Review item: GST state jurisdiction or address clarification required');
    if (isMcaReview) reviewItems.push(currentLang === 'mr' ? 'संचालक छाननी किंवा MCA पत्ता पडताळणी आवश्यक' : currentLang === 'hi' ? 'निदेशक संवीक्षा या MCA पता सत्यापन आवश्यक' : 'Review item: Director scrutiny or MCA address harmonization required');
    if (isUdyamReview) reviewItems.push(currentLang === 'mr' ? 'उद्यम श्रेणी (उत्पादन वि. व्यापार) कोटा आढावा' : currentLang === 'hi' ? 'उद्यम श्रेणी (विनिर्माण बनाम व्यापार) कोटा समीक्षा' : 'Review item: Udyam classification discrepancy (Trading vs Manufacturing)');
  }

  // Prioritized Remediation Actions
  if (isGstFail) prioritizedActions.push(currentLang === 'mr' ? '१. कर प्राधिकरणाशी संपर्क साधून सक्रिय GSTIN बहाल करा आणि अद्यतनित दाखला अपलोड करा.' : currentLang === 'hi' ? '1. कर अधिकारियों से निलंबित GSTIN को सक्रिय करवाएं और वैध प्रमाणपत्र पुनः अपलोड करें।' : '1. Resolve suspended GSTIN with tax authority and re-upload active certificate.');
  if (isExpired || isEmdLapsed) prioritizedActions.push(currentLang === 'mr' ? '२. मुदत संपलेली प्रमाणपत्रे (EMD / Tax Clearance) चालू वर्षाच्या वैध प्रमाणपत्रासह बदला.' : currentLang === 'hi' ? '2. समाप्त प्रमाणपत्रों (EMD / Tax Clearance) को नवीनीकृत करके पुनः अपलोड करें।' : '2. Replace lapsed/expired certificates (EMD Bank Guarantee / Tax Clearance) with active renewals.');
  if (isItrMissing || isGstMissing || isPanMissing) prioritizedActions.push(currentLang === 'mr' ? '३. गहाळ असलेले अनिवार्य वैधानिक दस्तऐवज विक्रेता पोर्टलवर अपलोड करा.' : currentLang === 'hi' ? '3. अनुपलब्ध अनिवार्य वैधानिक दस्तावेज़ विक्रेता पोर्टल पर अपलोड करें।' : '3. Upload missing mandatory statutory documents in Vendor Portal.');
  if (isMismatch) prioritizedActions.push(currentLang === 'mr' ? '४. PAN, GST व बँक खात्यातील नाव व नोंदणीकृत पत्ता एकसमान असल्याची खात्री करा.' : currentLang === 'hi' ? '4. PAN, GST और बैंक खातों में इकाई नाम एवं पता एकसमान करें।' : '4. Harmonize legal entity name and address across PAN, GST, and Bank records.');
  if (prioritizedActions.length === 0) {
    prioritizedActions.push(currentLang === 'mr' ? 'सर्व अनिवार्य वैधानिक अटी पूर्ण. सिम्युलेशन सबमिशनसाठी पुढे जा.' : currentLang === 'hi' ? 'सभी अनिवार्य वैधानिक आवश्यकताएं पूर्ण। सिमुलेशन प्रस्तुति हेतु आगे बढ़ें।' : 'All statutory requirements satisfied. Proceed to simulation submission.');
  }

  const isDemoSubmitted = audit.some(a => a.action && a.action.includes('Simulation Submitted'));
  const submissionTimestamp = isDemoSubmitted ? (audit.find(a => a.action.includes('Simulation Submitted'))?.timestamp || '') : null;

  return {
    status,
    isReady: status === 'READY',
    score: bidder.score,
    risk: bidder.risk,
    counts: { pass: passCount, review: reviewCount, fail: failCount, missing: missingCount, expired: expiredCount },
    blockers,
    reviewItems,
    prioritizedActions,
    deadline: '28-Feb-2026 15:00 IST',
    isDemoSubmitted,
    submissionTimestamp
  };
}

// Render dedicated Submission Readiness card
function renderSubmissionReadinessCard(bidder) {
  const r = calculateSubmissionReadiness(bidder);
  const statusClass = r.status === 'READY' ? 'ready' : (r.status === 'REQUIRES REVIEW' ? 'requires-review' : 'not-ready');
  const statusLabel = r.status === 'READY' ? t('readinessReady') : (r.status === 'REQUIRES REVIEW' ? t('readinessRequiresReview') : t('readinessNotReady'));
  const statusDesc = r.status === 'READY' ? t('readinessReadyDesc') : (r.status === 'REQUIRES REVIEW' ? t('readinessRequiresReviewDesc') : t('readinessNotReadyDesc'));

  const submitBtnHtml = r.isDemoSubmitted
    ? `<button class="readiness-submit-btn submitted" disabled>${t('btnSimulateSubmitted')} <small>(${esc(r.submissionTimestamp)})</small></button>`
    : `<button class="readiness-submit-btn ${r.isReady ? 'ready' : 'disabled'}" onclick="${r.isReady ? `handleSimulationSubmit('${bidder.id}')` : `toast('${esc(t('notReadyWarning'))}', true)`}">
         ${t('btnSimulateSubmit')}
       </button>`;

  return `
    <div class="readiness-card ${statusClass}">
      <div class="readiness-header">
        <div class="readiness-title-group">
          <span class="readiness-eyebrow">${t('readinessSubtitle')}</span>
          <h3 class="readiness-title">${t('readinessTitle')}</h3>
          <p class="readiness-desc">${statusDesc}</p>
        </div>
        <div class="readiness-badge-large ${statusClass}">
          ${statusLabel}
        </div>
      </div>

      <!-- KEY METRICS ROW -->
      <div class="readiness-metrics-grid">
        <div class="readiness-metric-box">
          <span class="rm-label">${t('complianceLabel')}</span>
          <b class="rm-value score" style="color:${r.score >= 80 ? '#16a34a' : r.score >= 60 ? '#d97706' : '#dc2626'}">${r.score}%</b>
        </div>
        <div class="readiness-metric-box">
          <span class="rm-label">${t('thRisk')}</span>
          <b class="rm-value risk ${r.risk.toLowerCase()}">${localizeRisk(r.risk)}</b>
        </div>
        <div class="readiness-metric-box stat-pass">
          <span class="rm-label">🟢 ${t('statPass')}</span>
          <b class="rm-value">${r.counts.pass}</b>
        </div>
        <div class="readiness-metric-box stat-review">
          <span class="rm-label">🟡 ${t('statReview')}</span>
          <b class="rm-value">${r.counts.review}</b>
        </div>
        <div class="readiness-metric-box stat-fail">
          <span class="rm-label">🔴 ${t('statFail')}</span>
          <b class="rm-value">${r.counts.fail}</b>
        </div>
        <div class="readiness-metric-box stat-missing">
          <span class="rm-label">⚪ ${t('statMissing')}</span>
          <b class="rm-value">${r.counts.missing}</b>
        </div>
        <div class="readiness-metric-box stat-expired">
          <span class="rm-label">⏱️ ${t('statExpired')}</span>
          <b class="rm-value">${r.counts.expired}</b>
        </div>
      </div>

      <!-- TENDER DEADLINE & METADATA -->
      <div class="readiness-deadline-banner">
        <span>📅 <b>${t('tenderDeadlineLabel')}:</b> ${esc(r.deadline)}</span>
        <span>🏢 <b>Bidder:</b> ${esc(bidder.name)} · <b>Tender ID:</b> S26-104</span>
      </div>

      <!-- BLOCKERS / REVIEW ITEMS -->
      ${r.blockers.length ? `
        <div class="readiness-alert-section blockers">
          <b>🚫 ${t('blockersTitle')}:</b>
          <ul>
            ${r.blockers.map(bItem => `<li>${esc(bItem)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${r.reviewItems.length ? `
        <div class="readiness-alert-section reviews">
          <b>⚠️ ${t('reviewItemsTitle')}:</b>
          <ul>
            ${r.reviewItems.map(item => `<li>${esc(item)}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      <!-- PRIORITIZED REMEDIATION ACTIONS -->
      <div class="readiness-actions-box">
        <b>➡️ ${t('prioritizedActionsTitle')}:</b>
        <ol>
          ${r.prioritizedActions.map(act => `<li>${esc(act)}</li>`).join('')}
        </ol>
      </div>

      <!-- SIMULATION SUBMISSION ACTION -->
      <div class="readiness-submit-bar">
        ${submitBtnHtml}
        <small class="simulation-notice">${t('simulationNotice')}</small>
      </div>
    </div>
  `;
}

// Simulation Submission Handler
async function handleSimulationSubmit(bidderId) {
  try {
    toast('Submitting bid package in simulation mode...');
    const vendorName = $('#vendor-profile-name')?.value.trim() || undefined;
    const res = await fetch('/api/vendor/submit-simulation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bidderId, vendorName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Submission failed');

    const index = bidders.findIndex(b => b.id === bidderId);
    if (index !== -1) {
      bidders[index] = data.bidder;
    }

    // Refresh UI
    renderBidders();
    if (selectedId === bidderId) selectBidder(bidderId);
    
    // Re-render report if visible
    const reportEl = $('#report');
    if (reportEl && !reportEl.classList.contains('hidden')) {
      const container = $('#submission-readiness-container');
      if (container) container.innerHTML = renderSubmissionReadinessCard(data.bidder);
    }

    toast('✓ ' + t('btnSimulateSubmitted'));
    if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
  } catch (err) {
    console.error('Simulation submission error:', err);
    toast('Simulation submission failed: ' + err.message, true);
  }
}
window.handleSimulationSubmit = handleSimulationSubmit;
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
          <h3>${currentLang === 'mr' ? 'दस्तऐवज पडताळणी निकाल' : currentLang === 'hi' ? 'दस्तावेज़ सत्यापन परिणाम' : 'Document Verification Result'} <span class="risk ${bidder.risk.toLowerCase()}">${localizeRisk(bidder.risk)} ${t('riskSuffix')}</span></h3>
          <p>${currentLang === 'mr' ? 'बहु-स्तरीय पडताळणी: दस्तऐवज काढणे → स्वरूप वैधता → क्रॉस-मॅच → मॉक शासकीय नोंदणी तपासणी.' : currentLang === 'hi' ? 'बहु-स्तरीय सत्यापन: दस्तावेज़ निष्कर्षण → प्रारूप मान्यता → क्रॉस-मैच → मॉक रजिस्ट्री लुकअप।' : 'Multi-stage verification: Document Extraction → Format Validation → Cross-Match → Mock Registry Lookup.'}</p>
          <div style="margin-top:5px; font-size:11px; font-weight:700; color:#0369a1;">
            ${t('mockGovNotice')}
          </div>
        </div>
        <button class="secondary download" onclick="downloadPdfReport('${bidder.id}')">${currentLang === 'mr' ? 'दस्तऐवज PDF डाउनलोड करा' : currentLang === 'hi' ? 'दस्तावेज़ PDF डाउनलोड करें' : 'Download PDF Dossier'}</button>
      </div>

      <!-- EXPLAIN WHY IN VERIFICATION REPORT -->
      <div class="explain-why-box" style="margin-top:14px;">
        <b class="explain-why-title">${t('explainWhyTitle')}</b>
        <p class="explain-why-text">${esc(explainWhyText)}</p>
      </div>

      <!-- DEDICATED SUBMISSION READINESS SECTION (PHASE 1) -->
      <div id="submission-readiness-container" style="margin-top:14px;">
        ${renderSubmissionReadinessCard(bidder)}
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
    if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
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
      <td>${esc(b.package)}<span class="sub" style="font-size:11px; display:block;">${b.docs} ${currentLang === 'mr' ? 'दस्तऐवज' : currentLang === 'hi' ? 'दस्तावेज़' : 'documents'}</span></td>
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
      <b>${currentLang === 'mr' ? 'पडताळणी प्रकार:' : currentLang === 'hi' ? 'सत्यापन प्रकार:' : 'Verification Type:'}</b> <span style="color:#0369a1; font-weight:600;">${esc(b.typeDescription || b.demoType || '')}</span>
    </div>

    <div class="detail-score-box" style="margin-bottom:14px; padding:10px 14px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <b style="font-size:15px;">${b.score}% ${t('complianceLabel')}</b>
        <div class="detail-meta" style="font-size:11px;">${b.docs} ${t('documentsAnalyzed')}</div>
      </div>
      <span class="risk ${b.risk.toLowerCase()}">${localizeRisk(b.risk)} ${t('riskSuffix')}</span>
    </div>

    <!-- SUBMISSION READINESS PILL IN DOSSIER -->
    <div style="margin-bottom:12px;">
      ${(() => {
        const sr = calculateSubmissionReadiness(b);
        const statusClass = sr.status === 'READY' ? 'ready' : (sr.status === 'REQUIRES REVIEW' ? 'requires-review' : 'not-ready');
        const statusText = sr.status === 'READY' ? t('readinessReady') : (sr.status === 'REQUIRES REVIEW' ? t('readinessRequiresReview') : t('readinessNotReady'));
        return `
          <div class="dossier-readiness-pill ${statusClass}" style="padding:7px 12px; border-radius:6px; font-size:11px; display:flex; justify-content:space-between; align-items:center;">
            <span><b>${t('readinessTitle')}:</b> ${statusText}</span>
            <span>⏱️ <b>${sr.counts.expired} Expired</b> · 🔴 <b>${sr.counts.fail} Fail</b> · ⚪ <b>${sr.counts.missing} Missing</b></span>
          </div>
        `;
      })()}
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

    <!-- AI STATUTORY VERIFICATION FINDINGS & DISCREPANCIES (DISTINCT FROM OFFICER DECISION) -->
    <div style="margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0;" class="audit-header">${t('aiVerificationHeading')}</h4>
        <span style="font-size:9.5px; color:#64748b; font-weight:700;">AI AUTOMATED</span>
      </div>
      ${(b.findings || []).length ? b.findings.map((f, fIdx) => {
        const isResolved = (b.resolvedFindings || []).some(rf => rf.finding === f);
        return `
          <div class="check-item-row" style="display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid #f1f5f9;">
            <div class="check-item" style="margin:0; flex:1;">
              <span class="${f.includes('zero') || f.includes('passed') ? 'ok' : 'warn'}">${f.includes('zero') || f.includes('passed') ? '✓' : '!'}</span> 
              ${esc(f)}
              ${isResolved ? `<span class="resolved-tag" style="margin-left:8px; font-size:10px; font-weight:800; color:#16a34a; background:#dcfce7; padding:2px 6px; border-radius:4px;">${t('findingResolvedLabel')}</span>` : ''}
            </div>
            ${!isResolved && !f.includes('zero') && !f.includes('passed') ? `
              <button class="resolve-finding-btn" style="background:none; border:1px solid #cbd5e1; border-radius:4px; padding:3px 7px; font-size:10px; cursor:pointer; font-weight:700; color:#0369a1;" onclick="handleResolveFinding('${b.id}', ${fIdx})">
                ${t('btnResolveFinding')}
              </button>
            ` : ''}
          </div>
        `;
      }).join('') : `<div class="check-item"><span class="ok">✓</span> ${t('zeroDiscrepancies')}</div>`}
    </div>

    <!-- OFFICER REVIEW NOTES (PHASE 2) -->
    <div style="margin-bottom:16px;">
      <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0 0 6px 0;" class="audit-header">${t('officerNotesTitle')}</h4>
      <div class="officer-notes-container" style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px;">
        ${(b.officerNotes || []).length ? (b.officerNotes || []).map(n => `
          <div class="officer-note-entry" style="font-size:11px; padding:4px 0; border-bottom:1px solid #e2e8f0;">
            <b>${esc(n.officer)}:</b> "${esc(n.text)}" <small style="color:#64748b;">(${esc(n.timestamp)})</small>
          </div>
        `).join('') : `<div style="font-size:11px; color:#94a3b8;">${t('officerNotesEmpty')}</div>`}
      </div>
      <div style="display:flex; gap:6px;">
        <input id="new-officer-note" type="text" placeholder="${esc(t('notePlaceholder'))}" style="flex:1; font-size:11px; padding:7px 10px; border:1px solid #cbd5e1; border-radius:6px;">
        <button style="background:#0284c7; color:white; border:none; padding:7px 12px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;" onclick="handleAddOfficerNote('${b.id}')">
          ${t('btnAddNote')}
        </button>
      </div>
    </div>

    <!-- OFFICER DECISION PANEL (CLEARLY SEPARATED FROM AI RESULTS) -->
    <div style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <h4 style="font-size:11px; letter-spacing:0.5px; text-transform:uppercase; margin:0;" class="audit-header">${t('officerDeskHeading')}</h4>
        <span style="font-size:9.5px; color:#0369a1; font-weight:700;">HUMAN DECISION</span>
      </div>
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
  if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
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

// Add Officer Review Note
async function handleAddOfficerNote(bidderId) {
  const input = $('#new-officer-note');
  if (!input) return;
  const noteText = input.value.trim();
  if (!noteText) {
    toast('Please enter a note before submitting', true);
    return;
  }

  try {
    const officerName = sessionStorage.getItem('sendatender-officer-name') || 'Desk Officer (SIH 26100)';
    const res = await fetch('/api/officer/note', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bidderId, note: noteText, officerName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to save note');

    const index = bidders.findIndex(b => b.id === bidderId);
    if (index !== -1) {
      bidders[index] = data.bidder;
    }

    renderBidders();
    selectBidder(bidderId);
    toast('Officer note recorded successfully');
    if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
  } catch (err) {
    console.error('Error adding officer note:', err);
    toast('Failed to add officer note: ' + err.message, true);
  }
}
window.handleAddOfficerNote = handleAddOfficerNote;

// Resolve Finding by Officer
async function handleResolveFinding(bidderId, findingIndex) {
  try {
    const remarks = prompt('Enter officer resolution remarks (optional):', 'Finding reviewed and accepted under discretionary officer review') || 'Reviewed and approved by desk officer';
    const officerName = sessionStorage.getItem('sendatender-officer-name') || 'Desk Officer (SIH 26100)';

    const res = await fetch('/api/officer/resolve-finding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: bidderId, findingIndex, remarks, officerName })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to resolve finding');

    const index = bidders.findIndex(b => b.id === bidderId);
    if (index !== -1) {
      bidders[index] = data.bidder;
    }

    renderBidders();
    selectBidder(bidderId);
    toast('Discrepancy marked as reviewed and resolved by officer');
    if (typeof updateTenderBuddyContextBanner === 'function') updateTenderBuddyContextBanner();
    // Refresh comparison and audit if they were already rendered
    if (currentOfficerTab === 'comparison') renderComparisonTable();
    if (currentOfficerTab === 'audit') renderAuditTrail();
  } catch (err) {
    console.error('Error resolving finding:', err);
    toast('Failed to resolve finding: ' + err.message, true);
  }
}
window.handleResolveFinding = handleResolveFinding;

// =========================================================
// PHASE 3: OFFICER TABS, BIDDER COMPARISON & AUDIT TRAIL
// =========================================================

let currentOfficerTab = 'dossiers';

function switchOfficerTab(tab) {
  currentOfficerTab = tab;
  
  // Update Tab Buttons
  const tabBtnDossiers = $('#tab-btn-dossiers');
  const tabBtnComparison = $('#tab-btn-comparison');
  const tabBtnAudit = $('#tab-btn-audit');

  if (tabBtnDossiers) tabBtnDossiers.classList.toggle('active', tab === 'dossiers');
  if (tabBtnComparison) tabBtnComparison.classList.toggle('active', tab === 'comparison');
  if (tabBtnAudit) tabBtnAudit.classList.toggle('active', tab === 'audit');

  // Toggle Content Panels
  const contentDossiers = $('#officer-tab-content-dossiers');
  const contentComparison = $('#officer-tab-content-comparison');
  const contentAudit = $('#officer-tab-content-audit');

  if (contentDossiers) contentDossiers.classList.toggle('hidden', tab !== 'dossiers');
  if (contentComparison) contentComparison.classList.toggle('hidden', tab !== 'comparison');
  if (contentAudit) contentAudit.classList.toggle('hidden', tab !== 'audit');

  if (tab === 'comparison') {
    renderComparisonTable();
  } else if (tab === 'audit') {
    populateAuditBidderFilter();
    renderAuditTrail();
  }
}
window.switchOfficerTab = switchOfficerTab;

// Populate Audit Bidder Dropdown
function populateAuditBidderFilter() {
  const filter = $('#audit-bidder-filter');
  if (!filter) return;
  const currentVal = filter.value || 'All';
  
  filter.innerHTML = `<option value="All">${t('auditFilterAllBidders')}</option>` + 
    bidders.map(b => `<option value="${b.id}" ${b.id === currentVal ? 'selected' : ''}>${esc(b.name)}</option>`).join('');
}

// Render Bidder Comparison Desk
async function renderComparisonTable() {
  const tbody = $('#comparison-tbody');
  if (!tbody) return;

  const token = sessionStorage.getItem('sendatender-officer-token');
  if (!token) {
    tbody.innerHTML = `<tr><td colspan="14" class="empty" style="color:#dc2626; padding:24px;">${t('toastOfficerDenied')}</td></tr>`;
    return;
  }

  tbody.innerHTML = `<tr><td colspan="14" class="empty" style="padding:24px;">Loading comparison data...</td></tr>`;

  try {
    const res = await fetch('/api/officer/comparison', {
      headers: {
        'x-officer-token': token,
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 403 || res.status === 401) {
      tbody.innerHTML = `<tr><td colspan="14" class="empty" style="color:#dc2626; padding:24px;">Access Denied: Officer authentication required.</td></tr>`;
      return;
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.comparison)) {
      tbody.innerHTML = `<tr><td colspan="14" class="empty" style="padding:24px;">Failed to load comparison data.</td></tr>`;
      return;
    }

    if (data.comparison.length === 0) {
      tbody.innerHTML = `<tr><td colspan="14" class="empty" style="padding:24px;">No bidders found to compare.</td></tr>`;
      return;
    }

    tbody.innerHTML = data.comparison.map(b => {
      const scoreColor = b.score >= 80 ? '#16a34a' : (b.score >= 60 ? '#ca8a04' : '#dc2626');
      const readinessClass = b.submissionReadiness === 'READY' ? 'ready' : (b.submissionReadiness === 'REQUIRES REVIEW' ? 'requires-review' : 'not-ready');
      const readinessLabel = b.submissionReadiness === 'READY' ? t('readinessReady') : (b.submissionReadiness === 'REQUIRES REVIEW' ? t('readinessRequiresReview') : t('readinessNotReady'));

      const statBadge = (st, lbl) => {
        const cls = st.toLowerCase();
        return `<span class="badge ${cls}" style="font-size:10px; padding:2px 6px; font-weight:700;" title="${lbl}: ${st}">${lbl}: ${st}</span>`;
      };

      const suiteHtml = `
        <div style="display:flex; flex-wrap:wrap; gap:4px; max-width:240px;">
          ${statBadge(b.statutory.gst, t('statutoryGst'))}
          ${statBadge(b.statutory.pan, t('statutoryPan'))}
          ${statBadge(b.statutory.udyam, t('statutoryUdyam'))}
          ${statBadge(b.statutory.mca, t('statutoryMca'))}
        </div>
      `;

      return `
        <tr class="comparison-row ${selectedId === b.id ? 'selected-row' : ''}">
          <td style="font-weight:700;">
            <div style="color:var(--text);">${esc(b.name)}</div>
            <small style="color:var(--muted); font-size:11px;">${esc(b.demoType || '')}</small>
          </td>
          <td style="font-family:monospace; font-size:11px; color:#0369a1; font-weight:600;">${esc(b.id)}</td>
          <td><span style="font-weight:800; font-size:14px; color:${scoreColor}">${b.score}%</span></td>
          <td><span class="risk ${b.risk.toLowerCase()}">${localizeRisk(b.risk)}</span></td>
          <td><span class="readiness-tag ${readinessClass}" style="font-size:11px; font-weight:800; padding:4px 8px; border-radius:4px;">${readinessLabel}</span></td>
          <td style="font-weight:700; color:#16a34a;">${b.counts.pass}</td>
          <td style="font-weight:700; color:#ca8a04;">${b.counts.review}</td>
          <td style="font-weight:700; color:#dc2626;">${b.counts.fail}</td>
          <td style="font-weight:700; color:#64748b;">${b.counts.missing}</td>
          <td style="font-weight:700; color:#b91c1c;">${b.counts.expired}</td>
          <td>${suiteHtml}</td>
          <td style="text-align:center;">
            ${b.blockersCount > 0 ? `<span style="color:#dc2626; font-weight:800;" title="${b.blockers.map(esc).join('; ')}">⚠️ ${b.blockersCount}</span>` : '<span style="color:#16a34a; font-weight:700;">0</span>'}
          </td>
          <td><span class="status ${(b.officerStatus || '').replace(/\s+/g, '-').toLowerCase()}">${localizeStatus(b.officerStatus)}</span></td>
          <td>
            <button class="secondary btn-open-dossier" style="font-size:11px; padding:5px 10px; white-space:nowrap;" onclick="openDossierFromComparison('${b.id}')">
              ${t('btnOpenDossier')}
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Comparison load error:', err);
    tbody.innerHTML = `<tr><td colspan="14" class="empty" style="color:#dc2626; padding:24px;">Failed to fetch comparison: ${esc(err.message)}</td></tr>`;
  }
}
window.renderComparisonTable = renderComparisonTable;

// Open dossier directly from comparison table
function openDossierFromComparison(bidderId) {
  switchOfficerTab('dossiers');
  selectBidder(bidderId);
  // Scroll to review panel smoothly
  const panel = $('#review-panel');
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
window.openDossierFromComparison = openDossierFromComparison;

// Render Hash-Chained Audit Trail
async function renderAuditTrail() {
  const tbody = $('#audit-tbody');
  const indicator = $('#audit-integrity-indicator');
  const indicatorText = $('#audit-integrity-text');
  if (!tbody) return;

  const token = sessionStorage.getItem('sendatender-officer-token');
  if (!token) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty" style="color:#dc2626; padding:24px;">${t('toastOfficerDenied')}</td></tr>`;
    return;
  }

  const bidderId = $('#audit-bidder-filter')?.value || 'All';
  const actionType = $('#audit-action-filter')?.value || 'All';
  const actor = $('#audit-actor-filter')?.value || 'All';
  const q = $('#audit-search')?.value || '';

  const params = new URLSearchParams();
  if (bidderId !== 'All') params.append('bidderId', bidderId);
  if (actionType !== 'All') params.append('actionType', actionType);
  if (actor !== 'All') params.append('actor', actor);
  if (q.trim()) params.append('q', q.trim());

  try {
    const res = await fetch(`/api/officer/audit-trail?${params.toString()}`, {
      headers: {
        'x-officer-token': token,
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.status === 403 || res.status === 401) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty" style="color:#dc2626; padding:24px;">Access Denied: Officer authentication required.</td></tr>`;
      return;
    }

    const data = await res.json();
    if (!data.success || !Array.isArray(data.events)) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty" style="padding:24px;">Failed to load audit trail.</td></tr>`;
      return;
    }

    // Update Integrity Indicator
    if (indicator && indicatorText) {
      if (data.integrity && data.integrity.verified) {
        indicator.className = 'integrity-indicator verified';
        indicatorText.textContent = t('auditIntegrityBadge');
      } else {
        indicator.className = 'integrity-indicator compromised';
        indicatorText.textContent = t('auditTamperBadge');
      }
    }

    if (data.events.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty" style="padding:24px;">${t('emptyAuditTrail')}</td></tr>`;
      return;
    }

    tbody.innerHTML = data.events.map(ev => {
      const hashShort = (ev.hash || '').slice(0, 16) + '...';
      const prevHashShort = (ev.prevHash || '').slice(0, 12) + '...';
      
      // Categorize action for subtle badge styling
      let actionBadgeClass = 'badge-system';
      const act = (ev.action || '').toLowerCase();
      if (act.includes('upload')) actionBadgeClass = 'badge-upload';
      else if (act.includes('decision')) actionBadgeClass = 'badge-decision';
      else if (act.includes('note')) actionBadgeClass = 'badge-note';
      else if (act.includes('verification')) actionBadgeClass = 'badge-verify';
      else if (act.includes('simulation') || act.includes('submitted')) actionBadgeClass = 'badge-submit';

      return `
        <tr class="audit-row">
          <td style="font-size:11px; white-space:nowrap; color:var(--muted);">${esc(ev.timestamp || 'N/A')}</td>
          <td>
            <b style="font-size:12px; color:var(--text);">${esc(ev.user || 'System')}</b>
          </td>
          <td>
            <span class="audit-action-badge ${actionBadgeClass}" style="font-size:11px; font-weight:700; padding:3px 8px; border-radius:4px;">
              ${esc(ev.action || 'Event')}
            </span>
          </td>
          <td>
            <div style="font-weight:600; font-size:12px;">${esc(ev.bidderName || ev.bidderId || 'General')}</div>
            <small style="color:#0369a1; font-family:monospace; font-size:10px;">${esc(ev.bidderId || '')}</small>
          </td>
          <td style="font-size:12px; line-height:1.4;">
            ${esc(ev.remarks || 'No detailed remarks recorded.')}
          </td>
          <td>
            <div class="audit-hash-cell" title="Current Hash: ${esc(ev.hash || '')}\nPrev Hash: ${esc(ev.prevHash || '')}">
              <span class="hash-code" style="font-family:monospace; font-size:10.5px; background:var(--code-bg, #f1f5f9); padding:2px 6px; border-radius:3px; border:1px solid var(--line);">
                #${esc(hashShort)}
              </span>
              <div style="font-size:9.5px; color:var(--muted); margin-top:2px;">
                prev: <span style="font-family:monospace;">${esc(prevHashShort)}</span>
              </div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  } catch (err) {
    console.error('Audit trail load error:', err);
    tbody.innerHTML = `<tr><td colspan="6" class="empty" style="color:#dc2626; padding:24px;">Failed to fetch audit records: ${esc(err.message)}</td></tr>`;
  }
}
window.renderAuditTrail = renderAuditTrail;

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

// =========================================================
// TENDER BUDDY AI ASSISTANT CLIENT ENGINE
// =========================================================

let tbChatHistory = [];
let tbIsOpen = false;

// Open/Close Tender Buddy Window
function toggleTenderBuddy(open) {
  tbIsOpen = typeof open === 'boolean' ? open : !tbIsOpen;
  const win = $('#tb-window');
  if (!win) return;
  win.classList.toggle('hidden', !tbIsOpen);
  if (tbIsOpen) {
    updateTenderBuddyContextBanner();
    renderTenderBuddyProgressCard();
    renderTenderBuddySuggestions();
    const input = $('#tb-input');
    if (input) setTimeout(() => input.focus(), 150);
    // Initialize welcome greeting if empty
    if (tbChatHistory.length === 0) {
      appendTenderBuddyMessage('bot', t('tbWelcome'));
    }
  }
}
window.toggleTenderBuddy = toggleTenderBuddy;

// Context Banner awareness based on active view and selected bidder
function updateTenderBuddyContextBanner() {
  const bannerText = $('#tb-context-text');
  if (!bannerText) return;

  const activeView = $('.view.active')?.id || 'home';
  const currentBidder = bidders.find(b => b.id === selectedId);

  if (activeView === 'officer' && currentBidder) {
    bannerText.textContent = `${t('tbContextBidder')}${currentBidder.name.slice(0, 24)}...)`;
  } else if (activeView === 'officer') {
    bannerText.textContent = t('tbContextOfficer');
  } else if (activeView === 'vendor') {
    bannerText.textContent = t('tbContextVendor');
  } else {
    bannerText.textContent = t('tbContextGeneral');
  }

  // Always keep progress card and suggestions updated in real time
  renderTenderBuddyProgressCard();
  renderTenderBuddySuggestions();
}
window.updateTenderBuddyContextBanner = updateTenderBuddyContextBanner;

// Dynamic Progress Snapshot Card Renderer
function renderTenderBuddyProgressCard() {
  const card = $('#tb-progress-card');
  if (!card) return;

  const currentBidder = bidders.find(b => b.id === selectedId);
  const entityEl = $('#tb-progress-entity');
  const pctEl = $('#tb-progress-pct');
  const fillEl = $('#tb-progress-bar-fill');
  const badgePass = $('#tb-badge-pass');
  const badgeReview = $('#tb-badge-review');
  const badgeFail = $('#tb-badge-fail');
  const badgeMissing = $('#tb-badge-missing');

  if (!currentBidder) {
    if (entityEl) entityEl.textContent = currentLang === 'mr' ? 'कोणतेही सादरीकरण निवडलेले नाही' : currentLang === 'hi' ? 'कोई सबमिशन चयनित नहीं' : 'No active submission';
    if (pctEl) pctEl.textContent = '0%';
    if (fillEl) fillEl.style.width = '0%';
    if (badgePass) badgePass.textContent = '🟢 0';
    if (badgeReview) badgeReview.textContent = '🟡 0';
    if (badgeFail) badgeFail.textContent = '🔴 0';
    if (badgeMissing) badgeMissing.textContent = '⚪ 8';
    return;
  }

  // Calculate counts based on currentBidder.matrix
  const matrix = currentBidder.matrix || {};
  const flags = currentBidder.flags || [];
  const findings = currentBidder.findings || [];
  const docEvidence = matrix.documents?.evidence || '';

  let pass = 0, review = 0, fail = 0, missing = 0;

  // Inspect standard statutory checkpoints
  const checkpoints = ['gst', 'pan', 'udyam', 'mca', 'documents'];
  checkpoints.forEach(k => {
    const st = matrix[k]?.status;
    if (st === 'PASS') pass++;
    else if (st === 'REVIEW') review++;
    else if (st === 'FAIL') fail++;
    else if (st === 'MISSING') missing++;
  });

  // Calculate 8-requirement mapped coverage
  const isItrMissing = flags.some(f => f.toLowerCase().includes('itr')) || findings.some(f => f.toLowerCase().includes('itr')) || docEvidence.toLowerCase().includes('itr');
  const isEmdLapsed = flags.some(f => f.toLowerCase().includes('emd')) || findings.some(f => f.toLowerCase().includes('emd')) || docEvidence.toLowerCase().includes('emd');
  const isExpired = docEvidence.toLowerCase().includes('expired') || flags.some(f => f.toLowerCase().includes('expired'));
  const isMismatch = matrix.pan?.status === 'REVIEW' || docEvidence.toLowerCase().includes('mismatch') || flags.some(f => f.toLowerCase().includes('mismatch'));

  // Calibrate total 8 statutory checks
  let totalPass = 0, totalReview = 0, totalFail = 0, totalMissing = 0;
  // GST
  if (matrix.gst?.status === 'PASS') totalPass++; else if (matrix.gst?.status === 'REVIEW') totalReview++; else if (matrix.gst?.status === 'FAIL') totalFail++; else totalMissing++;
  // PAN
  if (matrix.pan?.status === 'PASS') totalPass++; else if (matrix.pan?.status === 'REVIEW') totalReview++; else if (matrix.pan?.status === 'FAIL') totalFail++; else totalMissing++;
  // UDYAM
  if (matrix.udyam?.status === 'PASS') totalPass++; else if (matrix.udyam?.status === 'REVIEW') totalReview++; else if (matrix.udyam?.status === 'FAIL') totalFail++; else totalMissing++;
  // MCA
  if (matrix.mca?.status === 'PASS') totalPass++; else if (matrix.mca?.status === 'REVIEW') totalReview++; else if (matrix.mca?.status === 'FAIL') totalFail++; else totalMissing++;
  // ITR
  if (isItrMissing) totalMissing++; else if (matrix.documents?.status === 'PASS') totalPass++; else totalReview++;
  // BALANCE SHEET
  if (isExpired) totalFail++; else if (isMismatch) totalReview++; else if (matrix.documents?.status === 'PASS') totalPass++; else totalReview++;
  // EMD
  if (isEmdLapsed) totalFail++; else if (matrix.documents?.status === 'PASS' || matrix.udyam?.status === 'PASS') totalPass++; else totalReview++;
  // NIT/BOQ
  totalPass++;

  const progressPct = Math.round(((totalPass + (totalReview * 0.5)) / 8) * 100);

  if (entityEl) entityEl.textContent = currentBidder.name;
  if (pctEl) pctEl.textContent = `${progressPct}%`;
  if (fillEl) fillEl.style.width = `${progressPct}%`;
  if (badgePass) badgePass.textContent = `🟢 ${totalPass}`;
  if (badgeReview) badgeReview.textContent = `🟡 ${totalReview}`;
  if (badgeFail) badgeFail.textContent = `🔴 ${totalFail}`;
  if (badgeMissing) badgeMissing.textContent = `⚪ ${totalMissing}`;
}
window.renderTenderBuddyProgressCard = renderTenderBuddyProgressCard;

// Render dynamic suggested quick questions ADAPTED IN REAL TIME TO SUBMISSION STATE
function renderTenderBuddySuggestions() {
  const container = $('#tb-suggestions');
  if (!container) return;

  const activeView = $('.view.active')?.id || 'home';
  const currentBidder = bidders.find(b => b.id === selectedId);
  let suggestions = [];

  if (activeView === 'officer') {
    suggestions = [
      { text: t('tbSuggOfficerExplain'), q: 'Explain this bidder compliance in detail.' },
      { text: '⚖️ ' + t('officerTabComparison'), q: 'Show me bidder comparison overview' },
      { text: '⛓️ ' + t('officerTabAuditTrail'), q: 'Show me audit trail and integrity status' },
      { text: t('tbSuggOfficerFlag'), q: 'Why is this bidder flagged or under review?' },
      { text: t('tbSuggOfficerMissing'), q: 'Which documents or checks are missing for this bidder?' },
      { text: t('tbSuggOfficerDecision'), q: 'What is the recommendation for officer decision?' }
    ];
  } else if (!currentBidder) {
    // No active bidder selected
    suggestions = [
      { text: t('tbSuggDocs'), q: 'What statutory documents do I need to submit?' },
      { text: t('tbSuggNextSteps'), q: 'What should I do next to prepare my tender submission?' },
      { text: t('tbSuggUploadNext'), q: 'What should I upload next in the Vendor Portal?' },
      { text: t('tbSuggReadySubmit'), q: 'Am I ready to submit my bid?' }
    ];
  } else {
    // Current bidder exists: Adapt dynamically to actual state!
    const matrix = currentBidder.matrix || {};
    const flags = currentBidder.flags || [];
    const docEvidence = matrix.documents?.evidence || '';
    const hasFail = Object.values(matrix).some(v => v.status === 'FAIL') || flags.some(f => f.toLowerCase().includes('fail') || f.toLowerCase().includes('suspended'));
    const hasReview = Object.values(matrix).some(v => v.status === 'REVIEW') || flags.some(f => f.toLowerCase().includes('mismatch'));
    const hasMissing = Object.values(matrix).some(v => v.status === 'MISSING') || flags.some(f => f.toLowerCase().includes('missing') || f.toLowerCase().includes('itr'));
    const isReady = !hasFail && !hasReview && !hasMissing && currentBidder.score >= 80;

    if (hasMissing) {
      suggestions.push({ text: t('tbSuggMissingDocs'), q: 'What documents am I missing?' });
      suggestions.push({ text: t('tbSuggUploadNext'), q: 'What should I upload next?' });
    }
    if (hasFail) {
      suggestions.push({ text: t('tbSuggWhatFailed'), q: 'What failed?' });
      suggestions.push({ text: t('tbSuggWhyFail'), q: 'Why did it fail?' });
      suggestions.push({ text: t('tbSuggHowFix'), q: 'How do I fix it?' });
    }
    if (hasReview) {
      suggestions.push({ text: t('tbSuggNeedsReview'), q: 'What needs review?' });
      suggestions.push({ text: t('tbSuggWhyReview'), q: 'Why is my GST or PAN under review?' });
    }
    if (currentBidder.score < 80) {
      suggestions.push({ text: t('tbSuggScoreLow'), q: 'Why is my score low?' });
      suggestions.push({ text: t('tbSuggFixFirst'), q: 'What should I fix first?' });
    }
    if (isReady) {
      suggestions.push({ text: t('tbSuggReadySubmit'), q: 'Am I ready to submit?' });
      suggestions.push({ text: t('tbSuggShowSummary'), q: 'Show my verification summary' });
    } else {
      suggestions.push({ text: t('tbSuggNextSteps'), q: 'What should I do next?' });
      suggestions.push({ text: t('tbSuggReadySubmit'), q: 'Am I ready to submit?' });
    }
  }

  // Deduplicate and cap to 6 quick chips for responsive layout
  const seen = new Set();
  const filtered = suggestions.filter(s => {
    if (seen.has(s.text)) return false;
    seen.add(s.text);
    return true;
  }).slice(0, 6);

  container.innerHTML = filtered.map(s => `
    <button type="button" class="tb-suggestion-btn" onclick="sendTenderBuddySuggested('${esc(s.q)}')">${esc(s.text)}</button>
  `).join('');
}
window.renderTenderBuddySuggestions = renderTenderBuddySuggestions;

// Append chat message in conversation view
function appendTenderBuddyMessage(sender, text, modeTag = null) {
  const container = $('#tb-messages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `tb-msg ${sender}`;

  // Preserve newlines and format bullet points
  const formattedHtml = esc(text)
    .replace(/\n/g, '<br/>')
    .replace(/• /g, '<b>• </b>');

  msgDiv.innerHTML = formattedHtml;

  if (modeTag) {
    const tag = document.createElement('div');
    tag.className = 'tb-mode-tag';
    tag.textContent = modeTag;
    msgDiv.appendChild(tag);
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  tbChatHistory.push({ sender, text });
}

// Show/Hide typing loader
function setTenderBuddyTyping(isTyping) {
  const container = $('#tb-messages');
  if (!container) return;

  let typingEl = $('#tb-typing-indicator');
  if (isTyping) {
    if (!typingEl) {
      typingEl = document.createElement('div');
      typingEl.id = 'tb-typing-indicator';
      typingEl.className = 'tb-typing';
      typingEl.innerHTML = '<span></span><span></span><span></span>';
      container.appendChild(typingEl);
      container.scrollTop = container.scrollHeight;
    }
  } else if (typingEl) {
    typingEl.remove();
  }
}

// Send quick suggested prompt
function sendTenderBuddySuggested(questionText) {
  const input = $('#tb-input');
  if (input) input.value = questionText;
  sendTenderBuddyMessage();
}
window.sendTenderBuddySuggested = sendTenderBuddySuggested;

// Send Message handler
async function sendTenderBuddyMessage() {
  const input = $('#tb-input');
  const sendBtn = $('#tb-submit');
  if (!input) return;

  const text = input.value.trim();
  if (!text) return;

  // Append user message
  appendTenderBuddyMessage('user', text);
  input.value = '';
  input.focus();

  if (sendBtn) sendBtn.disabled = true;
  setTenderBuddyTyping(true);

  // Construct precise, evidence-grounded context
  const activeView = $('.view.active')?.id || 'home';
  const currentBidder = bidders.find(b => b.id === selectedId);

  const contextPayload = {
    view: activeView,
    role: officerAuthenticated ? 'officer' : 'vendor',
    files: files.map(f => ({ name: f.name, size: f.size, type: f.type })),
    tender: {
      id: 'S26-104',
      title: 'Tender #S26-104 (Valves & Piping)',
      authority: 'Ministry of Petroleum & Natural Gas · GeM'
    }
  };

  // Attach current bidder verification context when viewing officer desk or recent upload
  if (currentBidder) {
    contextPayload.bidder = {
      id: currentBidder.id,
      name: currentBidder.name,
      gst: currentBidder.gst,
      pan: currentBidder.pan,
      udyam: currentBidder.udyam,
      mca: currentBidder.mca,
      package: currentBidder.package,
      score: currentBidder.score,
      risk: currentBidder.risk,
      status: currentBidder.status,
      matrix: currentBidder.matrix,
      findings: currentBidder.findings,
      flags: currentBidder.flags,
      audit: currentBidder.audit
    };
  }

  try {
    const res = await fetch('/api/tender-buddy/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        lang: currentLang,
        context: contextPayload,
        history: tbChatHistory.slice(-8)
      })
    });

    const data = await res.json();
    setTenderBuddyTyping(false);
    if (sendBtn) sendBtn.disabled = false;

    if (data.success && data.reply) {
      const modeTag = data.mode === 'ai' ? '🤖 AI Response' : '⚡ Grounded Engine';
      appendTenderBuddyMessage('bot', data.reply, modeTag);
    } else {
      appendTenderBuddyMessage('bot', 'Sorry, Tender Buddy is temporarily unavailable. Please try again or use the relevant SendaTender page.');
    }
  } catch (err) {
    console.error('Tender Buddy Network Error:', err);
    setTenderBuddyTyping(false);
    if (sendBtn) sendBtn.disabled = false;
    appendTenderBuddyMessage('bot', 'Sorry, Tender Buddy is temporarily unavailable. Please check your connection and try again.');
  }
}
window.sendTenderBuddyMessage = sendTenderBuddyMessage;

// Trigger & Close Button Listeners
const tbTriggerBtn = $('#tb-trigger');
if (tbTriggerBtn) {
  tbTriggerBtn.onclick = () => toggleTenderBuddy();
}

const tbCloseBtn = $('#tb-close');
if (tbCloseBtn) {
  tbCloseBtn.onclick = () => toggleTenderBuddy(false);
}

// Initial Boot
setTheme(currentTheme);
applyLanguage(currentLang);
renderFiles();
checkOfficerSession();
fetchBidders();

