"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  MessageSquare,
  Volume2,
  ChevronRight,
  ExternalLink,
  Bell,
  Megaphone,
  FileText,
  AlertTriangle,
  Info,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { fetchSystemSettings } from "@/services/supabaseService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Search } from "lucide-react";

interface Announcement {
  id: string;
  tag: string;
  tagVariant: "blue" | "amber" | "emerald" | "slate" | "red";
  icon: React.ElementType;
  title: string;
  date: string;
  content: string;
  importance: "normal" | "important" | "critical";
  actionLabel?: string;
  actionHref?: string;
  pinned?: boolean;
}

const defaultAnnouncements: Announcement[] = [
  {
    id: "ann-4",
    tag: "Important Notice",
    tagVariant: "red",
    icon: AlertTriangle,
    title: "Registration Deadline Approaching — Secure Your Slot",
    date: "10 June 2026",
    content:
      "Early registration for the CNTS 2026 Founding Edition closes soon. After the early-bird window ends, the registration fee reverts from ₹99 to ₹299. Parents are advised to complete registration at the earliest. Each registration generates a unique candidate ID that cannot be transferred.",
    importance: "critical",
    actionLabel: "Register Now",
    actionHref: "/register",
    pinned: true,
  },
  {
    id: "ann-3",
    tag: "Practice Resource",
    tagVariant: "blue",
    icon: BookOpen,
    title: "Class 5–8 Official Mock Sample Papers Released",
    date: "25 June 2026",
    content:
      "Official practice tests structured with 80 questions and a 90-minute time limit are now available for free download in the Prepare section. Candidates are advised to attempt all sets and review their logic before test week.",
    importance: "important",
    actionLabel: "Download Papers",
    actionHref: "/prepare",
  },
  {
    id: "ann-2",
    tag: "Registration Alert",
    tagVariant: "amber",
    icon: Megaphone,
    title: "Founding Edition 2026 Registrations Now Open",
    date: "15 June 2026",
    content:
      "The early registration gateway is officially operational. Parents can register candidates in Classes 5–8 from any recognized school board for a token fee of ₹99. Founding Edition registrations are capped — once slots fill, registration closes.",
    importance: "normal",
    actionLabel: "Register Now",
    actionHref: "/register",
  },
  {
    id: "ann-1",
    tag: "Policy Notice",
    tagVariant: "slate",
    icon: FileText,
    title: "Official CNTS 2026 Assessment Pattern Finalized",
    date: "10 June 2026",
    content:
      "The CNTS 2026 academic council has frozen the assessment structure. The exam will contain 80 objective questions across Quantitative Aptitude, Language Comprehension, Logical Reasoning, and Critical Thinking. There is no negative marking. Both Hindi and English mediums are supported.",
    importance: "normal",
    actionLabel: "View Exam Pattern",
    actionHref: "/prepare",
  },
];

const tagStyles: Record<string, string> = {
  blue: "bg-blue-50 text-blue-800 border-blue-150",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
  slate: "bg-slate-50 text-slate-600 border-slate-200",
  red: "bg-red-50 text-red-800 border-red-200",
};

const iconStyles: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  amber: "text-amber-600 bg-amber-50",
  emerald: "text-emerald-600 bg-emerald-50",
  slate: "text-slate-500 bg-slate-50",
  red: "text-red-600 bg-red-50",
};

const importanceStyles: Record<string, string> = {
  critical: "bg-red-600 text-white border-red-700",
  important: "bg-amber-500 text-white border-amber-600",
  normal: "bg-slate-250 text-slate-700 border-slate-300",
};

