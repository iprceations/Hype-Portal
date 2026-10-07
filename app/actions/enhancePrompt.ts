"use server";

import { sanitizeText, getGeminiApiKey } from "@/lib/security";

export interface EnhancedPromptResult {
  title: string;
  category: "Video Motion" | "Portrait Studio" | "Cinematic";
  tool: "Midjourney" | "Runway" | "Kling";
  promptText: string;
  aspectRatio: string;
  specs: {
    lens: string;
    lighting: string;
    motion: string;
    negativePrompt: string;
    parameters: string;
    recommendedResolution: string;
  };
  source: "gemini-1.5-flash" | "neural-fallback";
}

interface EnhancePromptInput {
  idea: string;
  category?: "Video Motion" | "Portrait Studio" | "Cinematic";
  tool?: "Midjourney" | "Runway" | "Kling";
  apiKey?: string;
}

export async function enhancePrompt(
  input: EnhancePromptInput
): Promise<EnhancedPromptResult> {
  const idea = sanitizeText(input.idea || "", { maxLength: 800 }) || "Cyberpunk neon hyperlapse";
  const category = input.category || "Cinematic";
  const tool = input.tool || "Midjourney";
  const apiKey = getGeminiApiKey(input.apiKey);

  if (apiKey) {
    try {
      const prompt = `You are a world-class Generative AI Prompt Engineer specializing in photorealistic Midjourney v6.1, Runway Gen-3, and Kling AI 1.5 prompts.
Turn this raw user concept into an ultra-detailed, award-winning cinematic prompt: "${idea}"

Target Category: ${category}
Target AI Tool: ${tool}

Return ONLY valid JSON matching this schema:
{
  "title": string, // short punchy 4-6 word title
  "category": "${category}",
  "tool": "${tool}",
  "promptText": string, // the exact prompt ready to copy, with photographic descriptors, camera angles, color grading, atmosphere, and tool parameters (e.g. --ar 16:9 --v 6.1)
  "aspectRatio": string, // e.g. "16:9", "9:16", "21:9", "3:4"
  "specs": {
    "lens": string, // e.g. "35mm Anamorphic T1.9 prime"
    "lighting": string, // volumetric lighting description
    "motion": string, // camera movement description
    "negativePrompt": string, // bad elements to avoid
    "parameters": string, // CLI flags e.g. "--v 6.1 --stylize 300"
    "recommendedResolution": string // e.g. "3840x2160 (4K UHD)"
  }
}
Do NOT wrap in markdown \`\`\`json code blocks. Return strictly valid JSON.`;

      const candidateModels = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-1.5-flash",
        "gemini-flash-latest",
      ];

      for (const model of candidateModels) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.9,
                topK: 40,
                maxOutputTokens: 600,
                responseMimeType: "application/json",
              },
            }),
            cache: "no-store",
          });

          if (res.ok) {
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
              const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
              const jsonStart = cleaned.indexOf("{");
              const jsonEnd = cleaned.lastIndexOf("}");
              const jsonString = jsonStart !== -1 && jsonEnd !== -1 ? cleaned.slice(jsonStart, jsonEnd + 1) : cleaned;
              const parsed = JSON.parse(jsonString);

              if (parsed.title && parsed.promptText && parsed.specs) {
                return {
                  title: parsed.title,
                  category: parsed.category || category,
                  tool: parsed.tool || tool,
                  promptText: parsed.promptText,
                  aspectRatio: parsed.aspectRatio || "16:9",
                  specs: {
                    lens: parsed.specs.lens || "35mm Anamorphic Prime",
                    lighting: parsed.specs.lighting || "Volumetric neon rim lighting",
                    motion: parsed.specs.motion || "Smooth forward tracking dolly",
                    negativePrompt: parsed.specs.negativePrompt || "blurry, low quality, artifacts",
                    parameters: parsed.specs.parameters || "--v 6.1 --ar 16:9",
                    recommendedResolution: parsed.specs.recommendedResolution || "3840x2160 (4K)",
                  },
                  source: "gemini-1.5-flash",
                };
              }
            }
          }
        } catch {
          // Try next model
        }
      }
    } catch (e) {
      console.error("Gemini enhancePrompt failed, falling back:", e);
    }
  }

  // Fallback intelligent synthesizer
  return {
    title: `Remastered: ${idea.slice(0, 30)}`,
    category,
    tool,
    promptText: `Cinematic hyper-detailed capture of ${idea}, volumetric atmospheric fog, dramatic chiaroscuro rim lighting, 8k resolution, photorealistic Hasselblad H6D-100c detail, color graded in DaVinci Resolve --ar 16:9 --v 6.1 --stylize 350`,
    aspectRatio: "16:9",
    specs: {
      lens: "50mm f/1.2 Cine Prime",
      lighting: "Dramatic dual-tinted volumetric rim lighting with deep shadows",
      motion: "Cinematic slow forward dolly with subtle parallax",
      negativePrompt: "lowres, plastic textures, oversaturated, deformed, grainy",
      parameters: "--ar 16:9 --v 6.1 --stylize 350",
      recommendedResolution: "3840x2160 (4K UHD)",
    },
    source: "neural-fallback",
  };
}
