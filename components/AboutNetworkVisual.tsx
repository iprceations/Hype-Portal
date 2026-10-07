"use client";

import React, { useState } from "react";
import { Globe, Users, Cpu, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

export default function AboutNetworkVisual() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    { id: "node-1", cx: 120, cy: 110, label: "San Francisco", ping: "8ms", signal: "94%" },
    { id: "node-2", cx: 280, cy: 90, label: "London", ping: "14ms", signal: "98%" },
    { id: "node-3", cx: 440, cy: 130, label: "Bengaluru", ping: "18ms", signal: "99.4%" },
    { id: "node-4", cx: 580, cy: 105, label: "Tokyo", ping: "12ms", signal: "96%" },
    { id: "node-5", cx: 330, cy: 200, label: "Dubai", ping: "16ms", signal: "97.8%" },
  ];

  return (
    <section className="rounded-3xl p-6 sm:p-12 border transition-all duration-300 relative overflow-hidden shadow-sm
      bg-[#F8FAFC] border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#0B1220] [html[data-theme='dark']_&]:border-[#1E293B]">
      
      {/* Background Subtle Gradient Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-[#F97316]/10 to-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left Column: Headline & Value Proposition */}
        <div className="space-y-6">
          <div className="kicker">
            <span className="text-[#F97316] font-mono font-bold">
              {isHi ? "हाइप पोर्टल के बारे में" : "ABOUT HYPE PORTAL"}
            </span>
            <span>&bull;</span>
            <span className="text-[#F59E0B] font-mono font-bold">
              {isHi ? "इंटेलिजेंस मैट्रिक्स" : "INTELLIGENCE MATRIX"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0F172A] [html[data-theme='dark']_&]:text-white leading-[1.1]">
            {isHi ? "लोगों, डेटा और विचारों को " : "Connecting People, "}
            <span className="text-[#F97316] [html[data-theme='dark']_&]:text-[#F59E0B]">
              {isHi ? "जोड़ना।" : "Data and Ideas."}
            </span>
          </h2>

          <p className="text-base leading-relaxed text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] max-w-xl">
            {isHi
              ? "हाइप पोर्टल केवल एक डैशबोर्ड नहीं है — यह संस्कृति, क्रिएटर अर्थव्यवस्था और बाज़ार संकेतों के चौराहे पर बना एक बुद्धिमत्ता मंच है। हम शोर को छानकर केवल सच और संकेत प्रस्तुत करते हैं।"
              : "HYPE PORTAL operates as an enterprise intelligence command system spanning global creator clusters, conversational discourse, and consumer trends. We eliminate speculative hype, delivering verified telemetry and strategic conviction."}
          </p>

          {/* 3 Pillars Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155]">
              <div className="text-lg font-bold text-[#F97316]">1.2M+</div>
              <div className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium">
                {isHi ? "दावे ट्रैक किए गए" : "Claims Tracked"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155]">
              <div className="text-lg font-bold text-[#F59E0B]">99.9%</div>
              <div className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium">
                {isHi ? "टेलीमेट्री एसएलए" : "Telemetry SLA"}
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-[#E2E8F0] [html[data-theme='dark']_&]:bg-[#1E293B] [html[data-theme='dark']_&]:border-[#334155]">
              <div className="text-lg font-bold text-[#0F172A] [html[data-theme='dark']_&]:text-white">500+</div>
              <div className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-medium">
                {isHi ? "संगठन" : "Organizations"}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Connected Globe & Telemetry Network Visual (Section 20) */}
        <div className="p-6 rounded-2xl bg-[#0B1220] border border-[#1E293B] shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#1E293B]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-ping" />
              <span className="text-white font-semibold">GLOBAL TELEMETRY MESH</span>
            </div>
            <span className="text-[#F59E0B]">Live Sync</span>
          </div>

          {/* SVG Connected World Visual */}
          <div className="relative w-full h-64 flex items-center justify-center">
            <svg viewBox="0 0 700 280" className="w-full h-full overflow-visible">
              {/* Globe Outline Rings */}
              <circle cx="350" cy="140" r="120" fill="none" stroke="#1E293B" strokeWidth="1.5" />
              <circle cx="350" cy="140" r="80" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
              <ellipse cx="350" cy="140" rx="120" ry="40" fill="none" stroke="#1E293B" strokeWidth="1" />
              <ellipse cx="350" cy="140" rx="40" ry="120" fill="none" stroke="#1E293B" strokeWidth="1" />

              {/* Connected Orange Network Lines */}
              <line x1="120" y1="110" x2="280" y2="90" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="280" y1="90" x2="440" y2="130" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="440" y1="130" x2="580" y2="105" stroke="#F97316" strokeWidth="1.5" strokeOpacity="0.7" />
              <line x1="280" y1="90" x2="330" y2="200" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 2" />
              <line x1="440" y1="130" x2="330" y2="200" stroke="#F59E0B" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="4 2" />

              {/* Pulsing Central Hub Ring */}
              <circle cx="350" cy="140" r="6" fill="#F97316" />
              <circle cx="350" cy="140" r="14" fill="none" stroke="#F97316" strokeWidth="1.5" opacity="0.4" className="animate-ping" />

              {/* Interactive Gold Nodes */}
              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                return (
                  <g
                    key={node.id}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isHovered ? 7 : 5}
                      fill="#F59E0B"
                      stroke="#0B1220"
                      strokeWidth="2"
                    />
                    <text
                      x={node.cx}
                      y={node.cy - 12}
                      textAnchor="middle"
                      fill="#CBD5E1"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Node Status Pill */}
          <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs font-mono text-[#CBD5E1]">
            <div className="flex items-center gap-2">
              <span className="text-[#F97316] font-bold">5 Global Hubs Active</span>
              <span className="text-[#334155]">&bull;</span>
              <span>18ms Mean Latency</span>
            </div>
            <span className="text-[#F59E0B]">Encrypted Tunnel</span>
          </div>
        </div>
      </div>
    </section>
  );
}
