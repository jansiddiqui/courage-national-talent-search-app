"use client";

import { useState, useEffect, useCallback } from "react";
import {
  School, Search, RefreshCw, Trash2, Play, Upload, ArrowRight,
  Filter, Sparkles, ChevronRight, ArrowLeft, Globe, MapPin,
  ExternalLink, Copy, Zap, Target, BarChart3, CheckCircle2,
  Clock, AlertCircle, XCircle, PhoneCall, Mail, Users,
  ChevronDown, Loader2, StopCircle, TrendingUp
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total: number; pending: number; processing: number; completed: number;
  partial: number; failed: number; retryPending: number;
  highFit: number; readyForOutreach: number;
  contacted: number; interested: number; partnered: number;
}

interface DiscoveryRun {
  id: string; status: string; scope_type: string;
  target_count: number; candidates_persisted: number;
  queries_completed: number; queries_planned: number;
  geographies_completed: number; geographies_planned: number;
  raw_candidates_found: number; duplicates_removed: number;
  started_at: string; completed_at?: string;
}

interface ProviderStatus {
  tavily: boolean; google: boolean; openrouter: boolean; cronSecret: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OUTREACH_STATUSES = [
  "NEW", "READY_FOR_OUTREACH", "CONTACTED", "FOLLOW_UP_DUE",
  "REPLIED", "INTERESTED", "MEETING_SCHEDULED", "NOT_INTERESTED", "PARTNERED"
];

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-600",
  READY_FOR_OUTREACH: "bg-blue-50 text-blue-700",
  CONTACTED: "bg-amber-50 text-amber-700",
  FOLLOW_UP_DUE: "bg-orange-50 text-orange-700",
  REPLIED: "bg-purple-50 text-purple-700",
  INTERESTED: "bg-emerald-50 text-emerald-700",
  MEETING_SCHEDULED: "bg-teal-50 text-teal-700",
  NOT_INTERESTED: "bg-rose-50 text-rose-700",
  PARTNERED: "bg-green-100 text-green-800",
};

