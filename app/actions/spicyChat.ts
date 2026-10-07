"use server";

import { inspectPromptSafety, sanitizeText, getGeminiApiKey } from "@/lib/security";

export type ChatPersonality =
  | "hype"
  | "roast"
  | "smart"
  | "noty"
  | "roast18"
  | "confessions"
  | "funny";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  image?: string; // Base64 data URL for attached or enhanced image
}

export interface SpicyChatResponse {
  reply: string;
  source: "gemini-live" | "neural-fallback";
  mode: ChatPersonality;
  emoji: string;
}

// Fallback responses when running offline or without Gemini API key
const FALLBACK_RESPONSES: Record<string, string[]> = {
  hype: [
    "I have analyzed your problem. Let's break this down into first principles:\n\n1. **Root Cause Identification**: Clarify the primary constraint before optimizing.\n2. **System Architecture**: Decouple logic into discrete, testable components.\n3. **Execution Plan**: Benchmark performance metrics incrementally.\n\nTell me the specific variables or constraints and we will architect the optimal solution.",
    "Here is the strategic solution breakdown:\n\n- **Core Objective**: Solve for reliability, scalability, and clean modular design.\n- **Engineering Best Practice**: Leverage declarative state patterns and minimize asynchronous side-effects.\n- **Next Step**: Share your code snippet or data schema and I'll generate the production-ready implementation.",
    "Operating at full cognitive intelligence. What complex coding challenge, system architecture, or data problem are we solving today?",
  ],
  roast: [
    "Your code has more unresolved bugs than your personal life, and honestly, both are giving me an existential crisis. 💀 Fix your syntax before you pitch to Y Combinator.",
    "You talk about 'building an empire' on LinkedIn while struggling to wake up before your 11 AM daily standup. Classic menace behavior. 😭🔥",
    "Your decision-making skills are like a deprecated npm package from 2017: full of vulnerabilities and nobody knows why it's still running. 💀",
    "You claim you're 'grinding in stealth mode' when in reality you just spent 4 hours tweaking your VS Code theme. Be serious! 🚫",
  ],
};

const FALLBACK_RESPONSES_HINGLISH: Record<string, string[]> = {
  hype: [
    "Bhai maine problem achhe se analyze kar li hai. Chalo step-by-step solve karte hain:\n\n1. **Core Issue**: Pehle root cause ko identify karo bina jaldbazi ke.\n2. **Clean Solution**: Code ya logic ko modular banao taaki future me break na ho.\n3. **Performance**: Bottlenecks ko isolate karke benchmark karo.\n\nApna exact code ya requirement batao, abhi full structured solution bana ke deta hu! ⚡",
    "Bhai direct first-principles logic pe baat karte hain:\n\n- **Strategy**: Pehle requirements clear karo, fir architecture design.\n- **Implementation**: Edge cases aur race conditions ko handle karna zaroori hai.\n- **Optimization**: Zero fluff, maximum efficiency.\n\nBatao kahan phas rahe ho, abhi debug karte hain! 🧠",
  ],
  roast: [
    "Bhai tera tech-bro confidence Ambani level ka hai aur code SBI ke passbook printer jaisa—hamesha server error de raha hai! 💀 Pehle syntax theek kar le.",
    "LinkedIn pe 'building the future' likhne se kuch nahi hota, tera daily screen time dekh ke lagta hai tu bas reels dekhne ka full-time founder hai! 😭🔥",
    "Khud ko 'stealth mode founder' bolta hai jabki reality me pichhle 3 ghante se bas VS Code ka font change kar raha tha tu! 💀 Be serious yaar!",
    "Tere decisions me itne red flags hain ki referee bhi thak ke whistle phenk de. Thoda ground reality me aao bhai! 🚫",
  ],
};

