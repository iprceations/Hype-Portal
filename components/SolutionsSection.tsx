"use client";

import React, { useState } from "react";
import { Cpu, Eye, Users2, Layers, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

interface SolutionItem {
  id: string;
  title: string;
  titleHi: string;
  badge: string;
  badgeHi: string;
  description: string;
  descriptionHi: string;
  bullets: string[];
  bulletsHi: string[];
  icon: React.ReactNode;
  metric: string;
  metricLabel: string;
}

export default function SolutionsSection() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";
  const [activeTab, setActiveTab] = useState(0);

  const solutions: SolutionItem[] = [
    {
      id: "data-intel",
      title: "Data Intelligence",
      titleHi: "डेटा इंटेलिजेंस",
      badge: "NEURAL PARSING",
      badgeHi: "न्यूरल पार्सिंग",
      description:
        "High-throughput ingestion matrix processing billions of creator signals, conversational sentiment streams, and market claims in real-time.",
      descriptionHi:
        "अरबों क्रिएटर सिग्नल्स, कन्वर्सेशनल सेंटिमेंट स्ट्रीम्स और मार्केट दावों को रियल-टाइम में प्रोसेस करने वाला हाई-थ्रूपुट इंजेक्शन मैट्रिक्स।",
      bullets: [
        "Sub-second narrative shift detection",
        "Automated truth & hyperbole scoring",
        "Cross-platform virality correlation",
      ],
      bulletsHi: [
        "सैकंड से कम समय में नैरेटिव बदलाव की पहचान",
        "स्वचालित सत्यता और अतिशयोक्ति स्कोरिंग",
        "क्रॉस-प्लेटफ़ॉर्म वायरल सहसंबंध",
      ],
      icon: <Cpu className="w-5 h-5 text-[#F97316]" />,
      metric: "1.2B+",
      metricLabel: "Daily Signals Processed",
    },
    {
      id: "visualization",
      title: "Visualization",
      titleHi: "विज़ुअलाइज़ेशन",
      badge: "DYNAMIC MATRIX",
      badgeHi: "डायनामिक मैट्रिक्स",
      description:
        "Interactive radar displays, 3D mindshare dispersion grids, and executive-ready charts making complex cultural velocity instantly legible.",
      descriptionHi:
        "इंटरैक्टिव रडार डिस्प्ले, 3D माइंडशेयर ग्रिड और एग्जीक्यूटिव चार्ट्स जो जटिल सांस्कृतिक वेग को तुरंत स्पष्ट बनाते हैं।",
      bullets: [
        "Multi-dimensional orbital coordinate maps",
        "Confidence interval variance tracking",
        "Real-time telemetry pulse streams",
      ],
      bulletsHi: [
        "बहु-आयामी कक्षीय निर्देशांक मानचित्र",
        "कॉन्फिडेंस इंटरवल विचरण ट्रैकिंग",
        "रियल-टाइम टेलीमेट्री पल्स स्ट्रीम",
      ],
      icon: <Eye className="w-5 h-5 text-[#F97316]" />,
      metric: "99.98%",
      metricLabel: "Render Precision",
    },
    {
      id: "collaboration",
      title: "Collaboration",
      titleHi: "सहयोग",
      badge: "SHARED CONSENSUS",
      badgeHi: "साझा सहमति",
      description:
        "Empower cross-functional executive, marketing, and product teams to deliberate on high-stakes market movements with structured consensus feeds.",
      descriptionHi:
        "संरचित सहमति फ़ीड के साथ महत्वपूर्ण बाज़ार परिवर्तनों पर विचार-विमर्श करने के लिए क्रॉस-फ़ंक्शनल टीमों को सशक्त बनाएं।",
      bullets: [
        "Cryptographically weighted community voting",
        "Fact auditor dispute resolution",
        "Context-preserving shared workspace dossiers",
      ],
      bulletsHi: [
        "क्रिप्टोग्राफ़िक रूप से भारित समुदाय वोटिंग",
        "तथ्य ऑडिटर विवाद समाधान",
        "संदर्भ-सुरक्षित साझा कार्यक्षेत्र डोजियर",
      ],
      icon: <Users2 className="w-5 h-5 text-[#F97316]" />,
      metric: "148+",
      metricLabel: "Active Working Groups",
    },
    {
      id: "scalable-platform",
      title: "Scalable Platform",
      titleHi: "स्केलेबल प्लेटफॉर्म",
      badge: "CLOUD NATIVE",
      badgeHi: "क्लाउड नेटिव",
      description:
        "Built on distributed edge architecture with zero-latency failover, hardened rate-limiting, and turnkey REST/WebSocket ingestion pipelines.",
      descriptionHi:
        "जीरो-लेटेंसी फेलओवर, सुरक्षित दर-सीमा और रेडी-टू-यूज आरईएसटी/वेबसॉकेट इंजेक्शन पाइपलाइनों के साथ वितरित एज आर्किटेक्चर पर निर्मित।",
      bullets: [
        "Multi-region geo-distributed endpoints",
        "Encrypted ephemeral memory tier",
        "99.9% guaranteed uptime SLA",
      ],
      bulletsHi: [
        "मल्टी-रीजन जियो-डिस्ट्रिब्यूटेड एंडपॉइंट्स",
        "एन्क्रिप्टेड क्षणिक मेमोरी टियर",
        "99.9% गारंटीकृत अपटाइम एसएलए",
      ],
      icon: <Layers className="w-5 h-5 text-[#F97316]" />,
      metric: "<18ms",
      metricLabel: "Global P99 Latency",
    },
  ];

  return (
    <section className="space-y-8 rounded-3xl p-6 sm:p-10 bg-white border border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#0B1220] [html[data-theme='dark']_&]:border-[#1E293B] shadow-sm">
      {/* Section Header (Section 10) */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#1E293B]">
        <div className="space-y-3 max-w-2xl">
          <div className="kicker">
            <span className="text-[#F97316] font-mono font-bold">SOLUTIONS</span>
            <span>&bull;</span>
            <span className="text-[#F59E0B] font-mono font-bold">CAPABILITY MATRIX</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white">
            {isHi ? "स्मार्ट इंटेलिजेंस के लिए " : "Everything You Need for "}
            <span className="text-[#F97316]">{isHi ? "सब कुछ जो" : "Smarter"}</span>{" "}
            <span className="text-[#F59E0B]">{isHi ? "आपको चाहिए।" : "Intelligence."}</span>
          </h2>

          <p className="text-base text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] leading-relaxed">
            {isHi
              ? "डेटा अंतर्दृष्टि से लेकर वास्तविक सहयोग तक, हाइप पोर्टल आपके संगठन को तेज़ और अधिक सूचित निर्णय लेने में मदद करता है।"
              : "From raw signal ingestion to unified cross-team consensus, HYPE PORTAL provides an integrated matrix for high-confidence executive strategy."}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs shrink-0">
          {solutions.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playVoteClick();
                setActiveTab(idx);
              }}
              className={`px-4 py-2 rounded-full border transition-all cursor-pointer font-medium ${
                activeTab === idx
                  ? "bg-[#F97316] border-[#F97316] text-white shadow-sm"
                  : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:text-[#CBD5E1] [html[data-theme='dark']_&]:hover:text-white"
              }`}
            >
              {isHi ? item.titleHi : item.title}
            </button>
          ))}
        </div>
      </div>

      {/* 4 Solutions Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {solutions.map((sol, index) => {
          const isSelected = activeTab === index;
          return (
            <div
              key={sol.id}
              onClick={() => {
                sound.playVoteClick();
                setActiveTab(index);
              }}
              className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 cursor-pointer ${
                isSelected
                  ? "bg-[#FFF7ED] border-[#F97316] shadow-md [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#F97316]"
                  : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#F97316]/40 [html[data-theme='dark']_&]:bg-[#1E293B]/50 [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:hover:border-[#F97316]/40"
              }`}
            >
              {/* Header: Icon & Badge */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white [html[data-theme='dark']_&]:bg-[#0B1220] border border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] flex items-center justify-center shadow-xs">
                    {sol.icon}
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-1 rounded-md bg-white [html[data-theme='dark']_&]:bg-[#0B1220] border border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] text-[#F59E0B]">
                    {isHi ? sol.badgeHi : sol.badge}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#0F172A] [html[data-theme='dark']_&]:text-white">
                    {isHi ? sol.titleHi : sol.title}
                  </h3>
                  <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] leading-relaxed">
                    {isHi ? sol.descriptionHi : sol.description}
                  </p>
                </div>
              </div>

              {/* Bullet Features */}
              <div className="space-y-2 pt-2 border-t border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155]">
                {(isHi ? sol.bulletsHi : sol.bullets).map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2 text-xs text-[#0F172A] [html[data-theme='dark']_&]:text-[#CBD5E1]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#F97316] shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              {/* Metric Card */}
              <div className="pt-3 border-t border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] flex items-center justify-between">
                <div>
                  <div className="text-xl font-bold text-[#F97316] font-mono">{sol.metric}</div>
                  <div className="text-[10px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]">{sol.metricLabel}</div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white [html[data-theme='dark']_&]:bg-[#0B1220] border border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] flex items-center justify-center text-[#F97316] [html[data-theme='dark']_&]:text-[#F59E0B]">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
