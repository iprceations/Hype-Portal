import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * HYPE PORTAL — Next.js 16 Edge Security Proxy
 * 
 * Active Threat Shield:
 * 1. Blocks automated penetration-testing bots and malicious scanners
 * 2. Neutralizes path traversal, sensitive file probing (.env, .git, etc.)
 * 3. Rate-limits requests at the edge to block brute-force / DDoS attacks
 * 4. Injects cryptographic Request ID (X-Request-Id) for security auditability
 */

// Malicious scanner and bot signatures
const MALICIOUS_USER_AGENTS = [
  /sqlmap/i,
  /nikto/i,
  /acunetix/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /wpscan/i,
  /hydra/i,
  /burpcollaborator/i,
  /shodan/i,
  /censys/i,
  /zgrab/i,
  /nmap/i,
];

// Block sensitive file probes and path traversal attempts
const BLOCKED_PATH_PATTERNS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.aws/i,
  /^\/\.ssh/i,
  /^\/wp-admin/i,
  /^\/wp-login/i,
  /^\/phpmyadmin/i,
  /^\/xmlrpc\.php/i,
  /^\/etc\/passwd/i,
  /eval-stdin\.php/i,
  /\/\.ds_store/i,
  /\.(bak|config|sql|tar|gz|zip)$/i,
  /(\.\.\/|\.\.\\|%2e%2e)/i, // Directory traversal
];

// Edge in-memory sliding-window rate limiter with bounded capacity
const IP_REQUEST_LOG = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 60; // Max 60 requests per 10s per IP
const MAX_TRACKED_IPS = 2500; // Hard cap on edge tracked IPs to prevent memory exhaustion

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Periodic pruning if tracked IPs map grows large
  if (IP_REQUEST_LOG.size > MAX_TRACKED_IPS) {
    for (const [loggedIp, timestamps] of IP_REQUEST_LOG.entries()) {
      if (!timestamps.some((t) => now - t < RATE_LIMIT_WINDOW_MS)) {
        IP_REQUEST_LOG.delete(loggedIp);
      }
    }
  }

  const timestamps = IP_REQUEST_LOG.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  validTimestamps.push(now);
  IP_REQUEST_LOG.set(ip, validTimestamps);
  return false;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const userAgent = request.headers.get("user-agent") || "";
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // 1. Check for Path Traversal or Sensitive File Probes
  for (const pattern of BLOCKED_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      console.warn(`[SECURITY PROXY BLOCKED] Probing attempt from IP: ${ip} on path: ${pathname}`);
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden",
          message: "Access Denied: Malicious Request Signature Detected by HypePortal Security Engine",
          code: "SEC_PROBE_BLOCK",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Security-Block": "Threat-Detection-Active",
          },
        }
      );
    }
  }

  // 2. Check for Malicious Vulnerability Scanners & Recon Bots
  for (const pattern of MALICIOUS_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      console.warn(`[SECURITY PROXY BLOCKED] Malicious scanner detected: ${userAgent} from IP: ${ip}`);
      return new NextResponse(
        JSON.stringify({
          error: "Forbidden",
          message: "Access Denied: Automated Vulnerability Scanner Prohibited",
          code: "SEC_SCANNER_BLOCK",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "X-Security-Block": "Threat-Scanner-Active",
          },
        }
      );
    }
  }

  // 3. Edge Rate Limiting (Anti-DDoS / Flooding)
  if (isRateLimited(ip)) {
    console.warn(`[SECURITY PROXY BLOCKED] Rate limit exceeded from IP: ${ip}`);
    return new NextResponse(
      JSON.stringify({
        error: "Too Many Requests",
        message: "High traffic detected from your IP. Please cool down for a few seconds.",
        retryAfter: 10,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "10",
          "X-RateLimit-Exceeded": "true",
        },
      }
    );
  }

  // 4. Continue Request with Cryptographic Traceability & Security Headers
  const response = NextResponse.next();
  const requestId = crypto.randomUUID();

  response.headers.set("X-Request-Id", requestId);
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml
     * - public files with extensions (e.g. svg, png, jpg, webp)
     */
    "/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export default proxy;


