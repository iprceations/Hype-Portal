import type { NextConfig } from "next";

const securityHeaders = [
  // 1. Content Security Policy (CSP) - Hardened against XSS, clickjacking, and injection
  {
    key: "Content-Security-Policy",
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
      style-src 'self' 'unsafe-inline' https:;
      img-src 'self' data: blob: https:;
      font-src 'self' data: https:;
      connect-src 'self' https://generativelanguage.googleapis.com https:;
      media-src 'self' data: blob:;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\s{2,}/g, " ").trim(),
  },
  // 2. Prevent Clickjacking - Denies iframing completely
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // 3. Prevent MIME-sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // 4. Referrer Policy - Leak-proof cross-origin referrer
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // 5. Restrict sensitive browser hardware APIs
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=(), usb=()",
  },
  // 6. Strict Transport Security (HSTS) - 2 years + subdomains + preload
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // 7. Legacy XSS Filter protection
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // 8. Cross-Origin Opener Policy (COOP) - Isolates browsing context
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  // 9. Cross-Origin Resource Policy (CORP) - Restricts cross-origin resource loading
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  // Strip X-Powered-By to prevent backend fingerprinting by recon tools
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
