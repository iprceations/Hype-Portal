"use client";

import React, { useState, useMemo, useEffect } from "react";
import { creatorPrompts, CreatorPrompt, PromptCategory } from "@/lib/data";
import { enhancePrompt, EnhancedPromptResult } from "@/app/actions/enhancePrompt";
import { sound } from "@/lib/audio";
import {
  Sparkles,
  Search,
  Copy,
  Check,
  Cpu,
  Layers,
  Maximize2,
  X,
  Sliders,
  Camera,
  Film,
  Sun,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Flame,
  Wand2,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

// Technical settings tailored per prompt for the inspection modal
interface PromptDetails {
  lens: string;
  lighting: string;
  motion: string;
  negativePrompt: string;
  parameters: string;
  recommendedResolution: string;
}

const PROMPT_SPECS: Record<string, PromptDetails> = {
  "prompt-1": {
    lens: "35mm Anamorphic T2.1 cine prime",
    lighting: "Multi-layered warm gold & brilliant orange volumetric reflections with wet pavement bounce",
    motion: "High-speed forward dolly hyperlapse with subtle vertical jib crane sweep",
    negativePrompt: "lowres, static, daytime, dry asphalt, blurry bokeh, grain artifacts",
    parameters: "--motion 7 --fps 24 --camera forward-fast",
    recommendedResolution: "3840x2160 (4K UHD)",
  },
  "prompt-2": {
    lens: "Hasselblad H6D-100c 85mm f/1.2 Portrait prime",
    lighting: "Dual directional amber rim strobes, soft octabox frontal fill with gold reflector",
    motion: "Static high-fashion studio shot, micro-breathing head tilt",
    negativePrompt: "plastic, oversaturated, deformed eyes, extra limbs, bad anatomy, cartoon",
    parameters: "--v 6.1 --style raw --stylize 350 --chaos 10",
    recommendedResolution: "3072x4096 (Portrait 3:4)",
  },
  "prompt-3": {
    lens: "IMAX 70mm solar-rated anamorphic lens",
    lighting: "Golden coronal loops flare, fluid plasma turbulence, dynamic prismatic lens flares",
    motion: "FPV cinematic drone camera descending through golden coronal loops with solar flare eruptions",
    negativePrompt: "jitter, low framerate, CGI artifacts, earth clouds, pixelated plasma, washed out colors",
    parameters: "--motion 8 --camera descent-forward --fps 24",
    recommendedResolution: "3840x2160 (16:9 Cinematic UHD)",
  },
  "prompt-4": {
    lens: "50mm f/1.4 Leica Noctilux-M Chiaroscuro lens",
    lighting: "Dramatic Caravaggio single-source warm lantern light, chiaroscuro golden highlights",
    motion: "Static fine-art oil portrait capture, contemplative gaze",
    negativePrompt: "digital distortion, flat lighting, 3d render look, oversaturated, deformed hands, cartoon",
    parameters: "--ar 4:5 --v 6.1 --stylize 300 --c 5",
    recommendedResolution: "3200x4000 (4:5 Fine Art Portrait)",
  },
  "prompt-5": {
    lens: "Panavision Ultra 70 C-Series Anamorphic wide",
    lighting: "Ethereal blue refraction pulses from emergency flares bouncing off hanging frozen icicles",
    motion: "Continuous slow push-in tracking shot through ancient crystalline subterranean ice cave",
    negativePrompt: "shaky cam, mud, warm temperature, low resolution, plastic ice, artificial fog",
    parameters: "--motion 6 --camera slow-push-in --fps 24",
    recommendedResolution: "3840x2160 (16:9 4K Cinema)",
  },
  "prompt-6": {
    lens: "85mm f/1.4 Zeiss Otus Portrait prime",
    lighting: "Soft octabox studio lighting with chromatic dispersion neon typography bounce",
    motion: "Static high-fashion beauty portrait, direct fierce eye contact",
    negativePrompt: "bad eyes, low quality, cartoon, flat reflection, low contrast, extra ears",
    parameters: "--ar 1:1 --v 6.1 --stylize 450 --quality 2",
    recommendedResolution: "3000x3000 (1:1 Studio Square)",
  },
};

const TOOL_DISPLAY_MAP: Record<string, { label: string; badgeColor: string }> = {
  Midjourney: {
    label: "Midjourney v6.1",
    badgeColor: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  Runway: {
    label: "Runway Gen-3 Alpha",
    badgeColor: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30",
  },
  Kling: {
    label: "Kling AI 1.5",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  },
};

// Robust clipboard copying with navigator.clipboard + execCommand textarea fallback
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Modern navigator.clipboard API in secure context
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("navigator.clipboard failed, attempting fallback:", err);
    }
  }

  // Fallback for non-secure contexts or legacy browsers
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand("copy");
    textArea.remove();
    return successful;
  } catch (err) {
    console.error("Fallback copy failed entirely:", err);
    return false;
  }
}

