"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit3,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Eye,
  RefreshCw,
  Save,
  X,
  FileText,
  UserPlus,
  LogIn,
  Activity,
  Trophy,
  FileCheck,
  Zap,
  ChevronRight,
  Circle,
  Database
} from "lucide-react";

interface CntsEdition {
  id: string;
  edition_year: number;
  name: string;
  slug: string;
  theme?: string;
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "LOCKED" | "COMPLETED" | "ARCHIVED";
  is_current: boolean;
  registration_status: "UPCOMING" | "OPEN" | "CLOSING_SOON" | "CLOSED";
  exam_status: "SCHEDULED" | "LOGIN_OPEN" | "IN_PROGRESS" | "COMPLETED";
  results_status: "SCHEDULED" | "READY" | "RELEASED" | "LOCKED";
  certificates_status: "SCHEDULED" | "READY" | "AVAILABLE" | "LOCKED";
  awards_status: "SCHEDULED" | "READY" | "RELEASED" | "COMPLETED";
  admit_card_status: "SCHEDULED" | "READY" | "AVAILABLE" | "LOCKED";
}

interface CntsTimelineEvent {
  id: string;
  edition_id: string;
  event_key: string;
  title: string;
  short_title?: string;
  description?: string;
  start_at: string;
  end_at?: string | null;
  timezone: string;
  event_type: "PUBLIC" | "ADMIN_ONLY" | "MILESTONE" | "EXAM_WINDOW" | "GATING";
  audience: "STUDENT" | "PARENT" | "SCHOOL" | "PARTNER" | "ADMIN" | "ALL";
  status: "UPCOMING" | "ACTIVE" | "COMPLETED" | "OVERDUE" | "DISABLED" | "READY" | "RELEASED";
  is_public: boolean;
  is_active: boolean;
  display_order: number;
  icon?: string;
}

// ─── Color accent per event key ──────────────────────────────────────────────
const EVENT_ACCENT: Record<string, { bar: string; icon: string; bg: string }> = {
  REGISTRATION_OPEN:               { bar: "bg-blue-500",    icon: "text-blue-600",    bg: "bg-blue-50"   },
  REGISTRATION_CLOSE:              { bar: "bg-rose-500",    icon: "text-rose-600",    bg: "bg-rose-50"   },
  FINAL_REGISTRATION_RECONCILIATION:{ bar: "bg-slate-400",  icon: "text-slate-500",   bg: "bg-slate-50"  },
  ADMIT_CARD_RELEASE:              { bar: "bg-amber-500",   icon: "text-amber-600",   bg: "bg-amber-50"  },
  EXAM_LOGIN_OPEN:                 { bar: "bg-teal-500",    icon: "text-teal-600",    bg: "bg-teal-50"   },
  EXAM_START:                      { bar: "bg-violet-600",  icon: "text-violet-600",  bg: "bg-violet-50" },
  SUB_JUNIOR_EXAM_END:             { bar: "bg-purple-500",  icon: "text-purple-600",  bg: "bg-purple-50" },
  JUNIOR_EXAM_END:                 { bar: "bg-purple-500",  icon: "text-purple-600",  bg: "bg-purple-50" },
  RESULT_COMPILATION:              { bar: "bg-slate-400",   icon: "text-slate-500",   bg: "bg-slate-50"  },
  RESULT_RELEASE:                  { bar: "bg-amber-500",   icon: "text-amber-600",   bg: "bg-amber-50"  },
  TALENT_PROFILE_RELEASE:          { bar: "bg-indigo-500",  icon: "text-indigo-600",  bg: "bg-indigo-50" },
  CERTIFICATE_RELEASE:             { bar: "bg-emerald-500", icon: "text-emerald-600", bg: "bg-emerald-50"},
  AWARDS_DATE:                     { bar: "bg-orange-500",  icon: "text-orange-600",  bg: "bg-orange-50" },
};

const defaultAccent = { bar: "bg-slate-300", icon: "text-slate-500", bg: "bg-slate-50" };

