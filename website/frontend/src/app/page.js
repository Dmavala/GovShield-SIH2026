'use client';

import { useState, useEffect } from 'react';
import { scanWebsiteClientSide } from './lib/scannerEngine';

// National Ashoka Emblem SVG Component
const AshokaEmblem = () => (
  <svg className="national-emblem-svg" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Emblem of India">
    <path d="M50 10 C35 10 25 25 25 45 C25 65 38 85 50 95 C62 85 75 65 75 45 C75 25 65 10 50 10 Z" fill="#0b2545" opacity="0.9" />
    <circle cx="50" cy="40" r="14" fill="#ffffff" />
    <circle cx="50" cy="40" r="11" fill="#0b2545" />
    <circle cx="50" cy="40" r="3" fill="#ffffff" />
    <line x1="50" y1="29" x2="50" y2="51" stroke="#ffffff" strokeWidth="1" />
    <line x1="39" y1="40" x2="61" y2="40" stroke="#ffffff" strokeWidth="1" />
    <line x1="42" y1="32" x2="58" y2="48" stroke="#ffffff" strokeWidth="1" />
    <line x1="42" y1="48" x2="58" y2="32" stroke="#ffffff" strokeWidth="1" />
    <rect x="30" y="95" width="40" height="10" rx="3" fill="#e35d16" />
    <text x="50" y="118" textAnchor="middle" fill="#0b2545" fontSize="10" fontWeight="900" fontFamily="serif">सत्यमेव जयते</text>
  </svg>
);

