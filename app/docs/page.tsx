"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  BookOpen,
  Terminal,
  ShieldCheck,
  Bot,
  Zap,
  MessageSquare,
  Sparkles,
  Lock,
  Layers,
  Code,
  FileText,
  Clock,
  ExternalLink,
  Mail,
} from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

interface DocSection {
  id: string;
  title: string;
  titleHi: string;
  icon: React.ReactNode;
  kicker: string;
  content: {
    heading: string;
    sub: string;
    points: { label: string; text: string }[];
    codeBlock?: string;
  };
}

const DOC_SECTIONS: DocSection[] = [
  {
    id: "architecture",
    title: "Matrix Architecture",
    titleHi: "मैट्रिक्स आर्किटेक्चर",
    icon: <Layers className="w-4 h-4 text-[#F97316]" />,
    kicker: "OVERVIEW & SPECS",
    content: {
      heading: "HYPE PORTAL Intelligence Matrix Core",
      sub: "A high-throughput telemetry pipeline combining real-time web crawlers, viral creator signals, and Google Gemini reasoning models to audit tech hype, claims, and market sentiment.",
      points: [
        {
          label: "Signal Ingestion Matrix",
          text: "Continuous ingestion engine parsing millions of claims, tweets, Reddit threads, and technical benchmarks across 4 core domains: AI Models, Hardware, Social Culture, and Web3/Crypto.",
        },
        {
          label: "Neural Consensus Scoring",
          text: "Every tracked claim receives a weighted Bullish vs. CAP veracity score derived from automated fact-audits cross-referenced with verified developer consensus.",
        },
        {
          label: "Zero-Latency Synthesizer",
          text: "Built on Next.js 16 with React 19 Server Actions, Turbopack, and client-side Web Audio synthesis for sub-10ms UI interactions.",
        },
      ],
      codeBlock: `// Core Telemetry Flow
IngestStream(claims)
  -> NeuralFilter(Gemini-2.5-Flash)
  -> CommunityConsensus(weight: 0.65)
  -> VeracityIndex(0..100)
  -> RealTimeDispatch(SLA < 120ms)`,
    },
  },
  {
    id: "ai-lounge",
    title: "AI Lounge & 48h Purge",
    titleHi: "एआई लाउंज व 48h लाइफसाइकिल",
    icon: <Bot className="w-4 h-4 text-[#F97316]" />,
    kicker: "CONVERSATIONAL ENGINE",
    content: {
      heading: "Dual Mode Intelligence Lounge & Vision Engine",
      sub: "Two specialized conversational intelligence engines (Hype AI & Roast AI) engineered with multimodal vision and strict ephemeral privacy.",
      points: [
        {
          label: "Dual Specialized Modes",
          text: "Features Hype AI (serious problem solving, coding, system architecture & image vision analysis like ChatGPT) and Roast AI (savage comedy burns, photo roasts & satire).",
        },
        {
          label: "48-Hour Ephemeral Expiration",
          text: "All conversation threads are stored strictly within the client browser's local sandbox (LocalStorage). Once 48 hours lapse from the last interaction, threads are automatically purged permanently without server retention.",
        },
        {
          label: "5-Second Undo System",
          text: "Accidental thread resets or item deletions can be restored instantly within 5 seconds through our animated undo progress toast.",
        },
      ],
      codeBlock: `// LocalStorage Purge Contract
const SESSIONS_STORAGE_KEY = "hype_chat_sessions_v2";
const AUTO_DELETE_MS = 48 * 60 * 60 * 1000; // 48 Hours

function purgeStaleSessions(sessions) {
  const cutoff = Date.now() - AUTO_DELETE_MS;
  return sessions.filter(s => s.updatedAt > cutoff);
}`,
    },
  },
  {
    id: "roast-engine",
    title: "AI Vibe Roaster",
    titleHi: "एआई रोस्ट इंजन",
    icon: <Terminal className="w-4 h-4 text-[#F97316]" />,
    kicker: "ROAST ALGORITHM",
    content: {
      heading: "Viral Profile & Lifestyle Audit Pipeline",
      sub: "Deep prompt-engineered evaluation models that dissect social profiles, tech bro LinkedIn bios, and creator claims into hilarious, brutally honest ratings.",
      points: [
        {
          label: "Vibe Score Calibration (0 to 100)",
          text: "Scores are computed by evaluating posture, jargon density, self-aggrandizement, and actual demonstrable substance.",
        },
        {
          label: "Bilingual Hinglish Dialect",
          text: "Understands colloquial Desi humor, Mumbai/Delhi street slang, tech startup buzzwords, and nuanced Indian internet culture.",
        },
        {
          label: "Synthesized Web Audio Reactions",
          text: "Integrated with our Desi Soundboard using zero-latency Web Audio API oscillators (Vine Boom, MLG Air Horn, Cha-Ching, Wrong Buzzer).",
        },
      ],
    },
  },
  {
    id: "debates",
    title: "Consensus & Debates",
    titleHi: "सहमति व बहस प्रणाली",
    icon: <MessageSquare className="w-4 h-4 text-[#F97316]" />,
    kicker: "COMMUNITY TELEMETRY",
    content: {
      heading: "Decentralized Community Consensus Arena",
      sub: "Crowdsourced telemetry and real-time voting on controversial tech hypotheses and viral rumors.",
      points: [
        {
          label: "Anti-Brigading Guardrails",
          text: "Votes are cryptographically rate-limited per client session with optimistic UI updates and live sentiment redistributions.",
        },
        {
          label: "Daily Archival Lifecycle",
          text: "Debates conclude every 24 hours at 00:00 UTC, locking consensus into our historical verified intelligence vault.",
        },
      ],
    },
  },
  {
    id: "security",
    title: "Security & Encryption",
    titleHi: "सुरक्षा व एन्क्रिप्शन",
    icon: <ShieldCheck className="w-4 h-4 text-[#F97316]" />,
    kicker: "ENTERPRISE SECURITY",
    content: {
      heading: "Enterprise Zero-Trust Security Protocols",
      sub: "Comprehensive protection across client browsers, edge networks, and serverless compute clusters.",
      points: [
        {
          label: "End-to-End TLS 1.3 Transport",
          text: "All telemetry, chat queries, and API calls are encrypted in transit using industry-standard TLS 1.3 cipher suites with Strict Transport Security (HSTS).",
        },
        {
          label: "No PII Storage",
          text: "HYPE PORTAL does not store Personally Identifiable Information (PII). Chats, inputs, and votes exist without user tracking cookies or third-party ad brokers.",
        },
        {
          label: "Rate Limiting & DoS Shield",
          text: "Edge compute gateways block abusive bots, scraping clusters, and malicious payloads before reaching backend inference engines.",
        },
      ],
    },
  },
];

