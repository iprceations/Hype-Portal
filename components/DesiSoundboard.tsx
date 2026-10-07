"use client";

import React, { useState } from "react";
import { Volume2, Sparkles, Flame, Radio, Zap, Coins, AlertTriangle } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

interface SoundButton {
  id: string;
  name: string;
  nameHi: string;
  renderIcon: (className?: string) => React.ReactNode;
  sub: string;
  subHi: string;
  color: string;
  play: () => void;
}

// Module-level singleton to avoid exceeding browser AudioContext limit
let sharedAudioContext: AudioContext | null = null;

export default function DesiSoundboard() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [activeSoundId, setActiveSoundId] = useState<string | null>(null);

  const getAudioContext = () => {
    if (typeof window === "undefined") return null;
    if (!sharedAudioContext) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        sharedAudioContext = new AudioCtx();
      }
    }
    if (sharedAudioContext && sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume().catch(() => {});
    }
    return sharedAudioContext;
  };

  // 1. Air Horn Hype Blast
  const playAirHorn = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [280, 280, 280].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      osc.frequency.linearRampToValueAtTime(freq * 1.05, now + i * 0.12 + 0.08);
      gain.gain.setValueAtTime(0.25, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.11);
    });
  };

  // 2. Vine Boom / Deep Bass Drop
  const playVineBoom = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(32, now + 0.45);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  };

  // 3. Cha-Ching / Cash Register Chime
  const playChaChing = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [1046, 1318, 1567, 2093].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(f, now + i * 0.06);
      gain.gain.setValueAtTime(0.18, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  };

  // 4. Wrong Buzzer (Bzzzt)
  const playWrongBuzzer = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.setValueAtTime(104, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  };

  // 5. Dramatic Reverb Hit
  const playDramatic = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [65, 82, 110, 165].forEach((f) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.75);
    });
  };

  // 6. Laser Cyber Zap
  const playLaserZap = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.18);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  };

  const soundList: (SoundButton & { iconColor: string; iconBg: string })[] = [
    {
      id: "boom",
      name: "Vine Boom",
      nameHi: "वाइन बूम",
      renderIcon: (className = "w-5 h-5") => <Volume2 className={className} />,
      sub: "Deep Bass Drop",
      subHi: "गहरा बेस ड्रॉप",
      color: "border-[var(--border)] hover:border-[#F97316]",
      iconColor: "text-orange-500",
      iconBg: "bg-orange-500/10",
      play: playVineBoom,
    },
    {
      id: "airhorn",
      name: "Air Horn",
      nameHi: "धमाका हॉर्न",
      renderIcon: (className = "w-5 h-5") => <Radio className={className} />,
      sub: "Hype MLG Blast",
      subHi: "हाइप ब्लास्ट",
      color: "border-[var(--border)] hover:border-[#F59E0B]",
      iconColor: "text-amber-500",
      iconBg: "bg-amber-500/10",
      play: playAirHorn,
    },
    {
      id: "cash",
      name: "Cha-Ching",
      nameHi: "पैसा ही पैसा",
      renderIcon: (className = "w-5 h-5") => <Coins className={className} />,
      sub: "Funding Received",
      subHi: "फंडिंग अप्रूव्ड",
      color: "border-[var(--border)] hover:border-emerald-500",
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-500/10",
      play: playChaChing,
    },
    {
      id: "buzzer",
      name: "Wrong Buzzer",
      nameHi: "गलत जवाब",
      renderIcon: (className = "w-5 h-5") => <AlertTriangle className={className} />,
      sub: "Total Cap Detected",
      subHi: "झूठ पकड़ा गया",
      color: "border-[var(--border)] hover:border-rose-500",
      iconColor: "text-rose-500",
      iconBg: "bg-rose-500/10",
      play: playWrongBuzzer,
    },
    {
      id: "dramatic",
      name: "Dun Dun Dun",
      nameHi: "सस्पेंस ड्रामा",
      renderIcon: (className = "w-5 h-5") => <Sparkles className={className} />,
      sub: "Scandal Unfolds",
      subHi: "रहस्योद्घाटन",
      color: "border-[var(--border)] hover:border-purple-500",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      play: playDramatic,
    },
    {
      id: "zap",
      name: "Cyber Zap",
      nameHi: "साइबर ज़ैप",
      renderIcon: (className = "w-5 h-5") => <Zap className={className} />,
      sub: "Neural Pulse",
      subHi: "न्यूरल पल्स",
      color: "border-[var(--border)] hover:border-cyan-500",
      iconColor: "text-cyan-500",
      iconBg: "bg-cyan-500/10",
      play: playLaserZap,
    },
  ];

  const triggerSound = (btn: SoundButton) => {
    setActiveSoundId(btn.id);
    btn.play();
    setTimeout(() => setActiveSoundId(null), 400);
  };

  return (
    <div className="relative rounded-3xl p-6 sm:p-7 overflow-hidden border border-[var(--border)] bg-[var(--card-bg)] space-y-5 transition-colors shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] font-mono text-xs font-bold uppercase tracking-wider">
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isHi ? "मीम ऑडियो • देसी साउंडबोर्ड" : "Meme Audio • Desi Soundboard"}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight">
            {isHi ? "वायरल हाइप व रोस्ट साउंडबोर्ड" : "Viral Hype & Roast Soundboard"}
          </h2>
          <p className="text-xs text-[var(--muted-foreground)]">
            {isHi
              ? "रील्स, मीम्स और लाइव बहसों के लिए रीयल-टाइम वेब ऑडियो इफेक्ट्स।"
              : "Real-time synthesized Web Audio sound effects for reels, memes, and live debates."}
          </p>
        </div>
        <span className="text-[10px] font-mono text-[var(--muted-foreground)] px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] self-start sm:self-auto font-semibold">
          {isHi ? "0 विलंबता • 100% रॉयल्टी-मुक्त" : "0 Latency • 100% Royalty-Free"}
        </span>
      </div>

      {/* Grid of Sound Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {soundList.map((item) => {
          const isActive = activeSoundId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => triggerSound(item)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center space-y-2.5 transition-all duration-200 cursor-pointer group active:scale-95 shadow-sm ${
                item.color
              } ${
                isActive
                  ? "scale-105 border-2 border-[#F97316] bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/20 shadow-md ring-2 ring-[#F97316]/30"
                  : "bg-[var(--surface)] hover:bg-[#FFF7ED]/30 [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div
                className={`p-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#F97316] text-white shadow-sm shadow-[#F97316]/40 scale-110"
                    : `${item.iconBg} ${item.iconColor} group-hover:scale-110`
                }`}
              >
                {item.renderIcon("w-5 h-5")}
              </div>
              <span className="text-xs font-bold text-[var(--foreground)] block group-hover:text-[#F97316] transition-colors">
                {isHi ? item.nameHi : item.name}
              </span>
              <span className="text-[9px] font-mono text-[var(--muted-foreground)] block leading-tight font-medium">
                {isHi ? item.subHi : item.sub}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