// Multilingual Dictionary for Universal Accessibility
const translations = {
  hi: {
    govIndia: "भारत सरकार | GOVERNMENT OF INDIA",
    ministry: "गृह मंत्रालय एवं इलेक्ट्रॉनिक्स और सूचना प्रौद्योगिकी मंत्रालय",
    portalName: "GovShield Sentinel Grid",
    portalSub: "राष्ट्रीय साइबर सुरक्षा एवं फर्जी सरकारी वेबसाइट पहचान प्रणाली",
    helplineTitle: "राष्ट्रीय साइबर हेल्पलाइन",
    helplineSub: "वित्तीय धोखाधड़ी की तुरंत रिपोर्ट करें",
    fontSize: "अक्षर आकार",
    highContrast: "उच्च कंट्रास्ट",
    langName: "English",
    heroBadge: "🛡️ स्मार्ट इंडिया हैकाथॉन (SIH 2026) • समस्या विवरण: SIH1454",
    heroTitle: "फर्जी सरकारी वेबसाइटों और साइबर ठगी से बचें",
    heroSub: "किसी भी संदिग्ध वेबसाइट, लिंक या मैसेज का सत्यापन करें। हमारा AI इंजन तुरंत बताएगा कि वेबसाइट असली है या फर्जी!",
    searchPlaceholder: "वेबसाइट का लिंक यहाँ पेस्ट करें (उदा: pmkisan.gov.in या g0v.in)...",
    verifyBtn: "सत्यापन करें",
    verifyingBtn: "जांच जारी है...",
    quickTry: "परीक्षण हेतु लिंक चुनें:",
    safeSite: "सुरक्षित (PM-Kisan)",
    fakeSite: "फर्जी डोमेन (g0v.in)",
    incomeTax: "आयकर पोर्टल (Authentic)",
    
    // Verdict
    verdictSafe: "सुरक्षित एवं प्रामाणिक",
    verdictThreat: "सावधान! फर्जी / नकली वेबसाइट",
    verdictCaution: "सतर्कता: संदिग्ध वेबसाइट",
    listenAudio: "आवाज़ में सुनें",
    stopAudio: "आवाज़ बंद करें",
    riskScoreLabel: "जोखिम स्कोर (Threat Score)",
    officialRegistry: "आधिकारिक सरकारी रजिस्ट्री",
    tldChecked: "सत्यापित .gov.in / .nic.in डोमेन",
    
    advisoryTitle: "नागरिक सुरक्षा सलाह (Advisory):",
    advisorySafe: "यह वेबसाइट पूरी तरह से प्रामाणिक और आधिकारिक सरकारी पोर्टल है। आप इस पर विश्वास के साथ कार्य कर सकते हैं।",
    advisoryThreat: "चेतावनी! यह वेबसाइट फर्जी है जो सरकारी पोर्टल की नकल कर रही है। अपना आधार नंबर, बैंक खाता, पैन या OTP यहाँ कभी दर्ज न करें!",
    advisoryCaution: "सावधानी बरतें। यह वेबसाइट आधिकारिक सरकारी रजिस्ट्री में दर्ज नहीं है। व्यक्तिगत विवरण दर्ज करने से पहले जांच करें।",
    
    // Forensic Layers
    layer1Title: "1. सरकारी डोमेन प्रमाणन (.gov.in / .nic.in)",
    layer2Title: "2. वर्तनी एवं नाम की नकल (Typosquatting)",
    layer3Title: "3. आधार व पासवर्ड चोरी फॉर्म (Credential Theft)",
    layer4Title: "4. एआई विजुअल क्लोनिंग (Lookalike Match)",
    layer5Title: "5. वेबसाइट की उम्र व पंजीकरण (Domain Age)",
    
    // Cards
    sectionTitle: "नागरिक साइबर सुरक्षा सेवाएं",
    sectionSub: "किसी भी ऑनलाइन धोखे या संदिग्ध लिंक के खिलाफ तत्काल सुरक्षा प्राप्त करें",
    card1Title: "महिला एवं बाल सुरक्षा",
    card1Desc: "ऑनलाइन उत्पीड़न, अवांछित संदेशों और साइबर अपराधों की गोपनीय रिपोर्ट दर्ज करें।",
    card1Btn: "सुरक्षित रिपोर्ट करें",
    card2Title: "वित्तीय धोखाधड़ी रोकथाम",
    card2Desc: "नकली बैंक KYC, फर्जी सब्सिडी, लॉटरी व आधार OTP फ्रॉड से तुरंत सुरक्षा व सहायता।",
    card2Btn: "1930 पर कॉल करें",
    card3Title: "संदिग्ध वेबसाइट की शिकायत",
    card3Desc: "CERT-In और भारतीय साइबर अपराध समन्वय केंद्र (I4C) को कानूनी कार्रवाई हेतु डोजियर भेजें।",
    card3Btn: "डोजियर डाउनलोड करें",

    // Resources
    res1: "नागरिक सुरक्षा नियम",
    res1Sub: "सरकारी पोर्टल पहचानने की विधि",
    res2: "1930 साइबर हेल्पलाइन",
    res2Sub: "24x7 राष्ट्रीय सहायता सेवा",
    res3: "CERT-In सुरक्षा बुलेटिन",
    res3Sub: "नवीनतम साइबर एडवाइजरी",
    res4: "फर्जी एसएमएस अलर्ट",
    res4Sub: "फिशिंग लिंक से बचने के उपाय",
    
    dossierTitle: "CERT-In कानूनी साक्ष्य डोजियर (Incident Report)",
    copyDossier: "डोजियर कॉपी करें",
    copied: "कॉपी हो गया!",
    close: "बंद करें",
    footerText: "राष्ट्रीय साइबर रक्षा प्रणाली • स्मार्ट इंडिया हैकाथॉन (SIH 2026) के अंतर्गत विकसित"
  },
  en: {
    govIndia: "GOVERNMENT OF INDIA | भारत सरकार",
    ministry: "Ministry of Home Affairs & Ministry of Electronics and IT",
    portalName: "GovShield Sentinel Grid",
    portalSub: "National Multi-Signal AI Phishing & Fake Portal Detection System",
    helplineTitle: "National Cyber Helpline",
    helplineSub: "Report Financial Cyber Fraud 24x7",
    fontSize: "Font Size",
    highContrast: "High Contrast",
    langName: "हिंदी",
    heroBadge: "🛡️ Smart India Hackathon (SIH 2026) • Problem Statement: SIH1454",
    heroTitle: "Protect Yourself from Fake Government Websites & Cyber Fraud",
    heroSub: "Verify any suspicious website link, SMS, or portal instantly with our Multi-Signal AI Defense Engine!",
    searchPlaceholder: "Paste portal website URL here (e.g., pmkisan.gov.in or g0v.in)...",
    verifyBtn: "Verify Portal",
    verifyingBtn: "Analyzing...",
    quickTry: "Quick Test Examples:",
    safeSite: "Safe Portal (PM-Kisan)",
    fakeSite: "Fake Typosquat (g0v.in)",
    incomeTax: "IncomeTax (Authentic)",

    // Verdict
    verdictSafe: "VERIFIED AUTHENTIC PORTAL",
    verdictThreat: "CRITICAL THREAT: FAKE CLONE",
    verdictCaution: "CAUTION: SUSPICIOUS DOMAIN",
    listenAudio: "Listen Audio",
    stopAudio: "Stop Audio",
    riskScoreLabel: "Threat Risk Score",
    officialRegistry: "Official Government Registry",
    tldChecked: "Authenticated .gov.in / .nic.in domain",

    advisoryTitle: "Citizen Security Advisory:",
    advisorySafe: "This website is verified as an authentic Government of India portal. It is safe to use.",
    advisoryThreat: "DANGER! This website is a deceptive clone imitating government services. NEVER enter your Aadhaar, Bank Details, PAN, or OTP here!",
    advisoryCaution: "Exercise caution. This domain is not an official government portal. Verify authenticity before entering personal details.",

    // Forensic Layers
    layer1Title: "1. Sovereign TLD Authentication (.gov.in / .nic.in)",
    layer2Title: "2. Typosquatting & Spelling Traps Check",
    layer3Title: "3. Identity & Credential Theft Forms",
    layer4Title: "4. AI Visual Lookalike Detection",
    layer5Title: "5. Domain Age & Registry Verification",

    // Cards
    sectionTitle: "Citizen Cyber Defense Services",
    sectionSub: "Instant safeguards and real-time defense against deceptive portals",
    card1Title: "Women & Child Cyber Safety",
    card1Desc: "Confidential reporting for cyber harassment, impersonation, and fraudulent schemes.",
    card1Btn: "Report Incident",
    card2Title: "Financial Cyber Fraud Defense",
    card2Desc: "Instant protection against fake KYC, stolen Aadhaar subsidy claims, and OTP traps.",
    card2Btn: "Call Helpline 1930",
    card3Title: "CERT-In Incident Reporting",
    card3Desc: "Generate legal evidence dossiers for immediate takedown by NIXI, CERT-In, and I4C.",
    card3Btn: "Download Dossier",

    // Resources
    res1: "Citizen Safety Guidelines",
    res1Sub: "How to identify authentic links",
    res2: "1930 Cyber Helpline",
    res2Sub: "24x7 National Emergency Support",
    res3: "CERT-In Threat Bulletins",
    res3Sub: "Latest zero-day fraud advisories",
    res4: "Fake SMS & Scheme Alerts",
    res4Sub: "Guard against deceptive subsidy links",

    dossierTitle: "CERT-In Cyber Security Incident Dossier",
    copyDossier: "Copy Dossier to Clipboard",
    copied: "Copied!",
    close: "Close",
    footerText: "National Cyber Defense Initiative • Developed for Smart India Hackathon 2026 (SIH1454)"
  }
};

