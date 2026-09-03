'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AndroidAppSimulator() {
  const [isActive, setIsActive] = useState(false);
  const [lang, setLang] = useState('hi');
  const [testDomain, setTestDomain] = useState('g0v.in');
  const [testLog, setTestLog] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const voicePrompts = {
    hi: {
      welcome: "नमस्ते! अपने फोन को फर्जी सरकारी वेबसाइटों और साइबर फ्रॉड से बचाने के लिए स्क्रीन पर दिख रहे बड़े शील्ड बटन को दबाएं।",
      active: "GovShield सुरक्षा चालू हो गई है। अब आपका फोन सुरक्षित है।",
      inactive: "सुरक्षा बंद कर दी गई है। सुरक्षित रहने के लिए इसे दोबारा चालू करें।",
      shieldOn: "सुरक्षित",
      shieldOff: "टैप करें",
      shieldSubOn: "GovShield DNS सक्रिय",
      shieldSubOff: "सुरक्षा चालू करें",
      descOn: "🛡️ सुरक्षा सक्रिय है! आपका फोन अब फर्जी सरकारी वेबसाइटों, फिशिंग और साइबर धोखाधड़ी से सुरक्षित है।",
      descOff: "📢 ऑडियो सहायता: बड़े शील्ड बटन को दबाकर सुरक्षा चालू करें।"
    },
    en: {
      welcome: "Welcome to GovShield. Tap the big shield button in the center to protect your phone from fake government websites and online fraud.",
      active: "GovShield protection is now active. Your phone is secured.",
      inactive: "Protection is turned off. Tap again to stay protected.",
      shieldOn: "PROTECTED",
      shieldOff: "TAP TO ACTIVATE",
      shieldSubOn: "GovShield DNS Active",
      shieldSubOff: "Tap to Secure Phone",
      descOn: "🛡️ Real-time protection active! Your phone is secured against fake government portals & phishing.",
      descOff: "📢 Audio Guide: Tap the big shield button to activate instant protection."
    },
    bn: {
      welcome: "নমস্কার! ভুয়ো সরকারি ওয়েবসাইট থেকে সুরক্ষা পেতে মাঝের বড় শিল্ড বোতামটি টিপুন।",
      active: "সুরক্ষা চালু হয়েছে। আপনার ফোন এখন নিরাপদ।",
      inactive: "সুরক্ষা বন্ধ করা হয়েছে।",
      shieldOn: "নিরাপদ",
      shieldOff: "টিপুন",
      shieldSubOn: "ডিএনএস সুরক্ষা সক্রিয়",
      shieldSubOff: "সুরক্ষা চালু করুন",
      descOn: "🛡️ সুরক্ষা সক্রিয়! আপনার ফোন এখন ভুয়ো ওয়েবসাইট থেকে নিরাপদ।",
      descOff: "📢 অডিও সহায়তা: বড় শিল্ড বোতামটি টিপুন।"
    },
    ta: {
      welcome: "வணக்கம்! போலி அரசு வலைத்தளங்களிலிருந்து பாதுகாக்க நடுவில் உள்ள பெரிய ஷீல்ட் பொத்தானை அழுத்தவும்.",
      active: "பாதுகாப்பு இயக்கப்பட்டது. உங்கள் தொலைபேசி இப்போது பாதுகாப்பாக உள்ளது.",
      inactive: "பாதுகாப்பு நிறுத்தப்பட்டது.",
      shieldOn: "பாதுகாப்பானது",
      shieldOff: "அழுத்தவும்",
      shieldSubOn: "DNS பாதுகாப்பு செயலில் உள்ளது",
      shieldSubOff: "பாதுகாப்பை இயக்கவும்",
      descOn: "🛡️ பாதுகாப்பு செயலில் உள்ளது! போலி வலைத்தளங்களிலிருந்து உங்கள் தொலைபேசி பாதுகாப்பானது.",
      descOff: "📢 குரல் உதவி: பெரிய ஷீல்ட் பொத்தானை அழுத்தவும்."
    },
    te: {
      welcome: "నమస్కారం! నకిలీ ప్రభుత్వ వెబ్‌సైట్ల నుండి రక్షణ కోసం మధ్యలో ఉన్న పెద్ద షీల్డ్ బటన్‌ను నొక్కండి.",
      active: "రక్షణ ప్రారంభమైంది. మీ ఫోన్ ఇప్పుడు సురక్షితం.",
      inactive: "రక్షణ నిలిపివేయబడింది.",
      shieldOn: "సురక్షితం",
      shieldOff: "నొక్కండి",
      shieldSubOn: "DNS రక్షణ చురుకుగా ఉంది",
      shieldSubOff: "రక్షణ ప్రారంభించండి",
      descOn: "🛡️ రక్షణ చురుకుగా ఉంది! మీ ఫోన్ ఇప్పుడు సురక్షితం.",
      descOff: "📢 ఆడియో సహాయం: పెద్ద షీల్డ్ బటన్‌ను నొక్కండి."
    },
    mr: {
      welcome: "नमस्कार! बनावट सरकारी संकेतस्थळांपासून संरक्षणासाठी स्क्रीनवरील मोठ्या शील्ड बटनावर टॅप करा.",
      active: "संरक्षण सुरू झाले आहे. आपला फोन आता सुरक्षित आहे.",
      inactive: "संरक्षण बंद केले आहे.",
      shieldOn: "सुरक्षित",
      shieldOff: "टॅप करा",
      shieldSubOn: "GovShield DNS सक्रिय",
      shieldSubOff: "संरक्षण सुरू करा",
      descOn: "🛡️ संरक्षण सक्रिय आहे! आपला फोन बनावट संकेतस्थळांपासून सुरक्षित आहे.",
      descOff: "📢 ऑडिओ मदत: मोठ्या शील्ड बटनावर टॅप करा."
    }
  };

  const t = voicePrompts[lang] || voicePrompts.hi;

  // Speak Voice Prompts using SpeechSynthesis
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select Indic Voice if available
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(lang)) || voices.find(v => v.lang.includes('hi') || v.lang.includes('IN'));
    if (match) utterance.voice = match;
    
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleShield = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    if (nextState) {
      speakText(t.active);
      addTestLog(`🟢 GovShield DNS Interceptor Activated. System VPN TUN Connected.`, 'success');
    } else {
      speakText(t.inactive);
      addTestLog(`⚪ GovShield DNS Deactivated.`, 'info');
    }
  };

  const addTestLog = (msg, type = 'info') => {
    setTestLog(prev => [{ msg, type, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 9)]);
  };

  const simulateDnsQuery = (domain) => {
    if (!isActive) {
      addTestLog(`⚠️ DNS query to '${domain}' bypassed (GovShield Inactive).`, 'warn');
      return;
    }

    const isFake = domain.includes('g0v') || domain.includes('fake') || domain.includes('.xyz') || domain.includes('yojana');
    if (isFake) {
      addTestLog(`🚨 SINKHOLE INTERCEPT: '${domain}' blocked -> Resolved to 0.0.0.0 (Threat Score: 99/100)`, 'danger');
      speakText("सावधान! यह फर्जी वेबसाइट है। GovShield ने इसे ब्लॉक कर दिया है।");
    } else {
      addTestLog(`✅ SOVEREIGN PASS: '${domain}' authenticated (.gov.in) -> Resolved to 1.1.1.1`, 'success');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1329', color: '#f8fafc', padding: '32px 16px', fontFamily: 'sans-serif' }}>
      
      {/* Top Navbar */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img src="/logo.png" alt="GovShield Logo" style={{ width: '44px', height: '54px', objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>GovShield Sentinel for Android</h1>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Zero-Literacy 1-Tap Sovereign DNS Protection</p>
          </div>
        </div>
        <Link href="/" style={{ background: '#5c3cf6', color: '#fff', textDecoration: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem' }}>
          ← Back to Web Portal
        </Link>
      </div>

      {/* Main Grid: Simulator + Live DNS Inspector */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '420px 1fr', gap: '36px', alignItems: 'start' }}>
        
        {/* Android Phone Device Mockup */}
        <div style={{ background: '#000', padding: '14px', borderRadius: '44px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)', border: '4px solid #334155' }}>
          
          {/* Inner Phone Screen */}
          <div style={{ background: '#f8fafc', borderRadius: '34px', overflow: 'hidden', minHeight: '680px', display: 'flex', flexDirection: 'column', color: '#0f172a', position: 'relative' }}>
            
            {/* Phone Status Bar */}
            <div style={{ padding: '10px 20px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, color: '#334155' }}>
              <span>9:41</span>
              <div style={{ width: '100px', height: '18px', background: '#000', borderRadius: '20px' }}></div>
              <span>📶 5G 🔋 98%</span>
            </div>

            {/* App Tricolor Stripe */}
            <div style={{ height: '4px', background: 'linear-gradient(90deg, #ff9933 33.3%, #ffffff 33.3% 66.6%, #138808 66.6%)' }}></div>

            {/* App Header */}
            <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src="/logo.png" alt="Emblem" style={{ width: '42px', height: '52px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                    GovShield <span style={{ background: '#eff2ff', color: '#5c3cf6', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>Grid 3.0</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>National Cyber Defense</div>
                </div>
              </div>
              <button 
                onClick={() => speakText(t.welcome)}
                style={{ background: isSpeaking ? '#fee2e2' : '#f1f5f9', border: 'none', width: '42px', height: '42px', borderRadius: '50%', cursor: 'pointer', fontSize: '1.2rem' }}
                title="Listen Audio Guidance"
              >
                🔊
              </button>
            </div>

            {/* Language Switcher Bar */}
            <div style={{ padding: '0 18px 14px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
              {[
                { code: 'hi', label: 'हिन्दी' },
                { code: 'en', label: 'English' },
                { code: 'bn', label: 'বাংলা' },
                { code: 'ta', label: 'தமிழ்' },
                { code: 'te', label: 'తెలుగు' },
                { code: 'mr', label: 'मराठी' }
              ].map(item => (
                <button
                  key={item.code}
                  onClick={() => { setLang(item.code); speakText(voicePrompts[item.code].welcome); }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '20px',
                    border: 'none',
                    background: lang === item.code ? '#5c3cf6' : '#e2e8f0',
                    color: lang === item.code ? '#fff' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Central Giant 1-Tap Shield Button */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '20px' }}>
              
              {/* Outer Pulse Ring */}
              <div style={{
                position: 'absolute',
                width: '240px',
                height: '240px',
                borderRadius: '50%',
                background: isActive ? 'rgba(0, 135, 90, 0.15)' : 'rgba(92, 60, 246, 0.15)',
                transform: 'scale(1.15)',
                transition: 'all 0.5s ease'
              }}></div>

              {/* Action Button */}
              <button
                onClick={toggleShield}
                style={{
                  width: '200px',
                  height: '200px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #00875a 0%, #005a3c 100%)' : 'linear-gradient(135deg, #5c3cf6 0%, #3b1fb8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isActive ? '0 15px 35px rgba(0, 135, 90, 0.4)' : '0 15px 35px rgba(92, 60, 246, 0.4)',
                  cursor: 'pointer',
                  zIndex: 2,
                  transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
              >
                <span style={{ fontSize: '3.8rem', lineHeight: 1 }}>{isActive ? '✅' : '🛡️'}</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '6px' }}>{isActive ? t.shieldOn : t.shieldOff}</span>
                <span style={{ fontSize: '0.75rem', color: '#e0e7ff', fontWeight: 600 }}>{isActive ? t.shieldSubOn : t.shieldSubOff}</span>
              </button>
            </div>

            {/* Spoken Status Box */}
            <div style={{ padding: '0 18px 14px' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px 16px', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, fontWeight: 600 }}>
                  {isActive ? t.descOn : t.descOff}
                </p>
              </div>
            </div>

            {/* Bottom 1930 Helpline Button */}
            <div style={{ padding: '0 18px 24px' }}>
              <a 
                href="tel:1930" 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: '#be123c',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '14px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem'
                }}
              >
                📞 1930 National Helpline
              </a>
            </div>

          </div>
        </div>

        {/* Live DNS Inspector & Threat Simulator Panel */}
        <div style={{ background: '#131a29', border: '1px solid #2d3748', borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px 0', color: '#fff' }}>
              📡 Live DNS Threat Interception Engine
            </h2>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: 0 }}>
              Simulate DNS queries originating from the Android device to verify automatic sinkholing of fake portals.
            </p>
          </div>

          {/* Test Domain Input */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              value={testDomain} 
              onChange={(e) => setTestDomain(e.target.value)} 
              placeholder="e.g. g0v.in, pmkisan.gov.in..." 
              style={{ flex: 1, padding: '12px 16px', background: '#090d16', border: '1px solid #334155', borderRadius: '8px', color: '#fff', fontSize: '0.95rem' }}
            />
            <button 
              onClick={() => simulateDnsQuery(testDomain)}
              style={{ background: '#5c3cf6', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
            >
              Test DNS Query
            </button>
          </div>

          {/* Quick Pre-set Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button onClick={() => { setTestDomain('g0v.in'); simulateDnsQuery('g0v.in'); }} style={{ background: '#3f1519', color: '#fecdd3', border: '1px solid #881337', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
              🚨 Test Fake Typosquat (g0v.in)
            </button>
            <button onClick={() => { setTestDomain('pmkisan.gov.in'); simulateDnsQuery('pmkisan.gov.in'); }} style={{ background: '#064e3b', color: '#a7f3d0', border: '1px solid #047857', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
              ✅ Test Safe Domain (pmkisan.gov.in)
            </button>
            <button onClick={() => { setTestDomain('incometax-refund.xyz'); simulateDnsQuery('incometax-refund.xyz'); }} style={{ background: '#3f1519', color: '#fecdd3', border: '1px solid #881337', padding: '6px 12px', borderRadius: '6px', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>
              🚨 Test Fake Tax Refund (incometax-refund.xyz)
            </button>
          </div>

          {/* Live Query Log Terminal */}
          <div style={{ background: '#090d16', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px', minHeight: '260px', fontFamily: 'monospace', fontSize: '0.82rem', overflowY: 'auto' }}>
            <div style={{ color: '#64748b', marginBottom: '10px', fontWeight: 700 }}>// DNS INTERCEPTOR TELEMETRY LOG:</div>
            {testLog.length === 0 ? (
              <div style={{ color: '#475569' }}>Tap the Shield button or run a test query above to see live DNS sinkhole logs...</div>
            ) : (
              testLog.map((item, idx) => (
                <div key={idx} style={{ marginBottom: '8px', color: item.type === 'danger' ? '#f87171' : (item.type === 'success' ? '#4ade80' : (item.type === 'warn' ? '#fbbf24' : '#94a3b8')) }}>
                  <span style={{ color: '#475569' }}>[{item.time}]</span> {item.msg}
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