function getAccent(key: string) {
  return EVENT_ACCENT[key] ?? defaultAccent;
}

function getEventIcon(key: string, cls = "w-4 h-4") {
  switch (key) {
    case "REGISTRATION_OPEN":
    case "REGISTRATION_CLOSE":
      return <UserPlus className={cls} />;
    case "ADMIT_CARD_RELEASE":
      return <FileText className={cls} />;
    case "EXAM_LOGIN_OPEN":
      return <LogIn className={cls} />;
    case "EXAM_START":
    case "SUB_JUNIOR_EXAM_END":
    case "JUNIOR_EXAM_END":
      return <Award className={cls} />;
    case "RESULT_COMPILATION":
      return <Activity className={cls} />;
    case "RESULT_RELEASE":
      return <Trophy className={cls} />;
    case "TALENT_PROFILE_RELEASE":
      return <Sparkles className={cls} />;
    case "CERTIFICATE_RELEASE":
      return <FileCheck className={cls} />;
    case "AWARDS_DATE":
      return <Award className={cls} />;
    default:
      return <Calendar className={cls} />;
  }
}

// ─── Status pill styles ───────────────────────────────────────────────────────
function statusPill(status: string) {
  const map: Record<string, string> = {
    PUBLISHED:  "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    REVIEW:     "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    LOCKED:     "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
    DRAFT:      "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    RELEASED:   "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    READY:      "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
    SCHEDULED:  "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
    AVAILABLE:  "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    OPEN:       "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    CLOSED:     "bg-rose-100 text-rose-700 ring-1 ring-rose-200",
    COMPLETED:  "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
  };
  return map[status] ?? "bg-slate-100 text-slate-500";
}

// ─── Shared input style ───────────────────────────────────────────────────────
const INPUT =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400 transition-all";