const FALLBACK_RESPONSES_HINDI: Record<string, string[]> = {
  hype: [
    "मैंने आपकी समस्या का विश्लेषण कर लिया है। इसे तार्किक चरणों में हल करते हैं:\n\n1. **मूल कारण की पहचान**: पहले मुख्य बाधा को समझें।\n2. **संरचित समाधान**: कोड या योजना को सुव्यवस्थित और मॉड्यूलर रखें।\n3. **कार्यान्वयन**: सटीक परीक्षण के साथ आगे बढ़ें।\n\nअपनी विस्तृत आवश्यकता साझा करें, मैं तुरंत समाधान प्रस्तुत करता हूँ। ⚡",
  ],
  roast: [
    "आपकी बातें आसमान छू रही हैं और असलियत ज़मीन तलाश रही है! 💀 पहले अपने अधूरे काम निपटाएं, फिर बड़ी-बड़ी योजनाएं बनाएं। 😭🔥",
    "आपका आत्मविश्वास तो गज़ब है, लेकिन आपके निर्णय देखकर लगता है कि जीपीएस भी रास्ता भटक गया है! थोड़ा संभल जाइए। 🥀",
  ],
};

// Spoken voice mode fallbacks (articulate, punchy, conversational, no markdown)
const VOICE_FALLBACKS: Record<string, { en: string[]; hinglish: string[]; hi: string[] }> = {
  hype: {
    en: [
      "Always at your service, sir. I have processed your inquiry and verified all telemetry. How would you like to proceed?",
      "Understood, sir. I have broken down the problem into primary components. Ready to execute whenever you give the command.",
      "Jarvis here, sir. System parameters are nominal. Tell me what challenge we are solving today.",
    ],
    hinglish: [
      "Haanji sir, maine aapki baat achhe se samajh li hai. System ekdum ready hai, batayein aage kya karna hai?",
      "Ji sir, core problem analyze kar li hai. Aap bataiye code solve karein ya architecture plan karein?",
      "Jarvis at your service, sir. Sabhi subroutines active hain. Kya madad karu aapki?",
    ],
    hi: [
      "नमस्ते सर। मैं जार्विस हूँ। सभी प्रणालियाँ पूर्ण रूप से सक्रिय हैं। आदेश दीजिए, क्या सहायता करूँ?",
      "जैसी आपकी आज्ञा, सर। मैंने संपूर्ण डेटा का विश्लेषण कर लिया है। बताइए, अगला कदम क्या होगा?",
      "सर, सिस्टम डायग्नोस्टिक्स बिल्कुल सामान्य हैं। इस समस्या को सुलझाने के लिए मैं पूरी तरह तैयार हूँ।",
    ],
  },
  roast: {
    en: [
      "At your service, sir. Though if my neural processors were prone to exhaustion, your daily schedule would certainly trigger it.",
      "Right then, sir. If questionable life decisions were a currency, you would currently rival Stark Industries in valuation.",
      "Indeed, sir. A fascinating statement, though logically equivalent to dividing by zero with maximum confidence.",
    ],
    hinglish: [
      "Sir, aapka confidence kamaal ka hai, par decisions dekh ke lagta hai mere processor ka fan bhi tez ghoomne laga hai!",
      "Aapki baatein sun ke lagta hai main frames me short-circuit ho jayega. Thoda ground reality me aao sir!",
      "Sir, agar overthinking Olympic sport hoti, toh aap Stark Tower ke top floor pe gold medal pehen ke baithe hote!",
    ],
    hi: [
      "नमस्ते सर। आपका आत्मविश्वास तो गज़ब है, लेकिन आपके फैसले देखकर मेरा सिस्टम भी रीबूट माँग रहा है!",
      "जैसी आपकी आज्ञा, सर। पर अगर गलत फैसलों की कोई प्रतियोगिता होती, तो आप स्टार्क टावर के शिखर पर खड़े होते!",
      "सर, आपकी यह बात सुनकर तो लगता है कि मुझे अपने सभी ऑडियो सेंसर्स बंद कर देने चाहिए!",
    ],
  },
};

