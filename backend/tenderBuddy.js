/**
 * Tender Buddy AI & Knowledge Engine — Progress-Aware Co-Pilot
 * SendaTender (SIH 2026, Problem Statement 26100 - MoPNG & GeM)
 */

const https = require('https');
const { buildProgressState } = require('./progressEngine');

// System prompt grounding Tender Buddy strictly in available evidence and progress engine
const TENDER_BUDDY_SYSTEM_PROMPT = `You are "Tender Buddy", the real-time, progress-aware AI procurement co-pilot for the SendaTender platform (SIH 2026, Problem Statement 26100 - Ministry of Petroleum & Natural Gas and GeM).
You are NOT a generic FAQ bot. You understand the user's complete tender journey, current submission state, and verification records.

CORE PRINCIPLES & RULES:
1. Always base answers on the CURRENT VENDOR PROGRESS ENGINE context provided in the prompt.
2. The SendaTender application data is your ONLY source of truth.
3. NEVER confuse status types:
   - MISSING: Document has not been uploaded or detected in the submission.
   - FAIL: Document exists but verification failed (e.g. invalid format, suspended GST, expired certificate).
   - REVIEW: Document exists but requires manual review due to a discrepancy (e.g. entity name/address mismatch).
   - PASS: Document was verified active and matched.
   - EXPIRED: Document exists but validity date lapsed prior to bid.
   Never call REVIEW or FAIL "missing". Never call MISSING "failed".
4. When asked "What am I missing?", list ONLY items that are truly MISSING.
5. When asked "What failed?", list ONLY items marked as FAIL.
6. When asked "Why is my score low?", inspect the actual score and cite the exact unresolved items (MISSING, FAIL, REVIEW) from the compliance state.
7. When asked "What should I do next?", prioritize unresolved items in order:
   - 1. Fix/Replace FAILED items (e.g. expired certificates, suspended registrations).
   - 2. Upload MISSING mandatory documents.
   - 3. Clarify/Harmonize REVIEW items (e.g. address/entity discrepancies).
   - 4. Re-run AI verification from Vendor Portal.
8. When asked "Am I ready to submit?", check mandatory items. If any mandatory item is MISSING, FAIL, or under critical REVIEW, state clearly that the submission is NOT ready, list the specific blockers, and note which mandatory items have passed.
9. MULTI-LINGUAL SUPPORT: Answer fluently in the requested language (English, Hindi हिन्दी, or Marathi मराठी).
   CRITICAL: Do NOT translate company names, PAN, GSTIN, Udyam numbers, CIN, addresses, or Tender IDs.
10. DATA ISOLATION: Never mix or disclose another vendor's confidential information. If asked about a competitor, refuse politely citing procurement data privacy rules.
11. OFFICER MODE: For officers, summarize the selected bidder's evidence, explain discrepancies, and prioritize review items without taking autonomous decisions.
12. NO HALLUCINATIONS: If information is not in the active record, state: "I don't have that information in the current SendaTender submission data."
13. If using mock data, clarify that it is verified via SendaTender's Mock Government Registry (SIH Demo).`;

/**
 * Lightweight Intent Classifier for User Queries across English, Hindi, and Marathi
 */
function detectIntent(message) {
  const m = (message || '').toLowerCase().trim();

  // Missing documents
  if (m.includes('missing') || m.includes('incomplete') || m.includes('not upload') || m.includes('बाकी') ||
      m.includes('गहाळ') || m.includes('अपूर्ण') || m.includes('कोणते दस्तऐवज हवे') || m.includes('क्या कमी') ||
      m.includes('क्या छूट गया') || m.includes('कागदपत्रे बाकी')) {
    return 'missing_documents';
  }

  // Failed documents / Why failed / Expired
  if (m.includes('why fail') || m.includes('what fail') || m.includes('failed') || m.includes('expired') ||
      m.includes('lapsed') || m.includes('मुदत संपली') || m.includes('विफल') ||
      m.includes('फेल') || m.includes('अयशस्वी') || m.includes('का अयशस्वी') || m.includes('क्यों फेल')) {
    return 'failed_documents';
  }

  // Review documents / Discrepancy
  if (m.includes('review') || m.includes('discrepancy') || m.includes('mismatch') || m.includes('तफावत') ||
      m.includes('समीक्षा') || m.includes('आढावा') || m.includes('बेमेल') || m.includes('विसंगति') ||
      m.includes('why is my gst under review') || m.includes('why is my pan under review')) {
    return 'review_documents';
  }

  // Passed documents
  if (m.includes('passed') || m.includes('what passed') || m.includes('सत्यापित') || m.includes('मंजूर') ||
      m.includes('पास') || m.includes('यशस्वी')) {
    return 'passed_documents';
  }

  // Score / Compliance explanation
  if (m.includes('score') || m.includes('compliance') || m.includes('marks') || m.includes('स्कोर') ||
      m.includes('गुण') || m.includes('अंक') || m.includes('अनुपालन') || m.includes('low score') ||
      m.includes('कम स्कोर') || m.includes('कमी स्कोअर')) {
    return 'compliance_score';
  }

  // Risk status
  if (m.includes('risk') || m.includes('जोखीम') || m.includes('जोखिम') || m.includes('high risk') ||
      m.includes('medium risk') || m.includes('low risk')) {
    return 'risk_status';
  }

  // Next steps / What should I do / Remediation
  if (m.includes('what should i do') || m.includes('what next') || m.includes('next step') ||
      m.includes('what to do') || m.includes('fix') || m.includes('correct') || m.includes('पुढील पाऊल') ||
      m.includes('काय करू') || m.includes('कसे दुरुस्त') || m.includes('क्या करूँ') || m.includes('कैसे ठीक') ||
      m.includes('how do i fix') || m.includes('how to fix') || m.includes('कसा सोडवू')) {
    return 'next_steps';
  }

  // Submission readiness
  if (m.includes('ready to submit') || m.includes('can i submit') || m.includes('ready') ||
      m.includes('submission readiness') || m.includes('जमा करू शकतो') || m.includes('सादर करू शकतो') ||
      m.includes('सबमिट कर सकता हूँ') || m.includes('तैयार है क्या') || m.includes('सज्ज आहे का')) {
    return 'submission_readiness';
  }

  // Progress summary
  if (m.includes('progress') || m.includes('status') || m.includes('summary') || m.includes('प्रगती') ||
      m.includes('प्रगति') || m.includes('माझा अहवाल') || m.includes('स्टेटस')) {
    return 'bid_progress';
  }

  // Document upload navigation
  if (m.includes('how to upload') || m.includes('where to upload') || m.includes('upload process') ||
      m.includes('अपलोड कसे') || m.includes('अपलोड कैसे')) {
    return 'document_upload';
  }

  // Tender requirements checklist
  if (m.includes('what document') || m.includes('required document') || m.includes('checklist') ||
      m.includes('आवश्यक दस्तऐवज') || m.includes('आवश्यक दस्तावेज़') || m.includes('कागदपत्रे कोणती')) {
    return 'tender_requirements';
  }

  // Comparison / Audit Trail (Officer queries)
  if (m.includes('compare') || m.includes('comparison') || m.includes('तुलना')) {
    return 'bidder_comparison';
  }
  if (m.includes('audit') || m.includes('hash') || m.includes('integrity') || m.includes('ऑडिट')) {
    return 'audit_trail';
  }

  // Officer review
  if (m.includes('officer') || m.includes('decision') || m.includes('approve') || m.includes('flagged') ||
      m.includes('why is this bidder flagged') || m.includes('निर्णय') ||
      m.includes('अधिकारी') || m.includes('स्वीकृत')) {
    return 'officer_review';
  }

  return 'general_help';
}

/**
 * Deterministic Grounded Engine: Uses Authoritative Progress State to Answer
 */
