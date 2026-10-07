"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  sendSpicyChatMessage,
  ChatPersonality,
  ChatMessage,
} from "@/app/actions/spicyChat";
import { sound } from "@/lib/audio";
import {
  Flame,
  Sparkles,
  Send,
  Loader2,
  Trash2,
  Smile,
  Copy,
  Check,
  X,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Bot,
  Zap,
  Moon,
  MessageSquare,
} from "lucide-react";

interface SpicyChatbotProps {
  embedded?: boolean;
  onClose?: () => void;
}

const STARTER_PROMPTS: Record<ChatPersonality, string[]> = {
  hype: [
    "What trends are popping off right now?",
    "Analyze the latest frontier AI developments",
    "Give me high-voltage motivation to build",
    "Break down modern web architecture",
  ],
  roast: [
    "Roast my startup pitchdeck brutally",
    "Roast my code style with zero filter",
    "Why do tech influencers talk about morning routines?",
    "Savage roast my career roadmap",
  ],
  noty: [
    "Rate my most toxic red flag",
    "Give me a witty flirty pickup line",
    "Tell me why you find my aesthetic irresistible",
    "What is your spicy hot take on dating in 2026?",
  ],
  roast18: [
    "Roast my 2 AM doomscrolling screen time",
    "Why am I still single? Be brutally savage",
    "Roast tech bros who talk about seed rounds",
    "Destroy my toxic situationship choices",
  ],
  confessions: [
    "I stalked my ex on LinkedIn at 3 AM... judge me",
    "Is it bad that I judge people by their Spotify Wrapped?",
    "Tell me a scandalous truth about modern dating",
    "Why do we all pretend to have our life together?",
  ],
  smart: [
    "Explain Next.js 16 Server Actions architecture",
    "How to solve race conditions in async UI state?",
    "Audit this tech stack for performance",
    "Break down frontier AI models simply",
  ],
  funny: [
    "Tell me a joke about software deadlines",
    "Roast corporate morning stand-up meetings",
    "Why is adulting such an elaborate scam?",
    "Give me an excuse to cancel social plans",
  ],
};

const MODE_CONFIG: Record<
  ChatPersonality,
  { label: string; tag: string; color: string; border: string; bg: string; icon: React.ReactNode }
