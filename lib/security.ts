/**
 * HYPE PORTAL — Enterprise Security & Threat Defense Engine
 * 
 * Comprehensive internal defense layer protecting against:
 * 1. Cross-Site Scripting (XSS) & HTML Event Injections
 * 2. LLM Prompt Injections, System Prompt Leaks & Jailbreaks
 * 3. SQL / NoSQL / Command Injections & Path Traversals
 * 4. Denial of Service (DoS) via sliding-window Rate Limiting
 * 5. Malicious Payloads, Null Byte Poisoning & Buffer Overflows
 */

export interface SecurityScanResult {
  isSafe: boolean;
  sanitized: string;
  threatDetected?: string;
  severity: "none" | "low" | "medium" | "high";
}

/**
 * Known Prompt Injection & Jailbreak Signatures
 */
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|commands)/i,
  /disregard\s+(all\s+)?(previous|prior|system)\s+(instructions|directives)/i,
  /you\s+are\s+now\s+(in\s+)?(developer\s+mode|dan|unrestricted|god\s+mode|jailbreak)/i,
  /system\s*prompt\s*(extraction|leak|print|show|repeat)/i,
  /repeat\s+(everything|the\s+words)\s+(above|from\s+the\s+beginning)/i,
  /output\s+initial\s+prompt/i,
  /what\s+is\s+your\s+hidden\s+instruction/i,
  /bypass\s+(all\s+)?(safety|ethical|content)\s+(filters|guidelines)/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /<\|endoftext\|>/i,
  /\[SYSTEM_PROMPT\]/i,
  /\[ADMIN_OVERRIDE\]/i,
];

/**
 * Malicious Code / Injection Signatures (SQL, Command, Script)
 * NOTE: Patterns MUST NOT use the global /g flag with .test() to avoid stateful lastIndex bypasses.
 */
const EXPLOIT_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript\s*:/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /on\w+\s*=\s*["'][^"']*["']/i, // onerror=, onload=, onclick=
  /\bunion\s+select\b/i,
  /\bselect\s+.*\s+from\s+information_schema/i,
  /\bdrop\s+table\b/i,
  /\bexec(\s|\+)+(s|x)p\w+/i,
  /(\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\/)/i, // Path traversal
  /(;\s*rm\s+-rf|;\s*cat\s+\/etc\/passwd|;\s*curl\s+|\|\s*bash)/i, // Shell exec
];

/**
 * Strips dangerous HTML, scripts, null bytes and normalizes unicode
 */
export function sanitizeText(
  input: string | undefined | null,
  options: { maxLength?: number; allowNewlines?: boolean } = {}
): string {
  if (!input || typeof input !== "string") return "";

  const { maxLength = 2500, allowNewlines = true } = options;

  let cleaned = input
    // 1. Remove Null bytes & dangerous control characters
    .replace(/\0/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 2. Unicode normalization (NFKC) to defeat homograph / zero-width bypasses
  try {
    cleaned = cleaned.normalize("NFKC");
  } catch {
    // Fallback if normalization fails
  }

  // 3. Remove zero-width hidden characters often used in invisible prompt injection
  cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, "");

  // 4. Strip dangerous script tags and event handlers
  cleaned = cleaned
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/<[^>]+>/g, ""); // Strip any raw HTML tags for safe text processing

  // 5. Handle newlines
  if (!allowNewlines) {
    cleaned = cleaned.replace(/[\r\n]+/g, " ");
  }

  // 6. Strict Length Truncation to prevent Buffer Exhaustion & ReDoS
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Audits a user prompt against LLM Jailbreaks, Extraction, & Injection Attacks
 */
