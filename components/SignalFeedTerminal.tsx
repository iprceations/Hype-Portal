"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio";
import { Activity, Radio } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

interface SignalItem {
  id: string;
  category: string;
  badge: string;
  heading: string;
  score: number;
  momentum: string;
  description: string;
  metrics: {
    growth: string;
    mindshare: string;
    status: string;
  };
  chartPath: string;
  chartFill: string;
}

const SIGNAL_DATA_EN: Record<string, SignalItem> = {
  culture: {
    id: "sig-culture",
    category: "CULTURE / COMMUNITY",
    badge: "FIELD 01 / 03",
    heading: "The Third Place, Remixed",
    score: 87,
    momentum: "EARLY MOMENTUM",
    description: "A new generation is turning decentralized niche internet clusters into their primary social infrastructure and creative capital.",
    metrics: {
      growth: "+148% QoQ",
      mindshare: "High Velocity",
      status: "Pattern Verified",
    },
    chartPath: "M0 104 C40 100 48 84 82 92 S129 86 155 80 S195 88 220 70 S266 76 289 59 S330 67 354 44 S396 51 420 26 S462 31 500 6",
    chartFill: "M0 104 C40 100 48 84 82 92 S129 86 155 80 S195 88 220 70 S266 76 289 59 S330 67 354 44 S396 51 420 26 S462 31 500 6 L500 120 L0 120 Z",
  },
  creators: {
    id: "sig-creators",
    category: "CREATORS / COMMUNITY",
    badge: "FIELD 02 / 03",
    heading: "Micro-Circles Over Mass Broadcast",
    score: 93,
    momentum: "BREAKOUT VELOCITY",
    description: "Creator-led micro-communities are building deeper trust and 10x engagement around curated points of view than algorithmic feeds.",
    metrics: {
      growth: "+210% MoM",
      mindshare: "Exponential",
      status: "Mainstream Influx",
    },
    chartPath: "M0 110 C50 105 80 95 120 90 S180 82 230 65 S310 50 370 30 S440 22 500 4",
    chartFill: "M0 110 C50 105 80 95 120 90 S180 82 230 65 S310 50 370 30 S440 22 500 4 L500 120 L0 120 Z",
  },
  commerce: {
    id: "sig-commerce",
    category: "COMMERCE / BEHAVIOR",
    badge: "FIELD 03 / 03",
    heading: "The Ritual Is The Product",
    score: 82,
    momentum: "STEADY ACCELERATION",
    description: "Consumers are rejecting generic commodities, choosing products that integrate into daily identity rituals and subculture signaling.",
    metrics: {
      growth: "+84% YoY",
      mindshare: "Sustained",
      status: "Category Shift",
    },
    chartPath: "M0 100 C60 98 110 88 160 85 S240 75 300 62 S390 48 450 35 S480 20 500 12",
    chartFill: "M0 100 C60 98 110 88 160 85 S240 75 300 62 S390 48 450 35 S480 20 500 12 L500 120 L0 120 Z",
  },
  ai: {
    id: "sig-ai",
    category: "SYNTHETIC INTELLIGENCE",
    badge: "FIELD 04 / SPECIAL",
    heading: "Autonomous Reasoning Swarms",
    score: 98,
    momentum: "MAXIMUM HYPE",
    description: "Multi-agent autonomous systems self-assembling toolchains and automating creative engineering workflows with zero human latency.",
    metrics: {
      growth: "+340% Spike",
      mindshare: "Critical Mass",
      status: "Singularity Vector",
    },
    chartPath: "M0 115 C40 110 90 98 140 85 S220 60 280 40 S360 25 430 12 S470 5 500 2",
    chartFill: "M0 115 C40 110 90 98 140 85 S220 60 280 40 S360 25 430 12 S470 5 500 2 L500 120 L0 120 Z",
  },
};

