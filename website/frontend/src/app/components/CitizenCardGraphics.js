'use client';

// Graphic 1: Women & Child Cyber Safety Illustration
export const WomenChildGraphic = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-custom-svg" aria-label="Women and Child Cyber Safety Illustration">
    <defs>
      <linearGradient id="bgGrad1" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ff7675" />
        <stop offset="1" stopColor="#d63031" />
      </linearGradient>
      <linearGradient id="shieldGrad1" x1="0" y1="0" x2="0" y2="120" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="1" stopColor="#ffeaa7" stopOpacity="0.9" />
      </linearGradient>
      <filter id="shadow1" x="-10" y="-10" width="420" height="220">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Background */}
    <rect width="400" height="200" fill="url(#bgGrad1)" />
    
    {/* Subtle Decorative Rings */}
    <circle cx="200" cy="100" r="140" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="6 6" />
    <circle cx="200" cy="100" r="90" stroke="#ffffff" strokeOpacity="0.15" strokeWidth="2" />

    {/* Center Protective Shield */}
    <g filter="url(#shadow1)">
      <path d="M200 30 L250 55 C250 110 200 145 200 145 C200 145 150 110 150 55 Z" fill="url(#shieldGrad1)" stroke="#ffffff" strokeWidth="3" />
      <path d="M200 40 L240 60 C240 102 200 132 200 132 C200 132 160 102 160 60 Z" fill="#fff5f5" />
    </g>

    {/* Mother & Child Silhouette inside Shield */}
    {/* Mother */}
    <circle cx="190" cy="72" r="10" fill="#d63031" />
    <path d="M174 104 C174 88 206 88 206 104 Z" fill="#d63031" />
    {/* Child */}
    <circle cx="210" cy="80" r="7" fill="#e17055" />
    <path d="M198 106 C198 94 222 94 222 106 Z" fill="#e17055" />

    {/* Left Side: Stop Cyber Harassment Badge */}
    <g transform="translate(45, 60)" filter="url(#shadow1)">
      <rect width="80" height="80" rx="40" fill="#ffffff" />
      <circle cx="40" cy="40" r="32" fill="#ff7675" />
      {/* Stop Hand Symbol */}
      <rect x="36" y="24" width="8" height="22" rx="4" fill="#ffffff" />
      <rect x="26" y="30" width="8" height="16" rx="4" fill="#ffffff" />
      <rect x="46" y="28" width="8" height="18" rx="4" fill="#ffffff" />
      <path d="M24 44 C24 54 34 60 40 60 C46 60 56 54 56 44 L56 38 L24 38 Z" fill="#ffffff" />
    </g>

    {/* Right Side: 100% Anonymous Reporting Lock Badge */}
    <g transform="translate(275, 60)" filter="url(#shadow1)">
      <rect width="80" height="80" rx="40" fill="#ffffff" />
      <circle cx="40" cy="40" r="32" fill="#2d3436" />
      {/* Lock Icon */}
      <rect x="28" y="38" width="24" height="18" rx="3" fill="#ffeaa7" />
      <path d="M33 38 V30 C33 26 47 26 47 30 V38" stroke="#ffeaa7" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="40" cy="46" r="2" fill="#2d3436" />
    </g>

    {/* Bottom Trust Ribbon */}
    <g transform="translate(80, 162)">
      <rect width="240" height="26" rx="13" fill="#ffffff" fillOpacity="0.95" />
      <text x="120" y="17" textAnchor="middle" fill="#d63031" fontSize="11" fontWeight="800" fontFamily="sans-serif">
        🔒 100% CONFIDENTIAL & ANONYMOUS
      </text>
    </g>
  </svg>
);

// Graphic 2: Financial Fraud & 1930 Helpline Illustration
export const FinancialFraudGraphic = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-custom-svg" aria-label="Financial Cyber Fraud and 1930 Helpline Illustration">
    <defs>
      <linearGradient id="bgGrad2" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0984e3" />
        <stop offset="1" stopColor="#00cec9" />
      </linearGradient>
      <linearGradient id="cardGrad" x1="0" y1="0" x2="160" y2="100" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2d3436" />
        <stop offset="1" stopColor="#636e72" />
      </linearGradient>
      <filter id="shadow2" x="-10" y="-10" width="420" height="220">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Background */}
    <rect width="400" height="200" fill="url(#bgGrad2)" />

    {/* Decorative Grid Lines */}
    <line x1="0" y1="50" x2="400" y2="50" stroke="#ffffff" strokeOpacity="0.1" />
    <line x1="0" y1="100" x2="400" y2="100" stroke="#ffffff" strokeOpacity="0.1" />
    <line x1="0" y1="150" x2="400" y2="150" stroke="#ffffff" strokeOpacity="0.1" />

    {/* Center-Left: Bank Card with Phishing Alert */}
    <g transform="translate(40, 40)" filter="url(#shadow2)">
      <rect width="150" height="92" rx="10" fill="url(#cardGrad)" stroke="#ffffff" strokeWidth="2" />
      {/* EMV Chip */}
      <rect x="18" y="24" width="22" height="18" rx="3" fill="#fdcb6e" />
      <line x1="18" y1="33" x2="40" y2="33" stroke="#b2bec3" strokeWidth="1" />
      {/* Contactless wave */}
      <path d="M48 26 C52 30 52 36 48 40" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.8" />
      {/* Card Number Dots */}
      <circle cx="24" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="34" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="44" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="54" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="70" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="80" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="90" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      <circle cx="100" cy="62" r="3" fill="#ffffff" opacity="0.9" />
      {/* RuPay / Visa logo mockup */}
      <circle cx="120" cy="72" r="10" fill="#eb4d4b" opacity="0.9" />
      <circle cx="132" cy="72" r="10" fill="#f0932b" opacity="0.9" />
      
      {/* Warning Alert Badge on Card */}
      <g transform="translate(110, -8)">
        <polygon points="16,0 32,28 0,28" fill="#e74c3c" stroke="#ffffff" strokeWidth="2" />
        <text x="16" y="24" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="900">!</text>
      </g>
    </g>

    {/* Center-Right: 1930 Emergency Phone Shield */}
    <g transform="translate(225, 30)" filter="url(#shadow2)">
      <rect width="135" height="115" rx="14" fill="#ffffff" stroke="#00cec9" strokeWidth="3" />
      {/* Phone Icon in red circle */}
      <circle cx="68" cy="40" r="22" fill="#d63031" />
      <text x="68" y="48" textAnchor="middle" fill="#ffffff" fontSize="20">📞</text>
      {/* 1930 Big Bold Text */}
      <text x="68" y="80" textAnchor="middle" fill="#0984e3" fontSize="22" fontWeight="900" fontFamily="sans-serif">
        1930
      </text>
      <text x="68" y="98" textAnchor="middle" fill="#2d3436" fontSize="10" fontWeight="800" letterSpacing="0.5">
        TOLL FREE 24x7
      </text>
    </g>

    {/* Bottom Trust Ribbon */}
    <g transform="translate(70, 162)">
      <rect width="260" height="26" rx="13" fill="#ffffff" fillOpacity="0.95" />
      <text x="130" y="17" textAnchor="middle" fill="#0984e3" fontSize="11" fontWeight="800" fontFamily="sans-serif">
        ⚡ INSTANT FINANCIAL FRAUD INTERCEPT
      </text>
    </g>
  </svg>
);

