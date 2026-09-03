/**
 * GovShield Sentinel Grid - Content Script
 * Extracts DOM metadata and renders authoritative in-page security banners for all domains (Safe, Suspicious, Risky).
 */

(function () {
  // Avoid duplicate injection
  if (window.__govshield_injected) return;
  window.__govshield_injected = true;

  // 1. Extract DOM Features
  function extractPageMetadata() {
    try {
      const forms = Array.from(document.querySelectorAll('form'));
      const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
      const sensitiveInputs = [];

      inputs.forEach(inp => {
        const type = (inp.type || '').toLowerCase();
        const name = (inp.name || '').toLowerCase();
        const id = (inp.id || '').toLowerCase();
        const placeholder = (inp.placeholder || '').toLowerCase();
        const combined = `${name} ${id} ${placeholder}`;

        if (type === 'password' || combined.includes('pass')) {
          sensitiveInputs.push('Password');
        } else if (combined.includes('aadhaar') || combined.includes('aadhar') || combined.includes('uid')) {
          sensitiveInputs.push('Aadhaar Number');
        } else if (combined.includes('pan')) {
          sensitiveInputs.push('PAN Card Number');
        } else if (combined.includes('otp')) {
          sensitiveInputs.push('One-Time Password (OTP)');
        } else if (combined.includes('bank') || combined.includes('acc') || combined.includes('card')) {
          sensitiveInputs.push('Banking / Financial Details');
        }
      });

      // Sample HTML slice
      const htmlSlice = document.documentElement ? document.documentElement.outerHTML.slice(0, 75000) : "";

      return {
        url: window.location.href,
        title: document.title || "",
        formsCount: forms.length,
        sensitiveInputs: Array.from(new Set(sensitiveInputs)),
        htmlContent: htmlSlice
      };
    } catch (e) {
      return { url: window.location.href, formsCount: 0, sensitiveInputs: [], htmlContent: "" };
    }
  }

  // 2. Mount Banner Helper with Guaranteed DOM Insertion
  function mountBanner(bannerElement) {
    if (document.body) {
      document.body.prepend(bannerElement);
    } else if (document.documentElement) {
      document.documentElement.prepend(bannerElement);
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
          document.body.prepend(bannerElement);
        } else {
          document.documentElement.prepend(bannerElement);
        }
      });
    }
  }

  // 3. In-Page Universal Security Banner (Safe, Suspicious, Risky)
  function showSecurityBanner(scanResult) {
    if (!scanResult) return;

    const existing = document.getElementById('govshield-phishing-banner');
    if (existing) existing.remove();

    const score = Number(scanResult.risk_score) || 0;
    const verdict = scanResult.verdict || "LEGITIMATE";
    const targetEntity = scanResult.target_entity || "Official Indian Government Portal";
    const aiInsight = scanResult.genai_analysis?.plain_english_explanation || scanResult.summary || "";

    const banner = document.createElement('div');
    banner.id = 'govshield-phishing-banner';

    // Only display in-page alert banner on RISKY and SUSPICIOUS sites
    if (verdict !== "PHISHING_CLONE" && verdict !== "SUSPICIOUS" && score < 50) {
      // Safe website: Keep page clean and unblocked
      return;
    }

    const logoUrl = chrome.runtime.getURL('icons/logo.png');

    if (verdict === "PHISHING_CLONE" || score >= 66) {
      bannerClass = "govshield-banner-risk";
      iconSvg = `
        <img src="${logoUrl}" alt="GovShield Emblem" style="width: 34px; height: 40px; object-fit: contain; flex-shrink: 0;" />
      `;
      titleText = "GOVSHIELD CYBER DEFENSE ALERT";
      pillText = `RISK SCORE: ${score}/100 • CRITICAL THREAT`;
      descHtml = `⚠️ Deceptive lookalike domain detected! This website imitates <strong>${targetEntity}</strong> to steal citizen credentials. Never enter Aadhaar, PAN, Bank Details or OTP here!`;
      if (aiInsight) {
        descHtml += ` <span class="govshield-ai-insight">🛡️ ${aiInsight}</span>`;
      }
      actionsHtml = `
        <a href="tel:1930" class="govshield-btn" style="background: #be123c; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-weight: 700;">📞 1930 Helpline</a>
        <button id="govshield-leave-btn" class="govshield-btn govshield-btn-primary">Leave Unsafe Site</button>
        <button id="govshield-dismiss-btn" class="govshield-btn govshield-btn-secondary">Dismiss</button>
      `;
    } else {
      // Suspicious site
      bannerClass = "govshield-banner-susp";
      iconSvg = `
        <img src="${logoUrl}" alt="GovShield Emblem" style="width: 34px; height: 40px; object-fit: contain; flex-shrink: 0;" />
      `;
      titleText = "GOVSHIELD SECURITY NOTICE: POTENTIAL LOOKALIKE";
      pillText = `RISK SCORE: ${score}/100 • SUSPICIOUS`;
      descHtml = `Caution: This website contains keywords matching <strong>${targetEntity}</strong> but is NOT hosted on an official sovereign .gov.in domain. Verify carefully.`;
      actionsHtml = `
        <a href="tel:1930" class="govshield-btn" style="background: #92400e; color: #fff; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; font-weight: 700;">📞 1930 Helpline</a>
        <button id="govshield-dismiss-btn" class="govshield-btn govshield-btn-secondary">Acknowledge</button>
      `;
    }

    banner.className = bannerClass;
    banner.innerHTML = `
      <div class="govshield-banner-content">
        <div class="govshield-banner-icon">
          ${iconSvg}
        </div>
        <div class="govshield-banner-text">
          <div class="govshield-banner-title">
            <span>${titleText}</span>
            <span class="govshield-risk-pill">${pillText}</span>
          </div>
          <div class="govshield-banner-desc">
            ${descHtml}
          </div>
        </div>
        <div class="govshield-banner-actions">
          ${actionsHtml}
        </div>
      </div>
    `;

    mountBanner(banner);

    document.getElementById('govshield-leave-btn')?.addEventListener('click', () => {
      window.location.href = 'https://india.gov.in';
    });

    document.getElementById('govshield-dismiss-btn')?.addEventListener('click', () => {
      banner.remove();
    });
  }

  // 4. Send DOM and Handle Immediate Response
  const domData = extractPageMetadata();
  chrome.runtime.sendMessage({
    action: "DOM_EXTRACTED",
    url: window.location.href,
    domData: domData
  }, (response) => {
    if (response && response.success && response.result) {
      showSecurityBanner(response.result);
    }
  });

  // 5. Listen for broadcast update signals from background service worker
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'SHOW_SECURITY_BANNER' && msg.data) {
      showSecurityBanner(msg.data);
    }
  });

})();
