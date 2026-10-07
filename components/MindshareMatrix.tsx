"use client";

import React, { useState } from "react";
import {
  TrendingUp,
  Activity,
  Zap,
  ArrowUpRight,
  Flame,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Cpu,
} from "lucide-react";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";

interface MindshareItem {
  id: string;
  name: string;
  category: "Models" | "Dev Tools" | "Video/Image";
  velocity: string;
  velocityHi: string;
  velocityNum: number;
  bullishPct: number;
  description: string;
  descriptionHi: string;
  rank: number;
}

const MINDSHARE_DATA: MindshareItem[] = [
  {
    id: "ms-1",
    name: "DeepSeek-V3 / R1",
    category: "Models",
    velocity: "+184%",
    velocityHi: "+184% उछाल",
    velocityNum: 184,
    bullishPct: 88,
    description: "Open-weight reasoning matching frontier models at 1/10th inference cost.",
    descriptionHi: "ओपन-वेट रीजनिंग मॉडल जो मात्र 1/10वीं लागत में फ्रंटियर मॉडल्स की बराबरी कर रहा है।",
    rank: 1,
  },
  {
    id: "ms-2",
    name: "Claude 3.7 Sonnet Hybrid",
    category: "Models",
    velocity: "+112%",
    velocityHi: "+112% उछाल",
    velocityNum: 112,
    bullishPct: 94,
    description: "Dynamic reasoning tokens setting the undisputed gold standard for coding agents.",
    descriptionHi: "डायनामिक रीजनिंग टोकन्स जो कोडिंग एजेंट्स के लिए नया पैमाना स्थापित कर रहे हैं।",
    rank: 2,
  },
  {
    id: "ms-3",
    name: "Cursor AI & Composer",
    category: "Dev Tools",
    velocity: "+78%",
    velocityHi: "+78% उछाल",
    velocityNum: 78,
    bullishPct: 86,
    description: "Multi-file diff automation redefining the modern software engineering loop.",
    descriptionHi: "मल्टी-फाइल डिफ ऑटोमेशन आधुनिक सॉफ्टवेयर इंजीनियरिंग के तरीके को बदल रहा है।",
    rank: 3,
  },
  {
    id: "ms-4",
    name: "Runway Gen-3 & Kling 1.5",
    category: "Video/Image",
    velocity: "+65%",
    velocityHi: "+65% उछाल",
    velocityNum: 65,
    bullishPct: 79,
    description: "Photorealistic camera dynamics and physics-grounded cinematic generative video.",
    descriptionHi: "सिनेमैटिक कैमरा मूवमेंट और असली दुनिया के भौतिक नियमों पर आधारित एआई वीडियो।",
    rank: 4,
  },
  {
    id: "ms-5",
    name: "OpenAI Sora & Luma Dream",
    category: "Video/Image",
    velocity: "+58%",
    velocityHi: "+58% उछाल",
    velocityNum: 58,
    bullishPct: 82,
    description: "Multi-shot world simulators bridging high-fidelity motion with character consistency.",
    descriptionHi: "मल्टी-शॉट वीडियो सिमुलेटर जो कैरेक्टर निरंतरता और उच्च गुणवत्ता प्रदान करते हैं।",
    rank: 5,
  },
  {
    id: "ms-6",
    name: "ElevenLabs & Suno v4",
    category: "Dev Tools",
    velocity: "+49%",
    velocityHi: "+49% उछाल",
    velocityNum: 49,
    bullishPct: 85,
    description: "Neural voice cloning and ultra-realistic audio synthesis transforming production studios.",
    descriptionHi: "न्यूरल वॉइस क्लोनिंग और संगीत निर्माण जो डिजिटल स्टूडियो को नया रूप दे रहे हैं।",
    rank: 6,
  },
];