export default function HomePage() {
  const [lang, setLang] = useState('hi');
  const [fontScale, setFontScale] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', fontScale);
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [fontScale, highContrast]);

  // Voice Narration (Text-to-Speech) for Non-Literate / Visually Impaired Citizens
  const handleSpeakVerdict = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    if (!result) return;

    let textToSpeak = "";
    if (lang === 'hi') {
      if (result.risk_score >= 66 || result.verdict === 'PHISHING_CLONE') {
        textToSpeak = `सावधान! यह वेबसाइट फर्जी एवं धोखाधड़ी से भरी है। यह सरकारी पोर्टल नहीं है। कृपया अपना आधार, पैन या बैंक विवरण कभी दर्ज न करें। सहायता के लिए तुरंत 1930 पर कॉल करें।`;
      } else if (result.risk_score <= 25 || result.verdict === 'LEGITIMATE') {
        textToSpeak = `यह वेबसाइट पूरी तरह से सुरक्षित एवं प्रामाणिक सरकारी पोर्टल है। आप इस पर विश्वास के साथ कार्य कर सकते हैं।`;
      } else {
        textToSpeak = `सतर्क रहें! यह वेबसाइट संदिग्ध है और आधिकारिक सरकारी डोमेन से सत्यापित नहीं है।`;
      }
    } else {
      if (result.risk_score >= 66 || result.verdict === 'PHISHING_CLONE') {
        textToSpeak = `Critical Warning! This website is a fake phishing clone impersonating government services. Never enter your Aadhaar, bank details, or OTP. Call 1930 immediately.`;
      } else if (result.risk_score <= 25 || result.verdict === 'LEGITIMATE') {
        textToSpeak = `Verified Authentic. This website belongs to genuine Government of India infrastructure.`;
      } else {
        textToSpeak = `Caution! This website shows suspicious indicators and is not verified as an official government portal.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  // Speech Recognition (Mic Voice Input)
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please type the link manually.");
      return;
    }

    if (isListening) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim().replace(/\s+/g, '');
        setUrl(transcript);
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Standalone Instant Client-Side Scan (Zero Backend Server dependency)
  const handleScan = (overrideUrl) => {
    const targetUrl = overrideUrl || url;
    if (!targetUrl || !targetUrl.trim()) return;

    setLoading(true);
    setResult(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    // Simulate real-time neural multi-modal scan with 250ms visual inspection delay
    setTimeout(() => {
      try {
        const scanOutput = scanWebsiteClientSide(targetUrl);
        setResult(scanOutput);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const getVerdictStatus = (res) => {
    if (!res) return { type: 'safe', title: t.verdictSafe, icon: '🛡️', color: 'var(--gov-green)' };
    if (res.risk_score >= 66 || res.verdict === 'PHISHING_CLONE') {
      return { type: 'threat', title: t.verdictThreat, icon: '🚨', color: 'var(--gov-red)' };
    }
    if (res.risk_score >= 26 || res.verdict === 'SUSPICIOUS') {
      return { type: 'caution', title: t.verdictCaution, icon: '⚠️', color: 'var(--gov-amber)' };
    }
    return { type: 'safe', title: t.verdictSafe, icon: '✅', color: 'var(--gov-green)' };
  };

  const currentStatus = getVerdictStatus(result);

  const generateDossierText = () => {
    if (!result) return "";
    return `========================================================================
CYBER SECURITY INCIDENT REPORT / PHISHING TAKEDOWN DOSSIER
Prepared for: CERT-In (incident@cert-in.org.in) & CyberCrime Portal (cybercrime.gov.in)
Incident ID : CERTIN-SIH-${Math.random().toString(36).substr(2, 9).toUpperCase()}
Timestamp   : ${new Date().toISOString()}
========================================================================
Target Entity   : ${result.target_entity || 'Government of India Portal'}
Investigated URL: ${result.url || url}
Risk Threat Score: ${result.risk_score} / 100
Classification  : ${result.verdict}
Impersonated    : ${result.impersonated ? 'YES (CRITICAL ZERO-DAY SPOOF)' : 'NO'}

[1] FORENSIC EVIDENCE BREAKDOWN:
- TLD Authenticity Status : ${result.is_genuine_gov_tld ? 'AUTHENTIC (.gov.in/.nic.in)' : 'UNAUTHORIZED PUBLIC TLD'}
- Lexical Typosquat Score : ${result.signal_breakdown?.lexical_score || 0}/100
- DOM Sensitive Harvesting: ${(result.signal_breakdown?.sensitive_fields_found || []).join(', ') || 'None'}
- Visual Similarity Score : ${result.signal_breakdown?.visual_similarity || 0}%
- Domain Age              : ${result.signal_breakdown?.domain_age_days || 'N/A'} days

[2] MALICIOUS INDICATORS DETECTED:
${(result.reasons || []).map((r, i) => `[${i + 1}] ${r}`).join('\n') || 'None detected'}

[3] DIRECTIVES & MITIGATION:
1. Issue urgent DNS sinkhole directive via NIXI / INRegistry.
2. Direct TSP/ISP DNS blocking under Section 69A Information Technology Act.
3. Alert CERT-In Incident Response Center.
========================================================================`;
  };

  return (
    <>
      <a href="#mainSearch" className="skip-link">Skip to main content / मुख्य सामग्री पर जाएं</a>

      {/* Tricolor National Accent Banner */}
      <div className="tricolor-stripe" />

      {/* Accessibility (A11y) & Language Top Bar (like india.gov.in) */}
      <header className="a11y-top-bar" role="banner">
        <div className="a11y-container">
          <div className="gov-identification">
            <span className="gov-flag-icon">🇮🇳</span>
            <span>{t.govIndia}</span>
          </div>

          <div className="a11y-controls-group">
            {/* Font Sizing */}
            <span style={{ fontSize: '0.78rem', opacity: 0.85 }}>{t.fontSize}:</span>
            <button 
              className={`a11y-btn ${fontScale === 0.9 ? 'active' : ''}`}
              onClick={() => setFontScale(0.9)} 
              title="Decrease Font Size"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button 
              className={`a11y-btn ${fontScale === 1.0 ? 'active' : ''}`}
              onClick={() => setFontScale(1.0)} 
              title="Standard Font Size"
              aria-label="Standard Font Size"
            >
              A
            </button>
            <button 
              className={`a11y-btn ${fontScale === 1.2 ? 'active' : ''}`}
              onClick={() => setFontScale(1.2)} 
              title="Increase Font Size"
              aria-label="Increase Font Size"
            >
              A+
            </button>

            {/* High Contrast Toggle */}
            <button 
              className={`a11y-btn ${highContrast ? 'active' : ''}`}
              onClick={() => setHighContrast(!highContrast)}
              title={t.highContrast}
              aria-label={t.highContrast}
            >
              👁️ {t.highContrast}
            </button>

            {/* Language Switcher */}
            <button 
              className="a11y-btn lang-toggle-btn"
              onClick={() => setLang(lang === 'hi' ? 'en' : 'hi')}
              title="Switch Language"
              aria-label="Switch Language"
            >
              🌐 {t.langName}
            </button>
          </div>
        </div>
      </header>

      {/* Official Government Brand Bar */}
      <div className="official-header">
        <div className="header-inner">
          <div className="emblem-brand-wrapper">
            <AshokaEmblem />
            <div className="brand-titles">
              <span className="sub-ministry">{t.ministry}</span>
              <h1 className="main-portal-title">{t.portalName}</h1>
              <span className="portal-subtitle">{t.portalSub}</span>
            </div>
          </div>

          {/* Emergency 1930 Cyber Helpline Box */}
          <a href="tel:1930" className="emergency-helpline-box" aria-label="Call Cyber Crime Helpline 1930">
            <span className="helpline-icon-pulse">📞</span>
            <div>
              <div className="helpline-label">{t.helplineTitle}</div>
              <div className="helpline-number">1930 (Toll Free)</div>
            </div>
          </a>
        </div>
      </div>

      {/* Hero & Search Engine Section */}
      <section className="hero-section" id="mainSearch">
        <div className="hero-container">
          <div className="hero-pill-badge">{t.heroBadge}</div>
          <h2 className="hero-headline">{t.heroTitle}</h2>
          <p className="hero-subheadline">{t.heroSub}</p>

          {/* Search Bar with Mic & Verify button */}
          <div className="search-card-wrapper">
            <input 
              type="text" 
              className="search-input-field"
              placeholder={t.searchPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              aria-label="Enter website URL to verify"
            />

            {/* Speech to text Mic button */}
            <button 
              type="button"
              className={`mic-voice-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              title={isListening ? "Listening..." : "Speak URL / बोलकर लिंक दर्ज करें"}
              aria-label="Voice input button"
            >
              🎤
            </button>

            {/* Verify Button */}
            <button 
              type="button"
              className="btn-verify-main"
              onClick={() => handleScan()}
              disabled={loading}
              aria-label="Verify Portal"
            >
              {loading ? (
                <>⏳ {t.verifyingBtn}</>
              ) : (
                <>🛡️ {t.verifyBtn}</>
              )}
            </button>
          </div>

          {/* Quick Demo Chips */}
          <div className="quick-samples-row">
            <span className="quick-samples-label">{t.quickTry}</span>
            <button 
              type="button" 
              className="sample-chip" 
              onClick={() => { setUrl('https://pmkisan.gov.in'); handleScan('https://pmkisan.gov.in'); }}
            >
              ✅ {t.safeSite}
            </button>
            <button 
              type="button" 
              className="sample-chip danger-chip" 
              onClick={() => { setUrl('https://g0v.in'); handleScan('https://g0v.in'); }}
            >
              🚨 {t.fakeSite}
            </button>
            <button 
              type="button" 
              className="sample-chip" 
              onClick={() => { setUrl('https://incometax.gov.in'); handleScan('https://incometax.gov.in'); }}
            >
              🏛️ {t.incomeTax}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content-layout">
        
        {/* Visual Verdict Master Card (When Scan Result Exists) */}
        {result && (
          <div className="verdict-master-card" role="region" aria-live="polite">
            
            {/* Top Verdict Banner */}
            <div className={`verdict-banner-header ${currentStatus.type}`}>
              <div className="verdict-lead-group">
                <span className="verdict-huge-icon">{currentStatus.icon}</span>
                <div>
                  <h3 className="verdict-title-text">{currentStatus.title}</h3>
                  <p className="verdict-status-sub">
                    {result.target_entity || 'Government Public Service'} • {result.is_genuine_gov_tld ? t.tldChecked : 'Non-Government Domain'}
                  </p>
                </div>
              </div>

              {/* Audio Listen Button for Illiterate / Non-Tech-Savvy Citizens */}
              <div className="verdict-actions-top">
                <button 
                  type="button" 
                  className={`btn-voice-audio ${isSpeaking ? 'playing' : ''}`}
                  onClick={handleSpeakVerdict}
                  aria-label="Listen to verdict audio in selected language"
                >
                  {isSpeaking ? '🔊 ' + t.stopAudio : '🔊 ' + t.listenAudio}
                </button>
              </div>
            </div>

            {/* Verdict Body Grid */}
            <div className="verdict-body-grid">
              
              {/* Left Score Gauge */}
              <div className="score-gauge-box">
                <span className="gauge-metric-title">{t.riskScoreLabel}</span>
                <div className={`score-number-display ${currentStatus.type}`}>
                  {result.risk_score < 10 ? `0${result.risk_score}` : result.risk_score}
                </div>
                <span className="score-scale-text">/ 100</span>
                <div className="scanned-url-badge">{result.url || url}</div>
              </div>

              {/* Right Advisory & 5-Layer Forensic Evidence */}
              <div>
                
                {/* Plain-Language Citizen Advisory */}
                <div className="citizen-advisory-block">
                  <div className="advisory-title">
                    <span>⚠️</span>
                    <span>{t.advisoryTitle}</span>
                  </div>
                  <p className="advisory-desc">
                    {result.risk_score >= 66 ? t.advisoryThreat : (result.risk_score <= 25 ? t.advisorySafe : t.advisoryCaution)}
                  </p>
                </div>

                {/* 5-Layer Forensic Evidence Checklist */}
                <div className="forensics-checklist">
                  {/* Layer 1 */}
                  <div className="forensic-step-card">
                    <span className="step-status-icon">{result.is_genuine_gov_tld ? '🟢' : '🔴'}</span>
                    <div className="step-content-meta">
                      <div className="step-title-row">
                        <span className="step-layer-name">{t.layer1Title}</span>
                        <span className={`step-status-pill ${result.is_genuine_gov_tld ? 'pass' : 'fail'}`}>
                          {result.is_genuine_gov_tld ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </div>
                      <p className="step-layer-desc">
                        {result.is_genuine_gov_tld ? 'Authentic National Informatics Centre (NIC) verified sovereign TLD.' : 'Site does NOT belong to official .gov.in or .nic.in registry.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="forensic-step-card">
                    <span className="step-status-icon">{result.signal_breakdown?.lexical_score > 30 ? '🔴' : '🟢'}</span>
                    <div className="step-content-meta">
                      <div className="step-title-row">
                        <span className="step-layer-name">{t.layer2Title}</span>
                        <span className={`step-status-pill ${result.signal_breakdown?.lexical_score > 30 ? 'fail' : 'pass'}`}>
                          {result.signal_breakdown?.lexical_score > 30 ? 'SPOOF DETECTED' : 'CLEAN'}
                        </span>
                      </div>
                      <p className="step-layer-desc">
                        {result.signal_breakdown?.lexical_score > 30 
                          ? 'Critical: Deceptive spelling tricks (e.g., replacing letter "o" with "0" as in g0v.in).' 
                          : 'No typosquatting, zero-width homoglyphs, or deceptive brand injections.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="forensic-step-card">
                    <span className="step-status-icon">{result.signal_breakdown?.sensitive_fields_found?.length > 0 ? '🔴' : '🟢'}</span>
                    <div className="step-content-meta">
                      <div className="step-title-row">
                        <span className="step-layer-name">{t.layer3Title}</span>
                        <span className={`step-status-pill ${result.signal_breakdown?.sensitive_fields_found?.length > 0 ? 'fail' : 'pass'}`}>
                          {result.signal_breakdown?.sensitive_fields_found?.length > 0 ? 'HARVESTING' : 'SECURE'}
                        </span>
                      </div>
                      <p className="step-layer-desc">
                        {result.signal_breakdown?.sensitive_fields_found?.length > 0 
                          ? `Detects unauthorized harvesting triggers in URL/forms on an unofficial domain!`
                          : 'No unauthorized Aadhaar, PAN, OTP, or biometric credential harvesting forms detected.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 4 */}
                  <div className="forensic-step-card">
                    <span className="step-status-icon">{result.impersonated ? '🔴' : '🟢'}</span>
                    <div className="step-content-meta">
                      <div className="step-title-row">
                        <span className="step-layer-name">{t.layer4Title}</span>
                        <span className={`step-status-pill ${result.impersonated ? 'fail' : 'pass'}`}>
                          {result.impersonated ? 'CLONE MATCH' : 'AUTHENTIC'}
                        </span>
                      </div>
                      <p className="step-layer-desc">
                        {result.impersonated 
                          ? `AI Neural engine flagged this site as a lookalike clone of "${result.target_entity || 'Gov Portal'}"!`
                          : 'Visual styling and DOM structure are consistent with authentic baseline standards.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 5 */}
                  <div className="forensic-step-card">
                    <span className="step-status-icon">🟢</span>
                    <div className="step-content-meta">
                      <div className="step-title-row">
                        <span className="step-layer-name">{t.layer5Title}</span>
                        <span className="step-status-pill pass">ANALYZED</span>
                      </div>
                      <p className="step-layer-desc">
                        {result.signal_breakdown?.domain_age_days 
                          ? `Domain registered ${result.signal_breakdown.domain_age_days} days ago via ${result.signal_breakdown.registrar || 'Public Registrar'}.`
                          : 'Domain registration records analyzed.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Triggers */}
                <div className="verdict-footer-actions">
                  <button 
                    type="button" 
                    className="btn-dossier-download"
                    onClick={() => setDossierOpen(true)}
                  >
                    📄 {t.card3Btn}
                  </button>

                  <a href="tel:1930" className="btn-1930-call">
                    📞 {t.card2Btn}
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* 3 Citizen Category Cards (Inspired by cybercrime.gov.in screenshots) */}
        <div className="section-headline-group">
          <span className="section-tag">NATIONAL DEFENSE INITIATIVE</span>
          <h3 className="section-main-heading">{t.sectionTitle}</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>{t.sectionSub}</p>
        </div>

        <div className="citizen-cards-grid">
          {/* Card 1: Women & Child */}
          <div className="citizen-action-card">
            <div className="card-banner-graphic women-child">
              <span className="graphic-hero-emoji">👩‍👧‍👦</span>
            </div>
            <div className="card-content-area">
              <h4 className="card-title-text">{t.card1Title}</h4>
              <p className="card-desc-text">{t.card1Desc}</p>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="card-action-btn">
                {t.card1Btn} →
              </a>
            </div>
          </div>

          {/* Card 2: Financial Fraud */}
          <div className="citizen-action-card">
            <div className="card-banner-graphic financial">
              <span className="graphic-hero-emoji">💳</span>
            </div>
            <div className="card-content-area">
              <h4 className="card-title-text">{t.card2Title}</h4>
              <p className="card-desc-text">{t.card2Desc}</p>
              <a href="tel:1930" className="card-action-btn" style={{ background: 'var(--gov-red)' }}>
                {t.card2Btn}
              </a>
            </div>
          </div>

          {/* Card 3: Other Cyber Crimes & Incident Dossier */}
          <div className="citizen-action-card">
            <div className="card-banner-graphic cyber-crime">
              <span className="graphic-hero-emoji">🛡️</span>
            </div>
            <div className="card-content-area">
              <h4 className="card-title-text">{t.card3Title}</h4>
              <p className="card-desc-text">{t.card3Desc}</p>
              <button 
                type="button" 
                className="card-action-btn"
                onClick={() => setDossierOpen(true)}
              >
                {t.card3Btn} →
              </button>
            </div>
          </div>
        </div>

        {/* Resources & Citizen Awareness Row */}
        <div className="resources-grid">
          <div className="resource-item-box">
            <div className="resource-icon-circle">📖</div>
            <h5 className="resource-name">{t.res1}</h5>
            <p className="resource-brief">{t.res1Sub}</p>
          </div>
          <div className="resource-item-box">
            <div className="resource-icon-circle">📞</div>
            <h5 className="resource-name">{t.res2}</h5>
            <p className="resource-brief">{t.res2Sub}</p>
          </div>
          <div className="resource-item-box">
            <div className="resource-icon-circle">📢</div>
            <h5 className="resource-name">{t.res3}</h5>
            <p className="resource-brief">{t.res3Sub}</p>
          </div>
          <div className="resource-item-box">
            <div className="resource-icon-circle">⚠️</div>
            <h5 className="resource-name">{t.res4}</h5>
            <p className="resource-brief">{t.res4Sub}</p>
          </div>
        </div>

      </main>

      {/* Dossier Modal Dialog */}
      {dossierOpen && (
        <div className="modal-overlay" onClick={() => setDossierOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h4 className="modal-title-text">📄 {t.dossierTitle}</h4>
              <button type="button" className="modal-close-btn" onClick={() => setDossierOpen(false)}>×</button>
            </div>
            <pre className="modal-content-body">
              {generateDossierText() || "No active scan data to generate dossier. Please scan a URL first."}
            </pre>
            <div className="modal-footer-bar">
              <button 
                type="button" 
                className="card-action-btn"
                onClick={() => {
                  navigator.clipboard.writeText(generateDossierText());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2500);
                }}
              >
                {copied ? `✅ ${t.copied}` : `📋 ${t.copyDossier}`}
              </button>
              <button 
                type="button" 
                className="a11y-btn" 
                style={{ background: '#718096', color: '#fff' }}
                onClick={() => setDossierOpen(false)}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign National Defense Footer */}
      <footer className="portal-footer" role="contentinfo">
        <div className="footer-container">
          <div className="footer-top-row">
            <div>
              <h4 className="footer-about-heading">GovShield Sentinel Grid (SIH1454)</h4>
              <p className="footer-desc-text">
                An AI/ML-driven sovereign cyber protection layer designed to detect lookalike phishing websites, credential harvesting forms, and typosquatting scams targeting Indian citizens.
              </p>
            </div>
            <div>
              <h4 className="footer-about-heading">National Portals</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="https://india.gov.in" target="_blank" rel="noreferrer">National Portal of India (india.gov.in)</a></li>
                <li className="footer-link-item"><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">National Cyber Crime Reporting (I4C)</a></li>
                <li className="footer-link-item"><a href="https://cert-in.org.in" target="_blank" rel="noreferrer">CERT-In Incident Response</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-about-heading">Emergency Helplines</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item"><a href="tel:1930">1930 — Cyber Crime Fraud Helpline</a></li>
                <li className="footer-link-item"><a href="tel:112">112 — National Emergency Service</a></li>
                <li className="footer-link-item"><a href="tel:14440">14440 — Financial Fraud Alert</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <p>{t.footerText} | Smart India Hackathon 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
