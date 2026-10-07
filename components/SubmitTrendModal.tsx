"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles, Send, Link as LinkIcon, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import confetti from "canvas-confetti";
import { sound } from "@/lib/audio";
import { HypeIconMark } from "@/components/Logo";

interface SubmitTrendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmitTrendModal({ isOpen, onClose }: SubmitTrendModalProps) {
  const [title, setTitle] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [category, setCategory] = useState<"AI Model" | "Hardware" | "Viral Meme" | "Fact Check">("AI Model");
  const [verdict, setVerdict] = useState<"VERIFIED" | "CAP">("CAP");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playPulse();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      sound.playSuccessChime();

      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F97316", "#1E293B", "#F59E0B", "#CBD5E1"],
        });
      } catch {}

      setTimeout(() => {
        setSubmitted(false);
        setTitle("");
        setSourceUrl("");
        onClose();
      }, 1800);
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Submit a Viral Trend"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
    >
      <div
        className="w-full max-w-lg rounded-2xl p-6 sm:p-7 relative overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1E293B] border border-[#F97316]/50 flex items-center justify-center p-1 text-white shadow-sm">
              <HypeIconMark className="w-full h-full" isDark={true} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-[var(--foreground)]">
                Submit a Viral Trend
              </h3>
              <p className="text-[11px] font-mono text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                Tip line for the Hype Intelligence Matrix
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playVoteClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[var(--foreground)] bg-[var(--surface)] hover:bg-[#F97316]/10 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Submitted Success State */}
        {submitted ? (
          <div className="py-8 text-center space-y-3 relative z-10">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/40 flex items-center justify-center text-[#F97316]">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-base font-bold text-[var(--foreground)]">
              Trend Queued for Verification!
            </div>
            <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80 font-mono max-w-xs mx-auto">
              Our neural fact-check evaluator will audit the buzzword density and assign a viral verdict.
            </p>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Title / Claim Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--foreground)] flex items-center justify-between">
                <span>Viral Claim or Headline</span>
                <span className="text-[10px] text-[#F97316] font-semibold">Required</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Claude 3.7 Sonnet achieves 90% benchmark..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs sm:text-sm text-[var(--foreground)] placeholder-[#64748B] focus:outline-none focus:border-[#F97316] font-mono transition"
              />
            </div>

            {/* Source URL Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--foreground)] flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Source Link (X/Twitter, Reddit, News URL)</span>
              </label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://x.com/username/status/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] placeholder-[#64748B] focus:outline-none focus:border-[#F97316] font-mono transition"
              />
            </div>

            {/* Category Pill Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--foreground)]">
                Trend Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["AI Model", "Hardware", "Viral Meme", "Fact Check"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      sound.playVoteClick();
                      setCategory(cat);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono border text-center transition cursor-pointer ${
                      category === cat
                        ? "bg-[#F97316] border-[#F97316] text-white font-bold shadow-sm"
                        : "bg-[var(--surface)] border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#F97316]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Initial Verdict Prediction */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[var(--foreground)]">
                Your Initial Take
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setVerdict("CAP");
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    verdict === "CAP"
                      ? "bg-[#1E293B] border-[#1E293B] text-white [html[data-theme='dark']_&]:bg-[#334155] [html[data-theme='dark']_&]:border-[#334155]"
                      : "bg-[var(--surface)] border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#1E293B]"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Smells like CAP</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playVoteClick();
                    setVerdict("VERIFIED");
                  }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    verdict === "VERIFIED"
                      ? "bg-[#F97316] border-[#F97316] text-white"
                      : "bg-[var(--surface)] border-[var(--border)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] hover:border-[#F97316]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Looks Legit / Verified</span>
                </button>
              </div>
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className="w-full py-2.5 rounded-full font-semibold text-xs sm:text-sm text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-98 transition shadow-sm border-none cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Queuing into Neural Stream...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Dispatch to Matrix</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