export default function AnnouncementsPage() {
  const [announcements] = useState<Announcement[]>(defaultAnnouncements);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    const loadSettings = async () => {
      try {
        const settings = await fetchSystemSettings();
        setSystemSettings(settings);
      } catch (e) {
        console.error("Failed to load settings in announcements", e);
      }
    };
    loadSettings();
    return () => clearTimeout(timer);
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
      </div>
    );
  }

  // Filter announcements based on query
  const filteredAnnouncements = announcements.filter((a) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query) ||
      a.tag.toLowerCase().includes(query) ||
      a.importance.toLowerCase().includes(query)
    );
  });

  const pinnedAnnouncements = filteredAnnouncements.filter((a) => a.pinned);
  const regularAnnouncements = filteredAnnouncements.filter((a) => !a.pinned);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero */}
      <div className="bg-slate-900 text-white pt-36 pb-16 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-40" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/15 border border-blue-500/30 text-blue-400 rounded-full text-[11px] font-bold uppercase tracking-widest mb-5">
            <Volume2 size={12} className="animate-bounce" />
            Official Notice Board
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight text-white mb-4 max-w-2xl">
            Announcements &amp; Alerts
          </h1>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
            Stay up to date with the latest verified notices about deadlines, credential issuance,
            evaluation updates, and recognition releases.
          </p>
        </div>
      </div>

      {/* Live Search Input Box */}
      <div className="max-w-4xl mx-auto px-6 mt-8 w-full shrink-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notices (e.g. deadline, mock, pattern)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-800 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-blue-800/10 focus:border-blue-700 shadow-sm text-sm"
          />
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex-1 w-full">

        {/* Pinned / urgent */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 uppercase tracking-wider">
              <Bell size={13} />
              Pinned — Action Required
            </div>
            {pinnedAnnouncements.map((ann) => {
              const Icon = ann.icon;
              return (
                <div
                  key={ann.id}
                  className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 md:p-8 shadow-sm animate-in fade-in duration-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${tagStyles[ann.tagVariant]}`}>
                        {ann.tag}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        ann.importance === "critical"
                          ? "bg-red-150 text-red-950 border-red-300"
                          : ann.importance === "important"
                          ? "bg-amber-150 text-amber-950 border-amber-300"
                          : "bg-slate-150 text-slate-950 border-slate-300"
                      }`}>
                        {ann.importance}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Calendar size={12} />
                      {ann.date}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${iconStyles[ann.tagVariant]}`}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight">
                        {ann.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">{ann.content}</p>
                      {ann.actionLabel && ann.actionHref && (
                        <div className="pt-2">
                          <Link
                            href={ann.actionHref}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-red-700 hover:text-red-600 group"
                          >
                            {ann.actionLabel}
                            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Regular notices */}
        <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Info size={13} />
          {searchQuery ? `Search Results (${filteredAnnouncements.length})` : "Latest Notices"}
        </div>

        {regularAnnouncements.length > 0 ? (
          <div className="space-y-5 mb-12">
            {regularAnnouncements.map((ann) => {
              const Icon = ann.icon;
              return (
                <div
                  key={ann.id}
                  className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-200 group animate-in fade-in duration-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg border text-[10px] font-bold uppercase tracking-wide ${tagStyles[ann.tagVariant]}`}>
                        {ann.tag}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        ann.importance === "critical"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : ann.importance === "important"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {ann.importance}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-semibold flex items-center gap-1.5">
                      <Calendar size={12} />
                      {ann.date}
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${iconStyles[ann.tagVariant]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <h3 className="font-display font-bold text-base text-slate-900 leading-tight group-hover:text-blue-900 transition-colors">
                        {ann.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed">{ann.content}</p>
                      {ann.actionLabel && ann.actionHref && (
                        <div className="pt-1">
                          <Link
                            href={ann.actionHref}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-blue-800 hover:text-blue-700 group/link"
                          >
                            {ann.actionLabel}
                            <ChevronRight size={13} className="group-hover/link:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-150 p-8 space-y-3 mb-12">
            <Bell size={40} className="text-slate-350 mx-auto" />
            <h3 className="font-display font-bold text-slate-800 text-base">No announcements found</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              We couldn&apos;t find any announcements matching &quot;{searchQuery}&quot;. Try adjusting your keywords.
            </p>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-8 md:p-10 border border-emerald-900 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
              <CheckCircle2 size={13} />
              Zero-spam, announcements only
            </div>
            <h3 className="font-display font-bold text-white text-xl">Want instant alerts?</h3>
            <p className="text-[13px] text-slate-400 max-w-sm leading-relaxed">
              Join the official CNTS parent WhatsApp broadcast channel for automatic reminders
              about admit card issuance, exam day prep, and result announcements.
            </p>
          </div>
          <Link
            href="/updates"
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-2xl transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <MessageSquare size={15} />
            Join WhatsApp Channel
            <ExternalLink size={13} />
          </Link>
        </div>

      </div>

      <Footer />
    </div>
  );
}
