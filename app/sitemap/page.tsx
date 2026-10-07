"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Map, LayoutGrid, Bot, Flame, MessageSquare, Sparkles, FileText, ShieldCheck, Lock, ExternalLink } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

interface SitemapCategory {
  title: string;
  titleHi: string;
  badge: string;
  links: {
    title: string;
    titleHi: string;
    path: string;
    desc: string;
    descHi: string;
    isExternal?: boolean;
  }[];
}

const SITEMAP_DATA: SitemapCategory[] = [
  {
    title: "Core Platform & Analytics",
    titleHi: "मुख्य प्लेटफॉर्म व एनालिटिक्स",
    badge: "CORE MATRIX",
    links: [
      {
        title: "Intelligence Matrix (Home)",
        titleHi: "इंटेलिजेंस मैट्रिक्स (होम)",
        path: "/",
        desc: "Live signal stream, telemetry radar, solutions matrix, and enterprise dashboard.",
        descHi: "लाइव सिग्नल स्ट्रीम, टेलीमेट्री रडार व एंटरप्राइज डैशबोर्ड।",
      },
      {
        title: "AI Vibe Roaster",
        titleHi: "एआई वाइब रोस्टर",
        path: "/roast",
        desc: "Full-screen AI profile auditor, brutal burns, and Hinglish humor engine.",
        descHi: "फुल-स्क्रीन एआई प्रोफाइल ऑडिटर व तीखे रोस्ट।",
      },
      {
        title: "Daily Debates & Consensus",
        titleHi: "दैनिक बहस व जनमत",
        path: "/debates",
        desc: "Live crowdsourced telemetry on controversial AI claims and tech debates.",
        descHi: "विवादास्पद तकनीकी दावों पर लाइव वोटिंग।",
      },
      {
        title: "Creator Prompt Vault",
        titleHi: "क्रिएटर प्रॉम्प्ट वॉल्ट",
        path: "/vault",
        desc: "Curated repository of battle-tested AI prompts, viral hooks, and templates.",
        descHi: "प्रमाणित एआई प्रॉम्प्ट्स और वायरल हुक्स का संग्रह।",
      },
    ],
  },
  {
    title: "AI Intelligence Lounge",
    titleHi: "एआई इंटेलिजेंस लाउंज",
    badge: "EPHEMERAL AI",
    links: [
      {
        title: "ChatGPT Lounge (48h Purge)",
        titleHi: "चैटजीपीटी लाउंज (48h स्वतः-डिलीट)",
        path: "/ai",
        desc: "5 Unfiltered personality modes with 48-hour local chat history and 5s undo.",
        descHi: "5 अनफ़िल्टर्ड मोड्स, 48-घंटे सुरक्षित इतिहास और 5s अनडू।",
      },
      {
        title: "Noty & Flirty (18+)",
        titleHi: "नॉटी व फ़्लर्टी (18+)",
        path: "/ai",
        desc: "Playful late-night banter, witty pick-up lines, and unfiltered flirtation.",
        descHi: "देर रात की चुलबुली बातें व फ़्लर्टी अंदाज़।",
      },
      {
        title: "Savage Roast (18+)",
        titleHi: "सेवेज रोस्ट (18+)",
        path: "/ai",
        desc: "Zero-filter brutal burns on toxic habits, startups, and cringe behaviors.",
        descHi: "बिना किसी रहम के तीखे रोस्ट्स।",
      },
      {
        title: "Midnight Confessions",
        titleHi: "मिडनाइट कन्फेशन्स",
        path: "/ai",
        desc: "Late-night scandalous secrets, tea, and guilty confessions.",
        descHi: "गहरी गपशप, देर रात के राज़ और अनकही बातें।",
      },
    ],
  },
  {
    title: "Documentation & Specifications",
    titleHi: "दस्तावेज़ व तकनीकी विनिर्देश",
    badge: "ENGINEERING",
    links: [
      {
        title: "Platform Documentation",
        titleHi: "सिस्टम दस्तावेज़ (Docs)",
        path: "/docs",
        desc: "System architecture, Gemini neural telemetry, and API specs.",
        descHi: "सिस्टम आर्किटेक्चर और तकनीकी विनिर्देश।",
      },
      {
        title: "Security Protocols",
        titleHi: "सुरक्षा प्रोटोकॉल",
        path: "/security",
        desc: "TLS 1.3 encryption, stateless serverless computing, and anti-DDoS shields.",
        descHi: "TLS 1.3 एन्क्रिप्शन व सर्वरलेस सुरक्षा मानक।",
      },
      {
        title: "XML Sitemap Feed",
        titleHi: "एक्सएमएल साइटमैप (क्रॉलर)",
        path: "/sitemap.xml",
        desc: "Search engine crawler XML index conforming to sitemap protocol 0.9.",
        descHi: "सर्च इंजन इंडेक्सिंग के लिए XML फीड।",
      },
    ],
  },
  {
    title: "Legal & Compliance",
    titleHi: "कानूनी व नियम शर्तें",
    badge: "GOVERNANCE",
    links: [
      {
        title: "Privacy Policy",
        titleHi: "गोपनीयता नीति",
        path: "/privacy",
        desc: "48-Hour ephemeral retention, zero data selling, and GDPR-aligned principles.",
        descHi: "48-घंटे स्वतः-डिलीट, शून्य डेटा ब्रोकिंग गारंटी।",
      },
      {
        title: "Terms of Service",
        titleHi: "सेवा की शर्तें",
        path: "/terms",
        desc: "Acceptable use policies, 18+ mode requirements, and intellectual property.",
        descHi: "उचित उपयोग नियम और उपयोगकर्ता अनुबंध।",
      },
      {
        title: "Contact & Support",
        titleHi: "संपर्क एवं सहायता",
        path: "/contact",
        desc: "Direct communication with the HYPE PORTAL engineering & support team.",
        descHi: "HYPE PORTAL इंजीनियरिंग एवं सपोर्ट टीम से सीधा संपर्क।",
        isExternal: false,
      },
    ],
  },
];