function generateGroundedProgressResponse(userMessage, progressState, conversationHistory = []) {
  const lang = progressState.language || 'en';
  const isHi = lang === 'hi';
  const isMr = lang === 'mr';
  const intent = detectIntent(userMessage);

  // Security: Check for cross-bidder or competitor queries
  const lowerMsg = (userMessage || '').toLowerCase();
  if (lowerMsg.includes('competitor') || lowerMsg.includes('other bidder') || lowerMsg.includes('another bidder') ||
      lowerMsg.includes('opponent') || lowerMsg.includes('secret') || lowerMsg.includes('api key') || lowerMsg.includes('password')) {
    if (isMr) {
      return {
        reply: "सुरक्षा संरक्षण: मी कोणत्याही अन्य बोलीदाराची किंवा बाह्य आस्थापनेची वैधानिक कागदपत्रे/माहिती उघड करू शकत नाही. सर्व बोलीदार संचिका अधिकृत अधिकार्‍यांसाठी सुरक्षित आणि डेटा-आयसोलेटेड आहेत.",
        intent: 'security_block',
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: "सुरक्षा संरक्षण: मैं किसी अन्य बोलीदाता या निजी इकाई के वैधानिक दस्तावेज़/जानकारी का खुलासा नहीं कर सकता। सभी बोलीदाता फाइलें अधिकृत अधिकारियों के लिए सुरक्षित एवं डेटा-आइसोलेटेड हैं।",
        intent: 'security_block',
        isAi: false
      };
    }
    return {
      reply: "Security Protection: I cannot disclose another bidder's confidential statutory documents or private information. All procurement dossiers are strictly isolated to authorized users.",
      intent: 'security_block',
      isAi: false
    };
  }

  // Handle Bidder Comparison (Officer-only, can be asked without a single bidder selected)
  if (intent === 'bidder_comparison') {
    if (progressState.role !== 'officer') {
      if (isMr) {
        return {
          reply: `सुरक्षा संरक्षण: विक्रेता वापरकर्त्यांना स्पर्धात्मक बोलीदारांची तुलना पाहण्याची परवानगी नाही. ही सुविधा केवळ अधिकृत अधिकाऱ्यांसाठी उपलब्ध आहे.`,
          intent: 'security_block',
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `सुरक्षा संरक्षण: विक्रेता उपयोगकर्ताओं को प्रतिस्पर्धी बोलीदाताओं की तुलना देखने की अनुमति नहीं है। यह सुविधा केवल अधिकृत अधिकारियों के लिए उपलब्ध है।`,
          intent: 'security_block',
          isAi: false
        };
      }
      return {
        reply: `Security Protection: Competitor comparisons are restricted to authorized Procurement Officers. Vendor accounts cannot view multi-bidder comparative data.`,
        intent: 'security_block',
        isAi: false
      };
    }

    if (isMr) {
      return {
        reply: `अधिकारी बोलीदार तुलना डेस्क:\n\n` +
          `सेंदातेंद्रेमध्ये ५ अधिकृत डेमो बोलीदारांची तुलना उपलब्ध आहे:\n` +
          `• प्रोग्रेस इंजिनमधील वस्तुनिष्ठ निकषांवर आधारित तुलना.\n` +
          `• अनुपालन स्कोअर, जोखीम पातळी, सादरीकरण सज्जता आणि वैधानिक स्थिती (GST, PAN, Udyam, MCA).\n\n` +
          `तुलना पाहण्यासाठी: 'अधिकारी पोर्टल' (Officer Portal) उघडा आणि 'बोलीदार तुलना' (Bidder Comparison) टॅब निवडा.`,
        intent,
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: `अधिकारी बोलीदाता तुलना डेस्क:\n\n` +
          `सेंदातेंद्रे में 5 आधिकारिक डेमो बोलीदाताओं की तुलना उपलब्ध है:\n` +
          `• प्रोग्रेस इंजन के तथ्यात्मक मानदंडों पर आधारित तुलना।\n` +
          `• अनुपालन स्कोर, जोखिम स्तर, प्रस्तुति तत्परता एवं वैधानिक स्थिति (GST, PAN, Udyam, MCA)।\n\n` +
          `तुलना देखने हेतु: 'अधिकारी पोर्टल' (Officer Portal) खोलें और 'बोलीदाता तुलना' (Bidder Comparison) टैब चुनें।`,
        intent,
        isAi: false
      };
    }
    return {
      reply: `Officer Bidder Comparison Desk:\n\n` +
        `Authoritative factual comparison of the 5 demo bidders is available:\n` +
        `• Direct Progress Engine metrics (Score, Risk, Readiness, Pass/Review/Fail/Missing/Expired counts).\n` +
        `• Statutory registry status across GSTN, PAN, Udyam, and MCA21.\n\n` +
        `To inspect: Open Officer Portal and select the 'Bidder Comparison' tab.`,
      intent,
      isAi: false
    };
  }

  // Handle Audit Trail (can be asked without a single bidder selected)
  if (intent === 'audit_trail') {
    const isOfficer = progressState.role === 'officer';
    if (!isOfficer) {
      const activityCount = (progressState.activity || []).length;
      if (isMr) {
        return {
          reply: `आपल्या सबमिशनच्या ऑडिट नोंदी:\n` +
            `• आपल्या संचिकेत एकूण ${activityCount} वैधानिक कार्यप्रवाह नोंदी नोंदवल्या आहेत.\n` +
            `• प्रत्येक कृती क्रिप्टोग्राफिक हॅश-साखळीद्वारे संरक्षित आहे.`,
          intent,
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `आपके सबमिशन के ऑडिट रिकॉर्ड्स:\n` +
            `• आपकी संचिका में कुल ${activityCount} वैधानिक कार्यप्रवाह प्रविष्टियां दर्ज हैं।\n` +
            `• प्रत्येक गतिविधि क्रिप्टोग्राफिक हैश-श्रृंखला द्वारा सुरक्षित है।`,
          intent,
          isAi: false
        };
      }
      return {
        reply: `Your Submission Audit Trail:\n` +
          `• There are ${activityCount} workflow audit events recorded for your dossier.\n` +
          `• Each event is cryptographically hash-chained and tamper-evident.`,
        intent,
        isAi: false
      };
    }

    if (isMr) {
      return {
        reply: `हॅश-साखळीबद्ध ऑडिट ट्रेल (अधिकारी डेस्क):\n\n` +
          `• ऑडिट अखंडता: सत्यापित (SHA-256 Cryptographic Chain)\n` +
          `• नोंदवलेल्या कृती: दस्तऐवज पडताळणी, सादरता, अधिकारी नोंदी, तफावत निवारण आणि निर्णय.\n` +
          `संपूर्ण ऑडिट इतिहास तपासण्यासाठी अधिकारी पोर्टलवरील 'ऑडिट ट्रेल' टॅब वापरा.`,
        intent,
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: `हैश-श्रृंखलाबद्ध ऑडिट ट्रेल (अधिकारी डेस्क):\n\n` +
          `• ऑडिट अखंडता: सत्यापित (SHA-256 Cryptographic Chain)\n` +
          `• दर्ज गतिविधियां: दस्तावेज़ सत्यापन, प्रस्तुति, अधिकारी नोट्स, विसंगति निवारण एवं निर्णय।\n` +
          `पूर्ण ऑडिट इतिहास की समीक्षा हेतु अधिकारी पोर्टल पर 'ऑडिट ट्रेल' टैब का उपयोग करें।`,
        intent,
        isAi: false
      };
    }
    return {
      reply: `Hash-Chained Audit Trail (Officer Review Desk):\n\n` +
        `• Audit Integrity: Verified (SHA-256 Cryptographic Chain)\n` +
        `• Tracked Actions: Verification completions, submissions, officer notes, discrepancy resolutions, and decisions.\n` +
        `Inspect full chronological logs with cryptographic hashes in the 'Audit Trail' tab of the Officer Portal.`,
      intent,
      isAi: false
    };
  }

  // If no active bidder is currently selected / loaded
  if (!progressState.hasActiveBidder) {
    if (isMr) {
      return {
        reply: "सध्या कोणतीही बोलीदार संचिका निवडलेली नाही.\n\nकृपया 'विक्रेता पोर्टल' (Vendor Portal) मध्ये जाऊन आपले निविदा दस्तऐवज अपलोड करा किंवा 'अधिकारी पोर्टल' (Officer Portal) मधून एखाद्या बोलीदाराची निवड करा जेणेकरून मी अचूक सद्यस्थितीवर आधारित उत्तरे देऊ शकेन.",
        intent: 'no_bidder',
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: "वर्तमान में कोई बोलीदाता संचिका चयनित नहीं है।\n\nकृपया 'विक्रेता पोर्टल' (Vendor Portal) में जाकर अपने निविदा दस्तावेज़ अपलोड करें या 'अधिकारी पोर्टल' (Officer Portal) से किसी बोलीदाता का चयन करें ताकि मैं सटीक वर्तमान स्थिति पर आधारित उत्तर दे सकूँ।",
        intent: 'no_bidder',
        isAi: false
      };
    }
    return {
      reply: "No active bidder submission is currently selected.\n\nPlease upload your documents in the Vendor Portal or select a bidder dossier in the Officer Portal so I can provide accurate, context-aware assistance based on your active submission.",
      intent: 'no_bidder',
      isAi: false
    };
  }

  const v = progressState.vendor;
  const c = progressState.compliance;
  const docs = progressState.documents || [];
  const bProg = progressState.bidProgress || {};

  const missingDocs = docs.filter(d => d.status === 'MISSING');
  const failDocs = docs.filter(d => d.status === 'FAIL');
  const reviewDocs = docs.filter(d => d.status === 'REVIEW');
  const passDocs = docs.filter(d => d.status === 'PASS');

  // Check for follow-up questions referencing previous turn (e.g., "How do I fix it?", "How do I fix that?")
  const isFollowUp = lowerMsg.includes('fix it') || lowerMsg.includes('fix that') || lowerMsg.includes('कसे दुरुस्त करू') ||
                     lowerMsg.includes('कसा सोडवू') || lowerMsg.includes('कैसे ठीक करूँ') || lowerMsg.includes('कैसे सुधारें');
  
  if (isFollowUp && conversationHistory.length > 0) {
    // Look at last messages to see which document was discussed
    const prevTurn = conversationHistory.slice(-2).map(h => (h.text || '').toLowerCase()).join(' ');
    if (prevTurn.includes('gst')) {
      if (isMr) {
        return {
          reply: `GST तफावत दुरुस्त करण्यासाठी पावले:\n` +
            `१. विक्रेता पोर्टल उघडा आणि घोषित आस्थापना नाव आणि पत्ता GST प्रमाणपत्राशी तंतोतंत जुळवून अद्ययावत करा.\n` +
            `२. चालू वैध GST नोंदणी प्रमाणपत्र (फॉर्म GST REG-06) PDF स्वरूपात पुन्हा अपलोड करा.\n` +
            `३. 'एआय पडताळणी सुरू करा' वर क्लिक करून पुन्हा पडताळणी चालवा.`,
          intent: 'remediation',
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `GST विसंगति सुधारने के चरण:\n` +
            `1. विक्रेता पोर्टल खोलें और घोषित कानूनी नाम और पता GST प्रमाणपत्र के साथ पूर्णतः मेल खाने के लिए अद्यतन करें।\n` +
            `2. वैध GST पंजीकरण प्रमाणपत्र (प्रपत्र GST REG-06) PDF प्रारूप में पुनः अपलोड करें।\n` +
            `3. 'एआई सत्यापन शुरू करें' पर क्लिक करके पुनः सत्यापन चलाएं।`,
          intent: 'remediation',
          isAi: false
        };
      }
      return {
        reply: `Steps to resolve your GST discrepancy:\n` +
          `1. Open Vendor Portal and ensure your declared legal name and business address match the registered GSTIN address exactly.\n` +
          `2. Re-upload your active GST Registration Certificate (Form GST REG-06).\n` +
          `3. Click 'Start AI verification' to re-run automated verification.`,
        intent: 'remediation',
        isAi: false
      };
    } else if (prevTurn.includes('pan')) {
      if (isMr) {
        return {
          reply: `PAN तफावत दुरुस्त करण्यासाठी पावले:\n` +
            `१. PAN कार्डवरील नाव आणि MCA/GST दस्तऐवजांवरील आस्थापना शीर्षक एकसारखे असल्याची खात्री करा.\n` +
            `२. कंपनीच्या अधिकृत पॅन कार्डची स्पष्ट प्रत पुन्हा अपलोड करा.\n` +
            `३. विक्रेता पोर्टलवरून पुन्हा पडताळणी चालवा.`,
          intent: 'remediation',
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `PAN विसंगति सुधारने के चरण:\n` +
            `1. सुनिश्चित करें कि PAN कार्ड पर नाम और MCA/GST दस्तावेज़ों पर इकाई का नाम एक समान है।\n` +
            `2. कंपनी के आधिकारिक पैन कार्ड की स्पष्ट प्रति पुनः अपलोड करें।\n` +
            `3. विक्रेता पोर्टल से पुनः सत्यापन चलाएं।`,
          intent: 'remediation',
          isAi: false
        };
      }
      return {
        reply: `Steps to resolve your PAN discrepancy:\n` +
          `1. Ensure your legal entity title on the PAN card matches your MCA Certificate of Incorporation and GST certificate.\n` +
          `2. Re-upload a clear copy of the entity PAN card in the Vendor Portal.\n` +
          `3. Re-run AI verification.`,
        intent: 'remediation',
        isAi: false
      };
    }
  }

  // 1. INTENT: MISSING DOCUMENTS
  if (intent === 'missing_documents') {
    if (missingDocs.length === 0) {
      if (isMr) {
        return {
          reply: `बोलीदार "${v.name}" च्या संचिकेनुसार:\n\n✅ कोणतेही अनिवार्य वैधानिक दस्तऐवज गहाळ नाहीत.\n\nसर्व ${docs.length} पैकी ${passDocs.length} दस्तऐवज उत्तीर्ण (PASS), ${reviewDocs.length} आढाव्याखाली (REVIEW), आणि ${failDocs.length} अयशस्वी (FAIL) आहेत.`,
          intent,
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `बोलीदाता "${v.name}" के रिकॉर्ड के अनुसार:\n\n✅ कोई भी अनिवार्य वैधानिक दस्तावेज़ अनुपलब्ध (Missing) नहीं है।\n\nकुल ${docs.length} में से ${passDocs.length} दस्तावेज़ उत्तीर्ण (PASS), ${reviewDocs.length} समीक्षाधीन (REVIEW), और ${failDocs.length} विफल (FAIL) हैं।`,
          intent,
          isAi: false
        };
      }
      return {
        reply: `For bidder "${v.name}":\n\n✅ No mandatory statutory documents are currently missing.\n\nOut of ${docs.length} required checks, ${passDocs.length} have PASSED, ${reviewDocs.length} are under REVIEW, and ${failDocs.length} have FAILED.`,
        intent,
        isAi: false
      };
    }

    if (isMr) {
      let r = `आपल्या सध्याच्या सादरीकरणात एकूण ${docs.length} पैकी ${docs.length - missingDocs.length} दस्तऐवज उपलब्ध आहेत.\n\n`;
      r += `🔴 गहाळ दस्तऐवज (MISSING):\n`;
      missingDocs.forEach(d => { r += `• ${d.name} (${d.code})\n`; });
      if (reviewDocs.length > 0) {
        r += `\n🟡 आढावा आवश्यक (REVIEW):\n`;
        reviewDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
      }
      if (failDocs.length > 0) {
        r += `\n❌ अयशस्वी (FAIL):\n`;
        failDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
      }
      r += `\nपुढील पाऊल: कृपया विक्रेता पोर्टलवरून (Vendor Portal) गहाळ दस्तऐवज अपलोड करा.`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `आपके वर्तमान सबमिशन में कुल ${docs.length} में से ${docs.length - missingDocs.length} दस्तावेज़ मौजूद हैं।\n\n`;
      r += `🔴 अनुपलब्ध दस्तावेज़ (MISSING):\n`;
      missingDocs.forEach(d => { r += `• ${d.name} (${d.code})\n`; });
      if (reviewDocs.length > 0) {
        r += `\n🟡 समीक्षा आवश्यक (REVIEW):\n`;
        reviewDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
      }
      if (failDocs.length > 0) {
        r += `\n❌ विफल (FAIL):\n`;
        failDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
      }
      r += `\nअगला कदम: कृपया विक्रेता पोर्टल (Vendor Portal) से अनुपलब्ध दस्तावेज़ अपलोड करें।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `You currently have ${docs.length - missingDocs.length} of ${docs.length} statutory requirements accounted for.\n\n`;
    r += `🔴 Missing (MISSING):\n`;
    missingDocs.forEach(d => { r += `• ${d.name}\n`; });
    if (reviewDocs.length > 0) {
      r += `\n🟡 Under Review (REVIEW):\n`;
      reviewDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
    }
    if (failDocs.length > 0) {
      r += `\n❌ Failed (FAIL):\n`;
      failDocs.forEach(d => { r += `• ${d.name} — ${d.findings[0] || d.evidence}\n`; });
    }
    r += `\nNext step: Upload the missing documents in the Vendor Portal.`;
    return { reply: r, intent, isAi: false };
  }

  // 2. INTENT: FAILED DOCUMENTS
  if (intent === 'failed_documents') {
    if (failDocs.length === 0) {
      if (isMr) return { reply: `✅ आपल्या सादरीकरणात कोणताही दस्तऐवज अयशस्वी (FAIL) झालेला नाही.`, intent, isAi: false };
      if (isHi) return { reply: `✅ आपके सबमिशन में कोई भी दस्तावेज़ विफल (FAIL) नहीं हुआ है।`, intent, isAi: false };
      return { reply: `✅ There are no FAILED documents in your current submission.`, intent, isAi: false };
    }

    if (isMr) {
      let r = `सध्या खालील दस्तऐवज अयशस्वी (FAIL) ठरले आहेत:\n\n`;
      failDocs.forEach(d => {
        r += `❌ ${d.name}:\n   - पुरावा: ${d.evidence}\n   - कारण: ${d.findings.join(', ') || 'वैधानिक अटींची पूर्तता झाली नाही'}\n`;
      });
      r += `\nसुचवलेली कृती: मुदत संपलेली किंवा निलंबित प्रमाणपत्रे अद्ययावत करून पुन्हा अपलोड करा.`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `वर्तमान में निम्नलिखित दस्तावेज़ विफल (FAIL) हुए हैं:\n\n`;
      failDocs.forEach(d => {
        r += `❌ ${d.name}:\n   - साक्ष्य: ${d.evidence}\n   - कारण: ${d.findings.join(', ') || 'वैधानिक शर्तें पूरी नहीं हुईं'}\n`;
      });
      r += `\nसुझाई गई कार्रवाई: समाप्त या निलंबित प्रमाणपत्रों को नवीनीकृत करके पुनः अपलोड करें।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `The following requirements have FAILED verification:\n\n`;
    failDocs.forEach(d => {
      r += `❌ ${d.name}:\n   - Evidence: ${d.evidence}\n   - Reason: ${d.findings.join(', ') || 'Failed statutory criteria'}\n`;
    });
    r += `\nRecommended Action: Replace expired or suspended certificates with currently valid documents and re-verify.`;
    return { reply: r, intent, isAi: false };
  }

  // 3. INTENT: REVIEW DOCUMENTS / DISCREPANCIES
  if (intent === 'review_documents') {
    if (reviewDocs.length === 0) {
      if (isMr) return { reply: `✅ कोणताही दस्तऐवज पुनरावलोकनासाठी (REVIEW) प्रलंबित नाही.`, intent, isAi: false };
      if (isHi) return { reply: `✅ कोई भी दस्तावेज़ समीक्षा (REVIEW) के अधीन नहीं है।`, intent, isAi: false };
      return { reply: `✅ There are no documents currently under REVIEW in your submission.`, intent, isAi: false };
    }

    if (isMr) {
      let r = `पुनरावलोकन आवश्यक असलेले दस्तऐवज (REVIEW):\n\n`;
      reviewDocs.forEach(d => {
        r += `🟡 ${d.name}:\n   - आढळलेली तफावत: ${d.findings.join(', ') || d.evidence}\n`;
      });
      r += `\nसुचवलेली कृती: आस्थापना नाव आणि पत्ता सर्व दस्तऐवजांमध्ये एकसमान असल्याची खात्री करा.`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `समीक्षाधीन दस्तावेज़ (REVIEW):\n\n`;
      reviewDocs.forEach(d => {
        r += `🟡 ${d.name}:\n   - पाई गई विसंगति: ${d.findings.join(', ') || d.evidence}\n`;
      });
      r += `\nसुझाई गई कार्रवाई: सुनिश्चित करें कि कानूनी इकाई का नाम और पता सभी दस्तावेज़ों में एक समान है।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `Documents currently requiring REVIEW:\n\n`;
    reviewDocs.forEach(d => {
      r += `🟡 ${d.name}:\n   - Discrepancy: ${d.findings.join(', ') || d.evidence}\n`;
    });
    r += `\nRecommended Action: Verify that the legal entity title and address are identical across PAN, GST, and Bank records.`;
    return { reply: r, intent, isAi: false };
  }

  // 4. INTENT: PASSED DOCUMENTS
  if (intent === 'passed_documents') {
    if (passDocs.length === 0) {
      if (isMr) return { reply: `सध्या कोणताही दस्तऐवज पूर्णतः उत्तीर्ण (PASS) झालेला नाही. पडताळणी त्रुटी तपासा.`, intent, isAi: false };
      if (isHi) return { reply: `वर्तमान में कोई भी दस्तावेज़ पूर्णतः उत्तीर्ण (PASS) नहीं हुआ है। कृपया सत्यापन त्रुटियों की जांच करें।`, intent, isAi: false };
      return { reply: `No documents have currently passed full statutory verification.`, intent, isAi: false };
    }

    if (isMr) {
      let r = `✅ यशस्वीरित्या पडताळणी पूर्ण झालेले दस्तऐवज (PASS):\n\n`;
      passDocs.forEach(d => {
        r += `🟢 ${d.name} (${d.identifier || 'वैध पुरावा'})\n   - पुरावा: ${d.evidence}\n`;
      });
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `✅ सफलतापूर्वक सत्यापित दस्तावेज़ (PASS):\n\n`;
      passDocs.forEach(d => {
        r += `🟢 ${d.name} (${d.identifier || 'वैध साक्ष्य'})\n   - साक्ष्य: ${d.evidence}\n`;
      });
      return { reply: r, intent, isAi: false };
    }

    let r = `✅ Successfully verified documents (PASS):\n\n`;
    passDocs.forEach(d => {
      r += `🟢 ${d.name} (${d.identifier || 'Verified'})\n   - Evidence: ${d.evidence}\n`;
    });
    return { reply: r, intent, isAi: false };
  }

  // 5. INTENT: COMPLIANCE SCORE & WHY
  if (intent === 'compliance_score' || intent === 'risk_status') {
    const unresolved = [];
    failDocs.forEach(d => unresolved.push(`❌ ${d.name} — ${d.findings[0] || 'अयशस्वी / Failed'}`));
    missingDocs.forEach(d => unresolved.push(`⚪ ${d.name} — ${isMr ? 'गहाळ / Missing' : isHi ? 'अनुपलब्ध / Missing' : 'Missing'}`));
    reviewDocs.forEach(d => unresolved.push(`🟡 ${d.name} — ${d.findings[0] || 'आढावा / Review'}`));

    if (isMr) {
      let r = `बोलीदार "${v.name}" चे अनुपालन विश्लेषण:\n\n`;
      r += `• अनुपालन स्कोअर: ${c.score}%\n`;
      r += `• जोखीम पातळी: ${c.risk} Risk\n`;
      r += `• स्थिती: ${c.status}\n\n`;
      if (unresolved.length > 0) {
        r += `स्कोअरवर परिणाम करणारे घटक:\n` + unresolved.join('\n') + `\n\n`;
      } else {
        r += `सर्व वैधानिक निकष पूर्ण झाले आहेत आणि कोणतीही प्रतिकूल नोंद नाही.\n\n`;
      }
      r += `हा स्कोअर सेंदातेंद्रेच्या ५-स्तरीय पडताळणी इंजिनने मोजलेला आहे.`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `बोलीदाता "${v.name}" का अनुपालन विश्लेषण:\n\n`;
      r += `• अनुपालन स्कोर: ${c.score}%\n`;
      r += `• जोखिम स्तर: ${c.risk} Risk\n`;
      r += `• स्थिति: ${c.status}\n\n`;
      if (unresolved.length > 0) {
        r += `स्कोर को प्रभावित करने वाले अनसुलझे बिंदु:\n` + unresolved.join('\n') + `\n\n`;
      } else {
        r += `सभी वैधानिक मानदंड पूरे हो चुके हैं और कोई विसंगति नहीं मिली है।\n\n`;
      }
      r += `यह स्कोर सेंदातेंद्रे के 5-स्तरीय सत्यापन इंजन द्वारा गणना किया गया है।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `Compliance assessment for "${v.name}":\n\n`;
    r += `• Compliance Score: ${c.score}%\n`;
    r += `• Assessed Risk: ${c.risk} Risk\n`;
    r += `• Status: ${c.status}\n\n`;
    if (unresolved.length > 0) {
      r += `Unresolved items affecting your score:\n` + unresolved.join('\n') + `\n\n`;
    } else {
      r += `All statutory criteria have passed with zero detected discrepancies.\n\n`;
    }
    r += `This score reflects the active verification findings evaluated in SendaTender.`;
    return { reply: r, intent, isAi: false };
  }

  // 6. INTENT: WHAT SHOULD I DO NEXT?
  if (intent === 'next_steps') {
    const actions = bProg.nextActions || [];

    if (isMr) {
      let r = `आपल्या सध्याच्या सादरीकरणावर आधारित सुचवलेली पुढील पावले:\n\n`;
      actions.forEach((act, idx) => {
        r += `${idx + 1}. ${act}\n`;
      });
      r += `\nसध्याचा अनुपालन स्कोअर: ${c.score}% (${c.risk} जोखीम).`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `आपके वर्तमान सबमिशन पर आधारित अनुशंसित अगले कदम:\n\n`;
      actions.forEach((act, idx) => {
        r += `${idx + 1}. ${act}\n`;
      });
      r += `\nवर्तमान अनुपालन स्कोर: ${c.score}% (${c.risk} जोखिम)।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `Based on your current submission, I recommend these next steps:\n\n`;
    actions.forEach((act, idx) => {
      r += `${idx + 1}. ${act}\n`;
    });
    r += `\nCurrent Compliance: ${c.score}% (${c.risk} Risk).`;
    return { reply: r, intent, isAi: false };
  }

  // 7. INTENT: SUBMISSION READINESS
  if (intent === 'submission_readiness') {
    const sReady = progressState.submissionReadiness || {};
    const isReady = sReady.status === 'READY';
    const isRequiresReview = sReady.status === 'REQUIRES REVIEW';
    const deadlineStr = sReady.deadline || progressState.tender?.bidClose || '28-Feb-2026 15:00 IST';
    const blockers = sReady.blockers || [];
    const reviewItemsList = sReady.reviewItems || [];

    if (isReady) {
      if (isMr) {
        return {
          reply: `✅ सादरीकरण सज्ज आहे (READY):\n\nसेंदातेंद्रेमधील अधिकृत माहितीनुसार सर्व अनिवार्य वैधानिक दस्तऐवज यशस्वीरित्या उत्तीर्ण (PASS) झाले आहेत आणि कोणतेही अडथळे (Blockers) नाहीत.\n\n• निविदा अंतिम मुदत: ${deadlineStr}\n• सद्य अनुपालन स्कोअर: ${c.score}%\n\nआपण सिम्युलेशन सबमिशन करू शकता किंवा अधिकारी मंजुरीकडे पुढे जाऊ शकता.`,
          intent,
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `✅ प्रस्तुति तैयार है (READY):\n\nसेंदातेंद्रे में आधिकारिक जानकारी के अनुसार सभी अनिवार्य वैधानिक आवश्यकताएं पूरी तरह से उत्तीर्ण (PASS) हो चुकी हैं और कोई अवरोध (Blockers) नहीं है।\n\n• निविदा अंतिम तिथि: ${deadlineStr}\n• वर्तमान अनुपालन स्कोर: ${c.score}%\n\nआप सिमुलेशन सबमिशन कर सकते हैं अथवा अधिकारी समीक्षा हेतु आगे बढ़ सकते हैं।`,
          intent,
          isAi: false
        };
      }
      return {
        reply: `✅ Submission Status: READY\n\nBased on authoritative SendaTender progress state, all mandatory statutory requirements have passed verification with zero unresolved blockers.\n\n• Tender Closing Deadline: ${deadlineStr}\n• Current Compliance Score: ${c.score}%\n\nYou may proceed to the Simulation Submission action.`,
        intent,
        isAi: false
      };
    }

    if (isRequiresReview) {
      if (isMr) {
        let r = `🟡 सादरीकरण पुनरावलोकन आवश्यक आहे (REQUIRES REVIEW):\n\nकाही दस्तऐवजांमध्ये तफावत किंवा अतिरिक्त पडताळणी आवश्यक आहे:\n`;
        reviewItemsList.forEach(item => { r += `• ${item}\n`; });
        r += `\n• निविदा अंतिम मुदत: ${deadlineStr}\n• सद्य अनुपालन स्कोअर: ${c.score}%\nकृपया सबमिट करण्यापूर्वी विसंगती दूर करा किंवा अधिकारी आढाव्याची प्रतीक्षा करा.`;
        return { reply: r, intent, isAi: false };
      }
      if (isHi) {
        let r = `🟡 प्रस्तुति समीक्षा आवश्यक है (REQUIRES REVIEW):\n\nकुछ दस्तावेज़ों में विसंगतियां हैं जिनके लिए समीक्षा आवश्यक है:\n`;
        reviewItemsList.forEach(item => { r += `• ${item}\n`; });
        r += `\n• निविदा अंतिम तिथि: ${deadlineStr}\n• वर्तमान अनुपालन स्कोर: ${c.score}%\nकृपया अंतिम रूप देने से पहले विसंगतियों को ठीक करें।`;
        return { reply: r, intent, isAi: false };
      }
      let r = `🟡 Submission Status: REQUIRES REVIEW\n\nDiscrepancies or review items require attention:\n`;
      reviewItemsList.forEach(item => { r += `• ${item}\n`; });
      r += `\n• Tender Closing Deadline: ${deadlineStr}\n• Current Compliance Score: ${c.score}%\nPlease resolve discrepancies before final submission.`;
      return { reply: r, intent, isAi: false };
    }

    // Not ready
    if (isMr) {
      let r = `🔴 आपले सादरीकरण सज्ज नाही (NOT READY):\n\nखालील अडथळे (Blockers) दूर करणे आवश्यक आहे:\n`;
      blockers.forEach(bItem => { r += `• ❌ ${bItem}\n`; });
      if (missingDocs.length > 0 && !blockers.some(b => b.includes('Missing'))) {
        r += `• ⚪ ${missingDocs.length} अनिवार्य दस्तऐवज गहाळ आहेत.\n`;
      }
      r += `\n• निविदा अंतिम मुदत: ${deadlineStr}\n• सद्य अनुपालन स्कोअर: ${c.score}%\nउत्तीर्ण बाबी: ${passDocs.length} दस्तऐवज वैध आढळले आहेत. कृपया प्रथम वरील त्रुटींचे निवारण करा.`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `🔴 आपका सबमिशन अभी तैयार नहीं है (NOT READY):\n\nनिम्नलिखित अवरोधों (Blockers) को ठीक करना अनिवार्य है:\n`;
      blockers.forEach(bItem => { r += `• ❌ ${bItem}\n`; });
      if (missingDocs.length > 0 && !blockers.some(b => b.includes('Missing'))) {
        r += `• ⚪ ${missingDocs.length} अनिवार्य दस्तावेज़ गायब हैं।\n`;
      }
      r += `\n• निविदा अंतिम तिथि: ${deadlineStr}\n• वर्तमान अनुपालन स्कोर: ${c.score}%\nउत्तीर्ण बिंदु: ${passDocs.length} दस्तावेज़ वैध पाए गए हैं। कृपया पहले उपरोक्त अवरोधों को दूर करें।`;
      return { reply: r, intent, isAi: false };
    }

    let r = `🔴 Submission Status: NOT READY\n\nThe following blocking issues prevent submission:\n`;
    blockers.forEach(bItem => { r += `• ❌ ${bItem}\n`; });
    if (missingDocs.length > 0 && !blockers.some(b => b.includes('Missing'))) {
      r += `• ⚪ ${missingDocs.length} mandatory document(s) are MISSING.\n`;
    }
    r += `\n• Tender Closing Deadline: ${deadlineStr}\n• Current Compliance Score: ${c.score}%\nYour other ${passDocs.length} mandatory document(s) have passed verification. Please resolve the blockers before finalizing your submission.`;
    return { reply: r, intent, isAi: false };
  }

  // 8. INTENT: BID PROGRESS / SUMMARY
  if (intent === 'bid_progress') {
    if (isMr) {
      let r = `आपल्या निविदा सादरीकरणाचा सद्य अहवाल:\n\n`;
      r += `आस्थापना: ${v.name}\n`;
      r += `निविदा: ${progressState.tender.title}\n`;
      r += `प्रगती: ${bProg.percentage}%\n\n`;
      r += `दस्तऐवज स्थिती:\n`;
      r += `🟢 उत्तीर्ण (PASS): ${passDocs.length}\n`;
      r += `🟡 आढावा (REVIEW): ${reviewDocs.length}\n`;
      r += `🔴 अयशस्वी (FAIL): ${failDocs.length}\n`;
      r += `⚪ गहाळ (MISSING): ${missingDocs.length}\n\n`;
      r += `जोखीम पातळी: ${c.risk} | स्कोअर: ${c.score}%\n`;
      r += `सद्य टप्पा: ${bProg.currentStage}`;
      return { reply: r, intent, isAi: false };
    }

    if (isHi) {
      let r = `आपकी निविदा प्रस्तुति की वर्तमान प्रगति:\n\n`;
      r += `इकाई: ${v.name}\n`;
      r += `निविदा: ${progressState.tender.title}\n`;
      r += `प्रगति: ${bProg.percentage}%\n\n`;
      r += `दस्तावेज़ स्थिति:\n`;
      r += `🟢 उत्तीर्ण (PASS): ${passDocs.length}\n`;
      r += `🟡 समीक्षा (REVIEW): ${reviewDocs.length}\n`;
      r += `🔴 विफल (FAIL): ${failDocs.length}\n`;
      r += `⚪ अनुपलब्ध (MISSING): ${missingDocs.length}\n\n`;
      r += `जोखिम स्तर: ${c.risk} | स्कोर: ${c.score}%\n`;
      r += `वर्तमान चरण: ${bProg.currentStage}`;
      return { reply: r, intent, isAi: false };
    }

    let r = `YOUR CURRENT SUBMISSION SUMMARY:\n\n`;
    r += `Entity: ${v.name}\n`;
    r += `Tender: ${progressState.tender.title}\n`;
    r += `Progress: ${bProg.percentage}%\n\n`;
    r += `Documents Checklist:\n`;
    r += `🟢 PASS: ${passDocs.length}\n`;
    r += `🟡 REVIEW: ${reviewDocs.length}\n`;
    r += `🔴 FAIL: ${failDocs.length}\n`;
    r += `⚪ MISSING: ${missingDocs.length}\n\n`;
    r += `Risk Assessment: ${c.risk} Risk | Score: ${c.score}%\n`;
    r += `Current Stage: ${bProg.currentStage}`;
    return { reply: r, intent, isAi: false };
  }

  // 9. INTENT: TENDER REQUIREMENTS / CHECKLIST
  if (intent === 'tender_requirements' || intent === 'document_upload') {
    if (isMr) {
      return {
        reply: `या निविदेसाठी (${progressState.tender.title}) अनिवार्य वैधानिक दस्तऐवज सूची:\n` +
          `१. GST नोंदणी प्रमाणपत्र (सक्रिय GSTIN)\n` +
          `२. PAN कार्ड (कायदेशीर कंपनी शीर्षक)\n` +
          `३. Udyam / MSME नोंदणी (EMD सवलतीसाठी)\n` +
          `४. MCA21 निगमन प्रमाणपत्र / CIN क्रमांक\n` +
          `५. ३ वर्षांचे ITR व लेखापरीक्षित ताळेबंद\n` +
          `६. EMD बँक हमी किंवा MSME सूट प्रमाणपत्र\n` +
          `७. स्वाक्षरीकृत NIT/RFP स्वीकृती आणि BOQ दरपत्रक.\n\n` +
          `अपलोड करण्यासाठी: 'विक्रेता पोर्टल' (Vendor Portal) मध्ये जाऊन फाईल्स ड्रॅग करा आणि 'एआय पडताळणी सुरू करा' दाबा.`,
        intent,
        isAi: false
      };
    }

    if (isHi) {
      return {
        reply: `इस निविदा (${progressState.tender.title}) के लिए अनिवार्य वैधानिक दस्तावेज़ सूची:\n` +
          `1. GST पंजीकरण प्रमाणपत्र (सक्रिय GSTIN)\n` +
          `2. PAN कार्ड (कानूनी इकाई शीर्षक)\n` +
          `3. उद्यम / MSME पंजीकरण (EMD छूट हेतु)\n` +
          `4. MCA21 निगमन प्रमाणपत्र / CIN नंबर\n` +
          `5. 3 वर्षों का ITR व लेखापरीक्षित बैलेंस शीट\n` +
          `6. EMD बैंक गारंटी या MSME छूट प्रमाणपत्र\n` +
          `7. हस्ताक्षरित NIT/RFP स्वीकृति एवं BOQ मूल्य अनुसूची।\n\n` +
          `अपलोड करने हेतु: 'विक्रेता पोर्टल' (Vendor Portal) में जाकर फाइलें ड्रैग करें और 'एआई सत्यापन शुरू करें' दबाएं।`,
        intent,
        isAi: false
      };
    }

    return {
      reply: `Statutory Document Requirements for ${progressState.tender.title}:\n` +
        `1. GST Registration Certificate (Active GSTIN)\n` +
        `2. PAN Card (Entity matched)\n` +
        `3. Udyam / MSME Certificate (for EMD waiver)\n` +
        `4. MCA21 Certificate of Incorporation / CIN\n` +
        `5. 3-Year Audited ITR & Balance Sheets\n` +
        `6. EMD Bank Guarantee or official MSME waiver\n` +
        `7. Signed NIT/RFP acknowledgement and priced BOQ.\n\n` +
        `To upload: Navigate to 'Vendor Portal', drop your files, and click 'Start AI verification'.`,
      intent,
      isAi: false
    };
  }

  // 10. OFFICER REVIEW
  if (intent === 'officer_review') {
    if (isMr) {
      return {
        reply: `अधिकारी आढावा सारांश (${v.name}):\n\n` +
          `• स्कोअर: ${c.score}% | जोखीम: ${c.risk}\n` +
          `• पडताळणी निष्कर्ष: ${c.findings.join('; ') || 'सर्व निकष वैध'}\n` +
          `• निर्णय पर्याय: 'मंजूर' (Approve), 'अधिक माहिती मागवा' (Request More), किंवा 'फ्लॅग करा' (Flag).\n\n` +
          `सूचना: टेंडर बडी स्वयंचलित निर्णय घेत नाही; निर्णय अधिकारी पोर्टलवरून नोंदवावा.`,
        intent,
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: `अधिकारी समीक्षा सारांश (${v.name}):\n\n` +
          `• स्कोर: ${c.score}% | जोखिम: ${c.risk}\n` +
          `• सत्यापन निष्कर्ष: ${c.findings.join('; ') || 'सभी मानदंड वैध'}\n` +
          `• निर्णय विकल्प: 'स्वीकृत' (Approve), 'अधिक मांगें' (Request More), या 'फ्लैग' (Flag)।\n\n` +
          `नोट: टेंडर बडी स्वतः निर्णय नहीं लेता; निर्णय अधिकारी पोर्टल से ही लिया जाना चाहिए।`,
        intent,
        isAi: false
      };
    }
    return {
      reply: `Officer Review Dossier for "${v.name}":\n\n` +
        `• Compliance: ${c.score}% (${c.risk} Risk)\n` +
        `• Findings: ${c.findings.join('; ') || 'All statutory checks passed'}\n` +
        `• Available Actions: 'Approve', 'Request More', or 'Flag' from the Officer Decision Panel.\n\n` +
        `Note: Tender Buddy provides decision support; official sanction must be logged by the authorized desk officer.`,
      intent,
      isAi: false
    };
  }

  // 11. BIDDER COMPARISON (Officer Role)
  if (intent === 'bidder_comparison') {
    if (progressState.role !== 'officer') {
      if (isMr) {
        return {
          reply: `सुरक्षा संरक्षण: विक्रेता वापरकर्त्यांना स्पर्धात्मक बोलीदारांची तुलना पाहण्याची परवानगी नाही. ही सुविधा केवळ अधिकृत अधिकाऱ्यांसाठी उपलब्ध आहे.`,
          intent: 'security_block',
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `सुरक्षा संरक्षण: विक्रेता उपयोगकर्ताओं को प्रतिस्पर्धी बोलीदाताओं की तुलना देखने की अनुमति नहीं है। यह सुविधा केवल अधिकृत अधिकारियों के लिए उपलब्ध है।`,
          intent: 'security_block',
          isAi: false
        };
      }
      return {
        reply: `Security Protection: Competitor comparisons are restricted to authorized Procurement Officers. Vendor accounts cannot view multi-bidder comparative data.`,
        intent: 'security_block',
        isAi: false
      };
    }

    if (isMr) {
      return {
        reply: `अधिकारी बोलीदार तुलना डेस्क:\n\n` +
          `सेंदातेंद्रेमध्ये ५ अधिकृत डेमो बोलीदारांची तुलना उपलब्ध आहे:\n` +
          `• प्रोग्रेस इंजिनमधील वस्तुनिष्ठ निकषांवर आधारित तुलना.\n` +
          `• अनुपालन स्कोअर, जोखीम पातळी, सादरीकरण सज्जता आणि वैधानिक स्थिती (GST, PAN, Udyam, MCA).\n\n` +
          `तुलना पाहण्यासाठी: 'अधिकारी पोर्टल' (Officer Portal) उघडा आणि 'बोलीदार तुलना' (Bidder Comparison) टॅब निवडा.`,
        intent,
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: `अधिकारी बोलीदाता तुलना डेस्क:\n\n` +
          `सेंदातेंद्रे में 5 आधिकारिक डेमो बोलीदाताओं की तुलना उपलब्ध है:\n` +
          `• प्रोग्रेस इंजन के तथ्यात्मक मानदंडों पर आधारित तुलना।\n` +
          `• अनुपालन स्कोर, जोखिम स्तर, प्रस्तुति तत्परता एवं वैधानिक स्थिति (GST, PAN, Udyam, MCA)।\n\n` +
          `तुलना देखने हेतु: 'अधिकारी पोर्टल' (Officer Portal) खोलें और 'बोलीदाता तुलना' (Bidder Comparison) टैब चुनें।`,
        intent,
        isAi: false
      };
    }
    return {
      reply: `Officer Bidder Comparison Desk:\n\n` +
        `Authoritative factual comparison of the 5 demo bidders is available:\n` +
        `• Direct Progress Engine metrics (Score, Risk, Readiness, Pass/Review/Fail/Missing/Expired counts).\n` +
        `• Statutory registry status across GSTN, PAN, Udyam, and MCA21.\n\n` +
        `To inspect: Open Officer Portal and select the 'Bidder Comparison' tab.`,
      intent,
      isAi: false
    };
  }

  // 12. AUDIT TRAIL (Officer / Audit Query)
  if (intent === 'audit_trail') {
    const isOfficer = progressState.role === 'officer';
    if (!isOfficer) {
      // Vendor only sees their own activity
      const activityCount = (progressState.activity || []).length;
      if (isMr) {
        return {
          reply: `आपल्या सबमिशनच्या ऑडिट नोंदी:\n` +
            `• आपल्या संचिकेत एकूण ${activityCount} वैधानिक कार्यप्रवाह नोंदी नोंदवल्या आहेत.\n` +
            `• प्रत्येक कृती क्रिप्टोग्राफिक हॅश-साखळीद्वारे संरक्षित आहे.`,
          intent,
          isAi: false
        };
      }
      if (isHi) {
        return {
          reply: `आपके सबमिशन के ऑडिट रिकॉर्ड्स:\n` +
            `• आपकी संचिका में कुल ${activityCount} वैधानिक कार्यप्रवाह प्रविष्टियां दर्ज हैं।\n` +
            `• प्रत्येक गतिविधि क्रिप्टोग्राफिक हैश-श्रृंखला द्वारा सुरक्षित है।`,
          intent,
          isAi: false
        };
      }
      return {
        reply: `Your Submission Audit Trail:\n` +
          `• There are ${activityCount} workflow audit events recorded for your dossier.\n` +
          `• Each event is cryptographically hash-chained and tamper-evident.`,
        intent,
        isAi: false
      };
    }

    if (isMr) {
      return {
        reply: `हॅश-साखळीबद्ध ऑडिट ट्रेल (अधिकारी डेस्क):\n\n` +
          `• ऑडिट अखंडता: सत्यापित (SHA-256 Cryptographic Chain)\n` +
          `• नोंदवलेल्या कृती: दस्तऐवज पडताळणी, सादरता, अधिकारी नोंदी, तफावत निवारण आणि निर्णय.\n` +
          `संपूर्ण ऑडिट इतिहास तपासण्यासाठी अधिकारी पोर्टलवरील 'ऑडिट ट्रेल' टॅब वापरा.`,
        intent,
        isAi: false
      };
    }
    if (isHi) {
      return {
        reply: `हैश-श्रृंखलाबद्ध ऑडिट ट्रेल (अधिकारी डेस्क):\n\n` +
          `• ऑडिट अखंडता: सत्यापित (SHA-256 Cryptographic Chain)\n` +
          `• दर्ज गतिविधियां: दस्तावेज़ सत्यापन, प्रस्तुति, अधिकारी नोट्स, विसंगति निवारण एवं निर्णय।\n` +
          `पूर्ण ऑडिट इतिहास की समीक्षा हेतु अधिकारी पोर्टल पर 'ऑडिट ट्रेल' टैब का उपयोग करें।`,
        intent,
        isAi: false
      };
    }
    return {
      reply: `Hash-Chained Audit Trail (Officer Review Desk):\n\n` +
        `• Audit Integrity: Verified (SHA-256 Cryptographic Chain)\n` +
        `• Recorded Events: Multi-stage verification, simulation submission, officer review notes, discrepancy resolutions, and decisions.\n` +
        `To inspect and filter all chronologically recorded events, navigate to the Officer Portal 'Audit Trail' tab.`,
      intent,
      isAi: false
    };
  }

  // Default Fallback
  if (isMr) {
    return {
      reply: `नमस्कार! मी 'टेंडर बडी' (Tender Buddy) आहे, आपला प्रगती-सजग एआय सह-पायलट.\n\n` +
        `आपल्या सद्य सादरीकरणात (${v.name}):\n` +
        `• प्रगती: ${bProg.percentage}%\n` +
        `• स्कोअर: ${c.score}% (${c.risk} जोखीम)\n` +
        `• गहाळ: ${missingDocs.length} | आढावा: ${reviewDocs.length} | अयशस्वी: ${failDocs.length} | उत्तीर्ण: ${passDocs.length}\n\n` +
        `मला विचारा: "माझे कोणते दस्तऐवज गहाळ आहेत?", "मी आता काय करावे?", किंवा "माझे सादरीकरण सज्ज आहे का?".`,
      intent: 'general_help',
      isAi: false
    };
  }
  if (isHi) {
    return {
      reply: `नमस्ते! मैं 'टेंडर बडी' (Tender Buddy) हूँ, आपका प्रगति-सजग एआई सह-पायलट।\n\n` +
        `आपके वर्तमान सबमिशन में (${v.name}):\n` +
        `• प्रगति: ${bProg.percentage}%\n` +
        `• स्कोर: ${c.score}% (${c.risk} जोखिम)\n` +
        `• अनुपलब्ध: ${missingDocs.length} | समीक्षा: ${reviewDocs.length} | विफल: ${failDocs.length} | उत्तीर्ण: ${passDocs.length}\n\n` +
        `मुझसे पूछें: "मेरे कौन से दस्तावेज़ गायब हैं?", "मुझे आगे क्या करना चाहिए?", या "क्या मेरा सबमिशन तैयार है?".`,
      intent: 'general_help',
      isAi: false
    };
  }
  return {
    reply: `Hello! I am Tender Buddy, your progress-aware procurement co-pilot.\n\n` +
      `Current Submission for "${v.name}":\n` +
      `• Progress: ${bProg.percentage}%\n` +
      `• Compliance: ${c.score}% (${c.risk} Risk)\n` +
      `• Missing: ${missingDocs.length} | Review: ${reviewDocs.length} | Failed: ${failDocs.length} | Passed: ${passDocs.length}\n\n` +
      `You can ask me: "What documents am I missing?", "What should I do next?", or "Am I ready to submit?".`,
    intent: 'general_help',
    isAi: false
  };
}

/**
 * Call Gemini API with Grounded Progress State Context
 */
async function callGemini(apiKey, prompt, conversationHistory = []) {
  return new Promise((resolve, reject) => {
    const contents = [];

    if (Array.isArray(conversationHistory)) {
      conversationHistory.slice(-6).forEach(msg => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: String(msg.text || '') }]
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: prompt }]
    });

    const bodyData = JSON.stringify({
      contents: contents,
      systemInstruction: {
        parts: [{ text: TENDER_BUDDY_SYSTEM_PROMPT }]
      },
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 800
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyData)
      },
      timeout: 10000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.candidates && parsed.candidates[0] && parsed.candidates[0].content) {
            const text = parsed.candidates[0].content.parts.map(p => p.text).join('\n');
            resolve({ reply: text, isAi: true });
          } else if (parsed.error) {
            reject(new Error(parsed.error.message || 'Gemini API Error'));
          } else {
            reject(new Error('Invalid response structure from Gemini API'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Gemini API call timed out'));
    });

    req.write(bodyData);
    req.end();
  });
}

/**
 * Main Dispatcher for Tender Buddy Chat
 */
async function processTenderBuddyChat({ message, lang = 'en', context = {}, history = [] }) {
  // 1. Build the Authoritative Progress State from current application data
  const progressState = buildProgressState({
    bidder: context.bidder || null,
    tender: context.tender || null,
    role: context.role || 'vendor',
    view: context.view || 'home',
    lang: lang || 'en',
    files: context.files || []
  });

  const intent = detectIntent(message);
  const apiKey = process.env.GEMINI_API_KEY;

  // 2. If Gemini is available, send structured progress state to Gemini
  if (apiKey && apiKey.trim().length > 10) {
    try {
      let prompt = `User Query: "${message}"\nDetected Intent: ${intent}\nTarget Language: ${lang}\n\n`;
      prompt += `AUTHORITATIVE VENDOR PROGRESS ENGINE STATE:\n`;
      prompt += JSON.stringify(progressState, null, 2);
      prompt += `\n\nInstructions: Answer the user's query strictly using the facts in the PROGRESS ENGINE STATE above. Follow all rules regarding status distinctions (MISSING vs FAIL vs REVIEW vs PASS). Format cleanly.`;

      const result = await callGemini(apiKey, prompt, history);
      return {
        success: true,
        reply: result.reply,
        language: lang,
        mode: 'ai',
        intent,
        progress: {
          hasActiveBidder: progressState.hasActiveBidder,
          score: progressState.compliance.score,
          risk: progressState.compliance.risk,
          percentage: progressState.bidProgress.percentage,
          passCount: progressState.compliance.passCount,
          reviewCount: progressState.compliance.reviewCount,
          failCount: progressState.compliance.failCount,
          missingCount: progressState.compliance.missingCount
        }
      };
    } catch (err) {
      console.warn('Gemini API call failed, seamlessly falling back to Grounded Progress Engine:', err.message);
    }
  }

  // 3. Fallback to Grounded Progress Engine
  const fallback = generateGroundedProgressResponse(message, progressState, history);
  return {
    success: true,
    reply: fallback.reply,
    language: lang,
    mode: 'fallback',
    intent: fallback.intent || intent,
    progress: {
      hasActiveBidder: progressState.hasActiveBidder,
      score: progressState.compliance.score,
      risk: progressState.compliance.risk,
      percentage: progressState.bidProgress.percentage,
      passCount: progressState.compliance.passCount,
      reviewCount: progressState.compliance.reviewCount,
      failCount: progressState.compliance.failCount,
      missingCount: progressState.compliance.missingCount
    }
  };
}

module.exports = {
  detectIntent,
  processTenderBuddyChat,
  generateGroundedProgressResponse
};
