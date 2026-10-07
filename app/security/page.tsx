"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ShieldCheck, Lock, Server, Key, EyeOff, CheckCircle2, Zap, Mail } from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";

export default function SecurityPage() {
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
                {isHi ? "सुरक्षा प्रोटोकॉल" : "Security Protocols"}
              </span>
            </nav>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3">
              <span>{isHi ? "एंटरप्राइज सुरक्षा व एन्क्रिप्शन प्रोटोकॉल" : "Enterprise Security & Defense Protocols"}</span>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#F59E0B]/15 border border-[#F59E0B]/30 text-[#F59E0B] font-bold">
                TLS 1.3 &bull; Zero Trust
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl leading-relaxed">
              {isHi
                ? "क्लाउड इंफ्रास्ट्रक्चर, सर्वरलेस एपीआई सुरक्षा, और 48-घंटे एफेमरल प्राइवेसी सुरक्षा मानक।"
                : "Detailed technical specifications on edge transport encryption, stateless compute, and automated data purging."}
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

        {/* 4 Pillars of HYPE Security Architecture */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "ट्रांजिट एन्क्रिप्शन (TLS 1.3)" : "TLS 1.3 In-Flight Encryption"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "सभी वेब ट्रैफ़िक और सर्वर एक्शन कॉल्स सख्त HSTS और आधुनिक साइफ़र सुइट्स के साथ एन्क्रिप्टेड हैं।"
                : "Strict Transport Security (HSTS) with forward secrecy enforced across all domains, routes, and background telemetry."}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "स्टेटलेस सर्वरलेस इनफरेंस" : "Stateless Compute Isolation"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "हमारा सर्वरलेस आर्किटेक्चर क्वेरी समाप्त होते ही मेमोरी को रीसायकल कर देता है। कोई प्रॉम्प्ट स्टोर नहीं होता।"
                : "Server actions run in isolated sandbox runtimes that immediately discard prompt memory upon stream termination."}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "DDoS व ब्रूट-फोर्स सुरक्षा" : "Edge Rate Limiting & Anti-DDoS"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "क्लाउड एज लेयर स्वचालित रूप से संदिग्ध बॉट ट्रैफ़िक और स्पैमिंग को फिल्टर करती है।"
                : "Automated edge filters detect and throttle suspicious scraping clusters and synthetic request amplification."}
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)]">
              {isHi ? "48-घंटे हार्ड पर्ज एसएलए" : "48-Hour Hard Purge SLA"}
            </h3>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              {isHi
                ? "क्लाइंट ब्राउज़र में रखी गई चैट हिस्ट्री 48 घंटे बीतते ही स्वतः साफ हो जाती है, साथ ही उपयोगकर्ता को तुरंत रीसेट करने का अधिकार मिलता है।"
                : "Client sessions enforce cryptographic timestamp validation and self-delete after 48 hours without trace."}
            </p>
          </div>
        </div>

        {/* Security Disclosures & Vulnerability Reporting */}
        <div className="space-y-4 text-xs sm:text-sm text-[var(--foreground)] leading-relaxed glass rounded-2xl p-6 sm:p-8 border border-[var(--border)] bg-[var(--card-bg)]">
          <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] tracking-tight">
            Responsible Vulnerability Disclosure
          </h2>
          <p className="text-[var(--muted-foreground)]">
            HYPE PORTAL welcomes independent security researchers and ethical hackers to audit our systems and report potential vulnerabilities responsibly. If you discover a security flaw or token exposure, please contact our security desk immediately:
          </p>
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] font-mono text-xs text-[#F97316] flex items-center justify-between">
            <a
              href="mailto:ask.hypeai@gmail.com"
              className="flex items-center gap-2 hover:underline text-[#F97316]"
              title="Direct Email"
            >
              <Mail className="w-4 h-4" />
              <span>Contact Security Desk via Email</span>
            </a>
            <span className="text-[10px] text-[#CBD5E1] bg-[#1E293B] px-2 py-1 rounded">
              PGP Key Available
            </span>
          </div>
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
            &bull; Security Operations
          </div>
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hover:text-[#F97316] transition">
              Contact
            </Link>
            <Link href="/docs" className="hover:text-[#F97316] transition">
              Documentation
            </Link>
            <Link href="/privacy" className="hover:text-[#F97316] transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#F97316] transition">
              Terms of Service
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
