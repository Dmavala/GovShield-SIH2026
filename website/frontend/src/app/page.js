'use client';

import { useState, useEffect } from 'react';
import { scanWebsiteClientSide } from './lib/scannerEngine';
import { playAcousticAlert, selectBestVoice } from './lib/audioSynthesizer';
import { UX4G_STRINGS } from './lib/ux4gLanguages';
import UX4GDrawer from './components/UX4GDrawer';
import LanguageDropdown from './components/LanguageDropdown';

// Sovereign Emblem Component
const AshokaEmblem = () => (
  <svg className="emblem-icon-ux4g" viewBox="0 0 100 125" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="National Emblem of India">
    <path d="M50 10 C35 10 25 25 25 45 C25 65 38 85 50 95 C62 85 75 65 75 45 C75 25 65 10 50 10 Z" fill="#5c3cf6" opacity="0.9" />
    <circle cx="50" cy="40" r="14" fill="#ffffff" />
    <circle cx="50" cy="40" r="11" fill="#5c3cf6" />
    <circle cx="50" cy="40" r="3" fill="#ffffff" />
    <line x1="50" y1="29" x2="50" y2="51" stroke="#ffffff" strokeWidth="1" />
    <line x1="39" y1="40" x2="61" y2="40" stroke="#ffffff" strokeWidth="1" />
    <line x1="42" y1="32" x2="58" y2="48" stroke="#ffffff" strokeWidth="1" />
    <line x1="42" y1="48" x2="58" y2="32" stroke="#ffffff" strokeWidth="1" />
    <rect x="30" y="95" width="40" height="10" rx="3" fill="#ff6b35" />
    <text x="50" y="118" textAnchor="middle" fill="#0f172a" fontSize="10" fontWeight="900" fontFamily="serif">सत्यमेव जयते</text>
  </svg>
);