const SIGNAL_DATA_HI: Record<string, SignalItem> = {
  culture: {
    id: "sig-culture",
    category: "संस्कृति / कम्युनिटी",
    badge: "फ़ील्ड 01 / 03",
    heading: "तीसरा स्थान, रीमिक्स",
    score: 87,
    momentum: "आरंभिक गति",
    description: "नई पीढ़ी विकेंद्रीकृत इंटरनेट समूहों और माइक्रो-कम्युनिटीज को अपनी मुख्य सामाजिक व रचनात्मक पूंजी बना रही है।",
    metrics: {
      growth: "+148% QoQ",
      mindshare: "तेज गति",
      status: "पैटर्न सत्यापित",
    },
    chartPath: "M0 104 C40 100 48 84 82 92 S129 86 155 80 S195 88 220 70 S266 76 289 59 S330 67 354 44 S396 51 420 26 S462 31 500 6",
    chartFill: "M0 104 C40 100 48 84 82 92 S129 86 155 80 S195 88 220 70 S266 76 289 59 S330 67 354 44 S396 51 420 26 S462 31 500 6 L500 120 L0 120 Z",
  },
  creators: {
    id: "sig-creators",
    category: "क्रिएटर्स / कम्युनिटी",
    badge: "फ़ील्ड 02 / 03",
    heading: "मास ब्रॉडकास्ट के बजाय माइक्रो-सर्कल्स",
    score: 93,
    momentum: "ब्रेकआउट गति",
    description: "क्रिएटर-संचालित माइक्रो-कम्युनिटीज सामान्य एल्गोरिथम फ़ीड्स की तुलना में 10 गुना गहरा जुड़ाव और मजबूत विश्वास बना रही हैं।",
    metrics: {
      growth: "+210% MoM",
      mindshare: "घातीय वृद्धि",
      status: "मुख्यधारा में प्रवेश",
    },
    chartPath: "M0 110 C50 105 80 95 120 90 S180 82 230 65 S310 50 370 30 S440 22 500 4",
    chartFill: "M0 110 C50 105 80 95 120 90 S180 82 230 65 S310 50 370 30 S440 22 500 4 L500 120 L0 120 Z",
  },
  commerce: {
    id: "sig-commerce",
    category: "व्यापार / उपभोक्ता व्यवहार",
    badge: "फ़ील्ड 03 / 03",
    heading: "उपभोक्ता अनुष्ठान ही उत्पाद है",
    score: 82,
    momentum: "स्थिर त्वरण",
    description: "उपभोक्ता जेनेरिक वस्तुओं को नकार रहे हैं और उन उत्पादों को चुन रहे हैं जो उनकी पहचान और जीवनशैली से जुड़ते हैं।",
    metrics: {
      growth: "+84% YoY",
      mindshare: "निरंतर",
      status: "श्रेणी परिवर्तन",
    },
    chartPath: "M0 100 C60 98 110 88 160 85 S240 75 300 62 S390 48 450 35 S480 20 500 12",
    chartFill: "M0 100 C60 98 110 88 160 85 S240 75 300 62 S390 48 450 35 S480 20 500 12 L500 120 L0 120 Z",
  },
  ai: {
    id: "sig-ai",
    category: "सिंथेटिक बुद्धिमत्ता",
    badge: "फ़ील्ड 04 / विशेष",
    heading: "स्वायत्त तर्क व एजेंट झुंड",
    score: 98,
    momentum: "अत्यधिक हाइप",
    description: "मल्टी-एजेंट स्वायत्त सिस्टम्स अपने टूलचेन खुद जोड़कर बिना इंसानी देरी के जटिल इंजीनियरिंग कार्य पूरा कर रहे हैं।",
    metrics: {
      growth: "+340% उछाल",
      mindshare: "चरम सीमा",
      status: "सिंगुलैरिटी वेक्टर",
    },
    chartPath: "M0 115 C40 110 90 98 140 85 S220 60 280 40 S360 25 430 12 S470 5 500 2",
    chartFill: "M0 115 C40 110 90 98 140 85 S220 60 280 40 S360 25 430 12 S470 5 500 2 L500 120 L0 120 Z",
  },
};

