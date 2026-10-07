"use client";

import React from "react";
import { Database, BarChart3, FileSpreadsheet, ShieldCheck, ArrowRight } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

interface FeatureItem {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: React.ReactNode;
  tag: string;
  tagHi: string;
}

export default function FeatureCards() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const features: FeatureItem[] = [
    {
      id: "data-agg",
      title: "Data Aggregation",
      titleHi: "डेटा एकत्रीकरण",
      description:
        "Seamlessly harmonize streaming culture telemetry, real-time social sentiment, and multi-source creator signals into a unified data foundation.",
      descriptionHi:
        "स्ट्रीमिंग कल्चर टेलीमेट्री, सोशल सेंटिमेंट और क्रिएटर सिग्नल्स को एक एकीकृत डेटा प्लेटफॉर्म में सहजता से संयोजित करें।",
      icon: <Database className="w-5 h-5 text-[#F97316]" />,
      tag: "PIPELINE 01",
      tagHi: "पाइपलाइन 01",
    },
    {
      id: "adv-analytics",
      title: "Advanced Analytics",
      titleHi: "उन्नत एनालिटिक्स",
      description:
        "Deploy high-velocity predictive models, sentiment dispersion vectors, and neural hype metrics to identify explosive shifts before saturation.",
      descriptionHi:
        "संतृप्ति से पहले बड़े बदलावों की पहचान के लिए उच्च-वेग भविष्य कहनेवाला मॉडल और तंत्रिका हाइप मेट्रिक्स तैनात करें।",
      icon: <BarChart3 className="w-5 h-5 text-[#F97316]" />,
      tag: "PREDICTIVE",
      tagHi: "पूर्वानुमान",
    },
    {
      id: "custom-reports",
      title: "Custom Reports",
      titleHi: "कस्टम रिपोर्ट्स",
      description:
        "Generate executive-grade intelligence dossiers, veracity audit scorecards, and viral narrative breakdowns with a single click.",
      descriptionHi:
        "एक क्लिक में कार्यकारी स्तर के इंटेलिजेंस डोजियर, सत्यता ऑडिट स्कोरकार्ड और वायरल नैरेटिव विश्लेषण उत्पन्न करें।",
      icon: <FileSpreadsheet className="w-5 h-5 text-[#F97316]" />,
      tag: "EXECUTIVE",
      tagHi: "एग्जीक्यूटिव",
    },
    {
      id: "secure-reliable",
      title: "Secure & Reliable",
      titleHi: "सुरक्षित और विश्वसनीय",
      description:
        "Enterprise-grade zero-trust infrastructure, cryptographic audit logs, 99.9% uptime SLA, and automated ephemeral chat security.",
      descriptionHi:
        "एंटरप्राइज-ग्रेड ज़ीरो-ट्रस्ट इंफ्रास्ट्रक्चर, क्रिप्टोग्राफ़िक ऑडिट लॉग्स, 99.9% अपटाइम एसएलए और स्वचालित सुरक्षा।",
      icon: <ShieldCheck className="w-5 h-5 text-[#F97316]" />,
      tag: "ENCRYPTED",
      tagHi: "एन्क्रिप्टेड",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Eyebrow & Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="kicker">
            <span className="text-[#F97316] font-mono font-bold">CORE CAPABILITIES</span>
            <span>&bull;</span>
            <span className="text-[#F59E0B] font-mono font-bold">INTELLIGENCE SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--foreground)]">
            {isHi ? "एंटरप्राइज-ग्रेड इंटेलिजेंस इंजन" : "Engineered for Enterprise Decision Systems"}
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] max-w-2xl leading-relaxed">
            {isHi
              ? "चार शक्तिशाली स्तंभ जो कच्चे सांस्कृतिक शोर को कार्रवाई योग्य रणनीतिक स्पष्टता में बदल देते हैं।"
              : "Four mission-critical capabilities translating volatile cultural velocity into reliable, quantifiable intelligence."}
          </p>
        </div>
      </div>

      {/* 4 Feature Cards Grid (Section 09 Specifications) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => sound.playVoteClick()}
            className="group relative p-6 rounded-2xl border transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between space-y-5 hover:-translate-y-1 shadow-sm
              bg-white border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155] [html[data-theme='dark']_&]:hover:border-[#F97316]/50"
          >
            {/* Top Row: Icon Container & Tag */}
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-xl bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#0B1220] border border-[#F97316]/20 flex items-center justify-center transition-colors group-hover:border-[#F97316]/60">
                {feature.icon}
              </div>
              <span className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md bg-[#F8FAFC] [html[data-theme='dark']_&]:bg-[#0B1220] border border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] text-[var(--muted-foreground)] font-semibold">
                {isHi ? feature.tagHi : feature.tag}
              </span>
            </div>

            {/* Middle: Title & Body */}
            <div className="space-y-2.5">
              <h3 className="text-lg font-bold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white group-hover:text-[#F97316] transition-colors">
                {isHi ? feature.titleHi : feature.title}
              </h3>
              <p className="text-xs leading-relaxed text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]">
                {isHi ? feature.descriptionHi : feature.description}
              </p>
            </div>

            {/* Bottom Row: Link Arrow */}
            <div className="pt-3 border-t border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] flex items-center justify-between text-xs font-semibold">
              <span className="text-[11px] font-mono text-[var(--muted-foreground)] group-hover:text-[#F97316] transition-colors">
                {isHi ? "सिस्टम देखें" : "Explore system"}
              </span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[#F97316] [html[data-theme='dark']_&]:text-[#F59E0B] group-hover:translate-x-1 transition-transform">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
