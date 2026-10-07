"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Flame,
  Sparkles,
  Share2,
  Download,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  Zap,
  ShieldAlert,
  Sliders,
  ExternalLink,
  Eye,
  User,
  Volume2,
  VolumeX,
  Key,
  Bot,
  Cpu,
  Globe,
  Laugh,
  AlertTriangle,
  Layers,
  ChefHat,
  Glasses,
  Briefcase,
  Laptop,
  Camera,
  Smartphone,
  Brain,
  Coins,
  Dices,
  AtSign,
} from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import {
  generateRoast,
  type TargetType,
  type RoastMaster,
} from "@/app/actions/generateRoast";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";
import Logo, { HypeIconMark } from "@/components/Logo";

export type VibeType =
  | "Tech Bro"
  | "Influencer"
  | "Doomscroller"
  | "Overthinker"
  | "AI Maximalist"
  | "Crypto Native";

export { type TargetType, type RoastMaster };

interface RoastResult {
  username: string;
  targetType?: TargetType;
  roastMaster?: RoastMaster;
  vibe: VibeType;
  score: number;
  archetype: string;
  roastLine1: string;
  roastLine2: string;
  cringeLevel: number;
  egoRatio: number;
  delusionIndex: number;
  visualCringe?: number;
  bounceProbability?: number;
  techDebtScore?: number;
  timestamp: string;
  id: string;
  source?: "gemini-1.5-flash" | "neural-engine";
}

export const ROAST_MASTERS: {
  id: RoastMaster;
  name: string;
  badge: string;
  quote: string;
  renderIcon: (className?: string) => React.ReactNode;
}[] = [
  {
    id: "default",
    name: "Savage AI",
    badge: "Gen-Z Savage",
    quote: "Ruthless algorithmic buzzword deconstruction",
    renderIcon: (className = "w-5 h-5") => <Flame className={className} />,
  },
  {
    id: "ramsay",
    name: "Gordon Ramsay",
    badge: "Hell's Kitchen",
    quote: "'IT'S RAW! A complete design disaster.'",
    renderIcon: (className = "w-5 h-5") => <ChefHat className={className} />,
  },
  {
    id: "majnu",
    name: "Majnu Bhai",
    badge: "Welcome Icon",
    quote: "'Control Uday... 50 rupya kaat overacting ka!'",
    renderIcon: (className = "w-5 h-5") => <Glasses className={className} />,
  },
  {
    id: "shark",
    name: "Desi Shark",
    badge: "Shark Tank",
    quote: "'Yeh sab doglapan hai! Dhandha band kar do.'",
    renderIcon: (className = "w-5 h-5") => <Briefcase className={className} />,
  },
  {
    id: "seniordev",
    name: "10x Senior Dev",
    badge: "Tech Lead",
    quote: "'Inline CSS, bloated JS & zero PMF.'",
    renderIcon: (className = "w-5 h-5") => <Terminal className={className} />,
  },
];

const VIBE_CONFIG: Record<
  VibeType,
  {
    renderIcon: (className?: string) => React.ReactNode;
    accent: string;
    borderGlow: string;
    archetypes: string[];
    roasts: [string, string][];
  }
> = {
  "Tech Bro": {
    renderIcon: (className = "w-4 h-4") => <Laptop className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Delusional Visionary",
      "Cold Brew Evangelist",
      "Sub-Scale Disruptor",
      "Vest-Wearing NPC",
    ],
    roasts: [
      [
        "You brag about 'scaling horizontally' when you can't even scale your sleep past 4 hours.",
        "Your pitch deck has 47 mentions of 'paradigm shift' and zero paying customers.",
      ],
      [
        "You wear a fleece vest in 80-degree weather just to look like series-A material.",
        "Your entire personality is an unedited audio transcript of the All-In podcast.",
      ],
      [
        "You put 'AI Agentic Orchestrator' in your bio before writing a single line of working code.",
        "Your company's burn rate is significantly higher than your daily active user count.",
      ],
      [
        "You claim you're 'building in public' to disguise the fact that nobody is buying.",
        "Your LinkedIn posts always start with 'I was rejected 30 times, here is what it taught me.'",
      ],
    ],
  },
  Influencer: {
    renderIcon: (className = "w-4 h-4") => <Camera className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Aesthetic NPC",
      "Algorithm Hostage",
      "Engagement Baiter",
      "Micro-Celebrity In Denial",
    ],
    roasts: [
      [
        "You spent 45 minutes color-grading a cup of lukewarm oat milk for 120 likes.",
        "Your authenticity is as heavily filtered as your front-facing ring light reflections.",
      ],
      [
        "You start every TikTok video with 'A lot of you have been asking'—literally nobody asked.",
        "Your most profound intimate relationship is with the Instagram algorithm.",
      ],
      [
        "You describe posting a gym selfie as 'holding space and inspiring collective growth'.",
        "Your entire net worth is tied up in unopened PR boxes and affiliate promo codes.",
      ],
      [
        "You've rewritten your 150-character bio 12 times this week seeking spiritual clarity.",
        "You measure your personal self-worth strictly in reel retention drop-off graphs.",
      ],
    ],
  },
  Doomscroller: {
    renderIcon: (className = "w-4 h-4") => <Smartphone className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Certified Chaos Agent",
      "Overclocked Brainrot Analyst",
      "Apocalypse Spectator",
      "Midnight Timeline Ghoul",
    ],
    roasts: [
      [
        "Your weekly screen time report could be classified as an interactive modern art tragedy.",
        "You have a PhD in existential dread and an unread email count well into the five figures.",
      ],
      [
        "You refresh the timeline at 3 AM hoping for global collapse just to feel something.",
        "Your circadian rhythm was replaced by an endless algorithmic feed three years ago.",
      ],
      [
        "You panic about societal collapse every morning and still refuse to drink a glass of water.",
        "Your retina's blue light exposure is the only thing keeping your consciousness alive.",
      ],
      [
        "You've consumed 400 geopolitical take-threads today and haven't left your chair once.",
        "You know more about internet micro-drama than about your own immediate family.",
      ],
    ],
  },
  Overthinker: {
    renderIcon: (className = "w-4 h-4") => <Brain className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Analysis Paralysis Archmage",
      "Draft Folder Hoarder",
      "Premature Optimizer",
      "Hyper-Rationalizer",
    ],
    roasts: [
      [
        "You've spent three weeks drafting a two-sentence reply that you'll inevitably delete.",
        "Your decision-making tree has more branching complexity than an entire deciduous forest.",
      ],
      [
        "You simulate 14 catastrophic timelines before deciding which sandwich to order for lunch.",
        "Your brain currently has 94 tabs open and all of them are playing dissonant horror music.",
      ],
      [
        "You created a 6-page Notion workspace to plan how you will organize your weekend.",
        "Monday morning arrived before you even checked off step one of the preparation phase.",
      ],
      [
        "You over-analyze the tone of a thumbs-up emoji for four straight business days.",
        "You haven't committed to a side project since 2022 because 'the architecture isn't pure.'",
      ],
    ],
  },
  "AI Maximalist": {
    renderIcon: (className = "w-4 h-4") => <Bot className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Prompt Whisperer",
      "Synthetic Sentience Simp",
      "Token Burner Elite",
      "Singularity Cultist",
    ],
    roasts: [
      [
        "You ask Claude to rewrite your morning grocery list in Hemingway style to feel efficient.",
        "Your job was automated six months ago, you just haven't realized it yet.",
      ],
      [
        "You call yourself a 'Prompt Architect' because you learned how to type 'make it punchy'.",
        "Your local GPU setup generates more raw heat than your actual real-world output.",
      ],
      [
        "You preach that AGI will cure aging, but you can't get your Bluetooth headphones to pair.",
        "Every email you compose smells distinctly like default temperature 0.7 output.",
      ],
      [
        "You've got 15 subscriptions to AI wrappers that are all just forwarding requests to GPT-4o.",
        "You talk to neural weights more frequently than you talk to any living human being.",
      ],
    ],
  },
  "Crypto Native": {
    renderIcon: (className = "w-4 h-4") => <Coins className={className} />,
    accent: "from-[#F97316] to-[#F59E0B]",
    borderGlow: "border-[#F97316]/30",
    archetypes: [
      "Exit Liquidity Connoisseur",
      "Whitepaper Fundamentalist",
      "Discord Mod Veteran",
      "Diamond Hands Martyr",
    ],
    roasts: [
      [
        "You survived three market crashes just to brag about owning an SVG of an aggressive frog.",
        "Your portfolio graph looks like an electrocardiogram during a catastrophic heart attack.",
      ],
      [
        "You say 'we are still early' while down 87% on a token named after a cartoon dog.",
        "Your hardware wallet has collected more physical dust than your gym membership card.",
      ],
      [
        "You lecture rideshare drivers on decentralized consensus mechanisms when they just want peace.",
        "You believe you're a financial sovereign, but you can't afford next month's studio rent.",
      ],
      [
        "You've read 40 zero-knowledge whitepapers and still got phished by a fake Discord bot.",
        "Your net worth experiences more daily volatility than the global weather system.",
      ],
    ],
  },
};

