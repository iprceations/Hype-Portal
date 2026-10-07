"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";
import Link from "next/link";

export default function EnterpriseCtaSection() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <section className="rounded-3xl p-8 sm:p-14 border transition-all duration-300 relative overflow-hidden shadow-xl
      bg-[#F8FAFC] border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#0B1220] [html[data-theme='dark']_&]:border-[#1E293B]">
      
      {/* Background Sophisticated Horizon & Data-Network Graphic (Section 21) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 [html[data-theme='dark']_&]:opacity-40">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="horizonGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#F59E0B" stopOpacity="0.1" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Horizon Perspective Grid Lines */}
          <line x1="0" y1="360" x2="1200" y2="360" stroke="#334155" strokeWidth="1" />
          <line x1="0" y1="320" x2="1200" y2="320" stroke="#334155" strokeWidth="0.8" />
          <line x1="0" y1="290" x2="1200" y2="290" stroke="#334155" strokeWidth="0.6" />
          <line x1="0" y1="270" x2="1200" y2="270" stroke="#334155" strokeWidth="0.5" />
          <line x1="0" y1="255" x2="1200" y2="255" stroke="#334155" strokeWidth="0.4" />

          {/* Perspective Rays radiating to the vanishing point */}
          <line x1="600" y1="240" x2="0" y2="400" stroke="#334155" strokeWidth="0.8" />
          <line x1="600" y1="240" x2="200" y2="400" stroke="#334155" strokeWidth="0.8" />
          <line x1="600" y1="240" x2="400" y2="400" stroke="#334155" strokeWidth="0.8" />
          <line x1="600" y1="240" x2="800" y2="400" stroke="#334155" strokeWidth="0.8" />
          <line x1="600" y1="240" x2="1000" y2="400" stroke="#334155" strokeWidth="0.8" />
          <line x1="600" y1="240" x2="1200" y2="400" stroke="#334155" strokeWidth="0.8" />

          {/* Mountain Silhouettes */}
          <polygon
            points="100,240 280,160 420,240 600,140 760,240 920,180 1100,240 1200,240 1200,400 0,400 0,240"
            fill="url(#horizonGrad)"
          />

          {/* Subtle Horizon Glow */}
          <circle cx="600" cy="180" r="140" fill="#F97316" opacity="0.1" filter="blur(40px)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-xs font-mono text-[#F97316] font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isHi ? "एंटरप्राइज एक्सेस" : "READY FOR ENTERPRISE DEPLOYMENT"}</span>
        </div>

        {/* Headline (Section 21) */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white leading-[1.08]">
          {isHi ? "बुद्धिमत्ता की शक्ति को " : "Unlock the Power of "}
          <span className="text-[#F97316] [html[data-theme='dark']_&]:text-[#F59E0B]">
            {isHi ? "अनलॉक करें।" : "Intelligence."}
          </span>
        </h2>

        {/* Body */}
        <p className="text-base sm:text-lg text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] max-w-xl mx-auto leading-relaxed">
          {isHi
            ? "हाइप पोर्टल इंटेलिजेंस मैट्रिक्स के साथ सांस्कृतिक बदलावों और क्रिएटर रुझानों को कार्रवाई योग्य निर्णयों में बदलें।"
            : "Transform cultural trends and volatile social claims into quantifiable strategic conviction with HYPE PORTAL."}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#matrix"
            onClick={() => sound.playVoteClick()}
            className="btn-primary"
          >
            <span>{isHi ? "शुरू करें →" : "Get Started →"}</span>
          </a>

          <Link
            href="/contact"
            onClick={() => sound.playVoteClick()}
            className="btn-secondary"
          >
            <span>{isHi ? "संपर्क करें" : "Contact Us"}</span>
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#F97316]" />
            Enterprise-Grade Security
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#F59E0B]" />
            Sub-second Intelligence Stream
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F97316]" />
            99.9% Uptime SLA
          </span>
        </div>
      </div>
    </section>
  );
}