// ─── Static state list (same as INDIA_GEOGRAPHY keys in SchoolDiscoveryService) ─
// Hardcoded here so the state selector is never empty while the API is loading.
const INDIA_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
  "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
  "Odisha", "Puducherry", "Punjab", "Rajasthan", "Tamil Nadu",
  "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SchoolProspectsPanel() {
  // ── State: List view ──
  const [prospects, setProspects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Stats | null>(null);
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── State: Navigation ──
  const [view, setView] = useState<"list" | "detail" | "discover">("list");
  const [selectedProspectId, setSelectedProspectId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [activeOutreachTab, setActiveOutreachTab] = useState<"longEmail" | "shortEmail" | "whatsapp" | "callScript">("longEmail");

  // ── State: Filters ──
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [outreachFilter, setOutreachFilter] = useState("ALL");
  const [minScoreFilter, setMinScoreFilter] = useState("0");
  const [page, setPage] = useState(1);
  const limit = 20;

  // ── State: Import ──
  const [showImporter, setShowImporter] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importing, setImporting] = useState(false);

  // ── State: Discovery ──
  const [discoveryScope, setDiscoveryScope] = useState<"ALL_INDIA" | "SELECTED_STATES">("ALL_INDIA");
  const [selectedDiscoveryStates, setSelectedDiscoveryStates] = useState<string[]>([]);
  const [discoveryTarget, setDiscoveryTarget] = useState(500);
  const [discovering, setDiscovering] = useState(false);
  const [activeRun, setActiveRun] = useState<DiscoveryRun | null>(null);
  const [recentRuns, setRecentRuns] = useState<DiscoveryRun[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [allStates, setAllStates] = useState<string[]>(INDIA_STATES);

  // ── State: Outreach tracking (detail) ──
  const [editingOutreach, setEditingOutreach] = useState(false);
  const [outreachStatus, setOutreachStatus] = useState("NEW");
  const [outreachNotes, setOutreachNotes] = useState("");
  const [outreachChannel, setOutreachChannel] = useState("");
  const [nextFollowup, setNextFollowup] = useState("");
  const [savingOutreach, setSavingOutreach] = useState(false);

  // ── State: Toast ──
  const [toast, setToast] = useState("");
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // ─── Data fetchers ────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/prospects/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        if (data.states?.length > 0) setAvailableStates(data.states);
      }
    } catch (err) { console.error("Stats fetch failed:", err); }
  }, []);

  const fetchProspects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(limit));
      if (search) params.set("search", search);
      if (stateFilter !== "ALL") params.set("state", stateFilter);
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (outreachFilter !== "ALL") params.set("outreach_status", outreachFilter);
      if (minScoreFilter !== "0") params.set("minScore", minScoreFilter);
      const res = await fetch(`/api/admin/prospects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error("Prospects fetch failed:", err); }
    finally { setLoading(false); }
  }, [page, search, stateFilter, statusFilter, outreachFilter, minScoreFilter]);

  const fetchDiscoveryInfo = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/prospects/discover");
      if (res.ok) {
        const data = await res.json();
        setRecentRuns(data.runs || []);
        setProviderStatus(data.providerStatus || null);
        setAllStates(data.availableStates || []);
        // If a run is still active, track it
        const running = (data.runs || []).find((r: DiscoveryRun) =>
          r.status === "RUNNING" || r.status === "PENDING"
        );
        if (running) setActiveRun(running);
      }
    } catch (err) { console.error("Discovery info fetch failed:", err); }
  }, []);

  const fetchDetail = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/admin/prospects/${id}`);
      if (res.ok) {
        const json = await res.json();
        setDetailData(json);
        // Prefill outreach tracking fields
        if (json.prospect) {
          setOutreachStatus(json.prospect.outreach_status || "NEW");
          setOutreachNotes(json.prospect.outreach_notes || "");
          setOutreachChannel(json.prospect.outreach_channel || "");
          setNextFollowup(json.prospect.next_followup_at ? json.prospect.next_followup_at.slice(0, 10) : "");
        }
      }
    } catch (err) { console.error("Detail fetch failed:", err); }
    finally { setLoadingDetail(false); }
  }, []);

  // ─── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchStats();
    fetchDiscoveryInfo();
  }, [fetchStats, fetchDiscoveryInfo]);

  useEffect(() => {
    if (view === "list") fetchProspects();
  }, [view, fetchProspects]);

  useEffect(() => {
    if (selectedProspectId && view === "detail") fetchDetail(selectedProspectId);
  }, [selectedProspectId, view, fetchDetail]);

  // Poll active discovery run every 5 seconds
  useEffect(() => {
    if (!activeRun || activeRun.status === "COMPLETED" || activeRun.status === "FAILED") return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/prospects/discover/${activeRun.id}`);
        if (res.ok) {
          const data = await res.json();
          setActiveRun(data.run);
          if (data.run.status === "COMPLETED" || data.run.status === "PARTIAL") {
            fetchStats();
            fetchProspects();
          }
        }
      } catch (_) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeRun]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleStartDiscovery = async () => {
    setDiscovering(true);
    try {
      const body: any = { scope_type: discoveryScope, target_count: discoveryTarget };
      if (discoveryScope === "SELECTED_STATES") body.selected_states = selectedDiscoveryStates;

      const res = await fetch("/api/admin/prospects/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Discovery run started! ${data.geographiesPlanned} geographies planned, ${data.queriesPlanned} queries.`);
        setActiveRun({ id: data.runId, status: "PENDING", scope_type: discoveryScope, target_count: data.targetCount, candidates_persisted: 0, queries_completed: 0, queries_planned: data.queriesPlanned, geographies_completed: 0, geographies_planned: data.geographiesPlanned, raw_candidates_found: 0, duplicates_removed: 0, started_at: new Date().toISOString() });
        // Also trigger worker to start processing immediately
        await triggerWorker();
      } else {
        showToast(data.message || "Failed to start discovery.");
      }
    } catch (err) {
      showToast("Network error starting discovery.");
    } finally {
      setDiscovering(false);
    }
  };

  const triggerWorker = async () => {
    try {
      const res = await fetch("/api/admin/jobs/trigger", { method: "POST" });
      if (!res.ok) {
        const d = await res.json();
        console.warn("[Worker Trigger]", d.message);
      }
    } catch (_) {}
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    setImporting(true);
    try {
      const parsed = JSON.parse(importJsonText.trim());
      const res = await fetch("/api/admin/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Imported ${data.importedCount} schools. ${data.duplicatesCount?.possible || 0} possible duplicates flagged.`);
        setShowImporter(false);
        setImportJsonText("");
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Import failed.");
      }
    } catch (err: any) {
      showToast(`Invalid JSON: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleEnrichSelected = async () => {
    if (selectedIds.length === 0) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds: selectedIds }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Queued ${data.queuedJobsCount} enrichment jobs. Triggering worker...`);
        setSelectedIds([]);
        await triggerWorker();
        fetchProspects();
      } else {
        showToast(data.message || "Failed to queue jobs.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setRefreshing(false); }
  };

  const handleEnrichAllPending = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Queued ${data.queuedJobsCount} jobs for pending schools. Triggering worker...`);
        await triggerWorker();
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Failed.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setRefreshing(false); }
  };

  const handleEnrichSingle = async (id: string) => {
    try {
      const res = await fetch("/api/admin/prospects/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds: [id] }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Queued! Triggering worker...");
        await triggerWorker();
        fetchProspects();
      } else {
        showToast(data.message || "Failed.");
      }
    } catch (_) { showToast("Network error."); }
  };

  const handleDeleteProspect = async (id: string) => {
    if (!confirm("Delete this school prospect?")) return;
    try {
      await fetch(`/api/admin/prospects/${id}`, { method: "DELETE" });
      showToast("Deleted.");
      if (selectedProspectId === id) { setView("list"); setSelectedProspectId(null); }
      else { fetchProspects(); fetchStats(); }
    } catch (_) { showToast("Failed to delete."); }
  };

  const handleSaveOutreach = async () => {
    if (!selectedProspectId) return;
    setSavingOutreach(true);
    try {
      const res = await fetch(`/api/admin/prospects/${selectedProspectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outreach_status: outreachStatus,
          outreach_notes: outreachNotes,
          outreach_channel: outreachChannel,
          last_contacted_at: ["CONTACTED", "FOLLOW_UP_DUE", "REPLIED", "INTERESTED", "MEETING_SCHEDULED", "PARTNERED"].includes(outreachStatus) ? new Date().toISOString() : null,
          next_followup_at: nextFollowup ? new Date(nextFollowup).toISOString() : null,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Outreach status saved!");
        setEditingOutreach(false);
        fetchDetail(selectedProspectId);
        fetchStats();
      } else {
        showToast(data.message || "Failed to save.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setSavingOutreach(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied!");
  };

  // ─── View: Discovery Workspace ──────────────────────────────────────────────

  if (view === "discover") {
    return (
      <div className="space-y-6 text-slate-800">
        <ToastNotice toast={toast} />
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <button onClick={() => setView("list")} className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer">
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Target className="text-indigo-600" size={20} /> School Discovery Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Automatically discover real schools across India from zero data</p>
          </div>
        </div>

        {/* Provider Status */}
        {providerStatus === null ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {["Tavily Search", "Google Search", "OpenRouter AI", "CRON Secret"].map(label => (
              <div key={label} className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-xs font-semibold flex items-center gap-2 text-slate-400 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                {label}
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Tavily Search", ok: providerStatus.tavily },
              { label: "Google Search", ok: providerStatus.google },
              { label: "OpenRouter AI", ok: providerStatus.openrouter },
              { label: "CRON Secret", ok: providerStatus.cronSecret },
            ].map(({ label, ok }) => (
              <div key={label} className={`p-3 rounded-xl border text-xs font-semibold flex items-center gap-2 ${ok ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}>
                {ok ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                {label}
              </div>
            ))}
          </div>
        )}

        {/* Discovery Config */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
          <h2 className="font-bold text-slate-800 text-sm">Configure Discovery Run</h2>

          {/* Scope */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Geographic Scope</label>
            <div className="flex gap-3">
              {(["ALL_INDIA", "SELECTED_STATES"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setDiscoveryScope(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${discoveryScope === s ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
                >
                  {s === "ALL_INDIA" ? "🇮🇳 All India" : "Selected States"}
                </button>
              ))}
            </div>
          </div>

          {/* State Multi-select */}
          {discoveryScope === "SELECTED_STATES" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Select States</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-slate-200">
                {allStates.map(state => (
                  <button
                    key={state}
                    onClick={() => setSelectedDiscoveryStates(prev =>
                      prev.includes(state) ? prev.filter(s => s !== state) : [...prev, state]
                    )}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${selectedDiscoveryStates.includes(state) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300"}`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Count */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Target Schools</label>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={discoveryTarget}
                onChange={e => setDiscoveryTarget(Math.min(2000, Math.max(10, parseInt(e.target.value) || 100)))}
                className="w-32 px-3 py-2 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500"
                min={10} max={2000}
              />
              {[100, 250, 500, 1000].map(n => (
                <button key={n} onClick={() => setDiscoveryTarget(n)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${discoveryTarget === n ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "text-slate-500 border-slate-200 hover:border-indigo-200"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartDiscovery}
            disabled={discovering || (discoveryScope === "SELECTED_STATES" && selectedDiscoveryStates.length === 0) || (providerStatus !== null && !providerStatus.tavily && !providerStatus.google)}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer hover:from-indigo-700 hover:to-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            {discovering ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
            {discovering ? "Starting Discovery..." : "Start Discovery"}
          </button>

          {providerStatus !== null && !providerStatus.tavily && !providerStatus.google && (
            <p className="text-xs text-rose-600 font-semibold text-center">
              ⚠ No search provider configured. Set TAVILY_API_KEY or GOOGLE_SEARCH_API_KEY + GOOGLE_SEARCH_CX.
            </p>
          )}
        </div>

        {/* Active Run Progress */}
        {activeRun && (
          <div className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                {activeRun.status === "RUNNING" ? <Loader2 size={14} className="animate-spin text-indigo-600" /> : <CheckCircle2 size={14} className="text-emerald-600" />}
                Discovery Run — {activeRun.status}
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                activeRun.status === "RUNNING" ? "bg-amber-50 text-amber-700" :
                activeRun.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                "bg-slate-100 text-slate-600"
              }`}>{activeRun.status}</span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500 font-semibold">
                <span>Queries: {activeRun.queries_completed} / {activeRun.queries_planned}</span>
                <span>{activeRun.queries_planned > 0 ? Math.round((activeRun.queries_completed / activeRun.queries_planned) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${activeRun.queries_planned > 0 ? (activeRun.queries_completed / activeRun.queries_planned) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Geographies Done", value: `${activeRun.geographies_completed} / ${activeRun.geographies_planned}` },
                { label: "Raw Candidates", value: activeRun.raw_candidates_found },
                { label: "Duplicates Removed", value: activeRun.duplicates_removed },
                { label: "Schools Saved", value: activeRun.candidates_persisted, highlight: true },
              ].map(({ label, value, highlight }) => (
                <div key={label} className="text-center p-3 bg-slate-50 rounded-xl">
                  <div className={`text-lg font-black ${highlight ? "text-indigo-700" : "text-slate-800"}`}>{value}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {activeRun.status === "COMPLETED" && (
              <button onClick={() => { setView("list"); fetchProspects(); fetchStats(); }}
                className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-700">
                View Discovered Schools →
              </button>
            )}
          </div>
        )}

        {/* Recent Runs */}
        {recentRuns.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Recent Discovery Runs</h3>
            </div>
            <div className="divide-y divide-slate-50">
              {recentRuns.map(run => (
                <div key={run.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-700">{run.scope_type.replace("_", " ")}</span>
                    <span className="ml-2 text-slate-400">Target: {run.target_count}</span>
                    <span className="ml-2 text-slate-400">Saved: {run.candidates_persisted}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    run.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                    run.status === "RUNNING" ? "bg-amber-50 text-amber-700" :
                    run.status === "FAILED" ? "bg-rose-50 text-rose-700" :
                    "bg-slate-100 text-slate-500"
                  }`}>{run.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ─── View: School Detail ───────────────────────────────────────────────────

  if (view === "detail") {
    if (loadingDetail || !detailData) {
      return <div className="py-20 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={28} /></div>;
    }

    const { prospect: p, evidence } = detailData;
    const templates = p.outreach_templates || {};
    const breakdown = p.scoring_breakdown || {};

    return (
      <div className="space-y-6 text-slate-800">
        <ToastNotice toast={toast} />
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <button onClick={() => { setView("list"); setSelectedProspectId(null); }}
            className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer">
            <ArrowLeft size={14} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-slate-800">{p.name}</h1>
            <p className="text-xs text-slate-500 mt-0.5">{p.city}{p.district && ` · ${p.district}`} · {p.state}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleEnrichSingle(p.id)}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100">
              <Play size={12} /> Research
            </button>
            <button onClick={() => handleDeleteProspect(p.id)}
              className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Identity card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center"><School size={20} /></div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                  {p.board && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">{p.board}</span>}
                </div>
              </div>
              <div className="space-y-2 text-xs font-medium border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-slate-600"><MapPin size={12} className="text-slate-400" />{p.city}, {p.state}</div>
                {p.district && <div className="text-[10px] text-slate-400">District: {p.district}</div>}
                {p.website && (
                  <div className="flex items-center gap-2">
                    <Globe size={12} className="text-slate-400" />
                    <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                      Visit Website <ExternalLink size={9} />
                    </a>
                  </div>
                )}
                {p.affiliation_number && <div className="text-[10px] text-slate-400">CBSE Aff: {p.affiliation_number}</div>}
                {p.discovery_source && <div className="text-[10px] text-slate-400">Source: {p.discovery_source}</div>}
              </div>
            </div>

            {/* Score breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">CNTS Fit Score</h3>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-700">{p.outreach_score}</div>
                  <div className="text-[9px] text-slate-400 font-bold uppercase">/ 100 • {p.confidence_score}% conf</div>
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 h-full rounded-full" style={{ width: `${p.outreach_score}%` }} />
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold">
                {[
                  { label: "Target Classes (5–8)", key: "classesOffered", max: 20 },
                  { label: "Olympiads & Competitions", key: "olympiads", max: 20 },
                  { label: "STEM / Atal Lab", key: "stem", max: 15 },
                  { label: "Contact Details", key: "contacts", max: 15 },
                  { label: "Decision Maker", key: "decisionMaker", max: 15 },
                  { label: "Website Found", key: "digitalFootprint", max: 10 },
                  { label: "CBSE Confirmed", key: "board", max: 5 },
                ].map(({ label, key, max }) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>{label}</span>
                      <span className="font-black text-slate-800">{breakdown[key] || 0} / {max}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${((breakdown[key] || 0) / max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outreach tracking */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">Outreach Tracking</h3>
                <button onClick={() => setEditingOutreach(!editingOutreach)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                  {editingOutreach ? "Cancel" : "Edit"}
                </button>
              </div>

              {editingOutreach ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Status</label>
                    <select value={outreachStatus} onChange={e => setOutreachStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Channel</label>
                    <select value={outreachChannel} onChange={e => setOutreachChannel(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option value="">Select channel</option>
                      <option value="EMAIL">Email</option>
                      <option value="WHATSAPP">WhatsApp</option>
                      <option value="PHONE">Phone</option>
                      <option value="IN_PERSON">In Person</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Next Follow-up</label>
                    <input type="date" value={nextFollowup} onChange={e => setNextFollowup(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Notes</label>
                    <textarea value={outreachNotes} onChange={e => setOutreachNotes(e.target.value)}
                      rows={3} placeholder="Add notes about this school..."
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none" />
                  </div>
                  <button onClick={handleSaveOutreach} disabled={savingOutreach}
                    className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2">
                    {savingOutreach ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                    Save Outreach Status
                  </button>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLORS[p.outreach_status] || "bg-slate-100 text-slate-600"}`}>
                      {(p.outreach_status || "NEW").replace(/_/g, " ")}
                    </span>
                  </div>
                  {p.outreach_channel && <div className="flex justify-between text-slate-600"><span>Channel</span><span className="font-semibold">{p.outreach_channel}</span></div>}
                  {p.last_contacted_at && <div className="flex justify-between text-slate-600"><span>Last Contacted</span><span className="font-semibold">{new Date(p.last_contacted_at).toLocaleDateString()}</span></div>}
                  {p.next_followup_at && <div className="flex justify-between text-slate-600"><span>Next Follow-up</span><span className="font-semibold text-amber-600">{new Date(p.next_followup_at).toLocaleDateString()}</span></div>}
                  {p.outreach_notes && <div className="pt-2 border-t border-slate-100 text-slate-600 italic leading-relaxed">{p.outreach_notes}</div>}
                </div>
              )}
            </div>
          </div>

          {/* Right columns */}
          <div className="lg:col-span-2 space-y-5">
            {/* Evidence */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Extracted Claims & Evidence</h3>
                <p className="text-xs text-slate-500 mt-0.5">Field-level provenance from website crawling.</p>
              </div>
              <div className="space-y-3">
                {evidence.length > 0 ? evidence.map((ev: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50/60 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="font-bold text-xs uppercase tracking-wide text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {ev.claim_key.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full ${
                          ev.evidence_status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" :
                          ev.evidence_status === "INFERRED" ? "bg-amber-50 text-amber-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>{ev.evidence_status}</span>
                        <span className="text-slate-400">{ev.confidence}% conf</span>
                      </div>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed italic">&quot;{ev.evidence_text}&quot;</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      Source: <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline flex items-center gap-0.5">
                        {ev.source_url.substring(0, 60)}{ev.source_url.length > 60 ? "…" : ""} <ExternalLink size={8} />
                      </a>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                    No evidence yet. Click Research to run the AI pipeline.
                  </div>
                )}
              </div>
            </div>

            {/* Outreach templates */}
            {(templates.emailLong || templates.emailShort) && (
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Grounded Outreach Copy</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Generated from verified evidence only.</p>
                  </div>
                  <div className="flex gap-1 text-[11px] font-bold flex-wrap">
                    {[
                      { key: "longEmail", label: "Email (Long)" },
                      { key: "shortEmail", label: "Email (Short)" },
                      { key: "whatsapp", label: "WhatsApp" },
                      { key: "callScript", label: "Call Script" },
                    ].map(({ key, label }) => (
                      <button key={key}
                        onClick={() => setActiveOutreachTab(key as any)}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${activeOutreachTab === key ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-700"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative">
                  <button
                    onClick={() => {
                      const text = activeOutreachTab === "longEmail" ? templates.emailLong :
                        activeOutreachTab === "shortEmail" ? templates.emailShort :
                        activeOutreachTab === "whatsapp" ? templates.whatsappMessage :
                        templates.callOpeningScript;
                      copyToClipboard(text || "");
                    }}
                    className="absolute top-3 right-3 p-2 bg-white hover:bg-slate-50 border border-slate-200/50 rounded-xl text-slate-500 cursor-pointer shadow-sm">
                    <Copy size={13} />
                  </button>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed pt-2">
                    {activeOutreachTab === "longEmail" && (templates.emailLong || "Run research first.")}
                    {activeOutreachTab === "shortEmail" && (templates.emailShort || "Run research first.")}
                    {activeOutreachTab === "whatsapp" && (templates.whatsappMessage || "Run research first.")}
                    {activeOutreachTab === "callScript" && (templates.callOpeningScript || "Run research first.")}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── View: Main List ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6 text-slate-800">
      <ToastNotice toast={toast} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <School className="text-indigo-600" /> School Intelligence Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">Discover, research, rank, and pitch prospective school partnerships nationwide</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setView("discover")}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all">
            <Zap size={13} /> Discover Schools
          </button>
          <button onClick={() => setShowImporter(!showImporter)}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Upload size={13} /> Import
          </button>
          <button onClick={() => { fetchProspects(); fetchStats(); }}
            className="p-2.5 bg-white border border-slate-200/50 rounded-xl text-slate-500 hover:text-slate-800 cursor-pointer">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Active discovery run banner */}
      {activeRun && (activeRun.status === "RUNNING" || activeRun.status === "PENDING") && (
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-semibold text-indigo-800">
            <Loader2 size={13} className="animate-spin" />
            Discovery run in progress — {activeRun.candidates_persisted} schools saved so far...
          </div>
          <button onClick={() => setView("discover")}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer hover:bg-indigo-700">
            View Progress →
          </button>
        </div>
      )}

      {/* JSON importer */}
      {showImporter && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Manual Import (JSON)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Paste an array of school objects. Fields: name, city, state, board (optional), district (optional), affiliation_number (optional).</p>
          </div>
          <form onSubmit={handleImport} className="space-y-3">
            <textarea value={importJsonText} onChange={e => setImportJsonText(e.target.value)}
              placeholder={`[\n  { "name": "Delhi Public School", "city": "New Delhi", "state": "Delhi", "board": "CBSE" }\n]`}
              rows={5} className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <div className="flex justify-end gap-2 text-xs">
              <button type="button" onClick={() => setShowImporter(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold cursor-pointer">Cancel</button>
              <button type="submit" disabled={importing} className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer disabled:opacity-60">
                {importing ? "Importing..." : "Import"} <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards — from real stats API */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-slate-800" },
            { label: "Pending", value: stats.pending, color: "text-slate-600" },
            { label: "Processing", value: stats.processing, color: "text-amber-700" },
            { label: "Completed", value: stats.completed, color: "text-emerald-700" },
            { label: "High Fit (≥70)", value: stats.highFit, color: "text-indigo-700" },
            { label: "Contacted", value: stats.contacted, color: "text-blue-700" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
              <span className={`text-xl font-black block mt-1 ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center justify-between">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchProspects(); }} className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-56">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search school name..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer">Search</button>
        </form>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter size={13} className="text-slate-400" />
          <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">All States</option>
            {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">All Enrichment</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="PARTIAL">Partial</option>
            <option value="FAILED">Failed</option>
          </select>
          <select value={outreachFilter} onChange={e => { setOutreachFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700">
            <option value="ALL">All Outreach</option>
            {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <select value={minScoreFilter} onChange={e => { setMinScoreFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700">
            <option value="0">All Scores</option>
            <option value="50">Score ≥ 50</option>
            <option value="70">Score ≥ 70</option>
            <option value="85">Score ≥ 85</option>
          </select>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.length > 0 && (
          <div className="flex-1 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-indigo-800">
            <span>{selectedIds.length} selected</span>
            <button onClick={handleEnrichSelected} disabled={refreshing}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700">
              <Play size={12} /> Research Selected
            </button>
          </div>
        )}
        {(stats?.pending || 0) > 0 && (
          <button onClick={handleEnrichAllPending} disabled={refreshing}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 shadow-sm">
            <Zap size={12} /> Research All Pending ({stats?.pending})
          </button>
        )}
        <button onClick={triggerWorker}
          className="px-4 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 shadow-sm">
          <Play size={12} /> Trigger Worker
        </button>
      </div>

      {/* Prospects Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 w-10">
                  <input type="checkbox"
                    checked={prospects.length > 0 && selectedIds.length === prospects.length}
                    onChange={() => setSelectedIds(selectedIds.length === prospects.length ? [] : prospects.map(p => p.id))}
                    className="rounded border-slate-300 text-indigo-600" />
                </th>
                <th className="p-4">School</th>
                <th className="p-4">Location</th>
                <th className="p-4">Score</th>
                <th className="p-4">Status</th>
                <th className="p-4">Outreach</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center"><Loader2 className="animate-spin text-indigo-400 mx-auto" size={20} /></td></tr>
              ) : prospects.length > 0 ? (
                prospects.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-4">
                      <input type="checkbox" checked={selectedIds.includes(p.id)}
                        onChange={() => setSelectedIds(prev => prev.includes(p.id) ? prev.filter(i => i !== p.id) : [...prev, p.id])}
                        className="rounded border-slate-300 text-indigo-600" />
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.board || "Board unknown"} · {p.discovery_source || "Manual"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-700">{p.city}</div>
                      <div className="text-[10px] text-slate-400">{p.state}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-black text-indigo-700">{p.outreach_score}</span>
                        <span className="text-[10px] text-slate-400">({p.confidence_score}%)</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        p.enrichment_status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                        p.enrichment_status === "PROCESSING" ? "bg-amber-50 text-amber-700" :
                        p.enrichment_status === "FAILED" ? "bg-rose-50 text-rose-700" :
                        p.enrichment_status === "PARTIAL" ? "bg-orange-50 text-orange-700" :
                        "bg-slate-100 text-slate-600"
                      }`}>{p.enrichment_status}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[p.outreach_status] || "bg-slate-100 text-slate-600"}`}>
                        {(p.outreach_status || "NEW").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEnrichSingle(p.id)}
                          disabled={p.enrichment_status === "PROCESSING"}
                          className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-100 bg-white transition-all cursor-pointer disabled:opacity-40"
                          title="Run research">
                          <Play size={12} />
                        </button>
                        <button onClick={() => { setSelectedProspectId(p.id); setView("detail"); }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 bg-white text-[11px] font-semibold cursor-pointer flex items-center gap-0.5">
                          Report <ChevronRight size={12} />
                        </button>
                        <button onClick={() => handleDeleteProspect(p.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 cursor-pointer transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="space-y-3">
                      <School className="mx-auto text-slate-200" size={36} />
                      <p className="text-slate-400 font-medium text-sm">No schools yet.</p>
                      <button onClick={() => setView("discover")}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700">
                        Start Discovery →
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > limit && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page * limit >= total}
                className="px-3 py-1.5 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Toast helper component ────────────────────────────────────────────────────

function ToastNotice({ toast }: { toast: string }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2 max-w-sm">
      <Sparkles size={13} className="text-indigo-400 animate-pulse shrink-0" />
      {toast}
    </div>
  );
}
