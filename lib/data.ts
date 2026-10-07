// Strict TypeScript type definitions
export type Verdict = "VERIFIED" | "CAP";
export type TrendingCategory = "FACT_CHECK" | "VIRAL";

export interface TrendingNewsItem {
  id: string;
  title: string;
  claim: string;
  verdict: Verdict;
  shares: number;
  category?: TrendingCategory;
  timestamp?: string;
}

export interface Debate {
  id: string;
  question: string;
  optA: string;
  optB: string;
  votesA: number;
  votesB: number;
  optionA?: string;
  optionB?: string;
  totalVotes?: number;
}

export type PromptTool = "Midjourney" | "Runway";
export type PromptCategory = "Video" | "Portrait";

export interface Prompt {
  id: string;
  title: string;
  tool: PromptTool;
  category: PromptCategory;
  promptText: string;
  ar: string;
  aspectRatio?: string;
}

// 1. Trending News (4 items: id, title, claim, verdict: "VERIFIED"|"CAP", shares: number)
export const trendingNews: (TrendingNewsItem & { category: TrendingCategory; timestamp: string })[] = [
  {
    id: "trend-1",
    title: "OpenAI Orion Q* Leak Claims Instant AGI",
    claim: "Leaked internal benchmarks claim the upcoming flagship model achieved autonomous recursive self-improvement on complex math theorem proofs.",
    verdict: "CAP",
    shares: 48200,
    category: "FACT_CHECK",
    timestamp: "12m ago",
  },
  {
    id: "trend-2",
    title: "Apple Vision Pro 2 Weight Reduced by 40% in Lab Tests",
    claim: "Supply chain teardowns indicate new micro-OLED tandem arrays and magnesium-alloy chassis reduce total headset weight to 360g.",
    verdict: "VERIFIED",
    shares: 89400,
    category: "VIRAL",
    timestamp: "45m ago",
  },
  {
    id: "trend-3",
    title: "DeepSeek-V3 Open Weights Match Frontier FP8 Reasoning",
    claim: "Multi-Head Latent Attention architecture benchmarked independently to match closed commercial APIs on Codeforces and SWE-bench at 1/10th inference cost.",
    verdict: "VERIFIED",
    shares: 142800,
    category: "FACT_CHECK",
    timestamp: "1h ago",
  },
  {
    id: "trend-4",
    title: "Quantum Anti-Gravity Skateboard Demo Goes Viral on X",
    claim: "Viral video showing room-temperature superconductor levitation over copper rails confirmed to be high-grade Blender CGI render.",
    verdict: "CAP",
    shares: 31500,
    category: "VIRAL",
    timestamp: "3h ago",
  },
];

// 2. Debates (3 items: id, question, optA, optB, votesA, votesB)
export const debates: (Debate & { optionA: string; optionB: string; totalVotes: number })[] = [
  {
    id: "debate-1",
    question: "Will autonomous AI video pipelines replace traditional Hollywood VFX studios by 2026?",
    optA: "Yes, indie creators will dominate",
    optB: "No, human craft & direction won't scale",
    optionA: "Yes, indie creators will dominate",
    optionB: "No, human craft & direction won't scale",
    votesA: 34200,
    votesB: 28100,
    totalVotes: 62300,
  },
  {
    id: "debate-2",
    question: "Open-weight local LLMs vs closed frontier cloud APIs: Which is the enterprise standard?",
    optA: "Open Weights (Privacy & Control)",
    optB: "Cloud APIs (Raw Reasoning Power)",
    optionA: "Open Weights (Privacy & Control)",
    optionB: "Cloud APIs (Raw Reasoning Power)",
    votesA: 51400,
    votesB: 19800,
    totalVotes: 71200,
  },
  {
    id: "debate-3",
    question: "Should cryptographic AI watermarking be legally mandatory on all synthetic media?",
    optA: "Mandatory (Stop disinformation)",
    optB: "Voluntary (Unenforceable tech)",
    optionA: "Mandatory (Stop disinformation)",
    optionB: "Voluntary (Unenforceable tech)",
    votesA: 42100,
    votesB: 38900,
    totalVotes: 81000,
  },
];

// 3. Prompts (6 items: id, title, tool: "Midjourney"|"Runway", category: "Video"|"Portrait", promptText, ar: string)
export const prompts: (Prompt & { aspectRatio: string })[] = [
  {
    id: "prompt-1",
    title: "Cyberpunk Tokyo Rain Hyperlapse",
    tool: "Runway",
    category: "Video",
    promptText: "Hyperlapse forward tracking shot through neon-drenched Shinjuku back-alley at midnight in heavy rainfall, holographic reflections shimmering across wet asphalt, ultra-realistic motion blur, cinematic volumetric vapor --ar 16:9",
    ar: "16:9",
    aspectRatio: "16:9",
  },
  {
    id: "prompt-2",
    title: "Editorial Biomechanical Haute Couture",
    tool: "Midjourney",
    category: "Portrait",
    promptText: "High fashion studio portrait of an android muse, intricate chrome filigree cheekbones, bioluminescent violet iris capillaries, editorial Vogue lighting, dual rim lights, Hasselblad 85mm lens f/1.2 --ar 3:4 --v 6.1 --style raw",
    ar: "3:4",
    aspectRatio: "3:4",
  },
  {
    id: "prompt-3",
    title: "Solar Storm Coronal Flare Sweep",
    tool: "Runway",
    category: "Video",
    promptText: "FPV cinematic drone camera descending through the golden coronal loops of a supermassive star, solar flare eruptions casting dynamic prismatic lens flares, fluid plasma turbulence, IMAX 70mm scale --ar 16:9",
    ar: "16:9",
    aspectRatio: "16:9",
  },
  {
    id: "prompt-4",
    title: "Neo-Renaissance Cyber Philosopher",
    tool: "Midjourney",
    category: "Portrait",
    promptText: "Chiaroscuro studio oil portrait of an elder synthetic scholar draped in velvet gold robes, subtle fiber-optic wiring embedded in temples, dramatic Caravaggio single-source warm lantern light, 8k fine art capture --ar 4:5 --v 6.1",
    ar: "4:5",
    aspectRatio: "4:5",
  },
  {
    id: "prompt-5",
    title: "Sub-Zero Glacial Cavern Tracking",
    tool: "Runway",
    category: "Video",
    promptText: "Continuous slow push-in tracking shot through an ancient crystalline subterranean ice cave, ethereal blue refraction pulses as flares illuminate hanging frozen icicles, atmospheric frost particles --ar 16:9",
    ar: "16:9",
    aspectRatio: "16:9",
  },
  {
    id: "prompt-6",
    title: "Obsidian Iridescent Cyberpunk Rebel",
    tool: "Midjourney",
    category: "Portrait",
    promptText: "Close-up editorial beauty portrait of a streetwear model wearing obsidian iridescent visor glasses reflecting neon sign typography, chromatic dispersion, soft octabox studio lighting, raw texture --ar 1:1 --v 6.1",
    ar: "1:1",
    aspectRatio: "1:1",
  },
];

// Backwards compatibility types and aliases for existing UI components
export type TrendingVerdict = Verdict;
export type TrendingItem = TrendingNewsItem & {
  category: TrendingCategory;
  timestamp: string;
};
export type DailyDebate = Debate & {
  optionA: string;
  optionB: string;
  totalVotes: number;
};
export type CreatorPrompt = Prompt & {
  aspectRatio: string;
};

export const trendingItems = trendingNews;
export const dailyDebates = debates;
export const creatorPrompts = prompts;
