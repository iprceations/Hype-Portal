"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeType = "day" | "night" | "system";
export type ResolvedTheme = "day" | "night";

export type LanguageType = "en" | "hi";

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  nameHi: string;
  icon: "Sun" | "Moon" | "Monitor";
}

export const THEMES: ThemeConfig[] = [
  {
    id: "day",
    name: "Day",
    nameHi: "दिन",
    icon: "Sun",
  },
  {
    id: "night",
    name: "Night",
    nameHi: "रात",
    icon: "Moon",
  },
  {
    id: "system",
    name: "System",
    nameHi: "सिस्टम",
    icon: "Monitor",
  },
];

export interface LanguageConfig {
  id: LanguageType;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LanguageConfig[] = [
  { id: "en", label: "English", native: "English (US)", flag: "🇬🇧" },
  { id: "hi", label: "हिन्दी", native: "हिन्दी", flag: "🇮🇳" },
];

interface ThemeAndLangContextType {
  theme: ThemeType;
  resolvedTheme: ResolvedTheme;
  setTheme: (t: ThemeType) => void;
  language: LanguageType;
  setLanguage: (l: LanguageType) => void;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<LanguageType, Record<string, string>> = {
  en: {
    navMatrix: "Matrix",
    navRoast: "AI Roast",
    navDebates: "Debates",
    navVault: "Prompt Vault",
    navAI: "(AI)",
    navContact: "Contact",
    contactViaEmail: "Contact via Email",
    contactUs: "Contact Us",
    live: "LIVE",
    theme: "Theme",
    themeDay: "Day",
    themeNight: "Night",
    themeSystem: "System",
    lang: "Language",

    heroBadge: "ENTERPRISE INTELLIGENCE MATRIX • LIVE DATA",
    heroTitle1: "Smarter",
    heroTitle2: "Intelligence for a",
    heroTitle3: "Bigger",
    heroTitle4: "Tomorrow.",
    heroDesc:
      "Transform data into decisions with HYPE PORTAL — a powerful intelligence matrix designed for smarter, faster and more informed decisions.",
    auditedClaims: "Insights Generated",
    neuralPrecision: "Trusted Users",
    geminiEngine: "Organizations",
    activeLive: "System Uptime",

    matrixKicker: "01 • THE INTELLIGENCE MATRIX",
    matrixHeading1: "A wider view.",
    matrixHeading2: "A sharper move.",
    matrixDesc:
      "The moments that matter rarely arrive fully formed. We connect the dots between emerging cultural codes, creative velocity, and digital commerce.",
    field1Title: "Culture",
    field1Sub: "in the making.",
    field1Desc:
      "Catch the codes, internet conversations, viral memes, and behavioral shifts reshaping what communities care about.",
    field1Link: "Read the room",
    field2Title: "Creators",
    field2Sub: "setting the tempo.",
    field2Desc:
      "See the micro-communities, algorithmic formats, and creative voices moving the digital conversation forward.",
    field2Link: "Find the voices",
    field3Title: "Commerce",
    field3Sub: "changing shape.",
    field3Desc:
      "Track consumer rituals, tech startup hyperbole, SaaS valuations, and viral product positioning before the bubble bursts.",
    field3Link: "Spot the shift",

    signalKicker: "02 / INSIDE THE PORTAL",
    signalHeading1: "From Scattered Signals to",
    signalHeading2: "Clear Direction.",
    signalDesc:
      "Big cultural and market shifts start as faint clues. The intelligence matrix maps emerging behavioral patterns before they become mainstream noise.",
    signalRadar: "REAL-TIME RADAR",
    signalWindowBar: "⚡ HYPE PORTAL / SIGNAL MATRIX FEED",
    signalActive: "SIGNAL ACTIVE",
    earlySignal: "EARLY SIGNAL",
    growingMomentum: "GROWING MOMENTUM",
    mainstream: "MAINSTREAM ESCALATION",
    velocity: "VELOCITY",
    mindshare: "MINDSHARE",
    status: "STATUS",
    switchField: "Switch Field:",

    aiBannerBadge: "🤖 (AI) ChatGPT Lounge • Mode Switcher • 48h Auto-Delete",
    aiBannerTitle1: "Unfiltered ChatGPT-Style AI with",
    aiBannerTitle2: "Custom Personalities",
    aiBannerDesc:
      "Switch modes effortlessly: 😈 Noty & Flirty (18+), 💀 Savage Roast (18+), 🍸 Midnight Confessions, and ⚡ Smart Assistant. Free private server-side AI with automatic 48-hour chat purge.",
    aiBannerBtn: "Launch (AI) Lounge",

    roastHeading: "AI Roast & Vibe Check Engine",
    roastDesc:
      "Paste any viral link, influencer claim, or website URL. Our specialized neural evaluator deconstructs marketing hyperbole, scores authenticity, and delivers an unapologetic vibe verdict.",
    roastFullPage: "Dedicated Page →",

    seoTitle: "YouTube & Creator SEO Title Studio",
    seoDesc:
      "Generate 3 viral high-CTR titles, 0-100 SEO optimization score, and 1-click copy hashtags.",

    soundboardTitle: "Desi Meme & Hype Soundboard",
    soundboardDesc:
      "Tactile zero-latency Web Audio sound synthesizer for creators and memers.",

    gameTitle: "HYPE or CAP? 🧢 The Autonomous Lie-Detector",
    gameDesc:
      "Test your bullshit detector against viral internet claims. Guess if it's Real HYPE or Pure CAP!",

    promptVaultTitle: "Prompt Vault",
    promptVaultSub: "Curated Diffusion Directory",
    promptVaultOpen: "Open Full Page",

    footerTagline: "INTELLIGENCE MATRIX",
    footerCopy: "All rights reserved. Stay ahead of the moment.",
    footerBackTop: "Back to top",
    disclaimer:
      "HYPE AI can make mistakes. Verify important information.",
  },
  hi: {
    navMatrix: "मैट्रिक्स",
    navRoast: "एआई रोस्ट",
    navDebates: "मुद्दे व बहस",
    navVault: "प्रॉम्प्ट वॉल्ट",
    navAI: "(एआई) लाउंज",
    navContact: "संपर्क",
    contactViaEmail: "ईमेल द्वारा संपर्क करें",
    contactUs: "संपर्क करें",
    live: "लाइव",
    theme: "थीम",
    themeDay: "दिन",
    themeNight: "रात",
    themeSystem: "सिस्टम",
    lang: "भाषा",

    heroBadge: "एंटरप्राइज़ इंटेलिजेंस मैट्रिक्स • लाइव डेटा",
    heroTitle1: "बेहतर बुद्धिमत्ता,",
    heroTitle2: "उज्ज्वल कल के लिए।",
    heroTitle3: "",
    heroTitle4: "",
    heroDesc:
      "हाइप पोर्टल के साथ डेटा को निर्णयों में बदलें — एक शक्तिशाली इंटेलिजेंस मैट्रिक्स जो अधिक स्मार्ट, तेज़ और सटीक निर्णयों के लिए डिज़ाइन किया गया है।",
    auditedClaims: "इनसाइट्स जनरेटेड",
    neuralPrecision: "भरोसेमंद उपयोगकर्ता",
    geminiEngine: "संगठन",
    activeLive: "सिस्टम अपटाइम",

    matrixKicker: "01 • द इंटेलिजेंस मैट्रिक्स",
    matrixHeading1: "एक व्यापक दृष्टि।",
    matrixHeading2: "एक सटीक निर्णय।",
    matrixDesc:
      "महत्वपूर्ण बदलाव कभी अचानक नहीं आते। हम उभरते सांस्कृतिक कोड, रचनात्मक गति और डिजिटल बाज़ार के बदलावों को आपस में जोड़ते हैं।",
    field1Title: "संस्कृति (Culture)",
    field1Sub: "निर्माण के दौर में।",
    field1Desc:
      "इंटरनेट के नए ट्रेंड्स, सामाजिक बदलाव और मीम्स को समझें जो लोगों की सोच को नया रूप दे रहे हैं।",
    field1Link: "माहौल को समझें",
    field2Title: "क्रिएटर्स (Creators)",
    field2Sub: "गति और दिशा तय करते हुए।",
    field2Desc:
      "पहचानें वो आवाज़ें, वीडियो प्रारूप और माइक्रो-कम्युनिटीज जो डिजिटल चर्चाओं को आगे बढ़ा रहे हैं।",
    field2Link: "आवाज़ों को खोजें",
    field3Title: "व्यापार (Commerce)",
    field3Sub: "बदलता हुआ बाज़ार।",
    field3Desc:
      "उपभोक्ता की नई आदतों, टेक स्टार्टअप्स के दावों और वायरल प्रोडक्ट्स की सच्चाई को ट्रैक करें।",
    field3Link: "बदलाव को पहचानें",

    signalKicker: "02 / पोर्टल के अंदर",
    signalHeading1: "बिखरे संकेतों से",
    signalHeading2: "स्पष्ट दिशा की ओर।",
    signalDesc:
      "हर बड़ा बदलाव एक छोटे संकेत से शुरू होता है। यह मैट्रिक्स उभरते पैटर्न्स को सामने लाता है ताकि आप हमेशा सबसे आगे रह सकें।",
    signalRadar: "रीयल-टाइम रडार",
    signalWindowBar: "⚡ हाइप पोर्टल / सिग्नल मैट्रिक्स फ़ीड",
    signalActive: "सिग्नल सक्रिय",
    earlySignal: "शुरुआती संकेत",
    growingMomentum: "बढ़ती गति",
    mainstream: "मुख्यधारा में प्रवेश",
    velocity: "गति",
    mindshare: "माइंडशेयर",
    status: "स्थिति",
    switchField: "फ़ील्ड चुनें:",

    aiBannerBadge: "🤖 (एआई) चैटजीपीटी लाउंज • मोड स्विचर • 48 घंटे में स्वतः चैट डिलीट",
    aiBannerTitle1: "कस्टम व्यक्तित्वों के साथ बेबाक",
    aiBannerTitle2: "चैटजीपीटी-शैली एआई",
    aiBannerDesc:
      "आसानी से मोड बदलें: 😈 नॉटी व फ़्लर्टी (18+), 💀 सेवेज रोस्ट (18+), 🍸 आधी रात की गुप्त बातें, और ⚡ स्मार्ट असिस्टेंट। 48 घंटे में ऑटोमैटिक चैट डिलीट के साथ सुरक्षित प्राइवेट सर्वर एआई।",
    aiBannerBtn: "लाउंज शुरू करें",

    roastHeading: "एआई रोस्ट व सत्यता जांच इंजन",
    roastDesc:
      "कोई भी वायरल लिंक, सोशल हैंडल या वेबसाइट यूआरएल पेस्ट करें। हमारा न्यूरल मॉडल मार्केटिंग के झूठे दावों को बेनकाब करके तीखा रोस्ट तैयार करता है।",
    roastFullPage: "समर्पित पेज देखें →",

    seoTitle: "यूट्यूब व सोशल वायरल टाइटल और एसईओ स्टूडियो",
    seoDesc:
      "उच्च क्लिक-थ्रू दर (CTR) वाले 3 वायरल शीर्षक, 0-100 एसईओ स्कोर और 1-क्लिक कॉपी टैग्स जनरेट करें।",

    soundboardTitle: "देसी मीम व हाइप साउंडबोर्ड",
    soundboardDesc:
      "शून्य विलंबता वाला वेब ऑडियो सिंथेसाइज़र — तुरंत साउंड इफ़ेक्ट्स बजाएं।",

    gameTitle: "HYPE या CAP? 🧢 स्वायत्त लाई-डिटेक्टर गेम",
    gameDesc:
      "वायरल अफवाहों की सच्चाई परखें। बताएं कि यह असली सच (HYPE) है या कोरी अफवाह (CAP)!",

    promptVaultTitle: "प्रॉम्प्ट वॉल्ट",
    promptVaultSub: "क्यूरेटेड एआई इमेज प्रॉम्प्ट निर्देशिका",
    promptVaultOpen: "पूरा पेज खोलें",

    footerTagline: "इंटेलिजेंस मैट्रिक्स",
    footerCopy: "सर्वाधिकार सुरक्षित। समय से एक कदम आगे रहें।",
    footerBackTop: "ऊपर जाएं",
    disclaimer:
      "HYPE AI गलतियां कर सकता है। महत्वपूर्ण जानकारी सत्यापित करें।",
  },
};

const ThemeAndLangContext = createContext<ThemeAndLangContextType>({
  theme: "system",
  resolvedTheme: "night",
  setTheme: () => {},
  language: "en",
  setLanguage: () => {},
  t: (k: string) => k,
});

const getSystemTheme = (): ResolvedTheme => {
  if (typeof window === "undefined") return "night";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
};

const applyThemeToDOM = (resolved: ResolvedTheme) => {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (resolved === "day") {
    root.setAttribute("data-theme", "light");
    root.classList.remove("dark");
    root.classList.add("light");
  } else {
    root.setAttribute("data-theme", "dark");
    root.classList.remove("light");
    root.classList.add("dark");
  }
};

export function ThemeAndLangProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<ThemeType>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("night");
  const [language, setLanguageState] = useState<LanguageType>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("hype_theme") as ThemeType;
      const savedLang = localStorage.getItem("hype_lang") as LanguageType;

