import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract dynamic query params
    const target = searchParams.get("target") || "@i_msbella";
    const username = target.startsWith("@") ? target : `@${target}`;
    const score = searchParams.get("score") || "89";
    const badge = searchParams.get("badge") || "Aesthetic NPC";
    const vibe = searchParams.get("vibe") || "Influencer";
    const roast =
      searchParams.get("roast") ||
      "You brag about 'scaling horizontally' when you can't even scale your sleep past 4 hours.";

    // Vibe theme color accents
    let accentGradient = "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)";
    let accentColor = "#a855f7";

    if (vibe === "Tech Bro") {
      accentGradient = "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)";
      accentColor = "#06b6d4";
    } else if (vibe === "Influencer") {
      accentGradient = "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)";
      accentColor = "#ec4899";
    } else if (vibe === "Doomscroller") {
      accentGradient = "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)";
      accentColor = "#a855f7";
    } else if (vibe === "Crypto Native") {
      accentGradient = "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)";
      accentColor = "#f59e0b";
    } else if (vibe === "Overthinker") {
      accentGradient = "linear-gradient(135deg, #10b981 0%, #0d9488 100%)";
      accentColor = "#10b981";
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#090a0f",
            padding: "48px 56px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Ambient Cyberpunk Glows */}
          <div
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: "rgba(168, 85, 247, 0.22)",
              filter: "blur(90px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-80px",
              left: "-80px",
              width: "420px",
              height: "420px",
              borderRadius: "50%",
              background: "rgba(6, 182, 212, 0.2)",
              filter: "blur(90px)",
            }}
          />

          {/* Top Header: Branding & Category */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  background: "#1E293B",
                  border: "1.5px solid rgba(249, 115, 22, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px",
                  boxShadow: "0 0 20px rgba(249, 115, 22, 0.25)",
                }}
              >
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ width: "100%", height: "100%" }}
                >
                  <path
                    d="M 17 62 C 19 36 38 18 63 18 C 76 18 86 28 85 48 C 84 62 78 76 66 87"
                    stroke="#475569"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                  <circle cx="63.5" cy="18" r="4" fill="#F97316" />
                  <circle cx="63.5" cy="18" r="1.6" fill="#FFFFFF" />
                  <circle cx="78" cy="27" r="4" fill="#F59E0B" />
                  <circle cx="78" cy="27" r="1.6" fill="#FFFFFF" />
                  <g fill="#FFFFFF">
                    <path d="M 28 44 H 38 V 76 H 28 Z" />
                    <path d="M 38 54 H 54 V 63 H 38 Z" />
                    <path d="M 54 54 H 64 V 76 H 54 Z" />
                  </g>
                  <path d="M 54 40 H 78.5 L 71 49 H 54 Z" fill="#F97316" />
                </svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    letterSpacing: "0.15em",
                    color: "#ffffff",
                  }}
                >
                  THE HYPE PORTAL
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9ca3af",
                    letterSpacing: "0.1em",
                    fontFamily: "monospace",
                  }}
                >
                  REAL-TIME HYPE INTELLIGENCE MATRIX
                </span>
              </div>
            </div>

            {/* Official Badge Pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(147, 51, 234, 0.15)",
                border: "1px solid rgba(168, 85, 247, 0.4)",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 10px #10b981",
                }}
              />
              <span
                style={{
                  color: "#d8b4fe",
                  fontSize: "12px",
                  fontWeight: 700,
                  fontFamily: "monospace",
                  letterSpacing: "0.08em",
                }}
              >
                AI VIBE AUDIT &bull; GEMINI 1.5
              </span>
            </div>
          </div>

          {/* Center Bento Card: Target & Vibe Score */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(168, 85, 247, 0.35)",
              borderRadius: "24px",
              padding: "36px 44px",
              gap: "36px",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Left Col: Target info & badge */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    color: "#9ca3af",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                  }}
                >
                  TARGET EVALUATION
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "3px 10px",
                    borderRadius: "6px",
                    background: "rgba(255, 255, 255, 0.07)",
                    color: "#e5e7eb",
                    fontFamily: "monospace",
                  }}
                >
                  {vibe}
                </span>
              </div>

              <div
                style={{
                  fontSize: "44px",
                  fontWeight: 900,
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                {username}
              </div>

              {/* Archetype Badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "13px", color: "#9ca3af" }}>Archetype:</span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "6px 16px",
                    borderRadius: "10px",
                    background: accentGradient,
                    color: "#ffffff",
                    fontSize: "16px",
                    fontWeight: 800,
                    letterSpacing: "0.02em",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  {badge}
                </div>
              </div>

              {/* Roast quote */}
              <div
                style={{
                  display: "flex",
                  marginTop: "6px",
                  padding: "12px 18px",
                  background: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "12px",
                  borderLeft: `4px solid ${accentColor}`,
                }}
              >
                <span
                  style={{
                    fontSize: "15px",
                    color: "#e2e8f0",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                  }}
                >
                  &ldquo;{roast.length > 130 ? roast.slice(0, 127) + "..." : roast}&rdquo;
                </span>
              </div>
            </div>

            {/* Right Col: Giant Hyperbole Score Dial */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px 36px",
                background: "rgba(0, 0, 0, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "20px",
                minWidth: "220px",
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontFamily: "monospace",
                  color: "#9ca3af",
                  letterSpacing: "0.15em",
                  marginBottom: "4px",
                }}
              >
                HYPERBOLE INDEX
              </span>

              <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                <span
                  style={{
                    fontSize: "84px",
                    fontWeight: 900,
                    color: "#ec4899",
                    lineHeight: 1,
                  }}
                >
                  {score}
                </span>
                <span
                  style={{
                    fontSize: "22px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                    color: "#a855f7",
                  }}
                >
                  /100
                </span>
              </div>

              <div
                style={{
                  marginTop: "8px",
                  padding: "4px 12px",
                  borderRadius: "999px",
                  background: "rgba(236, 72, 153, 0.2)",
                  border: "1px solid rgba(236, 72, 153, 0.5)",
                  color: "#f472b6",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}
              >
                CRITICAL EXPOSURE
              </div>
            </div>
          </div>

          {/* Bottom Bar: Telemetry & Social Callout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              zIndex: 10,
              fontSize: "13px",
              fontFamily: "monospace",
              color: "#6b7280",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              paddingTop: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span>Telemetry: 99.8% Sync</span>
              <span>&bull;</span>
              <span>Model: Gemini 1.5 Flash</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#d8b4fe", fontWeight: 600 }}>
                Roast your profile &rarr; thehypeportal.com
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error("OpenGraph image generation failed:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
