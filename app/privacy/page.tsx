"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ShieldCheck, Lock, Clock, EyeOff, Server, FileCheck, CheckCircle2 } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

export default function PrivacyPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-8 flex-1">
        {/* Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
          <div className="space-y-1.5">
            <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
              <Link href="/" className="hover:text-[#F97316] transition-colors">
                <span>{isHi ? "मैट्रिक्स" : "Matrix"}</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[#F97316] font-semibold">
                {isHi ? "गोपनीयता नीति" : "Privacy Policy"}
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span>{isHi ? "डेटा गोपनीयता व 48-घंटे सुरक्षा नीति" : "Data Privacy & 48-Hour Retention Policy"}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold">
                GDPR &bull; Zero Tracking
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl leading-relaxed">
              {isHi
                ? "अंतिम संशोधन: 5 अक्टूबर 2026 • आपकी बातचीत और डेटा की सुरक्षा हमारी सर्वोच्च प्राथमिकता है।"
                : "Last Updated: October 5, 2026 • Explicit privacy guarantees, ephemeral chat lifecycle, and zero user-tracking policies."}
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--surface-hover)] text-xs font-mono text-[var(--foreground)] transition cursor-pointer self-start sm:self-auto shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#F97316]" />
            <span>{isHi ? "वापस होम" : "Back to Matrix"}</span>
          </Link>
        </div>

        {/* 4 Core Privacy Guarantees Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "48-घंटे स्वतः-डिलीट अनुबंध" : "48-Hour Ephemeral Purge"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "सभी चैट लॉग 48 घंटे बाद स्वतः नष्ट हो जाते हैं। कोई स्थायी सर्वर-साइड डेटाबेस हिस्ट्री नहीं रखी जाती।"
                : "All conversational sessions expire and permanently purge after 48 hours. No permanent server-side chat transcripts are retained."}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "शून्य डेटा ब्रोकिंग" : "Zero Data Selling"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "हम कभी भी आपका व्यक्तिगत डेटा या इनपुट्स तीसरे पक्ष के विज्ञापनदाताओं या डेटा ब्रोकरों को नहीं बेचते।"
                : "We never monetize, broker, or sell user telemetry, prompts, or browsing behaviors to third-party ad networks."}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "क्लाइंट-साइड लोकल सैंडबॉक्स" : "Client-Side Sandbox"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "आपकी चैट हिस्ट्री आपके अपने ब्राउज़र के LocalStorage में सुरक्षित रहती है। आप इसे एक क्लिक में डस्टबिन आइकन से रीसेट कर सकते हैं।"
                : "Sessions live inside your personal browser's LocalStorage sandbox. You hold complete ownership and can purge instantly via the dustbin icon."}
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "TLS 1.3 एंड-टू-एंड एन्क्रिप्शन" : "TLS 1.3 In-Flight Encryption"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "सभी एपीआई कॉल्स, रोस्ट रिक्वेस्ट्स और वोट्स आधुनिक TLS 1.3 एन्क्रिप्शन के साथ ट्रांसमिट होते हैं।"
                : "All API transmissions and neural evaluations are strictly protected via modern TLS 1.3 with Perfect Forward Secrecy."}
            </p>
          </div>
        </div>

        {/* Detailed Legal & Policy Clauses */}
        <div className="space-y-6 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed glass rounded-2xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--card-bg)]">
          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              1. Information We Process
            </h2>
            <p className="text-[var(--muted-foreground)]">
              HYPE PORTAL operates on a minimal-telemetry principle. When interacting with our intelligence matrix, we only process:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[var(--muted-foreground)] pl-2">
              <li>Ephemeral query strings and prompt tokens submitted to AI models for real-time inference.</li>
              <li>Anonymized voting signals on community debates (used to compute live consensus percentages).</li>
              <li>Local UI preferences (Light/Dark theme mode, Hindi/English language choice) stored exclusively in your browser.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              2. 48-Hour Ephemeral Chat Retention SLA
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Unlike traditional platforms that retain user logs indefinitely, the HYPE PORTAL AI Lounge implements an automatic 48-hour expiration lifecycle. Once 48 hours pass from your last message timestamp, client routines automatically purge the conversation cache. Furthermore, users can wipe their entire chat log on demand using the animated dustbin reset button with 5-second undo protection.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              3. Third-Party AI Sub-processors
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Conversational queries and profile vibe audits are evaluated server-side via official enterprise API access (Google Gemini). Inputs are processed for stateless inference only and are not utilized to train foundation models without explicit agreement.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              4. Cookies and Local Storage
            </h2>
            <p className="text-[var(--muted-foreground)]">
              HYPE PORTAL uses standard browser LocalStorage solely to maintain your active theme, language preference, and 48-hour chat sessions. We do not place advertising tracking beacons, pixel trackers, or fingerprinting scripts.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
              5. Contact and Privacy Inquiries
            </h2>
            <p className="text-[var(--muted-foreground)]">
              For any privacy-related requests, compliance questions, or data protection inquiries, reach our team via{" "}
              <Link
                href="/contact"
                className="text-[#F97316] underline font-medium hover:text-[#EA580C] transition"
              >
                Official Contact Desk
              </Link>{" "}
              or{" "}
              <a
                href="mailto:ask.hypeai@gmail.com"
                className="text-[#F97316] underline font-medium hover:text-[#EA580C] transition"
                title="Direct Email"
              >
                Contact via Email
              </a>.
            </p>
          </section>
        </div>
      </main>

      {/* Subfooter */}
      <footer className="border-t border-[#1E293B] bg-[#0B1220] text-[#CBD5E1] py-8 text-xs font-mono text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            &copy; 2026{" "}
            <a
              href="https://instagram.com/iprcreations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-[#F97316] transition underline decoration-dotted underline-offset-4 font-semibold"
            >
              PR Creations Lab.
            </a>{" "}
            &bull; Privacy & Data Governance
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[#F97316] transition">
              Contact
            </Link>
            <Link href="/docs" className="hover:text-[#F97316] transition">
              Documentation
            </Link>
            <Link href="/terms" className="hover:text-[#F97316] transition">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-[#F97316] transition">
              Security
            </Link>
            <Link href="/sitemap" className="hover:text-[#F97316] transition">
              Sitemap
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
