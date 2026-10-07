"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  MessageSquare,
  Sparkles,
  LayoutGrid,
  Menu,
  X,
  Bot,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";
import Logo from "@/components/Logo";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const { setTheme, language, setLanguage, t, resolvedTheme } = useThemeAndLang();

  const isHome = pathname === "/";
  const isRoast = pathname === "/roast";
  const isDebates = pathname === "/debates";
  const isVault = pathname === "/vault";
  const isAI = pathname === "/ai";
  const isContact = pathname === "/contact";

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200 border-b [html[data-theme='dark']_&]:border-[#1E293B] [html[data-theme='dark']_&]:bg-[#0B1220] [html[data-theme='dark']_&]:text-[#F8FAFC] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF] [html[data-theme='light']_&]:text-[#0F172A] backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo with Master Brand Palette */}
          <div className="flex items-center gap-3">
            <Logo variant="responsive" size="md" />

            {/* Subtle Pulse Badge (#F97316 / #F59E0B) */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/25 text-[#F97316] text-[10px] font-mono font-semibold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
              </span>
              <span className="tracking-wider uppercase">{t("live")}</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 sm:gap-1.5 p-1 rounded-full border [html[data-theme='dark']_&]:border-[#1E293B] [html[data-theme='dark']_&]:bg-[#1E293B]/60 [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#F8FAFC]">
            {/* Tab 1: Matrix Dashboard (Home) */}
            <Link
              href="/"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isHome
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{t("navMatrix")}</span>
            </Link>

            {/* Tab 2: AI Roast */}
            <Link
              href="/roast"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isRoast
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{t("navRoast")}</span>
            </Link>

            {/* Tab 3: Debates */}
            <Link
              href="/debates"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isDebates
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{t("navDebates")}</span>
            </Link>

            {/* Tab 4: Prompt Vault */}
            <Link
              href="/vault"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isVault
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t("navVault")}</span>
            </Link>

            {/* Tab 5: AI Lounge */}
            <Link
              href="/ai"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isAI
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wide">{t("navAI")}</span>
            </Link>

            {/* Tab 6: Contact */}
            <Link
              href="/contact"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                isContact
                  ? "bg-[#F97316] text-white font-semibold shadow-sm shadow-[#F97316]/30"
                  : "[html[data-theme='light']_&]:text-[#0F172A] [html[data-theme='light']_&]:hover:text-[#F97316] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-[#F59E0B]"
              }`}
            >
              <span>{t("navContact")}</span>
            </Link>
          </nav>

          {/* Right Controls: Day/Night Icon Switch + Language (EN/HI) Switch + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* 1. Day & Night Icon Switch Style */}
            <div
              className="flex items-center p-0.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF] shadow-xs"
              role="radiogroup"
              aria-label="Day and Night Theme Switch"
            >
              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setTheme("day");
                }}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  resolvedTheme === "day"
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "[html[data-theme='light']_&]:text-[#64748B] [html[data-theme='light']_&]:hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#94A3B8] [html[data-theme='dark']_&]:hover:text-white"
                }`}
                title={language === "hi" ? "दिन (Day Mode)" : "Day Mode"}
                aria-label="Day Mode"
                aria-checked={resolvedTheme === "day"}
                role="radio"
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="sr-only">Day</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setTheme("night");
                }}
                className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                  resolvedTheme === "night"
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "[html[data-theme='light']_&]:text-[#64748B] [html[data-theme='light']_&]:hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#94A3B8] [html[data-theme='dark']_&]:hover:text-white"
                }`}
                title={language === "hi" ? "रात (Night Mode)" : "Night Mode"}
                aria-label="Night Mode"
                aria-checked={resolvedTheme === "night"}
                role="radio"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="sr-only">Night</span>
              </button>
            </div>

            {/* 2. Language Switcher (EN | HI Segmented Switch Style) */}
            <div
              className="flex items-center p-0.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF] shadow-xs font-mono text-xs"
              role="radiogroup"
              aria-label="Language Switcher (EN / HI)"
            >
              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setLanguage("en");
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                  language === "en"
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "[html[data-theme='light']_&]:text-[#64748B] [html[data-theme='light']_&]:hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#94A3B8] [html[data-theme='dark']_&]:hover:text-white"
                }`}
                title="English"
                aria-label="Switch to English"
                aria-checked={language === "en"}
                role="radio"
              >
                EN
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setLanguage("hi");
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer select-none ${
                  language === "hi"
                    ? "bg-[#F97316] text-white shadow-xs"
                    : "[html[data-theme='light']_&]:text-[#64748B] [html[data-theme='light']_&]:hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#94A3B8] [html[data-theme='dark']_&]:hover:text-white"
                }`}
                title="हिन्दी"
                aria-label="Switch to Hindi"
                aria-checked={language === "hi"}
                role="radio"
              >
                <span className="font-sans font-bold">हि</span>
              </button>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] hover:border-[#F97316] focus:outline-none transition cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden border-b [html[data-theme='dark']_&]:border-[#1E293B] [html[data-theme='dark']_&]:bg-[#0B1220] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF] px-4 pt-3 pb-4 space-y-2 animate-in fade-in duration-200"
        >
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              isHome
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <LayoutGrid className="w-4 h-4 text-[#F97316]" />
            <span>{t("navMatrix")}</span>
          </Link>

          <Link
            href="/roast"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              isRoast
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <Flame className="w-4 h-4 text-[#F97316]" />
            <span>{t("navRoast")}</span>
          </Link>

          <Link
            href="/debates"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              isDebates
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-[#F97316]" />
            <span>{t("navDebates")}</span>
          </Link>

          <Link
            href="/vault"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              isVault
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#F97316]" />
            <span>{t("navVault")}</span>
          </Link>

          <Link
            href="/ai"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              isAI
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <Bot className="w-4 h-4 text-[#F97316]" />
            <span className="font-bold">{t("navAI")} ChatGPT Lounge</span>
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`px-3 py-2 rounded-lg text-sm transition block ${
              isContact
                ? "bg-[#F97316] text-white font-semibold"
                : "hover:text-[#F97316] hover:bg-[#F97316]/10"
            }`}
          >
            <span>{t("navContact")}</span>
          </Link>

          {/* Quick theme & language switcher for mobile */}
          <div className="pt-3 border-t [html[data-theme='dark']_&]:border-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] space-y-2.5 px-1">
            {/* Theme switcher */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                {t("theme")}
              </span>
              <div
                className="flex items-center p-0.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF]"
                role="radiogroup"
                aria-label="Mobile Theme selector"
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setTheme("day");
                  }}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    resolvedTheme === "day"
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-[#64748B] hover:text-[#F97316]"
                  }`}
                  title="Day Mode"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setTheme("night");
                  }}
                  className={`p-1.5 rounded-full transition cursor-pointer ${
                    resolvedTheme === "night"
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-[#CBD5E1] hover:text-[#F59E0B]"
                  }`}
                  title="Night Mode"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Language switcher */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                {t("lang")}
              </span>
              <div
                className="flex items-center p-0.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='light']_&]:bg-[#FFFFFF] font-mono text-xs"
                role="radiogroup"
                aria-label="Mobile Language selector"
              >
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setLanguage("en");
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    language === "en"
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-[#64748B] hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#CBD5E1]"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setLanguage("hi");
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition cursor-pointer ${
                    language === "hi"
                      ? "bg-[#F97316] text-white shadow-xs"
                      : "text-[#64748B] hover:text-[#0F172A] [html[data-theme='dark']_&]:text-[#CBD5E1]"
                  }`}
                >
                  <span className="font-sans font-bold">हि</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
