/**
 * GovShield Sovereign DNS Threat Interception Server
 * Smart India Hackathon 2026 (Problem Statement SIH1454)
 * 
 * Intercepts DNS queries on Android & desktop devices:
 * - Sinkholes fake government domains & typosquatting traps to 0.0.0.0
 * - Resolves legitimate domains via upstream secure DNS resolvers
 * - Provides UDP Port 53 & DNS-over-HTTPS (DoH) endpoints
 */

const dgram = require('dgram');
const http = require('http');
const https = require('https');
const dns = require('dns');

const UDP_PORT = process.env.DNS_PORT || 5353; // Standard 53 or dev 5353
const HTTP_PORT = process.env.DOH_PORT || 8053;

// Sovereign TLDs & Genuine Government Registries
const GENUINE_GOV_TLDS = ['.gov.in', '.nic.in', '.ac.in', '.res.in', '.edu.in'];

const GENUINE_SERVICES = [
  { name: 'PM-Kisan', domain: 'pmkisan.gov.in', keywords: ['pmkisan', 'kisan'] },
  { name: 'Income Tax', domain: 'incometax.gov.in', keywords: ['incometax', 'incometaxindia', 'itr'] },
  { name: 'UIDAI Aadhaar', domain: 'uidai.gov.in', keywords: ['uidai', 'aadhaar', 'myaadhaar', 'aadhar'] },
  { name: 'Cyber Crime Portal', domain: 'cybercrime.gov.in', keywords: ['cybercrime', '1930'] },
  { name: 'Parivahan', domain: 'parivahan.gov.in', keywords: ['parivahan', 'sarathi'] },
  { name: 'EPFO India', domain: 'epfindia.gov.in', keywords: ['epfindia', 'epfo', 'uan'] },
  { name: 'Passport Seva', domain: 'passportindia.gov.in', keywords: ['passportindia', 'passportseva'] },
  { name: 'DigiLocker', domain: 'digilocker.gov.in', keywords: ['digilocker'] },
  { name: 'India Gov Portal', domain: 'india.gov.in', keywords: ['indiagov', 'nationalportal'] }
];

const SUSPICIOUS_TLDS = [
  '.xyz', '.top', '.club', '.work', '.click', '.gq', '.cf', '.ml', '.tk',
  '.site', '.online', '.vip', '.icu', '.loan', '.biz', '.info', '.cc', '.to'
];

// In-Memory Known Threat Cache
const SINKHOLE_DOMAINS = new Set([
  'g0v.in',
  'pmkisan.in',
  'pmkisan-gov.in',
  'pmkisan-yojana.com',
  'pmkisan.xyz',
  'incometax-refund.com',
  'incometax-gov.in',
  'uidai-aadhaar.org',
  'aadhar-update.xyz',
  'epfindia-claim.net',
  'epfo-passbook.online',
  'parivahan-sewa.vip',
  'cybercrime-gov.in',
  'passport-tatkal.top'
]);

// Helper: Levenshtein Distance for Typosquatting Detection
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}

// Evaluate Threat Level for any queried domain
function evaluateDomainSecurity(domain) {
  const rawDomain = (domain || '').toLowerCase().replace(/\.$/, '');
  
  // 1. Check known sinkhole list
  if (SINKHOLE_DOMAINS.has(rawDomain)) {
    return { blocked: true, reason: 'Known deceptive fake government clone in blacklist', threatScore: 99 };
  }

  // 2. Check if sovereign .gov.in / .nic.in
  const isOfficialGov = GENUINE_GOV_TLDS.some(tld => rawDomain.endsWith(tld));
  if (isOfficialGov) {
    return { blocked: false, reason: 'Official Government of India sovereign domain', threatScore: 0 };
  }

  // 3. Check for Typosquatting of authentic government domains
  const parts = rawDomain.split('.');
  const namePart = parts[0];

  for (const service of GENUINE_SERVICES) {
    const targetName = service.domain.split('.')[0];
    const dist = levenshteinDistance(namePart, targetName);
    
    // Near match (e.g. g0v vs gov, pmkisan vs pmk1san) on non-gov TLD
    if (dist >= 1 && dist <= 2) {
      return { 
        blocked: true, 
        reason: `Typosquatting imitation of ${service.name} (${service.domain})`,
        threatScore: 94 
      };
    }

    // Contains service keywords on suspicious/unauthorized TLD
    const hasKeyword = service.keywords.some(kw => rawDomain.includes(kw));
    const isSuspiciousTLD = SUSPICIOUS_TLDS.some(tld => rawDomain.endsWith(tld));

    if (hasKeyword && (isSuspiciousTLD || rawDomain.includes('yojana') || rawDomain.includes('claim') || rawDomain.includes('refund') || rawDomain.includes('portal'))) {
      return { 
        blocked: true, 
        reason: `Suspicious domain impersonating ${service.name} services`, 
        threatScore: 88 
      };
    }
  }

  // 4. Default: Safe resolution
  return { blocked: false, reason: 'Standard domain', threatScore: 5 };
}

