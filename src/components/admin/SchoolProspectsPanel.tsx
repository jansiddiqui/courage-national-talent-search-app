"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  School, Search, RefreshCw, Trash2, Play, Upload, ArrowRight,
  Filter, Sparkles, ChevronRight, ArrowLeft, Globe, MapPin,
  ExternalLink, Copy, Zap, Target, BarChart3, CheckCircle2,
  Clock, AlertCircle, XCircle, PhoneCall, Mail, Users,
  ChevronDown, Loader2, StopCircle, TrendingUp, FileText, Download, Phone,
  HelpCircle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stats {
  total: number; pending: number; processing: number; completed: number;
  partial: number; failed: number; retryPending: number;
  highFit: number; readyForOutreach: number;
  contacted: number; interested: number; partnered: number;
  activeJobs?: number;
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
  const [enrichingIds, setEnrichingIds] = useState<string[]>([]);
  const [enrichingSelected, setEnrichingSelected] = useState(false);
  const [enrichingAllPending, setEnrichingAllPending] = useState(false);
  const [triggeringWorker, setTriggeringWorker] = useState(false);
  const [stoppingQueue, setStoppingQueue] = useState(false);
  const [reprocessingFailed, setReprocessingFailed] = useState(false);
  const [resettingStuck, setResettingStuck] = useState(false);
  const lastTriggerTime = useRef<number>(0);
  const [isQueueRunning, setIsQueueRunning] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── State: Edit school info ──
  const [editingSchoolInfo, setEditingSchoolInfo] = useState(false);
  const [savingSchoolInfo, setSavingSchoolInfo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBoard, setEditBoard] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editAffiliationNumber, setEditAffiliationNumber] = useState("");
  const [editSchoolType, setEditSchoolType] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editDistrict, setEditDistrict] = useState("");
  const [editState, setEditState] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPrincipalName, setEditPrincipalName] = useState("");
  const [editDirectorName, setEditDirectorName] = useState("");
  const [editAcademicCoordinatorName, setEditAcademicCoordinatorName] = useState("");
  const [editClassesOffered, setEditClassesOffered] = useState("");
  const [editMedium, setEditMedium] = useState("");
  const [editStudentStrengthEstimate, setEditStudentStrengthEstimate] = useState("");
  const [editFacilitiesComputerLab, setEditFacilitiesComputerLab] = useState(false);
  const [editFacilitiesSmartClassrooms, setEditFacilitiesSmartClassrooms] = useState(false);
  const [editFacilitiesStemFacilities, setEditFacilitiesStemFacilities] = useState(false);
  const [editFacilitiesAtalTinkeringLab, setEditFacilitiesAtalTinkeringLab] = useState(false);
  const [editPartnershipSignalsOlympiad, setEditPartnershipSignalsOlympiad] = useState(false);
  const [editPartnershipSignalsCompetitions, setEditPartnershipSignalsCompetitions] = useState(false);
  const [editPartnershipSignalsStemFocus, setEditPartnershipSignalsStemFocus] = useState(false);
  const [editPartnershipSignalsCoding, setEditPartnershipSignalsCoding] = useState(false);

  // ── State: Navigation ──
  const [view, setView] = useState<"list" | "detail" | "discover" | "contacts">("list");
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
  const [sortBy, setSortBy] = useState("score");
  const [page, setPage] = useState(1);
  const limit = 20;

  // ── State: Import ──
  const [showImporter, setShowImporter] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [exportingContacts, setExportingContacts] = useState(false);

  // ── State: Contact List view ──
  const [contacts, setContacts] = useState<any[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [contactSearch, setContactSearch] = useState("");
  const [contactStateFilter, setContactStateFilter] = useState("ALL");
  const [contactStatusFilter, setContactStatusFilter] = useState("ALL");
  const [contactTypeFilter, setContactTypeFilter] = useState<string>("ALL");
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [bulkModalType, setBulkModalType] = useState<"email" | "phone" | null>(null);
  const [bulkDelimiter, setBulkDelimiter] = useState<"comma" | "semicolon" | "newline">("comma");

  // ── State: Discovery ──
  const [discoveryScope, setDiscoveryScope] = useState<"ALL_INDIA" | "SELECTED_STATES">("ALL_INDIA");
  const [selectedDiscoveryStates, setSelectedDiscoveryStates] = useState<string[]>([]);
  const [discoveryTarget, setDiscoveryTarget] = useState(500);
  const [discovering, setDiscovering] = useState(false);
  const [activeRun, setActiveRun] = useState<DiscoveryRun | null>(null);
  const [recentRuns, setRecentRuns] = useState<DiscoveryRun[]>([]);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus | null>(null);
  const [allStates, setAllStates] = useState<string[]>(INDIA_STATES);
  const [cancellingDiscovery, setCancellingDiscovery] = useState(false);

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

  const triggerWorker = useCallback(async () => {
    setTriggeringWorker(true);
    try {
      const res = await fetch("/api/admin/jobs/trigger", { method: "POST" });
      if (!res.ok) {
        const d = await res.json();
        console.warn("[Worker Trigger]", d.message);
      }
    } catch (_) {}
    finally {
      setTriggeringWorker(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/prospects/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        if (data.stats && (data.stats.activeJobs || 0) === 0) {
          setIsQueueRunning(false);
        }
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
      if (sortBy !== "score") params.set("sortBy", sortBy);
      const res = await fetch(`/api/admin/prospects?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error("Prospects fetch failed:", err); }
    finally { setLoading(false); }
  }, [page, search, stateFilter, statusFilter, outreachFilter, minScoreFilter, sortBy]);

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

          // Prefill edit prospect info fields
          setEditName(json.prospect.name || "");
          setEditBoard(json.prospect.board || "");
          setEditWebsite(json.prospect.website || "");
          setEditAffiliationNumber(json.prospect.affiliation_number || "");
          setEditSchoolType(json.prospect.school_type || "");
          setEditCity(json.prospect.city || "");
          setEditDistrict(json.prospect.district || "");
          setEditState(json.prospect.state || "");

           const emailEv = json.evidence?.find((e: any) => e.claim_key === "email");
          setEditEmail(emailEv ? emailEv.extracted_value || "" : "");

          const phoneEv = json.evidence?.find((e: any) => e.claim_key === "phone");
          setEditPhone(phoneEv ? phoneEv.extracted_value || "" : "");

          const findClaimVal = (key: string, defaultVal: any = "") => {
            const ev = json.evidence?.find((e: any) => e.claim_key === key);
            if (!ev) return defaultVal;
            const val = ev.extracted_value;
            if (val === "true") return true;
            if (val === "false") return false;
            return val !== null && val !== undefined ? val : defaultVal;
          };

          setEditPrincipalName(findClaimVal("principal_name"));
          setEditDirectorName(findClaimVal("director_name"));
          setEditAcademicCoordinatorName(findClaimVal("academic_coordinator_name"));
          setEditClassesOffered(findClaimVal("classes_offered"));
          setEditMedium(findClaimVal("medium"));
          setEditStudentStrengthEstimate(findClaimVal("student_strength_estimate"));

          setEditFacilitiesComputerLab(findClaimVal("facilities_computer_lab", false));
          setEditFacilitiesSmartClassrooms(findClaimVal("facilities_smart_classrooms", false));
          setEditFacilitiesStemFacilities(findClaimVal("facilities_stem_facilities", false));
          setEditFacilitiesAtalTinkeringLab(findClaimVal("facilities_atal_tinkering_lab", false));

          setEditPartnershipSignalsOlympiad(findClaimVal("partnership_signals_olympiad_participation", false));
          setEditPartnershipSignalsCompetitions(findClaimVal("partnership_signals_competitions_participation", false));
          setEditPartnershipSignalsStemFocus(findClaimVal("partnership_signals_stem_focus", false));
          setEditPartnershipSignalsCoding(findClaimVal("partnership_signals_coding_curriculum", false));
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
    if (!activeRun || !["RUNNING", "PENDING"].includes(activeRun.status)) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/admin/prospects/discover/${activeRun.id}`);
        if (res.ok) {
          const data = await res.json();
          setActiveRun(data.run);
          if (data.run.status === "COMPLETED" || data.run.status === "PARTIAL" || data.run.status === "CANCELLED") {
            fetchStats();
            fetchProspects();
          }
        }
      } catch (_) {}
    }, 5000);
    return () => clearInterval(interval);
  }, [activeRun]);

  // 1. Background polling to keep stats & prospects updated automatically
  useEffect(() => {
    const isDiscoveryActive = activeRun && ["RUNNING", "PENDING"].includes(activeRun.status);
    // Set polling interval based on whether the queue or discovery is active
    const pollIntervalMs = (isQueueRunning || isDiscoveryActive) ? 4000 : 10000;

    const interval = setInterval(() => {
      if (stoppingQueue) return;
      fetchStats();
      fetchProspects();
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [fetchStats, fetchProspects, isQueueRunning, activeRun, stoppingQueue]);

  // 2. Auto-trigger background worker when active queue or discovery is running
  useEffect(() => {
    if (stoppingQueue) return;

    const isDiscoveryActive = activeRun && ["RUNNING", "PENDING"].includes(activeRun.status);
    const shouldTriggerEnrich = isQueueRunning && stats && stats.processing === 0 && (stats.activeJobs || 0) > 0;
    const shouldTriggerDiscovery = isDiscoveryActive && stats && stats.processing === 0;

    if (shouldTriggerEnrich || shouldTriggerDiscovery) {
      const now = Date.now();
      if (now - lastTriggerTime.current > 12000) {
        lastTriggerTime.current = now;
        triggerWorker();
      }
    }
  }, [stats, isQueueRunning, activeRun, stoppingQueue, triggerWorker]);
  // ─── Actions ──────────────────────────────────────────────────────────────

  const handleClearFilters = () => {
    setSearch("");
    setStateFilter("ALL");
    setStatusFilter("ALL");
    setOutreachFilter("ALL");
    setMinScoreFilter("0");
    setSortBy("score");
    setPage(1);
  };

  const fetchContacts = useCallback(async () => {
    setContactsLoading(true);
    setSelectedContactIds([]);
    try {
      const res = await fetch("/api/admin/prospects/contacts");
      const data = await res.json();
      if (res.ok && data.success) {
        setContacts(data.contacts || []);
      } else {
        showToast(data.message || "Failed to load contacts.");
      }
    } catch (_) {
      showToast("Error loading contacts.");
    } finally {
      setContactsLoading(false);
    }
  }, []);

  const handleExportContacts = (rows: any[]) => {
    setExportingContacts(true);
    try {
      const csvHeaders = ["School Name", "City", "State", "Website", "Outreach Status", "Email", "Phone", "Principal"];
      const csvRows = rows.map((c: any) => [
        `"${(c.name || "").replace(/"/g, '""')}"`,
        `"${(c.city || "").replace(/"/g, '""')}"`,
        `"${(c.state || "").replace(/"/g, '""')}"`,
        `"${(c.website || "").replace(/"/g, '""')}"`,
        `"${(c.outreach_status || "NEW").replace(/"/g, '""')}"`,
        `"${(c.email || "").replace(/"/g, '""')}"`,
        `"${(c.phone || "").replace(/"/g, '""')}"`,
        `"${(c.principal_name || "").replace(/"/g, '""')}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8,"
        + [csvHeaders.join(","), ...csvRows.map((r: any) => r.join(","))].join("\n");
      const link = document.createElement("a");
      link.setAttribute("href", encodeURI(csvContent));
      link.setAttribute("download", `cnts_school_contacts_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Exported ${rows.length} contacts as CSV!`);
    } catch (_) {
      showToast("Export failed.");
    } finally {
      setExportingContacts(false);
    }
  };

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

  const handleCancelDiscovery = async () => {
    if (!activeRun) return;
    setCancellingDiscovery(true);
    try {
      const res = await fetch(`/api/admin/prospects/discover/${activeRun.id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Discovery run cancelled.");
        // Instantly poll state to show cancelled status
        const statusRes = await fetch(`/api/admin/prospects/discover/${activeRun.id}`);
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setActiveRun(statusData.run);
        } else {
          setActiveRun(prev => prev ? { ...prev, status: "CANCELLED" } : null);
        }
        fetchStats();
        fetchProspects();
      } else {
        showToast(data.message || "Failed to cancel discovery.");
      }
    } catch (err: any) {
      showToast("Network error cancelling discovery.");
    } finally {
      setCancellingDiscovery(false);
    }
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
    setEnrichingSelected(true);
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
        setIsQueueRunning(true);
        await triggerWorker();
        fetchProspects();
      } else {
        showToast(data.message || "Failed to queue jobs.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setEnrichingSelected(false); }
  };

  const handleEnrichAllPending = async () => {
    setEnrichingAllPending(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100 }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Queued ${data.queuedJobsCount} jobs for pending schools. Triggering worker...`);
        setIsQueueRunning(true);
        await triggerWorker();
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Failed.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setEnrichingAllPending(false); }
  };

  const handleStopQueue = async () => {
    if (!confirm("Are you sure you want to stop all pending research queue jobs?")) return;
    setStoppingQueue(true);
    // Optimistically reset queue stats in client state to prevent auto-trigger race condition
    setStats(prev => prev ? { ...prev, pending: 0, processing: 0, retryPending: 0 } : null);
    try {
      const res = await fetch("/api/admin/prospects/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "STOP" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Queue stopped successfully.");
        setIsQueueRunning(false);
        await Promise.all([fetchProspects(), fetchStats()]);
      } else {
        showToast(data.message || "Failed to stop queue.");
        await fetchStats();
      }
    } catch (_) { 
      showToast("Network error stopping queue."); 
      await fetchStats();
    }
    finally { setStoppingQueue(false); }
  };

  const handleReprocessFailed = async () => {
    setReprocessingFailed(true);
    try {
      const res = await fetch("/api/admin/prospects/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REPROCESS_FAILED" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Reprocessing failed prospects started.");
        setIsQueueRunning(true);
        await triggerWorker();
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Failed to trigger reprocessing.");
      }
    } catch (_) { showToast("Network error triggering reprocessing."); }
    finally { setReprocessingFailed(false); }
  };

  const handleResetStuck = async () => {
    setResettingStuck(true);
    try {
      const res = await fetch("/api/admin/prospects/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "RESET_STUCK" })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Stuck queue jobs unlocked.");
        await triggerWorker();
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Failed to reset stuck jobs.");
      }
    } catch (_) { showToast("Network error resetting stuck jobs."); }
    finally { setResettingStuck(false); }
  };

  const handleReprocessSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      const res = await fetch("/api/admin/prospects/queue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REPROCESS_SELECTED", prospectIds: selectedIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message || "Reprocessing selected queued.");
        setSelectedIds([]);
        setIsQueueRunning(true);
        await triggerWorker();
        fetchProspects();
        fetchStats();
      } else {
        showToast(data.message || "Failed.");
      }
    } catch (_) { showToast("Network error."); }
  };

  const handleEnrichSingle = async (id: string) => {
    setEnrichingIds(prev => [...prev, id]);
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
    finally {
      setEnrichingIds(prev => prev.filter(x => x !== id));
    }
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

  const handleSaveSchoolInfo = async () => {
    if (!selectedProspectId) return;
    setSavingSchoolInfo(true);
    try {
      const res = await fetch(`/api/admin/prospects/${selectedProspectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          board: editBoard || null,
          website: editWebsite || null,
          affiliation_number: editAffiliationNumber || null,
          school_type: editSchoolType || null,
          city: editCity,
          district: editDistrict,
          state: editState,
          claims: {
            email: editEmail || null,
            phone: editPhone || null,
            principal_name: editPrincipalName || null,
            director_name: editDirectorName || null,
            academic_coordinator_name: editAcademicCoordinatorName || null,
            classes_offered: editClassesOffered || null,
            medium: editMedium || null,
            student_strength_estimate: editStudentStrengthEstimate ? Number(editStudentStrengthEstimate) : null,
            facilities_computer_lab: editFacilitiesComputerLab,
            facilities_smart_classrooms: editFacilitiesSmartClassrooms,
            facilities_stem_facilities: editFacilitiesStemFacilities,
            facilities_atal_tinkering_lab: editFacilitiesAtalTinkeringLab,
            partnership_signals_olympiad_participation: editPartnershipSignalsOlympiad,
            partnership_signals_competitions_participation: editPartnershipSignalsCompetitions,
            partnership_signals_stem_focus: editPartnershipSignalsStemFocus,
            partnership_signals_coding_curriculum: editPartnershipSignalsCoding,
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("School information updated!");
        setEditingSchoolInfo(false);
        fetchDetail(selectedProspectId);
        fetchProspects();
      } else {
        showToast(data.message || "Failed to update.");
      }
    } catch (_) { showToast("Network error."); }
    finally { setSavingSchoolInfo(false); }
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
                {activeRun.status === "RUNNING" ? <Loader2 key="active-run-spinner" size={14} className="animate-spin text-indigo-600" /> : <CheckCircle2 size={14} className="text-emerald-600" />}
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

            {["RUNNING", "PENDING"].includes(activeRun.status) && (
              <button
                onClick={handleCancelDiscovery}
                disabled={cancellingDiscovery}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {cancellingDiscovery ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                Stop / Cancel Discovery
              </button>
            )}

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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-800">{p.name}</h1>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(`"${p.name}" ${p.city || ""} ${p.state || ""} school principal email contact phone`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all flex items-center justify-center hover:scale-105 active:scale-95 shadow-xs cursor-pointer ml-1 shrink-0"
                title="Google search contact details"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.9h6.69c-.29 1.5-.1.14 1.14 2.3v1.91h1.86c1.09-1 1.7-2.48 1.7-4.14z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.1A11.97 11.97 0 0012 24z"/>
                  <path fill="#FBBC05" d="M5.27 14.29a7.18 7.18 0 010-4.58V6.61H1.29A11.98 11.98 0 000 12c0 2.27.63 4.4 1.29 5.39l3.98-3.1z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.97 11.97 0 001.29 6.61l3.98 3.1c.95-2.85 3.6-4.96 6.73-4.96z"/>
                </svg>
              </a>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{p.city}{p.district && ` · ${p.district}`} · {p.state}</p>
          </div>
          <div className="flex gap-2">
            {!editingSchoolInfo && (
              <button onClick={() => setEditingSchoolInfo(true)}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow-xs">
                <FileText size={12} className="text-slate-500" /> Edit Info
              </button>
            )}
            <button onClick={() => handleEnrichSingle(p.id)}
              disabled={enrichingIds.includes(p.id)}
              className="px-3 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {enrichingIds.includes(p.id) ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              {enrichingIds.includes(p.id) ? "Researching..." : "Research"}
            </button>
            <button onClick={() => handleDeleteProspect(p.id)}
              className="px-3 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-100 transition-all active:scale-95">
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="space-y-5">
            {/* Identity card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
              {editingSchoolInfo ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">School Name</label>
                    <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Board</label>
                      <select value={editBoard} onChange={e => setEditBoard(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500">
                        <option value="">Select Board</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE</option>
                        <option value="STATE_BOARD">State Board</option>
                        <option value="IB">IB</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Affiliation No.</label>
                      <input type="text" value={editAffiliationNumber} onChange={e => setEditAffiliationNumber(e.target.value)}
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Website</label>
                    <div className="relative flex items-center">
                      <input type="text" value={editWebsite} onChange={e => setEditWebsite(e.target.value)}
                        placeholder="e.g. www.website.com"
                        className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(`"${editName || p.name}" ${editCity || p.city || ""} official website`)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="absolute right-2.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Search official website on Google">
                        <Search size={12} />
                      </a>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Email</label>
                      <div className="relative flex items-center">
                        <input type="text" value={editEmail} onChange={e => setEditEmail(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(`"${editName || p.name}" ${editCity || p.city || ""} school email contact`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="absolute right-2.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Search email on Google">
                          <Search size={12} />
                        </a>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Phone</label>
                      <div className="relative flex items-center">
                        <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                          className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(`"${editName || p.name}" ${editCity || p.city || ""} school contact phone number`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="absolute right-2.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Search phone on Google">
                          <Search size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">City</label>
                      <input type="text" value={editCity} onChange={e => setEditCity(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">District</label>
                      <input type="text" value={editDistrict} onChange={e => setEditDistrict(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">State</label>
                      <input type="text" value={editState} onChange={e => setEditState(e.target.value)}
                        className="w-full px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>

                  {/* Administration section */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Administration</span>
                    
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Principal Name</label>
                      <div className="relative flex items-center">
                        <input type="text" value={editPrincipalName} onChange={e => setEditPrincipalName(e.target.value)}
                          placeholder="e.g. Dr. Jane Doe"
                          className="w-full pl-3 pr-8 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(`"${editName || p.name}" ${editCity || p.city || ""} school principal name`)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="absolute right-2.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="Search principal on Google">
                          <Search size={12} />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Director Name</label>
                        <input type="text" value={editDirectorName} onChange={e => setEditDirectorName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Acad. Coordinator</label>
                        <input type="text" value={editAcademicCoordinatorName} onChange={e => setEditAcademicCoordinatorName(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>
                  </div>

                  {/* Academic info section */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Academic Details</span>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Classes Offered</label>
                        <input type="text" value={editClassesOffered} onChange={e => setEditClassesOffered(e.target.value)}
                          placeholder="e.g. Nursery - XII"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Medium</label>
                        <input type="text" value={editMedium} onChange={e => setEditMedium(e.target.value)}
                          placeholder="e.g. English"
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Student Strength (Est.)</label>
                      <input type="number" value={editStudentStrengthEstimate} onChange={e => setEditStudentStrengthEstimate(e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                  </div>

                  {/* Facilities & Signals section */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Facilities & Signals</span>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600">
                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editFacilitiesComputerLab} onChange={e => setEditFacilitiesComputerLab(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Computer Lab</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editFacilitiesSmartClassrooms} onChange={e => setEditFacilitiesSmartClassrooms(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Smart Classes</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editFacilitiesStemFacilities} onChange={e => setEditFacilitiesStemFacilities(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>STEM Resources</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editFacilitiesAtalTinkeringLab} onChange={e => setEditFacilitiesAtalTinkeringLab(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Atal Tinkering Lab</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editPartnershipSignalsOlympiad} onChange={e => setEditPartnershipSignalsOlympiad(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Olympiad Part.</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editPartnershipSignalsCompetitions} onChange={e => setEditPartnershipSignalsCompetitions(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Competition Part.</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editPartnershipSignalsStemFocus} onChange={e => setEditPartnershipSignalsStemFocus(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>STEM / Tech Focus</span>
                      </label>

                      <label className="flex items-center gap-2 p-2 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors">
                        <input type="checkbox" checked={editPartnershipSignalsCoding} onChange={e => setEditPartnershipSignalsCoding(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5" />
                        <span>Coding Curriculum</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => setEditingSchoolInfo(false)}
                      className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-500 cursor-pointer">
                      Cancel
                    </button>
                    <button onClick={handleSaveSchoolInfo} disabled={savingSchoolInfo}
                      className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer">
                      {savingSchoolInfo ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                      Save Info
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 pb-1">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0"><School size={20} /></div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-800 text-sm break-words leading-snug">{p.name}</h3>
                      {p.board && <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold inline-block mt-1">{p.board}</span>}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs font-medium border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-slate-600"><MapPin size={12} className="text-slate-400 flex-shrink-0" />{p.city}, {p.state}</div>
                    {p.district && <div className="text-[10px] text-slate-400">District: {p.district}</div>}
                    {p.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-slate-400 flex-shrink-0" />
                        <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 min-w-0 truncate">
                          Visit Website <ExternalLink size={9} />
                        </a>
                      </div>
                    )}
                    {p.affiliation_number && <div className="text-[10px] text-slate-400">CBSE Aff: {p.affiliation_number}</div>}
                    {p.discovery_source && <div className="text-[10px] text-slate-400">Source: {p.discovery_source}</div>}
                    {p.error_logs && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-[11px] rounded-xl font-medium leading-snug break-words">
                        <span className="font-extrabold block text-[10px] text-rose-800 uppercase tracking-wide mb-1">Research Error Details:</span>
                        {p.error_logs}
                      </div>
                    )}
                  </div>
                </>
              )}
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
                ].map(({ label, key, max }) => {
                  const scoreVal = (breakdown && typeof breakdown[key] === "number") ? breakdown[key] : 0;
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-slate-600">
                        <span>{label}</span>
                        <span className="font-black text-slate-800">{scoreVal} / {max}</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${((scoreVal / max) * 100)}%` }} />
                      </div>
                    </div>
                  );
                })}
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
                {evidence.length > 0 ? evidence.map((ev: any, idx: number) => {
                  const displayValue = ev.extracted_value !== null && ev.extracted_value !== undefined
                    ? (typeof ev.extracted_value === "object" ? JSON.stringify(ev.extracted_value) : String(ev.extracted_value))
                    : "";
                  const isContactField = ev.claim_key.toLowerCase().includes("email") || ev.claim_key.toLowerCase().includes("phone");
                  return (
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

                      {displayValue && (
                        <div className="bg-white border border-slate-100 rounded-lg p-2.5 flex items-center justify-between gap-3 shadow-xs">
                          <div className="text-sm font-bold text-slate-800 break-all select-all">
                            {displayValue}
                          </div>
                          {isContactField && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(displayValue);
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-md text-[10px] font-bold transition-colors cursor-pointer flex-shrink-0"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                      )}

                      {ev.evidence_text && (
                        <div className="text-xs text-slate-600 leading-relaxed italic">&quot;{ev.evidence_text}&quot;</div>
                      )}

                      {ev.source_url && (
                        <div className="text-[10px] text-slate-400 flex items-center gap-1">
                          Source: {/^https?:\/\//i.test(ev.source_url) ? (
                            <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline flex items-center gap-0.5">
                              {ev.source_url.substring(0, 60)}{ev.source_url.length > 60 ? "…" : ""} <ExternalLink size={8} />
                            </a>
                          ) : (
                            <span className="text-slate-500">{ev.source_url}</span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                }) : (
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

  // ─── View: Contact List ────────────────────────────────────────────────────

  if (view === "contacts") {
    const filtered = contacts.filter(c => {
      const matchSearch = !contactSearch ||
        (c.name || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
        (c.phone || "").toLowerCase().includes(contactSearch.toLowerCase()) ||
        (c.city || "").toLowerCase().includes(contactSearch.toLowerCase());
      const matchState = contactStateFilter === "ALL" || c.state === contactStateFilter;
      const matchStatus = contactStatusFilter === "ALL" || c.outreach_status === contactStatusFilter;
      
      let matchType = true;
      if (contactTypeFilter === "HAS_EMAIL") matchType = !!c.email;
      else if (contactTypeFilter === "HAS_PHONE") matchType = !!c.phone;
      else if (contactTypeFilter === "HAS_BOTH") matchType = !!(c.email && c.phone);
      else if (contactTypeFilter === "MISSING_EMAIL") matchType = !c.email;
      else if (contactTypeFilter === "MISSING_PHONE") matchType = !c.phone;

      return matchSearch && matchState && matchStatus && matchType;
    });

    const uniqueStates = Array.from(new Set(contacts.map((c: any) => c.state).filter(Boolean))).sort() as string[];
    const withEmail = filtered.filter((c: any) => c.email);
    const withPhone = filtered.filter((c: any) => c.phone);

    const selectedEmailsCount = filtered.filter(c => selectedContactIds.includes(c.id) && c.email).length;
    const allFilteredEmailsCount = withEmail.length;
    const emailCountToUse = selectedContactIds.length > 0 ? selectedEmailsCount : allFilteredEmailsCount;

    const selectedPhonesCount = filtered.filter(c => selectedContactIds.includes(c.id) && c.phone).length;
    const allFilteredPhonesCount = withPhone.length;
    const phoneCountToUse = selectedContactIds.length > 0 ? selectedPhonesCount : allFilteredPhonesCount;

    const bulkContacts = selectedContactIds.length > 0
      ? filtered.filter(c => selectedContactIds.includes(c.id))
      : filtered;

    const extractedList = bulkContacts
      .map((c: any) => bulkModalType === "email" ? c.email : c.phone)
      .filter(Boolean) as string[];

    const formattedText = extractedList.join(
      bulkDelimiter === "comma" ? ", " :
      bulkDelimiter === "semicolon" ? "; " : "\n"
    );

    return (
      <div className="space-y-6 text-slate-800 animate-fadeIn">
        <ToastNotice toast={toast} />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setView("list")}
              className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl cursor-pointer transition-colors">
              <ArrowLeft size={15} />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
                <Users className="text-indigo-600" size={22} /> Contact List
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">All extracted contact details from enriched school prospects</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <button onClick={() => fetchContacts()}
              className="p-2.5 bg-white border border-slate-200/50 rounded-xl text-slate-500 hover:text-slate-800 cursor-pointer transition-colors"
              title="Refresh contact list">
              <RefreshCw size={14} className={contactsLoading ? "animate-spin" : ""} />
            </button>
            
            <button
              onClick={() => setBulkModalType("email")}
              disabled={emailCountToUse === 0}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Extract emails for bulk mailing"
            >
              <Mail size={13} /> {selectedContactIds.length > 0 ? `Copy Emails (${selectedEmailsCount})` : `Copy Emails (${allFilteredEmailsCount})`}
            </button>

            <button
              onClick={() => setBulkModalType("phone")}
              disabled={phoneCountToUse === 0}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Extract phone numbers for bulk messaging"
            >
              <Phone size={13} /> {selectedContactIds.length > 0 ? `Copy Phones (${selectedPhonesCount})` : `Copy Phones (${allFilteredPhonesCount})`}
            </button>

            <button
              onClick={() => handleExportContacts(selectedContactIds.length > 0 ? filtered.filter(c => selectedContactIds.includes(c.id)) : filtered)}
              disabled={exportingContacts || filtered.length === 0}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 shadow-sm transition-all disabled:opacity-50">
              <Download size={13} /> {selectedContactIds.length > 0 ? `Export Selected CSV (${selectedContactIds.length})` : `Export CSV (${filtered.length})`}
            </button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Contacts", value: filtered.length, color: "text-indigo-700", bg: "bg-indigo-50" },
            { label: "With Email", value: withEmail.length, color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "With Phone", value: withPhone.length, color: "text-blue-700", bg: "bg-blue-50" },
            { label: "Both Email & Phone", value: filtered.filter((c: any) => c.email && c.phone).length, color: "text-purple-700", bg: "bg-purple-50" },
          ].map(card => (
            <div key={card.label} className={`${card.bg} rounded-2xl p-4`}>
              <div className={`text-2xl font-black ${card.color}`}>{card.value}</div>
              <div className="text-xs text-slate-500 mt-0.5 font-medium">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
            <input
              value={contactSearch}
              onChange={e => setContactSearch(e.target.value)}
              placeholder="Search school, email, phone..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <select value={contactStateFilter} onChange={e => setContactStateFilter(e.target.value)}
            className="px-2.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
            <option value="ALL">All States</option>
            {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={contactStatusFilter} onChange={e => setContactStatusFilter(e.target.value)}
            className="px-2.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
            <option value="ALL">All Outreach</option>
            {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
          <select value={contactTypeFilter} onChange={e => setContactTypeFilter(e.target.value)}
            className="px-2.5 py-2 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
            <option value="ALL">All Contacts</option>
            <option value="HAS_EMAIL">Has Email</option>
            <option value="HAS_PHONE">Has Phone / Mobile</option>
            <option value="HAS_BOTH">Has Email & Phone</option>
            <option value="MISSING_EMAIL">Missing Email</option>
            <option value="MISSING_PHONE">Missing Phone / Mobile</option>
          </select>
          {(contactSearch || contactStateFilter !== "ALL" || contactStatusFilter !== "ALL" || contactTypeFilter !== "ALL") && (
            <button onClick={() => { setContactSearch(""); setContactStateFilter("ALL"); setContactStatusFilter("ALL"); setContactTypeFilter("ALL"); }}
              className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-xl cursor-pointer transition-colors">
              Clear
            </button>
          )}
        </div>

        {/* Bulk selection bar */}
        {selectedContactIds.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs font-semibold text-indigo-800 animate-fadeIn">
            <span className="flex items-center gap-1.5">
              <Users size={14} className="text-indigo-600 animate-pulse" />
              <span>{selectedContactIds.length} contact{selectedContactIds.length > 1 ? "s" : ""} selected out of {filtered.length}</span>
            </span>
            <button onClick={() => setSelectedContactIds([])}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-800 border border-slate-200 bg-white rounded-lg cursor-pointer transition-colors text-[10px] font-bold">
              Deselect All
            </button>
          </div>
        )}

        {/* Contact Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {contactsLoading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-indigo-400 mx-auto mb-3" size={24} />
              <p className="text-sm text-slate-400 font-medium">Loading contacts...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <Users className="mx-auto text-slate-200" size={40} />
              <p className="text-slate-400 font-medium text-sm">
                {contacts.length === 0
                  ? "No enriched contacts yet. Run research on some schools first."
                  : "No contacts match the selected filters."}
              </p>
              {contacts.length === 0 && (
                <button onClick={() => setView("list")}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
                  Go to School List →
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4 w-10">
                      <input type="checkbox"
                        checked={filtered.length > 0 && selectedContactIds.length === filtered.length}
                        onChange={() => {
                          setSelectedContactIds(selectedContactIds.length === filtered.length ? [] : filtered.map(c => c.id));
                        }}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    </th>
                    <th className="p-4">School</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Website</th>
                    <th className="p-4">Outreach</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                  {filtered.map((c: any) => (
                    <tr key={c.id} className={`hover:bg-slate-50/40 transition-colors ${selectedContactIds.includes(c.id) ? "bg-indigo-50/20" : ""}`}>
                      <td className="p-4">
                        <input type="checkbox"
                          checked={selectedContactIds.includes(c.id)}
                          onChange={() => {
                            setSelectedContactIds(prev =>
                              prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id]
                            );
                          }}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm max-w-[200px] truncate" title={c.name}>{c.name}</div>
                        {c.principal_name && (
                          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                            <Users size={9} /> {c.principal_name}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{c.city}</div>
                        <div className="text-[10px] text-slate-400">{c.state}</div>
                      </td>
                      <td className="p-4">
                        {c.email ? (
                          <div className="flex items-center gap-1.5 max-w-[200px]">
                            <Mail size={11} className="text-indigo-400 shrink-0" />
                            <span className="truncate text-slate-700" title={c.email}>{c.email}</span>
                            <button onClick={() => copyToClipboard(c.email)}
                              className="p-1 text-slate-300 hover:text-indigo-500 cursor-pointer shrink-0 transition-colors">
                              <Copy size={10} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {c.phone ? (
                          <div className="flex items-center gap-1.5">
                            <Phone size={11} className="text-emerald-400 shrink-0" />
                            <span className="text-slate-700">{c.phone}</span>
                            <button onClick={() => copyToClipboard(c.phone)}
                              className="p-1 text-slate-300 hover:text-emerald-500 cursor-pointer shrink-0 transition-colors">
                              <Copy size={10} />
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        {c.website ? (
                          <a href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-indigo-600 hover:underline max-w-[160px] truncate">
                            <Globe size={10} className="shrink-0" />
                            <span className="truncate">{c.website.replace(/^https?:\/\//, "")}</span>
                          </a>
                        ) : (
                          <span className="text-slate-300 text-[10px]">—</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${STATUS_COLORS[c.outreach_status] || "bg-slate-100 text-slate-600"}`}>
                          {(c.outreach_status || "NEW").replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => { setSelectedProspectId(c.id); setView("detail"); }}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 bg-white text-[11px] font-semibold cursor-pointer flex items-center gap-0.5 ml-auto transition-colors">
                          View <ChevronRight size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Bulk Extractor Modal */}
        {bulkModalType && mounted && createPortal(
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col transform scale-100 transition-all duration-300">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${bulkModalType === "email" ? "bg-indigo-50 text-indigo-600" : "bg-blue-50 text-blue-600"}`}>
                    {bulkModalType === "email" ? <Mail size={16} /> : <Phone size={16} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Bulk {bulkModalType === "email" ? "Email" : "Phone"} Extractor</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Extract and format contact addresses for bulk send</p>
                  </div>
                </div>
                <button onClick={() => setBulkModalType(null)}
                  className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer transition-colors">
                  <XCircle size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Stats & Scope Info */}
                <div className="flex items-center justify-between text-xs bg-slate-50 rounded-xl p-3 border border-slate-100/50">
                  <span className="font-semibold text-slate-600">
                    Source Scope: <span className="text-slate-800 font-bold">{selectedContactIds.length > 0 ? "Selected Rows" : "All Filtered"}</span>
                  </span>
                  <span className="font-bold text-indigo-700">
                    {extractedList.length} contact{extractedList.length !== 1 ? "s" : ""} found
                  </span>
                </div>

                {/* Delimiter Selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Format / Delimiter</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "comma", label: "Comma ( , )" },
                      { key: "semicolon", label: "Semicolon ( ; )" },
                      { key: "newline", label: "New Line" },
                    ].map(opt => (
                      <button
                        key={opt.key}
                        onClick={() => setBulkDelimiter(opt.key as any)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          bulkDelimiter === opt.key
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea containing formatted list */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Extracted Data</label>
                    <button onClick={() => { copyToClipboard(formattedText); }}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <Copy size={10} /> Quick Copy
                    </button>
                  </div>
                  <textarea
                    readOnly
                    value={formattedText}
                    placeholder={`No contact ${bulkModalType}s available.`}
                    className="w-full h-32 px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs font-semibold font-mono text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-300 resize-none select-all"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-100 flex gap-2.5 bg-slate-50/50">
                <button onClick={() => setBulkModalType(null)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-500 cursor-pointer transition-colors">
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(formattedText);
                    setBulkModalType(null);
                  }}
                  disabled={extractedList.length === 0}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  <Copy size={13} /> Copy & Close
                </button>
                {bulkModalType === "email" && extractedList.length > 0 && (
                  <a
                    href={`mailto:?bcc=${encodeURIComponent(extractedList.join(","))}`}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Mail size={13} /> Open Mail client (Bcc)
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  // ─── View: Main List ───────────────────────────────────────────────────────

  return (
    <div className="space-y-6 text-slate-800">
      <ToastNotice toast={toast} />

      {/* Help / Information Guide Modal */}
      {showInfoModal && mounted && createPortal(
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-[9999] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-3xl w-full overflow-hidden flex flex-col transform scale-100 transition-all duration-300 animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">School Intelligence Guide</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">How the background search process works & button definitions</p>
                </div>
              </div>
              <button onClick={() => setShowInfoModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors">
                <XCircle size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[70vh] text-xs text-slate-600 space-y-6">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-indigo-100/50 p-4 rounded-2xl border border-indigo-100 flex gap-3">
                <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                <p className="leading-relaxed text-slate-700 font-medium">
                  Welcome to the School Intelligence Engine! This dashboard automates regional school discovery, extracts verified contacts using AI, and scores schools based on fit.
                </p>
              </div>

              {/* Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Pipeline */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-indigo-600" />
                    How the Pipeline Works
                  </h4>
                  <div className="relative pl-6 space-y-4">
                    {/* Vertical timeline line */}
                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-indigo-100"></div>

                    {/* Step 1 */}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">1</div>
                      <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Search size={12} className="text-indigo-600" /> Discovery Scraper
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Searches public directories and school boards to find raw school names, boards, and locations.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">2</div>
                      <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Clock size={12} className="text-indigo-600" /> Job Queueing
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Adds school records to a background queue. Their state is initialized as <span className="font-semibold text-yellow-700">PENDING</span>.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">3</div>
                      <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-indigo-600" /> AI Scraper Worker
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        The worker searches websites, extracts contact info (emails, phones, principals), and checks school facilities.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="relative">
                      <div className="absolute -left-[23px] top-0.5 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-[8px] font-black text-white shadow-sm">4</div>
                      <h5 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Target size={12} className="text-indigo-600" /> Outreach Scoring
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Calculates an overall outreach fit score out of 100 based on verified contacts, board affiliation, and STEM resources.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Actions Guide */}
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <Filter size={14} className="text-indigo-600" />
                    Button Definitions
                  </h4>
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {/* Research All Pending */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="font-bold text-slate-800">Research All Pending</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Queues all discovered pending schools for AI research and initiates the crawl.
                      </p>
                    </div>

                    {/* Research Selected */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                        <span className="font-bold text-slate-800">Research Selected</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Queues only the rows with checked boxes for AI analysis.
                      </p>
                    </div>

                    {/* Trigger Worker */}
                    <div className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                        <span className="font-bold text-slate-800">Trigger Worker</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Wakes up the background queue processor immediately. (Critical for running locally).
                      </p>
                    </div>

                    {/* Stop Queue */}
                    <div className="p-2.5 rounded-xl border border-rose-100 bg-rose-50/20 hover:bg-rose-50/30 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span className="font-bold text-rose-800">Stop Queue</span>
                      </div>
                      <p className="text-[11px] text-rose-600 mt-1 leading-relaxed">
                        Halts the active process. Clears the pending queue and sets school statuses back to <span className="font-bold">NEW</span>.
                      </p>
                    </div>

                    {/* Reprocess Failed */}
                    <div className="p-2.5 rounded-xl border border-amber-100 bg-amber-50/20 hover:bg-amber-50/30 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span className="font-bold text-amber-800">Reprocess Failed</span>
                      </div>
                      <p className="text-[11px] text-amber-600 mt-1 leading-relaxed">
                        Resets all prospects in a <span className="font-bold">FAILED</span> or <span className="font-bold">PARTIAL</span> state to run research again.
                      </p>
                    </div>

                    {/* Reset Stuck */}
                    <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        <span className="font-bold text-slate-800">Reset Stuck</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        Unlocks and resets prospects stuck in `PROCESSING` after server or network drops.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <button onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shadow-sm active:scale-95 duration-150">
                Got It, Close Guide
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <School className="text-indigo-600" /> School Intelligence Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">Discover, research, rank, and pitch prospective school partnerships nationwide</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setView("contacts"); fetchContacts(); }}
            className="px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-100 transition-all">
            <Users size={13} /> Contact List
          </button>
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
            <Loader2 key="banner-run-spinner" size={13} className="animate-spin" />
            Discovery run in progress — {activeRun.candidates_persisted} schools saved so far...
          </div>
          <button onClick={() => setView("discover")}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer hover:bg-indigo-700">
            View Progress →
          </button>
        </div>
      )}

      {/* Active processing progress banner */}
      {stats && (stats.processing > 0 || stats.pending > 0) && (
        <div className="p-4 bg-amber-50/60 border border-amber-100/70 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-all duration-300">
          <div className="flex items-center gap-2 font-semibold text-amber-800">
            <Loader2 size={13} className="animate-spin text-amber-500" />
            <span>
              {stats.processing > 0 
                ? `Researching schools in background — ${stats.processing} active, ${stats.pending} pending...`
                : `Researching schools in background — Triggering worker for ${stats.pending} pending...`}
            </span>
          </div>
          <span className="text-[11px] font-bold text-amber-700 bg-white px-3 py-1.5 border border-amber-100 rounded-full flex items-center gap-1.5 shadow-xs flex-shrink-0">
            <span>{stats.processing + stats.pending} remaining</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-semibold">
              Est. {Math.ceil(((stats.processing + stats.pending) * 20) / 60)} mins left
            </span>
          </span>
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
            <div key={label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xl font-black block ${color}`}>{value}</span>
                {label === "Processing" && value > 0 && (
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-3 items-center w-full">
        <form onSubmit={e => { e.preventDefault(); setPage(1); fetchProspects(); }} className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-48">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search school name..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors">Search</button>
        </form>

        <div className="h-6 w-px bg-slate-200 hidden md:block" />

        <Filter size={13} className="text-slate-400" />
        <select value={stateFilter} onChange={e => { setStateFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
          <option value="ALL">All States</option>
          {availableStates.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
          <option value="ALL">All Enrichment</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="PARTIAL">Partial</option>
          <option value="FAILED">Failed</option>
        </select>
        <select value={outreachFilter} onChange={e => { setOutreachFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
          <option value="ALL">All Outreach</option>
          {OUTREACH_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
        <select value={minScoreFilter} onChange={e => { setMinScoreFilter(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
          <option value="0">All Scores</option>
          <option value="50">Score ≥ 50</option>
          <option value="70">Score ≥ 70</option>
          <option value="85">Score ≥ 85</option>
        </select>
        <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1); }}
          className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700 hover:border-slate-300 transition-colors">
          <option value="score">Sort by Fit Score</option>
          <option value="recent">Recently Enriched</option>
        </select>
      </div>

      {/* Bulk actions */}
      <div className="flex flex-wrap gap-2">
        {selectedIds.length > 0 && (
          <div className="flex-1 p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold text-indigo-800 flex-wrap">
            <span>{selectedIds.length} selected</span>
            <div className="flex gap-2">
              <button onClick={handleEnrichSelected} disabled={refreshing || enrichingSelected}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer hover:bg-indigo-700 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {enrichingSelected ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Play size={12} />
                )}
                Research
              </button>
              <button onClick={handleReprocessSelected}
                className="px-4 py-2 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95">
                <RefreshCw size={12} />
                Reprocess
              </button>
            </div>
          </div>
        )}
        {(stats?.pending || 0) > 0 && (
          <button onClick={handleEnrichAllPending} disabled={refreshing || enrichingAllPending}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-emerald-700 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {enrichingAllPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Zap size={12} />
            )}
            {enrichingAllPending ? "Enriching..." : `Research All Pending (${stats?.pending})`}
          </button>
        )}
        <button onClick={triggerWorker} disabled={triggeringWorker}
          className="px-4 py-2 bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
          {triggeringWorker ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Play size={12} />
          )}
          {triggeringWorker ? "Triggering..." : "Trigger Worker"}
        </button>

        {/* Info Guide Button */}
        <button onClick={() => setShowInfoModal(true)}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm sm:ml-auto">
          <HelpCircle size={13} className="text-indigo-500" />
          Engine Guide
        </button>

        {/* Stop Queue Button */}
        {((stats?.processing || 0) > 0 || (stats?.pending || 0) > 0) && (
          <button onClick={handleStopQueue} disabled={stoppingQueue}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-rose-700 transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50">
            {stoppingQueue ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <StopCircle size={12} />
            )}
            Stop Queue
          </button>
        )}

        {/* Reprocess Failed / Partial Button */}
        {((stats?.failed || 0) > 0 || (stats?.partial || 0) > 0) && (
          <button onClick={handleReprocessFailed} disabled={reprocessingFailed}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 shadow-sm disabled:opacity-50">
            {reprocessingFailed ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <RefreshCw size={12} />
            )}
            Reprocess Failed ({ (stats?.failed || 0) + (stats?.partial || 0) })
          </button>
        )}

        {/* Reset Stuck Button */}
        <button onClick={handleResetStuck} disabled={resettingStuck}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all duration-200 active:scale-95 disabled:opacity-50"
          title="Unlock jobs/prospects stuck in PROCESSING status for more than 5 minutes">
          {resettingStuck ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <AlertCircle size={12} className="text-slate-500" />
          )}
          Reset Stuck
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
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 ${
                          p.enrichment_status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                          p.enrichment_status === "PROCESSING" ? "bg-amber-50 text-amber-700" :
                          p.enrichment_status === "FAILED" ? "bg-rose-50 text-rose-700" :
                          p.enrichment_status === "PARTIAL" ? "bg-orange-50 text-orange-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {p.enrichment_status === "PROCESSING" && (
                            <Loader2 className="animate-spin text-amber-600" size={10} />
                          )}
                          {p.enrichment_status}
                        </span>
                        {p.error_logs && (
                          <div className="text-[9px] text-rose-500 max-w-[150px] break-words line-clamp-2 mt-0.5 leading-snug" title={p.error_logs}>
                            {p.error_logs}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${STATUS_COLORS[p.outreach_status] || "bg-slate-100 text-slate-600"}`}>
                        {(p.outreach_status || "NEW").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEnrichSingle(p.id)}
                          disabled={p.enrichment_status === "PROCESSING" || enrichingIds.includes(p.id)}
                          className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-100 bg-white transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center min-w-[26px] min-h-[26px]"
                          title="Run research">
                          {enrichingIds.includes(p.id) ? (
                            <Loader2 size={12} className="animate-spin text-indigo-600" />
                          ) : (
                            <Play size={12} />
                          )}
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
                      {stats && stats.total > 0 ? (
                        <>
                          <p className="text-slate-400 font-medium text-sm">No schools match the selected filters.</p>
                          <button onClick={handleClearFilters}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
                            Clear Filters
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="text-slate-400 font-medium text-sm">No schools yet.</p>
                          <button onClick={() => setView("discover")}
                            className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700 transition-colors">
                            Start Discovery →
                          </button>
                        </>
                      )}
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
