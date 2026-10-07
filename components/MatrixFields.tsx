"use client";

import React from "react";
import { sound } from "@/lib/audio";
import { ArrowUpRight, Flame, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useThemeAndLang } from "@/lib/themeContext";
import SignalFieldRadar from "./SignalFieldRadar";

interface MatrixField {
  id: string;
  fieldNumber: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accentColor: string;
  badgeBg: string;
  linkText: string;
  href: string;
  stat: string;
}

export default function MatrixFields() {
  const { t, language } = useThemeAndLang();
  const isHi = language === "hi";

  const fieldsData: MatrixField[] = [
    {
      id: "culture",
      fieldNumber: isHi ? "फ़ील्ड 01 / 03" : "FIELD 01 / 03",
      title: t("field1Title"),
      subtitle: t("field1Sub"),
      description: t("field1Desc"),
      icon: <Flame className="w-4 h-4 text-[#F97316]" />,
      accentColor: "border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] text-[#F97316]",
      badgeBg: "bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#1E293B]",
      linkText: t("field1Link"),
      href: "/debates",
      stat: isHi ? "148+ सक्रिय बहस" : "148+ Active Debates",
    },
    {
      id: "creators",
      fieldNumber: isHi ? "फ़ील्ड 02 / 03" : "FIELD 02 / 03",
      title: t("field2Title"),
      subtitle: t("field2Sub"),
      description: t("field2Desc"),
      icon: <Users className="w-4 h-4 text-[#F97316]" />,
      accentColor: "border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] text-[#F97316]",
      badgeBg: "bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#1E293B]",
      linkText: t("field2Link"),
      href: "/vault",
      stat: isHi ? "920+ प्रॉम्प्ट संग्रह" : "920+ Prompt Curations",
    },
    {
      id: "commerce",
      fieldNumber: isHi ? "फ़ील्ड 03 / 03" : "FIELD 03 / 03",
      title: t("field3Title"),
      subtitle: t("field3Sub"),
      description: t("field3Desc"),
      icon: <TrendingUp className="w-4 h-4 text-[#F97316]" />,
      accentColor: "border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] text-[#F97316]",
      badgeBg: "bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#1E293B]",
      linkText: t("field3Link"),
      href: "/roast",
      stat: isHi ? "48K+ ऑडिट संपन्न" : "48K+ Audits Conducted",
    },
  ];

  return (
    <section className="space-y-8">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div className="space-y-2">
          <div className="kicker">
            <span className="text-[#F97316] font-mono font-bold">01</span>
            <span>{t("matrixKicker")}</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.065em] text-[var(--foreground)] leading-[1.02]">
            {t("matrixHeading1")}{" "}
            <span className="text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 font-normal">
              {t("matrixHeading2")}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 max-w-xl leading-relaxed">
            {t("matrixDesc")}
          </p>
        </div>

        <div className="font-mono text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60 shrink-0">
          <span>{isHi ? "त्रि-आयामी सिग्नल इंजन" : "TRI-VECTOR SIGNAL ENGINE"}</span>
        </div>
      </div>

      {/* Interactive Animated Signal Field Orbital Radar Matrix Centerpiece */}
      <SignalFieldRadar />

      {/* 3-Column Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {fieldsData.map((field) => (
          <article
            key={field.id}
            className="group relative rounded-2xl p-6 matrix-card transition-all duration-300 flex flex-col justify-between space-y-6 overflow-hidden hover:-translate-y-1"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between font-mono text-xs">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${field.accentColor} ${field.badgeBg}`}
              >
                {field.icon}
              </div>
              <span className="text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60 font-mono tracking-wider">
                {field.fieldNumber}
              </span>
            </div>

            {/* Middle Graphic & Copy */}
            <div className="space-y-3">
              <div className="space-y-0.5">
                <h3 className="text-2xl font-semibold text-[var(--foreground)] tracking-tight">
                  {field.title}
                </h3>
                <div className="text-sm font-medium text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70 italic">
                  {field.subtitle}
                </div>
              </div>
              <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 leading-relaxed">
                {field.description}
              </p>
            </div>

            {/* Bottom Stat & Link */}
            <div className="pt-3 border-t border-[#E2E8F0] [html[data-theme='dark']_&]:border-[#334155] flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/60">{field.stat}</span>
              <Link
                href={field.href}
                onClick={() => sound.playVoteClick()}
                className="inline-flex items-center gap-1.5 font-bold text-[#F97316] hover:text-[#EA580C] [html[data-theme='dark']_&]:hover:text-[#F59E0B] transition-colors"
              >
                <span>{field.linkText}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