export default function MindshareMatrix() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [filter, setFilter] = useState<"All" | "Models" | "Dev Tools" | "Video/Image">("All");
  const [userVotes, setUserVotes] = useState<Record<string, "BULL" | "BEAR">>({});
  const [bullPcts, setBullPcts] = useState<Record<string, number>>({});

  const handleVote = (id: string, type: "BULL" | "BEAR") => {
    sound.playVoteClick();
    if (userVotes[id]) return;

    setUserVotes((prev) => ({ ...prev, [id]: type }));
    setBullPcts((prev) => {
      const current = prev[id] || MINDSHARE_DATA.find((m) => m.id === id)?.bullishPct || 80;
      return {
        ...prev,
        [id]: type === "BULL" ? Math.min(99, current + 2) : Math.max(1, current - 2),
      };
    });
  };

  const filteredItems = MINDSHARE_DATA.filter((item) => {
    if (filter === "All") return true;
    return item.category === filter;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden flex-1 flex flex-col justify-between border border-[var(--border)] bg-[var(--card-bg)] transition-colors">
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] font-bold">
                {isHi ? "माइंडशेयर रडार" : "Mindshare Radar"}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                {isHi ? "लाइव 24 घंटे की गति" : "Live 24h Velocity"}
              </span>
            </div>
            <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight mt-0.5">
              {isHi ? "क्रिएटर माइंडशेयर व ट्रेंड वेलोसिटी" : "Creator Mindshare & Trend Velocity"}
            </h3>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono">
          {(["All", "Models", "Dev Tools", "Video/Image"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setFilter(cat);
              }}
              className={`px-2.5 py-1 rounded-lg transition cursor-pointer text-[11px] ${
                filter === cat
                  ? "bg-[#F97316] text-white font-bold shadow-sm"
                  : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[var(--foreground)]"
              }`}
            >
              {cat === "All" && (isHi ? "सभी" : "All")}
              {cat === "Models" && (isHi ? "एआई मॉडल" : "Models")}
              {cat === "Dev Tools" && (isHi ? "डेव टूल्स" : "Dev Tools")}
              {cat === "Video/Image" && (isHi ? "वीडियो/इमेज" : "Video/Image")}
            </button>
          ))}
        </div>
      </div>

      {/* Stack of Mindshare Items */}
      <div className="space-y-2.5 relative z-10">
        {filteredItems.map((item) => {
          const bullish = bullPcts[item.id] || item.bullishPct;
          const vote = userVotes[item.id];
          const rankBadgeStyle =
            item.rank === 1
              ? "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-sm shadow-[#F97316]/40 ring-1 ring-[#F59E0B]"
              : "bg-gradient-to-br from-[#F97316] to-[#EA580C] text-white shadow-sm shadow-[#F97316]/25";

          return (
            <div
              key={item.id}
              className="p-3.5 sm:p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#F97316] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className={`w-7 h-7 rounded-xl text-xs font-mono font-black flex items-center justify-center shrink-0 ${rankBadgeStyle}`}>
                  {item.rank}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-[var(--foreground)] group-hover:text-[#F97316] transition-colors truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold shrink-0">
                      {isHi ? item.velocityHi : item.velocity}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--muted-foreground)] truncate max-w-md mt-0.5">
                    {isHi ? item.descriptionHi : item.description}
                  </p>
                </div>
              </div>

              {/* Sentiment Voting Pill */}
              <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xs">
                  <span className="text-[10px] text-[var(--muted-foreground)] font-semibold">{isHi ? "सहमति:" : "Bullish:"}</span>
                  <span className="text-[#F97316] font-extrabold text-xs">{bullish}%</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, "BULL")}
                    title={isHi ? "सकारात्मक वोट" : "Vote Bullish"}
                    className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                      vote === "BULL"
                        ? "bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/25"
                        : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-500/10"
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVote(item.id, "BEAR")}
                    title={isHi ? "नकारात्मक वोट" : "Vote Bearish"}
                    className={`p-2 rounded-xl border transition-all duration-150 cursor-pointer ${
                      vote === "BEAR"
                        ? "bg-rose-500 border-rose-500 text-white shadow-sm shadow-rose-500/25"
                        : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)] hover:text-rose-500 hover:border-rose-500 hover:bg-rose-500/10"
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
