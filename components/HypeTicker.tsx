"use client";

import React from "react";
import { Activity } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

interface TickerItem {
  id: string;
  label: string;
  labelHi: string;
  metric: string;
  metricHi: string;
  type: "UP" | "DOWN" | "CAP" | "VERIFIED" | "HOT";
}

const TICKER_ITEMS: TickerItem[] = [
  { id: "1", label: "DeepSeek-V3 Open Weights", labelHi: "डीपसीक-V3 ओपन वेट्स", metric: "99% VERIFIED", metricHi: "99% सत्यापित", type: "VERIFIED" },
  { id: "2", label: "OpenAI Orion Q* Leak", labelHi: "ओपनएआई ओरियन Q* लीक", metric: "94% CAP", metricHi: "94% कोरी अफवाह", type: "CAP" },
  { id: "3", label: "Vision Pro 2 Weight Cut", labelHi: "विजन प्रो 2 वज़न कटौती", metric: "+42% VIRAL", metricHi: "+42% वायरल", type: "HOT" },
  { id: "4", label: "Quantum Skateboard", labelHi: "क्वांटम स्केटबोर्ड दावा", metric: "100% CGI CAP", metricHi: "100% फ़र्ज़ी CGI", type: "CAP" },
  { id: "5", label: "Google Gemini 3.5/1.5", labelHi: "गूगल जेमिनी 3.5/1.5", metric: "INFERENCE LIVE", metricHi: "लाइव इन्फरेंस", type: "VERIFIED" },
  { id: "6", label: "Autonomous AI VFX Pipelines", labelHi: "स्वायत्त एआई वीएफएक्स पाइपलाइन", metric: "61% POLISH NEEDED", metricHi: "61% सुधार आवश्यक", type: "UP" },
  { id: "7", label: "Midjourney v6.1 & Kling 1.5", labelHi: "मिडजर्नी v6.1 व क्लिंग 1.5", metric: "+88% CREATOR TRAFFIC", metricHi: "+88% क्रिएटर ट्रैफ़िक", type: "HOT" },
  { id: "8", label: "C2PA Provenance Mandate", labelHi: "C2PA एआई वॉटरमार्क नियम", metric: "58% COMMUNITY SUPPORT", metricHi: "58% समर्थन", type: "UP" },
];

export default function HypeTicker() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <div className="w-full border-y border-[var(--border)] bg-[var(--surface)] overflow-hidden py-2 select-none transition-colors">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        {/* Fixed Pill Label */}
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 px-2.5 py-0.5 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#1E293B] border border-[#F97316]/30 text-[#F97316] font-mono text-[10px] uppercase font-bold tracking-wider z-10">
          <Activity className="w-3 h-3 text-[#F97316] animate-pulse" />
          <span>{isHi ? "हाइप इंडेक्स" : "Hype Index"}</span>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden mask-gradient-x">
          <div className="flex items-center gap-6 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
            {/* Duplicated for smooth infinite loop */}
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, idx) => {
              // Master UI/UX palette badges
              let badgeColor = "border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80";
              if (item.type === "VERIFIED" || item.type === "HOT") {
                badgeColor = "bg-[#FFF7ED] text-[#F97316] border-[#F97316]/40 [html[data-theme='dark']_&]:bg-[#F97316]/15 [html[data-theme='dark']_&]:text-[#F97316]";
              } else if (item.type === "CAP") {
                badgeColor = "bg-[var(--surface)] text-[#64748B] border-[var(--border)] [html[data-theme='dark']_&]:text-[#CBD5E1]";
              } else if (item.type === "UP") {
                badgeColor = "bg-[#FFFBEB] text-[#D97706] border-[#F59E0B]/40 [html[data-theme='dark']_&]:bg-[#F59E0B]/15 [html[data-theme='dark']_&]:text-[#F59E0B]";
              }

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className="inline-flex items-center gap-2 text-xs font-mono"
                >
                  <span className="text-[var(--foreground)] font-medium">
                    {isHi ? item.labelHi : item.label}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}
                  >
                    {isHi ? item.metricHi : item.metric}
                  </span>
                  <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/40">&bull;</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
