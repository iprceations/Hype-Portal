"use client";

import React from "react";
import Link from "next/link";
import { useThemeAndLang } from "@/lib/themeContext";

interface LogoProps {
  variant?: "full" | "icon" | "responsive";
  size?: "sm" | "md" | "lg";
  showLiveBadge?: boolean;
  className?: string;
  href?: string;
  forceDark?: boolean;
}

// Authentic Vector Icon Mark as standalone reusable component
export function HypeIconMark({
  className = "w-full h-full",
  isDark = true,
  style,
}: {
  className?: string;
  isDark?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <defs>
        <linearGradient id="hpBrandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Sweeping Telemetry Orbit Arc */}
      <path
        d="M 17 62 C 19 36 38 18 63 18 C 76 18 86 28 85 48 C 84 62 78 76 66 87"
        stroke={isDark ? "#475569" : "#CBD5E1"}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Dual Orbital Planetary Nodes */}
      <circle cx="63.5" cy="18" r="4" fill="#F97316" />
      <circle cx="63.5" cy="18" r="1.6" fill="#FFFFFF" />

      <circle cx="78" cy="27" r="4" fill="#F59E0B" />
      <circle cx="78" cy="27" r="1.6" fill="#FFFFFF" />

      {/* Main Body of H (#1E293B on light, #FFFFFF on dark) */}
      <g fill={isDark ? "#FFFFFF" : "#1E293B"}>
        <path d="M 28 44 H 38 V 76 H 28 Z" />
        <path d="M 38 54 H 54 V 63 H 38 Z" />
        <path d="M 54 54 H 64 V 76 H 54 Z" />
      </g>

      {/* Dynamic Aerodynamic Slash Wing on Top Right (#F97316 Brilliant Orange) */}
      <path d="M 54 40 H 78.5 L 71 49 H 54 Z" fill="#F97316" />
    </svg>
  );
}

export default function Logo({
  variant = "responsive",
  size = "md",
  showLiveBadge = false,
  className = "",
  href = "/",
  forceDark = false,
}: LogoProps) {
  const { resolvedTheme, language } = useThemeAndLang();
  const isDark = forceDark || resolvedTheme !== "day";
  const isHi = language === "hi";

  // Dimension presets for the icon mark
  const iconDimensions = {
    sm: "w-8 h-8",
    md: "w-9 h-9 sm:w-10 sm:h-10",
    lg: "w-12 h-12",
  };

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group select-none ${className}`}>
      {/* 1. Standalone / Responsive Icon Mark */}
      {(variant === "icon" || variant === "responsive") && (
        <div
          className={`relative ${iconDimensions[size]} shrink-0 transition-transform duration-200 group-hover:scale-105`}
        >
          <HypeIconMark isDark={isDark} className="w-full h-full relative z-10" />
        </div>
      )}

      {/* 2. Responsive Typography Lockup (HYPE PORTAL / हाइप पोर्टल + Intelligence Matrix / इंटेलिजेंस मैट्रिक्स) */}
      {(variant === "full" || variant === "responsive") && (
        <div className="flex flex-col justify-center">
          <div className={`flex items-center gap-1.5 ${isHi ? "leading-tight" : "leading-none"}`}>
            {/* HYPE / हाइप in #1E293B on light, #FFFFFF on dark */}
            <span
              suppressHydrationWarning
              className={`${
                isHi
                  ? "font-hindi font-bold tracking-normal"
                  : "font-sans font-black tracking-[0.14em] uppercase"
              } transition-colors ${
                isDark ? "text-white" : "text-[#1E293B]"
              } ${
                size === "sm"
                  ? isHi ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                  : size === "lg"
                  ? isHi ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  : isHi ? "text-base sm:text-lg" : "text-sm sm:text-base"
              }`}
            >
              {isHi ? "हाइप" : "HYPE"}
            </span>

            {/* PORTAL / पोर्टल in Brilliant Orange Accent (#F97316) */}
            <span
              suppressHydrationWarning
              className={`${
                isHi
                  ? "font-hindi font-bold tracking-normal"
                  : "font-sans font-extrabold tracking-[0.22em] uppercase"
              } text-[#F97316] group-hover:text-[#EA580C] transition-colors ${
                size === "sm"
                  ? isHi ? "text-sm sm:text-base" : "text-xs sm:text-sm"
                  : size === "lg"
                  ? isHi ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
                  : isHi ? "text-base sm:text-lg" : "text-sm sm:text-base"
              }`}
            >
              {isHi ? "पोर्टल" : "PORTAL"}
            </span>
          </div>

          {/* Subtitle: Intelligence Matrix / इंटेलिजेंस मैट्रिक्स */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1px] w-3 bg-[#F97316]/50 hidden xs:block" />
            <span
              suppressHydrationWarning
              className={`${
                isHi
                  ? "font-hindi font-semibold text-[9.5px] sm:text-[11px] tracking-normal"
                  : "font-mono font-semibold text-[8px] sm:text-[9.5px] tracking-[0.2em] uppercase"
              } ${
                isDark ? "text-[#CBD5E1]" : "text-[#64748B]"
              } whitespace-nowrap`}
            >
              {isHi ? "इंटेलिजेंस मैट्रिक्स" : "Intelligence Matrix"}
            </span>
            <span className="h-[1px] w-3 bg-[#F97316]/50 hidden xs:block" />
          </div>
        </div>
      )}

      {/* Optional Live Pulse Indicator */}
      {showLiveBadge && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-[10px] font-mono font-semibold ml-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
          </span>
          <span className="tracking-wider uppercase">LIVE</span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] rounded-xl">
        {content}
      </Link>
    );
  }

  return content;
}
