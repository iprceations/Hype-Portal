"use client";

import React, { useState } from "react";
import { sound } from "@/lib/audio";
import {
  CheckCircle2,
  XCircle,
  Flame,
  Trophy,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  AlertOctagon,
  Gamepad2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useThemeAndLang } from "@/lib/themeContext";

interface ClaimItem {
  id: number;
  category: string;
  categoryHi: string;
  claim: string;
  claimHi: string;
  isHype: boolean; // true = Real fact (HYPE), false = Fake/Myth (CAP)
  verdictTitle: string;
  verdictTitleHi: string;
  explanation: string;
  explanationHi: string;
  sourceLabel: string;
}

const CLAIMS: ClaimItem[] = [
  {
    id: 1,
    category: "Startup Drama",
    categoryHi: "स्टार्टअप ड्रामा",
    claim:
      "A software engineer once hired a personal assistant on Craigslist to slap him in the face every time he opened Facebook, boosting his productivity by 300%.",
    claimHi:
      "एक सॉफ्टवेयर इंजीनियर ने क्रेग्सलिस्ट पर एक असिस्टेंट को काम पर रखा ताकि जब भी वह फेसबुक खोले, वह उसके चेहरे पर थप्पड़ मारे — इससे उसकी उत्पादकता 300% बढ़ गई।",
    isHype: true,
    verdictTitle: "REAL HYPE!",
    verdictTitleHi: "बिल्कुल सच!",
    explanation:
      "Maneesh Sethi (founder of Pavlok) famously hired a woman named Kara for $8/hr to slap him whenever he opened Reddit or Facebook. Even Elon Musk commented on it!",
    explanationHi:
      "मनीष सेठी (पावलोक के संस्थापक) ने कारा नाम की महिला को $8/घंटे पर रखा था ताकि सोशल मीडिया खोलने पर वह थप्पड़ मारे। एलोन मस्क ने भी इस पर प्रतिक्रिया दी थी!",
    sourceLabel: "Verified Reality (2012)",
  },
  {
    id: 2,
    category: "Social Media",
    categoryHi: "सोशल मीडिया",
    claim:
      "Meta quietly rolled out an update where Instagram users with verified blue ticks can see who took a screenshot of their stories.",
    claimHi:
      "मेटा ने इंस्टाग्राम पर ऐसा अपडेट निकाला है जिससे ब्लू टिक वाले यूज़र्स यह देख सकते हैं कि उनकी स्टोरी का स्क्रीनशॉट किसने लिया।",
    isHype: false,
    verdictTitle: "TOTAL CAP!",
    verdictTitleHi: "कोरा झूठ!",
    explanation:
      "This rumor goes viral on TikTok and Twitter every 6 months. Instagram only notified screenshots on disappearing DMs years ago, never for normal public stories.",
    explanationHi:
      "यह अफवाह हर 6 महीने में वायरल होती है। इंस्टाग्राम ने कभी भी सामान्य स्टोरीज के स्क्रीनशॉट पर कोई नोटिफिकेशन नहीं दिया।",
    sourceLabel: "Debunked Myth",
  },
  {
    id: 3,
    category: "AI & Tech",
    categoryHi: "एआई और टेक",
    claim:
      "A defendant used ChatGPT on a smartwatch in court to successfully contest an unfair parking ticket, getting the fine reduced to zero.",
    claimHi:
      "एक व्यक्ति ने अदालत में स्मार्टवॉच पर चैटजीपीटी का उपयोग करके गलत पार्किंग चालान को सफलतापूर्वक चुनौती दी और जुर्माना शून्य करवा लिया।",
    isHype: true,
    verdictTitle: "REAL HYPE!",
    verdictTitleHi: "बिल्कुल सच!",
    explanation:
      "Multiple motorists in the UK and US used generative AI to draft municipal loophole defenses and cross-reference road sign bylaws, overturning fines without lawyers.",
    explanationHi:
      "ब्रिटेन और अमेरिका में कई लोगों ने स्थानीय यातायात कानूनों का हवाला देकर वकीलों के बिना ट्रैफिक जुर्माने को रद्द कराया है।",
    sourceLabel: "Verified Court Record",
  },
  {
    id: 4,
    category: "Crypto",
    categoryHi: "क्रिप्टो",
    claim:
      "A crypto enthusiast legally changed his official government passport name to 'Ethereum Bitcoin' to claim tax-free mining privileges in Portugal.",
    claimHi:
      "एक क्रिप्टो प्रेमी ने पुर्तगाल में टैक्स छूट पाने के लिए अपने पासपोर्ट में कानूनी तौर पर अपना नाम 'एथेरियम बिटकॉइन' रख लिया।",
    isHype: false,
    verdictTitle: "PURE CAP!",
    verdictTitleHi: "पूरी अफवाह!",
    explanation:
      "Satirical parody post made by a meme page that was reposted by several news aggregators as real news. Portuguese civil registries reject currency names.",
    explanationHi:
      "यह एक व्यंग्य पेज द्वारा बनाया गया पैरोडी पोस्ट था जिसे कुछ न्यूज़ पोर्टल्स ने सच समझकर छाप दिया था।",
    sourceLabel: "Internet Hoax",
  },
  {
    id: 5,
    category: "Dating Lore",
    categoryHi: "डेटिंग दुनिया",
    claim:
      "In a 2025 consumer survey, over 38% of Gen-Z singles admitted to using ChatGPT to draft their breakup messages and awkward apology texts.",
    claimHi:
      "एक सर्वेक्षण में 38% से अधिक युवाओं ने स्वीकार किया कि वे ब्रेकअप मैसेज और माफ़ी मांगने के टेक्स्ट लिखने के लिए चैटजीपीटी का उपयोग करते हैं।",
    isHype: true,
    verdictTitle: "REAL HYPE!",
    verdictTitleHi: "बिल्कुल सच!",
    explanation:
      "Surveys by dating and relationship institutes revealed that more than a third of Gen-Z daters use AI to avoid emotional confrontation and craft 'diplomatic exits.'",
    explanationHi:
      "डेटिंग संस्थानों के सर्वेक्षणों से पता चला है कि युवा अप्रिय भावनात्मक टकराव से बचने और कूटनीतिक संदेश लिखने के लिए एआई का सहारा लेते हैं।",
    sourceLabel: "Verified Survey (2025)",
  },
];

