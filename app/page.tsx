"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HypeTicker from "@/components/HypeTicker";
import RoastEngine from "@/components/RoastEngine";
import WallOfShame from "@/components/WallOfShame";
import MindshareMatrix from "@/components/MindshareMatrix";
import DebateFeed from "@/components/DebateFeed";
import PromptVault from "@/components/PromptVault";
import HypeOrCapGame from "@/components/HypeOrCapGame";
import NeuralOrbitCanvas from "@/components/NeuralOrbitCanvas";
import LiveTelemetryStream from "@/components/LiveTelemetryStream";
import SeoTitleGenerator from "@/components/SeoTitleGenerator";
import DesiSoundboard from "@/components/DesiSoundboard";
import MatrixFields from "@/components/MatrixFields";
import SignalFeedTerminal from "@/components/SignalFeedTerminal";
import FeatureCards from "@/components/FeatureCards";
import SolutionsSection from "@/components/SolutionsSection";
import EnterpriseDashboard from "@/components/EnterpriseDashboard";
import AboutNetworkVisual from "@/components/AboutNetworkVisual";
import EnterpriseCtaSection from "@/components/EnterpriseCtaSection";
import SignalDispatchWidget from "@/components/SignalDispatchWidget";
import AiLoungeWidget from "@/components/AiLoungeWidget";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";
import Logo from "@/components/Logo";
import {
  Flame,
  MessageSquare,
  Sparkles,
  Terminal,
  ArrowUpRight,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Database,
  BarChart3,
  Users,
  CheckCircle2,
  Mail,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { t, language } = useThemeAndLang();
  const isHi = language === "hi";
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    sound.playSuccessChime();
    setSubscribed(true);
    setNewsletterEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-[#F97316] selection:text-white relative overflow-x-hidden transition-colors duration-200">
      {/* Film grain noise texture */}
      <div className="noise" aria-hidden="true" />

      {/* Sticky Enterprise Header (Section 05) */}
      <Navbar />

      {/* Live Scrolling Ticker Bar */}
      <HypeTicker />

      {/* Main Responsive Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-16 flex-1">
        {/* ========================================================
            HERO SECTION (Section 06, 07, 08)
            ======================================================== */}
        <div className="space-y-8 pb-10 relative overflow-hidden rounded-3xl [html[data-theme='light']_&]:bg-white [html[data-theme='dark']_&]:bg-[#111C2E] border [html[data-theme='light']_&]:border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#1E293B] p-6 sm:p-10 shadow-sm transition-colors duration-200">
          {/* Ambient Interactive Neural Orbit Radar Background Canvas */}
          <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
            <NeuralOrbitCanvas isBackground={true} />
            {/* Directional Soft Masking Gradient for 100% Crystal-Clear Typography Legibility */}
            <div className="absolute inset-0 bg-gradient-to-r [html[data-theme='light']_&]:from-white [html[data-theme='light']_&]:via-white/85 [html[data-theme='light']_&]:to-transparent [html[data-theme='dark']_&]:from-[#111C2E] [html[data-theme='dark']_&]:via-[#111C2E]/85 [html[data-theme='dark']_&]:to-transparent pointer-events-none" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 relative z-10">
            {/* Left Column: Headline, Description, CTAs, 4 Statistics */}
            <div className="space-y-6 max-w-2xl">
              <div className="kicker">
                <span className="pulse-dot" />
                <span>{t("heroBadge")}</span>
              </div>

              {/* Main Hero Title (Section 06) */}
              {isHi ? (
                <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-normal leading-[1.4] text-[#0F172A] [html[data-theme='dark']_&]:text-white font-hindi flex flex-col gap-3 sm:gap-4">
                  <span className="block">{t("heroTitle1")}</span>
                  <span className="block text-[#F97316] pt-1 pb-1">
                    {t("heroTitle2")}
                  </span>
                </h1>
              ) : (
                <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-bold tracking-[-2px] leading-[1.05] text-[#0F172A] [html[data-theme='dark']_&]:text-white">
                  <span className="text-[#F97316]">{t("heroTitle1")}</span>{" "}
                  <span className="text-[#0F172A] [html[data-theme='dark']_&]:text-white">{t("heroTitle2")}</span>{" "}
                  <span className="text-[#F59E0B]">{t("heroTitle3")}</span>{" "}
                  <span className="text-[#0F172A] [html[data-theme='dark']_&]:text-white">{t("heroTitle4")}</span>
                </h1>
              )}

              {/* Body / Subtitle */}
              <p className={`text-base sm:text-lg leading-[1.6] text-[#475569] [html[data-theme='dark']_&]:text-[#CBD5E1] max-w-xl ${isHi ? "font-hindi text-lg" : ""}`}>
                {t("heroDesc")}
              </p>

              {/* Action Buttons: Primary & Secondary (Section 13) */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#matrix"
                  onClick={() => sound.playVoteClick()}
                  className={`btn-primary ${isHi ? "font-hindi text-base" : ""}`}
                >
                  <span>{isHi ? "शुरू करें" : "Get Started"}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <Link
                  href="/roast"
                  onClick={() => sound.playVoteClick()}
                  className={`btn-secondary ${isHi ? "font-hindi text-base" : ""}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[9px] mr-1">
                    ▶
                  </span>
                  <span>{isHi ? "सिग्नल देखें" : "See the signal"}</span>
                </Link>
              </div>

              {/* Footnote Bar */}
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] uppercase pt-1">
                <span className="w-8 h-px bg-[#F97316]" />
                <span>{isHi ? "कम शोर • अधिक निर्णय" : "LESS NOISE. SMARTER DECISIONS."}</span>
              </div>

              {/* 4 Hero Statistics (Section 08) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {/* Stat 1 */}
                <div className="p-3.5 rounded-2xl border [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-[#E2E8F0] shadow-sm">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F97316] ${isHi ? "font-hindi" : "font-numeric stat-number"}`}>
                    1M+
                  </div>
                  <div className={`text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium mt-0.5 ${isHi ? "font-hindi" : ""}`}>
                    {t("auditedClaims")}
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="p-3.5 rounded-2xl border [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-[#E2E8F0] shadow-sm">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white ${isHi ? "font-hindi" : "font-numeric stat-number"}`}>
                    500+
                  </div>
                  <div className={`text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium mt-0.5 ${isHi ? "font-hindi" : ""}`}>
                    {t("neuralPrecision")}
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="p-3.5 rounded-2xl border [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-[#E2E8F0] shadow-sm">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white ${isHi ? "font-hindi" : "font-numeric stat-number"}`}>
                    200+
                  </div>
                  <div className={`text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium mt-0.5 ${isHi ? "font-hindi" : ""}`}>
                    {t("geminiEngine")}
                  </div>
                </div>

                {/* Stat 4 (Premium Highlight in Gold #F59E0B) */}
                <div className="p-3.5 rounded-2xl border [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:bg-white [html[data-theme='light']_&]:border-[#E2E8F0] shadow-sm">
                  <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F59E0B] ${isHi ? "font-hindi" : "font-numeric stat-number"}`}>
                    99.9%
                  </div>
                  <div className={`text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium mt-0.5 ${isHi ? "font-hindi" : ""}`}>
                    {t("activeLive")}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Floating Status Indicator showcasing the open Neural Radar */}
            <div className="lg:w-[320px] w-full flex flex-col justify-end items-end shrink-0 relative pointer-events-none hidden sm:flex">
              <div className="px-4 py-2.5 rounded-2xl border [html[data-theme='dark']_&]:border-[#334155]/80 [html[data-theme='light']_&]:border-[#CBD5E1] [html[data-theme='dark']_&]:bg-[#0B1220]/75 [html[data-theme='light']_&]:bg-white/90 backdrop-blur-md shadow-md flex items-center gap-3 font-mono text-xs self-end">
                <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse shrink-0" />
                <div>
                  <div className="font-bold text-[var(--foreground)]">{isHi ? "न्यूरल रडार सक्रिय" : "Neural Radar Live"}</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">360° Real-time Orbit Sweep</div>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry Radar Stream */}
          <div className="relative z-10">
            <LiveTelemetryStream />
          </div>
        </div>

        {/* ========================================================
            00 • CORE CAPABILITIES: FEATURE CARDS (Section 09)
            ======================================================== */}
        <FeatureCards />

        {/* ========================================================
            01 • THE 3 PILLARS: CULTURE ✳ CREATORS ✳ COMMERCE
            ======================================================== */}
        <div id="matrix">
          <MatrixFields />
        </div>

        {/* ========================================================
            01.5 • ENTERPRISE ANALYTICS DASHBOARD (Section 12)
            ======================================================== */}
        <EnterpriseDashboard />

        {/* ========================================================
            02 • SIGNAL FEED TERMINAL & RADAR
            ======================================================== */}
        <SignalFeedTerminal />

        {/* ========================================================
            02.5 • SOLUTIONS MATRIX (Section 10)
            ======================================================== */}
        <SolutionsSection />

        {/* ========================================================
            CORE BENTO MATRIX: 2-col Hero (Roast), 1-col Side (Debates), Full (Vault)
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {/* Main 2-Col Module: AI Roast & Vibe Check Engine */}
          <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
            <section
              id="roast"
              className="glass p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden group rounded-2xl"
            >
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/25 font-bold">
                          {isHi ? "मॉड्यूल A" : "Module A"}
                        </span>
                        <span className="text-[10px] font-mono [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B]">
                          {isHi ? "इंटरैक्टिव रोस्ट लैब" : "Interactive Vibe Audit"}
                        </span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight mt-1 [html[data-theme='dark']_&]:text-white [html[data-theme='light']_&]:text-[#0F172A]">
                        {t("roastHeading")}
                      </h2>
                    </div>
                  </div>

                  <Link
                    href="/roast"
                    className="px-3.5 py-1.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] text-[#F97316] hover:bg-[#F97316] hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5 text-current" />
                    <span>{t("roastFullPage")}</span>
                  </Link>
                </div>

                <p className="text-sm leading-relaxed [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] max-w-2xl">
                  {t("roastDesc")}
                </p>

                {/* Interactive AI Roast Engine */}
                <RoastEngine />
              </div>

              <div className="relative z-10 mt-6 pt-4 border-t [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
                  {isHi ? "हार्डवेयर-त्वरित विश्लेषण पाइपलाइन" : "Hardware-accelerated analysis pipeline"}
                </span>
                <Link
                  href="/roast"
                  className="text-[#F97316] hover:underline transition cursor-pointer flex items-center gap-1 font-semibold"
                >
                  {isHi ? "फुल स्क्रीन देखें" : "View Full Screen"} <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            {/* CreatorSaathi.ai Suite */}
            <SeoTitleGenerator />

            {/* Desi Meme & Hype Web Audio Soundboard */}
            <DesiSoundboard />

            {/* Wall of Shame & Viral Hall of Fame */}
            <WallOfShame />

            {/* Creator Mindshare & Velocity Matrix */}
            <MindshareMatrix />
          </div>

          {/* Side 1-Col Module: Section id="debates" */}
          <section
            id="debates"
            className="lg:col-span-1 space-y-6 flex flex-col h-full"
          >
            <div className="flex items-center justify-end pb-1">
              <Link
                href="/debates"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F97316] hover:text-[#EA580C] px-3.5 py-1.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{isHi ? "मुद्दे व बहस पेज देखें →" : "Full Debates Page →"}</span>
              </Link>
            </div>
            <DebateFeed />

            {/* Signal Dispatch Tip Line & Claim Submitter */}
            <SignalDispatchWidget />

            {/* AI Intelligence Lounge Preview & Mode Launcher */}
            <AiLoungeWidget />
          </section>

          {/* Interactive Activity: HYPE or CAP? */}
          <div className="lg:col-span-3">
            <HypeOrCapGame />
          </div>

          {/* Full Width Module: Creator Prompt Vault (Section id="vault") */}
          <section
            id="vault"
            className="lg:col-span-3 glass rounded-2xl p-6 sm:p-8 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0]">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono uppercase px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F97316]" />
                  {t("promptVaultTitle")}
                </span>
                <span className="text-xs font-mono [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='light']_&]:text-[#64748B] hidden sm:inline">
                  &bull; {t("promptVaultSub")}
                </span>
              </div>

              <Link
                href="/vault"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='light']_&]:border-[#E2E8F0] text-[#F97316] hover:bg-[#F97316] hover:text-white text-xs font-semibold transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-current" />
                <span>{t("promptVaultOpen")}</span>
                <ArrowRight className="w-3.5 h-3.5 text-current" />
              </Link>
            </div>

            <PromptVault />
          </section>
        </div>

        {/* ========================================================
            03 • ABOUT SECTION & GLOBAL NETWORK (Section 11 & 20)
            ======================================================== */}
        <AboutNetworkVisual />

        {/* ========================================================
            04 • ENTERPRISE CALL TO ACTION (Section 21)
            ======================================================== */}
        <EnterpriseCtaSection />
      </main>

      {/* ========================================================
          ENTERPRISE FOOTER (Section 22)
          - Background: #0B1220
          - Logo: #FFFFFF + #F97316
          - Heading: #FFFFFF
          - Text & Links: #CBD5E1, hover: #F97316
          - Premium details: #F59E0B
          - Border: #1E293B
          ======================================================== */}
      <footer className="border-t border-[#1E293B] bg-[#0B1220] text-[#CBD5E1] pt-14 pb-10 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Top Footer 4 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Column 1 & 2: Brand & Tagline */}
            <div className="lg:col-span-2 space-y-4">
              <Logo variant="full" size="md" forceDark={true} />
              <p className="text-sm text-[#CBD5E1] !text-[#CBD5E1] leading-relaxed max-w-sm" style={{ color: "#CBD5E1" }}>
                {isHi
                  ? "डेटा को निर्णयों में बदलें हाइप पोर्टल के साथ — एक शक्तिशाली इंटेलिजेंस मैट्रिक्स जो समझदार, तेज़ और अधिक सूचित निर्णयों के लिए डिज़ाइन किया गया है।"
                  : "Transform data into decisions with HYPE PORTAL — a powerful intelligence matrix designed for smarter, faster and more informed decisions."}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[11px] font-mono text-[#F59E0B]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                  {isHi ? "एंटरप्राइज़ रेडी" : "Enterprise Ready"}
                </span>
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] border border-[#334155] text-[11px] text-[#F97316] ${isHi ? "font-hindi" : "font-mono"}`}>
                  99.9% {isHi ? "अपटाइम" : "Uptime"}
                </span>
              </div>
            </div>

            {/* Column 3: Product */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white !text-white tracking-wider uppercase font-mono" style={{ color: "#FFFFFF" }}>
                {isHi ? "उत्पाद" : "Product"}
              </h4>
              <ul className="space-y-2 text-sm text-[#CBD5E1]">
                <li>
                  <a href="#matrix" className="hover:text-[#F97316] transition">
                    {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
                  </a>
                </li>
                <li>
                  <Link href="/roast" className="hover:text-[#F97316] transition">
                    {isHi ? "एआई रोस्ट" : "AI Vibe Roaster"}
                  </Link>
                </li>
                <li>
                  <Link href="/debates" className="hover:text-[#F97316] transition">
                    {isHi ? "दैनिक सहमति" : "Daily Consensus"}
                  </Link>
                </li>
                <li>
                  <Link href="/vault" className="hover:text-[#F97316] transition">
                    {isHi ? "प्रॉम्प्ट वॉल्ट" : "Prompt Vault"}
                  </Link>
                </li>
                <li>
                  <Link href="/ai" className="hover:text-[#F97316] transition flex items-center gap-1 text-[#F97316] font-semibold">
                    <span>{isHi ? "(एआई) लाउंज" : "(AI) Lounge"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Company & Legal */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white !text-white tracking-wider uppercase font-mono" style={{ color: "#FFFFFF" }}>
                {isHi ? "कंपनी" : "Company"}
              </h4>
              <ul className="space-y-2 text-sm text-[#CBD5E1]">
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-[#F97316] transition"
                  >
                    {isHi ? "संपर्क करें" : "Contact Us"}
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-[#F97316] transition">
                    {isHi ? "दस्तावेज़" : "Documentation"}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-[#F97316] transition">
                    {isHi ? "गोपनीयता नीति" : "Privacy Policy"}
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-[#F97316] transition">
                    {isHi ? "सेवा की शर्तें" : "Terms of Service"}
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-[#F97316] transition">
                    {isHi ? "सुरक्षा प्रोटोकॉल" : "Security Protocols"}
                  </Link>
                </li>
                <li>
                  <Link href="/sitemap" className="hover:text-[#F97316] transition">
                    {isHi ? "साइटमैप" : "Platform Sitemap"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: Newsletter */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white !text-white tracking-wider uppercase font-mono" style={{ color: "#FFFFFF" }}>
                {isHi ? "न्यूज़लेटर" : "Newsletter"}
              </h4>
              <p className="text-xs text-[#CBD5E1] !text-[#CBD5E1] leading-relaxed" style={{ color: "#CBD5E1" }}>
                {isHi
                  ? "साप्ताहिक कल्चर सिग्नल्स, उभरते ट्रेंड्स और इंटेलिजेंस अपडेट प्राप्त करें।"
                  : "Receive weekly culture signals, emerging creator shifts, and intelligence updates."}
              </p>
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder={isHi ? "बिज़नेस ईमेल दर्ज करें..." : "Enter business email..."}
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#94A3B8] focus:border-[#F97316] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white flex items-center justify-center transition cursor-pointer"
                    title={isHi ? "सदस्यता लें" : "Subscribe"}
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
                {subscribed && (
                  <span className="text-[11px] text-[#F59E0B] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {isHi ? "इंटेलिजेंस मैट्रिक्स की सदस्यता ले ली गई!" : "Subscribed to Intelligence Matrix!"}
                  </span>
                )}
              </form>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Contact */}
          <div className="pt-8 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <span className={`font-bold text-white ${isHi ? "font-hindi font-bold" : ""}`}>
                {isHi ? "हाइप पोर्टल" : "HYPE PORTAL"}
              </span>
              <span className="text-[#334155]">&bull;</span>
              <span className={isHi ? "font-hindi font-medium" : ""}>
                {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
              </span>
              <span className="text-[#334155]">&bull;</span>
              <span>
                &copy; 2026{" "}
                <a
                  href="https://instagram.com/iprcreations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#F97316] transition font-semibold underline decoration-dotted underline-offset-4"
                >
                  PR Creations Lab.
                </a>{" "}
                {isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
              </span>
            </div>

            <div className="flex items-center gap-4 text-[#CBD5E1]">
              <a
                href="mailto:ask.hypeai@gmail.com"
                className="hover:text-[#F97316] transition flex items-center gap-1.5"
                title="Direct Email Channel"
              >
                <Mail className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{isHi ? "ईमेल द्वारा संपर्क करें" : "Contact via Email"}</span>
              </a>
              <span className="text-[#334155]">&bull;</span>
              <span className="text-[#F59E0B] font-semibold">Global Intelligence Edition</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