// Graphic 3: CERT-In Incident Dossier & Cyber Crime Investigation
export const CyberCrimeGraphic = () => (
  <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="card-custom-svg" aria-label="CERT-In Cyber Incident Dossier Illustration">
    <defs>
      <linearGradient id="bgGrad3" x1="0" y1="0" x2="400" y2="200" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6c5ce7" />
        <stop offset="1" stopColor="#a29bfe" />
      </linearGradient>
      <filter id="shadow3" x="-10" y="-10" width="420" height="220">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#000000" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Background */}
    <rect width="400" height="200" fill="url(#bgGrad3)" />

    {/* Binary matrix background effect */}
    <text x="20" y="30" fill="#ffffff" fillOpacity="0.12" fontSize="10" fontFamily="monospace">01100101 11000101 CERT-IN 010101</text>
    <text x="20" y="55" fill="#ffffff" fillOpacity="0.12" fontSize="10" fontFamily="monospace">10101010 I4C NATIONAL GRID 10011</text>
    <text x="20" y="80" fill="#ffffff" fillOpacity="0.12" fontSize="10" fontFamily="monospace">11010011 SECTION 69A TAKEDOWN</text>

    {/* Left: Official Dossier Document */}
    <g transform="translate(45, 32)" filter="url(#shadow3)">
      <rect width="130" height="115" rx="8" fill="#ffffff" stroke="#2d3436" strokeWidth="2" />
      {/* Header bar of doc */}
      <rect x="1" y="1" width="128" height="22" rx="7" fill="#2d3436" />
      <text x="65" y="15" textAnchor="middle" fill="#ffeaa7" fontSize="9" fontWeight="800">LEGAL DOSSIER</text>
      
      {/* Checklist items in doc */}
      <line x1="16" y1="36" x2="114" y2="36" stroke="#00b894" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="48" x2="90" y2="48" stroke="#d63031" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="60" x2="105" y2="60" stroke="#0984e3" strokeWidth="3" strokeLinecap="round" />
      <line x1="16" y1="72" x2="75" y2="72" stroke="#636e72" strokeWidth="2" strokeLinecap="round" />
      
      {/* Official Red Verification Stamp */}
      <g transform="translate(70, 68)">
        <circle cx="20" cy="20" r="18" fill="none" stroke="#d63031" strokeWidth="2" strokeDasharray="3 2" />
        <text x="20" y="24" textAnchor="middle" fill="#d63031" fontSize="8" fontWeight="900">CERT-In</text>
      </g>
    </g>

    {/* Right: Golden Ashoka Legal Defense Shield */}
    <g transform="translate(225, 28)" filter="url(#shadow3)">
      <path d="M65 15 L115 35 C115 85 65 115 65 115 C65 115 15 85 15 35 Z" fill="#ffffff" stroke="#ffeaa7" strokeWidth="4" />
      <path d="M65 24 L105 40 C105 78 65 104 65 104 C65 104 25 78 25 40 Z" fill="#2d3436" />
      {/* Scales of Justice */}
      <text x="65" y="68" textAnchor="middle" fill="#ffeaa7" fontSize="28">⚖️</text>
      <text x="65" y="92" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="800">SEC 69A</text>
    </g>

    {/* Bottom Trust Ribbon */}
    <g transform="translate(75, 162)">
      <rect width="250" height="26" rx="13" fill="#ffffff" fillOpacity="0.95" />
      <text x="125" y="17" textAnchor="middle" fill="#6c5ce7" fontSize="11" fontWeight="800" fontFamily="sans-serif">
        🛡️ NIXI & CERT-In LEGAL TAKEDOWN
      </text>
    </g>
  </svg>
);
