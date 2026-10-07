"use client";

import React, { useState, useEffect } from "react";
import {
  dailyDebates as initialDailyDebates,
  trendingItems as initialTrendingItems,
  DailyDebate,
  TrendingItem,
} from "@/lib/data";
import {
  Scale,
  Vote,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Share2,
  Check,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";

function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

const DEBATE_HOT_TAKES: Record<string, string[]> = {
  "debate-1": [
    "James Cameron will still take 15 years to finish Avatar 4 regardless of autonomous diffusion pipelines.",
    "Gen video is amazing until a client asks for a character to open a specific door with their left hand.",
    "VFX artists won't be replaced by AI, but by artists who use 14 AI tools simultaneously.",
  ],
  "debate-2": [
    "Cloud APIs are fun until your company's proprietary codebase becomes unannounced weights in next month's training run.",
    "Good luck fitting a 70B parameter model on your office server without blowing the breaker.",
    "Open weights win on latency and sovereignty every single time.",
  ],
  "debate-3": [
    "Cryptographic watermarks will just get stripped by a 2-line Python script or phone screen recording.",
    "If watermarks are legally required, indie creators get demonetized while corporate studios get automatic passes.",
    "Provenance is the only thing standing between the internet and infinite AI deepfake collapse.",
  ],
};

export default function DebateFeed() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [debates, setDebates] = useState<DailyDebate[]>(initialDailyDebates);
  const [trending, setTrending] = useState<TrendingItem[]>(initialTrendingItems);
  const [userVotes, setUserVotes] = useState<Record<string, "A" | "B">>({});
  const [userFactCheckVotes, setUserFactCheckVotes] = useState<Record<string, "CAP" | "FACT">>({});
  const [expandedHotTakes, setExpandedHotTakes] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<"ALL" | "VERIFIED" | "CAP">("ALL");
  const [feedMode, setFeedMode] = useState<"ALL" | "DEBATES" | "FACT_CHECK">("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Guarded localStorage access
  useEffect(() => {
    if (typeof window === "undefined") return;

    const votes: Record<string, "A" | "B"> = {};
    initialDailyDebates.forEach((debate) => {
      try {
        const saved = localStorage.getItem(`voted_debate_${debate.id}`);
        if (saved === "A" || saved === "B") {
          votes[debate.id] = saved;
        }
      } catch (err) {
        console.warn("localStorage not accessible:", err);
      }
    });
    setUserVotes(votes);

    const factVotes: Record<string, "CAP" | "FACT"> = {};
    initialTrendingItems.forEach((item) => {
      try {
        const saved = localStorage.getItem(`fact_vote_${item.id}`);
        if (saved === "CAP" || saved === "FACT") {
          factVotes[item.id] = saved;
        }
      } catch {}
    });
    setUserFactCheckVotes(factVotes);
  }, []);

  // Handle optimistic voting on debates
  const handleVote = (debateId: string, option: "A" | "B") => {
    sound.playVoteClick();
    if (userVotes[debateId]) return;

    setUserVotes((prev) => ({ ...prev, [debateId]: option }));
    try {
      localStorage.setItem(`voted_debate_${debateId}`, option);
    } catch (e) {
      console.warn("Failed to write to localStorage:", e);
    }

    setDebates((prev) =>
      prev.map((d) => {
        if (d.id !== debateId) return d;
        return {
          ...d,
          votesA: option === "A" ? d.votesA + 1 : d.votesA,
          votesB: option === "B" ? d.votesB + 1 : d.votesB,
          totalVotes: d.totalVotes + 1,
        };
      })
    );

    try {
      confetti({
        particleCount: 28,
        spread: 45,
        origin: { y: 0.8 },
        colors: ["#F97316", "#F59E0B", "#1E293B"],
      });
    } catch {}
  };

  // Fact-Check community voting
  const handleFactCheckVote = (itemId: string, vote: "CAP" | "FACT") => {
    sound.playVoteClick();
    if (userFactCheckVotes[itemId]) return;

    setUserFactCheckVotes((prev) => ({ ...prev, [itemId]: vote }));
    try {
      localStorage.setItem(`fact_vote_${itemId}`, vote);
    } catch {}

    setTrending((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          shares: item.shares + 1,
        };
      })
    );
  };

  const toggleHotTakes = (id: string) => {
    sound.playVoteClick();
    setExpandedHotTakes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyClaimLink = (item: TrendingItem) => {
    sound.playSuccessChime();
    const url = `${window.location.origin}/debates#trend-${item.id}`;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const shareToWhatsApp = (item: TrendingItem) => {
    sound.playVoteClick();
    const shareLink = typeof window !== "undefined" ? `${window.location.origin}/debates#trend-${item.id}` : "";
    const text = `Is this true? Check the fact-check on Hype Portal: "${item.title}" — Verdict: ${item.verdict}${shareLink ? `\n${shareLink}` : ""}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const filteredTrending = trending.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.verdict === activeFilter;
  });

  return (
    <div className="space-y-6 flex flex-col h-full flex-1">
      {/* Top Feed View Switcher */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs font-mono transition-colors">
        <button
          type="button"
          onClick={() => {
            sound.playVoteClick();
            setFeedMode("ALL");
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer text-[11px] flex items-center justify-center gap-1.5 ${
            feedMode === "ALL"
              ? "bg-[#F97316] text-white font-bold shadow-sm"
              : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[#F97316]"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{isHi ? "सभी सिग्नल्स" : "All Signals"}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playVoteClick();
            setFeedMode("DEBATES");
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer text-[11px] flex items-center justify-center gap-1.5 ${
            feedMode === "DEBATES"
              ? "bg-[#F97316] text-white font-bold shadow-sm"
              : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[#F97316]"
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{isHi ? `लाइव डिबेट्स (${debates.length})` : `Debates (${debates.length})`}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            sound.playVoteClick();
            setFeedMode("FACT_CHECK");
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg text-center transition cursor-pointer text-[11px] flex items-center justify-center gap-1.5 ${
            feedMode === "FACT_CHECK"
              ? "bg-[#F97316] text-white font-bold shadow-sm"
              : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[#F97316]"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{isHi ? `फैक्ट चेक (${trending.length})` : `Fact-Check (${trending.length})`}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* UNIT 1: LIVE DEBATES POLLING ARENA                                        */}
      {/* ========================================================================= */}
      {(feedMode === "ALL" || feedMode === "DEBATES") && (
        <div
          className={`glass rounded-2xl p-6 flex flex-col space-y-5 relative overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] transition-colors ${
            feedMode === "DEBATES" ? "flex-1 justify-between" : ""
          }`}
        >
          {/* Section Header */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shadow-sm">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 font-bold">
                    {isHi ? "इंजन B" : "Engine B"}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                    {isHi ? "दैनिक मुद्दे" : "Daily Debates"}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight mt-0.5">
                  {isHi ? "लाइव वोटिंग अखाड़ा" : "Debate Arena"}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-mono text-[#F97316] bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 px-2 py-1 rounded-md border border-[#F97316]/30">
              <Vote className="w-3 h-3" />
              <span>{isHi ? "लाइव पोलिंग" : "Live Polling"}</span>
            </div>
          </div>

          {/* Debates List */}
          <div className="space-y-4 relative z-10">
            {debates.map((debate) => {
              const hasVoted = Boolean(userVotes[debate.id]);
              const userChoice = userVotes[debate.id];
              const isHotTakesOpen = Boolean(expandedHotTakes[debate.id]);
              const hotTakes = DEBATE_HOT_TAKES[debate.id] || [];

              const total = Math.max(1, debate.totalVotes);
              const pctA = Math.round((debate.votesA / total) * 100);
              const pctB = 100 - pctA;

              return (
                <div
                  key={debate.id}
                  id={debate.id}
                  className="p-4 rounded-xl border border-[var(--border)] hover:border-[#F97316] bg-[var(--surface)] transition duration-200 space-y-3"
                >
                  {/* Question */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[var(--foreground)] leading-snug">
                      {debate.question}
                    </h3>
                    {hasVoted && (
                      <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316] text-[#F97316] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Voted
                      </span>
                    )}
                  </div>

                  {/* Voting Action Buttons */}
                  {!hasVoted ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleVote(debate.id, "A")}
                        className="group relative flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[#FFF7ED] [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 hover:border-[#F97316] text-left text-xs transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
                      >
                        <span className="truncate pr-1 text-[var(--foreground)] font-semibold group-hover:text-[#F97316] transition-colors">{debate.optionA}</span>
                        <span className="text-[10px] font-mono text-[#F97316] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                          Vote A &rarr;
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleVote(debate.id, "B")}
                        className="group relative flex items-center justify-between p-3 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] hover:bg-[#FFFBEB] [html[data-theme='dark']_&]:hover:bg-[#F59E0B]/10 hover:border-[#F59E0B] text-left text-xs transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
                      >
                        <span className="truncate pr-1 text-[var(--foreground)] font-semibold group-hover:text-[#F59E0B] transition-colors">{debate.optionB}</span>
                        <span className="text-[10px] font-mono text-[#F59E0B] font-bold group-hover:translate-x-0.5 transition-transform shrink-0">
                          Vote B &rarr;
                        </span>
                      </button>
                    </div>
                  ) : null}

                  {/* Poll Percentage Bars */}
                  <div className="space-y-2.5 pt-1">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span
                          className={`truncate max-w-[70%] font-semibold flex items-center gap-1.5 ${
                            userChoice === "A"
                              ? "text-[#F97316] font-bold"
                              : "text-[var(--foreground)]"
                          }`}
                        >
                          {userChoice === "A" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                          )}
                          {debate.optionA}
                        </span>
                        <span className="font-mono text-[#F97316] font-extrabold" suppressHydrationWarning>
                          {pctA}%{" "}
                          <span className="text-[10px] font-normal text-[var(--muted-foreground)]" suppressHydrationWarning>
                            ({formatNumber(debate.votesA)})
                          </span>
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pctA}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span
                          className={`truncate max-w-[70%] font-semibold flex items-center gap-1.5 ${
                            userChoice === "B"
                              ? "text-[#F59E0B] font-bold"
                              : "text-[var(--foreground)]"
                          }`}
                        >
                          {userChoice === "B" && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                          )}
                          {debate.optionB}
                        </span>
                        <span className="font-mono text-[#F59E0B] font-extrabold" suppressHydrationWarning>
                          {pctB}%{" "}
                          <span className="text-[10px] font-normal text-[var(--muted-foreground)]" suppressHydrationWarning>
                            ({formatNumber(debate.votesB)})
                          </span>
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-full transition-all duration-700 ease-out"
                          style={{ width: `${pctB}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer metadata & Hot Takes Toggle */}
                  <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60">
                    <span className="flex items-center gap-1" suppressHydrationWarning>
                      <Vote className="w-3 h-3 text-[#64748B]" />
                      Total: {formatNumber(debate.totalVotes)} votes
                    </span>

                    {hotTakes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleHotTakes(debate.id)}
                        className="flex items-center gap-1 text-[#F97316] hover:text-[#EA580C] transition cursor-pointer"
                      >
                        <TrendingUp className="w-3 h-3" />
                        <span>{isHi ? "हॉट टेक्स" : "Hot Takes"} ({hotTakes.length})</span>
                        {isHotTakesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>
                    )}
                  </div>

                  {/* Expanded Hot Takes Drawer */}
                  {isHotTakesOpen && hotTakes.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-[var(--border)] animate-in fade-in duration-200">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#F97316] font-bold">
                        {isHi ? "कम्युनिटी हॉट टेक्स:" : "Community Hot Takes:"}
                      </span>
                      {hotTakes.map((take, tIdx) => (
                        <p key={tIdx} className="text-xs text-[var(--foreground)] italic leading-relaxed pl-2 border-l-2 border-[#F97316]">
                          &ldquo;{take}&rdquo;
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* UNIT 2: VIRAL CLAIM FACT-CHECK & TRUTH AUDITOR                            */}
      {/* ========================================================================= */}
      {(feedMode === "ALL" || feedMode === "FACT_CHECK") && (
        <div
          className={`glass rounded-2xl p-6 flex flex-col space-y-4 border border-[var(--border)] bg-[var(--card-bg)] transition-colors ${
            feedMode === "FACT_CHECK" ? "flex-1 justify-between" : ""
          }`}
        >
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 flex items-center justify-center text-[#F97316] shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 font-bold">
                    {isHi ? "इंजन C" : "Engine C"}
                  </span>
                  <span className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                    {isHi ? "वायरल दावे" : "Viral Claims"}
                  </span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight mt-0.5">
                  {isHi ? "सत्यता जांच व फ़ैक्ट-चेक" : "Truth & Fact Auditor"}
                </h2>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 font-mono text-xs">
              {(["ALL", "VERIFIED", "CAP"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setActiveFilter(filter);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                    activeFilter === filter
                      ? "bg-[#F97316] text-white border-[#F97316] shadow-sm"
                      : "border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#F97316]"
                  }`}
                >
                  {filter === "VERIFIED"
                    ? (isHi ? "सत्यापित" : "VERIFIED")
                    : filter === "CAP"
                    ? (isHi ? "कोरी अफवाह" : "CAP / FAKE")
                    : (isHi ? "सभी" : "ALL")}
                </button>
              ))}
            </div>
          </div>

          {/* Fact-Check Cards List */}
          <div className="space-y-3.5">
            {filteredTrending.map((item) => {
              const isVerified = item.verdict === "VERIFIED";
              const userVote = userFactCheckVotes[item.id];

              return (
                <div
                  key={item.id}
                  id={item.id}
                  className="p-4 rounded-xl border border-[var(--border)] hover:border-[#F97316] bg-[var(--surface)] transition duration-200 space-y-3"
                >
                  {/* Category & Verdict Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded border border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 bg-[var(--card-bg)]">
                      {item.category.replace("_", " ")}
                    </span>

                    {isVerified ? (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[#F97316] border border-[#F97316] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#F97316]" />
                        VERIFIED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[var(--card-bg)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] border border-[var(--border)] flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-[#F59E0B]" />
                        CAP / FAKE
                      </span>
                    )}
                  </div>

                  {/* Title & Claim */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-[var(--foreground)] leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 leading-relaxed font-sans p-2.5 rounded-lg border border-[var(--border)] bg-[var(--card-bg)]">
                      &ldquo;{item.claim}&rdquo;
                    </p>
                  </div>

                  {/* Community "Cap vs Fact" Voting Bar */}
                  <div className="p-2.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                      <span>{isHi ? "जनमत सहमति" : "Community Consensus"}</span>
                      {userVote && (
                        <span className="text-[#F97316] font-bold">
                          {isHi
                            ? `आपका वोट: ${userVote === "CAP" ? "CAP (झूठ)" : "FACT (सच)"}`
                            : `You voted: ${userVote === "CAP" ? "CAP" : "FACT"}`}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={Boolean(userVote)}
                        onClick={() => handleFactCheckVote(item.id, "CAP")}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono border transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-default ${
                          userVote === "CAP"
                            ? "bg-[#1E293B] text-white border-[#1E293B] [html[data-theme='dark']_&]:bg-[#334155] [html[data-theme='dark']_&]:border-[#334155] font-bold"
                            : "border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#1E293B]"
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{isHi ? "कोरा झूठ" : "Vote CAP"}</span>
                      </button>

                      <button
                        type="button"
                        disabled={Boolean(userVote)}
                        onClick={() => handleFactCheckVote(item.id, "FACT")}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-mono border transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-default ${
                          userVote === "FACT"
                            ? "bg-[#F97316] text-white border-[#F97316] font-bold shadow-sm"
                            : "border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#F97316]"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{isHi ? "असली सच" : "Vote FACT"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Share bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] font-mono">
                    <div className="flex items-center gap-2 text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60 text-[10px]">
                      <span className="flex items-center gap-1" suppressHydrationWarning>
                        <Share2 className="w-3 h-3 text-[#64748B]" />
                        {formatNumber(item.shares)}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#64748B]" />
                        {item.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => shareToWhatsApp(item)}
                        title="Share to WhatsApp"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[var(--border)] text-[#F97316] hover:bg-[#FFF7ED] [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 text-[10px] font-medium transition cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => copyClaimLink(item)}
                        title="Copy Claim Link"
                        className="p-1 rounded-lg border border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:text-[#F97316] transition cursor-pointer"
                      >
                        {copiedId === item.id ? (
                          <Check className="w-3 h-3 text-[#F97316]" />
                        ) : (
                          <Share2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fact-Check Telemetry Footer */}
          <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60">
            <span className="flex items-center gap-1.5 text-[#F97316] font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Live Fact Radar
            </span>
            <span className="text-[10px] font-mono">
              {filteredTrending.length} Claims Tracked
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