export default function PromptVault() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [selectedCategory, setSelectedCategory] = useState<string>("All Prompts");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [inspectPrompt, setInspectPrompt] = useState<CreatorPrompt | null>(null);

  // Gemini AI Prompt Enhancer State
  const [aiIdea, setAiIdea] = useState("");
  const [aiCategory, setAiCategory] = useState<"Video Motion" | "Portrait Studio" | "Cinematic">("Cinematic");
  const [aiTool, setAiTool] = useState<"Midjourney" | "Runway" | "Kling">("Midjourney");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<EnhancedPromptResult | null>(null);
  const [copiedAiPrompt, setCopiedAiPrompt] = useState(false);

  const handleEnhancePrompt = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiIdea.trim() || isEnhancing) return;
    sound.playVoteClick();
    setIsEnhancing(true);

    try {
      const res = await enhancePrompt({
        idea: aiIdea.trim(),
        category: aiCategory,
        tool: aiTool,
      });
      setEnhancedResult(res);
      sound.playSuccessChime();
    } catch (err) {
      console.error("Failed to enhance prompt with Gemini:", err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopyAiPrompt = async () => {
    if (!enhancedResult) return;
    const ok = await copyTextToClipboard(enhancedResult.promptText);
    if (ok) {
      sound.playSuccessChime();
      setCopiedAiPrompt(true);
      setToastMessage(isHi ? "सुधारा हुआ प्रॉम्प्ट क्लिपबोर्ड पर कॉपी हो गया!" : "Enhanced prompt copied to clipboard!");
      setTimeout(() => {
        setCopiedAiPrompt(false);
        setToastMessage(null);
      }, 2500);
    }
  };

  // Keyboard escape listener to close inspect modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInspectPrompt(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter & Search logic
  const filteredPrompts = useMemo(() => {
    return creatorPrompts.filter((prompt) => {
      // Category filter
      const matchesCategory =
        selectedCategory === "All Prompts" || prompt.category === selectedCategory;

      if (!matchesCategory) return false;

      // Search query filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        prompt.title.toLowerCase().includes(q) ||
        prompt.tool.toLowerCase().includes(q) ||
        prompt.promptText.toLowerCase().includes(q) ||
        prompt.category.toLowerCase().includes(q) ||
        prompt.aspectRatio.includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = async (prompt: CreatorPrompt, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const success = await copyTextToClipboard(prompt.promptText);
    if (success) {
      setCopiedId(prompt.id);
      setToastMessage(isHi ? `"${prompt.title}" कॉपी हो गया!` : `Copied "${prompt.title}" to clipboard!`);
      setTimeout(() => {
        setCopiedId(null);
        setToastMessage(null);
      }, 2500);
    }
  };

  const categories = [
    { id: "All Prompts", label: isHi ? "सभी प्रॉम्प्ट्स" : "All Prompts" },
    { id: "Video", label: isHi ? "वीडियो" : "Video" },
    { id: "Portrait", label: isHi ? "पोर्ट्रेट" : "Portrait" },
  ];

  return (
    <div className="space-y-6">
      {/* ========================================================================= */}
      {/* Header & Controls Bar                                                     */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 flex items-center justify-center text-[#F97316]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-bold">
                {isHi ? "इंजन C" : "Engine C"}
              </span>
              <span className="text-[10px] font-mono text-[var(--muted-foreground)]">
                {isHi ? "क्यूरेटेड एआई इमेज प्रॉम्प्ट वॉल्ट" : "Curated Diffusion Vault"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight mt-0.5">
              {isHi ? "क्रिएटर प्रॉम्प्ट वॉल्ट" : "Creator Prompt Vault"}
            </h2>
          </div>
        </div>

        {/* Search Input & Category Navigation */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Real-time search box */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHi ? "प्रॉम्प्ट, टूल्स, कीवर्ड्स खोजें..." : "Search prompts, tools, keywords..."}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/30 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] font-mono transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl border transition-all cursor-pointer font-bold ${
                    isActive
                      ? "bg-gradient-to-r from-[#F97316] to-[#EA580C] border-[#F97316] text-white shadow-sm shadow-[#F97316]/25"
                      : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--foreground)] hover:text-[#F97316] hover:border-[#F97316]/50 hover:bg-[#FFF7ED]/30 [html[data-theme='dark']_&]:hover:bg-[#F97316]/10"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Counter / Active filter meta */}
      <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)] pt-1 border-t border-[var(--border)]">
        <span>
          {isHi ? (
            <>
              कुल <span className="text-[#F97316] font-bold">{creatorPrompts.length}</span> में से{" "}
              <span className="text-[#F97316] font-bold">{filteredPrompts.length}</span> प्रॉम्प्ट्स
            </>
          ) : (
            <>
              Showing <span className="text-[#F97316] font-bold">{filteredPrompts.length}</span> of{" "}
              {creatorPrompts.length} production prompts
            </>
          )}
        </span>
        {searchQuery && (
          <span className="text-[11px] text-[var(--muted-foreground)]">
            {isHi ? `फिल्टर: "${searchQuery}"` : `Filtered by: "${searchQuery}"`}
          </span>
        )}
      </div>

      {/* ========================================================================= */}
      {/* GEMINI AI PROMPT ENHANCER SUITE                                           */}
      {/* ========================================================================= */}
      <div className="rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        {/* Ambient subtle glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#F97316]/10 via-[#F59E0B]/5 to-transparent rounded-bl-full pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#F97316] to-[#F59E0B] flex items-center justify-center text-white shadow-md shadow-[#F97316]/20">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-bold">
                  {isHi ? "जेमिनी फ्लैश एआई" : "Gemini Flash AI"}
                </span>
                <span className="text-[10px] font-mono text-[#F59E0B] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                  {isHi ? "सिंथेसाइज़र सक्रिय" : "Synthesizer Live"}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight mt-0.5">
                {isHi ? "जेमिनी के साथ किसी भी आइडिया को बनाएं सुपरचार्ज्ड प्रॉम्प्ट" : "Supercharge Any Concept with Gemini"}
              </h3>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
            <span className="text-[var(--muted-foreground)] text-[10px] mr-1">{isHi ? "त्वरित विचार:" : "Quick Ideas:"}</span>
            {[
              "Cyberpunk rain hyperlapse",
              "Hasselblad editorial fashion",
              "IMAX sandstorm chase",
              "Bioluminescent deep sea",
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  sound.playVoteClick();
                  setAiIdea(preset);
                }}
                className="px-2.5 py-1 rounded-lg bg-[var(--card-bg)] hover:bg-[#F97316]/10 border border-[var(--border)] hover:border-[#F97316]/30 text-[var(--muted-foreground)] hover:text-[#F97316] transition cursor-pointer text-[10px]"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Parameters Controls */}
        <form onSubmit={handleEnhancePrompt} className="relative z-10 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={aiIdea}
                onChange={(e) => setAiIdea(e.target.value)}
                placeholder={
                  isHi
                    ? "अपना कच्चा विचार लिखें (उदा: बादलों के बीच उड़ता हुआ साइबरपंक शहर)..."
                    : "Type your raw concept (e.g., A lone astronaut exploring neon crystal caverns at twilight)..."
                }
                className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] focus:border-[#F97316] focus:ring-1 focus:ring-[#F97316]/40 text-xs sm:text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] font-mono transition"
              />
              {aiIdea && (
                <button
                  type="button"
                  onClick={() => setAiIdea("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Tool & Category Selectors */}
            <div className="flex items-center gap-1.5 shrink-0">
              <select
                value={aiTool}
                onChange={(e) => setAiTool(e.target.value as any)}
                className="px-3 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[#F97316] cursor-pointer"
              >
                <option value="Midjourney">Midjourney v6.1</option>
                <option value="Runway">Runway Gen-3</option>
                <option value="Kling">Kling AI 1.5</option>
              </select>

              <select
                value={aiCategory}
                onChange={(e) => setAiCategory(e.target.value as any)}
                className="px-3 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:border-[#F97316] cursor-pointer"
              >
                <option value="Cinematic">{isHi ? "सिनेमैटिक" : "Cinematic"}</option>
                <option value="Video Motion">{isHi ? "वीडियो मोशन" : "Video Motion"}</option>
                <option value="Portrait Studio">{isHi ? "पोर्ट्रेट स्टूडियो" : "Portrait Studio"}</option>
              </select>

              <button
                type="submit"
                disabled={isEnhancing || !aiIdea.trim()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm cursor-pointer shrink-0"
              >
                {isEnhancing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{isHi ? "सुधारा जा रहा है..." : "Supercharging..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>{isHi ? "प्रॉम्प्ट सुधारें" : "Supercharge"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Enhanced Result Display */}
        {enhancedResult && (
          <div className="relative z-10 p-4 sm:p-5 rounded-xl bg-[var(--card-bg)] border border-[#F97316]/30 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[var(--foreground)]">
                  {enhancedResult.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-semibold">
                  {enhancedResult.tool}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 font-semibold">
                  {enhancedResult.aspectRatio}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-[#F59E0B] flex items-center gap-1 font-semibold">
                  <Check className="w-3 h-3" />
                  Generated via {enhancedResult.source === "neural-fallback" ? "Neural Synthesizer" : "Gemini 1.5 Flash"}
                </span>

                <button
                  type="button"
                  onClick={handleCopyAiPrompt}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold font-mono transition cursor-pointer ${
                    copiedAiPrompt
                      ? "bg-[#1E293B] border border-[#F59E0B] text-[#F59E0B]"
                      : "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-sm"
                  }`}
                >
                  {copiedAiPrompt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isHi ? "सुधारा प्रॉम्प्ट कॉपी करें" : "Copy Enhanced Prompt"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Prompt String */}
            <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-mono text-xs sm:text-sm text-[var(--foreground)] select-all leading-relaxed">
              {enhancedResult.promptText}
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] font-mono pt-1">
              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)] text-[10px] block">{isHi ? "लेंस व ऑप्टिक्स" : "Lens & Optics"}</span>
                <span className="text-[#F97316] font-semibold">{enhancedResult.specs.lens}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)] text-[10px] block">{isHi ? "लाइटिंग" : "Volumetric Lighting"}</span>
                <span className="text-[#F59E0B] font-semibold">{enhancedResult.specs.lighting}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[var(--surface)] border border-[var(--border)]">
                <span className="text-[var(--muted-foreground)] text-[10px] block">{isHi ? "पैरामीटर्स" : "Parameters"}</span>
                <span className="text-[var(--foreground)]">{enhancedResult.specs.parameters}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* Prompts Cards Grid                                                        */}
      {/* ========================================================================= */}
      {filteredPrompts.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[var(--surface)] border border-dashed border-[var(--border)] text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#F97316] mx-auto" />
          <h3 className="text-base font-semibold text-[var(--foreground)]">
            {isHi ? "आपके फ़िल्टर से कोई प्रॉम्प्ट मेल नहीं खाता" : "No Prompts Match Your Filter"}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto">
            {isHi
              ? "कृपया कोई दूसरा कीवर्ड खोजें या ऊपर अलग श्रेणी टैब चुनें।"
              : "Try adjusting your search query or selecting a different category tab above."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All Prompts");
            }}
            className="px-4 py-1.5 text-xs font-mono rounded-full bg-[var(--card-bg)] border border-[var(--border)] text-[#F97316] hover:border-[#F97316] transition cursor-pointer font-semibold"
          >
            {isHi ? "फ़िल्टर रीसेट करें" : "Reset Filters"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPrompts.map((prompt) => {
            const toolInfo = TOOL_DISPLAY_MAP[prompt.tool] || {
              label: prompt.tool,
              badgeColor: "bg-[var(--card-bg)] text-[var(--foreground)] border-[var(--border)]",
            };
            const isCopied = copiedId === prompt.id;

            return (
              <div
                key={prompt.id}
                onClick={() => setInspectPrompt(prompt)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:-translate-y-1 hover:border-[#F97316] transition-all duration-200 group cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Ambient Card Corner Flare */}
                <div className="absolute top-0 right-0 w-28 h-28 bg-[#F97316]/5 rounded-bl-full pointer-events-none group-hover:bg-[#F97316]/10 transition duration-300" />

                <div className="space-y-3 relative z-10">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-md bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 text-[#F97316] border border-[#F97316]/30 font-bold">
                      {isHi && prompt.category === "Video"
                        ? "वीडियो"
                        : isHi && prompt.category === "Portrait"
                        ? "पोर्ट्रेट"
                        : prompt.category}
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2.5 py-0.5 rounded-md border flex items-center gap-1.5 font-semibold ${toolInfo.badgeColor}`}
                    >
                      <Cpu className="w-3 h-3" />
                      {toolInfo.label}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[var(--foreground)] leading-snug group-hover:text-[#F97316] transition line-clamp-1">
                    {prompt.title}
                  </h3>

                  {/* Truncated Prompt Codeblock Preview */}
                  <div className="relative">
                    <p className="text-xs text-[var(--foreground)] font-mono bg-[var(--card-bg)] p-3.5 rounded-xl border border-[var(--border)] line-clamp-3 leading-relaxed select-text font-medium">
                      {prompt.promptText}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="relative z-10 pt-3 border-t border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-[var(--foreground)] font-bold">
                      <Layers className="w-3 h-3 text-[#F97316]" />
                      {prompt.aspectRatio}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectPrompt(prompt);
                      }}
                      className="text-[var(--foreground)] hover:text-[#F97316] transition flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      {isHi ? "विस्तार" : "Specs"}
                    </button>
                  </div>

                  {/* Primary Copy Prompt Button */}
                  <button
                    type="button"
                    onClick={(e) => handleCopy(prompt, e)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer shadow-sm ${
                      isCopied
                        ? "bg-emerald-600 text-white shadow-emerald-500/20"
                        : "bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[#F97316]/25 hover:shadow-md"
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>{isHi ? "कॉपी हो गया!" : "Copied!"}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        <span>{isHi ? "कॉपी प्रॉम्प्ट" : "Copy Prompt"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* Floating Pill Toast Notification                                          */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#0B1220] border border-[#F97316]/50 text-white shadow-2xl backdrop-blur-xl text-xs font-mono">
            <div className="w-5 h-5 rounded-full bg-[#F97316]/20 border border-[#F97316]/40 flex items-center justify-center">
              <Check className="w-3 h-3 text-[#F97316]" />
            </div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Modal: Full Extended Prompt & Recommended Camera Settings                 */}
      {/* ========================================================================= */}
      {inspectPrompt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={inspectPrompt.title}
          onClick={() => setInspectPrompt(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 cursor-pointer"
        >
          <div
            className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Flare */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] pb-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 font-semibold">
                    {inspectPrompt.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
                      TOOL_DISPLAY_MAP[inspectPrompt.tool]?.badgeColor || ""
                    }`}
                  >
                    {TOOL_DISPLAY_MAP[inspectPrompt.tool]?.label || inspectPrompt.tool}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--card-bg)] text-[var(--muted-foreground)] border border-[var(--border)]">
                    Ratio: {inspectPrompt.aspectRatio}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] tracking-tight mt-1">
                  {inspectPrompt.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setInspectPrompt(null)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border)] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Full Prompt Text Block */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1.5 text-[#F97316] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Full Prompt String
                </span>
                <span className="text-[var(--muted-foreground)] text-[11px]">Ready to execute</span>
              </div>
              <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] font-mono text-xs sm:text-sm text-[var(--foreground)] leading-relaxed select-all">
                {inspectPrompt.promptText}
              </div>
            </div>

            {/* Recommended Camera & Render Parameters */}
            {PROMPT_SPECS[inspectPrompt.id] && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#F59E0B] flex items-center gap-1.5 font-bold">
                  <Camera className="w-4 h-4" />
                  Recommended Camera Specs &amp; Render Parameters
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  {/* Lens */}
                  <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted-foreground)] text-[10px] flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#F97316]" /> Lens &amp; Optics
                    </span>
                    <p className="text-[var(--foreground)]">{PROMPT_SPECS[inspectPrompt.id].lens}</p>
                  </div>

                  {/* Lighting */}
                  <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted-foreground)] text-[10px] flex items-center gap-1">
                      <Sun className="w-3 h-3 text-[#F59E0B]" /> Lighting Rig
                    </span>
                    <p className="text-[var(--foreground)]">{PROMPT_SPECS[inspectPrompt.id].lighting}</p>
                  </div>

                  {/* Motion Dynamics */}
                  <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted-foreground)] text-[10px] flex items-center gap-1">
                      <Film className="w-3 h-3 text-[#F97316]" /> Camera Dynamics
                    </span>
                    <p className="text-[var(--foreground)]">{PROMPT_SPECS[inspectPrompt.id].motion}</p>
                  </div>

                  {/* Resolution Target */}
                  <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] space-y-1">
                    <span className="text-[var(--muted-foreground)] text-[10px] flex items-center gap-1">
                      <Layers className="w-3 h-3 text-[#F59E0B]" /> Resolution Target
                    </span>
                    <p className="text-[var(--foreground)]">
                      {PROMPT_SPECS[inspectPrompt.id].recommendedResolution}
                    </p>
                  </div>
                </div>

                {/* Parameters Code Line */}
                <div className="p-3 rounded-lg bg-[var(--card-bg)] border border-[var(--border)] text-xs font-mono space-y-1">
                  <span className="text-[10px] text-[#F97316] uppercase tracking-wider font-semibold">
                    Model CLI Parameters
                  </span>
                  <div className="text-[var(--foreground)] select-all font-mono">
                    {PROMPT_SPECS[inspectPrompt.id].parameters}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[var(--border)]">
              <button
                type="button"
                onClick={() => setInspectPrompt(null)}
                className="px-4 py-2 rounded-full text-xs font-mono text-[var(--muted-foreground)] hover:text-[var(--foreground)] bg-[var(--card-bg)] border border-[var(--border)] transition font-medium"
              >
                Close Window
              </button>

              <button
                type="button"
                onClick={() => handleCopy(inspectPrompt)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] active:scale-95 shadow-sm transition cursor-pointer"
              >
                {copiedId === inspectPrompt.id ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Full Prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
