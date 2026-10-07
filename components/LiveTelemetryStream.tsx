"use client";

import React, { useState, useEffect } from "react";
import { useThemeAndLang } from "@/lib/themeContext";

interface AgentNode {
  id: string;
  name: string;
  nameHi: string;
  category: string;
  categoryHi: string;
  status: "RUNNING" | "ASLEEP" | "ROASTED";
  latency: string;
  verdict: string;
  verdictHi: string;
}

const INITIAL_NODES: AgentNode[] = [
  {
    id: "node-01",
    name: "OpenAI GPT-5 Release Date Rumors",
    nameHi: "ओपनएआई GPT-5 लॉन्च की तारीख की अफवाहें",
    category: "AI Tech",
    categoryHi: "एआई तकनीक",
    status: "RUNNING",
    latency: "18ms",
    verdict: "Analyzing Marketing Hyperbole",
    verdictHi: "मार्केटिंग दावों का विश्लेषण जारी",
  },
  {
    id: "node-02",
    name: "Dating App Algorithm Leak 2026",
    nameHi: "डेटिंग ऐप एल्गोरिथम लीक 2026",
    category: "Social",
    categoryHi: "सोशल मीडिया",
    status: "ROASTED",
    latency: "42ms",
    verdict: "CAP: Rehashed 2023 Reddit Theory",
    verdictHi: "झूठ: पुराना रेडिट सिद्धांत",
  },
  {
    id: "node-03",
    name: "Solana Meme Coin 10,000x Presale",
    nameHi: "सोलाना मीम कॉइन 10,000x प्रीसेल दावा",
    category: "Crypto",
    categoryHi: "क्रिप्टो",
    status: "ROASTED",
    latency: "24ms",
    verdict: "Brutal Burn: Classic Exit Liquidity",
    verdictHi: "तीखा रोस्ट: क्लासिक स्कैम",
  },
  {
    id: "node-04",
    name: "Apple M5 Ultra Architecture Specs",
    nameHi: "एप्पल M5 अल्ट्रा आर्किटेक्चर लीक",
    category: "Hardware",
    categoryHi: "हार्डवेयर",
    status: "RUNNING",
    latency: "12ms",
    verdict: "Auditing Supply Chain Leaks",
    verdictHi: "सप्लाई चेन लीक्स की जांच जारी",
  },
  {
    id: "node-05",
    name: "Tech Bro 4 AM Sleep Routine Claims",
    nameHi: "टेक फाउंडर 4 AM स्लीप रूटीन दावे",
    category: "Productivity",
    categoryHi: "उत्पादकता",
    status: "ASLEEP",
    latency: "8ms",
    verdict: "Debunked: Verified Sleep Deficit",
    verdictHi: "पर्दाफाश: अनिद्रा का शिकार",
  },
  {
    id: "node-06",
    name: "Autonomous Software Engineer Benchmarks",
    nameHi: "स्वायत्त सॉफ्टवेयर इंजीनियर बेंचमार्क",
    category: "AI Code",
    categoryHi: "एआई कोडिंग",
    status: "RUNNING",
    latency: "15ms",
    verdict: "Benchmarking 100K LOC Repositories",
    verdictHi: "1 लाख लाइनों के कोड की जांच",
  },
];

export default function LiveTelemetryStream() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) => {
        const copy = [...prev];
        const randomIdx = Math.floor(Math.random() * copy.length);
        const node = copy[randomIdx];
        if (node.status === "RUNNING") {
          node.status = Math.random() > 0.5 ? "ROASTED" : "ASLEEP";
        } else if (node.status === "ASLEEP") {
          node.status = "RUNNING";
        } else {
          node.status = "RUNNING";
        }
        return copy;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const runningCount = nodes.filter((n) => n.status === "RUNNING").length;
  const roastedCount = nodes.filter((n) => n.status === "ROASTED").length;

  const statusLabel = (status: "RUNNING" | "ASLEEP" | "ROASTED") => {
    if (!isHi) return status;
    if (status === "RUNNING") return "सक्रिय";
    if (status === "ASLEEP") return "निष्क्रिय";
    return "रोस्टेड";
  };

  return (
    <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 space-y-4 overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-ping" />
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
            {isHi ? "स्वायत्त एजेंट रडार" : "AUTONOMOUS AGENT RADAR"}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)]">
            {isHi ? "6 नोड्स सक्रिय" : "6 Nodes Online"}
          </span>
        </div>

        {/* Binary Status Indicators */}
        <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.18em] uppercase text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#F97316] rounded-sm" />
            <span className="text-[#F97316] font-bold">
              {isHi ? "सक्रिय" : "RUNNING"} ({runningCount})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 border border-[var(--border)] rounded-sm" />
            <span>
              {isHi ? "निष्क्रिय" : "ASLEEP"} ({nodes.length - runningCount - roastedCount})
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#F59E0B] rounded-sm" />
            <span className="text-[#F59E0B] font-bold">
              {isHi ? "रोस्टेड" : "ROASTED"} ({roastedCount})
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Live Scanning Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {nodes.map((node) => {
          const isRunning = node.status === "RUNNING";
          const isRoasted = node.status === "ROASTED";

          return (
            <div
              key={node.id}
              className={`p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between space-y-2 ${
                isRunning
                  ? "bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/10 border-[#F97316]/40"
                  : isRoasted
                  ? "bg-[var(--surface)] border-[var(--border)]"
                  : "border-[var(--border)] opacity-70 bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 uppercase tracking-widest">
                  {isHi ? node.categoryHi : node.category}
                </span>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-block w-2 h-2 rounded-sm ${
                      isRunning
                        ? "bg-[#F97316] animate-pulse"
                        : isRoasted
                        ? "bg-[#F59E0B]"
                        : "border border-[var(--border)]"
                    }`}
                  />
                  <span
                    className={`font-bold tracking-wider ${
                      isRunning
                        ? "text-[#F97316]"
                        : isRoasted
                        ? "text-[#F59E0B]"
                        : "text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60"
                    }`}
                  >
                    {statusLabel(node.status)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-[var(--foreground)] font-medium line-clamp-1">
                {isHi ? node.nameHi : node.name}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-[var(--border)]">
                <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 truncate max-w-[200px]">
                  {isHi ? node.verdictHi : node.verdict}
                </span>
                <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/50 text-[10px] shrink-0">
                  {node.latency}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