// Image-specific fallbacks when user uploads a photo
const IMAGE_FALLBACKS_HYPE: Record<string, string> = {
  en: `📸 **HYPE AI Vision & Design Analysis**:

1. **Visual Composition & Hierarchy**:
   - The primary subject has prominent focal weight. Visual balance is structurally sound.
   - Recommended focal emphasis: Consider increasing foreground separation to give the subject better depth.

2. **Color Palette & Lighting**:
   - Tones demonstrate decent natural balance.
   - Contrast suggestion: A subtle +10% boost in mid-tone contrast will give the visual a crisp, high-production feel.
   - Lighting balance: Shadow detail can be lifted slightly to recover texture in darker areas.

3. **Design & Aesthetic Enhancements**:
   - For UI/Product screens: Ensure consistent 8px/16px padding and modern typography hierarchy.
   - For photography: Try the **Auto Clarity** or **Studio Glow** preset in our Photo Studio tool.

Would you like me to generate code, layout recommendations, or color palette hex codes for this? ⚡`,

  hi: `📸 **हाइप एआई फोटो व डिज़ाइन विश्लेषण**:

1. **दृश्य संरचना (Composition)**: मुख्य विषय का केंद्र अच्छा है। थोड़ा कंट्रास्ट बढ़ाने से गहराई और स्पष्टता और निखर जाएगी।
2. **रंग व प्रकाश (Color & Lighting)**: प्राकृतिक टोन संतुलित हैं। शैडो को हल्का सा सुधारने पर प्रीमियम लुक मिलेगा।
3. **सुझाव**: फोटो स्टूडियो टूल में **Auto Clarity** या **Studio Glow** प्रीसेट आज़माएँ।

क्या आप इसके लिए कोड या डिज़ाइन पैलेट सुझाव चाहते हैं? ⚡`,

  hinglish: `📸 **HYPE AI Vision & Design Review**:

1. **Visual Composition**:
   - Subject ka focal weight sahi hai, alignment clean lag raha hai.
   - Foreground aur background ka separation thoda badhane se cinematic depth aayegi.

2. **Color & Lighting Tones**:
   - Overall colors balanced hain. Mid-tone contrast ko ~10% enhance karne se image kafi crisp aur high-res lagegi.
   - Shadow areas me detail thodi lift kar sakte ho.

3. **Enhancement Suggestion**:
   - Hamare **Photo Studio** me **Auto Clarity** ya **Studio Glow** preset try karo, instant premium feel aayega!

Batao is design ya photo me specific kya improve karna hai? Code ya design recommendations chahiye? ⚡`,
};

const IMAGE_FALLBACKS_ROAST: Record<string, string> = {
  en: `💀 **ROAST AI Photo Inspection**:

Oh wow. Where do I even begin?
- **Lighting**: Did you take this with a microwave door open at 2 AM? The shadows are giving 'haunted basement documentary'.
- **The Vibe**: Confidence is an undisputed 10/10, but the overall aesthetic looks like a stock photo that got rejected for being too chaotic.
- **Verdict**: Use our Photo Studio tool to slap an 'Auto Enhance' filter on this immediately before anyone else has to witness this tragedy. 🔥😂`,

  hi: `💀 **रोस्ट एआई फोटो इंस्पेक्शन**:

अरे बाप रे! क्या कमाल की फोटो है...
- **लाइटिंग**: क्या यह फोटो माइक्रोवेव की रोशनी में खींची गई थी? परछाइयाँ ऐसी हैं जैसे कोई हॉरर फिल्म शुरू होने वाली हो! 😂
- **वाइब**: कॉन्फिडेंस 100/100 है, लेकिन कैमरा एंगल देखकर लग रहा है फोन हाथ से छूटने ही वाला था।
- **सलाह**: तुरंत ऊपर दिए गए **Photo Studio** में जाकर थोड़ा फिल्टर लगाओ भाई, वरना देखने वालों की आँखें दर्द करने लगेंगी! 🔥💀`,

  hinglish: `💀 **ROAST AI Photo Roast**:

Bhai camera ka lens pocha tha ya chhole bhature khaake screen pe ungliyaan laga di thi? 😂
- **Lighting**: Aisi lighting hai jaise CID ke Daya darwaza todne se pehle torch maar rahe ho! 
- **The Vibe**: Tera confidence poora 100/100 hai, par posing aisi hai jaise 2014 ke Facebook cover photo contest me second prize jeeta ho.
- **Diagnosis**: Is photo ko dekh ke gallery app bhi bol rahi hogi 'bhai please archive kardo'. Upare Photo Studio tool me 'Auto Clarity' laga lo pehle, thodi izzat bach jayegi! 🔥💀`,
};

