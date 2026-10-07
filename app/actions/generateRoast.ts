"use server";

import { sanitizeText, getGeminiApiKey } from "@/lib/security";

export type TargetType = "handle" | "website";
export type RoastMaster = "default" | "ramsay" | "majnu" | "shark" | "seniordev";

export interface RoastResponse {
  score: number;
  badge: string;
  roast: string;
  visualCringe?: number;
  bounceProbability?: number;
  techDebtScore?: number;
  source?: "gemini-1.5-flash" | "neural-engine";
}

interface GenerateRoastInput {
  username: string;
  targetType?: TargetType;
  vibe?: string;
  roastMaster?: RoastMaster;
  context?: string;
  apiKey?: string;
}

const ROAST_MASTER_PROMPTS: Record<RoastMaster, string> = {
  default: "You are a witty, Gen-Z tech critic and elite meme auditor on The Hype Portal.",
  ramsay:
    "You are Gordon Ramsay evaluating a website or social profile as if it were a horrific restaurant kitchen. Use phrases like 'IT'S RAW!', 'Utter disaster', 'Embarrassing', and savage culinary analogies.",
  majnu:
    "You are Majnu Bhai and Uday Shetty from the movie Welcome. Speak in hilarious Hinglish with legendary lines like 'Control Uday control...', '50 rupya kaat overacting ka', 'Aisi website/profile dekh ke meri kidney me dard ho gaya'.",
  shark:
    "You are an unapologetic, blunt Desi Shark (like Ashneer Grover). Speak with brutal honesty in Hinglish: 'Yeh sab doglapan hai', 'Dhandha band kar do', 'Equity toh door, main 1 rupee na doon is cringe ke liye'.",
  seniordev:
    "You are a cynical 10x Senior Tech Lead who has seen too many bloated JavaScript frameworks, inline CSS crimes, and junior dev delusions. Deliver hyper-technical, sarcastic burns.",
};

// Fallback witty Gen-Z meme roasts for when API key is missing or quota exceeded
const FALLBACK_ROASTS: Record<string, { badges: string[]; roasts: string[] }> = {
  "Tech Bro": {
    badges: [
      "Series-A Cosplayer",
      "Cold Brew Evangelist",
      "Sub-Scale Disruptor",
      "Vest-Wearing NPC",
      "LinkedIn Thought Leader",
    ],
    roasts: [
      "You brag about 'scaling horizontally' when you can't even scale your sleep past 4 hours.\nYour pitch deck has 47 mentions of 'paradigm shift' and zero paying customers.",
      "You wear a Patagonia fleece vest in 80-degree weather just to look fundable.\nYour entire personality is an unedited audio transcript of the All-In podcast.",
      "You put 'AI Agentic Orchestrator' in your bio before writing a single line of working code.\nYour company's burn rate is significantly higher than your daily active user count.",
      "You claim you're 'building in public' to disguise the fact that nobody is buying.\nYour LinkedIn posts always start with 'I was rejected 30 times, here is what it taught me.'",
    ],
  },
  Influencer: {
    badges: [
      "Aesthetic NPC",
      "Algorithm Hostage",
      "Engagement Baiter",
      "Micro-Celebrity In Denial",
      "Ring Light Addict",
    ],
    roasts: [
      "You spent 45 minutes color-grading a cup of lukewarm oat milk for 120 likes.\nYour authenticity is as heavily filtered as your front-facing ring light reflections.",
      "You start every TikTok with 'A lot of you have been asking'—literally nobody asked.\nYour most profound intimate relationship is with the Instagram algorithm.",
      "You describe posting a gym mirror selfie as 'holding space and inspiring collective growth'.\nYour entire net worth is tied up in unopened PR boxes and affiliate promo codes.",
      "You've rewritten your 150-character bio 12 times this week seeking spiritual clarity.\nYou measure your personal self-worth strictly in reel retention drop-off graphs.",
    ],
  },
  Doomscroller: {
    badges: [
      "Certified Chaos Agent",
      "Overclocked Brainrot Analyst",
      "Apocalypse Spectator",
      "Midnight Timeline Ghoul",
      "Dopamine Bankrupt",
    ],
    roasts: [
      "Your weekly screen time report could be classified as an interactive modern art tragedy.\nYou have a PhD in existential dread and an unread email count in the five figures.",
      "You refresh the timeline at 3 AM hoping for global collapse just to feel something.\nYour circadian rhythm was replaced by an endless algorithmic feed three years ago.",
      "You panic about societal collapse every morning and still refuse to drink a glass of water.\nYour retina's blue light exposure is the only thing keeping your consciousness alive.",
      "You've consumed 400 geopolitical take-threads today and haven't left your desk once.\nYou know more about internet micro-drama than about your own immediate family.",
    ],
  },
  Overthinker: {
    badges: [
      "Analysis Paralysis Archmage",
      "Draft Folder Hoarder",
      "Premature Optimizer",
      "Hyper-Rationalizer",
      "Notion Architect",
    ],
    roasts: [
      "You spent 6 hours designing an aesthetic Notion dashboard for a habit you quit in 2 days.\nEvery minor life decision requires a 14-page SWOT analysis and a panic nap.",
      "You have 48 unfinished Google Docs and a profound fear of hitting the 'publish' button.\nYou spend more time optimizing your morning routine than actually living your life.",
      "You mentally rehearse conversations with people you haven't spoken to since 2018.\nYour brain has 74 browser tabs open and 73 of them are playing unwanted audio.",
      "You bought three self-improvement books this month just to feel a fleeting sense of progress.\nYou think about starting a side hustle so hard that you convince yourself you're burnt out.",
    ],
  },
  "AI Maximalist": {
    badges: [
      "Prompt Jockey Prime",
      "Synthetic Nostalgia Merchant",
      "Wrapper Entrepreneur",
      "Singularity Clockwatcher",
      "GPU Beggar",
    ],
    roasts: [
      "You think stringing together 4 API calls to OpenAI makes you a deep tech founder.\nYour vision for humanity is replacing every meaningful human interaction with a 7B LLM.",
      "You add 'AI-powered' to everything from your resume to your grocery list.\nYou claim prompt engineering is the high art of the 21st century with a straight face.",
      "You preach that AGI will cure aging, but you can't get your Bluetooth headphones to pair.\nEvery email you compose smells distinctly like default temperature 0.7 output.",
      "You've got 15 subscriptions to AI wrappers that are all just forwarding prompts to Gemini.\nYou talk to neural weights more frequently than you talk to any living human being.",
    ],
  },
  "Crypto Native": {
    badges: [
      "Exit Liquidity Connoisseur",
      "Whitepaper Fundamentalist",
      "Discord Mod Veteran",
      "Diamond Hands Martyr",
      "Gas Fee Victim",
    ],
    roasts: [
      "You survived three market crashes just to brag about owning an SVG of an aggressive frog.\nYour portfolio graph looks like an electrocardiogram during a catastrophic heart attack.",
      "You say 'we are still early' while down 87% on a token named after a cartoon dog.\nYour hardware wallet has collected more physical dust than your gym membership card.",
      "You lecture rideshare drivers on decentralized consensus mechanisms when they just want peace.\nYou believe you're a financial sovereign, but you can't afford next month's studio rent.",
      "You've read 40 zero-knowledge whitepapers and still got phished by a fake Discord bot.\nYour net worth experiences more daily volatility than the global weather system.",
    ],
  },
};