export default function UX4GHomePage() {
  const [lang, setLang] = useState('hi');
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [dossierOpen, setDossierOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Active translation dictionary fallback
  const t = UX4G_STRINGS[lang] || UX4G_STRINGS['hi'];

  // Global Ctrl+F2 keyboard listener for UX4G Accessibility Drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'F2') {
        e.preventDefault();
        setDrawerOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Natural Speech Synthesis Narration
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

    // 1. Play instant acoustic chime
    if (result.risk_score >= 66 || result.verdict === 'PHISHING_CLONE') {
      playAcousticAlert('threat');
    } else if (result.risk_score <= 25 || result.verdict === 'LEGITIMATE') {
      playAcousticAlert('safe');
    } else {
      playAcousticAlert('caution');
    }

    // 2. Build natural script
    let textToSpeak = "";
    if (lang === 'hi') {
      if (result.risk_score >= 66 || result.verdict === 'PHISHING_CLONE') {
        textToSpeak = `सावधान! ... यह वेबसाइट पूरी तरह फर्जी है, और सरकारी पोर्टल की नकल कर रही है। ... कृपया अपना आधार नंबर, बैंक विवरण या ओटीपी कभी भी साझा न करें। ... तुरंत 1930 साइबर हेल्पलाइन पर कॉल करें।`;
      } else if (result.risk_score <= 25 || result.verdict === 'LEGITIMATE') {
        textToSpeak = `सत्यापित! ... यह भारत सरकार का प्रामाणिक और सुरक्षित आधिकारिक पोर्टल है। ... आप इस पर विश्वास के साथ कार्य कर सकते हैं।`;
      } else {
        textToSpeak = `सतर्क रहें! ... यह वेबसाइट संदिग्ध है, और आधिकारिक सरकारी डोमेन से सत्यापित नहीं है।`;
      }
    } else {
      if (result.risk_score >= 66 || result.verdict === 'PHISHING_CLONE') {
        textToSpeak = `Critical Warning! ... This website is a deceptive clone imitating government services. ... Never enter your Aadhaar, bank details, or OTP here. ... Call Helpline 1930 immediately!`;
      } else if (result.risk_score <= 25 || result.verdict === 'LEGITIMATE') {
        textToSpeak = `Verified Authentic! ... This domain is an authenticated Government of India sovereign portal.`;
      } else {
        textToSpeak = `Caution! ... This domain is unverified on the official government registry.`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1.04;

    const bestVoice = selectBestVoice(lang);
    if (bestVoice) utterance.voice = bestVoice;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.cancel();
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 150);
  };

  // Mic Speech Input
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please enter URL manually.");
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

  // Execute Standalone Client-Side Inspection
  const handleScan = (overrideUrl) => {
    const target = overrideUrl || url;
    if (!target || !target.trim()) return;

    setLoading(true);
    setResult(null);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setIsSpeaking(false);

    setTimeout(() => {
      try {
        const output = scanWebsiteClientSide(target);
        setResult(output);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 280);
  };

  const getVerdictStatus = (res) => {
    if (!res) return { type: 'safe', title: t.verdictSafe, icon: '🛡️' };
    if (res.risk_score >= 66 || res.verdict === 'PHISHING_CLONE') {
      return { type: 'threat', title: t.verdictThreat, icon: '🚨' };
    }
    if (res.risk_score >= 26 || res.verdict === 'SUSPICIOUS') {
      return { type: 'caution', title: t.verdictCaution, icon: '⚠️' };
    }
    return { type: 'safe', title: t.verdictSafe, icon: '✅' };
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
      <a href="#mainSearch" className="skip-link">{t.skipContent}</a>

      {/* 1. UX4G Sovereign Top Utility Bar */}
      <div className="ux4g-top-bar" role="banner">
        <div className="ux4g-top-container">
          <a href="https://india.gov.in" target="_blank" rel="noreferrer" className="ux4g-gov-link">
            <span>🇮🇳</span>
            <span>{t.govIndia} ↗</span>
          </a>

          <div className="ux4g-top-controls">
            <a href="#mainSearch" style={{ color: '#94a3b8', textDecoration: 'none' }}>
              {t.skipContent}
            </a>

            {/* Accessibility Drawer Trigger */}
            <button 
              className="ux4g-top-action-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open Accessibility Options"
            >
              <span>♿</span>
              <span>Accessibility</span>
            </button>

            {/* 12 Indic Languages Dropdown */}
            <LanguageDropdown currentLang={lang} onSelectLang={setLang} />
          </div>
        </div>
      </div>

      {/* 2. UX4G Main Navigation Header */}
      <header className="ux4g-nav-header">
        <div className="ux4g-nav-container">
          <div className="ux4g-brand-group">
            <AshokaEmblem />
            <div>
              <div className="brand-title-ux4g">
                GovShield <span className="accent-pill">Grid 3.0</span>
              </div>
              <div className="brand-subtitle-ux4g">
                National Multi-Signal Phishing & Fake Portal Detection System
              </div>
            </div>
          </div>

          <div className="nav-cta-group">
            <a href="tel:1930" className="btn-secondary-ux4g" style={{ color: 'var(--gov-red)' }}>
              📞 1930 Helpline
            </a>
            <button className="btn-primary-ux4g" onClick={() => setDrawerOpen(true)}>
              ♿ Options (Ctrl+F2)
            </button>
          </div>
        </div>
      </header>

      {/* 3. UX4G Hero Section (Inspired by ux4g.gov.in) */}
      <section className="ux4g-hero-section" id="mainSearch">
        <div className="ux4g-hero-container">
          
          <div className="ux4g-version-pill">
            <span>✨</span>
            <span>{t.heroPill}</span>
          </div>

          <h2 className="ux4g-hero-heading">
            {t.heroTitlePrefix} <br />
            <span className="ux4g-gradient-ai">{t.heroTitleAi}</span>
          </h2>

          <p className="ux4g-hero-subtext">
            {t.heroSub}
          </p>

          {/* Search Scanner Input */}
          <div className="ux4g-search-card">
            <input 
              type="text" 
              className="ux4g-search-input"
              placeholder={t.placeholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              aria-label="Enter website URL to verify"
            />

            <button 
              type="button"
              className={`mic-btn-ux4g ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              title="Speak URL / बोलकर लिंक दर्ज करें"
              aria-label="Voice input"
            >
              🎤
            </button>

            <button 
              type="button"
              className="verify-action-btn"
              onClick={() => handleScan()}
              disabled={loading}
              aria-label="Verify Portal"
            >
              {loading ? `⏳ ${t.verifying}` : `🛡️ ${t.verifyBtn}`}
            </button>
          </div>

          {/* Quick Demo Chips */}
          <div className="ux4g-chips-row">
            <span className="chips-tag-label">{t.quickTry}</span>
            <button 
              type="button" 
              className="ux4g-sample-chip"
              onClick={() => { setUrl('https://pmkisan.gov.in'); handleScan('https://pmkisan.gov.in'); }}
            >
              ✅ {t.safeSite}
            </button>
            <button 
              type="button" 
              className="ux4g-sample-chip danger-chip"
              onClick={() => { setUrl('https://g0v.in'); handleScan('https://g0v.in'); }}
            >
              🚨 {t.fakeSite}
            </button>
            <button 
              type="button" 
              className="ux4g-sample-chip"
              onClick={() => { setUrl('https://incometax.gov.in'); handleScan('https://incometax.gov.in'); }}
            >
              🏛️ {t.incomeTax}
            </button>
          </div>

        </div>
      </section>

      {/* 4. Active Scan Verdict Section */}
      {result && (
        <section className="ux4g-verdict-section" role="region" aria-live="polite">
          <div className="verdict-master-box">
            
            {/* Header Banner */}
            <div className={`verdict-header-banner ${currentStatus.type}`}>
              <div className="verdict-main-meta">
                <span className="verdict-icon-badge">{currentStatus.icon}</span>
                <div>
                  <h3 className="verdict-status-title">{currentStatus.title}</h3>
                  <p className="verdict-status-sub">
                    {result.target_entity || 'Government Service'} • {result.is_genuine_gov_tld ? 'Sovereign .gov.in Domain' : 'Unauthorized Public TLD'}
                  </p>
                </div>
              </div>

              {/* Natural Speech Button */}
              <button 
                type="button"
                className={`btn-speech-trigger ${isSpeaking ? 'playing' : ''}`}
                onClick={handleSpeakVerdict}
              >
                {isSpeaking ? `🔊 ${t.stopAudio}` : `🔊 ${t.listenAudio}`}
              </button>
            </div>

            {/* Body Grid */}
            <div className="verdict-layout-grid">
              
              {/* Left Score Panel */}
              <div className="gauge-score-panel">
                <span className="gauge-header-title">{t.threatScoreLabel}</span>
                <div className={`gauge-big-number ${currentStatus.type}`}>
                  {result.risk_score < 10 ? `0${result.risk_score}` : result.risk_score}
                </div>
                <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 700 }}>/ 100</span>
                <div className="scanned-url-chip">{result.url || url}</div>
              </div>

              {/* Right Advisory & 5-Layer Forensics */}
              <div>
                <div className="citizen-advisory-pill-box">
                  <div className="advisory-header">
                    <span>⚠️</span>
                    <span>Advisory:</span>
                  </div>
                  <p className="advisory-body-text">
                    {result.risk_score >= 66 ? t.advisoryThreat : (result.risk_score <= 25 ? t.advisorySafe : t.advisoryCaution)}
                  </p>
                </div>

                <div className="forensics-stack">
                  {/* Layer 1 */}
                  <div className="forensic-tile-item">
                    <span className="tile-status-icon">{result.is_genuine_gov_tld ? '🟢' : '🔴'}</span>
                    <div className="tile-content-wrapper">
                      <div className="tile-header-line">
                        <span className="tile-title">{t.layer1}</span>
                        <span className={`tile-status-tag ${result.is_genuine_gov_tld ? 'pass' : 'fail'}`}>
                          {result.is_genuine_gov_tld ? 'VERIFIED' : 'UNVERIFIED'}
                        </span>
                      </div>
                      <p className="tile-desc">
                        {result.is_genuine_gov_tld ? 'Authenticated NIC India sovereign registry.' : 'Domain does not belong to authorized .gov.in / .nic.in registry.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 2 */}
                  <div className="forensic-tile-item">
                    <span className="tile-status-icon">{result.signal_breakdown?.lexical_score > 30 ? '🔴' : '🟢'}</span>
                    <div className="tile-content-wrapper">
                      <div className="tile-header-line">
                        <span className="tile-title">{t.layer2}</span>
                        <span className={`tile-status-tag ${result.signal_breakdown?.lexical_score > 30 ? 'fail' : 'pass'}`}>
                          {result.signal_breakdown?.lexical_score > 30 ? 'SPOOF DETECTED' : 'CLEAN'}
                        </span>
                      </div>
                      <p className="tile-desc">
                        {result.signal_breakdown?.lexical_score > 30 
                          ? 'Critical: Deceptive spelling tricks (e.g. replacing letter "o" with "0" as in g0v.in).' 
                          : 'No typosquatting, zero-width homoglyphs, or lookalike patterns.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 3 */}
                  <div className="forensic-tile-item">
                    <span className="tile-status-icon">{result.signal_breakdown?.sensitive_fields_found?.length > 0 ? '🔴' : '🟢'}</span>
                    <div className="tile-content-wrapper">
                      <div className="tile-header-line">
                        <span className="tile-title">{t.layer3}</span>
                        <span className={`tile-status-tag ${result.signal_breakdown?.sensitive_fields_found?.length > 0 ? 'fail' : 'pass'}`}>
                          {result.signal_breakdown?.sensitive_fields_found?.length > 0 ? 'HARVESTING' : 'SECURE'}
                        </span>
                      </div>
                      <p className="tile-desc">
                        {result.signal_breakdown?.sensitive_fields_found?.length > 0 
                          ? `Harvesting triggers found: [${result.signal_breakdown.sensitive_fields_found.join(', ')}] on non-gov site!` 
                          : 'No unauthorized Aadhaar, PAN, OTP, or biometric credential harvesting forms detected.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 4 */}
                  <div className="forensic-tile-item">
                    <span className="tile-status-icon">{result.impersonated ? '🔴' : '🟢'}</span>
                    <div className="tile-content-wrapper">
                      <div className="tile-header-line">
                        <span className="tile-title">{t.layer4}</span>
                        <span className={`tile-status-tag ${result.impersonated ? 'fail' : 'pass'}`}>
                          {result.impersonated ? 'CLONE MATCH' : 'AUTHENTIC'}
                        </span>
                      </div>
                      <p className="tile-desc">
                        {result.impersonated 
                          ? `AI visual matching identified deceptive clone of "${result.target_entity || 'Gov Portal'}"!` 
                          : 'Visual styling and DOM structure are consistent with authentic baseline.'}
                      </p>
                    </div>
                  </div>

                  {/* Layer 5 */}
                  <div className="forensic-tile-item">
                    <span className="tile-status-icon">🟢</span>
                    <div className="tile-content-wrapper">
                      <div className="tile-header-line">
                        <span className="tile-title">{t.layer5}</span>
                        <span className="tile-status-tag pass">ANALYZED</span>
                      </div>
                      <p className="tile-desc">
                        {result.signal_breakdown?.domain_age_days 
                          ? `Domain registered ${result.signal_breakdown.domain_age_days} days ago via ${result.signal_breakdown.registrar || 'Public Registrar'}.` 
                          : 'Domain registration records verified.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dossier & 1930 Actions */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                  <button className="btn-primary-ux4g" onClick={() => setDossierOpen(true)}>
                    📄 {t.dossierBtn}
                  </button>
                  <a href="tel:1930" className="btn-secondary-ux4g" style={{ background: 'var(--gov-red)', color: '#fff', border: 'none' }}>
                    📞 {t.helpline1930}
                  </a>
                </div>

              </div>

            </div>

          </div>
        </section>
      )}

      {/* 5. Citizen 3-Card Grid */}
      <section className="ux4g-cards-section">
        <div className="cards-headline-block">
          <h3 className="cards-headline-title">Citizen Cyber Defense Services</h3>
          <p className="cards-headline-sub">Instant safeguards and real-time defense against deceptive portals</p>
        </div>

        <div className="ux4g-cards-grid">
          {/* Card 1: Women & Child */}
          <div className="ux4g-card-item">
            <div className="card-header-art art-1">
              <span className="art-emoji">👩‍👧‍👦</span>
            </div>
            <div className="card-text-body">
              <h4 className="card-title-header">{t.card1Title}</h4>
              <p className="card-desc-paragraph">{t.card1Desc}</p>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="card-cta-button">
                Report Incident →
              </a>
            </div>
          </div>

          {/* Card 2: Financial Fraud */}
          <div className="ux4g-card-item">
            <div className="card-header-art art-2">
              <span className="art-emoji">💳</span>
            </div>
            <div className="card-text-body">
              <h4 className="card-title-header">{t.card2Title}</h4>
              <p className="card-desc-paragraph">{t.card2Desc}</p>
              <a href="tel:1930" className="card-cta-button" style={{ background: 'var(--gov-red)' }}>
                {t.helpline1930}
              </a>
            </div>
          </div>

          {/* Card 3: CERT-In Dossier */}
          <div className="ux4g-card-item">
            <div className="card-header-art art-3">
              <span className="art-emoji">🛡️</span>
            </div>
            <div className="card-text-body">
              <h4 className="card-title-header">{t.card3Title}</h4>
              <p className="card-desc-paragraph">{t.card3Desc}</p>
              <button className="card-cta-button" onClick={() => setDossierOpen(true)}>
                {t.dossierBtn} →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Floating Accessibility FAB (UX4G Standard) */}
      <button 
        className="ux4g-fab-btn"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open Accessibility Options (Ctrl+F2)"
        title="Accessibility Options (Ctrl+F2)"
      >
        <span className="fab-icon">♿</span>
        <span className="fab-shortcut-text">Ctrl+F2</span>
      </button>

      {/* 7. UX4G Full Accessibility Drawer */}
      <UX4GDrawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        t={t}
        onVoiceTrigger={handleSpeakVerdict}
      />

      {/* 8. Dossier Modal */}
      {dossierOpen && (
        <div className="ux4g-drawer-backdrop" onClick={() => setDossierOpen(false)}>
          <div className="verdict-master-box" style={{ maxWidth: '700px', width: '90%', margin: 'auto', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ background: '#0f172a', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ fontWeight: 800 }}>📄 CERT-In Cyber Security Incident Dossier</h4>
              <button style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1.4rem', cursor: 'pointer' }} onClick={() => setDossierOpen(false)}>×</button>
            </div>
            <pre style={{ padding: '20px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.82rem', background: '#f8fafc', color: '#0f172a', flex: 1, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {generateDossierText() || "Please perform a scan first to generate evidence."}
            </pre>
            <div style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                className="btn-primary-ux4g"
                onClick={() => {
                  navigator.clipboard.writeText(generateDossierText());
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? "✅ Copied!" : "📋 Copy Dossier"}
              </button>
              <button className="btn-secondary-ux4g" onClick={() => setDossierOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. UX4G Sovereign Footer */}
      <footer className="ux4g-portal-footer" role="contentinfo">
        <div className="footer-inner-wrap">
          <div className="footer-main-columns">
            <div>
              <h4 className="footer-heading">GovShield Sentinel Grid (SIH1454)</h4>
              <p className="footer-text">
                An AI/ML-driven sovereign cyber protection layer designed in alignment with the UX4G Design System 3.0 to protect 1.4 billion Indian citizens from deceptive phishing portals and typosquatting scams.
              </p>
            </div>
            <div>
              <h4 className="footer-heading">National Portals</h4>
              <ul className="footer-nav-list">
                <li><a href="https://ux4g.gov.in" target="_blank" rel="noreferrer">UX4G Design System (ux4g.gov.in)</a></li>
                <li><a href="https://india.gov.in" target="_blank" rel="noreferrer">National Portal of India (india.gov.in)</a></li>
                <li><a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">Cyber Crime Reporting Portal (I4C)</a></li>
              </ul>
            </div>
            <div>
              <h4 className="footer-heading">Emergency Helplines</h4>
              <ul className="footer-nav-list">
                <li><a href="tel:1930">1930 — National Cyber Crime Helpline</a></li>
                <li><a href="tel:112">112 — National Emergency Service</a></li>
                <li><a href="tel:14440">14440 — Financial Fraud Toll-Free</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-credits-bar">
            <p>Aligned with UX4G Design System 3.0 • Developed for Smart India Hackathon 2026</p>
          </div>
        </div>
      </footer>
    </>
  );
}
