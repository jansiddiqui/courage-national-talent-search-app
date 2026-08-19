"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit3,
  Globe,
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
  FileCheck
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

export default function AdminTimelineManager() {
  const [editions, setEditions] = useState<CntsEdition[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [events, setEvents] = useState<CntsTimelineEvent[]>([]);
  const [activeConfig, setActiveConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Event Modal
  const [editingEvent, setEditingEvent] = useState<CntsTimelineEvent | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  
  // Preview / Confirmation Modal
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState<any>(null);

  // New Edition Modal
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
        if (data.targetEdition) {
          setSelectedYear(data.targetEdition.edition_year);
        }
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

  useEffect(() => {
    fetchTimelineData(selectedYear);
  }, [selectedYear]);

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

  // Preview & Validate before committing changes
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
        body: JSON.stringify({
          proposedEvents,
          changedEventKey: editingEvent.event_key,
          newDate: updatedEventObj.start_at
        })
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

  // Commit changes after admin review
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

  // Update Edition Lifecycle Status (Draft -> Review -> Published -> Locked)
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

  // Create New Edition
  const handleCreateEdition = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          editionYear: newYear,
          name: newName,
          templateYear: 2026
        })
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

  const getEventIcon = (key: string) => {
    switch (key) {
      case "REGISTRATION_OPEN":
      case "REGISTRATION_CLOSE":
        return <UserPlus className="w-4 h-4 text-blue-400" />;
      case "ADMIT_CARD_RELEASE":
        return <FileText className="w-4 h-4 text-amber-400" />;
      case "EXAM_LOGIN_OPEN":
        return <LogIn className="w-4 h-4 text-emerald-400" />;
      case "EXAM_START":
      case "SUB_JUNIOR_EXAM_END":
      case "JUNIOR_EXAM_END":
        return <Award className="w-4 h-4 text-purple-400" />;
      case "RESULT_COMPILATION":
        return <Activity className="w-4 h-4 text-slate-400" />;
      case "RESULT_RELEASE":
        return <Trophy className="w-4 h-4 text-amber-300" />;
      case "TALENT_PROFILE_RELEASE":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      case "CERTIFICATE_RELEASE":
        return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case "AWARDS_DATE":
        return <Award className="w-4 h-4 text-rose-400" />;
      default:
        return <Calendar className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {msg && (
        <div className={`p-4 rounded-xl flex items-center justify-between text-sm ${msg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border border-rose-500/30 text-rose-300"}`}>
          <div className="flex items-center gap-2">
            {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>{msg.text}</span>
          </div>
          <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Bar / Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">CNTS Annual Timeline Engine</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Single Source of Truth
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic database-backed calendar & operational lifecycle gates. Code defines behavior; Database defines dates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edition Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl p-1">
            {editions.map(ed => (
              <button
                key={ed.id}
                onClick={() => setSelectedYear(ed.edition_year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedYear === ed.edition_year
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                CNTS {ed.edition_year} {ed.is_current && "(Active)"}
              </button>
            ))}
          </div>

          {/* Create New Edition Button */}
          <button
            onClick={() => setShowNewEditionModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Edition</span>
          </button>
        </div>
      </div>

      {/* Edition Status & Release Control Plane */}
      {activeEditionObj && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Lifecycle State */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Edition Lifecycle</div>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                activeEditionObj.status === "PUBLISHED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                activeEditionObj.status === "REVIEW" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                activeEditionObj.status === "LOCKED" ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" :
                "bg-slate-800 text-slate-400"
              }`}>
                {activeEditionObj.status}
              </span>
              <select
                value={activeEditionObj.status}
                onChange={(e) => handleUpdateEditionStatus("status", e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="REVIEW">REVIEW</option>
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="LOCKED">LOCKED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">Only Published editions are visible publicly.</p>
          </div>

          {/* Results Gate Status */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Results Release Gate</div>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                activeEditionObj.results_status === "RELEASED" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                activeEditionObj.results_status === "READY" ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" :
                "bg-slate-800 text-slate-400"
              }`}>
                {activeEditionObj.results_status}
              </span>
              <select
                value={activeEditionObj.results_status}
                onChange={(e) => handleUpdateEditionStatus("results_status", e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="READY">READY</option>
                <option value="RELEASED">RELEASED</option>
                <option value="LOCKED">LOCKED</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">Separates scheduled date from public release.</p>
          </div>

          {/* Admit Cards Gate */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Admit Card Gate</div>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                activeEditionObj.admit_card_status === "AVAILABLE" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" :
                "bg-slate-800 text-slate-400"
              }`}>
                {activeEditionObj.admit_card_status}
              </span>
              <select
                value={activeEditionObj.admit_card_status}
                onChange={(e) => handleUpdateEditionStatus("admit_card_status", e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-lg px-2 py-1"
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="READY">READY</option>
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="LOCKED">LOCKED</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">Controls hall ticket download access.</p>
          </div>

          {/* Current Active Edition Switch */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Primary System Edition</div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                {activeEditionObj.is_current ? "Active Live Edition" : "Inactive Edition"}
              </span>
              {!activeEditionObj.is_current ? (
                <button
                  onClick={() => handleUpdateEditionStatus("is_current", true)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
                >
                  Set Active
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Live
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">Powers public homepage, register & gates.</p>
          </div>
        </div>
      )}

      {/* Operational Lifecycle Tree / Event List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Operational Milestones & Event Schedule</h2>
            <p className="text-xs text-slate-400">All dates displayed in Indian Standard Time (IST / Asia/Kolkata).</p>
          </div>
          <button
            onClick={() => fetchTimelineData(selectedYear)}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all"
            title="Refresh Timeline"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div className="space-y-3">
          {events.map((ev, idx) => {
            const startDate = new Date(ev.start_at);
            const formattedDate = startDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              timeZone: "Asia/Kolkata"
            });

            return (
              <div
                key={ev.id || idx}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    {getEventIcon(ev.event_key)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-white">{ev.title}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {ev.event_key}
                      </span>
                      {ev.is_public ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Public
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 border border-slate-700">
                          Admin Only
                        </span>
                      )}
                    </div>
                    {ev.description && (
                      <p className="text-xs text-slate-400 mt-1 max-w-2xl">{ev.description}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>{formattedDate} IST</span>
                    </div>
                    <span className="text-[11px] text-slate-500">{ev.timezone}</span>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(ev)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                    title="Edit Event Date / Timing"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">Edit Timeline Event</h3>
                <p className="text-xs text-slate-400 font-mono">{editingEvent.event_key}</p>
              </div>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Event Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Start DateTime (IST)</label>
                  <input
                    type="datetime-local"
                    value={editForm.start_at}
                    onChange={(e) => setEditForm({ ...editForm, start_at: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">End DateTime (Optional)</label>
                  <input
                    type="datetime-local"
                    value={editForm.end_at}
                    onChange={(e) => setEditForm({ ...editForm, end_at: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.is_public}
                    onChange={(e) => setEditForm({ ...editForm, is_public: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600"
                  />
                  <span>Public Visible Event</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingEvent(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateEventSave}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Safety Preview & Impact Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-bold text-white">Timeline Impact & Safety Review</h3>
              </div>
              <button onClick={() => setShowPreviewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dependency Validation Warnings/Errors */}
            {previewData.errors?.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Timeline Dependency Violations Detected:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {previewData.errors.map((err: string, i: number) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {previewData.warnings?.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Advisory Warnings:</span>
                </div>
                <ul className="list-disc pl-5 space-y-0.5">
                  {previewData.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Affected Downstream Milestones */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-300">Downstream Modules Affected:</div>
              <div className="flex flex-wrap gap-1.5">
                {previewData.affectedEvents?.map((evKey: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-400 font-mono">
                    {evKey}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                Public website countdowns, registration cutoffs, and admit card release dates will immediately synchronize with this database timestamp.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Back to Edit
              </button>
              <button
                onClick={handleCommitUpdate}
                disabled={isSaving || previewData.errors?.length > 0}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSaving ? "Publishing..." : "Confirm & Publish Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Edition Modal */}
      {showNewEditionModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Create Future CNTS Edition</h3>
              <button onClick={() => setShowNewEditionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Edition Year</label>
                <input
                  type="number"
                  value={newYear}
                  onChange={(e) => {
                    const y = parseInt(e.target.value, 10);
                    setNewYear(y);
                    setNewName(`Courage National Talent Search ${y}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Official Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px]">
                💡 The system will automatically instantiate a pre-configured template timeline shifted by {(newYear - 2026)} year(s), allowing you to adjust exact exam dates without touching source code.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setShowNewEditionModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEdition}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white"
              >
                {isSaving ? "Creating..." : "Create Edition"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