export default function SitemapPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 flex-1">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1.5">
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
              <Link href="/" className="hover:text-[#F97316] transition-colors">
                <span>{isHi ? "मैट्रिक्स" : "Matrix"}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#F97316] font-semibold">
                {isHi ? "साइटमैप" : "Sitemap"}
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span>{isHi ? "प्लेटफॉर्म साइटमैप डायरेक्टरी" : "Platform Sitemap & Index Directory"}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] font-bold">
                100% Indexed
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl leading-relaxed">
              {isHi
                ? "HYPE PORTAL के सभी पृष्ठों, एआई लाउंज टूल्स, दस्तावेज़ों और कानूनी पॉलिसियों की संपूर्ण संरचित सूची।"
                : "Complete navigational directory of all modules, AI chat personalities, technical documentation, and compliance resources."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-mono text-[var(--foreground)] transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{isHi ? "वापस होम" : "Back to Matrix"}</span>
          </Link>
        </div>

        {/* 4 Categorized Grid Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SITEMAP_DATA.map((cat, idx) => (
            <div
              key={idx}
              className="glass rounded-2xl p-6 border border-[var(--border)] bg-[var(--card-bg)] space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
                <h2 className="text-base font-bold text-[var(--foreground)]">
                  {isHi ? cat.titleHi : cat.title}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[#F97316] font-semibold">
                  {cat.badge}
                </span>
              </div>

              <div className="space-y-3">
                {cat.links.map((link, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:border-[#F97316] transition group"
                  >
                    {link.isExternal ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[#F97316] transition">
                          {isHi ? link.titleHi : link.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-[var(--muted-foreground)] group-hover:text-[#F97316]" />
                      </a>
                    ) : (
                      <Link href={link.path} className="block space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[#F97316] transition">
                            {isHi ? link.titleHi : link.title}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--muted-foreground)] group-hover:text-[#F97316] transition">
                            {link.path} &rarr;
                          </span>
                        </div>
                        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                          {isHi ? link.descHi : link.desc}
                        </p>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Subfooter */}
      <footer className="border-t border-[#1E293B] bg-[#0B1220] text-[#CBD5E1] py-8 text-xs font-mono text-center">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026{" "}
            <a
              href="https://instagram.com/iprcreations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F97316] transition underline decoration-dotted underline-offset-4 font-semibold"
            >
              PR Creations Lab.
            </a>{" "}
            &bull; Platform Sitemap Index
          </div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-[#F97316] transition">
              Docs
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
          </div>
        </div>
      </footer>
    </div>
  );
}