> = {
  hype: {
    label: "Hype AI",
    tag: "High Energy",
    color: "text-[#3B82F6]",
    border: "border-[#3B82F6]/40",
    bg: "bg-[#3B82F6]/15",
    icon: <Sparkles className="w-3.5 h-3.5" />,
  },
  roast: {
    label: "Roast Mode",
    tag: "Savage Heat",
    color: "text-[#EF4444]",
    border: "border-[#EF4444]/40",
    bg: "bg-[#EF4444]/15",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  noty: {
    label: "Noty & Flirty",
    tag: "Spicy Vibe",
    color: "text-[#F97316]",
    border: "border-[#F97316]/40",
    bg: "bg-[#F97316]/15",
    icon: <Flame className="w-3.5 h-3.5" />,
  },
  roast18: {
    label: "Savage 18+",
    tag: "Zero Filter",
    color: "text-[var(--foreground)]",
    border: "border-[var(--border)]",
    bg: "bg-[var(--surface-hover)]",
    icon: <ShieldAlert className="w-3.5 h-3.5" />,
  },
  confessions: {
    label: "Midnight Lounge",
    tag: "Late Confessions",
    color: "text-[var(--foreground)]",
    border: "border-[var(--border)]",
    bg: "bg-[var(--surface-hover)]",
    icon: <Moon className="w-3.5 h-3.5" />,
  },
  smart: {
    label: "Smart AI",
    tag: "High IQ",
    color: "text-[#F59E0B]",
    border: "border-[#F59E0B]/40",
    bg: "bg-[#F59E0B]/15",
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  funny: {
    label: "Comedy Satire",
    tag: "Stand-Up",
    color: "text-[var(--foreground)]",
    border: "border-[var(--border)]",
    bg: "bg-[var(--surface-hover)]",
    icon: <Smile className="w-3.5 h-3.5" />,
  },
};

export default function SpicyChatbot({
  embedded = false,
  onClose,
}: SpicyChatbotProps) {
  const [personality, setPersonality] = useState<ChatPersonality>("noty");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Welcome to Hype After Dark. Unfiltered roasts, provocative dialogue, and midnight confessions. What topic are we breaking down today?",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const userText = (textToSend || input).trim();
    if (!userText || isLoading) return;

    sound.playVoteClick();
    setInput("");

    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userText },
    ];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await sendSpicyChatMessage(
        userText,
        personality,
        newMessages
      );
      sound.playSuccessChime();
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.reply },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "Oof, the server got flustered by that one. Try asking again in a second!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, idx: number) => {
    navigator.clipboard?.writeText(content);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([
      {
        role: "assistant",
        content: `Switched into ${MODE_CONFIG[personality].label} mode. What's on your mind?`,
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col bg-[var(--card-bg)] text-[var(--foreground)] overflow-hidden ${
        embedded
          ? "w-full rounded-2xl border border-[var(--border)] shadow-2xl"
          : "w-full h-full sm:max-h-[640px] sm:w-[420px] rounded-2xl border border-[var(--border)] shadow-2xl shadow-black/80"
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-xl bg-[#F97316] flex items-center justify-center text-white text-sm shadow-sm">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#F97316] border-2 border-[var(--card-bg)] animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-[var(--foreground)] tracking-wide">
                Hype After Dark
              </span>
              <span className="px-1.5 py-0.2 rounded bg-[var(--surface-hover)] text-[#F97316] border border-[var(--border)] text-[9px] font-mono font-bold uppercase">
                18+ AI
              </span>
            </div>
            <p className="text-[10px] font-mono text-[var(--muted-foreground)]">
              Funny • Noty • Savage Vibe Bot
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleClear}
            title="Reset Chat"
            className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mode / Personality Selector Tabs */}
      <div className="p-2 border-b border-[var(--border)] bg-[var(--surface)]">
        <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
          {(["noty", "roast18", "confessions"] as ChatPersonality[]).map(
            (mode) => {
              const cfg = MODE_CONFIG[mode];
              const isActive = personality === mode;
              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setPersonality(mode);
                    sound.playVoteClick();
                  }}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl transition text-[11px] font-medium cursor-pointer ${
                    isActive
                      ? `${cfg.bg} ${cfg.border} ${cfg.color} border shadow-sm`
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span className="truncate">{cfg.label}</span>
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 space-y-3.5 overflow-y-auto max-h-[380px] sm:max-h-[420px] scrollbar-thin scrollbar-thumb-[var(--border)]">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div
              key={idx}
              className={`flex gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-xs shrink-0 mt-0.5 text-[#F97316]">
                  {MODE_CONFIG[personality].icon}
                </div>
              )}

              <div
                className={`group relative max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed transition ${
                  isUser
                    ? "bg-[#F97316] text-white rounded-tr-none shadow-sm font-medium"
                    : "bg-[var(--surface)] border border-[var(--border)] text-[var(--foreground)] rounded-tl-none hover:border-[#F97316]/40"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>

                {!isUser && (
                  <button
                    type="button"
                    onClick={() => handleCopy(m.content, idx)}
                    className="opacity-0 group-hover:opacity-100 absolute -bottom-5 right-2 text-[10px] text-[var(--muted-foreground)] hover:text-[#F97316] flex items-center gap-1 transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-2.5 h-2.5 text-[#F97316]" />
                        <span className="text-[#F97316]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-2.5 h-2.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-lg bg-[var(--surface-hover)] border border-[var(--border)] flex items-center justify-center text-xs shrink-0">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F97316]" />
            </div>
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl rounded-tl-none px-4 py-2.5 text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
              <span>Cooking up something spicy</span>
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Starter Pills */}
      <div className="px-3 py-2 border-t border-[var(--border)] bg-[var(--surface)] overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <span className="text-[10px] font-mono text-[var(--muted-foreground)] shrink-0">
          Try:
        </span>
        {STARTER_PROMPTS[personality].map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-full bg-[var(--card-bg)] hover:bg-[var(--surface-hover)] border border-[var(--border)] hover:border-[#F97316] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-[var(--border)] bg-[var(--surface)] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Talk ${MODE_CONFIG[personality].label.toLowerCase()} or ask anything...`}
          className="flex-1 bg-[var(--card-bg)] border border-[var(--border)] focus:border-[#F97316] rounded-xl px-3.5 py-2 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] font-mono transition outline-none"
        />

        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2 rounded-xl bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-sm transition cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
