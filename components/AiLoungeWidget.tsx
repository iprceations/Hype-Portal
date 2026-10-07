"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bot, Sparkles, Flame, Zap, ArrowRight, Clock, Image as ImageIcon } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

interface ModePreview {
  id: string;
  name: string;
  nameHi: string;
  badge: string;
  badgeHi: string;
  icon: React.ReactNode;
  tagline: string;
  taglineHi: string;
  samplePrompt: string;
}

const PREVIEW_MODES: ModePreview[] = [
  {
    id: "hype",
    name: "Hype AI",
    nameHi: "हाइप एआई",
    badge: "Problem Solver • Vision",
    badgeHi: "प्रॉब्लम सॉल्वर • विज़न",
    icon: <Zap className="w-4 h-4 text-[#F97316]" />,
    tagline: "Serious problem solving, coding, vision/image analysis & architecture.",
    taglineHi: "गंभीर समस्या समाधान, कोडिंग, फोटो विश्लेषण व उच्च-आईक्यू तर्क।",
    samplePrompt: "Debug Next.js code & optimize architecture",
  },
  {
    id: "roast",
    name: "Roast AI",
    nameHi: "रोस्ट एआई",
    badge: "Savage Roast • Unfiltered",
    badgeHi: "कड़क रोस्ट • ज़ीरो फ़िल्टर",
    icon: <Flame className="w-4 h-4 text-[#F97316]" />,
    tagline: "Brutal burns, savage sarcasm, photo roasts & hilarious meme energy.",
    taglineHi: "बिना किसी रहम के तीखे रोस्ट, फोटो रोस्ट व बेबाक हास्य।",
    samplePrompt: "Roast my photo & 2 AM overthinking 🔥",
  },
];

export default function AiLoungeWidget() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [activeTab, setActiveTab] = useState<string>("hype");
  const activeMode = PREVIEW_MODES.find((m) => m.id === activeTab) || PREVIEW_MODES[0];

  return (
    <div className="glass rounded-2xl p-5 sm:p-6 border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] space-y-4 relative overflow-hidden transition-all shadow-sm">
      {/* Decorative ambient gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F97316]/15 via-transparent to-transparent rounded-bl-full pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#F97316] flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold [html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A] tracking-tight flex items-center gap-1.5">
              <span>{isHi ? "एआई लाउंज (2 मोड्स)" : "AI Lounge (Dual Modes)"}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#F97316]/15 text-[#F97316] font-bold">
                Vision Ready
              </span>
            </h3>
            <p className="text-[10px] font-mono [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]">
              {isHi ? "फोटो विज़न व 48h सुरक्षित स्वतः-डिलीट" : "Multimodal Vision & 48h Ephemeral Chats"}
            </p>
          </div>
        </div>

        <Link
          href="/ai"
          onClick={() => sound.playVoteClick()}
          className="text-xs text-[#F97316] hover:text-[#EA580C] font-semibold flex items-center gap-1 transition"
        >
          <span>{isHi ? "खोलें →" : "Launch →"}</span>
        </Link>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2">
        {PREVIEW_MODES.map((mode) => {
          const isSelected = activeTab === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setActiveTab(mode.id);
              }}
              className={`p-2.5 rounded-xl text-left transition cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? "bg-[#F97316]/15 border border-[#F97316]/50 [html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A] font-semibold"
                  : "border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] hover:border-[#F97316]/50"
              }`}
            >
              <div className="shrink-0">{mode.icon}</div>
              <div className="overflow-hidden">
                <span className="text-[12px] font-bold block truncate">
                  {isHi ? mode.nameHi : mode.name}
                </span>
                <span className="text-[9px] font-mono text-[#F97316] block">
                  {isHi ? mode.badgeHi : mode.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Mode Highlight Box */}
      <div className="p-3.5 rounded-xl border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B]/60 [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#F8FAFC] space-y-2">
        <p className="text-[11px] leading-relaxed [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]">
          {isHi ? activeMode.taglineHi : activeMode.tagline}
        </p>

        <div className="flex items-center justify-between gap-2 pt-1 border-t [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0]">
          <span className="text-[10px] font-mono text-[#F97316] truncate">
            &ldquo;{activeMode.samplePrompt}&rdquo;
          </span>
          <span className="text-[9px] font-mono [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3 text-[#F97316]" />
            48h
          </span>
        </div>
      </div>

      {/* Main Launch CTA */}
      <Link
        href="/ai"
        onClick={() => sound.playVoteClick()}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs transition shadow-sm cursor-pointer group"
      >
        <ImageIcon className="w-3.5 h-3.5" />
        <span>{isHi ? "एआई चैट व विज़न खोलें" : "Enter AI Chat & Vision"}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}
