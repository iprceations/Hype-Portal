"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import RoastEngine from "@/components/RoastEngine";
import WallOfShame from "@/components/WallOfShame";
import MindshareMatrix from "@/components/MindshareMatrix";
import { ArrowLeft, ChevronRight, Flame, Mail } from "lucide-react";
import Link from "next/link";
import { useThemeAndLang } from "@/lib/themeContext";

export default function RoastPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-[#F97316] selection:text-white transition-colors duration-200">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8 flex-1">
        {/* Sleek Breadcrumb & Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-2">
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
              <Link
                href="/"
                className="hover:text-[#F97316] transition-colors flex items-center gap-1.5"
              >
                <span>{isHi ? "मैट्रिक्स" : "Matrix"}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-foreground)]" />
              <span className="text-[#F97316] font-semibold">{isHi ? "एआई रोस्ट इंजन" : "AI Roast Engine"}</span>
            </nav>

            <h1 className={`text-2xl sm:text-3xl font-bold text-[var(--foreground)] flex items-center gap-3 ${isHi ? "tracking-normal leading-relaxed font-hindi" : "tracking-tight"}`}>
              <span>{isHi ? "एआई रोस्ट व सत्यता जांच इंजन" : "AI Roast & Vibe Check Engine"}</span>
              <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316]">
                {isHi ? "न्यूरल परीक्षक" : "Neural Evaluator"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl leading-relaxed">
              {isHi
                ? "मार्केटिंग के झूठे दावों को बेनकाब करें, सत्यता का स्कोर मापें और तीखे रोस्ट स्कोरकार्ड तैयार करें।"
                : "Deconstruct viral marketing claims, evaluate authenticity, and generate savage shareable scorecard roasts."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-mono text-[var(--foreground)] transition group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F97316] group-hover:-translate-x-1 transition-transform" />
              <span>{isHi ? "वापस मैट्रिक्स पर जाएं" : "Back to Matrix"}</span>
            </Link>
          </div>
        </div>

        {/* Roast Engine Component */}
        <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <RoastEngine />
        </div>

        {/* Wall of Shame */}
        <WallOfShame />

        {/* Mindshare Matrix */}
        <MindshareMatrix />
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-6 text-center text-xs font-mono text-[var(--muted-foreground)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[var(--muted-foreground)]">
            <span className={`font-bold text-[var(--foreground)] ${isHi ? "font-hindi font-bold" : ""}`}>
              {isHi ? "हाइप पोर्टल" : "HYPE PORTAL"}
            </span>
            <span>&bull;</span>
            <span className={`text-[var(--muted-foreground)] ${isHi ? "font-hindi font-medium" : ""}`}>
              {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
            </span>
            <span>&bull;</span>
            <span>
              &copy; 2026{" "}
              <a
                href="https://instagram.com/iprcreations"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#F97316] transition underline decoration-dotted underline-offset-4 font-semibold text-[var(--foreground)]"
              >
                PR Creations Lab.
              </a>{" "}
              All rights reserved.
            </span>
            <span>&bull;</span>
            <a href="mailto:ask.hypeai@gmail.com" className="text-[#F97316] hover:underline inline-flex items-center gap-1" title="Direct Email">
              <Mail className="w-3.5 h-3.5" />
              <span>{isHi ? "ईमेल द्वारा संपर्क करें" : "Contact via Email"}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-[var(--muted-foreground)]">
            <Link href="/" className="hover:text-[#F97316] transition">
              Matrix
            </Link>
            <Link href="/debates" className="hover:text-[#F97316] transition">
              Debates
            </Link>
            <Link href="/vault" className="hover:text-[#F97316] transition">
              Prompt Vault
            </Link>
            <Link href="/contact" className="hover:text-[#F97316] transition">
              {isHi ? "संपर्क" : "Contact"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
