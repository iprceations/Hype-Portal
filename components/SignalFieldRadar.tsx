"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { sound } from "@/lib/audio";
import { useThemeAndLang } from "@/lib/themeContext";
import { ArrowUpRight } from "lucide-react";

interface SignalFieldRadarProps {
  onFieldSelect?: (fieldId: string) => void;
}

export default function SignalFieldRadar({ onFieldSelect }: SignalFieldRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeField, setActiveField] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  // Update real-time timestamp for PATTERN DETECTED NOW
  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Mouse tracking for subtle 2.5D orbital deflection
    let mouseX = width / 2;
    let mouseY = height / 2;
    let curOffsetX = 0;
    let curOffsetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = width / 2;
      mouseY = height / 2;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    // Master UI/UX Palette Orbits (#F97316 Brilliant Orange, #1E293B Charcoal Blue, #F59E0B Gold, #334155 Grid, #FFFFFF)
    const orbits = [
      {
        id: "culture",
        rxFactor: 0.44,
        ryFactor: 0.29,
        rotation: -0.48,
        speed: 0.007,
        angle: 1.8,
        trail: [] as { x: number; y: number }[],
        color: "#F97316",
        satColor: "#FFFFFF",
        satGlow: "rgba(249, 115, 22, 0.45)",
        satSize: 4.5,
      },
      {
        id: "creators",
        rxFactor: 0.46,
        ryFactor: 0.27,
        rotation: 0.42,
        speed: -0.0055,
        angle: 4.2,
        trail: [] as { x: number; y: number }[],
        color: "#F59E0B",
        satColor: "#F97316",
        satGlow: "rgba(245, 158, 11, 0.45)",
        satSize: 4,
      },
      {
        id: "commerce",
        rxFactor: 0.47,
        ryFactor: 0.35,
        rotation: 1.12,
        speed: 0.0062,
        angle: 0.5,
        trail: [] as { x: number; y: number }[],
        color: "#F97316",
        satColor: "#F59E0B",
        satGlow: "rgba(245, 158, 11, 0.45)",
        satSize: 5,
      },
    ];

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse damping
      const targetOffsetX = (mouseX - width / 2) * 0.04;
      const targetOffsetY = (mouseY - height / 2) * 0.04;
      curOffsetX += (targetOffsetX - curOffsetX) * 0.06;
      curOffsetY += (targetOffsetY - curOffsetY) * 0.06;

      const centerX = width / 2 + curOffsetX;
      const centerY = height / 2 + curOffsetY;

      // 1. Subtle horizontal axis guideline passing behind the matrix (#334155)
      ctx.beginPath();
      ctx.moveTo(centerX - width * 0.46, centerY);
      ctx.lineTo(centerX + width * 0.46, centerY);
      ctx.strokeStyle = "rgba(51, 65, 85, 0.4)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Subtle vertical axis guideline
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - height * 0.42);
      ctx.lineTo(centerX, centerY + height * 0.42);
      ctx.strokeStyle = "rgba(51, 65, 85, 0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. Central Radar Sonar Waves (Concentric expanding ripples in #F97316 Orange)
      const ringCount = 7;
      for (let i = 0; i < ringCount; i++) {
        const phase = (tick * 0.006 + i / ringCount) % 1;
        const radius = 32 + phase * 145;
        const opacity = Math.sin(phase * Math.PI) * 0.24 * (1 - phase * 0.6);

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(249, 115, 22, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 3. Central Radial Glow (#F97316 Orange aura)
      const coreAura = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        110
      );
      coreAura.addColorStop(0, "rgba(249, 115, 22, 0.16)");
      coreAura.addColorStop(0.5, "rgba(245, 158, 11, 0.08)");
      coreAura.addColorStop(1, "rgba(11, 18, 32, 0)");

      ctx.fillStyle = coreAura;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 110, 0, Math.PI * 2);
      ctx.fill();

      // 4. Render the 3 Intersecting Orbital Ellipses
      orbits.forEach((orbit) => {
        const rx = width * orbit.rxFactor;
        const ry = height * orbit.ryFactor;
        const isTargeted = activeField === orbit.id;

        // Draw elliptical path
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(orbit.rotation);

        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

        if (isTargeted) {
          ctx.strokeStyle = orbit.color;
          ctx.lineWidth = 1.75;
          ctx.shadowColor = orbit.color;
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = "rgba(51, 65, 85, 0.5)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.restore();

        // 5. Update and Draw Orbiting Photon Satellites
        orbit.angle += orbit.speed;

        const lx = rx * Math.cos(orbit.angle);
        const ly = ry * Math.sin(orbit.angle);
        const satX = centerX + lx * Math.cos(orbit.rotation) - ly * Math.sin(orbit.rotation);
        const satY = centerY + lx * Math.sin(orbit.rotation) + ly * Math.cos(orbit.rotation);

        orbit.trail.push({ x: satX, y: satY });
        if (orbit.trail.length > 8) {
          orbit.trail.shift();
        }

        // Draw subtle satellite velocity trail
        if (orbit.trail.length > 1) {
          for (let t = 0; t < orbit.trail.length - 1; t++) {
            const p1 = orbit.trail[t];
            const p2 = orbit.trail[t + 1];
            const trailAlpha = (t / orbit.trail.length) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(249, 115, 22, ${trailAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Radiant glow aura on satellite
        const satGlowGrad = ctx.createRadialGradient(
          satX,
          satY,
          0,
          satX,
          satY,
          orbit.satSize * 3.5
        );
        satGlowGrad.addColorStop(0, orbit.satGlow);
        satGlowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = satGlowGrad;
        ctx.beginPath();
        ctx.arc(satX, satY, orbit.satSize * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Core satellite photon dot
        ctx.fillStyle = orbit.satColor;
        ctx.beginPath();
        ctx.arc(satX, satY, orbit.satSize, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [activeField]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] sm:h-[540px] md:h-[580px] rounded-3xl border border-[#1E293B] bg-[#0B1220] overflow-hidden select-none shadow-2xl transition-all telemetry-viewport"
      aria-label="Signal Field 01-03 Orbital Radar"
    >
      {/* 60 FPS HTML5 Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none z-0" />

      {/* Radial Corner Vignette in Dark Navy (#0B1220) */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#0B1220]/40 to-[#0B1220]/90 pointer-events-none z-0" />

      {/* Top Left: SIGNAL FIELD 01-03 Kicker */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2.5 font-mono text-xs tracking-wider">
        <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F97316] animate-pulse" />
        <span className="text-[#CBD5E1] font-semibold uppercase">
          {isHi ? "सिग्नल फ़ील्ड" : "SIGNAL FIELD"}
        </span>
        <span className="text-[#F97316] font-black tracking-widest">01—03</span>
      </div>

      {/* Bottom Right: PATTERN DETECTED NOW */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-10 flex items-center gap-2 font-mono text-[11px] sm:text-xs tracking-widest text-[#CBD5E1]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]" />
        </span>
        <span className="uppercase text-white">
          {isHi ? "पैटर्न डिटेक्टेड" : "PATTERN DETECTED"}
        </span>
        <span className="text-[#F59E0B] font-black uppercase">
          {isHi ? "सक्रिय" : "NOW"}
        </span>
        {currentTime && (
          <span className="text-[#64748B] font-mono text-[10px] hidden sm:inline ml-1">
            [{currentTime}]
          </span>
        )}
      </div>

      {/* Center Core: HYPE PORTAL Brand Mark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center text-center cursor-pointer group"
        onClick={() => sound.playVoteClick()}
        title="HYPE PORTAL — Intelligence Matrix Core"
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Ambient Core Aura (#F97316) */}
          <div className="absolute inset-0 rounded-full bg-[#F97316]/20 blur-xl group-hover:scale-125 transition-transform duration-300" />

          {/* Authentic Vector Icon Mark */}
          <svg
            viewBox="0 0 100 100"
            className="w-14 h-14 group-hover:scale-110 transition-transform duration-300"
            fill="none"
          >
            {/* Orbit Arc in #334155 */}
            <path
              d="M 17 62 C 19 36 38 18 63 18 C 76 18 86 28 85 48 C 84 62 78 76 66 87"
              stroke="#334155"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Satellite Nodes in #F97316 and #F59E0B */}
            <circle cx="63.5" cy="18" r="4.5" fill="#F97316" />
            <circle cx="63.5" cy="18" r="2" fill="#FFFFFF" />
            <circle cx="78" cy="27" r="4.5" fill="#F59E0B" />
            <circle cx="78" cy="27" r="2" fill="#FFFFFF" />

            {/* Body of H in #FFFFFF */}
            <path d="M 28 44 H 38 V 76 H 28 Z" fill="#FFFFFF" />
            <path d="M 38 54 H 54 V 63 H 38 Z" fill="#FFFFFF" />
            <path d="M 54 54 H 64 V 76 H 54 Z" fill="#FFFFFF" />

            {/* Brilliant Orange Wing in #F97316 */}
            <path d="M 54 40 H 78.5 L 71 49 H 54 Z" fill="#F97316" />
          </svg>
        </div>

        {/* Stacked Monospace / Hindi Typography */}
        <div
          suppressHydrationWarning
          className={`${
            isHi
              ? "font-hindi font-bold text-sm tracking-normal"
              : "font-sans text-[12px] font-black tracking-[0.24em] uppercase"
          } text-white mt-1 group-hover:text-[#F97316] transition-colors`}
        >
          {isHi ? "हाइप" : "HYPE"}
        </div>
        <div
          suppressHydrationWarning
          className={`${
            isHi
              ? "font-hindi font-bold text-xs tracking-normal"
              : "font-sans text-[9.5px] font-extrabold tracking-[0.28em] uppercase"
          } text-[#F97316] -mt-0.5 transition-colors`}
        >
          {isHi ? "पोर्टल" : "PORTAL"}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3 FLOATING INTERACTIVE ORBITAL BADGES: CULTURE, CREATORS, COMMERCE       */}
      {/* ========================================================================= */}

      {/* 1. CULTURE BADGE */}
      <div
        className="absolute top-[20%] left-[10%] sm:top-[22%] sm:left-[14%] md:left-[17%] z-20"
        onMouseEnter={() => setActiveField("culture")}
        onMouseLeave={() => setActiveField(null)}
      >
        <Link
          href="/debates"
          onClick={() => {
            sound.playVoteClick();
            onFieldSelect?.("culture");
          }}
          className={`group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            activeField === "culture"
              ? "border-[#F97316] bg-[#F97316]/25 text-white scale-105"
              : "border-[#1E293B] hover:border-[#F97316] bg-[#1E293B]/90 text-[#CBD5E1] hover:text-white"
          }`}
          title={isHi ? "संस्कृति (Culture) - बहस व ट्रेंड्स देखें" : "Culture Field - View Debates"}
        >
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#F97316] group-hover:scale-125 transition-transform" />
          <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white group-hover:text-[#F97316] transition-colors uppercase">
            {isHi ? "CULTURE • संस्कृति" : "CULTURE"}
          </span>
          <ArrowUpRight className="w-3 h-3 text-[#64748B] group-hover:text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2. CREATORS BADGE */}
      <div
        className="absolute top-[30%] right-[6%] sm:top-[32%] sm:right-[10%] md:right-[13%] z-20"
        onMouseEnter={() => setActiveField("creators")}
        onMouseLeave={() => setActiveField(null)}
      >
        <Link
          href="/vault"
          onClick={() => {
            sound.playVoteClick();
            onFieldSelect?.("creators");
          }}
          className={`group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            activeField === "creators"
              ? "border-[#F59E0B] bg-[#F59E0B]/25 text-white scale-105"
              : "border-[#1E293B] hover:border-[#F59E0B] bg-[#1E293B]/90 text-[#CBD5E1] hover:text-white"
          }`}
          title={isHi ? "क्रिएटर्स (Creators) - प्रॉम्प्ट वॉल्ट खोलें" : "Creators Field - Open Prompt Vault"}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] group-hover:scale-125 transition-transform" />
          <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white group-hover:text-[#F59E0B] transition-colors uppercase">
            {isHi ? "CREATORS • क्रिएटर्स" : "CREATORS"}
          </span>
          <ArrowUpRight className="w-3 h-3 text-[#64748B] group-hover:text-[#F59E0B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3. COMMERCE BADGE */}
      <div
        className="absolute bottom-[22%] left-[16%] sm:bottom-[24%] sm:left-[22%] md:left-[25%] z-20"
        onMouseEnter={() => setActiveField("commerce")}
        onMouseLeave={() => setActiveField(null)}
      >
        <Link
          href="/roast"
          onClick={() => {
            sound.playVoteClick();
            onFieldSelect?.("commerce");
          }}
          className={`group flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
            activeField === "commerce"
              ? "border-[#F97316] bg-[#F97316]/25 text-white scale-105"
              : "border-[#1E293B] hover:border-[#F97316] bg-[#1E293B]/90 text-[#CBD5E1] hover:text-white"
          }`}
          title={isHi ? "व्यापार (Commerce) - एआई रोस्ट व ऑडिट इंजन" : "Commerce Field - AI Roast & Audit Engine"}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F97316] group-hover:scale-125 transition-transform" />
          <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white group-hover:text-[#F97316] transition-colors uppercase">
            {isHi ? "COMMERCE • व्यापार" : "COMMERCE"}
          </span>
          <ArrowUpRight className="w-3 h-3 text-[#64748B] group-hover:text-[#F97316] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
