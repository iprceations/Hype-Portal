"use client";

import React, { useState } from "react";
import { generateSeoTitles, SeoTitleResult } from "@/app/actions/generateSeoTitle";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";
import {
  Sparkles,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Tag,
  ArrowRight,
  Flame,
} from "lucide-react";

export default function SeoTitleGenerator() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeoTitleResult | null>(null);
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedTags, setCopiedTags] = useState(false);

  const handleGenerate = async (queryTopic?: string) => {
    const q = (queryTopic || topic).trim();
    if (!q || loading) return;

    sound.playVoteClick();
    setLoading(true);

    try {
      const data = await generateSeoTitles(q);
      setResult(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTitle = (text: string, idx: number) => {
    sound.playVoteClick();
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(idx);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const handleCopyAllTags = () => {
    if (!result?.tags) return;
    sound.playVoteClick();
    navigator.clipboard.writeText(result.tags.join(" "));
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass border border-[var(--border)] bg-[var(--card-bg)] space-y-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] font-mono text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isHi
                ? "क्रिएटर टूलकिट • यूट्यूब एसईओ व टाइटल मीटर"
                : "Creator Toolkit • YouTube SEO & Title Meter"}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            {isHi
              ? "हाई-सीटीआर यूट्यूब टाइटल व एसईओ स्कोर इंजन"
              : "High-CTR YouTube Title & SEO Score Engine"}
          </h2>
          <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80">
            {isHi
              ? "वायरल क्लिक-योग्य शीर्षक जनरेट करें, सर्च इंटेंट स्कोर मापें और कॉपी करने योग्य टैग्स निकालें।"
              : "Generate viral click-worthy titles, calculate search intent scores, and extract ready-to-copy tags."}
          </p>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => {
              setTopic(isHi ? "₹500 की एसआईपी: 5 साल का सच" : "₹500 Se SIP: 5 Saal Ka Sach");
              handleGenerate(isHi ? "₹500 की एसआईपी: 5 साल का सच" : "₹500 Se SIP: 5 Saal Ka Sach");
            }}
            className="px-3 py-1 rounded-xl bg-[var(--surface)] hover:bg-[#FFF7ED] [html[data-theme='dark']_&]:hover:bg-[#F97316]/15 border border-[var(--border)] hover:border-[#F97316]/50 text-[var(--foreground)] hover:text-[#F97316] transition-all cursor-pointer font-bold shadow-xs"
          >
            {isHi ? "₹500 SIP सच" : "₹500 SIP Reality"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTopic(isHi ? "एआई एजेंट्स बनाम प्रोग्रामर्स 2026" : "AI Agents vs Human Programmers 2026");
              handleGenerate(isHi ? "एआई एजेंट्स बनाम प्रोग्रामर्स 2026" : "AI Agents vs Human Programmers 2026");
            }}
            className="px-3 py-1 rounded-xl bg-[var(--surface)] hover:bg-[#FFF7ED] [html[data-theme='dark']_&]:hover:bg-[#F97316]/15 border border-[var(--border)] hover:border-[#F97316]/50 text-[var(--foreground)] hover:text-[#F97316] transition-all cursor-pointer font-bold shadow-xs"
          >
            {isHi ? "AI बनाम कोडर" : "AI vs Coders"}
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate();
        }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={
            isHi
              ? "वीडियो का विषय या विचार लिखें (उदा. iPhone 17 लीक, बेस्ट साइड बिजनेस)..."
              : "Enter video idea or topic (e.g. iPhone 17 Leaks, Best Side Hustles)..."
          }
          className="flex-1 rounded-xl bg-[var(--surface)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 font-mono transition"
        />

        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] disabled:opacity-40 text-white font-mono text-xs font-bold transition-all shadow-md shadow-[#F97316]/25 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 cursor-pointer border-none shrink-0"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>{isHi ? "एसईओ विश्लेषण जारी..." : "Analyzing SEO..."}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{isHi ? "वायरल एसईओ पैक बनाएं" : "Generate SEO Pack"}</span>
            </>
          )}
        </button>
      </form>

      {/* Result Display (CreatorSaathi-Style SEO Workspace) */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 animate-in fade-in duration-300">
          {/* Left: SEO Score Meter Card */}
          <div className="lg:col-span-4 p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] flex flex-col items-center justify-center text-center space-y-3">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[var(--border)] fill-none"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#F97316] fill-none transition-all duration-1000"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 * (1 - result.score / 100)
                  }
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#F97316] font-mono">
                  {result.score}
                </span>
                <span className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 uppercase">
                  {isHi ? "/ 100 स्कोर" : "/ 100 Score"}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-[#F97316] uppercase tracking-wider font-mono flex items-center gap-1 justify-center">
                <Zap className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{isHi ? "उच्च वायरल संभावना" : "High Viral Potential"}</span>
              </span>
              <p className="text-[11px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 leading-tight">
                {isHi
                  ? "शीर्षक भारतीय व वैश्विक सर्च एल्गोरिदम के अनुसार अनुकूलित हैं।"
                  : "Titles are tuned for Indian & international search algorithms."}
              </p>
            </div>
          </div>

          {/* Right: Titles & Tags */}
          <div className="lg:col-span-8 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 font-bold block">
                {isHi ? "3 वायरल शीर्षक (क्लिक करके कॉपी करें):" : "3 Optimized Viral Titles (Click to Copy):"}
              </span>
              <div className="space-y-2">
                {result.titles.map((t, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopyTitle(t.title, idx)}
                    className="w-full text-left p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[#F97316] transition flex items-center justify-between gap-3 group cursor-pointer"
                  >
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm text-[var(--foreground)] font-medium">
                          {t.title}
                        </span>
                        {t.ctrRating && (
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30">
                            {t.ctrRating} CTR
                          </span>
                        )}
                      </div>
                      {t.whyItWorks && (
                        <p className="text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 font-mono">
                          {t.whyItWorks}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 p-1.5 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-[#64748B] group-hover:text-[#F97316]">
                      {copiedTitleIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-[#F97316]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Container */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>{isHi ? "तैयार हैशटैग्स व कीवर्ड्स:" : "Ready-to-Paste Tags:"}</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyAllTags}
                  className="text-xs font-mono text-[#F97316] hover:text-[#EA580C] flex items-center gap-1 cursor-pointer"
                >
                  {copiedTags ? (
                    <>
                      <Check className="w-3 h-3 text-[#F97316]" />
                      <span>{isHi ? "कॉपी हो गया!" : "Copied All!"}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{isHi ? "सभी टैग्स कॉपी करें" : "Copy All Tags"}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] text-[11px] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