const SUGGESTED_HANDLES = [
  "@i_msbella",
  "@techfounder",
  "@ai_futurist",
  "@growth_hacker",
  "@crypto_whale",
  "@aesthetic_queen",
];

const SUGGESTED_WEBSITES = [
  "https://myportfolio-vibe.dev",
  "https://supersaas-ai.com",
  "https://cryptomoon-defi.io",
  "https://agency-hypergrowth.in",
  "https://disrupt-everything.co",
];

const DYNAMIC_INITIAL_ROASTS: RoastResult[] = [
  {
    username: "@techfounder_alex",
    targetType: "handle",
    roastMaster: "default",
    vibe: "Tech Bro",
    score: 93,
    archetype: "Delusional Disruptor",
    roastLine1: "Your pitch deck has 47 mentions of 'paradigm shift' and exactly zero paying customers.",
    roastLine2: "You brag about scaling horizontally when you can't even scale your sleep past 4 hours.",
    cringeLevel: 94,
    egoRatio: 96,
    delusionIndex: 91,
    visualCringe: 88,
    bounceProbability: 92,
    techDebtScore: 85,
    timestamp: "Just now",
    id: "ROAST-TECH-01",
  },
  {
    username: "@prompt_whisperer_99",
    targetType: "handle",
    roastMaster: "default",
    vibe: "AI Maximalist",
    score: 91,
    archetype: "Token Burner Elite",
    roastLine1: "You put 'Chief AI Orchestrator' in your bio after copying 3 markdown templates from GitHub.",
    roastLine2: "Every email you compose smells distinctly like default temperature 0.7 output.",
    cringeLevel: 92,
    egoRatio: 88,
    delusionIndex: 95,
    visualCringe: 90,
    bounceProbability: 86,
    techDebtScore: 94,
    timestamp: "Just now",
    id: "ROAST-AI-02",
  },
  {
    username: "https://supersaas-ai.com",
    targetType: "website",
    roastMaster: "ramsay",
    vibe: "Tech Bro",
    score: 96,
    archetype: "Template Hoarder",
    roastLine1: "Gordon Ramsay: 'IT'S RAW! Your hero section takes 4 seconds to load a blurry template image.'",
    roastLine2: "Even the bounce rate graph bounced off this page out of sheer second-hand embarrassment.",
    cringeLevel: 96,
    egoRatio: 90,
    delusionIndex: 94,
    visualCringe: 97,
    bounceProbability: 95,
    techDebtScore: 89,
    timestamp: "Just now",
    id: "ROAST-WEB-03",
  },
  {
    username: "@desi_startup_bhai",
    targetType: "handle",
    roastMaster: "majnu",
    vibe: "Tech Bro",
    score: 92,
    archetype: "Jugaad Unicorn Founder",
    roastLine1: "Majnu Bhai: 'Control Uday control... 50 rupya kaat overacting ka!'",
    roastLine2: "Website pe 'Multi-Agent AI' likha hai, backend me 4 interns Google Sheets bhar rahe hain.",
    cringeLevel: 91,
    egoRatio: 95,
    delusionIndex: 93,
    visualCringe: 89,
    bounceProbability: 90,
    techDebtScore: 92,
    timestamp: "Just now",
    id: "ROAST-DESI-04",
  },
  {
    username: "https://myportfolio-vibe.dev",
    targetType: "website",
    roastMaster: "seniordev",
    vibe: "Overthinker",
    score: 94,
    archetype: "CSS Catastrophe",
    roastLine1: "Senior Dev: 'Found 14 unminified script bundles, 6 parallax scroll libraries and 0 customers.'",
    roastLine2: "You spent 4 weeks tuning a custom cursor while your contact form 500-errors on submit.",
    cringeLevel: 93,
    egoRatio: 87,
    delusionIndex: 96,
    visualCringe: 94,
    bounceProbability: 91,
    techDebtScore: 98,
    timestamp: "Just now",
    id: "ROAST-DEV-05",
  },
];

const INITIAL_ROAST: RoastResult = DYNAMIC_INITIAL_ROASTS[0];