      let activeTheme: ThemeType = "system";
      if (savedTheme && (savedTheme === "day" || savedTheme === "night" || savedTheme === "system")) {
        activeTheme = savedTheme;
      }

      setThemeState(activeTheme);
      const resolved = activeTheme === "system" ? getSystemTheme() : activeTheme;
      setResolvedTheme(resolved);
      applyThemeToDOM(resolved);

      if (savedLang && (savedLang === "en" || savedLang === "hi")) {
        setLanguageState(savedLang);
        document.documentElement.setAttribute("lang", savedLang);
      }
    } catch {}
    setMounted(true);
  }, []);

  // Real-time listener for OS preference changes when in "system" mode
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        const resolved: ResolvedTheme = e.matches ? "night" : "day";
        setResolvedTheme(resolved);
        applyThemeToDOM(resolved);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    const resolved = newTheme === "system" ? getSystemTheme() : newTheme;
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    try {
      localStorage.setItem("hype_theme", newTheme);
    } catch {}
  };

  const setLanguage = (newLang: LanguageType) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("hype_lang", newLang);
      document.documentElement.setAttribute("lang", newLang);
    } catch {}
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <ThemeAndLangContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </ThemeAndLangContext.Provider>
  );
}

export function useThemeAndLang() {
  return useContext(ThemeAndLangContext);
}