export default function SignalFeedTerminal() {
  const [activeTab, setActiveTab] = useState<string>("culture");
  const { t, language } = useThemeAndLang();
  const isHi = language === "hi";

  const dataSource = isHi ? SIGNAL_DATA_HI : SIGNAL_DATA_EN;
  const current = dataSource[activeTab] || dataSource.culture;

  const tabLabels: Record<string, string> = {
    culture: isHi ? "संस्कृति" : "CULTURE",
    creators: isHi ? "क्रिएटर्स" : "CREATORS",
    commerce: isHi ? "व्यापार" : "COMMERCE",
    ai: isHi ? "एआई झुंड" : "AI SWARMS",
  };

  const handleTabChange = (key: string) => {
    sound.playVoteClick();
    setActiveTab(key);
  };

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="kicker">
            <span className="text-[#F97316] font-mono font-bold">02</span>
            <span>{t("signalKicker")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.065em] text-[var(--foreground)] leading-[1.02]">
            {t("signalHeading1")}{" "}
            <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 font-normal">
              {t("signalHeading2")}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 max-w-xl leading-relaxed">
            {t("signalDesc")}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60">
          <span className="px-2.5 py-1 rounded-lg border border-[var(--border)] flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#F97316] animate-pulse" />
            <span>{t("signalRadar")}</span>
          </span>
        </div>
      </div>

      {/* Enterprise High-Tech Signal Window */}
      <div className="rounded-2xl bg-[var(--card-bg)] border border-[var(--border)] shadow-xl overflow-hidden relative z-10 transition-colors">
        {/* Terminal Title Bar */}
        <div className="h-10 px-4 flex items-center justify-between border-b border-[var(--border)] font-mono text-[11px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
              <span className="w-2.5 h-2.5 rounded-full border border-[#64748B]" />
            </div>
            <span className="font-bold text-[var(--foreground)] ml-2 tracking-wider">
              {t("signalWindowBar")}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded border border-[#F97316] text-[#F97316] text-[10px] font-bold">
            {t("signalActive")}
          </span>
        </div>

        {/* Window Content */}
        <div className="p-5 sm:p-7 space-y-5">
          {/* Top Headline & Score */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-[#F97316] uppercase font-bold">
                {current.badge} &bull; {current.category}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
                {current.heading}
              </h3>
              <p className="text-xs sm:text-sm text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 max-w-xl leading-relaxed pt-1">
                {current.description}
              </p>
            </div>

            {/* Momentum Score Pill (Score in #F97316) */}
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] flex items-center gap-3 shrink-0">
              <span className="text-4xl font-black text-[#F97316] font-mono tracking-tight">
                {current.score}
              </span>
              <div className="font-mono text-[9px] leading-tight text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 uppercase">
                <span className="text-[#F59E0B] font-bold block">{current.momentum}</span>
                <span>{isHi ? "सिग्नल सूचकांक" : "Signal Index"}</span>
              </div>
            </div>
          </div>

          {/* SVG Rising Trendline Waveform (Main Chart: #F97316) */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
              <span>{t("earlySignal")}</span>
              <span>{t("growingMomentum")}</span>
              <span className="text-[#F97316] font-bold">{t("mainstream")}</span>
            </div>

            <div className="relative h-28 w-full overflow-hidden">
              {/* Background Gridlines */}
              <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_20px,rgba(226,232,240,0.4)_21px,transparent_22px)] [html[data-theme='dark']_&]:bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_20px,rgba(51,65,85,0.3)_21px,transparent_22px)]" />

              <svg
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible relative z-10"
              >
                <defs>
                  <linearGradient id={`chartGlow-${activeTab}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <path
                  d={current.chartFill}
                  fill={`url(#chartGlow-${activeTab})`}
                  className="transition-all duration-700 ease-out"
                />
                <path
                  d={current.chartPath}
                  fill="none"
                  stroke="#F97316"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              {/* Indicator at the end of the line */}
              <div className="absolute top-1 right-2 flex items-center gap-1 font-mono text-[9px] text-[#F97316] font-bold z-20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-ping" />
                <span>{isHi ? "अभी" : "NOW"}</span>
              </div>
            </div>

            {/* Sub-Telemetry Footnote */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border)] font-mono text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#F97316]" />
                <span>{t("velocity")}: <strong className="text-[var(--foreground)]">{current.metrics.growth}</strong></span>
              </span>
              <span>{t("mindshare")}: <strong className="text-[#F59E0B]">{current.metrics.mindshare}</strong></span>
              <span>{t("status")}: <strong className="text-[var(--foreground)]">{current.metrics.status}</strong></span>
            </div>
          </div>

          {/* Interactive Category Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60 mr-1">{t("switchField")}</span>
            {Object.keys(dataSource).map((key) => {
              const item = dataSource[key];
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleTabChange(key)}
                  className={`px-3 py-1.5 rounded-xl border transition cursor-pointer font-semibold ${
                    isActive
                      ? "bg-[#F97316] text-white border-[#F97316] shadow-sm"
                      : "border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#F97316] hover:text-[#F97316] bg-[var(--surface)]"
                  }`}
                >
                  <span>{tabLabels[key] || key}</span>
                  <span className="ml-1 text-[10px] opacity-75">({item.score})</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
