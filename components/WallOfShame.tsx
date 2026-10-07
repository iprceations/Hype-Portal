"use client";

import React, { useState } from "react";
import {
  Flame,
  Trophy,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  Zap,
  User,
} from "lucide-react";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";

interface LeaderboardEntry {
  id: string;
  rank: number;
  handle: string;
  vibe: string;
  vibeHi: string;
  score: number;
  archetype: string;
  archetypeHi: string;
  roastSnippet: string;
  roastSnippetHi: string;
  upvotes: number;
  badgeType: "DELUSIONAL" | "VIRAL" | "GROUNDED";
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: "lead-1",
    rank: 1,
    handle: "@crypto_whale",
    vibe: "Crypto Native",
    vibeHi: "क्रिप्टो प्रेमी",
    score: 97,
    archetype: "Exit Liquidity Connoisseur",
    archetypeHi: "एग्जिट लिक्विडिटी विशेषज्ञ",
    roastSnippet: "Down 87% on cartoon dog coins while telling uber drivers they're early.",
    roastSnippetHi: "कुत्ते वाले मीम कॉइन में 87% घाटे में हैं और कैब ड्राइवर को समझा रहे हैं कि वे अभी भी शुरुआती दौर में हैं।",
    upvotes: 1420,
    badgeType: "DELUSIONAL",
  },
  {
    id: "lead-2",
    rank: 2,
    handle: "@techfounder_404",
    vibe: "Tech Bro",
    vibeHi: "टेक फाउंडर",
    score: 94,
    archetype: "Sub-Scale Disruptor",
    archetypeHi: "शून्य रेवेन्यू डिसरप्टर",
    roastSnippet: "Pitch deck has 47 mentions of 'paradigm shift' and zero paying customers.",
    roastSnippetHi: "पिच डेक में 47 बार 'पैराडाइम शिफ्ट' लिखा है लेकिन पैसे देने वाला ग्राहक एक भी नहीं है।",
    upvotes: 1280,
    badgeType: "DELUSIONAL",
  },
  {
    id: "lead-3",
    rank: 3,
    handle: "@growth_jockey",
    vibe: "AI Maximalist",
    vibeHi: "एआई अतिवादी",
    score: 92,
    archetype: "Wrapper Entrepreneur",
    archetypeHi: "रैपर एंटरप्रेन्योर",
    roastSnippet: "Calls four stacked OpenAI API calls 'autonomous deep tech architecture'.",
    roastSnippetHi: "चार ओपनएआई एपीआई कॉल्स जोड़कर उसे 'डीप टेक स्वायत्त आर्किटेक्चर' बता रहे हैं।",
    upvotes: 980,
    badgeType: "DELUSIONAL",
  },
  {
    id: "lead-4",
    rank: 4,
    handle: "@aesthetic_queen",
    vibe: "Influencer",
    vibeHi: "इन्फ्लुएंसर",
    score: 89,
    archetype: "Algorithm Hostage",
    archetypeHi: "एल्गोरिथम की बंधक",
    roastSnippet: "Starts every video with 'A lot of you have been asking'—literally nobody asked.",
    roastSnippetHi: "हर रील की शुरुआत 'आप में से बहुत लोग पूछ रहे थे' से करती हैं, जबकि किसी ने नहीं पूछा।",
    upvotes: 840,
    badgeType: "VIRAL",
  },
  {
    id: "lead-5",
    rank: 5,
    handle: "@timeline_ghoul",
    vibe: "Doomscroller",
    vibeHi: "डूमस्क्रोलर",
    score: 91,
    archetype: "Overclocked Brainrot Analyst",
    archetypeHi: "अति-सक्रिय इंटरनेट व्यसनी",
    roastSnippet: "Weekly screen time classified as an interactive modern art tragedy.",
    roastSnippetHi: "हफ्ते का 84 घंटे का स्क्रीन टाइम आधुनिक जीवन की एक बड़ी त्रासदी बन चुका है।",
    upvotes: 790,
    badgeType: "VIRAL",
  },
  {
    id: "lead-6",
    rank: 6,
    handle: "@quiet_builder",
    vibe: "Overthinker",
    vibeHi: "संतुलित निर्माता",
    score: 24,
    archetype: "Grounded Craftsman",
    archetypeHi: "जमीनी इंजीनियर",
    roastSnippet: "Ships working code in silence without posting a 14-tweet thread about it.",
    roastSnippetHi: "शांति से असली कोड बनाते और लॉन्च करते हैं बिना किसी 14-ट्वीट के ड्रामे के।",
    upvotes: 1650,
    badgeType: "GROUNDED",
  },
];

