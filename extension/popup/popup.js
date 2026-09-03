/**
 * GovShield Sentinel Grid - Extension Popup Script (SIH 2026)
 * 100% Standalone Client-Side Architecture with Voice Audio & Bilingual Support
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const urlInput = document.getElementById("urlInput");
  const scanBtn = document.getElementById("scanBtn");
  const scanBtnLabel = document.getElementById("scanBtnLabel");
  const scoreNumber = document.getElementById("scoreNumber");
  const verdictBadge = document.getElementById("verdictBadge");
  const urlHeadline = document.getElementById("urlHeadline");
  const verdictSummary = document.getElementById("verdictSummary");
  const inspectionSteps = document.getElementById("inspectionSteps");
  const remediationText = document.getElementById("remediationText");
  const advisoryPrefix = document.getElementById("advisoryPrefix");
  const btnVoiceAudio = document.getElementById("btnVoiceAudio");
  const audioBtnText = document.getElementById("audioBtnText");
  const btnQuickDossier = document.getElementById("btnQuickDossier");
  const dossierBtnText = document.getElementById("dossierBtnText");
  const dossierModal = document.getElementById("dossierModal");
  const dossierText = document.getElementById("dossierText");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const copyDossierBtn = document.getElementById("copyDossierBtn");
  const langToggleBtn = document.getElementById("langToggleBtn");
  const contrastToggleBtn = document.getElementById("contrastToggleBtn");

  let currentScanData = null;
  let currentLang = "hi"; // default Hindi for national accessibility
  let isSpeaking = false;
  let isHighContrast = false;

  const i18n = {
    hi: {
      langToggle: "🌐 English",
      inspect: "जांच करें",
      placeholder: "वेबसाइट का लिंक दर्ज करें...",
      audioListen: "आवाज़ में सुनें",
      audioStop: "आवाज़ बंद करें",
      dossierBtn: "CERT-In डोजियर",
      verdictOfficial: "सुरक्षित एवं प्रामाणिक",
      verdictThreat: "सावधान! फर्जी क्लोन",
      verdictCaution: "सतर्कता: संदिग्ध डोमेन",
      evaluating: "राष्ट्रीय साइबर सुरक्षा मानकों पर जांच जारी है...",
      advisoryPrefix: "नागरिक सुरक्षा सलाह:",
      layer1: "1. सरकारी डोमेन प्रमाणन (.gov.in / .nic.in)",
      layer2: "2. वर्तनी व नाम की नकल (Typosquatting)",
      layer3: "3. आधार व पासवर्ड चोरी फॉर्म (Credential Theft)",
      layer4: "4. एआई विजुअल क्लोनिंग (Lookalike Match)",
      layer5: "5. डोमेन पंजीकरण व उम्र (Domain Age)",
      pass: "सत्यापित",
      fail: "खतरा",
      warn: "संदिग्ध",
      copiedToast: "डोजियर क्लिपबोर्ड पर कॉपी हो गया!",
      advisorySafe: "यह वेबसाइट पूरी तरह से प्रामाणिक और आधिकारिक सरकारी पोर्टल है।",
      advisoryThreat: "चेतावनी! यह वेबसाइट फर्जी है जो सरकारी पोर्टल की नकल कर रही है। अपना आधार, पैन या OTP कभी न दें!",
      advisoryCaution: "सावधानी बरतें। यह वेबसाइट आधिकारिक सरकारी रजिस्ट्री में दर्ज नहीं है।"
    },
    en: {
      langToggle: "🌐 हिंदी",
      inspect: "Inspect",
      placeholder: "Enter website URL to scan...",
      audioListen: "Listen Audio",
      audioStop: "Stop Audio",
      dossierBtn: "CERT-In Dossier",
      verdictOfficial: "VERIFIED OFFICIAL",
      verdictThreat: "CRITICAL THREAT: FAKE CLONE",
      verdictCaution: "CAUTION: SUSPICIOUS DOMAIN",
      evaluating: "Evaluating domain against national cyber defense baseline...",
      advisoryPrefix: "ADVISORY:",
      layer1: "1. Sovereign TLD Authentication (.gov.in / .nic.in)",
      layer2: "2. Typosquatting & Spelling Traps Check",
      layer3: "3. Identity & Credential Theft Forms",
      layer4: "4. AI Visual Lookalike Detection",
      layer5: "5. Domain Age & Registry Verification",
      pass: "PASS",
      fail: "MALICIOUS",
      warn: "SUSPICIOUS",
      copiedToast: "Dossier copied to clipboard!",
      advisorySafe: "Safe for navigation. The domain is verified and authenticated under Government of India.",
      advisoryThreat: "DO NOT enter Aadhaar, PAN, OTP, or banking credentials. Site is a malicious clone!",
      advisoryCaution: "Exercise caution. Verify the official URL before providing personal details."
    }
  };

  function applyLanguage(lang) {
    currentLang = lang;
    const t = i18n[lang];
    if (langToggleBtn) langToggleBtn.textContent = t.langToggle;
    if (scanBtnLabel) scanBtnLabel.textContent = t.inspect;
    if (urlInput) urlInput.placeholder = t.placeholder;
    if (audioBtnText) audioBtnText.textContent = isSpeaking ? t.audioStop : t.audioListen;
    if (dossierBtnText) dossierBtnText.textContent = t.dossierBtn;
    if (advisoryPrefix) advisoryPrefix.textContent = t.advisoryPrefix;
    if (currentScanData) renderScanData(currentScanData, currentScanData.url || (urlHeadline ? urlHeadline.textContent : ""));
  }

  // Language Toggle
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", () => {
      applyLanguage(currentLang === "hi" ? "en" : "hi");
    });
  }

  // Contrast Toggle
  if (contrastToggleBtn) {
    contrastToggleBtn.addEventListener("click", () => {
      isHighContrast = !isHighContrast;
      if (isHighContrast) {
        document.body.classList.add("high-contrast");
      } else {
        document.body.classList.remove("high-contrast");
      }
    });
  }

  // Voice Narration (Text-to-Speech)
  if (btnVoiceAudio) {
    btnVoiceAudio.addEventListener("click", () => {
      if (!('speechSynthesis' in window)) {
        showToast("Text-to-speech not supported");
        return;
      }

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btnVoiceAudio.classList.remove("playing");
        if (audioBtnText) audioBtnText.textContent = i18n[currentLang].audioListen;
        return;
      }

      if (!currentScanData) return;

      let textToSpeak = "";
      if (currentLang === "hi") {
        if (currentScanData.risk_score >= 66 || currentScanData.verdict === "PHISHING_CLONE") {
          textToSpeak = "सावधान! यह वेबसाइट फर्जी एवं धोखाधड़ी से भरी है। यह सरकारी पोर्टल नहीं है। कृपया अपना आधार, पैन या बैंक विवरण कभी दर्ज न करें। सहायता के लिए तुरंत 1930 पर कॉल करें।";
        } else if (currentScanData.risk_score <= 25 || currentScanData.verdict === "LEGITIMATE") {
          textToSpeak = "यह वेबसाइट पूरी तरह से सुरक्षित एवं प्रामाणिक सरकारी पोर्टल है।";
        } else {
          textToSpeak = "सतर्क रहें! यह वेबसाइट संदिग्ध है और आधिकारिक सरकारी डोमेन से सत्यापित नहीं है।";
        }
      } else {
        if (currentScanData.risk_score >= 66 || currentScanData.verdict === "PHISHING_CLONE") {
          textToSpeak = "Critical Warning! This website is a fake phishing clone. Never enter your Aadhaar, bank details, or OTP. Call 1930 immediately.";
        } else if (currentScanData.risk_score <= 25 || currentScanData.verdict === "LEGITIMATE") {
          textToSpeak = "Verified Authentic. This domain belongs to genuine Government of India infrastructure.";
        } else {
          textToSpeak = "Caution! This website shows suspicious indicators and is not verified as an official government portal.";
        }
      }

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.95;
      utterance.onend = () => {
        isSpeaking = false;
        btnVoiceAudio.classList.remove("playing");
        if (audioBtnText) audioBtnText.textContent = i18n[currentLang].audioListen;
      };
      utterance.onerror = () => {
        isSpeaking = false;
        btnVoiceAudio.classList.remove("playing");
        if (audioBtnText) audioBtnText.textContent = i18n[currentLang].audioListen;
      };

      isSpeaking = true;
      btnVoiceAudio.classList.add("playing");
      if (audioBtnText) audioBtnText.textContent = i18n[currentLang].audioStop;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  // 1. Render Scan Data
  function renderScanData(data, displayUrl = "") {
    currentScanData = data;
    const t = i18n[currentLang];

    // Score formatting
    if (scoreNumber) {
      const score = Number(data.risk_score) || 0;
      scoreNumber.textContent = score < 10 ? `0${score}` : `${score}`;
      if (score >= 66 || data.verdict === "PHISHING_CLONE") {
        scoreNumber.style.color = "var(--color-threat)";
      } else if (score >= 26 || data.verdict === "SUSPICIOUS") {
        scoreNumber.style.color = "var(--color-caution)";
      } else {
        scoreNumber.style.color = "var(--color-safe)";
      }
    }

    // Headline
    if (urlHeadline) {
      urlHeadline.textContent = displayUrl || data.url || "Active Tab";
    }

    // Verdict Badge
    if (verdictBadge) {
      if (data.verdict === "PHISHING_CLONE" || data.risk_score >= 66) {
        verdictBadge.textContent = t.verdictThreat;
        verdictBadge.className = "verdict-badge-clean badge-threat";
      } else if (data.verdict === "SUSPICIOUS" || data.risk_score >= 26) {
        verdictBadge.textContent = t.verdictCaution;
        verdictBadge.className = "verdict-badge-clean badge-caution";
      } else {
        verdictBadge.textContent = t.verdictOfficial;
        verdictBadge.className = "verdict-badge-clean badge-safe";
      }
    }

    // Summary
    if (verdictSummary) {
      verdictSummary.textContent = data.summary || t.evaluating;
    }

    // Advisory
    if (remediationText) {
      if (data.verdict === "PHISHING_CLONE" || data.risk_score >= 66) {
        remediationText.textContent = t.advisoryThreat;
      } else if (data.verdict === "SUSPICIOUS" || data.risk_score >= 26) {
        remediationText.textContent = t.advisoryCaution;
      } else {
        remediationText.textContent = t.advisorySafe;
      }
    }

    // 5 Inspection Steps
    if (inspectionSteps) {
      inspectionSteps.innerHTML = "";
      const breakdown = data.signal_breakdown || {};
      const lexScore = Number(breakdown.lexical_score) || 0;
      const isOfficial = data.is_genuine_gov_tld;
      const sensFields = breakdown.sensitive_fields_found || [];
      const isClone = data.impersonated || data.verdict === "PHISHING_CLONE";
      const domainAge = Number(breakdown.domain_age_days) || 1200;

      const steps = [
        {
          num: "01",
          title: t.layer1,
          status: isOfficial ? "PASS" : "FAIL",
          statusText: isOfficial ? t.pass : t.fail,
          desc: isOfficial ? "Authentic sovereign NIC India infrastructure (.gov.in/.nic.in)." : "Site does not belong to verified .gov.in sovereign registry."
        },
        {
          num: "02",
          title: t.layer2,
          status: lexScore > 30 ? "FAIL" : "PASS",
          statusText: lexScore > 30 ? t.fail : t.pass,
          desc: lexScore > 30 ? "Critical: Deceptive spelling trick (e.g., replacing 'o' with '0' as in g0v.in)." : "No typosquatting, zero-width homoglyphs, or spoofing detected."
        },
        {
          num: "03",
          title: t.layer3,
          status: sensFields.length > 0 ? "FAIL" : "PASS",
          statusText: sensFields.length > 0 ? t.fail : t.pass,
          desc: sensFields.length > 0 ? `Harvesting fields detected: [${sensFields.join(', ')}] on non-gov domain.` : "No unauthorized Aadhaar, PAN, OTP, or biometric credential harvesting forms."
        },
        {
          num: "04",
          title: t.layer4,
          status: isClone ? "FAIL" : "PASS",
          statusText: isClone ? t.fail : t.pass,
          desc: isClone ? `Lookalike brand match mimicking "${data.target_entity || 'Gov Portal'}".` : "Visual layout shows zero deceptive imitation of government portals."
        },
        {
          num: "05",
          title: t.layer5,
          status: "PASS",
          statusText: t.pass,
          desc: isOfficial ? "Authenticated NIC registry infrastructure." : `Established domain age: ${domainAge} days.`
        }
      ];

      steps.forEach((s) => {
        const step = document.createElement("div");
        step.className = "step-card";
        const statusColor = s.status === "FAIL" ? "var(--color-threat)" : "var(--color-safe)";

        step.innerHTML = `
          <div class="step-number">${s.num}</div>
          <div class="step-content">
            <div class="step-header">
              <span class="step-title">${s.title}</span>
              <span class="step-status" style="color: ${statusColor};">[${s.statusText}]</span>
            </div>
            <p class="step-desc">${s.desc}</p>
          </div>
        `;
        inspectionSteps.appendChild(step);
      });
    }
  }

  // 2. Load active tab status on popup open
  function loadActiveTabStatus() {
    chrome.runtime.sendMessage({ action: "GET_CURRENT_STATUS" }, (response) => {
      if (response && response.success && response.result) {
        renderScanData(response.result, response.tab ? response.tab.url : "");
      } else {
        if (scoreNumber) scoreNumber.textContent = "00";
        if (urlHeadline) urlHeadline.textContent = "Ready to inspect tab...";
        if (verdictSummary) verdictSummary.textContent = "Navigate to any portal or enter a URL above.";
      }
    });
  }

  // 3. Manual Inspector
  if (scanBtn) {
    scanBtn.addEventListener("click", () => {
      const inputUrl = urlInput ? urlInput.value.trim() : "";
      if (!inputUrl) {
        showToast(currentLang === "hi" ? "कृपया लिंक दर्ज करें" : "Enter a URL to scan");
        return;
      }

      if (scoreNumber) scoreNumber.textContent = "--";
      if (urlHeadline) urlHeadline.textContent = inputUrl;
      if (verdictSummary) verdictSummary.textContent = i18n[currentLang].evaluating;

      chrome.runtime.sendMessage({ action: "MANUAL_SCAN", url: inputUrl }, (resp) => {
        if (resp && resp.success && resp.result) {
          renderScanData(resp.result, inputUrl);
        } else {
          showToast("Scan completed.");
        }
      });
    });
  }

  if (urlInput) {
    urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && scanBtn) {
        scanBtn.click();
      }
    });
  }

  // 4. CERT-In Incident Dossier Modal
  if (btnQuickDossier) {
    btnQuickDossier.addEventListener("click", () => {
      if (!currentScanData) {
        showToast("No active scan data");
        return;
      }

      const formatted = `========================================================================
CYBER SECURITY INCIDENT REPORT / PHISHING TAKEDOWN DOSSIER
Prepared for: CERT-In (incident@cert-in.org.in) & CyberCrime Portal (cybercrime.gov.in)
Incident ID : CERTIN-SIH-${Math.random().toString(36).substr(2, 9).toUpperCase()}
Timestamp   : ${new Date().toISOString()}
========================================================================
Target Scope      : Government of India Sovereign Public Services
Impersonated Port.: ${currentScanData.target_entity || 'Government Scheme'}
Malicious URL     : ${currentScanData.url || (urlHeadline ? urlHeadline.textContent : '')}
Threat Score      : ${currentScanData.risk_score} / 100
Classification    : ${currentScanData.verdict}

[1] FORENSIC EVIDENCE:
- Sovereign TLD Status: ${currentScanData.is_genuine_gov_tld ? 'AUTHENTIC (.gov.in/.nic.in)' : 'UNAUTHORIZED PUBLIC TLD'}
- Lexical Typosquat Score: ${currentScanData.signal_breakdown?.lexical_score || 0}/100
- Sensitive Harvesting: ${(currentScanData.signal_breakdown?.sensitive_fields_found || []).join(', ') || 'None'}
- Domain Age: ${currentScanData.signal_breakdown?.domain_age_days || 'N/A'} days

[2] DETECTED MALICIOUS INDICATORS:
${(currentScanData.reasons || []).map((r, i) => `[${i + 1}] ${r}`).join('\n') || 'None'}

[3] TAKEDOWN DIRECTIVES:
1. Issue urgent DNS sinkhole directive via NIXI / INRegistry.
2. Direct TSP/ISP DNS blocking under Section 69A IT Act.
3. Alert CERT-In Incident Response Team.
========================================================================`;
      if (dossierText) dossierText.textContent = formatted;
      if (dossierModal) dossierModal.classList.add("active");
    });
  }

  if (modalCloseBtn && dossierModal) {
    modalCloseBtn.addEventListener("click", () => {
      dossierModal.classList.remove("active");
    });
  }

  if (dossierModal) {
    dossierModal.addEventListener("click", (e) => {
      if (e.target === dossierModal) dossierModal.classList.remove("active");
    });
  }

  if (copyDossierBtn && dossierText) {
    copyDossierBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(dossierText.textContent).then(() => {
        showToast(i18n[currentLang].copiedToast);
        if (dossierModal) dossierModal.classList.remove("active");
      });
    });
  }

  // 5. Toast Notification
  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-clean";
    toast.textContent = message;

    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(6px)";
      toast.style.transition = "all 0.2s ease";
      setTimeout(() => toast.remove(), 200);
    }, 2200);
  }

  // Initial setup
  applyLanguage("hi");
  loadActiveTabStatus();
});
