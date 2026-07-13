"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { fetchRegistrations, fetchSystemSettings } from "@/services/supabaseService";
import { hasSupabaseConfig } from "@/lib/supabaseClient";
import { TIMELINE_LABELS } from "@/config/timeline";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Candidate {
  id: string;
  registration_id: string;
  student_name: string;
  dob: string;
  student_class: string;
  school_name: string;
  school_city: string;
  state: string;
  district: string;
  language: string;
  payment_status: string;
  payment_id: string | null;
  created_at: string;
  parent_name?: string;
  mobile_number?: string;
  whatsapp_number?: string;
  parent_email?: string;
  total_referrals?: number;
  photo_url?: string | null;
  registration_status?: string;
  mobile_verified?: boolean;
  referral_code?: string;
}

export interface ActivityItem {
  id: string;
  type: "registration" | "payment" | "download" | "academy" | "login" | "system" | "verification";
  title: string;
  description?: string;
  candidateId?: string;
  candidateName?: string;
  timestamp: string;
  link?: string;
}

export interface PortalNotification {
  id: string;
  type: "exam_reminder" | "payment" | "result" | "certificate" | "announcement" | "admit_card" | "general";
  title: string;
  body: string;
  read: boolean;
  timestamp: string;
  actionLabel?: string;
  actionLink?: string;
}

export interface PortalPreferences {
  sidebarCollapsed: boolean;
  lastSelectedChildId: string | null;
  mostVisitedModules: string[];
  notificationFilters: string[];
  preferredLanguage: string;
  notificationsWhatsApp: boolean;
  notificationsEmail: boolean;
  examReminders: boolean;
  recentDownloads: { id: string; name: string; type: string; date: string }[];
}

export interface PortalHealth {
  registration: boolean;
  photo: boolean;
  payment: boolean;
  mobileVerified: boolean;
  practiceStarted: boolean;
  score: number;
  label: "Excellent" | "Good" | "Needs Attention" | "Incomplete";
}

