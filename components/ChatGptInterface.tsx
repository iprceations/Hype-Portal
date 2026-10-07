"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  sendSpicyChatMessage,
  ChatMessage,
  ChatPersonality,
} from "@/app/actions/spicyChat";
import { sound } from "@/lib/audio";
import {
  Bot,
  Send,
  Sparkles,
  Flame,
  MessageSquare,
  ShieldCheck,
  Clock,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  RotateCcw,
  Zap,
  Menu,
  X,
  AlertTriangle,
  User,
  Plus,
  Image as ImageIcon,
  Sliders,
  Download,
  Maximize2,
  Minimize2,
  Eye,
  Wand2,
  RefreshCw,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  ArrowUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Radio,
} from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { HypeIconMark } from "@/components/Logo";
import {
  speakWithJarvis,
  stopJarvisSpeech,
  createSpeechRecognizer,
  cleanTextForJarvis,
} from "@/lib/jarvisVoice";

export interface ChatSession {
  id: string;
  title: string;
  mode: ChatPersonality;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

interface ModeOption {
  id: "hype" | "roast";
  name: string;
  nameHi: string;
  badge: string;
  badgeHi: string;
  icon: React.ReactNode;
  tagline: string;
  taglineHi: string;
  starters: string[];
}

const MODES: ModeOption[] = [
  {
    id: "hype",
    name: "Hype AI",
    nameHi: "हाइप एआई",
    badge: "Problem Solver • Vision",
    badgeHi: "प्रॉब्लम सॉल्वर • विज़न",
    icon: <Zap className="w-4 h-4 text-[#F97316]" />,
    tagline:
      "Serious problem solving, coding, reasoning, architecture & photo design vision.",
    taglineHi:
      "गंभीर समस्या समाधान, कोडिंग, तार्किक विश्लेषण व फोटो डिज़ाइन विज़न।",
    starters: [
      "Debug this code & explain best practices",
      "Bhai scalable architecture aur system design plan banao",
      "Analyze this photo / design & suggest improvements",
      "Break down a complex logic & business problem",
    ],
  },
  {
    id: "roast",
    name: "Roast AI",
    nameHi: "रोस्ट एआई",
    badge: "Savage Roast • Unfiltered",
    badgeHi: "कड़क रोस्ट • ज़ीरो फ़िल्टर",
    icon: <Flame className="w-4 h-4 text-[#F97316]" />,
    tagline:
      "Brutal burns, savage sarcasm, photo roasts & hilarious meme energy.",
    taglineHi:
      "बिना किसी रहम के तीखे रोस्ट, फोटो रोस्ट और बेबाक हास्य।",
    starters: [
      "Roast this photo / selfie without mercy 🔥",
      "Bhai meri 2 AM overthinking aur life choices ko roast kar 💀",
      "Destroy my resume and tech-bro corporate delusions",
      "Roast my toxic texting habits and situationships",
    ],
  },
];

// 48-Hour Auto-Delete Lifecycle (48 hours in milliseconds)
const AUTO_DELETE_MS = 48 * 60 * 60 * 1000;
const SESSIONS_STORAGE_KEY = "hype_chat_sessions_v3";

function formatRelativeTime(timestamp: number, isHi: boolean): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return isHi ? "अभी" : "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

// Custom Animated Dustbin Icon with openable lid on hover
function AnimatedDustbinIcon({
  className = "w-4 h-4",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} transition-colors`}
    >
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <g className="trash-lid">
        <path d="M3 6h18" />
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </g>
    </svg>
  );
}

// Dedicated Transparent HYPE Logo with Small Verified-Style Circular "AI" Badge
function AnimatedHypeEmblem({
  isDark = true,
}: {
  isDark?: boolean;
  activeModeIcon?: React.ReactNode;
}) {
  return (
    <div className="relative group cursor-pointer select-none inline-flex items-center justify-center gap-1.5 py-1">
      {/* Soft atmospheric ambient glow */}
      <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#F97316]/20 via-[#F59E0B]/15 to-transparent blur-2xl opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Transparent Logo Mark */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full relative z-10 drop-shadow-md"
        >
          <path
            d="M 17 62 C 19 36 38 18 63 18 C 76 18 86 28 85 48 C 84 62 78 76 66 87"
            stroke={isDark ? "#64748B" : "#94A3B8"}
            strokeWidth="3.2"
            strokeLinecap="round"
            className="transition-colors duration-300 group-hover:stroke-[#F97316]"
          />
          <circle cx="63.5" cy="18" r="4.2" fill="#F97316" />
          <circle cx="63.5" cy="18" r="1.8" fill="#FFFFFF" />
          <circle cx="78" cy="27" r="4.2" fill="#F59E0B" />
          <circle cx="78" cy="27" r="1.8" fill="#FFFFFF" />

          <g fill={isDark ? "#FFFFFF" : "#0F172A"}>
            <path d="M 28 44 H 38 V 76 H 28 Z" />
            <path d="M 38 54 H 54 V 63 H 38 Z" />
            <path d="M 54 54 H 64 V 76 H 54 Z" />
          </g>
          <path d="M 54 40 H 78.5 L 71 49 H 54 Z" fill="#F97316" />
        </svg>
      </div>

      {/* Small Verified-Style Circular "AI" Badge (as requested: "bilkul chota sa ai likho logo ke side me jaise verified budge hota hai waise cicul me") */}
      <div
        className="w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-full bg-gradient-to-tr from-[#F97316] to-[#F59E0B] text-white flex items-center justify-center font-black text-[10px] sm:text-[11px] tracking-tight shadow-md border-2 border-[var(--background)] self-start mt-1.5 -ml-1 group-hover:scale-110 transition-transform select-none shrink-0"
        title="Verified AI"
      >
        AI
      </div>
    </div>
  );
}

function MiniHypeLogoIcon({ isDark = true }: { isDark?: boolean }) {
  return <HypeIconMark isDark={isDark} className="w-full h-full" />;
}

// Preset filter configuration for Photo Enhance Studio
interface FilterPreset {
  id: string;
  name: string;
  nameHi: string;
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: "auto", name: "Auto Clarity", nameHi: "ऑटो क्लैरिटी", brightness: 108, contrast: 115, saturation: 110, sepia: 0 },
  { id: "studio", name: "Studio Glow", nameHi: "स्टूडियो ग्लो", brightness: 105, contrast: 110, saturation: 118, sepia: 10 },
  { id: "cyber", name: "Cyberpunk", nameHi: "साइबरपंक", brightness: 102, contrast: 135, saturation: 160, sepia: 0 },
  { id: "cinema", name: "Cinematic Dark", nameHi: "सिनेमैटिक", brightness: 95, contrast: 125, saturation: 90, sepia: 15 },
  { id: "mono", name: "B&W Minimal", nameHi: "ब्लैक & व्हाइट", brightness: 105, contrast: 130, saturation: 0, sepia: 0 },
  { id: "vibrant", name: "Vibrant Pop", nameHi: "वाइब्रेंट पॉप", brightness: 105, contrast: 112, saturation: 155, sepia: 0 },
];

export default function ChatGptInterface() {
  const { language, setLanguage, setTheme, resolvedTheme } = useThemeAndLang();
  const isHi = language === "hi";
  const isDark = resolvedTheme !== "day";

  // Sessions State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"hype" | "roast">("hype");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Attached Image & Photo Studio Enhancement State
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhanceModalOpen, setEnhanceModalOpen] = useState(false);
  const [selectedEnlargedImage, setSelectedEnlargedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Photo Studio Sliders
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [sepia, setSepia] = useState<number>(0);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // 48-Hour Remaining Time Text
  const [remainingTimeText, setRemainingTimeText] = useState<string>("48h 00m");

  // Mode Dropdown State (Top Header & + Menu)
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ChatGPT-Style Plus (+) Menu State
  const [plusMenuOpen, setPlusMenuOpen] = useState(false);
  const plusMenuRef = useRef<HTMLDivElement | null>(null);

  // Voice Input (Microphone Dictation) State
  const [isListening, setIsListening] = useState(false);
  const dictationRecognizerRef = useRef<any>(null);

  // Real-Time J.A.R.V.I.S. Voice Mode (Hands-free Voice Lounge) State
  const [voiceModeOpen, setVoiceModeOpen] = useState(false);
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceAiResponse, setVoiceAiResponse] = useState("");
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [speakingMessageIdx, setSpeakingMessageIdx] = useState<number | null>(null);
  const [voiceLanguage, setVoiceLanguage] = useState<"en" | "hi">("hi");
  const voiceRecognizerRef = useRef<any>(null);
  const voiceDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Normal Input Bar Mic Dictation
  const handleToggleVoice = () => {
    sound.playVoteClick();
    if (isListening) {
      if (dictationRecognizerRef.current) {
        try {
          dictationRecognizerRef.current.stop();
        } catch {}
      }
      setIsListening(false);
      return;
    }

    const rec = createSpeechRecognizer({
      isHi: isHi || voiceLanguage === "hi",
      lang: isHi || voiceLanguage === "hi" ? "hi-IN" : "en-IN",
      onStart: () => setIsListening(true),
      onTranscript: (transcript, isFinal) => {
        setInput(transcript);
        if (isFinal) {
          setIsListening(false);
        }
      },
      onError: (err) => {
        console.warn("Speech recognition notice:", err);
        setIsListening(false);
      },
      onEnd: () => setIsListening(false),
    });

    if (rec) {
      dictationRecognizerRef.current = rec;
      try {
        rec.start();
      } catch {
        setIsListening(false);
      }
    } else {
      alert(
        isHi
          ? "आपके ब्राउज़र में वॉइस स्पीच उपलब्ध नहीं है (कृपया Chrome या Edge का उपयोग करें)।"
          : "Voice typing is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
    }
  };

  // Cleanup all audio and speech on component unmount
  useEffect(() => {
    return () => {
      stopJarvisSpeech();
      if (voiceDebounceTimerRef.current) {
        clearTimeout(voiceDebounceTimerRef.current);
      }
      if (voiceRecognizerRef.current) {
        try {
          voiceRecognizerRef.current.stop();
        } catch {}
      }
      if (dictationRecognizerRef.current) {
        try {
          dictationRecognizerRef.current.stop();
        } catch {}
      }
    };
  }, []);

  // 5-Second Undo State
  const [undoState, setUndoState] = useState<{
    sessionsToRestore: ChatSession[];
    restoredActiveId: string;
    countdown: number;
    message: string;
  } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const undoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setModeDropdownOpen(false);
      }
      if (
        plusMenuRef.current &&
        !plusMenuRef.current.contains(event.target as Node)
      ) {
        setPlusMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+B / Cmd+B for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Derive active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;
  const messages = activeSession ? activeSession.messages : [];

  // Normalize active mode to hype or roast
  const activeModeId: "hype" | "roast" =
    activeSession?.mode === "roast" ||
    activeSession?.mode === "roast18" ||
    activeSession?.mode === "noty" ||
    activeSession?.mode === "funny" ||
    selectedMode === "roast"
      ? "roast"
      : "hype";

  const activeModeObj =
    MODES.find((m) => m.id === activeModeId) || MODES[0];

  // ============================================================================
  // 1. Initial Load & 48-Hour Cleanup
  // ============================================================================
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
      const now = Date.now();
      let loaded: ChatSession[] = [];

      if (raw) {
        const parsed: ChatSession[] = JSON.parse(raw);
        // Prune expired sessions older than 48 hours
        loaded = parsed.filter((sess) => now - sess.updatedAt < AUTO_DELETE_MS);
      }

      if (loaded.length === 0) {
        const freshId = "session-" + now;
        const initialSession: ChatSession = {
          id: freshId,
          title: isHi ? "नई बातचीत" : "New Conversation",
          mode: "hype",
          messages: [],
          createdAt: now,
          updatedAt: now,
        };
        loaded = [initialSession];
      }

      setSessions(loaded);
      setActiveSessionId(loaded[0].id);
      setSelectedMode(
        loaded[0].mode === "roast" || loaded[0].mode === "roast18"
          ? "roast"
          : "hype"
      );
      updateRemaining(loaded[0].updatedAt);
    } catch {
      // Fallback
    }
  }, []);

  // Clipboard Paste Support (Ctrl+V for images)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData?.items) {
        for (const item of Array.from(e.clipboardData.items)) {
          if (item.type.startsWith("image/")) {
            const file = item.getAsFile();
            if (file) handleImageFile(file);
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const updateRemaining = (updatedAt: number) => {
    const elapsed = Date.now() - updatedAt;
    const remainingMs = Math.max(0, AUTO_DELETE_MS - elapsed);
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const mins = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    setRemainingTimeText(`${hours}h ${mins.toString().padStart(2, "0")}m`);
  };

  const saveSessions = (newSessions: ChatSession[]) => {
    setSessions(newSessions);
    try {
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(newSessions));
    } catch {
      // Storage quota guard
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // ============================================================================
  // 2. Photo Upload & Enhance Logic
  // ============================================================================
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    sound.playVoteClick();
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setAttachedImage(dataUrl);
      setOriginalImage(dataUrl);
      // Reset sliders
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setSepia(0);
      setActivePreset(null);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: FilterPreset) => {
    sound.playVoteClick();
    setActivePreset(preset.id);
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setSaturation(preset.saturation);
    setSepia(preset.sepia);
  };

  const resetFilters = () => {
    sound.playVoteClick();
    setActivePreset(null);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setSepia(0);
  };

  // Render canvas with filters to produce filtered base64 image
  const renderCanvasFiltered = (src: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = src;
    });
  };

  const handleApplyEnhancedToChat = async () => {
    if (!originalImage) return;
    sound.playVoteClick();
    const filtered = await renderCanvasFiltered(originalImage);
    setAttachedImage(filtered);
    setEnhanceModalOpen(false);
  };

  const handleDownloadEnhanced = async () => {
    if (!originalImage) return;
    sound.playVoteClick();
    const filtered = await renderCanvasFiltered(originalImage);
    const link = document.createElement("a");
    link.href = filtered;
    link.download = `hype-ai-enhanced-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================================================
  // 3. New Chat & Reset All Actions
  // ============================================================================
  const handleNewChat = () => {
    sound.playVoteClick();
    const now = Date.now();
    const freshId = "session-" + now;
    const freshSession: ChatSession = {
      id: freshId,
      title: isHi ? "नई बातचीत" : "New Conversation",
      mode: selectedMode,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    const updated = [freshSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(freshId);
    updateRemaining(now);
    setAttachedImage(null);
    setOriginalImage(null);
  };

  const handleSwitchMode = (mode: "hype" | "roast") => {
    sound.playVoteClick();
    setSelectedMode(mode);
    if (activeSession) {
      const updated = sessions.map((s) =>
        s.id === activeSession.id ? { ...s, mode } : s
      );
      saveSessions(updated);
    }
  };

  const handleDeleteSession = (sessionId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playVoteClick();

    const previousSessions = [...sessions];
    const updated = sessions.filter((s) => s.id !== sessionId);

    if (updated.length === 0) {
      const now = Date.now();
      const freshId = "session-" + now;
      const fresh: ChatSession = {
        id: freshId,
        title: isHi ? "नई बातचीत" : "New Conversation",
        mode: selectedMode,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      updated.push(fresh);
      setActiveSessionId(freshId);
    } else if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0].id);
      setSelectedMode(
        updated[0].mode === "roast" || updated[0].mode === "roast18"
          ? "roast"
          : "hype"
      );
    }

    saveSessions(updated);

    // 5-second Undo Toast
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    let remaining = 5;
    setUndoState({
      sessionsToRestore: previousSessions,
      restoredActiveId: sessionId,
      countdown: remaining,
      message: isHi ? "चैट डिलीट कर दी गई" : "Chat deleted",
    });

    undoTimerRef.current = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(undoTimerRef.current!);
        setUndoState(null);
      } else {
        setUndoState((prev) => (prev ? { ...prev, countdown: remaining } : null));
      }
    }, 1000);
  };

  const handleUndo = () => {
    sound.playVoteClick();
    if (!undoState) return;
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);

    saveSessions(undoState.sessionsToRestore);
    setActiveSessionId(undoState.restoredActiveId);
    setUndoState(null);
  };

  const handleResetAll = () => {
    sound.playVoteClick();
    const previousSessions = [...sessions];
    const now = Date.now();
    const freshId = "session-" + now;
    const freshSession: ChatSession = {
      id: freshId,
      title: isHi ? "नई बातचीत" : "New Conversation",
      mode: selectedMode,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    saveSessions([freshSession]);
    setActiveSessionId(freshId);
    updateRemaining(now);
    setAttachedImage(null);

    setUndoState({
      sessionsToRestore: previousSessions,
      restoredActiveId: activeSessionId,
      countdown: 5,
      message: isHi ? "सभी चैट रीसेट कर दिए गए" : "All chats cleared",
    });
  };

  // ============================================================================
  // 4. Send Message & Vision Processing
  // ============================================================================
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    const currentImg = attachedImage;

    // Must have either text or image
    if ((!query && !currentImg) || loading) return;

    sound.playVoteClick();
    setInput("");
    setAttachedImage(null);
    setOriginalImage(null);

    const now = Date.now();
    let currentSession = activeSession;
    let updatedSessions = [...sessions];

    if (!currentSession) {
      currentSession = {
        id: "session-" + now,
        title: query ? query.slice(0, 30) : isHi ? "फोटो विश्लेषण" : "Photo Analysis",
        mode: selectedMode,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      updatedSessions.unshift(currentSession);
      setActiveSessionId(currentSession.id);
    }

    const isFirstMessage = currentSession.messages.length === 0;
    const title = isFirstMessage
      ? query
        ? query.slice(0, 32)
        : isHi
        ? "फोटो विश्लेषण"
        : "Photo Analysis"
      : currentSession.title;

    const newHistory: ChatMessage[] = [
      ...currentSession.messages,
      {
        role: "user",
        content: query || (isHi ? "इस फोटो का विश्लेषण करें" : "Analyze this photo"),
        image: currentImg || undefined,
      },
    ];

    const updatedWithUser: ChatSession = {
      ...currentSession,
      title,
      messages: newHistory,
      updatedAt: now,
    };

    updatedSessions = updatedSessions.map((s) =>
      s.id === currentSession!.id ? updatedWithUser : s
    );
    saveSessions(updatedSessions);
    updateRemaining(now);
    setLoading(true);

    try {
      const res = await sendSpicyChatMessage(
        query,
        activeModeId,
        newHistory,
        currentImg || undefined
      );

      const updatedWithAi: ChatSession = {
        ...updatedWithUser,
        messages: [
          ...newHistory,
          { role: "assistant", content: res.reply },
        ],
        updatedAt: Date.now(),
      };
      const finalSessions = updatedSessions.map((s) =>
        s.id === currentSession!.id ? updatedWithAi : s
      );
      saveSessions(finalSessions);
    } catch {
      const updatedWithError: ChatSession = {
        ...updatedWithUser,
        messages: [
          ...newHistory,
          {
            role: "assistant",
            content: isHi
              ? "कनेक्शन में थोड़ी रुकावट आई। कृपया दोबारा प्रयास करें।"
              : "Temporary connection glitch. Please ask again!",
          },
        ],
        updatedAt: Date.now(),
      };
      const finalSessions = updatedSessions.map((s) =>
        s.id === currentSession!.id ? updatedWithError : s
      );
      saveSessions(finalSessions);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    sound.playVoteClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ============================================================================
  // J.A.R.V.I.S. Real-Time Hands-Free Voice Mode Handlers
  // ============================================================================

  const handleSpeakMessage = (text: string, idx: number) => {
    sound.playVoteClick();
    if (speakingMessageIdx === idx) {
      stopJarvisSpeech();
      setSpeakingMessageIdx(null);
      return;
    }
    setSpeakingMessageIdx(idx);
    speakWithJarvis({
      text,
      isHi,
      onStart: () => setSpeakingMessageIdx(idx),
      onEnd: () => setSpeakingMessageIdx(null),
      onError: () => setSpeakingMessageIdx(null),
    });
  };

  const startVoiceModeListening = () => {
    if (typeof window === "undefined" || voiceMuted) return;

    if (voiceRecognizerRef.current) {
      try {
        voiceRecognizerRef.current.stop();
      } catch {}
    }

    const currentVoiceLang = voiceLanguage === "hi" || isHi ? "hi-IN" : "en-IN";

    const recognizer = createSpeechRecognizer({
      isHi: isHi || voiceLanguage === "hi",
      lang: currentVoiceLang,
      onStart: () => {
        setVoiceState("listening");
      },
      onTranscript: (text, isFinal) => {
        setVoiceTranscript(text);
        if (voiceDebounceTimerRef.current) {
          clearTimeout(voiceDebounceTimerRef.current);
        }
        if (text.trim().length > 1) {
          // If final speech segment or user pauses, auto-submit after 750ms of silence
          const delay = isFinal ? 750 : 1800;
          voiceDebounceTimerRef.current = setTimeout(() => {
            handleVoiceModeUserQuery(text.trim());
          }, delay);
        }
      },
      onError: (err) => {
        console.warn("Jarvis speech recognition note:", err);
      },
      onEnd: () => {
        // If still in listening state and voice mode is open, restart continuous listening
        if (voiceModeOpen && !voiceMuted && voiceState === "listening") {
          setTimeout(() => {
            if (voiceModeOpen && !voiceMuted && voiceState === "listening") {
              try {
                recognizer.start();
              } catch {}
            }
          }, 350);
        }
      },
    });

    if (recognizer) {
      voiceRecognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch {}
    }
  };

  const handleVoiceModeUserQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    if (voiceDebounceTimerRef.current) {
      clearTimeout(voiceDebounceTimerRef.current);
    }

    if (voiceRecognizerRef.current) {
      try {
        voiceRecognizerRef.current.stop();
      } catch {}
    }

    setVoiceTranscript(queryText);
    setVoiceState("processing");

    const now = Date.now();
    let currentSession = activeSession;
    let updatedSessions = [...sessions];

    if (!currentSession) {
      currentSession = {
        id: "session-" + now,
        title: queryText.slice(0, 30),
        mode: selectedMode,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
      updatedSessions.unshift(currentSession);
      setActiveSessionId(currentSession.id);
    }

    const newHistory: ChatMessage[] = [
      ...currentSession.messages,
      { role: "user", content: queryText },
    ];

    const updatedWithUser: ChatSession = {
      ...currentSession,
      title:
        currentSession.messages.length === 0
          ? queryText.slice(0, 32)
          : currentSession.title,
      messages: newHistory,
      updatedAt: now,
    };

    updatedSessions = updatedSessions.map((s) =>
      s.id === currentSession!.id ? updatedWithUser : s
    );
    saveSessions(updatedSessions);
    updateRemaining(now);
    setLoading(true);

    try {
      const res = await sendSpicyChatMessage(
        queryText,
        activeModeId,
        newHistory,
        undefined,
        true // isVoiceMode = true for real-time spoken J.A.R.V.I.S. responses
      );

      const updatedWithAi: ChatSession = {
        ...updatedWithUser,
        messages: [...newHistory, { role: "assistant", content: res.reply }],
        updatedAt: Date.now(),
      };
      const finalSessions = updatedSessions.map((s) =>
        s.id === currentSession!.id ? updatedWithAi : s
      );
      saveSessions(finalSessions);

      setVoiceAiResponse(res.reply);
      setVoiceState("speaking");

      // Jarvis speaks out response in real time!
      speakWithJarvis({
        text: res.reply,
        isHi: isHi || voiceLanguage === "hi",
        onStart: () => setVoiceState("speaking"),
        onEnd: () => {
          setVoiceTranscript("");
          setVoiceState("listening");
          startVoiceModeListening();
        },
        onError: () => {
          setVoiceTranscript("");
          setVoiceState("listening");
          startVoiceModeListening();
        },
      });
    } catch {
      const errReply = isHi || voiceLanguage === "hi"
        ? "क्षमा करें सर, नेटवर्क में कुछ रुकावट आई है।"
        : "Pardon me sir, I encountered a temporary connection anomaly.";
      setVoiceAiResponse(errReply);
      setVoiceState("speaking");
      speakWithJarvis({
        text: errReply,
        isHi: isHi || voiceLanguage === "hi",
        onStart: () => setVoiceState("speaking"),
        onEnd: () => {
          setVoiceTranscript("");
          setVoiceState("listening");
          startVoiceModeListening();
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVoiceMode = () => {
    sound.playVoteClick();
    sound.playJarvisActivate();
    stopJarvisSpeech();
    if (voiceDebounceTimerRef.current) {
      clearTimeout(voiceDebounceTimerRef.current);
    }
    setVoiceModeOpen(true);
    setVoiceTranscript("");

    // Prioritize authentic Hindi (Atul Kapoor) voice
    const isCurrentHi = (voiceLanguage as string) === "hi" || isHi;
    if (isCurrentHi && voiceLanguage !== "hi") {
      setVoiceLanguage("hi");
    }

    // Atul Kapoor greeting for Hindi, Paul Bettany greeting for English
    const greeting =
      activeModeId === "hype"
        ? isCurrentHi
          ? "नमस्ते सर। मैं जार्विस हूँ। सभी प्रणालियाँ पूर्ण रूप से सक्रिय हैं। आदेश दीजिए, क्या सहायता करूँ?"
          : "At your service, sir. All core diagnostics nominal. How may I assist you today?"
        : isCurrentHi
        ? "नमस्ते सर। जार्विस सक्रिय है। बताइए आज किसका रोस्ट करना चाहते हैं?"
        : "Jarvis online, sir. Sarcasm subroutines primed. What are we roasting today?";

    setVoiceAiResponse(greeting);
    setVoiceState("speaking");

    speakWithJarvis({
      text: greeting,
      isHi: isCurrentHi,
      onStart: () => setVoiceState("speaking"),
      onEnd: () => {
        setVoiceTranscript("");
        setVoiceState("listening");
        startVoiceModeListening();
      },
      onError: () => {
        setVoiceTranscript("");
        setVoiceState("listening");
        startVoiceModeListening();
      },
    });
  };

  /**
   * Switches language and immediately activates J.A.R.V.I.S. in that voice persona:
   * - Hindi: Atul Kapoor (Iron Man 2, 3, Avengers Hindi Dub & Vision) baritone voice
   * - English: Paul Bettany (British Agent) voice
   */
  const handleSwitchLanguage = (newLang: "en" | "hi") => {
    sound.playVoteClick();
    setLanguage(newLang);
    setVoiceLanguage(newLang);

    stopJarvisSpeech();
    if (voiceDebounceTimerRef.current) {
      clearTimeout(voiceDebounceTimerRef.current);
    }

    // Only speak out if the user is already inside the Voice Mode HUD!
    if (voiceModeOpen) {
      if (newLang === "hi") {
        sound.playJarvisActivate();
        const atulGreeting =
          activeModeId === "hype"
            ? "नमस्ते सर। मैं जार्विस हूँ। सभी प्रणालियाँ पूर्ण रूप से सक्रिय हैं। आदेश दीजिए, क्या सहायता करूँ?"
            : "नमस्ते सर। जार्विस सक्रिय है। बताइए आज किसका रोस्ट करना चाहते हैं?";

        setVoiceAiResponse(atulGreeting);
        setVoiceTranscript("");
        setVoiceState("speaking");
        speakWithJarvis({
          text: atulGreeting,
          isHi: true,
          onStart: () => setVoiceState("speaking"),
          onEnd: () => {
            setVoiceTranscript("");
            setVoiceState("listening");
            startVoiceModeListening();
          },
          onError: () => {
            setVoiceTranscript("");
            setVoiceState("listening");
            startVoiceModeListening();
          },
        });
      } else {
        const bettanyGreeting =
          activeModeId === "hype"
            ? "At your service, sir. All core diagnostics nominal. How may I assist you today?"
            : "Jarvis online, sir. Sarcasm subroutines primed. What are we roasting today?";

        setVoiceAiResponse(bettanyGreeting);
        setVoiceTranscript("");
        setVoiceState("speaking");
        speakWithJarvis({
          text: bettanyGreeting,
          isHi: false,
          onStart: () => setVoiceState("speaking"),
          onEnd: () => {
            setVoiceTranscript("");
            setVoiceState("listening");
            startVoiceModeListening();
          },
          onError: () => {
            setVoiceTranscript("");
            setVoiceState("listening");
            startVoiceModeListening();
          },
        });
      }
    }
  };

  const handleCloseVoiceMode = () => {
    sound.playVoteClick();
    stopJarvisSpeech();
    if (voiceDebounceTimerRef.current) {
      clearTimeout(voiceDebounceTimerRef.current);
    }
    if (voiceRecognizerRef.current) {
      try {
        voiceRecognizerRef.current.stop();
      } catch {}
    }
    setVoiceModeOpen(false);
    setVoiceState("idle");
    setVoiceTranscript("");
  };

  const handleInterruptJarvis = () => {
    sound.playVoteClick();
    stopJarvisSpeech();
    if (voiceDebounceTimerRef.current) {
      clearTimeout(voiceDebounceTimerRef.current);
    }
    setVoiceTranscript("");
    setVoiceState("listening");
    startVoiceModeListening();
  };

  const handleToggleVoiceModeMute = () => {
    sound.playVoteClick();
    if (voiceMuted) {
      setVoiceMuted(false);
      startVoiceModeListening();
    } else {
      setVoiceMuted(true);
      if (voiceDebounceTimerRef.current) {
        clearTimeout(voiceDebounceTimerRef.current);
      }
      if (voiceRecognizerRef.current) {
        try {
          voiceRecognizerRef.current.stop();
        } catch {}
      }
    }
  };

  const handleOrbClick = () => {
    sound.playVoteClick();
    if (voiceState === "speaking") {
      stopJarvisSpeech();
      setVoiceTranscript("");
      setVoiceState("listening");
      startVoiceModeListening();
    } else if (voiceState === "listening" && voiceTranscript.trim()) {
      if (voiceDebounceTimerRef.current) clearTimeout(voiceDebounceTimerRef.current);
      handleVoiceModeUserQuery(voiceTranscript.trim());
    } else if (voiceState === "idle") {
      startVoiceModeListening();
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleImageFile(e.dataTransfer.files[0]);
        }
      }}
      className="flex h-screen w-full overflow-hidden bg-[var(--card-bg)] text-[var(--foreground)] relative"
    >
      {/* Drag & Drop Visual Backdrop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-[#0B1220]/80 backdrop-blur-md flex flex-col items-center justify-center border-4 border-dashed border-[#F97316] m-4 rounded-3xl animate-in fade-in">
          <ImageIcon className="w-16 h-16 text-[#F97316] animate-bounce mb-3" />
          <h3 className="text-xl font-bold text-white">
            {isHi ? "फोटो यहाँ छोड़ें" : "Drop your photo here"}
          </h3>
          <p className="text-sm font-mono text-[#CBD5E1] mt-1">
            {isHi
              ? "HYPE AI विज़न व डिज़ाइन विश्लेषण के लिए तैयार है"
              : "Ready for HYPE AI Vision & Design Enhancement"}
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5-SECOND UNDO TOAST FLOATING BANNER                                       */}
      {/* ========================================================================= */}
      {undoState && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="relative overflow-hidden flex items-center gap-3.5 px-4 py-2.5 rounded-full bg-[#0B1220] border border-[#F97316]/50 shadow-2xl text-white text-xs font-mono backdrop-blur-xl">
            <span className="flex items-center gap-2">
              <RotateCcw className="w-3.5 h-3.5 text-[#F97316] animate-spin" />
              <span className="font-medium text-[#CBD5E1] truncate max-w-[200px]">
                {undoState.message}
              </span>
            </span>

            <div className="h-4 w-px bg-[#334155]" />

            <button
              type="button"
              onClick={handleUndo}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold text-xs transition cursor-pointer active:scale-95 shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{isHi ? "पूर्ववत करें" : "Undo"}</span>
              <span className="bg-black/40 px-1.5 py-0.5 rounded-full text-[10px] font-mono">
                {undoState.countdown}s
              </span>
            </button>

            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#334155]">
              <div className="h-full bg-[#F97316] animate-undo-progress" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ENLARGED PHOTO PREVIEW MODAL                                              */}
      {/* ========================================================================= */}
      {selectedEnlargedImage && (
        <div
          onClick={() => setSelectedEnlargedImage(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden p-2 shadow-2xl space-y-3"
          >
            <button
              type="button"
              onClick={() => setSelectedEnlargedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-[#F97316] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={selectedEnlargedImage}
              alt="Enlarged view"
              className="max-h-[80vh] w-auto object-contain rounded-2xl mx-auto"
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PHOTO ENHANCE STUDIO MODAL                                                */}
      {/* ========================================================================= */}
      {enhanceModalOpen && attachedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-5 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#F97316]/15 border border-[#F97316]/40 flex items-center justify-center text-[#F97316]">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--foreground)] flex items-center gap-2">
                    <span>{isHi ? "फोटो स्टूडियो व एन्हांस टूल" : "Photo Studio & Enhancement"}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] font-semibold">
                      Live Filters
                    </span>
                  </h3>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {isHi
                      ? "फ़िल्टर लगाएं, चमक व कंट्रास्ट सेट करें और चैट में उपयोग करें"
                      : "Adjust lighting, apply aesthetic presets & download or apply to chat"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEnhanceModalOpen(false)}
                className="p-1.5 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Filter Preview */}
            <div className="relative rounded-2xl overflow-hidden bg-black/40 flex items-center justify-center border border-[var(--border)] max-h-72">
              <img
                src={originalImage || attachedImage}
                alt="Enhance preview"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${sepia}%)`,
                }}
                className="max-h-64 w-auto object-contain transition-all duration-150"
              />
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white/90">
                {activePreset
                  ? `Preset: ${FILTER_PRESETS.find((p) => p.id === activePreset)?.name}`
                  : `B: ${brightness}% • C: ${contrast}% • S: ${saturation}%`}
              </div>
            </div>

            {/* Filter Preset Chips */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-[var(--muted-foreground)] uppercase tracking-wider block">
                {isHi ? "त्वरित फ़िल्टर प्रीसेट" : "Quick Aesthetic Presets"}
              </label>
              <div className="flex flex-wrap gap-2">
                {FILTER_PRESETS.map((preset) => {
                  const isCurrent = activePreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                        isCurrent
                          ? "bg-[#F97316] text-white font-semibold shadow-xs"
                          : "bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)]"
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{isHi ? preset.nameHi : preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fine-Tuning Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Brightness */}
              <div className="space-y-1 bg-[var(--card-bg)] p-2.5 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>{isHi ? "चमक (Brightness)" : "Brightness"}</span>
                  <span className="text-[#F97316] font-bold">{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => {
                    setActivePreset(null);
                    setBrightness(Number(e.target.value));
                  }}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div className="space-y-1 bg-[var(--card-bg)] p-2.5 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>{isHi ? "कंट्रास्ट (Contrast)" : "Contrast"}</span>
                  <span className="text-[#F97316] font-bold">{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="175"
                  value={contrast}
                  onChange={(e) => {
                    setActivePreset(null);
                    setContrast(Number(e.target.value));
                  }}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div className="space-y-1 bg-[var(--card-bg)] p-2.5 rounded-xl border border-[var(--border)]">
                <div className="flex justify-between text-[11px] font-mono">
                  <span>{isHi ? "संतृप्ति (Saturation)" : "Saturation"}</span>
                  <span className="text-[#F97316] font-bold">{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => {
                    setActivePreset(null);
                    setSaturation(Number(e.target.value));
                  }}
                  className="w-full accent-[#F97316] cursor-pointer"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{isHi ? "रीसेट करें" : "Reset"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadEnhanced}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-semibold text-[var(--foreground)] transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#F97316]" />
                  <span>{isHi ? "डाउनलोड फोटो" : "Download PNG"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyEnhancedToChat}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-semibold transition cursor-pointer shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isHi ? "चैट में उपयोग करें" : "Apply to Chat"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* LEFT SIDEBAR: ChatGPT-Style Chat History & Logs with Animated Dustbin     */}
      {/* ========================================================================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col justify-between transition-all duration-300 md:static ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${
          sidebarCollapsed
            ? "md:w-0 md:p-0 md:opacity-0 md:overflow-hidden md:border-r-0 pointer-events-none md:pointer-events-none"
            : "w-72 p-3.5 opacity-100"
        }`}
      >
        <div className="space-y-3 flex flex-col flex-1 overflow-hidden">
          {/* Top Actions: + New Chat, Collapse Sidebar & Reset All */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleNewChat}
              className="flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--foreground)] font-semibold text-xs shadow-xs hover:border-[#F97316] transition cursor-pointer group"
            >
              <Plus className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
              <span>{isHi ? "नई चैट" : "New Chat"}</span>
            </button>

            {/* Collapse Sidebar Button on Desktop */}
            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setSidebarCollapsed(true);
              }}
              className="hidden md:flex p-2.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[#F97316] text-[var(--muted-foreground)] hover:text-[#F97316] transition cursor-pointer shrink-0"
              title={isHi ? "साइडबार छुपाएं (Ctrl+B)" : "Hide Sidebar (Ctrl+B)"}
              aria-label="Hide sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetAll}
              className="trash-btn p-2.5 rounded-xl bg-[var(--card-bg)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/40 text-[var(--muted-foreground)] hover:text-red-500 transition cursor-pointer shrink-0"
              title={isHi ? "सभी चैट रीसेट करें (48h लॉग)" : "Reset all chats (48h log)"}
              aria-label="Reset all chats"
            >
              <AnimatedDustbinIcon className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 rounded-xl text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section Header: Chat History Label */}
          <div className="flex items-center justify-between px-2 pt-1 text-[11px] font-mono text-[var(--muted-foreground)] shrink-0">
            <span className="uppercase tracking-wider font-semibold">
              {isHi ? "चैट इतिहास (48h)" : "Chat History (48h)"}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[var(--card-bg)] border border-[var(--border)] font-bold">
              {sessions.length}
            </span>
          </div>

          {/* Chat Stream Log */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {sessions.length === 0 ? (
              <div className="p-6 text-center space-y-2 text-[var(--muted-foreground)] text-xs font-mono">
                <MessageSquare className="w-6 h-6 mx-auto opacity-40 text-[#F97316]" />
                <p>{isHi ? "कोई पिछला चैट नहीं है" : "No chat history yet"}</p>
              </div>
            ) : (
              sessions.map((sess) => {
                const isActive = sess.id === activeSessionId;
                const isRoastItem =
                  sess.mode === "roast" ||
                  sess.mode === "roast18" ||
                  sess.mode === "noty";

                return (
                  <div
                    key={sess.id}
                    onClick={() => {
                      sound.playVoteClick();
                      setActiveSessionId(sess.id);
                      setSelectedMode(isRoastItem ? "roast" : "hype");
                      updateRemaining(sess.updatedAt);
                      setSidebarOpen(false);
                    }}
                    className={`group relative flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer font-medium ${
                      isActive
                        ? "bg-[var(--card-bg)] border border-[#F97316]/60 text-[var(--foreground)] shadow-xs"
                        : "hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
                      <div className="shrink-0 text-[#F97316]">
                        {isRoastItem ? (
                          <Flame className="w-4 h-4" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </div>
                      <div className="overflow-hidden space-y-0.5">
                        <span className="block truncate font-semibold">
                          {sess.title}
                        </span>
                        <span className="block text-[10px] font-mono text-[var(--muted-foreground)] opacity-70">
                          {formatRelativeTime(sess.updatedAt, isHi)} &bull;{" "}
                          {sess.messages.length} msgs
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(sess.id, e)}
                      className="trash-btn p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-500 transition-all cursor-pointer shrink-0"
                      title={isHi ? "यह चैट हटाएं" : "Delete this conversation"}
                      aria-label="Delete chat"
                    >
                      <AnimatedDustbinIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Bottom Sidebar: 48-Hour Auto-Delete Badge */}
        <div className="pt-3 border-t border-[var(--border)] shrink-0">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-[11px] font-mono text-[var(--muted-foreground)]">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="text-[10px] uppercase font-bold text-[var(--foreground)]">
                {isHi ? "48h स्वतः-डिलीट" : "48h Auto-Delete"}
              </span>
            </span>
            <span className="text-[#F97316] font-bold text-[10px] bg-[#F97316]/10 px-1.5 py-0.5 rounded border border-[#F97316]/30">
              {remainingTimeText}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CHAT AREA (Dual Mode: HYPE AI & ROAST AI)                             */}
      {/* ========================================================================= */}
      <section className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Bar */}
        <div className="h-14 border-b border-[var(--border)] px-3 sm:px-4 flex items-center justify-between bg-[var(--surface)] z-20 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sidebar Toggle Button (Desktop & Mobile) */}
            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                if (typeof window !== "undefined" && window.innerWidth < 768) {
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              className="p-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[#F97316] text-[var(--muted-foreground)] hover:text-[#F97316] transition cursor-pointer flex items-center justify-center shadow-xs"
              title={
                sidebarCollapsed
                  ? isHi
                    ? "साइडबार दिखाएं (Ctrl+B)"
                    : "Show sidebar (Ctrl+B)"
                  : isHi
                  ? "साइडबार छुपाएं (Ctrl+B)"
                  : "Hide sidebar (Ctrl+B)"
              }
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-[#F97316]" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* ChatGPT-Style Model Dropdown Selector (Top Header, like ChatGPT 4o ⌵) */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setModeDropdownOpen(!modeDropdownOpen);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-[var(--surface-hover)] text-[var(--foreground)] transition cursor-pointer group"
                aria-label="Select AI Model"
              >
                <span className="font-bold text-sm sm:text-base tracking-tight text-[var(--foreground)]">
                  {activeModeId === "hype" ? "Hype AI" : "Roast AI"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--foreground)] transition-transform duration-200 ${
                    modeDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ChatGPT-Style Model Dropdown Menu */}
              {modeDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] border-b border-[var(--border)] flex items-center justify-between">
                    <span>{isHi ? "मॉडल / मोड चुनें" : "Model"}</span>
                    <span className="text-[#F97316] font-bold">2 MODES</span>
                  </div>

                  {/* HYPE AI Option */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSwitchMode("hype");
                      setModeDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                      activeModeId === "hype"
                        ? "bg-[var(--surface-hover)] border border-[#F97316]/50 text-[var(--foreground)] font-semibold"
                        : "hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--foreground)]">Hype AI</span>
                        {activeModeId === "hype" && <Check className="w-4 h-4 text-[#F97316]" />}
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">
                        {isHi
                          ? "समस्या समाधान, कोडिंग, फोटो विज़न और गंभीर सलाह"
                          : "Smartest model for coding, problem solving & vision"}
                      </p>
                    </div>
                  </button>

                  {/* ROAST AI Option */}
                  <button
                    type="button"
                    onClick={() => {
                      handleSwitchMode("roast");
                      setModeDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition cursor-pointer ${
                      activeModeId === "roast"
                        ? "bg-[var(--surface-hover)] border border-orange-500/50 text-[var(--foreground)] font-semibold"
                        : "hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Flame className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--foreground)]">Roast AI</span>
                        {activeModeId === "roast" && <Check className="w-4 h-4 text-[#F97316]" />}
                      </div>
                      <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">
                        {isHi
                          ? "तीखे रोस्ट, फोटो रोस्ट और बेबाक हास्य"
                          : "Savage humor, brutal burns & photo roasts"}
                      </p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Controls: Theme, Language, Reset Chat & Top Right Home Button */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Day / Night Theme Switch */}
            <button
              type="button"
              onClick={() => {
                sound.playVoteClick();
                setTheme(resolvedTheme === "day" ? "night" : "day");
              }}
              className="p-2 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[#F97316] transition cursor-pointer"
              title={isDark ? "Day Mode" : "Night Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Language Switcher (Hindi / English) */}
            <button
              type="button"
              onClick={() => {
                const nextLang = language === "en" ? "hi" : "en";
                handleSwitchLanguage(nextLang);
              }}
              className="px-2.5 py-1.5 rounded-xl bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--foreground)] hover:text-[#F97316] transition cursor-pointer flex items-center gap-1"
              title={
                language === "en"
                  ? "Switch to Hindi"
                  : "Switch to English"
              }
            >
              <span>{language === "en" ? "Hindi" : "English"}</span>
            </button>

            {/* Reset Chat Button */}
            <button
              type="button"
              onClick={() => {
                if (activeSessionId) {
                  handleDeleteSession(activeSessionId);
                }
              }}
              className="trash-btn flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[var(--card-bg)] hover:bg-red-500/10 border border-[var(--border)] hover:border-red-500/40 text-[var(--muted-foreground)] hover:text-red-500 text-xs font-mono transition cursor-pointer"
              title={isHi ? "यह चैट डिलीट करें" : "Reset active chat"}
            >
              <AnimatedDustbinIcon className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isHi ? "रीसेट" : "Reset"}</span>
            </button>

            {/* Top Right Home Button (As requested by user) */}
            <Link
              href="/"
              onClick={() => sound.playVoteClick()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-bold transition shadow-xs cursor-pointer group shrink-0"
              title={isHi ? "होम पेज पर वापस जाएं" : "Return to Home"}
            >
              <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">{isHi ? "होम" : "Home"}</span>
            </Link>
          </div>
        </div>

        {/* Message Feed Container */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Welcome Screen when active chat is empty */}
          {messages.length === 0 && (
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center items-center text-center space-y-6 py-6">
              <AnimatedHypeEmblem
                isDark={isDark}
                activeModeIcon={activeModeObj.icon}
              />

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-xs font-mono text-[#F97316] font-bold">
                  {activeModeId === "hype" ? (
                    <>
                      <Zap className="w-3.5 h-3.5" />
                      <span>HYPE AI • PROBLEM SOLVER & VISION</span>
                    </>
                  ) : (
                    <>
                      <Flame className="w-3.5 h-3.5" />
                      <span>ROAST AI • SAVAGE VIBE CHECKER</span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
                  {activeModeId === "hype"
                    ? isHi
                      ? "आप क्या हल या डिज़ाइन करना चाहते हैं?"
                      : "What challenge or design are we solving?"
                    : isHi
                    ? "किसे रोस्ट करवाना चाहते हैं?"
                    : "What are we roasting today?"}
                </h1>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mx-auto">
                  {isHi ? activeModeObj.taglineHi : activeModeObj.tagline}
                </p>
              </div>


              {/* Prompt Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                {activeModeObj.starters.map((starter, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendMessage(starter)}
                    className="p-3.5 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[#F97316] text-xs text-[var(--foreground)] transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-between group"
                  >
                    <span>{starter}</span>
                    <span className="text-[var(--muted-foreground)] group-hover:text-[#F97316] group-hover:translate-x-0.5 transition-all text-sm">
                      &rarr;
                    </span>
                  </button>
                ))}
              </div>

              {/* Photo Upload Shortcut */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-2xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-dashed border-[#F97316]/40 hover:border-[#F97316] text-xs text-[var(--muted-foreground)] hover:text-[#F97316] transition flex items-center justify-center gap-2 cursor-pointer group shadow-xs"
              >
                <ImageIcon className="w-4 h-4 text-[#F97316] group-hover:scale-110 transition-transform" />
                <span className="font-semibold">
                  {isHi
                    ? "फोटो अपलोड करें — फोटो रोस्ट, विज़न विश्लेषण या इमेज एन्हांस के लिए"
                    : "Upload photo for Vision analysis, Photo Roast or Enhance"}
                </span>
              </button>
            </div>
          )}

          {/* Render Active Messages */}
          {messages.length > 0 && (
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg, idx) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3.5 ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-1 shadow-xs p-1 text-[#F97316]">
                        <MiniHypeLogoIcon isDark={isDark} />
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed space-y-2 ${
                        isUser
                          ? "bg-[#F97316] text-white shadow-xs font-normal rounded-tr-sm"
                          : "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] rounded-tl-sm shadow-xs"
                      }`}
                    >
                      {/* Assistant Header Tag: HYPE AI or ROAST AI (Strict requirement) */}
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-[var(--border)] text-[10px] font-mono">
                          <span className="flex items-center gap-1.5 font-bold tracking-wider text-[#F97316]">
                            {activeModeId === "hype" ? (
                              <>
                                <Zap className="w-3.5 h-3.5" />
                                <span>HYPE AI</span>
                              </>
                            ) : (
                              <>
                                <Flame className="w-3.5 h-3.5" />
                                <span>ROAST AI</span>
                              </>
                            )}
                          </span>
                          <span className="text-[var(--muted-foreground)] text-[10px]">
                            {activeModeId === "hype"
                              ? isHi
                                ? "समस्या समाधान • विज़न एआई"
                                : "Problem Solving &bull; Vision AI"
                              : isHi
                              ? "कड़क रोस्ट • वाइब चेकर"
                              : "Savage Roast &bull; Vibe Checker"}
                          </span>
                        </div>
                      )}

                      {/* Attached Image inside User Message Bubble */}
                      {msg.image && (
                        <div className="relative group/img rounded-xl overflow-hidden border border-white/20 max-w-sm mb-2 shadow-xs">
                          <img
                            src={msg.image}
                            alt="Uploaded visual"
                            className="max-h-56 w-auto object-cover rounded-lg cursor-pointer hover:opacity-95 transition"
                            onClick={() => setSelectedEnlargedImage(msg.image!)}
                          />
                          <button
                            type="button"
                            onClick={() => setSelectedEnlargedImage(msg.image!)}
                            className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition flex items-center gap-1 cursor-pointer"
                          >
                            <Maximize2 className="w-3 h-3" />
                            <span>{isHi ? "बड़ा देखें" : "Enlarge"}</span>
                          </button>
                        </div>
                      )}

                      <div className="whitespace-pre-wrap">{msg.content}</div>

                      {/* Copy & Speak with Jarvis buttons */}
                      {!isUser && (
                        <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
                          {/* Speak with J.A.R.V.I.S. Voice */}
                          <button
                            type="button"
                            onClick={() => handleSpeakMessage(msg.content, idx)}
                            className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted-foreground)] hover:text-[#F97316] px-2 py-0.5 rounded-lg hover:bg-[var(--surface-hover)] transition cursor-pointer"
                            title={isHi ? "जार्विस की आवाज़ में सुनें" : "Listen in J.A.R.V.I.S. voice"}
                          >
                            {speakingMessageIdx === idx ? (
                              <>
                                <VolumeX className="w-3 h-3 text-[#F97316] animate-pulse" />
                                <span className="text-[#F97316]">
                                  {isHi ? "रोकें" : "Stop"}
                                </span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3 h-3" />
                                <span>{isHi ? "सुनें" : "Listen"}</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(msg.content, idx)}
                            className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted-foreground)] hover:text-[#F97316] px-2 py-0.5 rounded-lg hover:bg-[var(--surface-hover)] transition cursor-pointer"
                            title="Copy reply"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-[#F97316]" />
                                <span className="text-[#F97316]">
                                  {isHi ? "कॉपी हो गया" : "Copied"}
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{isHi ? "कॉपी" : "Copy"}</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--foreground)] shrink-0 mt-1">
                        <User className="w-4 h-4 text-[var(--foreground)]" />
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-start gap-3.5 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center shrink-0 animate-pulse p-1 text-[#F97316] shadow-xs">
                    <MiniHypeLogoIcon isDark={isDark} />
                  </div>
                  <div className="border border-[var(--border)] bg-[var(--surface)] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F97316] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F97316]"></span>
                    </span>
                    <span>
                      {activeModeId === "hype"
                        ? isHi
                          ? "HYPE AI विश्लेषण व समाधान तैयार कर रहा है..."
                          : "HYPE AI is reasoning & solving..."
                        : isHi
                        ? "ROAST AI कड़क रोस्ट तैयार कर रहा है..."
                        : "ROAST AI is cooking a savage burn..."}
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM INPUT BAR & PHOTO ATTACHMENT TRAY                                  */}
        {/* ========================================================================= */}
        <div className="p-4 bg-gradient-to-t from-[var(--card-bg)] via-[var(--card-bg)]/90 to-transparent shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            {/* Attached Image Preview Tray with Enhance Button */}
            {attachedImage && (
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-[var(--surface)] border border-[#F97316]/50 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                    <img
                      src={attachedImage}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--foreground)] flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>{isHi ? "फोटो संलग्न है" : "Photo Attached"}</span>
                    </div>
                    <p className="text-[10px] text-[var(--muted-foreground)]">
                      {activeModeId === "hype"
                        ? isHi
                          ? "विज़न व डिज़ाइन विश्लेषण के लिए तैयार"
                          : "Ready for Vision analysis & design review"
                        : isHi
                        ? "रोस्ट के लिए तैयार"
                        : "Ready to be roasted"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEnhanceModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F97316]/15 hover:bg-[#F97316]/25 border border-[#F97316]/40 text-xs font-semibold text-[#F97316] transition cursor-pointer"
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>{isHi ? "एन्हांस / डिज़ाइन" : "Enhance / Filter"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttachedImage(null);
                      setOriginalImage(null);
                    }}
                    className="p-1.5 rounded-xl hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-500 transition cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Hidden File Input for Photo Upload */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageFile(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {/* ChatGPT-Style Pill Input Box (as shown in user screenshot) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative rounded-full border border-[var(--border)] focus-within:border-[var(--border-hover)] shadow-md hover:shadow-lg transition-all flex items-center px-2 sm:px-3 py-1.5 sm:py-2 gap-2 bg-[var(--surface)]"
            >
              {/* Plus Button on Left (+) */}
              <div className="relative shrink-0" ref={plusMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setPlusMenuOpen(!plusMenuOpen);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-[var(--surface-hover)] text-[var(--foreground)] flex items-center justify-center transition cursor-pointer shrink-0"
                  title={isHi ? "टूल्स और अटैचमेंट्स (+)" : "Tools & Attachments (+)"}
                  aria-label="Add attachment or switch mode"
                >
                  <Plus className="w-5 h-5 text-[var(--foreground)]" />
                </button>

                {/* ChatGPT-Style Plus Popover Menu */}
                {plusMenuOpen && (
                  <div className="absolute bottom-full mb-2.5 left-0 w-64 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef.current?.click();
                        setPlusMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[var(--surface-hover)] text-[var(--foreground)] text-xs font-medium transition cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4 text-[#F97316]" />
                      <span>{isHi ? "फोटो अपलोड करें" : "Upload Photo / Image"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSwitchMode("hype");
                        setPlusMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                        activeModeId === "hype"
                          ? "bg-[var(--surface-hover)] font-bold text-[#F97316]"
                          : "hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-[#F97316]" />
                        <span>Hype AI</span>
                      </span>
                      {activeModeId === "hype" && <Check className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSwitchMode("roast");
                        setPlusMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition cursor-pointer ${
                        activeModeId === "roast"
                          ? "bg-[var(--surface-hover)] font-bold text-orange-500"
                          : "hover:bg-[var(--surface-hover)] text-[var(--foreground)]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span>Roast AI</span>
                      </span>
                      {activeModeId === "roast" && <Check className="w-3.5 h-3.5" />}
                    </button>

                    {attachedImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setEnhanceModalOpen(true);
                          setPlusMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left hover:bg-[var(--surface-hover)] text-[#F97316] text-xs font-semibold transition cursor-pointer border-t border-[var(--border)] pt-2"
                      >
                        <Wand2 className="w-4 h-4" />
                        <span>{isHi ? "फोटो स्टूडियो एन्हांस" : "Photo Studio Enhance"}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Input Text Area / Input */}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isListening
                    ? isHi
                      ? "सुन रहा हूँ... बोलिए..."
                      : "Listening... speak now..."
                    : attachedImage
                    ? isHi
                      ? "फोटो के बारे में पूछें..."
                      : "Ask about this photo..."
                    : activeModeId === "hype"
                    ? isHi
                      ? "Ask ChatGPT / Hype AI..."
                      : "Ask Hype AI..."
                    : isHi
                    ? "Ask Roast AI..."
                    : "Ask Roast AI..."
                }
                disabled={loading}
                className="flex-1 bg-transparent px-2.5 py-1 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none min-w-0"
              />

              {/* Right Controls: Mic Icon & Circular Send/Voice Button (as in ChatGPT screenshot) */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Mic Icon (Speech-to-text dictation into input bar) */}
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full hover:bg-[var(--surface-hover)] flex items-center justify-center transition cursor-pointer ${
                    isListening
                      ? "text-[#F97316] bg-[#F97316]/15 ring-2 ring-[#F97316]/50 animate-pulse"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  }`}
                  title={
                    isListening
                      ? isHi
                        ? "रिकॉर्डिंग रोकें"
                        : "Stop Voice Typing"
                      : isHi
                      ? "माइक से बोलकर टाइप करें"
                      : "Voice Typing (Speech to Text)"
                  }
                  aria-label="Voice input"
                >
                  <Mic className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                </button>

                {/* Circular Action Button: Voice Waveform opens Voice Mode; Arrow Up sends text */}
                {input.trim() || attachedImage ? (
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition cursor-pointer bg-[#0F172A] dark:bg-white text-white dark:text-black hover:opacity-90 shadow-md shrink-0"
                    aria-label="Send message"
                    title={isHi ? "मैसेज भेजें" : "Send message"}
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <ArrowUp className="w-4.5 h-4.5 stroke-[2.5]" />
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenVoiceMode}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition cursor-pointer bg-[#E2E8F0]/85 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-[#CBD5E1] dark:hover:bg-slate-700 hover:text-[#F97316] shadow-sm shrink-0 group/voice active:scale-95"
                    aria-label="Start J.A.R.V.I.S. Real-Time Voice Mode"
                    title={
                      isHi
                        ? "जार्विस वॉइस चैट मोड (Iron Man Agent Voice)"
                        : "Start J.A.R.V.I.S. Voice Mode (Iron Man Agent Voice)"
                    }
                  >
                    {/* 4-bar Audio Waveform icon (exact ChatGPT UI) */}
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4.5 h-4.5 text-current group-hover/voice:scale-110 transition-transform"
                    >
                      <rect x="3.5" y="9" width="2" height="6" rx="1" />
                      <rect x="8.5" y="5" width="2" height="14" rx="1" />
                      <rect x="13.5" y="3" width="2" height="18" rx="1" />
                      <rect x="18.5" y="8" width="2" height="8" rx="1" />
                    </svg>
                  </button>
                )}
              </div>
            </form>

            {/* AI Disclaimer Note */}
            <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--muted-foreground)] font-mono pt-1">
              <AlertTriangle className="w-3 h-3 text-[#F97316] shrink-0" />
              <span>
                {activeModeId === "hype"
                  ? isHi
                    ? "HYPE AI समस्या समाधान व विज़न सहायक। महत्वपूर्ण जानकारी सत्यापित करें।"
                    : "HYPE AI Problem Solver & Vision. Verify critical decisions."
                  : isHi
                  ? "ROAST AI व्यंग्य व हास्य के लिए है। दिल पर न लें।"
                  : "ROAST AI is for satire & savage humor. Take it lightly."}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* J.A.R.V.I.S. REAL-TIME VOICE MODE OVERLAY (IRON MAN AGENT VOICE)         */}
      {/* ========================================================================= */}
      {voiceModeOpen && (
        <div className="fixed inset-0 z-50 bg-[#060810]/95 backdrop-blur-2xl flex flex-col justify-between text-white p-6 sm:p-10 select-none animate-in fade-in duration-200">
          {/* Top Bar HUD */}
          <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            {/* J.A.R.V.I.S. HUD Indicator */}
            <div className="flex items-center gap-3">
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <span className="absolute w-full h-full rounded-full bg-cyan-400 animate-ping opacity-75" />
                <span className="relative w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-cyan-400">
                    J.A.R.V.I.S.
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    VOICE LOUNGE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-cyan-300/80">
                  {voiceLanguage === "hi" || isHi
                    ? "J.A.R.V.I.S. • Hindi Mode"
                    : "J.A.R.V.I.S. • English Mode"}
                </p>
              </div>
            </div>

            {/* Language, Mode & Close Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Voice Language Toggle (Hindi / English) */}
              <button
                type="button"
                onClick={() => {
                  const nextLang = voiceLanguage === "hi" ? "en" : "hi";
                  handleSwitchLanguage(nextLang);
                }}
                className={`px-2.5 sm:px-3 py-1 rounded-full border text-[11px] sm:text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                  voiceLanguage === "hi"
                    ? "bg-[#F97316]/20 border-[#F97316]/50 text-[#F97316] font-bold"
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-cyan-300"
                }`}
                title="Switch voice language between Hindi and English"
              >
                <span>
                  {voiceLanguage === "hi"
                    ? "🇮🇳 Hindi"
                    : "🇬🇧 English"}
                </span>
              </button>



              <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-1.5">
                {activeModeId === "hype" ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>HYPE</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>ROAST</span>
                  </>
                )}
              </div>

              {/* Close Voice Mode Button */}
              <button
                type="button"
                onClick={handleCloseVoiceMode}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
                title={isHi ? "वॉइस मोड बंद करें" : "Exit Voice Mode"}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Voice Visualizer (ChatGPT Undulating Orb + Jarvis Arc Reactor) */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 sm:space-y-8 my-auto max-w-xl mx-auto w-full text-center">
            {/* Dynamic Animated Orb / Arc Reactor (Clickable: Tap to interrupt or submit) */}
            <div
              onClick={handleOrbClick}
              className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center cursor-pointer group"
              title={
                voiceState === "speaking"
                  ? "Tap to interrupt Jarvis"
                  : voiceState === "listening"
                  ? "Tap to submit speech immediately"
                  : "Tap to activate Jarvis"
              }
            >
              {/* Ambient Glow */}
              <div
                className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
                  voiceState === "speaking"
                    ? "bg-[#F97316]/30 scale-125"
                    : voiceState === "listening"
                    ? "bg-cyan-500/25 scale-110 animate-pulse"
                    : "bg-cyan-500/15 scale-95"
                }`}
              />

              {/* Outer Energy Orbit */}
              <div
                className={`absolute inset-4 rounded-full border border-dashed transition-all duration-500 ${
                  voiceState === "speaking"
                    ? "border-[#F97316]/60 animate-spin-orbit scale-105"
                    : voiceState === "listening"
                    ? "border-cyan-400/50 animate-pulse"
                    : "border-slate-600/40"
                }`}
              />

              {/* Concentric Arc Ring */}
              <div
                className={`absolute inset-10 rounded-full border transition-all duration-300 ${
                  voiceState === "speaking"
                    ? "border-[#F97316]/80 scale-110 shadow-[0_0_30px_#F97316]"
                    : voiceState === "listening"
                    ? "border-cyan-400/80 scale-100 shadow-[0_0_25px_#22d3ee]"
                    : "border-slate-500/30"
                }`}
              />

              {/* Core Pulsing Orb */}
              <div
                className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl group-hover:scale-105 ${
                  voiceState === "speaking"
                    ? "bg-gradient-to-tr from-[#F97316] via-[#FB923C] to-[#F59E0B] shadow-[0_0_50px_#F97316] scale-110 animate-pulse"
                    : voiceState === "listening"
                    ? "bg-gradient-to-tr from-cyan-500 via-sky-400 to-blue-600 shadow-[0_0_40px_#06b6d4] scale-105"
                    : voiceState === "processing"
                    ? "bg-gradient-to-tr from-amber-500 to-cyan-500 animate-spin"
                    : "bg-slate-800 border border-slate-700"
                }`}
              >
                {voiceState === "speaking" ? (
                  <Volume2 className="w-10 h-10 text-white animate-pulse" />
                ) : voiceState === "listening" ? (
                  <Mic className="w-10 h-10 text-white animate-pulse" />
                ) : voiceState === "processing" ? (
                  <RefreshCw className="w-8 h-8 text-white animate-spin" />
                ) : (
                  <Radio className="w-8 h-8 text-slate-400" />
                )}
              </div>
            </div>

            {/* Voice Status Indicator Text */}
            <div className="space-y-2">
              <div className="font-mono text-xs uppercase tracking-widest font-bold">
                {voiceState === "speaking" ? (
                  <span className="text-[#F97316] flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F97316] animate-ping" />
                    JARVIS SPEAKING... (TAP TO INTERRUPT)
                  </span>
                ) : voiceState === "listening" ? (
                  <span className="text-cyan-400 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    LISTENING TO YOU, SIR...
                  </span>
                ) : voiceState === "processing" ? (
                  <span className="text-amber-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    JARVIS CALCULATING...
                  </span>
                ) : (
                  <span className="text-slate-400">READY</span>
                )}
              </div>

              {/* Live Conversation Transcript Subtitle Box */}
              <div className="min-h-[72px] flex flex-col items-center justify-center px-4">
                {voiceState === "speaking" && voiceAiResponse ? (
                  <p className="text-sm sm:text-base text-slate-100 font-sans max-w-lg leading-relaxed bg-white/5 border border-white/10 rounded-2xl px-5 py-3 shadow-lg backdrop-blur-md">
                    &ldquo;{cleanTextForJarvis(voiceAiResponse).slice(0, 240)}...&rdquo;
                  </p>
                ) : voiceTranscript ? (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-cyan-200 font-mono max-w-lg leading-relaxed bg-cyan-950/30 border border-cyan-800/40 rounded-2xl px-5 py-3 shadow-md">
                      &ldquo;{voiceTranscript}&rdquo;
                    </p>
                    {voiceState === "listening" && (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playVoteClick();
                          if (voiceDebounceTimerRef.current) clearTimeout(voiceDebounceTimerRef.current);
                          handleVoiceModeUserQuery(voiceTranscript.trim());
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition cursor-pointer shadow-lg"
                      >
                        <span>{isHi ? "तुरंत भेजें ⚡" : "Send Now ⚡"}</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-400 font-mono">
                    {isHi || voiceLanguage === "hi"
                      ? "कुछ भी बोलिए, जार्विस सीधे आवाज़ में जवाब देगा..."
                      : "Speak naturally, sir. Jarvis will answer out loud..."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Voice Controls */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full max-w-md mx-auto pb-4">
            {/* Mute / Unmute Mic Button */}
            <button
              type="button"
              onClick={handleToggleVoiceModeMute}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition cursor-pointer shadow-lg ${
                voiceMuted
                  ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                  : "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              }`}
              title={voiceMuted ? "Unmute Mic" : "Mute Mic"}
            >
              {voiceMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>

            {/* Interrupt / Stop Speaking Button */}
            {voiceState === "speaking" && (
              <button
                type="button"
                onClick={handleInterruptJarvis}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer shadow-lg animate-pulse"
                title={isHi ? "जार्विस को रोकें" : "Interrupt Jarvis"}
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            )}

            {/* Exit Voice Mode (Return to Text) */}
            <button
              type="button"
              onClick={handleCloseVoiceMode}
              className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer shadow-lg"
              title={isHi ? "टेक्स्ट चैट पर वापस जाएँ" : "Return to text chat"}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