export default function WallOfShame() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<"ALL" | "DELUSIONAL" | "VIRAL" | "GROUNDED">("ALL");
  const [upvotes, setUpvotes] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playVoteClick();
    if (userVoted[id]) return;

    setUserVoted((prev) => ({ ...prev, [id]: true }));
    setUpvotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSelectProfile = (handle: string) => {
    sound.playVoteClick();
    const engineEl = document.getElementById("roast");
    if (engineEl) {
      engineEl.scrollIntoView({ behavior: "smooth" });
      const inputEl = engineEl.querySelector("input");
      if (inputEl) {
        inputEl.focus();
      }
    }
  };

  const filteredEntries = LEADERBOARD_DATA.filter((entry) => {
    if (activeTab === "ALL") return true;
    return entry.badgeType === activeTab;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5 relative overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] transition-colors">
      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-sm">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/40 text-[#F97316] font-bold">
                {isHi ? "हॉल ऑफ फेम" : "Hall of Fame"}
              </span>
              <span className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                {isHi ? "कम्युनिटी वाइब रडार" : "Community Vibe Radar"}
              </span>
            </div>
            <h3 className="text-lg font-black text-[var(--foreground)] tracking-tight mt-0.5">
              {isHi ? "द वॉल ऑफ शेम व फेम" : "The Wall of Shame & Fame"}
            </h3>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs font-mono">
          {(["ALL", "DELUSIONAL", "VIRAL", "GROUNDED"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setActiveTab(tab);
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer text-[11px] flex items-center gap-1.5 ${
                activeTab === tab
                  ? "bg-[#F97316] text-white font-bold shadow-sm"
                  : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[var(--foreground)]"
              }`}
            >
              {tab === "ALL" && <span>{isHi ? "सभी" : "All"}</span>}
              {tab === "DELUSIONAL" && (
                <>
                  <Flame className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>{isHi ? "भ्रमित" : "Delusional"}</span>
                </>
              )}
              {tab === "VIRAL" && (
                <>
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>{isHi ? "वायरल" : "Viral"}</span>
                </>
              )}
              {tab === "GROUNDED" && (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]" />
                  <span>{isHi ? "संतुलित" : "Grounded"}</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 relative z-10">
        {filteredEntries.map((entry) => {
          const totalVotes = entry.upvotes + (upvotes[entry.id] || 0);
          const hasVoted = userVoted[entry.id];

          return (
            <div
              key={entry.id}
              onClick={() => handleSelectProfile(entry.handle)}
              className="group p-4 rounded-xl bg-[var(--surface)] border border-[var(--border)] hover:border-[#F97316] transition duration-200 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden"
            >
              {/* Top row: Rank, Handle, Score */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-6 h-6 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--foreground)] flex items-center justify-center shrink-0">
                    #{entry.rank}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[var(--foreground)] group-hover:text-[#F97316] transition truncate flex items-center gap-1.5">
                      <span>{entry.handle}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-[#F97316] shrink-0" />
                    </div>
                    <div className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 truncate">
                      {isHi ? entry.vibeHi : entry.vibe}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] flex items-baseline gap-1">
                    <span className="text-sm font-black text-[#F97316]">
                      {entry.score}
                    </span>
                    <span className="text-[9px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60">
                      /100
                    </span>
                  </div>
                </div>
              </div>

              {/* Archetype & Savage Quote */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#F59E0B] font-semibold">
                  {isHi ? entry.archetypeHi : entry.archetype}
                </div>
                <p className="text-xs text-[var(--foreground)]/80 italic line-clamp-2 leading-relaxed">
                  &ldquo;{isHi ? entry.roastSnippetHi : entry.roastSnippet}&rdquo;
                </p>
              </div>

              {/* Bottom Footer: Upvote Flame & Quick Roast */}
              <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                <button
                  type="button"
                  onClick={(e) => handleUpvote(entry.id, e)}
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border transition cursor-pointer ${
                    hasVoted
                      ? "bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border-[#F97316] text-[#F97316] font-bold"
                      : "bg-transparent border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[#F97316] hover:border-[#F97316]/50"
                  }`}
                >
                  <Flame className={`w-3 h-3 ${hasVoted ? "text-[#F97316] fill-[#F97316]" : ""}`} />
                  <span>{totalVotes}</span>
                </button>

                <span className="text-[10px] text-[#F97316] group-hover:text-[var(--foreground)] transition flex items-center gap-0.5 font-sans font-semibold">
                  {isHi ? "रोस्ट टेस्ट करें →" : "Test This Vibe →"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
