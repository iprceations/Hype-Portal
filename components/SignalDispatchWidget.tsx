"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, Zap } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";
import confetti from "canvas-confetti";

interface DispatchedSignal {
  id: string;
  claim: string;
  category: string;
  verdict: "BULLISH" | "CAP";
  score: number;
  timeAgo: string;
  timeAgoHi: string;
}

const INITIAL_SIGNALS: DispatchedSignal[] = [
  {
    id: "sig-1",
    claim: "Claude 3.7 Sonnet hybrid reasoning benchmark leaks",
    category: "AI Tech",
    verdict: "BULLISH",
    score: 94,
    timeAgo: "3m ago",
    timeAgoHi: "3 मि पहले",
  },
  {
    id: "sig-2",
    claim: "Influencer claims 4-hour workweek with 12 AI agents",
    category: "Social/Meme",
    verdict: "CAP",
    score: 18,
    timeAgo: "11m ago",
    timeAgoHi: "11 मि पहले",
  },
  {
    id: "sig-3",
    claim: "Apple M5 chip supply-chain tape-out confirmed in Taiwan",
    category: "Hardware",
    verdict: "BULLISH",
    score: 87,
    timeAgo: "26m ago",
    timeAgoHi: "26 मि पहले",
  },
];

export default function SignalDispatchWidget() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [claimText, setClaimText] = useState("");
  const [category, setCategory] = useState<"AI Tech" | "Hardware" | "Social" | "Crypto">("AI Tech");
  const [verdict, setVerdict] = useState<"BULLISH" | "CAP">("BULLISH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [signals, setSignals] = useState<DispatchedSignal[]>(INITIAL_SIGNALS);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimText.trim() || isSubmitting) return;

    sound.playVoteClick();
    setIsSubmitting(true);

    setTimeout(() => {
      sound.playSuccessChime();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#F97316", "#F59E0B", "#1E293B", "#CBD5E1"],
        });
      } catch {}

      const newSignal: DispatchedSignal = {
        id: "sig-" + Date.now(),
        claim: claimText.trim(),
        category,
        verdict,
        score: verdict === "BULLISH" ? 85 : 22,
        timeAgo: "Just now",
        timeAgoHi: "अभी",
      };

      setSignals([newSignal, ...signals.slice(0, 3)]);
      setClaimText("");
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] space-y-4 relative overflow-hidden transition-all shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold [html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A] tracking-tight">
              {isHi ? "सिग्नल टिप लाइन • वायरल क्लेम डिस्पैच" : "Signal Tip Line • Claim Dispatch"}
            </h3>
            <p className="text-[10px] font-mono [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]">
              {isHi ? "मैट्रिक्स ऑडिट पाइपलाइन को दावा भेजें" : "Submit viral claims to neural audit pipeline"}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/25 text-[#F97316] font-bold">
          LIVE
        </span>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {(["AI Tech", "Hardware", "Social", "Crypto"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setCategory(cat);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold transition cursor-pointer ${
                category === cat
                  ? "bg-[#F97316] text-white shadow-xs"
                  : "border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-white [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] hover:border-[#F97316]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Claim Input */}
        <div className="relative">
          <input
            type="text"
            value={claimText}
            onChange={(e) => setClaimText(e.target.value)}
            placeholder={
              isHi
                ? "वायरल दावा या अफवाह यहां लिखें (उदा. GPT-5 लीक)..."
                : "Submit a claim or rumor (e.g. GPT-5 leak)..."
            }
            className="w-full text-xs px-3.5 py-2.5 rounded-xl border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#0B1220]/60 [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-white [html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A] placeholder:text-[#64748B] focus:outline-none focus:border-[#F97316] transition"
          />
        </div>

        {/* Verdict & Dispatch Button */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5 bg-[var(--surface)] p-1 rounded-xl border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setVerdict("BULLISH");
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                verdict === "BULLISH"
                  ? "bg-[#F97316] text-white"
                  : "[html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]"
              }`}
            >
              Bullish
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setVerdict("CAP");
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer ${
                verdict === "CAP"
                  ? "bg-red-500 text-white"
                  : "[html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]"
              }`}
            >
              Cap
            </button>
          </div>

          <button
            type="submit"
            disabled={!claimText.trim() || isSubmitting}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            {success ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isHi ? "डिस्पैच सफल!" : "Dispatched!"}</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>{isHi ? "मैट्रिक्स को भेजें" : "Dispatch Signal"}</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live Dispatched Signals Feed */}
      <div className="pt-2 border-t [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] flex items-center justify-between">
          <span>{isHi ? "हालिया सत्यापित दावे" : "Recent Audited Signals"}</span>
          <span className="text-[#F59E0B] font-bold">REAL-TIME</span>
        </div>

        <div className="space-y-1.5">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-2.5 rounded-xl border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B]/50 [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#F8FAFC] flex items-center justify-between gap-2 text-xs"
            >
              <div className="overflow-hidden space-y-0.5 flex-1">
                <div className="flex items-center gap-1.5 text-[9px] font-mono">
                  <span className="text-[#F97316] font-semibold uppercase">{sig.category}</span>
                  <span className="text-[#64748B]">&bull;</span>
                  <span className="[html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]">
                    {isHi ? sig.timeAgoHi : sig.timeAgo}
                  </span>
                </div>
                <p className="[html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A] font-medium text-[11px] truncate">
                  {sig.claim}
                </p>
              </div>

              <span
                className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold shrink-0 ${
                  sig.verdict === "BULLISH"
                    ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                    : "bg-red-500/15 text-red-500 border border-red-500/30"
                }`}
              >
                {sig.verdict}: {sig.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