const WEBSITE_FALLBACK_ROASTS: { badges: string[]; roasts: string[] } = {
  badges: [
    "Template Hoarder",
    "Tailwind Abuser",
    "Font Crime Perpetrator",
    "Hero Section Catastrophe",
    "Zero-Conversion Wonder",
  ],
  roasts: [
    "Your hero section takes 4 seconds to load just to display a blurry stock image and 'Welcome to our platform'.\nEven the bounce rate graph bounced off this page out of embarrassment.",
    "You have 4 different primary CTA buttons competing for survival like a battle royale.\nThe only user journey happening here is someone rushing to close the tab.",
    "Your testimonials section has photos that appear in 400 other WordPress templates.\nEven the dummy placeholder text had more personality than your value proposition.",
    "You slapped 'AI-Powered' across every headline, but your backend is just an unhandled Promise.\n100% visual cringe, 0% product-market fit.",
  ],
};

export async function generateRoast(
  input: GenerateRoastInput
): Promise<RoastResponse> {
  const cleanTarget = sanitizeText(input.username || "", { maxLength: 200 }) || (input.targetType === "website" ? "https://example.com" : "@target");
  const targetType = input.targetType || (cleanTarget.startsWith("http") || cleanTarget.includes(".") ? "website" : "handle");
  const vibe = sanitizeText(input.vibe || "Tech Bro", { maxLength: 60 });
  const cleanContext = sanitizeText(input.context || "", { maxLength: 500 });
  const roastMaster = input.roastMaster || "default";
  const apiKey = getGeminiApiKey(input.apiKey);

  // Compute deterministic hashes for fallback scores
  let hash = 0;
  const seed = `${cleanTarget.toLowerCase()}_${vibe}_${roastMaster}`;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const posHash = Math.abs(hash);

  const defaultVisualCringe = 72 + (posHash % 26);
  const defaultBounceProb = 75 + ((posHash * 3) % 23);
  const defaultTechDebt = 68 + ((posHash * 7) % 30);

  // 1. If Gemini API key is available, call live Gemini endpoint
  if (apiKey) {
    try {
      const personaInstruction = ROAST_MASTER_PROMPTS[roastMaster] || ROAST_MASTER_PROMPTS.default;
      const targetDescription = targetType === "website" ? `Website / Web App URL: ${cleanTarget}` : `Social Media Profile / Handle: ${cleanTarget}`;

      const prompt = `${personaInstruction}

You are delivering a roast on "The Hype Portal" (incorporating RoastMyWebsite and CreatorSaathi vibes).
${targetDescription}
Target Persona / Theme: ${vibe}
${cleanContext ? `Extra Context: ${cleanContext}` : ""}

RULES:
1. Stay true to the persona (${roastMaster}).
${targetType === "website" ? "- Roast their design, UX, fonts, pretentious hero headers, fake testimonials, unhandled promises, and terrible conversion rate." : "- Roast their bio, buzzwords, influencer posturing, and dopamine addiction."}
2. Return ONLY a valid JSON object matching this EXACT schema:
{
  "score": number, // integer 1 to 100 representing cringe/hyperbole level
  "badge": string, // funny archetype badge (e.g. 'Template Hoarder', 'Series-A Cosplayer', 'Overacting Ki Dukan', 'CSS Catastrophe')
  "roast": string, // savage, hilarious 2-line roast separated by \\n
  "visualCringe": number, // integer 50 to 99
  "bounceProbability": number, // integer 50 to 99
  "techDebtScore": number // integer 50 to 99
}
3. The roast MUST be 2 lines separated by \\n.
4. Do NOT wrap in markdown \`\`\`json. Return strictly JSON.`;

      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
      ];

      for (const model of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const response = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.95,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 500,
                responseMimeType: "application/json",
              },
            }),
            cache: "no-store",
          });

          if (response.ok) {
            const data = await response.json();
            const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (candidateText) {
              const cleanedJson = candidateText
                .replace(/```json/gi, "")
                .replace(/```/g, "")
                .trim();

              const parsed = JSON.parse(cleanedJson);

              if (typeof parsed.score === "number" && typeof parsed.roast === "string") {
                const lines = parsed.roast
                  .split("\n")
                  .map((l: string) => l.trim())
                  .filter(Boolean);
                const formattedRoast = lines.slice(0, 2).join("\n");

                return {
                  score: Math.min(100, Math.max(1, Math.round(parsed.score))),
                  badge: (parsed.badge || "Verified Cringe").trim(),
                  roast: formattedRoast,
                  visualCringe: typeof parsed.visualCringe === "number" ? parsed.visualCringe : defaultVisualCringe,
                  bounceProbability: typeof parsed.bounceProbability === "number" ? parsed.bounceProbability : defaultBounceProb,
                  techDebtScore: typeof parsed.techDebtScore === "number" ? parsed.techDebtScore : defaultTechDebt,
                  source: "gemini-1.5-flash",
                };
              }
            }
          }
        } catch {
          // Continue to next candidate
        }
      }
    } catch (err) {
      console.error("Gemini live call failed, falling back:", err);
    }
  }

  // 2. Intelligent, deterministic fallback generator
  const cfg = targetType === "website" ? WEBSITE_FALLBACK_ROASTS : (FALLBACK_ROASTS[vibe] || FALLBACK_ROASTS["Tech Bro"]);

  const badgeIndex = posHash % cfg.badges.length;
  const roastIndex = (posHash + 1) % cfg.roasts.length;
  const score = 70 + (posHash % 28);

  let finalRoast = cfg.roasts[roastIndex];

  // If a character roast master is selected in fallback mode, prepend character flair
  if (roastMaster === "ramsay") {
    finalRoast = `Gordon Ramsay: "IT'S RAW! Your design is an utter catastrophe."\n${finalRoast.split("\n")[1] || finalRoast}`;
  } else if (roastMaster === "majnu") {
    finalRoast = `Majnu Bhai: "Control Uday control... 50 rupya kaat overacting ka!"\n${finalRoast.split("\n")[1] || "Aisi presentation dekh kar meri aankhon me aasu aa gaye."}`;
  } else if (roastMaster === "shark") {
    finalRoast = `Desi Shark: "Bhai yeh sab doglapan hai, dhandha band kar do."\n${finalRoast.split("\n")[1] || "Zero revenue, 100% cringe valuation."}`;
  } else if (roastMaster === "seniordev") {
    finalRoast = `Senior Dev: "14 unminified scripts and 48 inline style tags found."\n${finalRoast.split("\n")[1] || "Please revert this commit and rethink your career."}`;
  }

  return {
    score,
    badge: cfg.badges[badgeIndex],
    roast: finalRoast,
    visualCringe: defaultVisualCringe,
    bounceProbability: defaultBounceProb,
    techDebtScore: defaultTechDebt,
    source: "neural-engine",
  };
}