export default function DocsPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [activeSectionId, setActiveSectionId] = useState("architecture");
  const activeSection =
    DOC_SECTIONS.find((s) => s.id === activeSectionId) || DOC_SECTIONS[0];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 flex-1">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1.5">
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
              <Link href="/" className="hover:text-[#F97316] transition-colors">
                <span>{isHi ? "मैट्रिक्स" : "Matrix"}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#F97316] font-semibold">
                {isHi ? "दस्तावेज़ (Docs)" : "Documentation"}
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span>{isHi ? "हब दस्तावेज़ व विनिर्देश" : "System Documentation & Specs"}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-bold">
                v2.6.4
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
              {isHi
                ? "HYPE PORTAL इंटेलिजेंस मैट्रिक्स, एआई लाउंज, रोस्ट इंजन, और सुरक्षा प्रोटोकॉल की विस्तृत तकनीकी गाइड।"
                : "Comprehensive architectural specifications, AI Lounge protocols, sentiment scoring mechanisms, and privacy models."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-mono text-[var(--foreground)] transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{isHi ? "वापस होम पर जाएं" : "Back to Matrix"}</span>
          </Link>
        </div>

        {/* 2-Column Documentation Workspace: Sidebar Nav + Main Doc Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Topics Sidebar */}
          <aside className="lg:col-span-1 space-y-2">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] px-2 font-bold">
              {isHi ? "विषय सूची" : "Table of Contents"}
            </div>

            <nav className="space-y-1">
              {DOC_SECTIONS.map((sec) => {
                const isActive = sec.id === activeSectionId;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      sound.playVoteClick();
                      setActiveSectionId(sec.id);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-medium transition cursor-pointer ${
                      isActive
                        ? "bg-[var(--card-bg)] border border-[#F97316] text-[var(--foreground)] font-bold shadow-xs"
                        : "hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent"
                    }`}
                  >
                    <div className="shrink-0">{sec.icon}</div>
                    <span className="truncate">{isHi ? sec.titleHi : sec.title}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Links Card */}
            <div className="pt-4 border-t border-[var(--border)] space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] px-2">
                {isHi ? "त्वरित लिंक" : "Platform Resources"}
              </div>
              <ul className="space-y-1 text-xs font-mono">
                <li>
                  <Link
                    href="/privacy"
                    className="block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface-hover)] transition"
                  >
                    {isHi ? "गोपनीयता नीति →" : "Privacy Policy →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface-hover)] transition"
                  >
                    {isHi ? "सेवा की शर्तें →" : "Terms of Service →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface-hover)] transition"
                  >
                    {isHi ? "सुरक्षा प्रोटोकॉल →" : "Security Protocols →"}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap"
                    className="block p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[#F97316] hover:bg-[var(--surface-hover)] transition"
                  >
                    {isHi ? "साइटमैप डायरेक्टरी →" : "Platform Sitemap →"}
                  </Link>
                </li>
              </ul>
            </div>
          </aside>

          {/* Right 3 Columns: Active Section Content */}
          <article className="lg:col-span-3 glass rounded-2xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--card-bg)] space-y-6">
            <div className="space-y-2 pb-4 border-b border-[var(--border)]">
              <div className="flex items-center gap-2 text-[10px] font-mono text-[#F97316] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#F97316]" />
                <span>{activeSection.kicker}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
                {activeSection.content.heading}
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                {activeSection.content.sub}
              </p>
            </div>

            {/* Structured Points */}
            <div className="space-y-4">
              {activeSection.content.points.map((pt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-1"
                >
                  <h3 className="text-xs font-mono font-bold text-[#F97316] uppercase tracking-wider">
                    {pt.label}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed">
                    {pt.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Optional Code Snippet */}
            {activeSection.content.codeBlock && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                  <span>SPECIFICATION / CODE PATTERN</span>
                  <span className="text-[#F59E0B]">TypeScript / Engine</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#0B1220] border border-[#334155] text-xs font-mono text-[#CBD5E1] overflow-x-auto leading-relaxed">
                  <code>{activeSection.content.codeBlock}</code>
                </pre>
              </div>
            )}
          </article>
        </div>
      </main>

      {/* Standard Enterprise Subfooter */}
      <footer className="border-t border-[#1E293B] bg-[#0B1220] text-[#CBD5E1] py-8 text-xs font-mono text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>
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
            <span>&bull;</span>
            <a
              href="mailto:ask.hypeai@gmail.com"
              className="hover:text-[#F97316] transition text-[#F97316] inline-flex items-center gap-1"
              title="Direct Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isHi ? "ईमेल द्वारा संपर्क करें" : "Contact via Email"}</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[#F97316] transition">
              {isHi ? "संपर्क" : "Contact"}
            </Link>
            <Link href="/privacy" className="hover:text-[#F97316] transition">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#F97316] transition">
              Terms
            </Link>
            <Link href="/security" className="hover:text-[#F97316] transition">
              Security
            </Link>
            <Link href="/sitemap" className="hover:text-[#F97316] transition">
              Sitemap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