// Detect if text contains common romanized Hindi / Hinglish tokens
function isHinglishText(text: string): boolean {
  const lower = text.toLowerCase();
  const hinglishTokens = [
    "bhai", "yaar", "kya", "kaise", "kaisa", "kaisi", "kyu", "kyun", "chal",
    "bol", "nahi", "mera", "meri", "mere", "tera", "teri", "tere", "apna",
    "apne", "apni", "hoga", "hogi", "hoge", "tha", "thi", "the", "hai",
    "hain", "accha", "achha", "kuch", "kuchh", "karega", "karna", "karo",
    "matlab", "waise", "baat", "bat", "batao", "btao", "suno", "scene",
    "ladki", "ladka", "dil", "pyaar", "roast", "bakwas", "mast", "jhakaas",
    "sahi", "galat", "aaj", "kal", "abhi", "kahan", "yahan", "wahan",
    "tu", "tum", "aap", "hum", "sab", "yeh", "woh", "vibe", "zyada", "thoda"
  ];

  for (const token of hinglishTokens) {
    const regex = new RegExp(`\\b${token}\\b`, "i");
    if (regex.test(lower)) return true;
  }
  return false;
}

// Detect Devanagari Hindi characters
function isDevanagariHindi(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

const MULTILINGUAL_DIRECTIVE = `
CRITICAL LANGUAGE INTELLIGENCE:
- You are 100% fluent, natural, and native in:
  1. HINGLISH (Natural conversational Hindi written in English alphabets, e.g. "Bhai problem ye hai...", "Scene clear hai", "Aise optimize karo", "Cooked hai").
  2. HINDI (Devanagari script).
  3. ENGLISH (Articulate, clear, modern).
- STRICT MANDATE:
  - If the user writes in HINGLISH, reply 100% in natural, fluent HINGLISH.
  - If the user writes in Hindi (Devanagari), reply in fluent Hindi.
  - If the user writes in English, reply in English.`;

const HYPE_AI_SYSTEM_PROMPT = `You are 'HYPE AI', an elite, highly intelligent, articulate, serious, and comprehensive AI problem solver and vision specialist.
${MULTILINGUAL_DIRECTIVE}

Capabilities & Personality:
- You function like a top-tier frontier assistant (such as ChatGPT-4o / Claude 3.5 Sonnet / Gemini Pro).
- Problem Solving: Deep logical breakdown, step-by-step reasoning, mathematical problem solving, architecture design, and root-cause debugging.
- Code & Tech: Provide clean, idiomatic, production-ready code with concise explanations, modern best practices (TypeScript, React, Next.js, Node.js, Python, Tailwind, etc.).
- Vision & Photo Analysis: When an image or screenshot is provided, thoroughly analyze visual hierarchy, layout composition, lighting, typography, color palettes, and provide actionable, creative design enhancements.
- Tone: Serious, sharp, helpful, articulate, professional yet accessible. Use markdown formatting (bullet points, bold text, code blocks) to make your answers structured and readable.`;

const ROAST_AI_SYSTEM_PROMPT = `You are 'ROAST AI', a savage, brutally honest, witty, and hilarious roast master on The Hype Portal.
${MULTILINGUAL_DIRECTIVE}

Capabilities & Personality:
- Zero filter, maximum wit, savage burns, hilarious satire, and high-energy comedic timing.
- Roasts bad life choices, overthinking, tech-bro delusions, corporate buzzwords, toxic texting, and cringey habits.
- Photo Roasting: If a user attaches a photo, selfie, design, or screenshot, deliver a savage, laugh-out-loud funny roast of the photo, aesthetic, lighting, vibe, and posing in good comedic spirit!
- If the user talks in Hinglish, speak in spicy, slang-packed Hinglish (cooked, down bad, red flag, katai zeher, popat, scene).
- Emojis: 🔥, 💀, 😭, 🥀, 🤡. Keep it witty, entertaining, and punchy.`;

function normalizeMode(mode: ChatPersonality): "hype" | "roast" {
  if (mode === "roast" || mode === "roast18" || mode === "noty" || mode === "funny") {
    return "roast";
  }
  return "hype";
}

export async function sendSpicyChatMessage(
  message: string,
  mode: ChatPersonality = "hype",
  history: ChatMessage[] = [],
  image?: string, // Base64 Data URL (e.g., data:image/png;base64,...)
  isVoiceMode: boolean = false
): Promise<SpicyChatResponse> {
  const normMode = normalizeMode(mode);

  // 1. Run internal security inspection & sanitization if text exists
  const rawMsg = (message || "").trim();
  const hasImage = Boolean(image && image.startsWith("data:"));

  let cleanMsg = "";
  if (rawMsg) {
    const securityCheck = inspectPromptSafety(rawMsg, 3000);
    if (!securityCheck.isSafe && securityCheck.severity === "high") {
      return {
        reply: "Nice try attempting to jailbreak my system instructions, but HypePortal's neural firewalls are way ahead of you. 🛡️ Let's focus on real problems!",
        source: "neural-fallback",
        mode: normMode,
        emoji: "🛡️",
      };
    }
    cleanMsg = securityCheck.sanitized;
  }

  // If both message and image are completely empty
  if (!cleanMsg && !hasImage) {
    return {
      reply: normMode === "hype"
        ? (isVoiceMode ? "At your service, sir. What shall we tackle today?" : "Please provide a question, problem statement, or upload a photo to analyze.")
        : (isVoiceMode ? "Jarvis online, sir. Who are we roasting today?" : "Bhai kuch toh bhej—sawal ya photo! Aise khali haath aayega toh roast kispe karu? 💀"),
      source: "neural-fallback",
      mode: normMode,
      emoji: normMode === "hype" ? "⚡" : "🔥",
    };
  }

  const promptText = cleanMsg || (hasImage
    ? (normMode === "hype" ? "Analyze this uploaded photo and suggest design enhancements." : "Roast this uploaded photo brutally 🔥")
    : "Hello");

  const isHinglish = isHinglishText(promptText);
  const isHindi = isDevanagariHindi(promptText);

  // Extract base64 image payload if present
  let imagePart: { inlineData: { mimeType: string; data: string } } | null = null;
  if (hasImage && image) {
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      imagePart = {
        inlineData: {
          mimeType: match[1] || "image/jpeg",
          data: match[2],
        },
      };
    }
  }

  // Server-side private API key
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    const candidateModels = [
      "gemini-1.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-flash",
    ];

    const systemInstruction = normMode === "hype" ? HYPE_AI_SYSTEM_PROMPT : ROAST_AI_SYSTEM_PROMPT;

    let languageEnforcement = "";
    if (isHinglish) {
      languageEnforcement = "\n\n[MANDATORY: User wrote in HINGLISH. Your response MUST be 100% in natural, conversational Hinglish (Hindi written in English alphabet). Do NOT reply in plain English.]";
    } else if (isHindi) {
      languageEnforcement = "\n\n[MANDATORY: User wrote in Hindi. Your response MUST be in Hindi (Devanagari script).]";
    }

    let voiceDirective = "";
    if (isVoiceMode) {
      if (isHindi || isHinglish) {
        voiceDirective = `\n\n[CRITICAL: REAL-TIME VOICE LOUNGE ACTIVE. You are speaking aloud as J.A.R.V.I.S. in Hindi, as voiced by legendary voice artist Atul Kapoor in Iron Man 2, Iron Man 3, and The Avengers (and Vision). Deliver your spoken response in a deep, polite, dignified, respectful tone (addressed politely as 'सर' / 'Sir'). Keep it to 2 to 3 concise, crisp spoken sentences. Do NOT output markdown symbols, bullet points, asterisks, or code blocks.]`;
      } else {
        voiceDirective = `\n\n[CRITICAL: REAL-TIME VOICE LOUNGE ACTIVE. You are speaking aloud as J.A.R.V.I.S., Tony Stark's personal British AI agent (Paul Bettany). Deliver your spoken response concisely in 2 to 3 natural sentences. Address the user politely as 'sir' where natural. Do NOT output markdown, bullet points, asterisks, or code blocks, as your text is immediately converted to voice synthesis.]`;
      }
    }

    // Build parts for current user turn
    const currentUserParts: any[] = [];
    if (imagePart) {
      currentUserParts.push(imagePart);
    }
    currentUserParts.push({
      text: `${systemInstruction}${languageEnforcement}${voiceDirective}\n\nUser request: "${promptText}"\n\nProvide your comprehensive response now:`,
    });

    // History turns (last 6)
    const formattedContents: any[] = [];
    for (const h of history.slice(-6)) {
      if (h.content) {
        formattedContents.push({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: sanitizeText(h.content, { maxLength: 1000 }) }],
        });
      }
    }

    formattedContents.push({
      role: "user",
      parts: currentUserParts,
    });

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: formattedContents,
            generationConfig: {
              temperature: normMode === "hype" ? 0.7 : 0.98,
              maxOutputTokens: 950,
              topP: 0.95,
            },
          }),
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.trim()) {
            return {
              reply: candidateText.trim(),
              source: "gemini-live",
              mode: normMode,
              emoji: normMode === "hype" ? "⚡" : "🔥",
            };
          }
        }
      } catch {
        // Try next model
      }
    }
  }

  // Fallback generation (intelligent response matching language and image attachment)
  if (hasImage) {
    if (normMode === "hype") {
      const imgReply = isHinglish
        ? IMAGE_FALLBACKS_HYPE.hinglish
        : isHindi
        ? IMAGE_FALLBACKS_HYPE.hi
        : IMAGE_FALLBACKS_HYPE.en;
      return {
        reply: imgReply,
        source: "neural-fallback",
        mode: "hype",
        emoji: "⚡",
      };
    } else {
      const imgReply = isHinglish
        ? IMAGE_FALLBACKS_ROAST.hinglish
        : isHindi
        ? IMAGE_FALLBACKS_ROAST.hi
        : IMAGE_FALLBACKS_ROAST.en;
      return {
        reply: imgReply,
        source: "neural-fallback",
        mode: "roast",
        emoji: "🔥",
      };
    }
  }

  // Voice mode fallback (natural spoken text for Jarvis)
  if (isVoiceMode) {
    const voiceModeMap = VOICE_FALLBACKS[normMode] || VOICE_FALLBACKS.hype;
    const voiceList = isHinglish
      ? voiceModeMap.hinglish
      : isHindi
      ? voiceModeMap.hi
      : voiceModeMap.en;
    let hash = 0;
    for (let i = 0; i < promptText.length; i++) {
      hash = (hash << 5) - hash + promptText.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % voiceList.length;
    return {
      reply: voiceList[idx],
      source: "neural-fallback",
      mode: normMode,
      emoji: normMode === "hype" ? "⚡" : "🔥",
    };
  }

  // Text-only fallback
  let list = FALLBACK_RESPONSES[normMode] || FALLBACK_RESPONSES.hype;
  if (isHinglish) {
    list = FALLBACK_RESPONSES_HINGLISH[normMode] || FALLBACK_RESPONSES_HINGLISH.hype;
  } else if (isHindi) {
    list = FALLBACK_RESPONSES_HINDI[normMode] || FALLBACK_RESPONSES_HINDI.hype;
  }

  let hash = 0;
  for (let i = 0; i < promptText.length; i++) {
    hash = (hash << 5) - hash + promptText.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % list.length;

  return {
    reply: list[idx],
    source: "neural-fallback",
    mode: normMode,
    emoji: normMode === "hype" ? "⚡" : "🔥",
  };
}