export default function HypeOrCapGame() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);

  const currentClaim = CLAIMS[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentClaim.isHype;

  const handleGuess = (guessIsHype: boolean) => {
    if (isAnswered) return;
    setSelectedAnswer(guessIsHype);
    setAnsweredCount((prev) => prev + 1);

    if (guessIsHype === currentClaim.isHype) {
      sound.playVoteClick();
      setScore((prev) => prev + 100 + streak * 25);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
          colors: ["#F97316", "#1E293B", "#F59E0B"],
        });
      } catch {}
    } else {
      sound.playVoteClick();
      setStreak(0);
    }
  };

  const handleNext = () => {
    sound.playVoteClick();
    setSelectedAnswer(null);
    setCurrentIndex((prev) => (prev + 1) % CLAIMS.length);
  };

  const handleRestart = () => {
    sound.playVoteClick();
    setSelectedAnswer(null);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setAnsweredCount(0);
  };

  // Rank determination
  let rank = isHi ? "नया संशयवादी" : "Novice Skeptic";
  if (score >= 400) rank = isHi ? "सर्वोच्च सत्य सम्राट" : "Apex Truth Sovereign";
  else if (score >= 250) rank = isHi ? "सीनियर फैक्ट-चेकर" : "Senior Fact-Checker";
  else if (score >= 100) rank = isHi ? "सत्य खोजी" : "Bullshit Detector";

  return (
    <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden glass border border-[var(--border)] bg-[var(--card-bg)] transition-colors">
      <div className="relative z-10 space-y-6">
        {/* Game Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/15 border border-[#F97316]/30 text-[#F97316] font-mono text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>
                {isHi
                  ? "इंटरैक्टिव एक्टिविटी • लाई-डिटेक्टर गेम"
                  : "Interactive Activity • Lie-Detector Game"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)] tracking-tight flex items-center gap-2">
              <span>{isHi ? "HYPE या CAP?" : "HYPE or CAP?"}</span>
              <span className="text-sm font-mono px-2 py-0.5 rounded bg-[var(--surface)] text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1] font-normal border border-[var(--border)]">
                {isHi
                  ? `राउंड ${currentIndex + 1}/${CLAIMS.length}`
                  : `Round ${currentIndex + 1}/${CLAIMS.length}`}
              </span>
            </h2>
            <p className="text-xs text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/80">
              {isHi
                ? "क्या आपका दिमाग इंटरनेट की अफवाहों और असली सच में फर्क पहचान सकता है?"
                : "Can your brain spot viral internet truth from pure fabricated delusion?"}
            </p>
          </div>

          {/* Gamification Stats HUD */}
          <div className="flex items-center gap-3 shrink-0 font-mono">
            <div className="px-4 py-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center shadow-xs">
              <span className="text-[10px] text-[var(--muted-foreground)] block uppercase font-bold">
                {isHi ? "स्कोर" : "Score"}
              </span>
              <span className="font-black text-base text-[#F97316]">
                {score} {isHi ? "अंक" : "pts"}
              </span>
            </div>

            <div className="px-4 py-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-center shadow-xs">
              <span className="text-[10px] text-[var(--muted-foreground)] block uppercase font-bold">
                {isHi ? "स्ट्राइक" : "Streak"}
              </span>
              <span className="text-[#F59E0B] font-black text-base flex items-center gap-1 justify-center">
                <Flame className="w-4 h-4 text-[#F97316] animate-pulse" />
                {streak}x
              </span>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              title={isHi ? "रीसेट करें" : "Reset Game"}
              className="p-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-foreground)] hover:text-[#F97316] hover:border-[#F97316] hover:bg-[#FFF7ED] [html[data-theme='dark']_&]:hover:bg-[#F97316]/10 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Claim Card Display */}
        <div
          className={`p-6 sm:p-7 rounded-2xl transition-all border ${
            isAnswered
              ? isCorrect
                ? "border-[#F97316] bg-[#FFF7ED] [html[data-theme='dark']_&]:bg-[#F97316]/10"
                : "border-[var(--border)] bg-[var(--surface)]"
              : "border-[var(--border)] bg-[var(--surface)] shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between gap-2 pb-3">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-[var(--card-bg)] text-[#F97316] border border-[#F97316]/30">
              {isHi ? currentClaim.categoryHi : currentClaim.category}
            </span>
            <span className="text-[11px] font-mono text-[var(--muted-foreground)] flex items-center gap-1 font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-[#F97316]" />
              <span>{isHi ? "असली सच या कोरी बकवास?" : "Real Fact or Total Bullshit?"}</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg text-[var(--foreground)] font-semibold leading-relaxed py-2">
            &ldquo;{isHi ? currentClaim.claimHi : currentClaim.claim}&rdquo;
          </h3>

          {/* Answer Action Buttons (Before Selection) */}
          {!isAnswered ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5">
              <button
                type="button"
                onClick={() => handleGuess(true)}
                className="group flex items-center justify-center gap-3 p-4 rounded-full bg-gradient-to-r from-[#F97316] to-[#EA580C] hover:from-[#EA580C] hover:to-[#C2410C] text-white font-mono font-bold text-sm transition-all transform hover:scale-[1.01] cursor-pointer shadow-md shadow-[#F97316]/25 border-none"
              >
                <CheckCircle2 className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span>{isHi ? "HYPE! (सच्चा तथ्य)" : "HYPE! (True Fact)"}</span>
              </button>

              <button
                type="button"
                onClick={() => handleGuess(false)}
                className="group flex items-center justify-center gap-3 p-4 rounded-full bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 dark:hover:bg-slate-700 font-mono font-bold text-sm transition-all transform hover:scale-[1.01] cursor-pointer shadow-sm border border-slate-700"
              >
                <XCircle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                <span>{isHi ? "CAP! (कोरा झूठ)" : "CAP! (Pure Lie)"}</span>
              </button>
            </div>
          ) : (
            /* Reveal Feedback Card (After Selection) */
            <div className="pt-4 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-[#F97316] shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-6 h-6 text-[#64748B] shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-black font-mono uppercase ${
                        isCorrect ? "text-[#F97316]" : "text-[var(--foreground)]"
                      }`}
                    >
                      {isCorrect
                        ? isHi
                          ? "आपने बिल्कुल सही पकड़ा!"
                          : "You Nailed It!"
                        : isHi
                        ? "आप मात खा गए!"
                        : "You Got Cooked!"}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#64748B] [html[data-theme='dark']_&]:text-[#CBD5E1]/70">
                      &bull; {isHi ? "निर्णय:" : "Verdict:"}{" "}
                      {isHi ? currentClaim.verdictTitleHi : currentClaim.verdictTitle}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--foreground)]/80 leading-relaxed">
                    {isHi ? currentClaim.explanationHi : currentClaim.explanation}
                  </p>
                </div>
              </div>

              {/* Next Question CTA */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-[#F97316]">
                  {isHi ? "पदवी:" : "Rank:"} <strong>{rank}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2.5 rounded-full bg-[#F97316] hover:bg-[#EA580C] text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer border-none shadow-sm"
                >
                  <span>{isHi ? "अगला दावा" : "Next Claim"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