const SELECT =
  "bg-white border border-slate-200 text-xs text-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400/40 cursor-pointer";

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminTimelineManager() {
  const [editions, setEditions] = useState<CntsEdition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [events, setEvents] = useState<CntsTimelineEvent[]>([]);
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [editingEvent, setEditingEvent] = useState<CntsTimelineEvent | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any>(null);

  const [showNewEditionModal, setShowNewEditionModal] = useState(false);
  const [newYear, setNewYear] = useState<number>(2027);
  const [newName, setNewName] = useState<string>("Courage National Talent Search 2027");

  const fetchTimelineData = async (year?: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/timeline${year ? `?year=${year}` : ""}`);
      const data = await res.json();
      if (data.success) {
        setEditions(data.editions || []);
        if (data.targetEdition) setSelectedYear(data.targetEdition.edition_year);
        setEvents(data.events || []);
        setActiveConfig(data.activeConfig || null);
      } else {
        setMsg({ type: "error", text: data.message || "Failed to load timeline." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error loading timeline." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchTimelineData(selectedYear); }, [selectedYear]);

  const activeEditionObj = editions.find(e => e.edition_year === selectedYear) || editions[0];

  const handleOpenEdit = (ev: CntsTimelineEvent) => {
    setEditingEvent(ev);
    setEditForm({
      title: ev.title,
      short_title: ev.short_title || "",
      description: ev.description || "",
      start_at: ev.start_at ? new Date(ev.start_at).toISOString().slice(0, 16) : "",
      end_at: ev.end_at ? new Date(ev.end_at).toISOString().slice(0, 16) : "",
      is_public: ev.is_public,
      audience: ev.audience,
      status: ev.status,
      event_type: ev.event_type
    });
  };

  const handleInitiateEventSave = async () => {
    if (!editingEvent) return;
    const updatedEventObj: CntsTimelineEvent = {
      ...editingEvent,
      title: editForm.title,
      short_title: editForm.short_title,
      description: editForm.description,
      start_at: new Date(editForm.start_at).toISOString(),
      end_at: editForm.end_at ? new Date(editForm.end_at).toISOString() : null,
      is_public: editForm.is_public,
      audience: editForm.audience,
      status: editForm.status,
      event_type: editForm.event_type
    };
    const proposedEvents = events.map(e => e.id === editingEvent.id ? updatedEventObj : e);
    try {
      const res = await fetch("/api/admin/timeline/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposedEvents, changedEventKey: editingEvent.event_key, newDate: updatedEventObj.start_at })
      });
      const previewRes = await res.json();
      setPreviewData(previewRes);
      setPendingUpdatePayload({
        action: "UPDATE_EVENT",
        eventId: editingEvent.id,
        eventUpdates: {
          title: updatedEventObj.title,
          short_title: updatedEventObj.short_title,
          description: updatedEventObj.description,
          start_at: updatedEventObj.start_at,
          end_at: updatedEventObj.end_at,
          is_public: updatedEventObj.is_public,
          audience: updatedEventObj.audience,
          status: updatedEventObj.status,
          event_type: updatedEventObj.event_type
        }
      });
      setShowPreviewModal(true);
    } catch (err: any) {
      setMsg({ type: "error", text: "Failed to validate timeline preview: " + err.message });
    }
  };

  const handleCommitUpdate = async () => {
    if (!pendingUpdatePayload) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pendingUpdatePayload)
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Timeline changes successfully committed and published!" });
        setShowPreviewModal(false);
        setEditingEvent(null);
        fetchTimelineData(selectedYear);
      } else {
        setMsg({ type: "error", text: data.message || "Failed to commit update." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message || "Network error committing update." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEditionStatus = async (field: string, value: any) => {
    if (!activeEditionObj) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_EDITION",
          editionId: activeEditionObj.id,
          editionUpdates: { [field]: value },
          reason: `Admin updated ${field} to ${value}`
        })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: `Edition ${field} updated to ${value}` });
        fetchTimelineData(selectedYear);
      } else {
        setMsg({ type: "error", text: data.message || "Failed to update edition." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateEdition = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editionYear: newYear, name: newName, templateYear: 2026 })
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: data.message });
        setShowNewEditionModal(false);
        setSelectedYear(newYear);
      } else {
        setMsg({ type: "error", text: data.message || "Failed to create edition." });
      }
    } catch (err: any) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 pb-10">

      {/* Toast */}
      {msg && (
        <div className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm shadow-sm border ${
          msg.type === "success"
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-rose-50 border-rose-200 text-rose-800"
        }`}>
          <div className="flex items-center gap-2">
            {msg.type === "success"
              ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              : <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
            <span className="font-medium">{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-700 ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── HERO HEADER ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-6 shadow-lg shadow-indigo-200">
        {/* subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.6) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Database className="w-4.5 h-4.5 text-white" />
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">CNTS Annual Timeline Engine</h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-sm border border-white/20">
                <Zap className="w-2.5 h-2.5" /> Single Source of Truth
              </span>
            </div>
            <p className="text-indigo-200 text-xs font-medium leading-relaxed max-w-lg">
              Dynamic database-backed calendar &amp; operational lifecycle gates.&nbsp;
              <span className="text-white font-semibold">Code defines behavior · Database defines dates.</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Edition Tabs */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 gap-0.5">
              {editions.map(ed => (
                <button
                  key={ed.id}
                  onClick={() => setSelectedYear(ed.edition_year)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === ed.edition_year
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  CNTS {ed.edition_year} {ed.is_current && <span className="opacity-70 font-normal">(Active)</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowNewEditionModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white text-indigo-700 hover:bg-indigo-50 shadow-md transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              New Edition
            </button>
          </div>
        </div>
      </div>

      {/* ── CONTROL CARDS ────────────────────────────────────────────────────── */}
      {activeEditionObj && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          {/* Edition Lifecycle */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Edition Lifecycle</span>
              <Lock className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold mb-3 ${statusPill(activeEditionObj.status)}`}>
              {activeEditionObj.status}
            </span>
            <select
              value={activeEditionObj.status}
              onChange={e => handleUpdateEditionStatus("status", e.target.value)}
              className={SELECT + " w-full mt-1"}
            >
              <option value="DRAFT">DRAFT</option>
              <option value="REVIEW">REVIEW</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="LOCKED">LOCKED</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">Only Published editions are visible publicly.</p>
          </div>

          {/* Results Gate */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Results Release Gate</span>
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold mb-3 ${statusPill(activeEditionObj.results_status)}`}>
              {activeEditionObj.results_status}
            </span>
            <select
              value={activeEditionObj.results_status}
              onChange={e => handleUpdateEditionStatus("results_status", e.target.value)}
              className={SELECT + " w-full mt-1"}
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="READY">READY</option>
              <option value="RELEASED">RELEASED</option>
              <option value="LOCKED">LOCKED</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">Separates scheduled date from public release.</p>
          </div>

          {/* Admit Card Gate */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Admit Card Gate</span>
              <FileText className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold mb-3 ${statusPill(activeEditionObj.admit_card_status)}`}>
              {activeEditionObj.admit_card_status}
            </span>
            <select
              value={activeEditionObj.admit_card_status}
              onChange={e => handleUpdateEditionStatus("admit_card_status", e.target.value)}
              className={SELECT + " w-full mt-1"}
            >
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="READY">READY</option>
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="LOCKED">LOCKED</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">Controls hall ticket download access.</p>
          </div>

          {/* Primary Active Edition */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Primary System Edition</span>
              {activeEditionObj.is_current
                ? <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><Circle className="w-2 h-2 fill-emerald-500 stroke-none animate-pulse" />Live</span>
                : null}
            </div>
            <div className="text-sm font-bold text-slate-800 mb-3">
              {activeEditionObj.is_current ? "Active Live Edition" : "Inactive / Draft Edition"}
            </div>
            {activeEditionObj.is_current ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Powers registration, homepage &amp; gates
              </div>
            ) : (
              <button
                onClick={() => handleUpdateEditionStatus("is_current", true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
              >
                Set as Active Edition
              </button>
            )}
            <p className="text-[11px] text-slate-400 mt-2 leading-snug">Powers public homepage, register &amp; gates.</p>
          </div>
        </div>
      )}

      {/* ── OPERATIONAL MILESTONES TABLE ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">Operational Milestones &amp; Event Schedule</h2>
            <p className="text-xs text-slate-400 mt-0.5">All dates displayed in Indian Standard Time (IST / Asia/Kolkata).</p>
          </div>
          <button
            onClick={() => fetchTimelineData(selectedYear)}
            className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-all"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Event Rows */}
        <div className="divide-y divide-slate-100">
          {events.map((ev, idx) => {
            const accent = getAccent(ev.event_key);
            const startDate = new Date(ev.start_at);
            const formattedDate = startDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              timeZone: "Asia/Kolkata"
            });
            const formattedTime = startDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
              timeZone: "Asia/Kolkata"
            });

            return (
              <div
                key={ev.id || idx}
                className="group flex flex-col md:flex-row md:items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors"
              >
                {/* Left color bar */}
                <div className={`hidden md:block w-1 h-10 rounded-full shrink-0 ${accent.bar}`} />

                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl ${accent.bg} border border-slate-200/60 flex items-center justify-center shrink-0`}>
                  {getEventIcon(ev.event_key, `w-4 h-4 ${accent.icon}`)}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{ev.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                      {ev.event_key}
                    </span>
                    {ev.is_public ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                        Public
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 border border-slate-200">
                        Admin Only
                      </span>
                    )}
                  </div>
                  {ev.description && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate max-w-2xl">{ev.description}</p>
                  )}
                </div>

                {/* Date + Action */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 justify-end text-xs font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{formattedDate}, {formattedTime} IST</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{ev.timezone}</span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                    title="Edit event date / timing"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {events.length === 0 && !isLoading && (
            <div className="px-6 py-16 text-center">
              <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">No timeline events found for CNTS {selectedYear}.</p>
              <p className="text-xs text-slate-300 mt-1">Run the database migration SQL to seed events.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── EDIT EVENT MODAL ─────────────────────────────────────────────────── */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full shadow-2xl shadow-slate-200/60 overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-base font-bold text-slate-800">Edit Timeline Event</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">{editingEvent.event_key}</p>
              </div>
              <button onClick={() => setEditingEvent(null)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Event Title</label>
                <input type="text" value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
                <textarea rows={2} value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  className={INPUT + " resize-none"} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Start Date &amp; Time (IST)</label>
                  <input type="datetime-local" value={editForm.start_at}
                    onChange={e => setEditForm({ ...editForm, start_at: e.target.value })}
                    className={INPUT + " font-mono text-xs"} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">End Date &amp; Time (Optional)</label>
                  <input type="datetime-local" value={editForm.end_at}
                    onChange={e => setEditForm({ ...editForm, end_at: e.target.value })}
                    className={INPUT + " font-mono text-xs"} />
                </div>
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={editForm.is_public}
                  onChange={e => setEditForm({ ...editForm, is_public: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400/40" />
                <span className="text-sm text-slate-700 font-medium">Publicly visible on the CNTS timeline page</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all">
                Cancel
              </button>
              <button onClick={handleInitiateEventSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 shadow-sm transition-all">
                <Eye className="w-3.5 h-3.5" />
                Preview Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SAFETY PREVIEW MODAL ─────────────────────────────────────────────── */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl shadow-slate-300/40 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Timeline Impact &amp; Safety Review</h3>
                  <p className="text-[11px] text-slate-400">Review all downstream effects before publishing.</p>
                </div>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {previewData.errors?.length > 0 && (
                <div className="flex gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <AlertTriangle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-rose-700 mb-1">Timeline Dependency Violations Detected</p>
                    <ul className="text-xs text-rose-600 list-disc pl-4 space-y-0.5">
                      {previewData.errors.map((err: string, i: number) => <li key={i}>{err}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              {previewData.warnings?.length > 0 && (
                <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-700 mb-1">Advisory Warnings</p>
                    <ul className="text-xs text-amber-600 list-disc pl-4 space-y-0.5">
                      {previewData.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}
                    </ul>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-xs font-bold text-slate-600 mb-2">Downstream Modules Affected</p>
                <div className="flex flex-wrap gap-1.5">
                  {previewData.affectedEvents?.map((evKey: string, i: number) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-50 text-[11px] text-indigo-600 border border-indigo-100 font-mono">
                      {evKey}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-snug">
                  Public website countdowns, registration cutoffs, and admit card release dates will immediately synchronize with this database timestamp.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all">
                Back to Edit
              </button>
              <button
                onClick={handleCommitUpdate}
                disabled={isSaving || previewData.errors?.length > 0}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? "Publishing..." : "Confirm & Publish Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── NEW EDITION MODAL ────────────────────────────────────────────────── */}
      {showNewEditionModal && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl shadow-slate-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Create Future CNTS Edition</h3>
                  <p className="text-[11px] text-slate-400">Auto-generates a shifted milestone template.</p>
                </div>
              </div>
              <button onClick={() => setShowNewEditionModal(false)} className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Edition Year</label>
                <input type="number" value={newYear}
                  onChange={e => { const y = parseInt(e.target.value, 10); setNewYear(y); setNewName(`Courage National Talent Search ${y}`); }}
                  className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Official Name</label>
                <input type="text" value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className={INPUT} />
              </div>

              <div className="flex gap-2.5 p-3.5 rounded-xl bg-indigo-50 border border-indigo-100">
                <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                <p className="text-xs text-indigo-700 leading-relaxed">
                  The system will automatically instantiate a pre-configured template timeline shifted by&nbsp;
                  <strong>{newYear - 2026} year(s)</strong>, letting you adjust exam dates without touching source code.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <button onClick={() => setShowNewEditionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all">
                Cancel
              </button>
              <button onClick={handleCreateEdition} disabled={isSaving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-sm transition-all">
                <Plus className="w-3.5 h-3.5" />
                {isSaving ? "Creating..." : "Create Edition"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
