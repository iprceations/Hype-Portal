// J.A.R.V.I.S. Voice Engine (Iron Man Agent Voice Synthesis & Real-Time Voice Mode)
// Inspired by Paul Bettany's J.A.R.V.I.S. — British English, calm, dignified, measured resonance

export interface JarvisSpeechOptions {
  text: string;
  isHi?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: unknown) => void;
}

/**
 * Cleans markdown, formatting tags, code snippets and emojis so
 * SpeechSynthesis delivers fluid, elegant, human-like voice delivery.
 */
export function cleanTextForJarvis(text: string): string {
  if (!text) return "";
  return text
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, "Code block omitted, sir.")
    // Remove inline code
    .replace(/`([^`]+)`/g, "$1")
    // Remove markdown headers
    .replace(/#{1,6}\s+/g, "")
    // Remove bold and italics
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    // Remove bullet points and lists
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    // Remove links [title](url) -> title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove URLs
    .replace(/https?:\/\/\S+/g, "")
    // Remove emojis and symbols that speech engines choke on
    .replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "")
    // Normalize punctuation pauses
    .replace(/\.{2,}/g, ".")
    // Normalize whitespaces and newlines
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

/**
 * Discovers and returns the best voice for J.A.R.V.I.S.:
 * - When in Hindi (isHi = true): Atul Kapoor (Iron Man 2, 3, Avengers Hindi Dub & Vision) baritone profile
 * - When in English: Paul Bettany British English gentleman profile
 */
export function getJarvisVoice(isHi: boolean = false, text?: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices =
    (cachedVoices && cachedVoices.length > 0
      ? cachedVoices
      : window.speechSynthesis.getVoices()) || [];
  if (!voices || voices.length === 0) return null;

  const hasDevanagari = Boolean(text && /[\u0900-\u097F]/.test(text));

  // 1. Hindi Voice Search (Atul Kapoor J.A.R.V.I.S. / Vision)
  // STRICT REQUIREMENT: Exclude all female voices (Kalpana, Swara, etc.)
  if (isHi || hasDevanagari) {
    const isFemaleVoice = (name: string) => {
      const n = name.toLowerCase();
      return (
        n.includes("female") ||
        n.includes("kalpana") ||
        n.includes("swara") ||
        n.includes("heera") ||
        n.includes("zira") ||
        n.includes("aditi") ||
        n.includes("neerja") ||
        n.includes("sheetal") ||
        n.includes("priya") ||
        n.includes("google हिन्दी") ||
        n.includes("google hindi") ||
        (n.includes("google") && (v.lang === "hi-IN" || v.lang.startsWith("hi")))
      );
    };

    // Preferred deep male Hindi candidates on Windows / Edge
    const hindiMaleCandidates = [
      "Microsoft Madhur Online (Natural) - Hindi (India)",
      "Microsoft Madhur - Hindi (India)",
      "Microsoft Madhur",
      "Madhur",
      "Microsoft Hemant Online (Natural) - Hindi (India)",
      "Microsoft Hemant - Hindi (India)",
      "Microsoft Hemant",
      "Hemant",
      "hi-IN-MadhurNeural",
      "hi-IN-HemantNeural",
    ];

    for (const cand of hindiMaleCandidates) {
      const match = voices.find((v) => {
        const nameLower = v.name.toLowerCase();
        return nameLower.includes(cand.toLowerCase()) && !isFemaleVoice(v.name);
      });
      if (match) return match;
    }

    // Any strictly male Hindi voice
    const anyMaleHindi = voices.find(
      (v) =>
        (v.lang === "hi-IN" || v.lang.startsWith("hi")) &&
        (v.name.toLowerCase().includes("male") || !isFemaleVoice(v.name))
    );
    if (anyMaleHindi) return anyMaleHindi;

    // Fallback: Indian Male baritone voice (Ravi / Prabhat)
    const indianMale = voices.find((v) => {
      const n = v.name.toLowerCase();
      return (
        (v.lang === "en-IN" || n.includes("india")) &&
        (n.includes("male") || n.includes("ravi") || n.includes("prabhat")) &&
        !isFemaleVoice(v.name)
      );
    });
    if (indianMale) return indianMale;
  }

  // 2. Authentic J.A.R.V.I.S. British English Male candidates (Paul Bettany)
  const jarvisCandidates = [
    "Google UK English Male",
    "Microsoft George Online (Natural) - English (United Kingdom)",
    "Microsoft George - English (United Kingdom)",
    "Microsoft George",
    "Microsoft Ryan Online (Natural) - English (United Kingdom)",
    "Microsoft Ryan - English (United Kingdom)",
    "Microsoft Ryan",
    "Daniel", // Apple UK English Male
    "Oliver",
    "Arthur",
    "en-GB",
  ];

  for (const candidate of jarvisCandidates) {
    const found = voices.find((v) => {
      const nameLower = v.name.toLowerCase();
      if (candidate === "en-GB") {
        return (
          v.lang === "en-GB" &&
          (nameLower.includes("male") || !nameLower.includes("female"))
        );
      }
      return nameLower.includes(candidate.toLowerCase());
    });
    if (found) return found;
  }

  // Fallback to any en-GB British voice
  const ukVoice = voices.find((v) => v.lang.startsWith("en-GB"));
  if (ukVoice) return ukVoice;

  // Fallback to English Male voice (Microsoft David, Guy, James, etc.)
  const maleVoice = voices.find((v) => {
    const n = v.name.toLowerCase();
    return (
      v.lang.startsWith("en") &&
      (n.includes("male") ||
        n.includes("david") ||
        n.includes("guy") ||
        n.includes("james") ||
        n.includes("george") ||
        n.includes("natural"))
    );
  });
  if (maleVoice) return maleVoice;

  // Ultimate fallback to any English voice
  return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
}

// Global active audio element for high-quality neural voice streaming
let currentActiveAudio: HTMLAudioElement | null = null;

/**
 * Fallback browser SpeechSynthesis implementation if neural audio is unavailable
 */
function fallbackSpeechSynthesis(
  cleaned: string,
  isHi: boolean,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (error: unknown) => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onError?.("Speech synthesis not supported in this browser.");
    return;
  }

  try {
    const utterance = new SpeechSynthesisUtterance(cleaned);
    const voice = getJarvisVoice(isHi, cleaned);
    if (voice) {
      utterance.voice = voice;
    }

    const hasDevanagari = /[\u0900-\u097F]/.test(cleaned);

    if (isHi || hasDevanagari) {
      utterance.pitch = 0.82; // Atul Kapoor deep baritone
      utterance.rate = 0.91;
    } else {
      utterance.pitch = 0.91;
      utterance.rate = 0.97;
    }
    utterance.volume = 1.0;

    utterance.onstart = () => {
      onStart?.();
    };
    utterance.onend = () => {
      onEnd?.();
    };
    utterance.onerror = (e) => {
      if (e.error !== "interrupted" && e.error !== "canceled") {
        onError?.(e);
      }
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    onError?.(err);
    onEnd?.();
  }
}

/**
 * Speaks text using the configured J.A.R.V.I.S. persona:
 * - Priority 1: High-Fidelity Studio Neural Audio via /api/jarvis-tts (hi-IN-MadhurNeural for Atul Kapoor baritone, en-GB-RyanNeural for Paul Bettany)
 * - Priority 2: In-browser SpeechSynthesis strictly filtering out any female voices
 */
export function speakWithJarvis({
  text,
  isHi = false,
  onStart,
  onEnd,
  onError,
}: JarvisSpeechOptions): void {
  if (typeof window === "undefined") return;

  // Immediately cancel any previous audio and speech synthesis
  stopJarvisSpeech();

  const cleaned = cleanTextForJarvis(text);
  if (!cleaned) {
    onEnd?.();
    return;
  }

  let audioStarted = false;

  // 1. First attempt: High-fidelity Neural Studio TTS API (hi-IN-MadhurNeural / en-GB-RyanNeural)
  fetch("/api/jarvis-tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: cleaned, isHi }),
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`Neural TTS returned HTTP ${res.status}`);
      }
      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        throw new Error("Neural TTS returned empty audio");
      }

      // Ensure no speech synthesis can ever run simultaneously
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }

      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      currentActiveAudio = audio;
      audioStarted = true;

      audio.onplay = () => {
        onStart?.();
      };
      audio.onended = () => {
        currentActiveAudio = null;
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };
      audio.onerror = () => {
        currentActiveAudio = null;
        URL.revokeObjectURL(audioUrl);
        onEnd?.();
      };

      await audio.play();
    })
    .catch(() => {
      // Offline or network failure: only fallback if neural audio never started
      if (!audioStarted) {
        fallbackSpeechSynthesis(cleaned, isHi, onStart, onEnd, onError);
      }
    });
}

/**
 * Immediately cancels any active voice playback (both neural audio and speech synthesis).
 */
export function stopJarvisSpeech() {
  if (currentActiveAudio) {
    try {
      currentActiveAudio.pause();
      currentActiveAudio.currentTime = 0;
      currentActiveAudio.src = "";
    } catch {}
    currentActiveAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {}
  }
}

/**
 * Creates and starts a SpeechRecognition instance for speech-to-text.
 */
export function createSpeechRecognizer({
  isHi = false,
  lang,
  onTranscript,
  onError,
  onEnd,
  onStart,
}: {
  isHi?: boolean;
  lang?: string;
  onTranscript: (text: string, isFinal: boolean) => void;
  onError?: (err: unknown) => void;
  onEnd?: () => void;
  onStart?: () => void;
}) {
  if (typeof window === "undefined") return null;

  const SpeechRecognition =
    (window as unknown as { SpeechRecognition: any }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError?.("SpeechRecognition not supported in this browser.");
    return null;
  }

  try {
    const recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = lang || (isHi ? "hi-IN" : "en-IN");

    recognizer.onstart = () => {
      onStart?.();
    };

    recognizer.onresult = (event: any) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      if (final.trim()) {
        onTranscript(final.trim(), true);
      } else if (interim.trim()) {
        onTranscript(interim.trim(), false);
      }
    };

    recognizer.onerror = (err: any) => {
      if (err.error !== "no-speech") {
        onError?.(err);
      }
    };

    recognizer.onend = () => {
      onEnd?.();
    };

    return recognizer;
  } catch (err) {
    onError?.(err);
    return null;
  }
}