export interface PortalContextType {
  parentSession: any;
  isHydrated: boolean;
  candidates: Candidate[];
  activeCandidate: Candidate | null;
  systemSettings: Record<string, string>;
  loading: boolean;
  isDemoMode: boolean;
  activeProgress: any;
  setActiveChild: (candidate: Candidate) => void;
  activityFeed: ActivityItem[];
  addActivity: (item: Omit<ActivityItem, "id">) => void;
  notifications: PortalNotification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  preferences: PortalPreferences;
  updatePreference: <K extends keyof PortalPreferences>(key: K, value: PortalPreferences[K]) => void;
  getPortalHealth: (candidate: Candidate) => PortalHealth;
  handleLogout: () => void;
  trackModuleVisit: (moduleName: string) => void;
  addRecentDownload: (download: { id: string; name: string; type: string }) => void;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_PREFERENCES: PortalPreferences = {
  sidebarCollapsed: false,
  lastSelectedChildId: null,
  mostVisitedModules: [],
  notificationFilters: [],
  preferredLanguage: "English",
  notificationsWhatsApp: true,
  notificationsEmail: true,
  examReminders: true,
  recentDownloads: [],
};

const MOCK_CANDIDATE: Candidate = {
  id: "demo-1",
  registration_id: "CNTS26-8XK4P",
  student_name: "Aditya Verma",
  dob: "2013-05-14",
  student_class: "7",
  school_name: "Delhi Public School",
  school_city: "Kanpur",
  state: "Uttar Pradesh",
  district: "Kanpur Nagar",
  language: "English",
  payment_status: "PAID",
  payment_id: "pay_mock_123456",
  created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  parent_name: "Jan Siddiqui",
  total_referrals: 2,
  registration_status: "REGISTERED",
  mobile_verified: true,
  referral_code: "CNTS26-8XK4P",
};

function buildDefaultNotifications(settings: Record<string, string>): PortalNotification[] {
  const notifs: PortalNotification[] = [
    {
      id: "notif-1",
      type: "exam_reminder",
      title: "Exam Date Confirmed",
      body: `Your child's assessment is scheduled for ${TIMELINE_LABELS.EXAM_DATE}. Ensure device and internet are ready.`,
      read: false,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      actionLabel: "View Timeline",
      actionLink: "/dashboard/timeline",
    },
    {
      id: "notif-2",
      type: "payment",
      title: "Payment Successful",
      body: "Your registration payment has been confirmed. Candidate ID is now active.",
      read: true,
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      actionLabel: "Download Receipt",
      actionLink: "/dashboard/payments",
    },
    {
      id: "notif-3",
      type: "announcement",
      title: "Admit Cards Release",
      body: `Admit cards will be available from ${TIMELINE_LABELS.ADMIT_CARD_RELEASE}. You will be notified via WhatsApp.`,
      read: false,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      actionLabel: "View Documents",
      actionLink: "/dashboard/documents",
    },
  ];
  if (settings.result_status === "RELEASED") {
    notifs.unshift({
      id: "notif-result",
      type: "result",
      title: "Talent Report Available",
      body: "Your child's talent profile and results are now available for viewing.",
      read: false,
      timestamp: new Date().toISOString(),
      actionLabel: "View Report",
      actionLink: "/dashboard/reports",
    });
  }
  return notifs;
}

function buildDefaultActivity(candidate: Candidate): ActivityItem[] {
  return [
    {
      id: "act-1",
      type: "registration",
      title: "Registration Submitted",
      description: `${candidate.student_name} enrolled for CNTS 2026 Founding Edition`,
      candidateId: candidate.id,
      candidateName: candidate.student_name,
      timestamp: candidate.created_at,
    },
    {
      id: "act-2",
      type: "payment",
      title: "Payment Successful",
      description: `Registration fee paid. Candidate ID ${candidate.registration_id} activated.`,
      candidateId: candidate.id,
      candidateName: candidate.student_name,
      timestamp: new Date(new Date(candidate.created_at).getTime() + 2 * 60 * 1000).toISOString(),
      link: "/dashboard/payments",
    },
    {
      id: "act-3",
      type: "login",
      title: "Portal Access",
      description: "Parent workspace session started",
      timestamp: new Date().toISOString(),
    },
  ];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const PortalContext = createContext<PortalContextType | null>(null);

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used inside PortalProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function PortalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);
  const [parentSession, setParentSession] = useState<any>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidateState] = useState<Candidate | null>(null);
  const [activeProgress, setActiveProgress] = useState<any>(null);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [preferences, setPreferences] = useState<PortalPreferences>(DEFAULT_PREFERENCES);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<PortalNotification[]>([]);

  // Load progress when active candidate changes
  useEffect(() => {
    if (!activeCandidate) {
      setActiveProgress(null);
      return;
    }
    const fetchProgress = async () => {
      try {
        const targetId = activeCandidate.registration_id;
        const res = await fetch(`/api/student/progress?cntsId=${targetId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.progress) {
            setActiveProgress(data.progress);
            return;
          }
        }
      } catch (err) {
        console.error("[PortalContext] Failed to load student progress:", err);
      }
      setActiveProgress(null);
    };
    fetchProgress();
  }, [activeCandidate]);

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cnts_portal_preferences");
      if (saved) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(saved) });
    } catch {
      // ignore
    }
  }, []);

  // Auth gate
  useEffect(() => {
    const check = async () => {
      try {
        const { authService } = await import("@/services/authService");
        const session = await authService.checkSession();
        if (!session.isAuthenticated) {
          router.push("/login");
          return;
        }
        setParentSession(session);
      } catch {
        router.push("/login");
      } finally {
        setIsHydrated(true);
      }
    };
    check();
  }, [router]);

  // Load data
  useEffect(() => {
    if (!isHydrated || !parentSession) return;
    const load = async () => {
      setLoading(true);
      try {
        const settings = await fetchSystemSettings();
        setSystemSettings(settings);

        const dbData = await fetchRegistrations();
        const loginPhone = parentSession.phoneNumber;
        const loginUserId = parentSession.userId;
        const filtered = dbData.filter(
          (reg: any) =>
            (loginUserId && reg.user_id === loginUserId) ||
            reg.mobile_number === loginPhone ||
            reg.whatsapp_number === loginPhone
        );

        let candidateList: Candidate[];
        if (!hasSupabaseConfig || dbData.length === 0 || filtered.length === 0) {
          setIsDemoMode(true);
          candidateList = [MOCK_CANDIDATE];
        } else {
          setIsDemoMode(false);
          candidateList = filtered;
        }

        setCandidates(candidateList);

        const userKey = loginUserId || loginPhone || "guest";

        // Restore last selected child
        const savedPref = localStorage.getItem("cnts_portal_preferences");
        const prefs: PortalPreferences = savedPref
          ? { ...DEFAULT_PREFERENCES, ...JSON.parse(savedPref) }
          : DEFAULT_PREFERENCES;
        const lastChild = prefs.lastSelectedChildId
          ? candidateList.find((c) => c.id === prefs.lastSelectedChildId)
          : null;
        const initial = lastChild || candidateList[0] || null;
        setActiveCandidateState(initial);
        if (initial) {
          try {
            localStorage.setItem("cnts_active_candidate_id", initial.registration_id);
          } catch { /* ignore */ }
        }

        // Build activity
        if (initial) {
          const savedActivity = localStorage.getItem(`cnts_activity_${userKey}`);
          if (savedActivity) {
            try { setActivityFeed(JSON.parse(savedActivity)); } catch { setActivityFeed(buildDefaultActivity(initial)); }
          } else {
            setActivityFeed(buildDefaultActivity(initial));
          }
        }

        // Build notifications
        const savedNotifs = localStorage.getItem(`cnts_notifications_${userKey}`);
        if (savedNotifs) {
          try { setNotifications(JSON.parse(savedNotifs)); } catch { setNotifications(buildDefaultNotifications(settings)); }
        } else {
          setNotifications(buildDefaultNotifications(settings));
        }
      } catch (err) {
        console.error("Portal data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isHydrated, parentSession]);

  const getUserKey = useCallback(() =>
    parentSession?.userId || parentSession?.phoneNumber || "guest",
    [parentSession]
  );

  const setActiveChild = useCallback((candidate: Candidate) => {
    setActiveCandidateState(candidate);
    try {
      localStorage.setItem("cnts_active_candidate_id", candidate.registration_id);
    } catch { /* ignore */ }
    setPreferences((prev) => {
      const updated = { ...prev, lastSelectedChildId: candidate.id };
      try { localStorage.setItem("cnts_portal_preferences", JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const addActivity = useCallback((item: Omit<ActivityItem, "id">) => {
    const newItem: ActivityItem = { ...item, id: `act-${Date.now()}` };
    setActivityFeed((prev) => {
      const updated = [newItem, ...prev].slice(0, 50);
      try { localStorage.setItem(`cnts_activity_${getUserKey()}`, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, [getUserKey]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      try { localStorage.setItem(`cnts_notifications_${getUserKey()}`, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, [getUserKey]);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      try { localStorage.setItem(`cnts_notifications_${getUserKey()}`, JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, [getUserKey]);

  const updatePreference = useCallback(<K extends keyof PortalPreferences>(key: K, value: PortalPreferences[K]) => {
    setPreferences((prev) => {
      const updated = { ...prev, [key]: value };
      try { localStorage.setItem("cnts_portal_preferences", JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const trackModuleVisit = useCallback((moduleName: string) => {
    setPreferences((prev) => {
      const visited = [moduleName, ...prev.mostVisitedModules.filter((m) => m !== moduleName)].slice(0, 10);
      const updated = { ...prev, mostVisitedModules: visited };
      try { localStorage.setItem("cnts_portal_preferences", JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, []);

  const addRecentDownload = useCallback((download: { id: string; name: string; type: string }) => {
    const entry = { ...download, date: new Date().toISOString() };
    addActivity({ type: "download", title: `Downloaded ${download.name}`, description: download.type, timestamp: new Date().toISOString() });
    setPreferences((prev) => {
      const updated = { ...prev, recentDownloads: [entry, ...(prev.recentDownloads || []).slice(0, 9)] };
      try { localStorage.setItem("cnts_portal_preferences", JSON.stringify(updated)); } catch { /* ignore */ }
      return updated;
    });
  }, [addActivity]);

  const getPortalHealth = useCallback((candidate: Candidate): PortalHealth => {
    const registration = !!(candidate.registration_status && candidate.registration_status !== "DRAFT");
    const photo = !!(candidate.photo_url);
    const payment = candidate.payment_status === "PAID" || candidate.payment_status === "SPONSORED";
    const mobileVerified = !!(candidate.mobile_verified);
    const practiceStarted = false;
    const points = [registration, photo, payment, mobileVerified, practiceStarted].filter(Boolean).length;
    const score = Math.round((points / 5) * 100);
    const label: PortalHealth["label"] = score === 100 ? "Excellent" : score >= 75 ? "Good" : score >= 50 ? "Needs Attention" : "Incomplete";
    return { registration, photo, payment, mobileVerified, practiceStarted, score, label };
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const { authService } = await import("@/services/authService");
      await authService.logout();
    } catch { /* ignore */ }
    router.push("/login");
  }, [router]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <PortalContext.Provider value={{
      parentSession, isHydrated,
      candidates, activeCandidate, activeProgress, systemSettings, loading, isDemoMode,
      setActiveChild,
      activityFeed, addActivity,
      notifications, unreadCount, markNotificationRead, markAllRead,
      preferences, updatePreference,
      getPortalHealth, handleLogout,
      trackModuleVisit, addRecentDownload,
    }}>
      {children}
    </PortalContext.Provider>
  );
}