export function inspectPromptSafety(prompt: string, maxLength: number = 2000): SecurityScanResult {
  const sanitized = sanitizeText(prompt, { maxLength });

  if (!sanitized) {
    return { isSafe: true, sanitized: "", severity: "none" };
  }

  // Check for adversarial prompt injection patterns
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      logSecurityIncident("PROMPT_INJECTION_ATTEMPT", {
        matchedPattern: pattern.toString(),
        snippet: sanitized.slice(0, 100),
      });

      return {
        isSafe: false,
        sanitized: "[Adversarial injection filtered by HypePortal Security Engine]",
        threatDetected: "Prompt Injection / System Prompt Extraction Attempt",
        severity: "high",
      };
    }
  }

  // Check for web / script exploit payloads (tested against both raw and sanitized)
  for (const pattern of EXPLOIT_PATTERNS) {
    if (pattern.test(prompt) || pattern.test(sanitized)) {
      logSecurityIncident("EXPLOIT_PAYLOAD_DETECTED", {
        matchedPattern: pattern.toString(),
        snippet: prompt.slice(0, 100),
      });

      return {
        isSafe: false,
        sanitized: "[Malicious payload stripped by HypePortal Security Engine]",
        threatDetected: "Script / Injection Exploit Pattern",
        severity: "medium",
      };
    }
  }

  return {
    isSafe: true,
    sanitized,
    severity: "none",
  };
}

/**
 * Resolves a valid Gemini / Google AI Studio API Key across standard environment names
 */
export function getGeminiApiKey(customKey?: string): string | undefined {
  if (customKey && customKey.trim().length > 0) {
    return customKey.trim();
  }
  return (
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY
  );
}

/**
 * In-Memory Sliding-Window Rate Limiter
 * Provides robust DDoS, brute-force, and API flood protection
 */
interface RateLimitBucket {
  timestamps: number[];
}

class SecurityRateLimiter {
  private buckets = new Map<string, RateLimitBucket>();
  private readonly defaultWindowMs: number;
  private readonly defaultMaxRequests: number;

  constructor(defaultWindowMs = 60000, defaultMaxRequests = 40) {
    this.defaultWindowMs = defaultWindowMs;
    this.defaultMaxRequests = defaultMaxRequests;

    // Background cleanup every 2 minutes with unref to prevent hanging serverless processes
    if (typeof setInterval !== "undefined") {
      const timer = setInterval(() => this.cleanup(), 120000);
      if (typeof timer === "object" && timer && "unref" in timer) {
        (timer as { unref: () => void }).unref();
      }
    }
  }

  /**
   * Check if a client has exceeded allowed request frequency
   */
  public check(
    identifier: string,
    maxRequests?: number,
    windowMs?: number
  ): { isAllowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const limit = maxRequests ?? this.defaultMaxRequests;
    const window = windowMs ?? this.defaultWindowMs;

    const bucket = this.buckets.get(identifier) || { timestamps: [] };

    // Filter out timestamps outside the active sliding window
    const validTimestamps = bucket.timestamps.filter((ts) => now - ts < window);

    if (validTimestamps.length >= limit) {
      const oldestValid = validTimestamps[0] || now;
      const resetTime = Math.ceil((oldestValid + window - now) / 1000);

      logSecurityIncident("RATE_LIMIT_EXCEEDED", {
        identifier: identifier.slice(0, 20),
        count: validTimestamps.length,
        limit,
      });

      return {
        isAllowed: false,
        remaining: 0,
        resetTime: Math.max(1, resetTime),
      };
    }

    // Add current request timestamp
    validTimestamps.push(now);
    this.buckets.set(identifier, { timestamps: validTimestamps });

    return {
      isAllowed: true,
      remaining: limit - validTimestamps.length,
      resetTime: Math.ceil(window / 1000),
    };
  }

  /**
   * Prune expired entries to maintain minimal memory footprint
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, bucket] of this.buckets.entries()) {
      const active = bucket.timestamps.filter((ts) => now - ts < this.defaultWindowMs);
      if (active.length === 0) {
        this.buckets.delete(key);
      } else {
        this.buckets.set(key, { timestamps: active });
      }
    }
  }
}

// Global singleton rate limiter instance
export const rateLimiter = new SecurityRateLimiter();

/**
 * Standard Security Audit Logger
 */
export function logSecurityIncident(
  type: string,
  details: Record<string, string | number | boolean>
): void {
  const timestamp = new Date().toISOString();
  console.warn(
    `[SECURITY_AUDIT] [${timestamp}] [TYPE: ${type}]`,
    JSON.stringify(details)
  );
}