export default function RoastEngine() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [targetType, setTargetType] = useState<TargetType>("handle");
  const [roastMaster, setRoastMaster] = useState<RoastMaster>("default");
  const [username, setUsername] = useState(INITIAL_ROAST.username);
  const [selectedVibe, setSelectedVibe] = useState<VibeType>(INITIAL_ROAST.vibe);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [result, setResult] = useState<RoastResult | null>(INITIAL_ROAST);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showStoryPreview, setShowStoryPreview] = useState(false);

  // Audio and Typewriter animation states
  const [isMuted, setIsMuted] = useState(false);
  const [displayedRoast1, setDisplayedRoast1] = useState(INITIAL_ROAST.roastLine1);
  const [displayedRoast2, setDisplayedRoast2] = useState(INITIAL_ROAST.roastLine2);
  const [isTyping, setIsTyping] = useState(false);
  const typewriterRef = useRef<{
    line1Timer?: ReturnType<typeof setInterval>;
    line2Timer?: ReturnType<typeof setInterval>;
  }>({});

  // Optional custom API Key state
  const [customApiKey, setCustomApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  // Hidden offscreen card ref for 9:16 export
  const exportCardRef = useRef<HTMLDivElement>(null);
  // Visible inline preview card ref (can also be exported)
  const inlineCardRef = useRef<HTMLDivElement>(null);

  // Read URL query params or Pick Random Roast on mount / refresh
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const targetParam = params.get("target");
      const vibeParam = params.get("vibe") as VibeType;

      if (targetParam) {
        setUsername(targetParam.startsWith("@") ? targetParam : `@${targetParam}`);
        if (vibeParam && VIBE_CONFIG[vibeParam]) {
          setSelectedVibe(vibeParam);
        }
      } else {
        // Automatic random roast on every fresh page load / refresh
        const randomIndex = Math.floor(Math.random() * DYNAMIC_INITIAL_ROASTS.length);
        const randomItem = DYNAMIC_INITIAL_ROASTS[randomIndex];
        setUsername(randomItem.username);
        setSelectedVibe(randomItem.vibe);
        setResult(randomItem);
        setDisplayedRoast1(randomItem.roastLine1);
        setDisplayedRoast2(randomItem.roastLine2);
      }
    }
  }, []);

  // Typewriter animation controller with synchronized audio clicks
  const startTypewriter = useCallback((line1: string, line2: string) => {
    if (typewriterRef.current.line1Timer) clearInterval(typewriterRef.current.line1Timer);
    if (typewriterRef.current.line2Timer) clearInterval(typewriterRef.current.line2Timer);

    setIsTyping(true);
    setDisplayedRoast1("");
    setDisplayedRoast2("");

    let i = 0;
    const speed = 18; // ms per character

    typewriterRef.current.line1Timer = setInterval(() => {
      if (i < line1.length) {
        setDisplayedRoast1(line1.slice(0, i + 1));
        if (i % 3 === 0) {
          sound.playTypewriterClick();
        }
        i++;
      } else {
        if (typewriterRef.current.line1Timer) clearInterval(typewriterRef.current.line1Timer);

        // Pause slightly before line 2
        setTimeout(() => {
          let j = 0;
          typewriterRef.current.line2Timer = setInterval(() => {
            if (j < line2.length) {
              setDisplayedRoast2(line2.slice(0, j + 1));
              if (j % 3 === 0) {
                sound.playTypewriterClick();
              }
              j++;
            } else {
              if (typewriterRef.current.line2Timer) clearInterval(typewriterRef.current.line2Timer);
              setIsTyping(false);
              sound.playSuccessChime();

              // Trigger Confetti effect on completion
              try {
                confetti({
                  particleCount: 80,
                  spread: 80,
                  origin: { y: 0.65 },
                  colors: ["#F97316", "#F59E0B", "#1E293B", "#FFFFFF"],
                  disableForReducedMotion: true,
                });
              } catch (e) {
                console.warn("Confetti warning:", e);
              }
            }
          }, speed);
        }, 130);
      }
    }, speed);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    const currentRef = typewriterRef.current;
    return () => {
      if (currentRef.line1Timer) clearInterval(currentRef.line1Timer);
      if (currentRef.line2Timer) clearInterval(currentRef.line2Timer);
    };
  }, []);

  // Live AI Roast generator connecting to Gemini 1.5 Flash Server Action
  const handleGenerateRoast = async () => {
    if (!username.trim() || isGenerating) return;

    sound.playPulse();
    setIsGenerating(true);
    setProgressStep(1);
    setDisplayedRoast1("");
    setDisplayedRoast2("");

    const stepsTimer1 = setTimeout(() => {
      setProgressStep(2);
      sound.playTypewriterClick();
    }, 450);
    const stepsTimer2 = setTimeout(() => {
      setProgressStep(3);
      sound.playTypewriterClick();
    }, 900);

    try {
      const cleanName = username.trim();

      // Call Gemini 1.5 Flash Server Action with targetType & roastMaster
      const aiResponse = await generateRoast({
        username: cleanName,
        targetType,
        roastMaster,
        vibe: selectedVibe,
        apiKey: customApiKey.trim() || undefined,
      });

      clearTimeout(stepsTimer1);
      clearTimeout(stepsTimer2);

      // Split into 2 punchy lines
      const rawLines = (aiResponse.roast || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      const line1 = rawLines[0] || aiResponse.roast;
      const line2 = rawLines.slice(1).join(" ") || "";

      let hash = 0;
      for (let i = 0; i < cleanName.length; i++) {
        hash = (hash << 5) - hash + cleanName.charCodeAt(i);
        hash |= 0;
      }
      const positiveHash = Math.abs(hash);

      const cringeLevel = 70 + ((positiveHash * 7) % 29);
      const egoRatio = 60 + ((positiveHash * 13) % 39);
      const delusionIndex = 65 + ((positiveHash * 17) % 34);

      const newResult: RoastResult = {
        username: cleanName,
        targetType,
        roastMaster,
        vibe: selectedVibe,
        score: aiResponse.score,
        archetype: aiResponse.badge,
        roastLine1: line1,
        roastLine2: line2,
        cringeLevel,
        egoRatio,
        delusionIndex,
        visualCringe: aiResponse.visualCringe || 85,
        bounceProbability: aiResponse.bounceProbability || 91,
        techDebtScore: aiResponse.techDebtScore || 84,
        timestamp: "Just Now",
        id: `ROAST-${positiveHash.toString(16).toUpperCase().slice(0, 6)}`,
        source: aiResponse.source,
      };

      setResult(newResult);
      setIsGenerating(false);
      setProgressStep(0);

      // Trigger Typewriter Animation
      startTypewriter(line1, line2);
    } catch (err) {
      console.error("Live roast generation failed:", err);
      setIsGenerating(false);
      setProgressStep(0);
    }
  };

  // Export 9:16 Social Story Card as PNG with success chime
  const handleDownloadStoryCard = async () => {
    sound.playVoteClick();
    const targetEl = exportCardRef.current || inlineCardRef.current;
    if (!targetEl) return;

    setIsExporting(true);
    try {
      const dataUrl = await toPng(targetEl, {
        cacheBust: true,
        pixelRatio: 2.5,
        quality: 0.98,
        backgroundColor: "#090a0f",
      });

      const cleanFilename = (result?.username || "target").replace(/[^a-zA-Z0-9]/g, "");
      const link = document.createElement("a");
      link.download = `hype-roast-${cleanFilename || "target"}.png`;
      link.href = dataUrl;
      link.click();

      // Micro-interaction: success chime on card download
      sound.playSuccessChime();
    } catch (err) {
      console.error("Story Card export failed:", err);
      alert("Failed to export image. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // Copy shareable link to clipboard (with dynamic OG preview query params)
  const handleCopyShareLink = () => {
    if (!result) return;
    sound.playVoteClick();

    const url = new URL(window.location.origin);
    url.searchParams.set("target", result.username.replace("@", ""));
    url.searchParams.set("vibe", result.vibe);
    url.searchParams.set("score", result.score.toString());
    url.searchParams.set("badge", result.archetype);

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const rollRandomRoast = () => {
    sound.playVoteClick();
    const filtered = DYNAMIC_INITIAL_ROASTS.filter(r => r.username !== username);
    const picked = filtered[Math.floor(Math.random() * filtered.length)] || DYNAMIC_INITIAL_ROASTS[0];
    setUsername(picked.username);
    setSelectedVibe(picked.vibe);
    setResult(picked);
    startTypewriter(picked.roastLine1, picked.roastLine2);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* Interactive Control Panel                                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {/* Top Control Bar: Audio Mute, Random Roast Roll & Gemini Key Configuration */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 text-xs font-mono text-gray-400">
          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Roll Random Roast Button */}
            <button
              type="button"
              onClick={rollRandomRoast}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-[#F97316]/40 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] font-medium transition cursor-pointer shadow-sm hover:scale-105"
              title="Roll another random viral roast"
            >
              <Dices className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{isHi ? "रैंडम रोस्ट रोल करें" : "Roll Random Roast"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                sound.setMuted(nextMuted);
              }}
              title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)] transition cursor-pointer"
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
                  <span className="text-[11px] text-[var(--muted-foreground)]">{isHi ? "ध्वनि: बंद" : "Sound: Off"}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#F97316]" />
                  <span className="text-[11px] text-[#F97316]">{isHi ? "ध्वनि: चालू" : "Sound: On"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[#F97316]/40 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
            >
              <Key className="w-3 h-3 text-[#F97316]" />
              <span className="text-[11px]">
                {showApiKeyInput
                  ? isHi ? "एपीआई की छुपाएं" : "Hide API Key"
                  : isHi ? "कस्टम जेमिनी की" : "Custom Gemini Key"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted-foreground)]">
            <Bot className="w-3.5 h-3.5 text-[#F97316]" />
            <span>Gemini 1.5 Flash</span>
          </div>
        </div>

        {/* Expandable Custom API Key drawer */}
        {showApiKeyInput && (
          <div className="p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[var(--foreground)] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F97316]" />
                Live Google Gen AI Integration
              </span>
              <span className="text-[var(--muted-foreground)]">Environment key active by default</span>
            </div>
            <input
              type="password"
              value={customApiKey}
              onChange={(e) => setCustomApiKey(e.target.value)}
              placeholder="Paste custom GEMINI_API_KEY (optional, overrides default)..."
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[#F97316] font-mono"
            />
          </div>
        )}

        {/* Target Type Selector & Roast Master Character Picker (RoastMyWebsite + CreatorSaathi) */}
        <div className="space-y-3.5 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-xs font-mono text-[var(--foreground)] font-bold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#F97316]" />
              {isHi ? "ऑडिट मोड:" : "Audit Mode:"}
            </span>

            {/* Target Type Pill Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setTargetType("handle");
                  if (username.startsWith("http")) setUsername("@techfounder");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer font-bold ${
                  targetType === "handle"
                    ? "bg-[#F97316] text-white shadow-sm shadow-[#F97316]/25"
                    : "text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface)]"
                }`}
              >
                <AtSign className="w-3.5 h-3.5" />
                <span>{isHi ? "सोशल हैंडल" : "Social Handle"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setTargetType("website");
                  if (username.startsWith("@")) setUsername("https://supersaas-ai.com");
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer font-bold ${
                  targetType === "website"
                    ? "bg-[#F97316] text-white shadow-sm shadow-[#F97316]/25"
                    : "text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface)]"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{isHi ? "वेबसाइट / सास URL" : "Website / SaaS URL"}</span>
              </button>
            </div>
          </div>

          {/* Character Roast Masters (RoastMyWebsite Feature) */}
          <div className="pt-1">
            <label className="flex items-center justify-between text-[11px] font-mono text-[var(--foreground)] mb-2.5">
              <span className="flex items-center gap-1.5 text-[var(--foreground)] font-bold">
                <Laugh className="w-3.5 h-3.5 text-[#F97316]" />
                {isHi ? "रोस्ट मास्टर कैरेक्टर चुनें:" : "Select Character Roast Master:"}
              </span>
              <span className="text-[10px] text-[#F97316] font-mono font-medium truncate max-w-[280px]">
                {ROAST_MASTERS.find((m) => m.id === roastMaster)?.quote}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {ROAST_MASTERS.map((m) => {
                const isSelected = roastMaster === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sound.playVoteClick();
                      setRoastMaster(m.id);
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer group relative ${
                      isSelected
                        ? "border-2 border-[#F97316] bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 shadow-md shadow-[#F97316]/15 ring-2 ring-[#F97316]/20 scale-[1.02]"
                        : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#F97316]/50 hover:bg-[#FFF7ED]/30 [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 hover:text-[var(--foreground)]"
                    }`}
                  >
                    <div
                      className={`p-2.5 rounded-xl mb-1.5 transition-all ${
                        isSelected
                          ? "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-sm shadow-[#F97316]/30"
                          : "bg-[var(--surface)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] group-hover:text-[#F97316] group-hover:scale-110"
                      }`}
                    >
                      {m.renderIcon("w-5 h-5")}
                    </div>
                    <span className={`font-bold text-xs truncate max-w-full ${
                      isSelected ? "text-[#F97316] [html[data-theme='dark']_&]:text-white font-extrabold" : "text-[var(--foreground)]"
                    }`}>
                      {m.name}
                    </span>
                    <span className={`text-[10px] font-mono truncate max-w-full font-semibold ${
                      isSelected ? "text-[#EA580C] [html[data-theme='dark']_&]:text-[#FDBA74]" : "text-[var(--muted-foreground)]"
                    }`}>
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Username / Target URL Input */}
        <div>
          <label className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] mb-2">
            <span className="flex items-center gap-1.5 text-[var(--foreground)]">
              {targetType === "website" ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-[#F97316]" />
                  {isHi ? "टारगेट वेबसाइट / सास / पोर्टफोलियो URL" : "Target Website / SaaS / Portfolio URL"}
                </>
              ) : (
                <>
                  <AtSign className="w-3.5 h-3.5 text-[#F97316]" />
                  {isHi ? "टारगेट सोशल हैंडल (X / Instagram / TikTok)" : "Target Social Handle (X / Instagram / TikTok)"}
                </>
              )}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)]">
              {isHi ? "तीखापन: अधिकतम व्यंग्य" : "Intensity: Maximum Sarcasm"}
            </span>
          </label>
          <div className="relative flex items-center rounded-xl bg-[var(--card-bg)] border border-[var(--border)] focus-within:border-[#F97316] focus-within:ring-2 focus-within:ring-[#F97316]/20 transition group">
            <div className="pl-3.5 pr-1 text-[var(--muted-foreground)] font-mono text-xs select-none flex items-center">
              {targetType === "website" ? (
                <Globe className="w-3.5 h-3.5 text-[#F97316]" />
              ) : (
                <AtSign className="w-3.5 h-3.5 text-[#F97316]" />
              )}
            </div>
            <input
              type="text"
              value={
                targetType === "website"
                  ? username
                  : username.startsWith("@")
                  ? username.slice(1)
                  : username
              }
              onChange={(e) => {
                const val = e.target.value;
                if (targetType === "website") {
                  setUsername(val);
                } else {
                  setUsername(`@${val.replace(/^@/, "")}`);
                }
              }}
              placeholder={
                targetType === "website"
                  ? isHi
                    ? "https://supersaas-ai.com या yourportfolio.dev"
                    : "https://supersaas-ai.com or yourportfolio.dev"
                  : isHi
                  ? "techfounder या सोशल यूजरनेम"
                  : "i_msbella or techfounder"
              }
              className="w-full bg-transparent py-2.5 pr-4 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none font-mono"
            />
            {username && (
              <button
                type="button"
                onClick={() => setUsername("")}
                className="pr-3 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                {isHi ? "हटाएं" : "Clear"}
              </button>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] font-mono text-[var(--muted-foreground)] mr-1">{isHi ? "सुझाव:" : "Quick:"}</span>
            {(targetType === "website" ? SUGGESTED_WEBSITES : SUGGESTED_HANDLES).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setUsername(item);
                }}
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition cursor-pointer truncate max-w-[200px] ${
                  username === item
                    ? "bg-[#F97316]/15 border-[#F97316]/40 text-[#F97316] font-semibold"
                    : "bg-[var(--surface)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[#F97316]/40"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Vibe Selection Grid */}
        <div>
          <label className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] mb-2">
            <span className="flex items-center gap-1.5 text-[var(--foreground)]">
              <Sliders className="w-3.5 h-3.5 text-[#F97316]" />
              {isHi ? "टारगेट व्यक्तित्व और वाइब शैली" : "Target Archetype & Persona Vibe"}
            </span>
            <span className="text-[10px] font-mono text-[#F97316]">
              {isHi ? "सक्रिय:" : "Active:"} {selectedVibe}
            </span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {(Object.keys(VIBE_CONFIG) as VibeType[]).map((vibe) => {
              const cfg = VIBE_CONFIG[vibe];
              const isSelected = selectedVibe === vibe;
              return (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setSelectedVibe(vibe);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#F97316] bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[var(--foreground)] shadow-sm ring-1 ring-[#F97316]/30 font-bold scale-[1.01]"
                      : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#F97316]/50 hover:bg-[#FFF7ED]/30 [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 hover:text-[var(--foreground)]"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all ${
                      isSelected
                        ? "bg-gradient-to-br from-[#F97316] to-[#F59E0B] text-white shadow-sm"
                        : "bg-[var(--surface)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] group-hover:text-[#F97316]"
                    }`}
                  >
                    {cfg.renderIcon("w-4 h-4")}
                  </div>
                  <div className="truncate">
                    <div className={`font-bold truncate ${isSelected ? "text-[#F97316] [html[data-theme='dark']_&]:text-white font-extrabold" : "text-[var(--foreground)]"}`}>
                      {vibe}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generate Button / Progress Bar */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating || !username.trim()}
            onClick={handleGenerateRoast}
            className="w-full relative group overflow-hidden rounded-xl p-[1px] font-semibold text-white focus:outline-none focus:ring-2 focus:ring-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#F97316] via-[#F59E0B] to-[#F97316] rounded-xl group-hover:opacity-100 transition duration-300 opacity-95" />
            <div className="relative px-6 py-3 rounded-[11px] bg-[#F97316] group-hover:bg-[#EA580C] transition flex items-center justify-center gap-2 text-sm text-white font-medium shadow-md">
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  <span className="font-mono text-white">
                    {progressStep === 1 &&
                      (targetType === "website"
                        ? "Scanning DOM tree & responsive layout..."
                        : "Connecting to Gemini 1.5 Flash...")}
                    {progressStep === 2 &&
                      (targetType === "website"
                        ? "Auditing font crimes & fake testimonials..."
                        : "Deconstructing Viral Buzzwords...")}
                    {progressStep === 3 &&
                      (targetType === "website"
                        ? `Consulting ${ROAST_MASTERS.find((m) => m.id === roastMaster)?.name}...`
                        : "Synthesizing Emotional Damage...")}
                  </span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4 text-white group-hover:scale-110 transition" />
                  <span className="tracking-wide">
                    {targetType === "website"
                      ? isHi
                        ? `वेबसाइट रोस्ट करें (${ROAST_MASTERS.find((m) => m.id === roastMaster)?.name})`
                        : `Roast Website as ${ROAST_MASTERS.find((m) => m.id === roastMaster)?.name}`
                      : isHi
                      ? `विश्लेषण करें और रोस्ट करें (${username || "टारगेट"})`
                      : `Evaluate & Roast ${username || "Target"}`}
                  </span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* High-Tech Loading Skeleton Display (Active during AI Inference)           */}
      {/* ========================================================================= */}
      {isGenerating && (
        <div className="space-y-4 pt-2 border-t border-[var(--border)] animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F97316]"></span>
              </span>
              <span className="text-xs font-mono text-[var(--foreground)] font-bold uppercase tracking-wider">
                Live Gemini 1.5 Inference Pipeline
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#F97316] px-2.5 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] animate-pulse">
              {progressStep === 1 && "Connecting to Gemini 1.5 Flash..."}
              {progressStep === 2 && "Analyzing Buzzword Density..."}
              {progressStep === 3 && "Synthesizing Emotional Damage..."}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-6 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] animate-pulse flex items-center justify-center border border-[var(--border)]">
                <RefreshCw className="w-6 h-6 text-[#F97316] animate-spin" />
              </div>
              <div className="h-4 w-20 bg-[var(--surface)] rounded-md mt-3 animate-pulse" />
              <div className="h-3 w-14 bg-[var(--surface)] rounded-md mt-2 animate-pulse" />
            </div>

            <div className="sm:col-span-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="h-3 w-28 bg-[var(--surface)] rounded-md animate-pulse" />
                <div className="h-6 w-48 bg-gradient-to-r from-[#F97316]/20 to-[#F59E0B]/20 rounded-md animate-pulse" />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[var(--border)]">
                <div className="h-8 bg-[var(--surface)] rounded-lg animate-pulse" />
                <div className="h-8 bg-[var(--surface)] rounded-lg animate-pulse" />
                <div className="h-8 bg-[var(--surface)] rounded-lg animate-pulse" />
              </div>
            </div>
          </div>

          <div className="rounded-xl p-5 bg-[var(--card-bg)] border border-[var(--border)] space-y-3 relative overflow-hidden">
            <div className="h-3 w-32 bg-[#F97316]/20 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-[var(--surface)] rounded animate-pulse" />
              <div className="h-4 w-4/5 bg-[#F97316]/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Live Result Display (With Typewriter Animation)                            */}
      {/* ========================================================================= */}
      {result && !isGenerating && (
        <div className="space-y-4 pt-2 border-t border-[var(--border)] animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#F97316] font-bold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                Vibe Report #{result.id}
              </span>
              {result.source === "gemini-1.5-flash" ? (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] font-semibold flex items-center gap-1">
                  <Bot className="w-3 h-3 text-[#F97316]" />
                  Gemini 1.5 Flash
                </span>
              ) : (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-[#F97316] font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Audit Verified
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setShowStoryPreview(!showStoryPreview);
              }}
              className="text-xs font-mono text-[#F97316] hover:text-[var(--foreground)] flex items-center gap-1 bg-[var(--surface)] px-2.5 py-1 rounded-lg border border-[var(--border)] transition cursor-pointer"
            >
              <Eye className="w-3 h-3" />
              {showStoryPreview
                ? isHi ? "स्टोरी कार्ड छुपाएं" : "Hide Story Card"
                : isHi ? "9:16 कार्ड देखें" : "Preview 9:16 Card"}
            </button>
          </div>

          {/* Vibe Score & Archetype Badge Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Score Meter */}
            <div className="sm:col-span-1 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-4 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
                {isHi ? "अतिशयोक्ति सूचकांक" : "Hyperbole Index"}
              </span>
              <div className="relative flex items-center justify-center my-1">
                <span className="text-4xl sm:text-5xl font-black text-[#F97316]">
                  {result.score}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] font-mono font-bold ml-1">
                  /100
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#F97316] px-2 py-0.5 rounded-full bg-[var(--surface)] border border-[var(--border)] mt-1">
                {isHi ? "गंभीर पर्दाफाश" : "CRITICAL EXPOSURE"}
              </span>
            </div>

            {/* Archetype & Target Summary */}
            <div className="sm:col-span-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] p-4 flex flex-col justify-between space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider">
                    {isHi ? "पहचाना गया व्यक्तित्व" : "Assigned Archetype"}
                  </span>
                  <div className="text-lg font-black text-[var(--foreground)] flex items-center gap-2 mt-0.5">
                    <span>
                      {result.archetype}
                    </span>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] flex items-center gap-1.5">
                  <span>{VIBE_CONFIG[result.vibe]?.renderIcon("w-3.5 h-3.5 text-[#F97316]")}</span>
                  <span>{result.vibe}</span>
                </div>
              </div>

              {/* Sub-Metrics Breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[var(--border)] text-[10px] font-mono">
                <div>
                  <div className="text-[var(--muted-foreground)]">{isHi ? "क्रिज:" : "Cringe:"}</div>
                  <div className="font-bold text-[#F97316]">{result.cringeLevel}%</div>
                </div>
                <div>
                  <div className="text-[var(--muted-foreground)]">{isHi ? "अहंकार:" : "Ego Ratio:"}</div>
                  <div className="font-bold text-[var(--foreground)]">{result.egoRatio}%</div>
                </div>
                <div>
                  <div className="text-[var(--muted-foreground)]">{isHi ? "भ्रम:" : "Delusion:"}</div>
                  <div className="font-bold text-[#F59E0B]">
                    {result.delusionIndex}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Roast Master & Design UX Cringe Scorecard (RoastMyWebsite Integration) */}
          <div className="rounded-xl p-4 bg-[var(--card-bg)] border border-[var(--border)] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-[var(--muted-foreground)]">{isHi ? "रोस्ट मास्टर:" : "Roast Master:"}</span>
                <span className="px-2.5 py-1 rounded-full bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316] font-bold flex items-center gap-1.5">
                  {ROAST_MASTERS.find((m) => m.id === (result.roastMaster || "default"))?.renderIcon("w-3.5 h-3.5")}
                  <span>
                    {ROAST_MASTERS.find((m) => m.id === (result.roastMaster || "default"))?.name}
                  </span>
                </span>
              </div>
              <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
                {result.targetType === "website" ? (
                  <>
                    <Globe className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{isHi ? "वेबसाइट यूएक्स ऑडिट" : "Website UX Audit"}</span>
                  </>
                ) : (
                  <>
                    <AtSign className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{isHi ? "सोशल बायो ऑडिट" : "Social Bio Audit"}</span>
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                  <span>{isHi ? "विजुअल क्रिज" : "Visual Cringe"}</span>
                  <span className="text-[#F97316] font-bold">{result.visualCringe || 84}%</span>
                </div>
                <div className="w-full bg-[var(--card-bg)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.visualCringe || 84}%` }}
                  />
                </div>
                <span className="text-[9px] text-[var(--muted-foreground)] block truncate">
                  {isHi ? "फॉन्ट व कलर डिज़ाइन गलतियां" : "Font & color crimes detected"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                  <span>{isHi ? "बाउंस संभावना" : "Bounce Probability"}</span>
                  <span className="text-[var(--foreground)] font-bold">{result.bounceProbability || 91}%</span>
                </div>
                <div className="w-full bg-[var(--card-bg)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.bounceProbability || 91}%` }}
                  />
                </div>
                <span className="text-[9px] text-[var(--muted-foreground)] block truncate">
                  {isHi ? "यूज़र्स 1.8 सेकंड में भाग जाते हैं" : "Users flee within 1.8s"}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[var(--muted-foreground)]">
                  <span>
                    {result.targetType === "website"
                      ? isHi ? "तकनीकी कर्ज इंडेक्स" : "Tech Debt Index"
                      : isHi ? "ओवरएक्टिंग स्तर" : "Overacting Level"}
                  </span>
                  <span className="text-[#F59E0B] font-bold">{result.techDebtScore || 82}%</span>
                </div>
                <div className="w-full bg-[var(--card-bg)] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F97316] to-[#F59E0B] h-full rounded-full transition-all duration-500"
                    style={{ width: `${result.techDebtScore || 82}%` }}
                  />
                </div>
                <span className="text-[9px] text-[var(--muted-foreground)] block truncate">
                  {result.targetType === "website" ? "Bloated JS & inline CSS" : "50 rupya overacting cut"}
                </span>
              </div>
            </div>
          </div>

          {/* Savage 2-line Roast Quote Box with Typewriter Animation */}
          <div className="relative rounded-xl p-5 bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-mono text-[#F97316] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Verdict for {result.username}</span>
              </div>
              {isTyping && (
                <span className="text-[10px] font-mono text-[var(--muted-foreground)] flex items-center gap-1 animate-pulse">
                  <Terminal className="w-3 h-3" />
                  Generating Typewriter Stream...
                </span>
              )}
            </div>
            <div className="space-y-1.5 font-sans min-h-[4rem]">
              <p className="text-sm sm:text-base font-semibold text-[var(--foreground)] italic leading-relaxed">
                &ldquo;{displayedRoast1 || result.roastLine1}&rdquo;
                {isTyping && !displayedRoast2 && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#F97316] animate-pulse align-middle" />
                )}
              </p>
              {(displayedRoast2 || !isTyping) && (
                <p className="text-sm sm:text-base font-semibold text-[#F97316] italic leading-relaxed">
                  &ldquo;{displayedRoast2 || result.roastLine2}&rdquo;
                  {isTyping && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-[#F97316] animate-pulse align-middle" />
                  )}
                </p>
              )}
            </div>
          </div>

          {/* Action Row: Export Story Card & Copy Link */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadStoryCard}
              className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-98 transition shadow-md shadow-[#F97316]/20 border-none cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>{isHi ? "1080x1920 स्टोरी तैयार हो रही है..." : "Generating 1080x1920 Story..."}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>{isHi ? "9:16 स्टोरी कार्ड डाउनलोड करें" : "Download Story Card"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyShareLink}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl text-[var(--foreground)] bg-transparent hover:bg-[var(--surface-hover)] active:scale-98 transition border border-[var(--border)] cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-[#F97316]" />
                  <span className="text-[#F97316]">{isHi ? "लिंक कॉपी हो गया!" : "Link Copied!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-[var(--muted-foreground)]" />
                  <span>{isHi ? "शेयर लिंक कॉपी करें" : "Copy Link & Roast a Friend"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleGenerateRoast}
              title="Re-roll roast"
              className="p-2.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[#F97316]/40 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* ===================================================================== */}
          {/* Interactive Story Card Preview (Toggled)                              */}
          {/* ===================================================================== */}
          {showStoryPreview && (
            <div className="pt-4 border-t border-[var(--border)] flex flex-col items-center justify-center space-y-3">
              <div className="flex items-center justify-between w-full max-w-[340px] text-xs font-mono text-[var(--muted-foreground)]">
                <span>9:16 Social Story Preview</span>
                <span className="text-[#F97316] font-semibold">1080 &times; 1920 Proportions</span>
              </div>

              {/* Visible Preview Render Element */}
              <div
                ref={inlineCardRef}
                className="w-full max-w-[340px] aspect-[9/16] rounded-2xl bg-[#0B1220] p-6 flex flex-col justify-between border-2 border-[#1E293B] shadow-2xl shadow-black/60 relative overflow-hidden text-white select-none"
              >
                {/* Background Subtle Ambients */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

                {/* Card Top: Branding */}
                <div className="relative z-10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-[#F97316]/50 flex items-center justify-center p-1 shadow-sm">
                        <HypeIconMark className="w-full h-full" isDark={true} />
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          suppressHydrationWarning
                          className={`font-black text-xs ${isHi ? "font-hindi font-bold text-sm tracking-normal" : "tracking-wider"} text-white`}
                        >
                          {isHi ? "हाइप" : "HYPE"}
                        </span>
                        <span
                          suppressHydrationWarning
                          className={`font-black text-xs ${isHi ? "font-hindi font-bold text-sm tracking-normal" : "tracking-wider"} text-[#F97316]`}
                        >
                          {isHi ? "पोर्टल" : "PORTAL"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#1E293B] border border-[#F97316]/40 text-white font-semibold">
                      LIVE ROAST
                    </span>
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[10px] font-mono text-[#CBD5E1]/70 uppercase tracking-widest">
                      OFFICIAL VIBE AUDIT
                    </span>
                    <h4 className="text-base font-bold text-white tracking-tight mt-0.5 truncate">
                      {result.username}
                    </h4>
                  </div>
                </div>

                {/* Card Middle: Score Meter & Archetype */}
                <div className="relative z-10 my-auto text-center space-y-3">
                  <div className="inline-block p-4 rounded-2xl bg-[#1E293B]/90 border border-[#334155]">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#F97316]">
                      HYPERBOLE SCORE
                    </div>
                    <div className="text-5xl font-black text-[#F97316] my-1">
                      {result.score}
                    </div>
                    <div className="text-[10px] font-mono text-[#CBD5E1] font-bold uppercase tracking-wider">
                      CRITICAL EXPOSURE
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono uppercase tracking-widest text-[#CBD5E1]/70">
                      CLASSIFICATION
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {result.archetype}
                    </div>
                  </div>

                  {/* Roast Quote Box */}
                  <div className="p-3.5 rounded-xl bg-[#1E293B] border border-[#334155] text-left space-y-1">
                    <p className="text-xs font-semibold text-[#CBD5E1] italic leading-snug">
                      &ldquo;{result.roastLine1}&rdquo;
                    </p>
                    <p className="text-xs font-semibold text-[#F97316] italic leading-snug">
                      &ldquo;{result.roastLine2}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card Footer: Watermark */}
                <div className="relative z-10 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[10px] font-mono text-[#CBD5E1]/60">
                  <span className="flex items-center gap-1.5 text-[#F97316] font-semibold">
                    <Sparkles className="w-3 h-3" />
                    PR Creations Lab.
                  </span>
                  
                  {/* HYPE Logo with Green Verified Badge */}
                  <div className="flex items-center gap-1.5">
                    <div className="relative flex items-center">
                      <div className="w-5 h-5 rounded-md bg-[#1E293B] border border-[#F97316]/50 flex items-center justify-center p-0.5 shadow-xs">
                        <HypeIconMark className="w-full h-full" isDark={true} />
                      </div>
                      {/* Green Verified Badge */}
                      <span
                        className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#0B1220] flex items-center justify-center text-white shadow-xs"
                        title="Verified"
                      >
                        <Check className="w-1.5 h-1.5 stroke-[3.5]" />
                      </span>
                    </div>
                    <span className="font-extrabold text-[11px] tracking-wider text-white">
                      HYPE
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Hidden Offscreen 1080x1920 Proportion Card for Ultra-Clean Export        */}
      {/* (Rendered off-screen with explicit layout so html-to-image never fails)   */}
      {/* ========================================================================= */}
      {result && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: "-9999px",
            top: "0px",
            width: "432px",
            height: "768px",
            zIndex: -999,
          }}
        >
          <div
            ref={exportCardRef}
            style={{
              width: "432px",
              height: "768px",
              backgroundColor: "#0B1220",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "36px 32px",
              color: "#FFFFFF",
              position: "relative",
              overflow: "hidden",
              border: "3px solid #1E293B",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {/* Ambient gradients */}
            <div
              style={{
                position: "absolute",
                top: "-40px",
                right: "-40px",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "rgba(249, 115, 22, 0.15)",
                filter: "blur(60px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-40px",
                left: "-40px",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                background: "rgba(245, 158, 11, 0.12)",
                filter: "blur(60px)",
              }}
            />

            {/* Header */}
            <div style={{ position: "relative", zIndex: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "38px",
                      height: "38px",
                      borderRadius: "10px",
                      backgroundColor: "#1E293B",
                      border: "1.5px solid rgba(249, 115, 22, 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                  >
                    <HypeIconMark className="w-full h-full" isDark={true} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: isHi ? "19px" : "17px",
                          letterSpacing: isHi ? "0px" : "1px",
                          color: "#FFFFFF",
                          fontFamily: isHi ? "var(--font-kalam), 'Kalam', cursive, sans-serif" : "inherit",
                        }}
                      >
                        {isHi ? "हाइप" : "HYPE"}
                      </span>
                      <span
                        style={{
                          fontWeight: 900,
                          fontSize: isHi ? "19px" : "17px",
                          letterSpacing: isHi ? "0px" : "1px",
                          color: "#F97316",
                          fontFamily: isHi ? "var(--font-kalam), 'Kalam', cursive, sans-serif" : "inherit",
                        }}
                      >
                        {isHi ? "पोर्टल" : "PORTAL"}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: isHi ? "10px" : "8.5px",
                        fontFamily: isHi ? "var(--font-kalam), 'Kalam', cursive, sans-serif" : "monospace",
                        letterSpacing: isHi ? "0.5px" : "2px",
                        color: "#94A3B8",
                        textTransform: isHi ? "none" : "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    padding: "4px 10px",
                    borderRadius: "9999px",
                    background: "#1E293B",
                    border: "1px solid #F97316",
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  OFFICIAL AUDIT
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    letterSpacing: "3px",
                    color: "#CBD5E1",
                    textTransform: "uppercase",
                  }}
                >
                  TARGET SOCIAL PROFILE
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    marginTop: "4px",
                  }}
                >
                  {result.username}
                </div>
              </div>
            </div>

            {/* Center Content */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Score Badge */}
              <div
                style={{
                  alignSelf: "center",
                  padding: "20px 36px",
                  borderRadius: "20px",
                  background: "#1E293B",
                  border: "1px solid #334155",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                    color: "#F97316",
                  }}
                >
                  HYPERBOLE INDEX
                </div>
                <div
                  style={{
                    fontSize: "64px",
                    fontWeight: 900,
                    lineHeight: 1,
                    margin: "10px 0",
                    color: "#F97316",
                  }}
                >
                  {result.score}
                  <span
                    style={{
                      fontSize: "20px",
                      color: "#CBD5E1",
                      marginLeft: "4px",
                    }}
                  >
                    /100
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    fontFamily: "monospace",
                    fontWeight: 800,
                    color: "#FFFFFF",
                  }}
                >
                  CRITICAL EXPOSURE
                </div>
              </div>

              {/* Archetype */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                    letterSpacing: "2px",
                    color: "#CBD5E1",
                  }}
                >
                  CLASSIFICATION
                </div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: 900,
                    color: "#FFFFFF",
                    marginTop: "4px",
                  }}
                >
                  {result.archetype}
                </div>
              </div>

              {/* Roast Box */}
              <div
                style={{
                  padding: "18px 20px",
                  borderRadius: "16px",
                  background: "#1E293B",
                  border: "1px solid #334155",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#CBD5E1",
                    fontStyle: "italic",
                    marginBottom: "8px",
                    lineHeight: "1.4",
                  }}
                >
                  &ldquo;{result.roastLine1}&rdquo;
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#F97316",
                    fontStyle: "italic",
                    lineHeight: "1.4",
                  }}
                >
                  &ldquo;{result.roastLine2}&rdquo;
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                position: "relative",
                zIndex: 10,
                borderTop: "1px solid #1E293B",
                paddingTop: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#CBD5E1",
              }}
            >
              <span style={{ color: "#F97316", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                PR Creations Lab.
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      backgroundColor: "#1E293B",
                      border: "1px solid rgba(249, 115, 22, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "2.5px",
                    }}
                  >
                    <HypeIconMark className="w-full h-full" isDark={true} />
                  </div>
                  {/* Green Verified Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-3px",
                      right: "-3px",
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      backgroundColor: "#10B981",
                      border: "1.5px solid #0B1220",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="6"
                      height="6"
                      stroke="white"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </div>
                <span style={{ fontWeight: 800, color: "#FFFFFF", letterSpacing: "1px" }}>
                  HYPE
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