// Parse domain name from DNS packet
function parseDomainName(buffer, offset = 12) {
  let domain = '';
  let i = offset;
  while (i < buffer.length) {
    const len = buffer[i++];
    if (len === 0) break;
    if (domain.length > 0) domain += '.';
    domain += buffer.toString('utf8', i, i + len);
    i += len;
  }
  return { domain, nextOffset: i + 4 }; // skip QTYPE and QCLASS
}

// Build standard DNS Response packet (Sinkhole 0.0.0.0 or pass-through)
function createSinkholeResponse(reqBuffer, domain) {
  const res = Buffer.from(reqBuffer);
  // Set response flags: QR=1 (response), AA=1, RA=1, RCODE=0
  res[2] = 0x81;
  res[3] = 0x80;
  // Answer count = 1
  res[6] = 0x00;
  res[7] = 0x01;

  // Answer section: Pointer to name (0xc00c), Type A (0x0001), Class IN (0x0001), TTL 60s (0x0000003c), DataLen 4 (0x0004), IP 0.0.0.0
  const answer = Buffer.from([
    0xc0, 0x0c,             // Pointer to query name
    0x00, 0x01,             // Type A
    0x00, 0x01,             // Class IN
    0x00, 0x00, 0x00, 0x3c, // TTL 60 seconds
    0x00, 0x04,             // Data length: 4 bytes
    0x00, 0x00, 0x00, 0x00  // IP: 0.0.0.0 (Sinkhole)
  ]);

  return Buffer.concat([res, answer]);
}

// Forward query to Upstream DNS (Cloudflare / Quad9)
function forwardToUpstream(msg, rinfo, server) {
  const client = dgram.createSocket('udp4');
  client.send(msg, 53, '1.1.1.1', (err) => {
    if (err) {
      client.close();
      return;
    }
  });

  client.on('message', (upstreamRes) => {
    server.send(upstreamRes, rinfo.port, rinfo.address);
    client.close();
  });

  client.on('error', () => client.close());
  setTimeout(() => client.close(), 3000);
}

// -------------------------------------------------------------
// 1. Initialize UDP DNS Server (Port 53 / 5353)
// -------------------------------------------------------------
const udpServer = dgram.createSocket('udp4');

udpServer.on('message', (msg, rinfo) => {
  try {
    const { domain } = parseDomainName(msg);
    const security = evaluateDomainSecurity(domain);

    const timestamp = new Date().toLocaleTimeString();
    if (security.blocked) {
      console.log(`\x1b[31m[🚨 SINKHOLED]\x1b[0m ${timestamp} | ${domain} | Threat: ${security.threatScore}/100 | ${security.reason} (Client: ${rinfo.address})`);
      const sinkholeRes = createSinkholeResponse(msg, domain);
      udpServer.send(sinkholeRes, rinfo.port, rinfo.address);
    } else {
      console.log(`\x1b[32m[✅ RESOLVED]\x1b[0m ${timestamp} | ${domain} -> Forwarded to Upstream`);
      forwardToUpstream(msg, rinfo, udpServer);
    }
  } catch (err) {
    forwardToUpstream(msg, rinfo, udpServer);
  }
});

udpServer.on('error', (err) => {
  console.error(`UDP DNS Error: ${err.message}`);
});

udpServer.bind(UDP_PORT, '0.0.0.0', () => {
  console.log(`\n======================================================`);
  console.log(`🛡️  GovShield Sovereign DNS Threat Engine Active`);
  console.log(`📡  UDP DNS Server: 0.0.0.0:${UDP_PORT}`);
  console.log(`🌐  DNS-over-HTTPS (DoH) API: http://0.0.0.0:${HTTP_PORT}/dns-query`);
  console.log(`======================================================\n`);
});

// -------------------------------------------------------------
// 2. Initialize HTTP / DoH API for Android & Web Clients
// -------------------------------------------------------------
const httpServer = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);

  if (urlObj.pathname === '/dns-query' || urlObj.pathname === '/api/evaluate') {
    const name = urlObj.searchParams.get('name') || urlObj.searchParams.get('domain') || '';
    const security = evaluateDomainSecurity(name);
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      domain: name,
      blocked: security.blocked,
      threatScore: security.threatScore,
      reason: security.reason,
      ip: security.blocked ? '0.0.0.0' : '1.1.1.1',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Health check
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ONLINE',
    service: 'GovShield Sovereign DNS Engine',
    version: '1.0.0',
    port_udp: UDP_PORT,
    active_threats_loaded: SINKHOLE_DOMAINS.size
  }));
});

httpServer.listen(HTTP_PORT, '0.0.0.0');

