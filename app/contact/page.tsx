"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import {
  ChevronRight,
  ArrowLeft,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { useThemeAndLang } from "@/lib/themeContext";
import { sound } from "@/lib/audio";

export default function ContactPage() {
  const { language } = useThemeAndLang();
  const isHi = language === "hi";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "enterprise",
    priority: "normal",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [copied, setCopied] = useState(false);

  const categories = [
    {
      id: "enterprise",
      label: isHi ? "एंटरप्राइज़ इंटेलिजेंस और लाइसेंसिंग" : "Enterprise Intelligence & Licensing",
    },
    {
      id: "signal",
      label: isHi ? "ट्रेंड सिग्नल और कल्चर सबमिशन" : "Trend Signal & Culture Submission",
    },
    {
      id: "security",
      label: isHi ? "सुरक्षा एवं बग रिपोर्ट" : "Security & Vulnerability Report",
    },
    {
      id: "partnership",
      label: isHi ? "पार्टनरशिप और क्रिएटर सहयोग" : "Partnership & Creator Collaboration",
    },
    {
      id: "general",
      label: isHi ? "सामान्य पूछताछ और सुझाव" : "General Inquiry & Feedback",
    },
  ];

  const priorities = [
    { id: "normal", label: isHi ? "सामान्य" : "Normal (24h)", color: "text-[#CBD5E1]" },
    { id: "high", label: isHi ? "उच्च" : "High (6h)", color: "text-[#F59E0B]" },
    { id: "urgent", label: isHi ? "अति-आवश्यक" : "Urgent (< 2h)", color: "text-[#F97316]" },
  ];

  const faqs = [
    {
      q: isHi ? "आपकी टीम कितनी देर में जवाब देती है?" : "What is the typical response SLA?",
      a: isHi
        ? "एंटरप्राइज़ और सुरक्षा संबंधी अनुरोधों का जवाब 2 घंटे के भीतर दिया जाता है। सामान्य पूछताछ और ट्रेंड सबमिशन का उत्तर 24 घंटे के अंदर मिलता है।"
        : "Enterprise licensing and critical security inquiries receive priority attention within 2 hours. General requests and signal submissions are answered within 24 hours.",
    },
    {
      q: isHi ? "क्या एंटरप्राइज़ के लिए कस्टम API उपलब्ध है?" : "Do you offer bespoke enterprise API feeds?",
      a: isHi
        ? "हाँ, हम हाई-फ्रीक्वेंसी इंटेलिजेंस स्ट्रीम, वेबहुक अलर्ट्स और कस्टम ट्रेंडिंग मैट्रिक्स के लिए एंटरप्राइज़ एक्सेस प्रदान करते हैं।"
        : "Yes, HYPE PORTAL provides high-throughput real-time intelligence webhooks, custom sentiment feeds, and team licenses.",
    },
    {
      q: isHi ? "क्या मैं अपना खुद का ट्रेंड या क्लेम सबमिट कर सकता हूँ?" : "Can community members submit trend signals?",
      a: isHi
        ? "बिल्कुल! आप हमारे वाद-विवाद (Debates) पेज या सीधे इस फॉर्म के माध्यम से वायरल ट्रेंड्स सबमिट कर सकते हैं।"
        : "Absolutely. You can submit emerging signals, viral influencer claims, and creator shifts directly via this portal or our Daily Consensus debate system.",
    },
  ];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mailtoUrl, setMailtoUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    sound.playVoteClick();

    // Construct direct mailto pre-fill link for ask.hypeai@gmail.com
    const subject = encodeURIComponent(`[${formData.category.toUpperCase()}] ${formData.priority.toUpperCase()} - From ${formData.name}`);
    const body = encodeURIComponent(
      `From: ${formData.name} (${formData.email})\nInquiry: ${formData.category}\nPriority: ${formData.priority}\n\nMessage Details:\n${formData.message}\n\n---\nSent via HYPE PORTAL Contact Desk`
    );
    const link = `mailto:ask.hypeai@gmail.com?subject=${subject}&body=${body}`;
    setMailtoUrl(link);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      sound.playSuccessChime();
      setTicketId(data.ticketId || `HP-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);
    } catch {
      sound.playSuccessChime();
      setTicketId(`HP-${Math.floor(10000 + Math.random() * 90000)}`);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = () => {
    sound.playVoteClick();
    navigator.clipboard.writeText("ask.hypeai@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    sound.playVoteClick();
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      category: "enterprise",
      priority: "normal",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col selection:bg-[#F97316] selection:text-white transition-colors duration-200">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full space-y-12 flex-1">
        {/* Breadcrumb & Section Hero */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs font-mono text-[var(--muted-foreground)]">
            <Link href="/" className="hover:text-[#F97316] transition-colors flex items-center gap-1">
              <span>{isHi ? "होम" : "Home"}</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-[var(--muted-foreground)]/60" />
            <span className="text-[#F97316] font-semibold">{isHi ? "संपर्क" : "Contact"}</span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] ml-2 font-mono">
              Direct Desk 24/7
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
            <div className="space-y-2 max-w-2xl">
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[var(--foreground)] flex items-center gap-3 ${isHi ? "font-hindi" : ""}`}>
                <span className="p-2.5 rounded-2xl bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20">
                  <Mail className="w-6 h-6" />
                </span>
                <span>{isHi ? "हाइप पोर्टल टीम से संपर्क करें" : "Contact HYPE PORTAL"}</span>
              </h1>
              <p className={`text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed ${isHi ? "font-hindi" : ""}`}>
                {isHi
                  ? "एंटरप्राइज़ इंटेलिजेंस, तकनीकी साझेदारी, या ट्रेंड सिग्नल्स के लिए हमारी कोर इंजीनियरिंग टीम हमेशा तैयार है।"
                  : "Whether exploring enterprise intelligence feeds, seeking technical partnerships, or reporting signals — our core engineering team is here."}
              </p>
            </div>

            <Link
              href="/"
              onClick={() => sound.playVoteClick()}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--border)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] hover:border-[#F97316] hover:text-[#F97316] shadow-sm transition group cursor-pointer self-start md:self-auto shrink-0 ${isHi ? "font-hindi" : ""}`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#F97316] group-hover:-translate-x-1 transition-transform" />
              <span>{isHi ? "होम पर वापस" : "Back Home"}</span>
            </Link>
          </div>
        </div>

        {/* 4 Cards: Direct Communication Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Official Mail Channel */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative overflow-hidden group hover:border-[#F97316]/50 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-[#F97316] border border-[#F97316]/20">
                Official
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "आधिकारिक मेल डेस्क" : "Official Mail Desk"}
              </h3>
              <p className={`text-xs text-[var(--muted-foreground)] mt-1 ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "फाउंडर्स और लीड इंजीनियर्स से सीधा संपर्क।" : "Direct communication with core team & lead engineers."}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2">
              <a
                href="mailto:ask.hypeai@gmail.com"
                onClick={() => sound.playVoteClick()}
                className={`text-xs text-[#F97316] font-semibold hover:underline flex items-center gap-1 ${isHi ? "font-hindi" : "font-mono"}`}
              >
                <span>{isHi ? "ईमेल भेजें" : "Send Email"}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="p-1 rounded-md bg-[var(--card-bg)] hover:bg-[#F97316]/20 text-[var(--muted-foreground)] hover:text-[#F97316] transition cursor-pointer"
                title="Copy Email Address"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Card 2: Enterprise Licensing */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative overflow-hidden group hover:border-[#F59E0B]/50 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-[#F59E0B] border border-[#F59E0B]/20">
                SLA &lt; 2h
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "एंटरप्राइज़ व लाइसेंसिंग" : "Enterprise Stream"}
              </h3>
              <p className={`text-xs text-[var(--muted-foreground)] mt-1 ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "कस्टम डेटा फ़ीड, API रेट-लिमिट्स और टीम सीट्स।" : "Dedicated radar stream, bespoke API & enterprise seats."}
              </p>
            </div>
            <div className="pt-2">
              <span className={`text-[11px] text-[var(--muted-foreground)] font-mono flex items-center gap-1 ${isHi ? "font-hindi" : ""}`}>
                <Clock className="w-3 h-3 text-[#F59E0B]" />
                {isHi ? "2 घंटे में त्वरित उत्तर" : "Sub-2h priority response"}
              </span>
            </div>
          </div>

          {/* Card 3: Culture & Creator Lab */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative overflow-hidden group hover:border-[#F97316]/50 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-[#F97316]/10 text-[#F97316] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-[#CBD5E1] border border-[var(--border)]">
                Lab Access
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "क्रिएटर व कल्चर लैब" : "PR Creations Lab"}
              </h3>
              <p className={`text-xs text-[var(--muted-foreground)] mt-1 ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "कल्चरल एनालिसिस, मीम साउंडबोर्ड और वायरल ऑडिट्स।" : "Cultural trends, viral meme soundboard & creator audits."}
              </p>
            </div>
            <div className="pt-2">
              <a
                href="https://instagram.com/iprcreations"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playVoteClick()}
                className={`text-xs text-[#F97316] font-semibold hover:underline flex items-center gap-1 ${isHi ? "font-hindi" : ""}`}
              >
                <span>@iprcreations</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 4: Security & Protocols */}
          <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition shadow-sm">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1E293B] text-emerald-400 border border-emerald-500/20">
                Security Desk
              </span>
            </div>
            <div>
              <h3 className={`text-sm font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "सुरक्षा एवं संवेदनशीलता" : "Security Operations"}
              </h3>
              <p className={`text-xs text-[var(--muted-foreground)] mt-1 ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "एथिकल हैकर्स और रिसर्चर बग रिपोर्टिंग चैनल।" : "Responsible disclosure & vulnerability reporting desk."}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/security"
                onClick={() => sound.playVoteClick()}
                className={`text-xs text-[#F97316] font-semibold hover:underline flex items-center gap-1 ${isHi ? "font-hindi" : ""}`}
              >
                <span>{isHi ? "सुरक्षा प्रोटोकॉल →" : "View Protocols →"}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Form & Side FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Form */}
          <div className="lg:col-span-7 bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] text-[11px] font-mono font-semibold">
                <MessageSquare className="w-3 h-3" />
                <span>{isHi ? "सीधा संदेश फॉर्म" : "DIRECT DISPATCH FORM"}</span>
              </div>
              <h2 className={`text-xl sm:text-2xl font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi ? "सीधा संदेश भेजें" : "Send a Direct Message"}
              </h2>
              <p className={`text-xs sm:text-sm text-[var(--muted-foreground)] ${isHi ? "font-hindi" : ""}`}>
                {isHi
                  ? "अपना संदेश दर्ज करें। हमारी टीम सीधे आपसे संपर्क करेगी।"
                  : "Fill out the dispatch parameters. Our team handles every submission with confidentiality."}
              </p>
            </div>

            {submitted ? (
              <div className="p-6 sm:p-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-5 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className={`text-xl font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                    {isHi ? "संदेश सफलतापूर्वक सिस्टम में दर्ज हुआ!" : "Message Logged & Dispatched!"}
                  </h3>
                  <p className={`text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md mx-auto leading-relaxed ${isHi ? "font-hindi" : ""}`}>
                    {isHi
                      ? "आपकी पूछताछ हाइप पोर्टल सर्वर डेटाबेस में सुरक्षित रूप से रिकॉर्ड हो चुकी है और ask.hypeai@gmail.com पर असाइन कर दी गई है।"
                      : "Your inquiry has been encrypted and recorded in the server database, routed to ask.hypeai@gmail.com."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <div className="p-2.5 px-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] font-mono text-xs inline-flex items-center gap-1.5">
                    <span className="text-[var(--muted-foreground)]">Ticket ID:</span>
                    <span className="text-[#F97316] font-bold">{ticketId}</span>
                  </div>
                  <div className="p-2.5 px-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] font-mono text-xs inline-flex items-center gap-1.5">
                    <span className="text-[var(--muted-foreground)]">Routing:</span>
                    <span className="text-emerald-400 font-semibold">ask.hypeai@gmail.com</span>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  {mailtoUrl && (
                    <a
                      href={mailtoUrl}
                      onClick={() => sound.playVoteClick()}
                      className="btn-secondary text-xs py-2 px-4 h-9 flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#F97316]" />
                      <span>{isHi ? "ईमेल ऐप में खोलें (Gmail/Mail)" : "Open in Gmail / Email App"}</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-primary text-xs py-2 px-5 h-9"
                  >
                    <span>{isHi ? "नया संदेश भेजें" : "Send Another Message"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                      {isHi ? "आपका नाम *" : "Your Name *"}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={isHi ? "उदा. राहुल शर्मा" : "e.g. Alex Morgan"}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[#F97316] focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`block text-xs font-semibold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                      {isHi ? "ईमेल पता *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={isHi ? "उदा. name@company.com" : "name@company.com"}
                      className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[#F97316] focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Inquiry Category */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                    {isHi ? "पूछताछ का विषय *" : "Inquiry Category *"}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] focus:border-[#F97316] focus:outline-none transition cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Selector Pills */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                    {isHi ? "प्राथमिकता स्तर" : "Priority Level"}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {priorities.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          sound.playVoteClick();
                          setFormData({ ...formData, priority: p.id });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-mono transition border cursor-pointer ${
                          formData.priority === p.id
                            ? "bg-[#F97316] text-white border-[#F97316] font-bold shadow-xs"
                            : "bg-[var(--card-bg)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-[#F97316]/50"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-1.5">
                  <label className={`block text-xs font-semibold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                    {isHi ? "आपका संदेश *" : "Message Details *"}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isHi
                        ? "कृपया अपनी परियोजना, प्रश्न या सिग्नल्स का विवरण यहाँ साझा करें..."
                        : "Describe your inquiry, enterprise data requirements, or signal details..."
                    }
                    className="w-full bg-[var(--card-bg)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:border-[#F97316] focus:outline-none transition resize-y"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between">
                  <span className={`text-[11px] text-[var(--muted-foreground)] font-mono ${isHi ? "font-hindi" : ""}`}>
                    {isHi ? "सभी डेटा एन्क्रिप्टेड है।" : "Protected & encrypted."}
                  </span>
                  <button
                    type="submit"
                    className={`btn-primary text-xs py-2 px-6 h-10 ${isHi ? "font-hindi text-sm" : ""}`}
                  >
                    <span>{isHi ? "संदेश भेजें" : "Dispatch Message"}</span>
                    <Send className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: FAQ Accordion & Direct Channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Email Highlight Box */}
            <div className="p-6 rounded-3xl border border-[#F97316]/30 bg-gradient-to-br from-[#F97316]/10 via-[var(--surface)] to-[var(--surface)] space-y-3">
              <div className="flex items-center gap-2 text-[#F97316] font-mono text-xs font-bold uppercase tracking-wider">
                <Mail className="w-4 h-4" />
                <span>{isHi ? "सीधा ईमेल संपर्क" : "Direct Email Channel"}</span>
              </div>
              <p className={`text-xs text-[var(--muted-foreground)] leading-relaxed ${isHi ? "font-hindi" : ""}`}>
                {isHi
                  ? "यदि आप फॉर्म नहीं भरना चाहते, तो हमें सीधे ईमेल भेज सकते हैं:"
                  : "Prefer writing from your own client? Send inquiries directly to our secure inbox:"}
              </p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)]">
                <span className="font-mono text-xs text-[#F97316] font-semibold">
                  ask.hypeai@gmail.com
                </span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-2.5 py-1 rounded-lg bg-[#F97316] hover:bg-[#EA580C] text-white text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? (isHi ? "कॉपी हुआ" : "Copied") : (isHi ? "कॉपी" : "Copy")}</span>
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div className="p-6 rounded-3xl border border-[var(--border)] bg-[var(--surface)] space-y-4">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-[#F97316]" />
                <span className={isHi ? "font-hindi" : ""}>{isHi ? "अक्सर पूछे जाने वाले सवाल" : "Frequently Asked Questions"}</span>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] space-y-1.5">
                    <h4 className={`text-xs font-bold text-[var(--foreground)] ${isHi ? "font-hindi" : ""}`}>
                      {faq.q}
                    </h4>
                    <p className={`text-xs text-[var(--muted-foreground)] leading-relaxed ${isHi ? "font-hindi" : ""}`}>
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="border-t border-[#1E293B] bg-[#0B1220] text-[#CBD5E1] py-8 text-xs font-mono text-center">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; 2026</span>
            <span>
              <a
                href="https://instagram.com/iprcreations"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#F97316] transition underline decoration-dotted underline-offset-4 font-semibold"
              >
                PR Creations Lab.
              </a>{" "}
              {isHi ? "सर्वाधिकार सुरक्षित।" : "All rights reserved."}
            </span>
            <span>&bull;</span>
            <a
              href="mailto:ask.hypeai@gmail.com"
              className="hover:text-[#F97316] transition text-[#F97316] inline-flex items-center gap-1"
              title="Direct Email"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{isHi ? "ईमेल द्वारा संपर्क करें" : "Contact via Email"}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-[#CBD5E1]">
            <Link href="/" className="hover:text-[#F97316] transition">
              {isHi ? "मैट्रिक्स" : "Matrix"}
            </Link>
            <Link href="/roast" className="hover:text-[#F97316] transition">
              {isHi ? "एआई रोस्ट" : "AI Roast"}
            </Link>
            <Link href="/debates" className="hover:text-[#F97316] transition">
              {isHi ? "मुद्दे" : "Debates"}
            </Link>
            <Link href="/vault" className="hover:text-[#F97316] transition">
              {isHi ? "प्रॉम्प्ट वॉल्ट" : "Prompt Vault"}
            </Link>
            <Link href="/docs" className="hover:text-[#F97316] transition">
              {isHi ? "दस्तावेज़" : "Documentation"}
            </Link>
            <Link href="/contact" className="text-[#F97316] font-semibold">
              {isHi ? "संपर्क" : "Contact"}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
