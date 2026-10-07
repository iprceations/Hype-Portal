// Web Audio API Synthesis for Subtle Hype Portal UI Micro-interactions
// Designed with ultra-low latency, zero external asset downloads, and graceful degradation

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Tactile click sound for voting / buttons
  public playVoteClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      const now = ctx.currentTime;

      // Quick pitch drop creates a soft tactile "tap"
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.045);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 2. Typewriter click during AI generation & typing animation
  public playTypewriterClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // High-passed brief click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Subtle randomized pitch variance for realistic mechanical feeling
      const randomPitch = 1200 + Math.random() * 400;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(randomPitch, now);
      osc.frequency.exponentialRampToValueAtTime(randomPitch * 0.5, now + 0.015);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 3. Crisp success chime on card download or roast ready
  public playSuccessChime() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Three harmonic bell notes (C6 -> E6 -> G6)
      const freqs = [1046.5, 1318.51, 1567.98];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        const noteStart = now + idx * 0.07;
        const noteDuration = 0.45;

        gain.gain.setValueAtTime(0.0001, noteStart);
        gain.gain.linearRampToValueAtTime(0.14 / (idx + 1), noteStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + noteDuration);
      });
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 4. Futuristic pulse for generation trigger
  public playPulse() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(740, now + 0.12);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Autoplay fallback
    }
  }

  // 5. J.A.R.V.I.S. Arc Reactor HUD activation sound effect
  public playJarvisActivate() {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Arc reactor sub-bass rise
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(90, now);
      bassOsc.frequency.exponentialRampToValueAtTime(240, now + 0.28);
      bassGain.gain.setValueAtTime(0.12, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 0.36);

      // Dual holographic high chime
      [587.33, 880, 1174.66].forEach((f, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = "sine";
        const t = now + 0.08 + idx * 0.05;
        chimeOsc.frequency.setValueAtTime(f, t);
        chimeGain.gain.setValueAtTime(0.06 / (idx + 1), t);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(t);
        chimeOsc.stop(t + 0.32);
      });
    } catch {
      // Autoplay fallback
    }
  }
}

export const sound = new SoundManager();
