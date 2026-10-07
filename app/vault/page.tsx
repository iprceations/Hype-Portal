"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import PromptVault from "@/components/PromptVault";
import { Sparkles, ArrowLeft, ChevronRight, Mail } from "lucide-react";
import Link from "next/link";
import { useThemeAndLang } from "@/lib/themeContext";

export default function VaultPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-[#F97316] selection:text-white transition-colors duration-200">
      {/* Sticky Enterprise Navbar */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6 flex-1">
        {/* Sleek Breadcrumb & Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-2">
            {/* Elegant Minimal Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
              <Link
                href="/"
                className="hover:text-[#F97316] transition-colors flex items-center gap-1.5"
              >
                <span>{isHi ? "मैट्रिक्स" : "Matrix"}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              <span className="text-[#F97316] font-semibold">{isHi ? "प्रॉम्प्ट वॉल्ट" : "Prompt Vault"}</span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span>{isHi ? "क्रिएटर प्रॉम्प्ट वॉल्ट" : "Creator Prompt Vault"}</span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316]">
                {isHi ? "स्टूडियो संस्करण" : "Studio Edition"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
              {isHi
                ? "मिडजर्नी और रनवे के लिए क्यूरेटेड प्रॉम्प्ट्स। श्रेणी अनुसार ब्राउज़ करें, सटीक आस्पेक्ट रेशियो कॉपी करें या जेमिनी से सुपरचार्ज करें।"
                : "Curated production prompts for Midjourney & Runway. Browse by category, copy exact aspect ratios, or supercharge concepts with Gemini AI."}
            </p>
          </div>

          {/* Quick Back to Matrix Navigation Action */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:border-[#F97316] hover:text-[#F97316] shadow-sm transition group cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F97316] group-hover:-translate-x-1 transition-transform" />
              <span>{isHi ? "वापस मैट्रिक्स पर जाएं" : "Back to Matrix"}</span>
            </Link>
          </div>
        </div>

        {/* Full-width Prompt Vault Component */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
          <PromptVault />
        </div>
      </main>

      {/* Enterprise Dark Footer */}
      <footer className="bg-[#0B1220] border-t border-[#1E293B] py-8 text-center text-xs text-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span
              suppressHydrationWarning
              className={`font-bold text-white tracking-wide ${isHi ? "font-hindi font-bold" : ""}`}
            >
              {isHi ? "हाइप पोर्टल" : "HYPE PORTAL"}
            </span>
            <span className="text-[#64748B]">&bull;</span>
            <span
              suppressHydrationWarning
              className={`${
                isHi
                  ? "font-hindi font-semibold text-[#F59E0B] text-xs"
                  : "text-[#F59E0B] font-mono text-[11px] uppercase tracking-wider"
              }`}
            >
              {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
            </span>
            <span className="text-[#64748B]">&bull;</span>
            <a
              href="mailto:ask.hypeai@gmail.com"
              className="inline-flex items-center gap-1.5 text-[#CBD5E1] hover:text-[#F97316] transition-colors font-medium"
              title="Direct Email"
            >
              <Mail className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span>{isHi ? "ईमेल द्वारा संपर्क करें" : "Contact via Email"}</span>
            </a>
            <span className="text-[#64748B]">&bull;</span>
            <span className="text-[#94A3B8]">
              &copy; 2026{" "}
              <a
                href="https://instagram.com/iprcreations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#F97316] transition underline decoration-dotted underline-offset-4 font-semibold"
              >
                PR Creations Lab.
              </a>{" "}
              All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/" className="hover:text-[#F97316] transition">
              Matrix
            </Link>
            <Link href="/roast" className="hover:text-[#F97316] transition">
              AI Roast
            </Link>
            <Link href="/debates" className="hover:text-[#F97316] transition">
              Debates
            </Link>
            <Link href="/vault" className="text-[#F97316] font-semibold">
              Vault
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
