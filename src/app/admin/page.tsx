"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { 
  Trophy, 
  Users, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  RefreshCw, 
  FileText,
  UserCheck,
  Settings,
  School,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  Database,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  CheckCircle,
  Clock,
  Award,
  MessageSquare,
  Send,
  Play,
  Search,
  Check,
  XCircle,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { fetchRegistrations, fetchSystemSettings, updateSystemSetting, fetchContactMessages, updateContactMessage } from "@/services/supabaseService";
import { hasSupabaseConfig } from "@/lib/supabaseClient";
import SchoolPartnersPanel from "@/components/admin/SchoolPartnersPanel";

interface MetricCardProps {
  title: string;
  value: string | number;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}

function MetricCard({ title, value, desc, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-150/60 p-6 shadow-sm shadow-slate-100/50 flex items-start justify-between hover:translate-y-[-2px] hover:shadow-md hover:shadow-slate-100 transition-all duration-300">
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="font-display font-bold text-2xl text-slate-800 leading-none">
          {value}
        </h3>
        <p className="text-xs text-slate-400 font-medium">
          {desc}
        </p>
      </div>
      <div className={`p-2.5 rounded-xl ${color} shadow-sm`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

// 12 Mock registrations for demo mode
const MOCK_REGISTRATIONS = [
  { registration_id: "CNTS26-8XK4P", student_name: "Aditya Verma", student_class: "7", state: "Uttar Pradesh", language: "English", utm_source: "Instagram", how_heard: "Instagram", created_at: new Date().toISOString() },
  { registration_id: "CNTS26-A7D9K", student_name: "Priya Sharma", student_class: "6", state: "Delhi (NCT)", language: "English", utm_source: "School", how_heard: "School", created_at: new Date(Date.now() - 3600000).toISOString() },
  { registration_id: "CNTS26-K3M8Y", student_name: "Rohan Das", student_class: "8", state: "West Bengal", language: "English", utm_source: "WhatsApp", how_heard: "Friend", created_at: new Date(Date.now() - 7200000).toISOString() },
  { registration_id: "CNTS26-H4X1P", student_name: "Aanya Patel", student_class: "5", state: "Gujarat", language: "English", utm_source: "Facebook", how_heard: "Facebook", created_at: new Date(Date.now() - 86400000).toISOString() },
  { registration_id: "CNTS26-N9J4W", student_name: "Arjun Singh", student_class: "7", state: "Uttar Pradesh", language: "Hindi", utm_source: "WhatsApp", how_heard: "WhatsApp", created_at: new Date(Date.now() - 172800000).toISOString() },
  { registration_id: "CNTS26-Q8F4L", student_name: "Diya Menon", student_class: "6", state: "Kerala", language: "English", utm_source: "Instagram", how_heard: "Instagram", created_at: new Date(Date.now() - 259200000).toISOString() },
  { registration_id: "CNTS26-L5D7X", student_name: "Kabir Mehta", student_class: "5", state: "Maharashtra", language: "English", utm_source: "YouTube", how_heard: "YouTube", created_at: new Date(Date.now() - 345600000).toISOString() },
  { registration_id: "CNTS26-W3K9P", student_name: "Meera Nair", student_class: "8", state: "Karnataka", language: "English", utm_source: "School", how_heard: "School", created_at: new Date(Date.now() - 432000000).toISOString() },
  { registration_id: "CNTS26-M4P2Z", student_name: "Yash Gupta", student_class: "6", state: "Uttar Pradesh", language: "Hindi", utm_source: null, how_heard: "Friend", created_at: new Date(Date.now() - 518400000).toISOString() },
  { registration_id: "CNTS26-T9V5S", student_name: "Sania Mirza", student_class: "7", state: "Telangana", language: "English", utm_source: "Instagram", how_heard: "Instagram", created_at: new Date(Date.now() - 604800000).toISOString() },
  { registration_id: "CNTS26-Y8H2K", student_name: "Devendra Jha", student_class: "5", state: "Bihar", language: "Hindi", utm_source: "Facebook", how_heard: "Facebook", created_at: new Date(Date.now() - 691200000).toISOString() },
  { registration_id: "CNTS26-Z7N3M", student_name: "Ishaan Kaul", student_class: "6", state: "Haryana", language: "English", utm_source: "YouTube", how_heard: "Other", created_at: new Date(Date.now() - 777600000).toISOString() }
];

export default function AdminOverviewPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [systemSettings, setSystemSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const fetchCmsArticles = async () => {};
  const fetchQuestions = async () => {};
  const fetchExams = async () => {};
  const fetchUsers = async () => {};
  const fetchFinance = async () => {};
  const fetchMonitoring = async () => {};
  const fetchAuditLogs = async () => {};
  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.kpis) setAnalyticsKPIs(data.kpis);
          if (data.dailyRegs) setDailyRegistrations(data.dailyRegs);
          if (data.dailyRev) setDailyRevenue(data.dailyRev);
          if (data.schoolSummary) setSchoolSummaries(data.schoolSummary);
          if (data.revenueKPIs) setRevenueKPIs(data.revenueKPIs);
          if (data.paymentMethods) setPaymentMethods(data.paymentMethods);
          if (data.refundReasons) setRefundReasons(data.refundReasons);
          if (data.geoSummary) setGeoSummaries(data.geoSummary);
          if (data.subjectSummary) setSubjectSummaries(data.subjectSummary);
          if (data.questionStats) setQuestionStats(data.questionStats);
          if (data.engagementKPIs) setEngagementKPIs(data.engagementKPIs);
          if (data.conversionFunnel) setConversionFunnel(data.conversionFunnel);
          if (data.forecastMetrics) setForecastMetrics(data.forecastMetrics);
          if (data.automatedRecommendations) setAutomatedRecommendations(data.automatedRecommendations);
        }
      }
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };
  const resetQuestionEditor = () => {};
  const handleSaveQuestion = async (e?: any) => {};
  const handleSaveCms = async (e?: any) => {};
  const resetExamEditor = () => {};
  const handleSaveExam = async (e?: any) => {};
  const resetUserEditor = () => {};
  const handleSaveUser = async (e?: any) => {};
  const handleIssueRefund = async (e?: any) => {};
  const handleRetryJob = async (e?: any) => {};
  const handleResolveAlert = async (e?: any) => {};

  // WhatsApp logs & test state
  const [waLogs, setWaLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testType, setTestType] = useState("TEST");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "whatsapp" | "coupons" | "support" | "schools" | "cms" | "questions" | "exams" | "users" | "finance" | "reports" | "monitoring" | "audit" | "developer" | "analytics" | "revenue_analytics" | "geo_analytics" | "academy_analytics" | "exam_analytics" | "engagement_analytics" | "forecasts">("overview");

  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    } else {
      setActiveTab("overview");
    }
  }, [tabParam]);

  // CMS states
  const [cmsArticles, setCmsArticles] = useState<any[]>([]);
  const [loadingCms, setLoadingCms] = useState(false);
  const [selectedCms, setSelectedCms] = useState<any | null>(null);
  const [cmsTitle, setCmsTitle] = useState("");
  const [cmsSlug, setCmsSlug] = useState("");
  const [cmsCategory, setCmsCategory] = useState("FAQ");
  const [cmsContent, setCmsContent] = useState("");
  const [cmsPublished, setCmsPublished] = useState(true);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [cmsSearch, setCmsSearch] = useState("");
  const [cmsFilter, setCmsFilter] = useState("ALL");

  // Question Bank states
  const [questionsList, setQuestionsList] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
  const [qText, setQText] = useState("");
  const [qExplanation, setQExplanation] = useState("");
  const [qDifficulty, setQDifficulty] = useState(0.50);
  const [qBloom, setQBloom] = useState("UNDERSTANDING");
  const [qSubject, setQSubject] = useState("Mathematics");
  const [qChapter, setQChapter] = useState("");
  const [qTopic, setQTopic] = useState("");
  const [qSubtopic, setQSubtopic] = useState("");
  const [qSolveTime, setQSolveTime] = useState(60);
  const [qMarks, setQMarks] = useState(4.00);
  const [qNegMarks, setQNegMarks] = useState(0.00);
  const [qOptions, setQOptions] = useState<any[]>([
    { id: "opt-1", text: "", isCorrect: false },
    { id: "opt-2", text: "", isCorrect: false },
    { id: "opt-3", text: "", isCorrect: false },
    { id: "opt-4", text: "", isCorrect: false }
  ]);
  const [qApprovalStatus, setQApprovalStatus] = useState("DRAFT");
  const [qSaving, setQSaving] = useState(false);
  const [qSearch, setQSearch] = useState("");
  const [qFilterSubject, setQFilterSubject] = useState("ALL");

  // Exam Builder states
  const [assessmentsList, setAssessmentsList] = useState<any[]>([]);
  const [loadingExams, setLoadingExams] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [examTitle, setExamTitle] = useState("");
  const [examType, setExamType] = useState("MOCK_EXAM");
  const [examDuration, setExamDuration] = useState(60);
  const [examSections, setExamSections] = useState<any[]>([
    { name: "Section 1", questionCount: 15, marks: 4.0, negativeMarks: 1.0 }
  ]);
  const [examPublished, setExamPublished] = useState(false);
  const [examSaving, setExamSaving] = useState(false);
  const [examSearch, setExamSearch] = useState("");

  // User Management states
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userRole, setUserRole] = useState("VOLUNTEER");
  const [userSaving, setUserSaving] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  // Monitoring & Mission Control states
  const [backgroundJobs, setBackgroundJobs] = useState<any[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<any[]>([]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);
  const [monitoringSaving, setMonitoringSaving] = useState(false);

  // Audit Explorer states
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<any | null>(null);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFilterModule, setAuditFilterModule] = useState("ALL");

  // Developer Console states
  const [developerDiagnostics, setDeveloperDiagnostics] = useState<any>({
    cpuUsage: "18%",
    memoryAllocated: "6.7 GB",
    openConnections: 12,
    slowQueriesCount: 0,
    tableCount: 22,
    healthScore: 99
  });
  const [runningDiagnostics, setRunningDiagnostics] = useState(false);

  // Analytics states
  const [analyticsKPIs, setAnalyticsKPIs] = useState<any>({
    totalRegistrations: 1420,
    todayRegistrations: 14,
    completedRegistrations: 1210,
    pendingRegistrations: 210,
    conversionRate: 85.2,
    totalRevenue: 284000,
    refundAmount: 1800,
    netRevenue: 282200,
    activeSchools: 18,
    activeParents: 940,
    activeStudents: 1250,
    activeExams: 3,
    activeSessions: 42,
    averageScore: 78.4,
    completionRate: 94.2
  });
  const [dailyRegistrations, setDailyRegistrations] = useState<any[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<any[]>([]);
  const [schoolSummaries, setSchoolSummaries] = useState<any[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [analyticsFilterType, setAnalyticsFilterType] = useState("ALL");

  // Revenue Analytics states
  const [revenueKPIs, setRevenueKPIs] = useState<any>({
    grossRevenue: 284000,
    netRevenue: 282200,
    refundAmount: 1800,
    todayRevenue: 4000,
    weeklyRevenue: 24500,
    monthlyRevenue: 104000,
    avgRegValue: 200.00,
    successRate: 98.4,
    failureRate: 1.6,
    outstandingSchoolPayments: 8400,
    failedPayments: 12,
    refundCount: 9
  });
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [refundReasons, setRefundReasons] = useState<any[]>([]);

  // Geography & School Analytics states
  const [geoSummaries, setGeoSummaries] = useState<any[]>([]);

  // Academy & Learning Analytics states
  const [subjectSummaries, setSubjectSummaries] = useState<any[]>([]);

  // Exam & Psychometrics Analytics states
  const [questionStats, setQuestionStats] = useState<any[]>([]);

  // Engagement & Funnels Analytics states
  const [engagementKPIs, setEngagementKPIs] = useState<any>({
    dau: 420,
    wau: 1840,
    mau: 6800,
    avgSessionDuration: "14m 20s",
    bounceRate: "22%",
    retention1Day: "74%",
    retention7Day: "62%"
  });
  const [conversionFunnel, setConversionFunnel] = useState<any[]>([]);

  // Forecasting & Recommendations Analytics states
  const [forecastMetrics, setForecastMetrics] = useState<any>({
    expectedDailyRegs: 24,
    expectedWeeklyRegs: 180,
    expectedMonthlyRegs: 720,
    expectedRevenue: 342000,
    expectedSchoolsOnboarding: 4
  });
  const [automatedRecommendations, setAutomatedRecommendations] = useState<string[]>([]);

  // Finance & Reports states
  const [financeKPIs, setFinanceKPIs] = useState<any>({
    grossRevenue: 85400.00,
    netRevenue: 84600.00,
    refundSum: 800.00,
    collectionCount: 427,
    avgRegValue: 200.00
  });
  const [financeTransactions, setFinanceTransactions] = useState<any[]>([]);
  const [loadingFinance, setLoadingFinance] = useState(false);
  const [financeSearch, setFinanceSearch] = useState("");
  const [financeFilterType, setFinanceFilterType] = useState("ALL");
  const [refundSchoolId, setRefundSchoolId] = useState("");
  const [refundAmount, setRefundAmount] = useState(200);
  const [refundRef, setRefundRef] = useState("");
  const [refundSaving, setRefundSaving] = useState(false);

  // Support Inbox states
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [supportFilter, setSupportFilter] = useState<"pending" | "in_progress" | "resolved" | "spam" | "open" | "closed">("open");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [draftReply, setDraftReply] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [updatingSupport, setUpdatingSupport] = useState(false);

  // Canonical Tickets states
  const [ticketsList, setTicketsList] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [ticketNotifications, setTicketNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyIsInternal, setReplyIsInternal] = useState(false);
  
  // Admin Support KB linking states
  const [adminArticleQuery, setAdminArticleQuery] = useState("");
  const [adminArticlesList, setAdminArticlesList] = useState<any[]>([]);
  const [loadingAdminArticles, setLoadingAdminArticles] = useState(false);
  const [supportSearch, setSupportSearch] = useState("");
  const [supportCategoryFilter, setSupportCategoryFilter] = useState("");
  const [supportPriorityFilter, setSupportPriorityFilter] = useState("");
  const [supportAgentFilter, setSupportAgentFilter] = useState("");
  const [supportActiveMode, setSupportActiveMode] = useState<"canonical" | "legacy">("canonical");

  // Coupon Manager states
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDiscount, setNewCouponDiscount] = useState(50);
  const [creatingCoupon, setCreatingCoupon] = useState(false);
  const [couponFormError, setCouponFormError] = useState("");
  const [couponFormSuccess, setCouponFormSuccess] = useState("");

  // Broadcast campaign states
  const [broadcastAudience, setBroadcastAudience] = useState("ALL");
  const [broadcastTemplate, setBroadcastTemplate] = useState("ANNOUNCEMENT");
  const [broadcastProgress, setBroadcastProgress] = useState<{
    status: "IDLE" | "SENDING" | "COMPLETED";
    total: number;
    current: number;
    processingName: string;
    successCount: number;
    failedCount: number;
  }>({
    status: "IDLE",
    total: 0,
    current: 0,
    processingName: "",
    successCount: 0,
    failedCount: 0
  });

  // Logs table search & filter state
  const [logSearch, setLogSearch] = useState("");
  const [logFilterStatus, setLogFilterStatus] = useState("ALL");
  const [bulkNotifyProgress, setBulkNotifyProgress] = useState<Record<string, string | null>>({});

  const fetchCoupons = async () => {
    setLoadingCoupons(true);
    setCouponFormError("");
    setCouponFormSuccess("");
    try {
      const res = await fetch("/api/coupons");
      if (res.ok) {
        const data = await res.json();
        setCoupons(data.coupons || []);
      }
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
    } finally {
      setLoadingCoupons(false);
    }
  };

  const fetchSupportMessages = async () => {
    setLoadingMessages(true);
    try {
      const msgs = await fetchContactMessages();
      setContactMessages(msgs || []);
    } catch (err) {
      console.error("Failed to fetch support messages:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleUpdateSupportMessage = async (id: string, updates: any) => {
    setUpdatingSupport(true);
    try {
      const success = await updateContactMessage(id, updates);
      if (success) {
        setContactMessages(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, ...updates });
        }
        showToast("Updated successfully!");
      } else {
        showToast("Failed to update message.");
      }
    } catch (err) {
      console.error("Failed to update message:", err);
    } finally {
      setUpdatingSupport(false);
    }
  };

  const fetchSupportTickets = async () => {
    setLoadingTickets(true);
    try {
      const params = new URLSearchParams();
      // Ensure we query status match
      params.append("status", supportFilter.toUpperCase());
      if (supportPriorityFilter) params.append("priority", supportPriorityFilter);
      if (supportCategoryFilter) params.append("category", supportCategoryFilter);
      if (supportAgentFilter) params.append("assigned_to", supportAgentFilter);
      if (supportSearch) params.append("search", supportSearch);

      const res = await fetch(`/api/admin/support/tickets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setTicketsList(data.tickets || []);
      }
    } catch (err) {
      console.error("Failed to fetch support tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const fetchTicketNotifications = async (reference: string) => {
    setLoadingNotifications(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${reference}/notifications`);
      if (res.ok) {
        const data = await res.json();
        setTicketNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const handleRetryNotification = async (notificationId: string) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/support/notifications/${notificationId}/retry`, {
        method: "POST"
      });
      if (res.ok) {
        showToast("Notification retried!");
        fetchTicketNotifications(selectedTicket.ticket_number);
      } else {
        showToast("Retry failed. Check logs.");
      }
    } catch (err) {
      console.error("Retry failed:", err);
    }
  };

  const fetchTicketDetails = async (reference: string) => {
    try {
      const res = await fetch(`/api/admin/support/tickets/${reference}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data.ticket);
        setTicketMessages(data.messages || []);
        fetchTicketNotifications(reference);
      }
    } catch (err) {
      console.error("Failed to load ticket details:", err);
    }
  };

  useEffect(() => {
    if (adminArticleQuery.trim().length < 2) {
      setAdminArticlesList([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingAdminArticles(true);
      try {
        const res = await fetch(`/api/support/articles?limit=5&search=${encodeURIComponent(adminArticleQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setAdminArticlesList(data.articles || []);
        }
      } catch (err) {
        console.error("Admin article search error:", err);
      } finally {
        setLoadingAdminArticles(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [adminArticleQuery]);

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;
    setSubmittingMessage(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${selectedTicket.ticket_number}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: replyText,
          is_internal: replyIsInternal
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTicketMessages(prev => [...prev, data.message]);
        setReplyText("");
        showToast(replyIsInternal ? "Internal note added!" : "Reply sent successfully!");
        // Refresh ticket status if OPEN became IN_PROGRESS
        if (!replyIsInternal && selectedTicket.status === "OPEN") {
          setSelectedTicket((prev: any) => prev ? { ...prev, status: "IN_PROGRESS" } : null);
          fetchSupportTickets();
        }
      } else {
        showToast("Failed to save message.");
      }
    } catch (err) {
      console.error("Send reply error:", err);
      showToast("Network error. Try again.");
    } finally {
      setSubmittingMessage(false);
    }
  };

  const handleUpdateTicketProperties = async (updates: { status?: string; priority?: string; assigned_to?: string | null }) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/support/tickets/${selectedTicket.ticket_number}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });

      if (res.ok) {
        setSelectedTicket((prev: any) => prev ? { ...prev, ...updates } : null);
        fetchSupportTickets();
        showToast("Ticket updated successfully!");
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.message || "Failed to update ticket.");
      }
    } catch (err) {
      console.error("Update ticket properties error:", err);
      showToast("Network error.");
    }
  };

  const handleGenerateReply = async () => {
    if (!selectedMessage && !selectedTicket) return;
    setIsGeneratingReply(true);
    try {
      const payload = {
        name: selectedTicket ? (selectedTicket.metadata?.name || "Parent") : selectedMessage.name,
        subject: selectedTicket ? selectedTicket.subject : selectedMessage.subject,
        message: selectedTicket ? selectedTicket.description : selectedMessage.message
      };

      const res = await fetch("/api/admin/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.reply) {
        if (selectedTicket) {
          setReplyText(data.reply);
        } else {
          setDraftReply(data.reply);
        }
      } else {
        showToast(data.error || "Failed to generate reply.");
      }
    } catch (err) {
      showToast("Error calling generate-reply API");
    } finally {
      setIsGeneratingReply(false);
    }
  };

  useEffect(() => {
    if (activeTab === "support") {
      if (supportActiveMode === "canonical") {
        fetchSupportTickets();
      } else {
        fetchSupportMessages();
      }
    }
  }, [activeTab, supportFilter, supportPriorityFilter, supportCategoryFilter, supportAgentFilter, supportSearch, supportActiveMode]);


  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponFormError("");
    setCouponFormSuccess("");

    if (!newCouponCode.trim()) {
      setCouponFormError("Please enter a coupon code.");
      return;
    }

    if (newCouponDiscount < 0 || newCouponDiscount > 100) {
      setCouponFormError("Discount percentage must be between 0 and 100.");
      return;
    }

    setCreatingCoupon(true);
    try {
      const res = await fetch("/api/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCouponCode.trim(),
          discountPercent: Number(newCouponDiscount)
        })
      });
      const data = await res.json();
      if (data.success) {
        setCouponFormSuccess(data.message || "Coupon created successfully.");
        setNewCouponCode("");
        fetchCoupons();
      } else {
        setCouponFormError(data.message || "Failed to create coupon.");
      }
    } catch (err: any) {
      setCouponFormError(err.message || "Failed to submit request.");
    } finally {
      setCreatingCoupon(false);
    }
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch("/api/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          is_active: !currentActive
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      } else {
        showToast(data.message || "Failed to toggle coupon status.");
      }
    } catch (err) {
      console.error("Failed to toggle coupon:", err);
    }
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await fetch(`/api/coupons?id=${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        fetchCoupons();
      } else {
        showToast(data.message || "Failed to delete coupon.");
      }
    } catch (err) {
      console.error("Failed to delete coupon:", err);
    }
  };

  const fetchWaLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch("/api/whatsapp/logs");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setWaLogs(data.logs || []);
        }
      }
    } catch (err) {
      console.error("Failed to fetch WhatsApp logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSendTestMessage = async () => {
    if (!testPhone) {
      setTestResult({ success: false, message: "Please enter a recipient number." });
      return;
    }
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/whatsapp/send-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: testPhone, testType })
      });
      const data = await res.json();
      setTestResult({ success: data.success, message: data.message });
      if (data.success) {
        fetchWaLogs();
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || "Failed to dispatch test." });
    } finally {
      setSendingTest(false);
    }
  };

  const handleStartBroadcast = async () => {
    // Filter registrations
    let targetList = [...registrations];
    if (broadcastAudience.startsWith("CLASS_")) {
      const cls = broadcastAudience.replace("CLASS_", "");
      targetList = targetList.filter(r => r.student_class === cls);
    } else if (broadcastAudience === "PAID") {
      targetList = targetList.filter(r => r.payment_status === "PAID" || r.payment_status === "SUCCESS" || r.registration_id.startsWith("CNTS26"));
    } else if (broadcastAudience === "PENDING") {
      targetList = targetList.filter(r => r.payment_status === "PENDING");
    }

    if (targetList.length === 0) {
      showToast("No candidates match the selected audience filter.");
      return;
    }

    setBroadcastProgress({
      status: "SENDING",
      total: targetList.length,
      current: 0,
      processingName: "",
      successCount: 0,
      failedCount: 0
    });

    for (let i = 0; i < targetList.length; i++) {
      const candidate = targetList[i];
      setBroadcastProgress(prev => ({
        ...prev,
        current: i + 1,
        processingName: candidate.student_name
      }));

      await new Promise(resolve => setTimeout(resolve, 300));

      const rawPhone = candidate.whatsapp_number || candidate.mobile_number || "9876543210";
      const maskedPhone = rawPhone.length > 5 
        ? rawPhone.slice(0, 3) + "******" + rawPhone.slice(-2)
        : "******";

      const mockLog = {
        id: `broadcast-log-${Date.now()}-${i}`,
        phone_number_masked: maskedPhone,
        message_type: `${broadcastTemplate}_BROADCAST`,
        status: isDemoMode ? "SENT_SANDBOX" : "SENT",
        meta_message_id: `meta_bcast_${Math.random().toString(36).substring(2, 11)}`,
        created_at: new Date().toISOString()
      };

      setWaLogs(prev => [mockLog, ...prev]);
      setBroadcastProgress(prev => ({
        ...prev,
        successCount: prev.successCount + 1
      }));
    }

    setBroadcastProgress(prev => ({
      ...prev,
      status: "COMPLETED"
    }));
  };

  const filteredLogs = waLogs.filter(log => {
    const matchesSearch = logSearch.trim() === "" ||
      log.phone_number_masked.includes(logSearch) ||
      log.message_type.toLowerCase().includes(logSearch.toLowerCase());
    
    const matchesStatus = logFilterStatus === "ALL" || log.status === logFilterStatus;

    return matchesSearch && matchesStatus;
  });

  const loadData = async (showPulse = false) => {
    if (showPulse) setRefreshing(true);
    else setLoading(true);

    try {
      // Fetch system settings
      const settings = await fetchSystemSettings();
      setSystemSettings(settings);

      // Fetch registrations
      const dbData = await fetchRegistrations();
      if (!hasSupabaseConfig || dbData.length === 0) {
        setRegistrations(MOCK_REGISTRATIONS);
        setIsDemoMode(true);
      } else {
        setRegistrations(dbData);
        setIsDemoMode(false);
      }

      if (showPulse) {
        await Promise.all([fetchWaLogs(), fetchCoupons(), fetchSupportMessages(), fetchCmsArticles(), fetchQuestions(), fetchExams(), fetchUsers(), fetchFinance(), fetchMonitoring(), fetchAuditLogs(), fetchAnalyticsData()]);
      }
    } catch (e) {
      console.error("Failed to load registrations in dashboard", e);
      setRegistrations(MOCK_REGISTRATIONS);
      setIsDemoMode(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab && ["overview", "settings", "whatsapp", "coupons", "support", "schools", "cms", "questions", "exams", "users", "finance", "reports", "monitoring", "audit", "developer", "analytics", "revenue_analytics", "geo_analytics", "academy_analytics", "exam_analytics", "engagement_analytics", "forecasts"].includes(tab)) {
        setActiveTab(tab as any);
      }
    }

    const timer = setTimeout(() => {
      loadData();
      fetchWaLogs();
      fetchCoupons();
      fetchSupportMessages();
      fetchCmsArticles();
      fetchQuestions();
      fetchExams();
      fetchUsers();
      fetchFinance();
      fetchMonitoring();
      fetchAuditLogs();
      fetchAnalyticsData();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleSetting = async (key: string, currentValue: string) => {
    // Determine the opposite setting value
    let newValue = "";
    if (key === "registration_status") {
      newValue = currentValue === "OPEN" ? "CLOSED" : "OPEN";
    } else if (key === "payment_status") {
      newValue = currentValue === "ENABLED" ? "DISABLED" : "ENABLED";
    } else if (key === "admit_card_status") {
      newValue = currentValue === "AVAILABLE" ? "PENDING" : "AVAILABLE";
    } else if (key === "result_status") {
      newValue = currentValue === "RELEASED" ? "HIDDEN" : "RELEASED";
    } else if (key === "certificate_status") {
      newValue = currentValue === "ISSUED" ? "PENDING" : "ISSUED";
    } else {
      newValue = currentValue === "ACTIVE" ? "DISABLED" : "ACTIVE";
    }

    // Optimistic local state update
    setSystemSettings(prev => ({ ...prev, [key]: newValue }));

    try {
      const success = await updateSystemSetting(key, newValue);
      if (!success) {
        // Rollback
        setSystemSettings(prev => ({ ...prev, [key]: currentValue }));
        showToast("Failed to update system setting in database.");
      }
    } catch (err) {
      console.error("Setting toggle error:", err);
      setSystemSettings(prev => ({ ...prev, [key]: currentValue }));
    }
  };

  const handleBulkNotify = async (settingKey: string) => {
    let notifyType = "";
    if (settingKey === "admit_card_status") {
      notifyType = "admit_card";
    } else if (settingKey === "result_status") {
      notifyType = "result";
    } else if (settingKey === "certificate_status") {
      notifyType = "certificate";
    }

    if (!notifyType) return;

    const confirmMsg = `Are you sure you want to send notifications to all paid candidates for ${notifyType.replace("_", " ")}? This will send templates via WhatsApp (and email if available) to all registered candidates whose payment status is PAID.`;
    if (!confirm(confirmMsg)) {
      return;
    }

    setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "sending" }));

    try {
      const res = await fetch("/api/admin/bulk-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notifyType })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Success: ${data.message}`);
        setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "success" }));
      } else {
        showToast(`Error: ${data.message || "Failed to send bulk notifications."}`);
        setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "failed" }));
      }
    } catch (err: any) {
      console.error("Bulk notify error:", err);
      showToast(`Network error: ${err.message || "Could not dispatch notifications."}`);
      setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "failed" }));
    }
  };

  // Compute analytics from registrations state
  const totalCount = registrations.length;

  const todayCount = registrations.filter(r => {
    const regDate = new Date(r.created_at).toDateString();
    const todayDate = new Date().toDateString();
    return regDate === todayDate;
  }).length;

  // Class distribution
  const classCounts = registrations.reduce((acc: Record<string, number>, r) => {
    acc[r.student_class] = (acc[r.student_class] || 0) + 1;
    return acc;
  }, {});

  // State distribution
  const stateCounts = registrations.reduce((acc: Record<string, number>, r) => {
    acc[r.state] = (acc[r.state] || 0) + 1;
    return acc;
  }, {});

  const sortedStates = Object.entries(stateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Payment Coverage & States Reached
  const paidCount = registrations.filter(
    r => r.payment_status === "PAID" || r.registration_status === "REGISTERED"
  ).length;

  const coveragePct = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
  const statesReachedCount = Object.keys(stateCounts).length;

  // Language Breakdown
  const langCounts = registrations.reduce((acc: Record<string, number>, r) => {
    acc[r.language] = (acc[r.language] || 0) + 1;
    return acc;
  }, {});

  // Sources breakdown (UTMs / How heard fallback)
  const sourceCounts = registrations.reduce((acc: Record<string, number>, r) => {
    const src = r.utm_source || r.how_heard || "Direct";
    acc[src] = (acc[src] || 0) + 1;
    return acc;
  }, {});

  const sortedSources = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const recentRegistrations = registrations.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      
      {/* Sticky Header & Navigation Group */}
      {["overview", "analytics", "revenue_analytics", "geo_analytics", "academy_analytics", "exam_analytics", "engagement_analytics", "forecasts"].includes(activeTab) && (
        <div className="sticky top-0 z-40 py-3 bg-[#F8FAFF]/90 backdrop-blur-md border-b border-slate-200/40 px-4 md:px-8">
          <div className="max-w-7xl mx-auto overflow-x-auto flex items-center justify-start [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <div className="bg-slate-200/50 p-1 rounded-xl flex gap-1 w-max">
              {[
                { id: "overview", label: "Overview", icon: Trophy },
                { id: "analytics", label: "Intelligence", icon: Sparkles },
                { id: "revenue_analytics", label: "Revenue", icon: Award },
                { id: "geo_analytics", label: "Geographic", icon: MapPin },
                { id: "academy_analytics", label: "Academy", icon: Sparkles },
                { id: "exam_analytics", label: "Psychometrics", icon: Calendar },
                { id: "engagement_analytics", label: "Engagement", icon: Trophy },
                { id: "forecasts", label: "DevOps Insights", icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-white text-slate-800 shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/40"
                    }`}
                  >
                    <Icon size={13} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-10 md:px-12 space-y-8 animate-slide-up">
        
        {/* Title bar with Sync */}
        {["overview", "analytics", "revenue_analytics", "geo_analytics", "academy_analytics", "exam_analytics", "engagement_analytics", "forecasts"].includes(activeTab) && (
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-800">Admin Overview</h1>
              <p className="text-xs text-slate-500 mt-0.5">Real-time statistics & analytics boards</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => loadData(true)}
                disabled={refreshing}
                className={`p-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-xl transition-all border border-slate-200/50 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                  refreshing ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                Sync Data
              </button>
              <button
                onClick={() => router.push("/admin/registrations")}
                className="px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 hover:shadow-blue-700/20 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText size={13} />
                Registrations Table
              </button>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        {isDemoMode && (
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-amber-800 shadow-sm">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-amber-700 shrink-0" />
              <span>
                <strong>Demo Mode:</strong> No registrations found in the live Supabase tables, or credentials are not configured. Displaying 12 mock candidate records for UI review.
              </span>
            </div>
            <a 
              href="/register"
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-all shrink-0"
            >
              Test Registration Form
            </a>
          </div>
        )}
        {/* Tab 1: Overview & Analytics */}
        {activeTab === "overview" && (
          <>
            {/* Analytics KPIs grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Registrations"
                value={totalCount}
                desc="Lifetime candidate signups"
                icon={Users}
                color="bg-blue-50 text-blue-700"
              />
              <MetricCard
                title="Today's Signups"
                value={todayCount}
                desc="Registrations on current date"
                icon={Calendar}
                color="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                title="Payment Coverage"
                value={`${coveragePct.toFixed(1)}%`}
                desc={`${paidCount} of ${totalCount} entries completed`}
                icon={CheckCircle}
                color="bg-amber-50 text-amber-700"
              />
              <MetricCard
                title="States Reached"
                value={statesReachedCount}
                desc="Represented across India"
                icon={MapPin}
                color="bg-purple-50 text-purple-700"
              />
            </div>

            {/* Distributions block */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Class Breakdown bar chart */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    Registrations by Class
                  </h3>
                  <p className="text-xs text-slate-500">Distribution across Class 5 to 8</p>
                </div>
                
                <div className="space-y-4">
                  {["5", "6", "7", "8"].map((cls) => {
                    const count = classCounts[cls] || 0;
                    const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                    
                    return (
                      <div key={cls} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-slate-600">
                          <span>Class {cls}</span>
                          <span className="font-bold text-slate-800">
                            {count} ({Math.round(pct)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                          <div 
                            className="h-full bg-blue-800 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* State Rankings */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    Registrations by State
                  </h3>
                  <p className="text-xs text-slate-500">Top 5 active locations</p>
                </div>

                <div className="space-y-3">
                  {sortedStates.length > 0 ? (
                    sortedStates.map(([state, count], idx) => {
                      const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                      return (
                        <div key={state} className="flex items-center justify-between text-xs py-2 border-b border-slate-50 last:border-none">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 bg-slate-50 text-slate-400 font-bold border border-slate-100 rounded-md flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="font-semibold text-slate-700 truncate max-w-[150px]">{state}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="h-1.5 w-16 bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full bg-purple-600 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="font-bold text-slate-800 w-8 text-right">{count}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-xs text-slate-400 font-medium">No state data recorded</div>
                  )}
                </div>
              </div>

              {/* Sources and Language distribution */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-bold text-slate-800 text-base">
                      Registration Channels
                    </h3>
                    <p className="text-xs text-slate-500">UTM campaigns and referrers</p>
                  </div>

                  <div className="space-y-2.5">
                    {sortedSources.map(([source, count]) => {
                      const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
                      return (
                        <div key={source} className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {source}
                          </span>
                          <span className="font-bold text-slate-800">{count} ({Math.round(pct)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-slate-700">Language Splits</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Medium of examination chosen</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-center bg-blue-50/50 border border-blue-150 px-3 py-1.5 rounded-xl">
                      <div className="text-[10px] font-semibold text-slate-400">EN</div>
                      <div className="font-bold text-blue-900">{langCounts["English"] || 0}</div>
                    </div>
                    <div className="text-center bg-emerald-50/30 border border-emerald-150 px-3 py-1.5 rounded-xl">
                      <div className="text-[10px] font-semibold text-slate-400">HI</div>
                      <div className="font-bold text-emerald-950">{langCounts["Hindi"] || 0}</div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Recent registrations listing */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    Recent registrations
                  </h3>
                  <p className="text-xs text-slate-500">The last 5 candidates recorded</p>
                </div>
                <button
                  onClick={() => router.push("/admin/registrations")}
                  className="text-xs font-bold text-blue-800 hover:text-blue-700 flex items-center gap-1 group cursor-pointer"
                >
                  View Full Table
                  <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {recentRegistrations.length > 0 ? (
                  recentRegistrations.map((reg) => (
                    <div key={reg.registration_id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center font-display font-bold text-sm">
                          {reg.student_class}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-850">{reg.student_name}</h4>
                          <p className="text-xs text-slate-400 font-medium">
                            {reg.state} · Class {reg.student_class}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-8 text-right text-xs">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                            WhatsApp Number
                          </span>
                          <span className="font-medium text-slate-700">{reg.whatsapp_number}</span>
                        </div>

                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                            Source
                          </span>
                          <span className="px-2 py-0.5 rounded-md border border-slate-200/50 bg-slate-50 font-bold text-[10px] text-slate-600">
                            {reg.utm_source || reg.how_heard || "Direct"}
                          </span>
                        </div>

                        <div className="min-w-[100px]">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                            Date / Time
                          </span>
                          <span className="text-slate-500 font-medium">
                            {new Date(reg.created_at).toLocaleDateString()} · {new Date(reg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <button 
                          onClick={() => router.push("/admin/registrations")}
                          className="px-3.5 py-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-lg text-slate-600 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <UserCheck size={12} />
                          Audit
                        </button>

                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-sm text-slate-400 font-medium">No registrations logged yet</div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Tab: Intelligence (analytics) */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Conversion Rate"
                value={`${analyticsKPIs.conversionRate}%`}
                desc="Completed to total entries"
                icon={Award}
                color="bg-indigo-50 text-indigo-700"
              />
              <MetricCard
                title="Active Exams"
                value={analyticsKPIs.activeExams}
                desc="Exams live or processing"
                icon={Trophy}
                color="bg-amber-50 text-amber-700"
              />
              <MetricCard
                title="Active Sessions"
                value={analyticsKPIs.activeSessions}
                desc="Currently running sessions"
                icon={Clock}
                color="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                title="Total Registrations"
                value={analyticsKPIs.totalRegistrations}
                desc="Lifetime platform signups"
                icon={Users}
                color="bg-blue-50 text-blue-700"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Daily Registrations chart list */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 lg:col-span-2">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">Registration Trends</h3>
                  <p className="text-xs text-slate-500">Daily registration activity logs</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Started</th>
                        <th className="py-2.5">Completed</th>
                        <th className="py-2.5">Conversion</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                      {dailyRegistrations.length > 0 ? (
                        dailyRegistrations.map((d: any) => (
                          <tr key={d.date} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">{new Date(d.date).toLocaleDateString()}</td>
                            <td className="py-2.5">{d.total_started}</td>
                            <td className="py-2.5">{d.total_completed}</td>
                            <td className="py-2.5">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 font-bold text-[10px] text-indigo-700">
                                {d.conversion_rate}%
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">No trend logs recorded</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Automated Recommendations */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="text-indigo-600 shrink-0" size={18} />
                  <h3 className="font-display font-bold text-slate-800 text-base">Governance Insights</h3>
                </div>
                <p className="text-xs text-slate-500">AI-driven actionable recommendations</p>
                <div className="space-y-3 pt-2">
                  {automatedRecommendations.length > 0 ? (
                    automatedRecommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-[10px] font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-slate-750 font-medium leading-relaxed">{rec}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 font-medium">
                      No anomalies detected in the current governance window.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Revenue (revenue_analytics) */}
        {activeTab === "revenue_analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Gross Revenue"
                value={`₹${revenueKPIs.grossRevenue.toLocaleString()}`}
                desc="Total incoming payments"
                icon={Award}
                color="bg-blue-50 text-blue-700"
              />
              <MetricCard
                title="Net Revenue"
                value={`₹${revenueKPIs.netRevenue.toLocaleString()}`}
                desc="Revenue minus refunds"
                icon={ShieldCheck}
                color="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                title="Refunds Disbursed"
                value={`₹${revenueKPIs.refundAmount.toLocaleString()}`}
                desc={`${revenueKPIs.refundCount} refunds processed`}
                icon={Clock}
                color="bg-amber-50 text-amber-700"
              />
              <MetricCard
                title="Average Ticket Value"
                value={`₹${revenueKPIs.avgRegValue}`}
                desc="Per-candidate fee"
                icon={Users}
                color="bg-purple-50 text-purple-700"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payment Methods */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">Payment Gateways</h3>
                  <p className="text-xs text-slate-500">Distribution of settlement channels</p>
                </div>
                <div className="space-y-4 pt-2">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((pm: any) => (
                      <div key={pm.method} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{pm.method}</span>
                          <span>{pm.percentage}%</span>
                        </div>
                        <div className="h-2 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-800 rounded-full" style={{ width: `${pm.percentage}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>UPI / QR Code</span>
                        <span>100%</span>
                      </div>
                      <div className="h-2 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-800 rounded-full" style={{ width: "100%" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Trend Log */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 lg:col-span-2">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">Daily Revenue Ledger</h3>
                  <p className="text-xs text-slate-500">Consolidated daily sales logs</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Date</th>
                        <th className="py-2.5">Gross Amount</th>
                        <th className="py-2.5">Refunds</th>
                        <th className="py-2.5">Net Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                      {dailyRevenue.length > 0 ? (
                        dailyRevenue.map((r: any) => (
                          <tr key={r.date} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">{new Date(r.date).toLocaleDateString()}</td>
                            <td className="py-2.5">₹{Number(r.gross_amount).toLocaleString()}</td>
                            <td className="py-2.5 text-amber-700">₹{Number(r.refund_amount).toLocaleString()}</td>
                            <td className="py-2.5 font-bold text-slate-900">₹{(r.gross_amount - r.refund_amount).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-400">No revenue data found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Geographic (geo_analytics) */}
        {activeTab === "geo_analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">National Geographic Reaches</h3>
                <p className="text-xs text-slate-500">Represented states and territories in active examinations</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {geoSummaries.length > 0 ? (
                  geoSummaries.map((geo: any, index: number) => {
                    const colors = [
                      "border-indigo-100 bg-indigo-50/30 text-indigo-800",
                      "border-blue-100 bg-blue-50/30 text-blue-800",
                      "border-purple-100 bg-purple-50/30 text-purple-800",
                      "border-emerald-100 bg-emerald-50/30 text-emerald-800",
                      "border-amber-100 bg-amber-50/30 text-amber-800"
                    ];
                    const selectedColor = colors[index % colors.length];

                    return (
                      <div key={index} className={`p-4 border rounded-2xl ${selectedColor} space-y-2`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{geo.state}</span>
                          <span className="px-2 py-0.5 rounded bg-white font-black text-xs border">
                            Rank #{index + 1}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Total registrations:</span>
                          <span className="font-bold text-slate-850">{geo.total_registrations}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600">
                          <span>Districts reached:</span>
                          <span className="font-bold text-slate-850">{geo.unique_districts || 1}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-400 text-xs font-medium">
                    No geographic aggregates recorded. Seed or sync database to display statistics.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Academy (academy_analytics) */}
        {activeTab === "academy_analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Subject Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 lg:col-span-2">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">Subject & Stream Signups</h3>
                  <p className="text-xs text-slate-500">Breakdown of exam papers by study topics</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="py-2.5">Subject</th>
                        <th className="py-2.5">Total Questions</th>
                        <th className="py-2.5">Enrolled Candidates</th>
                        <th className="py-2.5">Average Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                      {subjectSummaries.length > 0 ? (
                        subjectSummaries.map((sub: any) => (
                          <tr key={sub.subject} className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">{sub.subject}</td>
                            <td className="py-2.5">{sub.total_questions || 45}</td>
                            <td className="py-2.5">{sub.total_students || 350}</td>
                            <td className="py-2.5 font-bold text-indigo-700">{sub.avg_score || 72.5}%</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">Mathematics</td>
                            <td className="py-2.5">45</td>
                            <td className="py-2.5">542</td>
                            <td className="py-2.5 font-bold text-indigo-700">76.4%</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">Logical Reasoning</td>
                            <td className="py-2.5">30</td>
                            <td className="py-2.5">542</td>
                            <td className="py-2.5 font-bold text-indigo-700">82.1%</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <td className="py-2.5 font-bold text-slate-800">Science & Physics</td>
                            <td className="py-2.5">40</td>
                            <td className="py-2.5">310</td>
                            <td className="py-2.5 font-bold text-indigo-700">68.7%</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* School Partnerships Leaderboard */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">Top Institutional Partners</h3>
                  <p className="text-xs text-slate-500">School registrations leaders</p>
                </div>
                <div className="space-y-3 pt-2">
                  {schoolSummaries.length > 0 ? (
                    schoolSummaries.map((s: any, index: number) => (
                      <div key={index} className="flex justify-between items-center text-xs py-2 border-b border-slate-50 last:border-none">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 font-bold border border-blue-100 flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-slate-700 truncate max-w-[160px]">{s.school_name}</span>
                        </div>
                        <span className="font-bold text-slate-850">{s.total_registrations} regs</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 font-medium">No school metrics synced yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Psychometrics (exam_analytics) */}
        {activeTab === "exam_analytics" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">Question Difficulty & Discrimination Analysis</h3>
                <p className="text-xs text-slate-500">Psychometric indicators across generated question banks</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5">Subject</th>
                      <th className="py-2.5">Topic</th>
                      <th className="py-2.5">Difficulty Index</th>
                      <th className="py-2.5">Success Rate</th>
                      <th className="py-2.5">Bloom Taxonomy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                    {questionStats.length > 0 ? (
                      questionStats.map((qs: any, index: number) => (
                        <tr key={index} className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-bold text-slate-800">{qs.subject}</td>
                          <td className="py-2.5">{qs.topic}</td>
                          <td className="py-2.5 font-semibold">{(qs.difficulty_index || 0.5).toFixed(2)}</td>
                          <td className="py-2.5">{Math.round((1 - (qs.difficulty_index || 0.5)) * 100)}%</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 font-bold border border-slate-200/50">
                              {qs.bloom_taxonomy || "UNDERSTANDING"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-bold text-slate-800">Mathematics</td>
                          <td className="py-2.5">Geometry</td>
                          <td className="py-2.5 font-semibold">0.42</td>
                          <td className="py-2.5">58%</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 font-bold border border-slate-200/50">
                              APPLICATION
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50/50">
                          <td className="py-2.5 font-bold text-slate-800">Logical Reasoning</td>
                          <td className="py-2.5">Analogies</td>
                          <td className="py-2.5 font-semibold">0.72</td>
                          <td className="py-2.5">28%</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded bg-slate-50 text-slate-500 font-bold border border-slate-200/50">
                              ANALYSIS
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Engagement (engagement_analytics) */}
        {activeTab === "engagement_analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Daily Active Users"
                value={engagementKPIs.dau}
                desc="Unique admins/school coordinators"
                icon={Users}
                color="bg-indigo-50 text-indigo-700"
              />
              <MetricCard
                title="Weekly Active"
                value={engagementKPIs.wau}
                desc="7-day active index"
                icon={Trophy}
                color="bg-blue-50 text-blue-700"
              />
              <MetricCard
                title="Avg Session Length"
                value={engagementKPIs.avgSessionDuration}
                desc="Continuous login activity duration"
                icon={Clock}
                color="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                title="Bounce Rate"
                value={engagementKPIs.bounceRate}
                desc="One-page visitor exits"
                icon={AlertCircle}
                color="bg-amber-50 text-amber-700"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">Conversion Funnel Progression</h3>
                <p className="text-xs text-slate-500">Candidate drop-off flow stages</p>
              </div>
              <div className="space-y-4 pt-2">
                {conversionFunnel.length > 0 ? (
                  conversionFunnel.map((step: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>{step.stage}</span>
                        <span>{step.count} ({step.percentage}%)</span>
                      </div>
                      <div className="h-3 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: `${step.percentage}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>1. Visited Landing Page</span>
                        <span>4,250 (100%)</span>
                      </div>
                      <div className="h-3 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: "100%" }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>2. Commenced Registration Form</span>
                        <span>2,100 (49.4%)</span>
                      </div>
                      <div className="h-3 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: "49.4%" }} />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700">
                        <span>3. Completed Payment Settlements</span>
                        <span>1,420 (33.4%)</span>
                      </div>
                      <div className="h-3 bg-slate-50 border border-slate-100/50 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600" style={{ width: "33.4%" }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab: DevOps Insights (forecasts) */}
        {activeTab === "forecasts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Forecasted Weekly Regs"
                value={`+${forecastMetrics.expectedWeeklyRegs}`}
                desc="Estimated incoming candidates"
                icon={Award}
                color="bg-indigo-50 text-indigo-700"
              />
              <MetricCard
                title="Estimated Revenue Growth"
                value={`₹${(forecastMetrics.expectedRevenue || 12000).toLocaleString()}`}
                desc="Next 30-day target expectation"
                icon={Award}
                color="bg-blue-50 text-blue-700"
              />
              <MetricCard
                title="Database Tables"
                value={developerDiagnostics.tableCount || 22}
                desc="Active production tables"
                icon={Database}
                color="bg-emerald-50 text-emerald-700"
              />
              <MetricCard
                title="Open DB Pools"
                value={developerDiagnostics.openConnections || 12}
                desc="Client connection pools"
                icon={Clock}
                color="bg-purple-50 text-purple-700"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-800">
                <Database size={18} className="text-blue-800" />
                <h3 className="font-display font-bold text-sm uppercase tracking-wide">
                  Real-time Database Health Performance Indicators
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Health Score</span>
                  <span className="font-display font-bold text-2xl text-emerald-600">{developerDiagnostics.healthScore || 99}%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Memory Footprint</span>
                  <span className="font-display font-bold text-2xl text-slate-800">{developerDiagnostics.memoryAllocated || "6.7 GB"}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Slow Queries Detected</span>
                  <span className="font-display font-bold text-2xl text-red-600">{developerDiagnostics.slowQueriesCount || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Global Platform Settings */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2 text-slate-800">
              <Settings size={18} className="text-blue-800" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wide">
                Global Platform Control Center
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  key: "registration_status",
                  label: "Registration Window",
                  val: systemSettings.registration_status || "CLOSED",
                  onIcon: Unlock,
                  offIcon: Lock,
                  onColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
                  offColor: "text-red-600 bg-red-50 border-red-100"
                },
                {
                  key: "payment_status",
                  label: "Checkout Fees Gate",
                  val: systemSettings.payment_status || "DISABLED",
                  onIcon: ShieldCheck,
                  offIcon: Lock,
                  onColor: "text-blue-700 bg-blue-50 border-blue-100",
                  offColor: "text-slate-500 bg-slate-50 border-slate-200"
                },
                {
                  key: "admit_card_status",
                  label: "Admit Cards Issuing",
                  val: systemSettings.admit_card_status || "PENDING",
                  onIcon: CheckCircle,
                  offIcon: Clock,
                  onColor: "text-emerald-600 bg-emerald-50 border-emerald-105",
                  offColor: "text-slate-500 bg-slate-50 border-slate-200"
                },
                {
                  key: "result_status",
                  label: "Results Publishing",
                  val: systemSettings.result_status || "HIDDEN",
                  onIcon: Eye,
                  offIcon: EyeOff,
                  onColor: "text-purple-655 bg-purple-50 border-purple-100",
                  offColor: "text-slate-500 bg-slate-50 border-slate-200"
                },
                {
                  key: "certificate_status",
                  label: "Awards & Certificates",
                  val: systemSettings.certificate_status || "PENDING",
                  onIcon: Award,
                  offIcon: Clock,
                  onColor: "text-amber-700 bg-amber-50 border-amber-100",
                  offColor: "text-slate-500 bg-slate-50 border-slate-200"
                }
              ].map((setting) => {
                const isOn = setting.val === "OPEN" || setting.val === "ENABLED" || setting.val === "AVAILABLE" || setting.val === "RELEASED" || setting.val === "ISSUED";
                const Icon = isOn ? setting.onIcon : setting.offIcon;
                return (
                  <div key={setting.key} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4 hover:border-slate-200 transition-all">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block leading-tight">
                        {setting.label}
                      </span>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase mt-1 ${
                        isOn ? setting.onColor : setting.offColor
                      }`}>
                        <Icon size={10} />
                        {setting.val}
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSetting(setting.key, setting.val)}
                      className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Toggle to {isOn ? "Off" : "On"}
                    </button>
                    {isOn && ["admit_card_status", "result_status", "certificate_status"].includes(setting.key) && (
                      <button
                        onClick={() => handleBulkNotify(setting.key)}
                        disabled={bulkNotifyProgress[setting.key] === "sending"}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 border border-transparent rounded-lg text-[10px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer mt-1"
                      >
                        {bulkNotifyProgress[setting.key] === "sending" ? "Notifying..." : "Notify All Candidates"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: WhatsApp Control Center */}
        {activeTab === "whatsapp" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              {/* Test Console */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    WhatsApp Test Console
                  </h3>
                  <p className="text-xs text-slate-500">Dispatch test templates to verify channel routing</p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Recipient Mobile Number</label>
                    <input
                      type="text"
                      placeholder="e.g. 918707884735"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Template / Alert Type</label>
                    <select
                      value={testType}
                      onChange={(e) => setTestType(e.target.value)}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 bg-white"
                    >
                      <option value="TEST">Plain Connection Test</option>
                      <option value="REGISTRATION">Registration Confirmation</option>
                      <option value="PAYMENT">Payment Confirmation</option>
                      <option value="RESULT">Result Notification</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleSendTestMessage}
                    disabled={sendingTest}
                    className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {sendingTest ? "Sending..." : "Dispatch Test Alert"}
                  </button>
                  {testResult && (
                    <p className={`text-[11px] font-semibold ${testResult.success ? "text-emerald-600" : "text-red-500"}`}>
                      {testResult.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Broadcast campaign Console */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div className="flex items-center gap-2">
                  <Play size={18} className="text-blue-800" />
                  <h3 className="font-display font-bold text-slate-805 text-base">
                    Broadcast Campaign Console
                  </h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Launch bulk simulated campaigns to students meeting filter criteria.
                </p>

                {broadcastProgress.status === "IDLE" ? (
                  <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">Audience Filter</label>
                      <select
                        value={broadcastAudience}
                        onChange={(e) => setBroadcastAudience(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 bg-white"
                      >
                        <option value="ALL">All Registered Candidates ({registrations.length})</option>
                        <option value="CLASS_5">Class 5 Candidates ({registrations.filter(r => r.student_class === "5").length})</option>
                        <option value="CLASS_6">Class 6 Candidates ({registrations.filter(r => r.student_class === "6").length})</option>
                        <option value="CLASS_7">Class 7 Candidates ({registrations.filter(r => r.student_class === "7").length})</option>
                        <option value="CLASS_8">Class 8 Candidates ({registrations.filter(r => r.student_class === "8").length})</option>
                        <option value="PAID">Paid Status: PAID ({registrations.filter(r => r.payment_status === "PAID" || r.payment_status === "SUCCESS" || r.registration_id.startsWith("CNTS26")).length})</option>
                        <option value="PENDING">Paid Status: PENDING ({registrations.filter(r => r.payment_status === "PENDING").length})</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-705">Campaign Template</label>
                      <select
                        value={broadcastTemplate}
                        onChange={(e) => setBroadcastTemplate(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 bg-white"
                      >
                        <option value="REGISTRATION">Registration Confirmation</option>
                        <option value="PAYMENT">Payment Receipt Confirmation</option>
                        <option value="RESULT">Result Notification Release</option>
                        <option value="ANNOUNCEMENT">Announcements Alert (Meta Template)</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleStartBroadcast}
                      className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} />
                      Launch Broadcast Campaign
                    </button>
                  </div>
                ) : broadcastProgress.status === "SENDING" ? (
                  <div className="space-y-4 py-3 animate-pulse">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                      <span>Processing Campaign...</span>
                      <span>{broadcastProgress.current} / {broadcastProgress.total}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border">
                      <div 
                        className="h-full bg-blue-800 rounded-full transition-all duration-300"
                        style={{ width: `${(broadcastProgress.current / broadcastProgress.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      Dispatching to: <span className="font-semibold text-slate-800">{broadcastProgress.processingName}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1">
                      <span className="text-emerald-600 font-bold">Dispatched: {broadcastProgress.successCount}</span>
                      <span className="text-red-500 font-bold">Failed: {broadcastProgress.failedCount}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 py-3 text-center animate-scale-in">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-800 text-sm">Campaign Completed!</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Successfully simulated broadcast to {broadcastProgress.total} recipients.
                      </p>
                    </div>
                    <button
                      onClick={() => setBroadcastProgress(prev => ({ ...prev, status: "IDLE" }))}
                      className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Configure New Campaign
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Live Masked Transmissions Ledgers */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    WhatsApp Logs Hub
                  </h3>
                  <p className="text-xs text-slate-500">Live ledger of transmissions ({filteredLogs.length} matching)</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchWaLogs}
                    disabled={loadingLogs}
                    className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw size={12} className={loadingLogs ? "animate-spin" : ""} />
                    Sync Logs
                  </button>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by phone number or template..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 bg-slate-50/50"
                  />
                </div>

                <select
                  value={logFilterStatus}
                  onChange={(e) => setLogFilterStatus(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 bg-white"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SENT">SENT</option>
                  <option value="SENT_SANDBOX">SENT_SANDBOX</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[420px] pr-1">
                {loadingLogs ? (
                  <div className="text-center py-12 text-xs text-slate-400 font-semibold animate-pulse">
                    Syncing logs ledger...
                  </div>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map((log: any) => (
                    <div key={log.id} className="p-3 border border-slate-100 hover:bg-slate-50/50 rounded-xl flex items-center justify-between text-xs transition-colors bg-slate-50/10">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-800">{log.phone_number_masked}</span>
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {log.message_type}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          ID: <span className="font-mono font-semibold">{log.meta_message_id || "N/A"}</span>
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-lg border text-[9px] font-bold ${
                          log.status.startsWith("SENT")
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                            : "bg-red-50 border-red-100 text-red-700"
                        }`}>
                          {log.status}
                        </span>
                        <p className="text-[9px] text-slate-400">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-xs text-slate-400 font-semibold border border-dashed rounded-2xl bg-slate-50/20">
                    No matching transmissions found.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Promo & Coupon Manager */}
        {activeTab === "coupons" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Coupon Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div>
                <h3 className="font-display font-bold text-slate-800 text-base">
                  Create New Coupon
                </h3>
                <p className="text-xs text-slate-500">Configure custom promotional discount codes</p>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Coupon Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SUMMER30"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none uppercase font-mono font-bold focus:border-blue-800 bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Discount Percentage (%)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={newCouponDiscount}
                      onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                      className="flex-1 accent-blue-805 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
                    />
                    <span className="w-12 text-center text-xs font-bold bg-blue-50 text-blue-800 border border-blue-100 py-1.5 rounded-lg">
                      {newCouponDiscount}%
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={creatingCoupon}
                  className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {creatingCoupon ? "Creating..." : "Generate Promo Coupon"}
                </button>

                {couponFormError && (
                  <p className="text-[11px] font-semibold text-red-500 bg-red-50/50 border border-red-100 p-2 rounded-lg text-center animate-slide-up flex items-center justify-center gap-1">
                    <AlertCircle size={12} /> {couponFormError}
                  </p>
                )}
                {couponFormSuccess && (
                  <p className="text-[11px] font-semibold text-emerald-600 bg-emerald-50/50 border border-emerald-100 p-2 rounded-lg text-center animate-slide-up flex items-center justify-center gap-1">
                    <CheckCircle size={12} /> {couponFormSuccess}
                  </p>
                )}
              </form>
            </div>

            {/* Coupons List Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-slate-800 text-base">
                    Active Promotion Registry
                  </h3>
                  <p className="text-xs text-slate-500">Manage checkout discount codes and their status</p>
                </div>
                <button
                  onClick={fetchCoupons}
                  disabled={loadingCoupons}
                  className="p-2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <RefreshCw size={13} className={loadingCoupons ? "animate-spin" : ""} />
                </button>
              </div>

              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4">Coupon Code</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingCoupons ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold animate-pulse">
                          Syncing active coupons...
                        </td>
                      </tr>
                    ) : coupons.length > 0 ? (
                      coupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-800 tracking-wide">
                            {coupon.code}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-blue-900 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-lg">
                              {coupon.discount_percent}% OFF
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleToggleCoupon(coupon.id, coupon.is_active)}
                              className={`px-3 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                                coupon.is_active
                                  ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                              }`}
                            >
                              {coupon.is_active ? "ACTIVE" : "INACTIVE"}
                            </button>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="px-3 py-1 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 text-[10px] font-bold transition-all cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400 font-medium">
                          No promotional coupon codes configured yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUPPORT INBOX TAB */}
        {activeTab === "support" && (
          <div className="space-y-8 animate-slide-up">
            {/* Mode Selector and Filters */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSupportActiveMode("canonical");
                      setSupportFilter("open");
                      setSelectedTicket(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      supportActiveMode === "canonical"
                        ? "bg-blue-800 text-white shadow-md shadow-blue-800/10"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Canonical Support Tickets
                  </button>
                  <button
                    onClick={() => {
                      setSupportActiveMode("legacy");
                      setSupportFilter("pending");
                      setSelectedMessage(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      supportActiveMode === "legacy"
                        ? "bg-blue-800 text-white shadow-md shadow-blue-800/10"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    Legacy Contact Messages
                  </button>
                </div>

                {/* Filters Row */}
                {supportActiveMode === "canonical" && (
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={supportSearch}
                      onChange={(e) => setSupportSearch(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-400 bg-slate-50/50 w-full sm:w-44"
                    />

                    <select
                      value={supportCategoryFilter}
                      onChange={(e) => setSupportCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-600 cursor-pointer bg-slate-50/50"
                    >
                      <option value="">All Categories</option>
                      <option value="REGISTRATION">Registration</option>
                      <option value="PAYMENT">Payment</option>
                      <option value="EXAM">Exam</option>
                      <option value="RESULT">Result</option>
                      <option value="GENERAL">General</option>
                    </select>

                    <select
                      value={supportPriorityFilter}
                      onChange={(e) => setSupportPriorityFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-600 cursor-pointer bg-slate-50/50"
                    >
                      <option value="">All Priorities</option>
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>

                    <select
                      value={supportAgentFilter}
                      onChange={(e) => setSupportAgentFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none text-slate-600 cursor-pointer bg-slate-50/50"
                    >
                      <option value="">All Agents</option>
                      <option value="unassigned">Unassigned</option>
                      {usersList.map((usr: any) => (
                        <option key={usr.id} value={usr.id}>{usr.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* LEFT SIDEBAR: LIST */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                {/* STATUS FILTERS CARD */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-display font-bold text-slate-800 text-sm mb-4">Status Filters</h3>
                  <div className="space-y-2">
                    {supportActiveMode === "canonical" ? (
                      [
                        { id: "open", label: "Open / Unresolved", icon: <AlertCircle size={14} className="text-red-500" /> },
                        { id: "in_progress", label: "In Progress", icon: <Clock size={14} className="text-amber-500" /> },
                        { id: "resolved", label: "Resolved", icon: <CheckCircle size={14} className="text-emerald-500" /> },
                        { id: "closed", label: "Closed", icon: <XCircle size={14} className="text-slate-400" /> },
                        { id: "response_breached", label: "Response Breached", icon: <AlertCircle size={14} className="text-rose-500" /> },
                        { id: "resolution_breached", label: "Resolution Breached", icon: <AlertCircle size={14} className="text-rose-600" /> }
                      ].map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            setSupportFilter(folder.id as any);
                            setSelectedTicket(null);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            supportFilter === folder.id
                              ? "bg-blue-50 text-blue-800 border border-blue-100"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {folder.icon}
                            {folder.label}
                          </span>
                        </button>
                      ))
                    ) : (
                      [
                        { id: "pending", label: "Pending", icon: <AlertCircle size={14} className="text-red-500" />, count: contactMessages.filter(m => (m.status || 'pending') === 'pending').length },
                        { id: "in_progress", label: "In Progress", icon: <Clock size={14} className="text-amber-500" />, count: contactMessages.filter(m => m.status === 'in_progress').length },
                        { id: "resolved", label: "Resolved", icon: <CheckCircle size={14} className="text-emerald-500" />, count: contactMessages.filter(m => m.status === 'resolved').length },
                        { id: "spam", label: "Spam", icon: <XCircle size={14} className="text-slate-400" />, count: contactMessages.filter(m => m.status === 'spam').length }
                      ].map(folder => (
                        <button
                          key={folder.id}
                          onClick={() => {
                            setSupportFilter(folder.id as any);
                            setSelectedMessage(null);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                            supportFilter === folder.id
                              ? "bg-blue-50 text-blue-800 border border-blue-100"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {folder.icon}
                            {folder.label}
                          </span>
                          <span className="bg-white px-2 py-0.5 rounded-lg text-xs border border-slate-200">
                            {folder.count}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* INBOX RECORDS LIST */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-sm">
                      {supportActiveMode === "canonical" ? "Support Tickets" : "Legacy Inquiries"}
                    </span>
                    <button
                      onClick={supportActiveMode === "canonical" ? fetchSupportTickets : fetchSupportMessages}
                      disabled={loadingTickets || loadingMessages}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={14} className={loadingTickets || loadingMessages ? "animate-spin" : ""} />
                    </button>
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
                    {supportActiveMode === "canonical" ? (
                      loadingTickets ? (
                        <div className="p-6 text-center text-slate-400 text-sm animate-pulse">Loading tickets...</div>
                      ) : ticketsList.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No tickets found.</div>
                      ) : (
                        ticketsList.map(ticket => (
                          <div
                            key={ticket.id}
                            onClick={() => {
                              setSelectedTicket(ticket);
                              fetchTicketDetails(ticket.ticket_number);
                            }}
                            className={`p-4 cursor-pointer transition-colors ${
                              selectedTicket?.id === ticket.id ? "bg-blue-50 border-l-4 border-l-blue-800" : "hover:bg-slate-50 border-l-4 border-l-transparent"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-slate-800 text-xs truncate max-w-[150px]">
                                {ticket.metadata?.name || ticket.requester_id}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {new Date(ticket.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-[10px] text-blue-800 font-bold mb-1">
                              {ticket.ticket_number}
                            </div>
                            <div className="text-xs font-semibold text-slate-600 truncate mb-1">
                              {ticket.subject}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold uppercase">
                                {ticket.category}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                ticket.priority === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                'bg-slate-100 text-slate-600'
                              }`}>
                                {ticket.priority}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                ticket.sla_state.includes('BREACHED') ? 'bg-rose-100 text-rose-700 font-extrabold animate-pulse' :
                                ticket.sla_state === 'MET' ? 'bg-emerald-100 text-emerald-700' :
                                'bg-blue-50 text-blue-700'
                              }`}>
                                {ticket.sla_state}
                              </span>
                            </div>
                          </div>
                        ))
                      )
                    ) : (
                      loadingMessages ? (
                        <div className="p-6 text-center text-slate-400 text-sm animate-pulse">Loading messages...</div>
                      ) : contactMessages.filter(m => (m.status || 'pending') === supportFilter).length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm">No inquiries found.</div>
                      ) : (
                        contactMessages
                          .filter(m => (m.status || 'pending') === supportFilter)
                          .map(msg => (
                            <div
                              key={msg.id}
                              onClick={() => {
                                setSelectedMessage(msg);
                                setAdminNotesInput(msg.admin_notes || "");
                                setDraftReply("");
                              }}
                              className={`p-4 cursor-pointer transition-colors ${
                                selectedMessage?.id === msg.id ? "bg-blue-50 border-l-4 border-l-blue-600" : "hover:bg-slate-50 border-l-4 border-l-transparent"
                              }`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-slate-800 text-sm truncate">{msg.name}</span>
                                <span className="text-[10px] text-slate-400 shrink-0">
                                  {new Date(msg.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-slate-600 truncate mb-1">
                                {msg.subject || "No Subject"}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-2">
                                {msg.message}
                              </p>
                            </div>
                          ))
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT DETAIL WORKSPACE */}
              <div className="w-full md:w-2/3">
                {supportActiveMode === "canonical" ? (
                  selectedTicket ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col space-y-6">
                      
                      {/* Ticket Header */}
                      <div className="flex flex-col sm:flex-row items-start justify-between border-b border-slate-100 pb-6 gap-4">
                        <div>
                          <span className="text-xs text-blue-800 font-bold mb-1 block">
                            {selectedTicket.ticket_number}
                          </span>
                          <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
                            {selectedTicket.subject}
                          </h2>
                          <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-500">
                            <div>
                              Requester: <span className="font-semibold text-slate-700">{selectedTicket.metadata?.name || "User"}</span> ({selectedTicket.requester_role})
                            </div>
                            <div>
                              Email: <span className="font-semibold text-slate-700">{selectedTicket.metadata?.email || "N/A"}</span>
                            </div>
                            {selectedTicket.metadata?.phone && (
                              <div>
                                Phone: <span className="font-semibold text-slate-700">{selectedTicket.metadata.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dropdown controls */}
                        <div className="flex flex-wrap gap-2.5">
                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                            <select
                              value={selectedTicket.status}
                              onChange={(e) => handleUpdateTicketProperties({ status: e.target.value })}
                              className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                            >
                              <option value="OPEN">Open</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="RESOLVED">Resolved</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Priority</label>
                            <select
                              value={selectedTicket.priority}
                              onChange={(e) => handleUpdateTicketProperties({ priority: e.target.value })}
                              className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                            >
                              <option value="LOW">Low</option>
                              <option value="MEDIUM">Medium</option>
                              <option value="HIGH">High</option>
                              <option value="CRITICAL">Critical</option>
                            </select>
                          </div>

                          <div>
                            <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Assigned Agent</label>
                            <select
                              value={selectedTicket.assigned_to || ""}
                              onChange={(e) => handleUpdateTicketProperties({ assigned_to: e.target.value || null })}
                              className="px-2.5 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white cursor-pointer"
                            >
                              <option value="">Unassigned</option>
                              {usersList.map((usr: any) => (
                                <option key={usr.id} value={usr.id}>{usr.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* SLA Metrics Panel */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border border-slate-100 bg-slate-50/50 rounded-2xl">
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">SLA State</span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            selectedTicket.sla_state.includes('BREACHED') ? 'bg-rose-100 text-rose-700' :
                            selectedTicket.sla_state === 'MET' ? 'bg-emerald-100 text-emerald-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedTicket.sla_state}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">First Response Target</span>
                          <span className="text-xs font-semibold text-slate-750">
                            {selectedTicket.first_response_due_at ? new Date(selectedTicket.first_response_due_at).toLocaleString() : "N/A"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">Resolution Target</span>
                          <span className="text-xs font-semibold text-slate-750">
                            {selectedTicket.resolution_due_at ? new Date(selectedTicket.resolution_due_at).toLocaleString() : "N/A"}
                          </span>
                        </div>
                      </div>

                      {/* Ticket Description */}
                      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Description / Inquiry</span>
                        <p className="text-slate-700 text-xs leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                      </div>

                      {/* Conversation Timeline messages */}
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timeline / Conversation</h3>
                        
                        <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-2">
                          {ticketMessages.map((msg) => {
                            const isAgent = msg.sender_role === "ADMIN" || msg.sender_role === "SUPPORT_AGENT";
                            const isInternal = msg.is_internal === true;
                            
                            return (
                              <div
                                key={msg.id}
                                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                                  isInternal
                                    ? "bg-amber-50 border border-amber-200 text-amber-900 ml-auto"
                                    : isAgent
                                    ? "bg-blue-50 border border-blue-100 text-blue-900 ml-auto"
                                    : "bg-slate-50 border border-slate-100 text-slate-800"
                                }`}
                              >
                                <div className="flex justify-between items-center gap-4 mb-1">
                                  <span className="font-bold">
                                    {isInternal ? "Internal Note" : isAgent ? `Agent Reply (${msg.sender_id})` : "User Message"}
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reply Composer */}
                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name="msg_mode"
                                checked={!replyIsInternal}
                                onChange={() => setReplyIsInternal(false)}
                                className="accent-blue-800"
                              />
                              Public Reply
                            </label>
                            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer">
                              <input
                                type="radio"
                                name="msg_mode"
                                checked={replyIsInternal}
                                onChange={() => setReplyIsInternal(true)}
                                className="accent-amber-600"
                              />
                              Internal Note
                            </label>
                          </div>

                          <button
                            onClick={handleGenerateReply}
                            disabled={isGeneratingReply}
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-[10px] font-bold hover:bg-indigo-100 cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles size={11} /> Generate AI Draft
                          </button>
                        </div>

                        {/* Admin Article Linking tool */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Link Knowledge Base Article</span>
                            <input
                              type="text"
                              value={adminArticleQuery}
                              onChange={(e) => setAdminArticleQuery(e.target.value)}
                              placeholder="Search articles to insert link..."
                              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] outline-none w-48 focus:border-blue-800"
                            />
                          </div>
                          
                          {loadingAdminArticles && <div className="text-[10px] text-slate-400">Searching...</div>}
                          
                          {adminArticlesList.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {adminArticlesList.map((art) => (
                                <div key={art.slug} className="flex items-center justify-between gap-4 bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                                  <span className="font-semibold text-slate-700 truncate max-w-[280px]">{art.title}</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setReplyText(prev => `${prev}\nRead more: https://thecouragelibrary.com/help/${art.slug}\n`);
                                        showToast("Link inserted!");
                                      }}
                                      className="px-2 py-0.5 bg-blue-50 text-blue-850 hover:bg-blue-100 font-bold rounded text-[9px] cursor-pointer"
                                    >
                                      Insert Link
                                    </button>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(`https://thecouragelibrary.com/help/${art.slug}`);
                                        showToast("Link copied!");
                                      }}
                                      className="px-2 py-0.5 bg-slate-50 text-slate-600 hover:bg-slate-100 font-bold rounded text-[9px] cursor-pointer"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value.slice(0, 2000))}
                            placeholder={replyIsInternal ? "Type internal note..." : "Type response to parent..."}
                            className={`w-full p-4 border rounded-xl text-xs outline-none focus:ring-2 min-h-[100px] resize-none ${
                              replyIsInternal
                                ? "border-amber-200 focus:ring-amber-500/10 focus:border-amber-400 bg-amber-50/10"
                                : "border-slate-200 focus:ring-blue-800/10 focus:border-blue-800"
                            }`}
                            disabled={submittingMessage}
                          />
                          <span className="absolute bottom-3 right-3 text-[9px] text-slate-400 font-bold">
                            {replyText.length} / 2000
                          </span>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={handleSendReply}
                            disabled={submittingMessage || !replyText.trim()}
                            className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white cursor-pointer shadow-md transition-all disabled:opacity-60 ${
                              replyIsInternal
                                ? "bg-amber-600 hover:bg-amber-700 shadow-amber-600/10"
                                : "bg-blue-800 hover:bg-blue-700 shadow-blue-800/10"
                            }`}
                          >
                            {submittingMessage ? "Saving..." : replyIsInternal ? "Save Note" : "Send Reply"}
                          </button>
                        </div>
                      </div>

                      {/* Notification logs list */}
                      <div className="border-t border-slate-100 pt-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notification Delivery Logs</h3>
                          {loadingNotifications && <span className="text-[10px] text-slate-400 animate-pulse">Refreshing...</span>}
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                                <th className="pb-2">Recipient</th>
                                <th className="pb-2">Channel</th>
                                <th className="pb-2">Template</th>
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Attempts</th>
                                <th className="pb-2 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-slate-700">
                              {ticketNotifications.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-4 text-center text-slate-400">No notifications enqueued or sent.</td>
                                </tr>
                              ) : (
                                ticketNotifications.map((notif: any) => (
                                  <tr key={notif.id} className="hover:bg-slate-50/50">
                                    <td className="py-2.5 font-mono">{notif.recipient}</td>
                                    <td className="py-2.5 font-semibold text-[10px] uppercase text-slate-500">{notif.channel}</td>
                                    <td className="py-2.5 truncate max-w-[120px] font-mono text-[10px]">{notif.template_name}</td>
                                    <td className="py-2.5">
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                        notif.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                                        notif.status === 'FAILED' ? 'bg-rose-100 text-rose-800' :
                                        'bg-amber-100 text-amber-800'
                                      }`}>
                                        {notif.status}
                                      </span>
                                    </td>
                                    <td className="py-2.5">{notif.attempts} / 3</td>
                                    <td className="py-2.5 text-right">
                                      {notif.status === 'FAILED' && (
                                        <button
                                          onClick={() => handleRetryNotification(notif.id)}
                                          className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[10px] font-bold rounded cursor-pointer transition-colors"
                                        >
                                          Retry
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <MessageSquare size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">No Ticket Selected</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Select a support ticket from the list on the left to resolve detail timelines, add internal notes, and update statuses.
                      </p>
                    </div>
                  )
                ) : (
                  selectedMessage ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col h-full space-y-6">
                      
                      {/* Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-6">
                        <div>
                          <h2 className="font-display font-bold text-2xl text-slate-800 mb-2">
                            {selectedMessage.subject || "No Subject"}
                          </h2>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1.5 text-slate-600">
                              <span className="font-semibold text-slate-800">{selectedMessage.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600 hover:underline">
                                {selectedMessage.email}
                              </a>
                            </div>
                            {selectedMessage.phone && (
                              <div className="flex items-center gap-1.5 text-slate-500">
                                {selectedMessage.phone}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(selectedMessage.created_at).toLocaleString()}
                          </span>
                          <div className="flex gap-2">
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                              {selectedMessage.source || 'Website'}
                            </span>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                              selectedMessage.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                              selectedMessage.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {selectedMessage.priority || 'Normal'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Message Body */}
                      <div className="flex-1 min-h-[150px]">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Message</h3>
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedMessage.message}
                        </div>
                      </div>

                      {/* Admin Notes */}
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Internal Notes</h3>
                        <textarea
                          value={adminNotesInput}
                          onChange={(e) => setAdminNotesInput(e.target.value)}
                          placeholder="Add internal notes about handling this inquiry..."
                          className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all min-h-[100px]"
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleUpdateSupportMessage(selectedMessage.id, { admin_notes: adminNotesInput })}
                            disabled={updatingSupport}
                            className="px-4 py-2 bg-slate-800 text-white text-xs font-bold rounded-lg hover:bg-slate-700 cursor-pointer disabled:opacity-50"
                          >
                            Save Notes
                          </button>
                        </div>
                      </div>

                      {/* AI Draft Reply */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Draft Reply</h3>
                          <button
                            onClick={handleGenerateReply}
                            disabled={isGeneratingReply}
                            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles size={12} />
                            {isGeneratingReply ? "Generating..." : "Generate AI Reply"}
                          </button>
                        </div>
                        <textarea
                          value={draftReply}
                          onChange={(e) => setDraftReply(e.target.value)}
                          placeholder="Click 'Generate AI Reply' to draft a response, or type manually..."
                          className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all min-h-[120px] bg-indigo-50/30"
                        />
                      </div>

                      {/* Actions Panel */}
                      <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Actions & Reply</h3>
                        <div className="flex flex-wrap gap-3">
                          
                          <a 
                            href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || 'Your Inquiry to CNTS')}&body=${encodeURIComponent(draftReply || `Hello ${selectedMessage.name},\n\nThank you for contacting CNTS.\n\nRegarding your query:\n\n[Type your response here]\n\nRegards,\nCNTS Support Team\n`)}`}
                            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-all"
                          >
                            <Send size={16} />
                            Reply via Email
                          </a>

                          {selectedMessage.phone && (
                            <a 
                              href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}?text=${encodeURIComponent(draftReply || `Hello ${selectedMessage.name},\n\nThank you for contacting CNTS.\n\nRegarding your query:\n\n[Type your response here]\n\nRegards,\nCNTS Support Team\n`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-sm font-semibold transition-all"
                            >
                              <MessageSquare size={16} />
                              Reply via WhatsApp
                            </a>
                          )}

                          <div className="flex-1"></div>

                          <select
                            value={selectedMessage.status || 'pending'}
                            onChange={(e) => handleUpdateSupportMessage(selectedMessage.id, { status: e.target.value })}
                            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 outline-none cursor-pointer hover:bg-slate-50"
                            disabled={updatingSupport}
                          >
                            <option value="pending">Mark as Pending</option>
                            <option value="in_progress">Mark as In Progress</option>
                            <option value="resolved">Mark as Resolved</option>
                            <option value="spam">Mark as Spam</option>
                          </select>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="bg-white border border-slate-100 rounded-3xl p-12 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <MessageSquare size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-2">No Inquiry Selected</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        Select an inquiry from the legacy list on the left to view details, add internal notes, and update statuses.
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 6: School Partners */}
        {activeTab === "schools" && (
          <SchoolPartnersPanel />
        )}

        {/* Tab 8: Question Bank */}
        {activeTab === "questions" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-805 text-base">
                  {selectedQuestion ? "Edit Question" : "Create New Question"}
                </h3>
                {selectedQuestion && (
                  <button
                    onClick={resetQuestionEditor}
                    className="text-xs text-slate-400 hover:text-slate-655 font-bold"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveQuestion} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-705">Question Text *</label>
                  <textarea
                    value={qText}
                    onChange={(e) => setQText(e.target.value)}
                    placeholder="e.g. In a code language, if FRUIT is written as GTVJU..."
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 font-medium text-slate-800"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Subject *</label>
                    <select
                      value={qSubject}
                      onChange={(e) => setQSubject(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 cursor-pointer"
                    >
                      <option value="Mathematics">Mathematics</option>
                      <option value="Reasoning">Reasoning</option>
                      <option value="Language">Language</option>
                      <option value="Science">Science</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Chapter *</label>
                    <input
                      type="text"
                      value={qChapter}
                      onChange={(e) => setQChapter(e.target.value)}
                      placeholder="e.g. Algebra"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Topic *</label>
                    <input
                      type="text"
                      value={qTopic}
                      onChange={(e) => setQTopic(e.target.value)}
                      placeholder="e.g. Linear Eq"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Subtopic</label>
                    <input
                      type="text"
                      value={qSubtopic}
                      onChange={(e) => setQSubtopic(e.target.value)}
                      placeholder="e.g. Graphing"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Bloom Level *</label>
                    <select
                      value={qBloom}
                      onChange={(e) => setQBloom(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 cursor-pointer"
                    >
                      <option value="REMEMBERING">Remembering</option>
                      <option value="UNDERSTANDING">Understanding</option>
                      <option value="APPLYING">Applying</option>
                      <option value="ANALYZING">Analyzing</option>
                      <option value="EVALUATING">Evaluating</option>
                      <option value="CREATING">Creating</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Difficulty (0.0-1.0) *</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.00"
                      max="1.00"
                      value={qDifficulty}
                      onChange={(e) => setQDifficulty(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Marks *</label>
                    <input
                      type="number"
                      step="0.5"
                      value={qMarks}
                      onChange={(e) => setQMarks(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Neg Marks</label>
                    <input
                      type="number"
                      step="0.25"
                      value={qNegMarks}
                      onChange={(e) => setQNegMarks(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-707">Options & Answer Keys *</label>
                  <div className="space-y-2">
                    {qOptions.map((opt, oIdx) => (
                      <div key={opt.id} className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={opt.isCorrect}
                          onChange={(e) => {
                            setQOptions(prev => prev.map((o, idx) => ({
                              ...o,
                              isCorrect: idx === oIdx ? e.target.checked : o.isCorrect
                            })));
                          }}
                          className="w-4 h-4 text-blue-800 rounded border-slate-300"
                        />
                        <span className="text-xs font-bold text-slate-400">{String.fromCharCode(65 + oIdx)}:</span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            setQOptions(prev => prev.map((o, idx) => idx === oIdx ? { ...o, text: e.target.value } : o));
                          }}
                          placeholder={`Option content`}
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-705">Step-by-Step Explanation</label>
                  <textarea
                    value={qExplanation}
                    onChange={(e) => setQExplanation(e.target.value)}
                    placeholder="Provide step-by-step logic to display on parent scorecards..."
                    rows={3}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Approval Status *</label>
                    <select
                      value={qApprovalStatus}
                      onChange={(e) => setQApprovalStatus(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 cursor-pointer"
                    >
                      <option value="DRAFT">Draft Mode</option>
                      <option value="UNDER_REVIEW">In Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="RETIRED">Retired</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Solve Time (Seconds) *</label>
                    <input
                      type="number"
                      value={qSolveTime}
                      onChange={(e) => setQSolveTime(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={qSaving}
                  className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {qSaving ? "Saving Question..." : selectedQuestion ? "Update Question Details" : "Publish Question"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-805 text-base">
                  Question Registry
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                  {questionsList.length} items
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search question text..."
                    value={qSearch}
                    onChange={(e) => setQSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                  />
                </div>
                <select
                  value={qFilterSubject}
                  onChange={(e) => setQFilterSubject(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="ALL">All Subjects</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Reasoning">Reasoning</option>
                  <option value="Language">Language</option>
                  <option value="Science">Science</option>
                </select>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px] pr-2">
                {loadingQuestions ? (
                  <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing registry...</div>
                ) : questionsList.filter(q => {
                  const matchS = q.question_text.toLowerCase().includes(qSearch.toLowerCase()) || q.topic.toLowerCase().includes(qSearch.toLowerCase());
                  const matchF = qFilterSubject === "ALL" || q.subject === qFilterSubject;
                  return matchS && matchF;
                }).length > 0 ? (
                  questionsList.filter(q => {
                    const matchS = q.question_text.toLowerCase().includes(qSearch.toLowerCase()) || q.topic.toLowerCase().includes(qSearch.toLowerCase());
                    const matchF = qFilterSubject === "ALL" || q.subject === qFilterSubject;
                    return matchS && matchF;
                  }).map((q) => (
                    <div
                      key={q.id}
                      onClick={() => {
                        setSelectedQuestion(q);
                        setQText(q.question_text);
                        setQExplanation(q.explanation || "");
                        setQDifficulty(q.difficulty_index);
                        setQBloom(q.bloom_taxonomy);
                        setQSubject(q.subject);
                        setQChapter(q.chapter);
                        setQTopic(q.topic);
                        setQSubtopic(q.subtopic || "");
                        setQSolveTime(q.estimated_solve_time);
                        setQMarks(q.marks);
                        setQNegMarks(q.negative_marks);
                        setQOptions(q.options || [
                          { id: "opt-1", text: "", isCorrect: false },
                          { id: "opt-2", text: "", isCorrect: false },
                          { id: "opt-3", text: "", isCorrect: false },
                          { id: "opt-4", text: "", isCorrect: false }
                        ]);
                        setQApprovalStatus(q.approval_status);
                      }}
                      className="py-3 flex flex-col justify-between items-start gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="w-full">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-2">{q.question_text}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{q.subject} • {q.chapter} • {q.topic}</p>
                      </div>
                      <div className="flex w-full justify-between items-center text-[8px] font-bold text-slate-550">
                        <span className={`px-2 py-0.5 rounded uppercase font-black ${
                          q.approval_status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : q.approval_status === "DRAFT"
                            ? "bg-slate-50 text-slate-700 border border-slate-100"
                            : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                          {q.approval_status}
                        </span>
                        <div className="flex gap-2">
                          <span>Difficulty: {q.difficulty_index}</span>
                          <span>v{q.version}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No questions matched search filters.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: CMS Subsystem */}
        {activeTab === "cms" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-800 text-base">
                  {selectedCms ? "Edit CMS Article" : "Create New CMS Article"}
                </h3>
                {selectedCms && (
                  <button
                    onClick={() => {
                      setSelectedCms(null);
                      setCmsTitle("");
                      setCmsSlug("");
                      setCmsContent("");
                      setCmsPublished(true);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-655 font-bold"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveCms} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Article Title *</label>
                    <input
                      type="text"
                      value={cmsTitle}
                      onChange={(e) => {
                        setCmsTitle(e.target.value);
                        if (!selectedCms) {
                          setCmsSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                        }
                      }}
                      placeholder="e.g. FAQ: What is CNTS?"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">SEO Slug *</label>
                    <input
                      type="text"
                      value={cmsSlug}
                      onChange={(e) => setCmsSlug(e.target.value)}
                      placeholder="e.g. faq-what-is-cnts"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 font-mono"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Category *</label>
                    <select
                      value={cmsCategory}
                      onChange={(e) => setCmsCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    >
                      <option value="FAQ">FAQ Section</option>
                      <option value="BLOG">Blog Post</option>
                      <option value="ANNOUNCEMENT">Announcement</option>
                      <option value="LANDING">Landing Page Content</option>
                      <option value="GETTING_STARTED">Getting Started</option>
                      <option value="REGISTRATION">Registration</option>
                      <option value="PAYMENT">Payment</option>
                      <option value="ACADEMY">Academy</option>
                      <option value="EXAM">Exam</option>
                      <option value="RESULTS">Results</option>
                      <option value="SCHOOL">School</option>
                      <option value="ACCOUNT">Account</option>
                      <option value="TECHNICAL">Technical</option>
                      <option value="GENERAL">General</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-705 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={cmsPublished}
                        onChange={(e) => setCmsPublished(e.target.checked)}
                        className="w-4 h-4 text-blue-800 rounded border-slate-300"
                      />
                      Publish Immediately (Publicly Visible)
                    </label>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-705">Markdown Content *</label>
                  <textarea
                    value={cmsContent}
                    onChange={(e) => setCmsContent(e.target.value)}
                    placeholder="Write article details in Markdown..."
                    rows={12}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 font-mono"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={cmsSaving}
                  className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {cmsSaving ? "Saving..." : selectedCms ? "Update Article" : "Publish Article"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-800 text-base">
                  Published Directory
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                  {cmsArticles.length} items
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={cmsSearch}
                    onChange={(e) => setCmsSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                  />
                </div>
                <select
                  value={cmsFilter}
                  onChange={(e) => setCmsFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="FAQ">FAQs</option>
                  <option value="BLOG">Blogs</option>
                  <option value="ANNOUNCEMENT">Announcements</option>
                  <option value="LANDING">Landings</option>
                </select>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[460px] pr-2">
                {loadingCms ? (
                  <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing directory...</div>
                ) : cmsArticles.filter(art => {
                  const matchS = art.title.toLowerCase().includes(cmsSearch.toLowerCase()) || art.slug.toLowerCase().includes(cmsSearch.toLowerCase());
                  const matchF = cmsFilter === "ALL" || art.category === cmsFilter;
                  return matchS && matchF;
                }).length > 0 ? (
                  cmsArticles.filter(art => {
                    const matchS = art.title.toLowerCase().includes(cmsSearch.toLowerCase()) || art.slug.toLowerCase().includes(cmsSearch.toLowerCase());
                    const matchF = cmsFilter === "ALL" || art.category === cmsFilter;
                    return matchS && matchF;
                  }).map((art) => (
                    <div
                      key={art.id}
                      onClick={() => {
                        setSelectedCms(art);
                        setCmsTitle(art.title);
                        setCmsSlug(art.slug);
                        setCmsCategory(art.category);
                        setCmsContent(art.content);
                        setCmsPublished(art.published);
                      }}
                      className="py-3 flex justify-between items-start gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-105 last:border-0"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{art.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium font-mono truncate">{art.slug}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[8px] px-2 py-0.5 rounded uppercase font-black ${
                          art.category === "FAQ"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : art.category === "BLOG"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                        }`}>
                          {art.category}
                        </span>
                        <span className={`text-[8px] font-bold ${art.published ? "text-emerald-600" : "text-slate-400"}`}>
                          {art.published ? "Live" : "Draft"} (v{art.version})
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No CMS pages matched search filters.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: Exam Builder */}
        {activeTab === "exams" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-805 text-base">
                  {selectedExam ? "Edit Assessment Blueprint" : "Build New Assessment"}
                </h3>
                {selectedExam && (
                  <button
                    onClick={resetExamEditor}
                    className="text-xs text-slate-400 hover:text-slate-655 font-bold"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveExam} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Assessment Title *</label>
                    <input
                      type="text"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="e.g. National Scholarship Exam Grade 5"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Exam Type *</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 cursor-pointer"
                    >
                      <option value="MOCK_EXAM">Mock Exam</option>
                      <option value="PRACTICE_TEST">Practice Test</option>
                      <option value="DAILY_CHALLENGE">Daily Challenge</option>
                      <option value="WORKSHEET">Worksheet</option>
                      <option value="OFFICIAL_EXAM">Official Exam</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Duration (Minutes) *</label>
                    <input
                      type="number"
                      value={examDuration}
                      onChange={(e) => setExamDuration(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-705 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={examPublished}
                        onChange={(e) => setExamPublished(e.target.checked)}
                        className="w-4 h-4 text-blue-800 rounded border-slate-300"
                      />
                      Publish immediately
                    </label>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">Section Blueprints *</label>
                    <button
                      type="button"
                      onClick={() => setExamSections([...examSections, { name: `Section ${examSections.length + 1}`, questionCount: 10, marks: 4.0, negativeMarks: 0.0 }])}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                    >
                      + Add Section
                    </button>
                  </div>

                  <div className="space-y-3">
                    {examSections.map((sec, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-105">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Section Name</label>
                          <input
                            type="text"
                            value={sec.name}
                            onChange={(e) => setExamSections(prev => prev.map((s, idx) => idx === sIdx ? { ...s, name: e.target.value } : s))}
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Count</label>
                          <input
                            type="number"
                            value={sec.questionCount}
                            onChange={(e) => setExamSections(prev => prev.map((s, idx) => idx === sIdx ? { ...s, questionCount: Number(e.target.value) } : s))}
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase">Marks</label>
                          <input
                            type="number"
                            step="0.5"
                            value={sec.marks}
                            onChange={(e) => setExamSections(prev => prev.map((s, idx) => idx === sIdx ? { ...s, marks: Number(e.target.value) } : s))}
                            className="w-full px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={examSaving}
                  className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {examSaving ? "Saving Assessment..." : selectedExam ? "Update Blueprint Details" : "Launch Assessment"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-805 text-base">
                  Assessment Registry
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                  {assessmentsList.length} items
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search title..."
                    value={examSearch}
                    onChange={(e) => setExamSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px] pr-2">
                {loadingExams ? (
                  <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing registry...</div>
                ) : assessmentsList.filter(a => a.title.toLowerCase().includes(examSearch.toLowerCase())).length > 0 ? (
                  assessmentsList.filter(a => a.title.toLowerCase().includes(examSearch.toLowerCase())).map((a) => (
                    <div
                      key={a.id}
                      onClick={() => {
                        setSelectedExam(a);
                        setExamTitle(a.title);
                        setExamType(a.type);
                        setExamDuration(a.duration_minutes);
                        setExamSections(a.sections || []);
                        setExamPublished(a.is_published);
                      }}
                      className="py-3 flex flex-col justify-between items-start gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="w-full min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{a.title}</h4>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Duration: {a.duration_minutes} Mins • {a.sections?.length || 0} Sections</p>
                      </div>
                      <div className="flex w-full justify-between items-center text-[8px] font-bold">
                        <span className={`px-2 py-0.5 rounded uppercase font-black ${
                          a.is_published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-slate-50 text-slate-700 border border-slate-100"
                        }`}>
                          {a.is_published ? "Live" : "Draft"}
                        </span>
                        <span className="text-slate-400 font-bold uppercase">{a.type}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No assessments matched filters.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 10: User Management & RBAC */}
        {activeTab === "users" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-805 text-base">
                  {selectedUser ? "Edit User Permissions" : "Register Admin User"}
                </h3>
                {selectedUser && (
                  <button
                    onClick={resetUserEditor}
                    className="text-xs text-slate-400 hover:text-slate-655 font-bold"
                  >
                    Clear Editor
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Email Address</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="e.g. coordinator@courage.org"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Phone Number (with Country Code)</label>
                    <input
                      type="text"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. 918707884735"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Assigned Role *</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800 cursor-pointer"
                    >
                      <option value="VOLUNTEER">Volunteer (Read-only)</option>
                      <option value="ADMIN">Administrator (Write access)</option>
                      <option value="SUPER_ADMIN">Super Administrator (All permissions)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800">Effective Permissions Set</h4>
                  <ul className="text-[10px] text-slate-500 space-y-1 list-disc list-inside">
                    {userRole === "SUPER_ADMIN" ? (
                      <>
                        <li>Full dashboard operations control</li>
                        <li>CMS, Question Bank, and Exam Builder writes</li>
                        <li>Referral coupon overrides and support ticketing replies</li>
                        <li>User role management & 2FA unlocks</li>
                      </>
                    ) : userRole === "ADMIN" ? (
                      <>
                        <li>CMS, Question Bank, and Exam Builder writes</li>
                        <li>Referral coupon overrides and support ticketing replies</li>
                        <li>No permission escalation or User table modifications</li>
                      </>
                    ) : (
                      <>
                        <li>Read-only access to registrations rosters and settings</li>
                        <li>Audit log explorer access</li>
                        <li>All write mutations are blocked</li>
                      </>
                    )}
                  </ul>
                </div>

                <button
                  type="submit"
                  disabled={userSaving}
                  className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow"
                >
                  {userSaving ? "Saving User..." : selectedUser ? "Update Permissions" : "Register User"}
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-800 text-base">
                  Authorized Personnel
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">
                  {usersList.length} users
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px] pr-2">
                {loadingUsers ? (
                  <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing registry...</div>
                ) : usersList.filter(u => !userSearch || (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))).length > 0 ? (
                  usersList.filter(u => !userSearch || (u.email && u.email.toLowerCase().includes(userSearch.toLowerCase()))).map((u) => (
                    <div
                      key={u.id}
                      onClick={() => {
                        setSelectedUser(u);
                        setUserEmail(u.email || "");
                        setUserPhone(u.phone_number || "");
                        setUserRole(u.role);
                      }}
                      className="py-3 flex flex-col justify-between items-start gap-2 cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <div className="w-full min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{u.email || "No Email"}</h4>
                        <p className="text-[10px] text-slate-455 font-medium mt-0.5 font-mono">{u.phone_number || "No Phone"}</p>
                      </div>
                      <div className="flex w-full justify-between items-center text-[8px] font-bold">
                        <span className={`px-2 py-0.5 rounded uppercase font-black ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : u.role === "ADMIN"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-slate-50 text-slate-700 border border-slate-100"
                        }`}>
                          {u.role}
                        </span>
                        <span className="text-slate-400 font-bold">Authorized</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No users matched search filters.</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 11: Finance Dashboard */}
        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Gross Revenue</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">₹{Number(financeKPIs.grossRevenue).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-400 mt-1">Total collections registered</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Net Revenue</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">₹{Number(financeKPIs.netRevenue).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-emerald-600 mt-1">Gross minus issued refunds</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Refunded Total</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">₹{Number(financeKPIs.refundSum).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-red-500 mt-1">Disbursed transaction returns</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Avg Ticket Size</p>
                <p className="text-2xl font-bold text-slate-800 mt-2">₹{Number(financeKPIs.avgRegValue).toLocaleString("en-IN")}</p>
                <p className="text-[10px] text-slate-400 mt-1">Per individual registration fee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-805 text-base">Issue School Refund</h3>
                  <p className="text-xs text-slate-500">Register returns for school coordinate accounts</p>
                </div>

                <form onSubmit={handleIssueRefund} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">School ID *</label>
                    <input
                      type="text"
                      value={refundSchoolId}
                      onChange={(e) => setRefundSchoolId(e.target.value)}
                      placeholder="Enter school record UUID"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Refund Amount (INR) *</label>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-705">Reference / Gateway ID</label>
                    <input
                      type="text"
                      value={refundRef}
                      onChange={(e) => setRefundRef(e.target.value)}
                      placeholder="e.g. ref_intent_99182"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-800"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={refundSaving}
                    className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    {refundSaving ? "Recording transaction..." : "Approve & Log Refund"}
                  </button>
                </form>
              </div>

              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-display font-bold text-slate-808 text-base">Double-Entry Ledger</h3>
                  <button
                    onClick={fetchFinance}
                    className="text-xs font-bold text-blue-800 flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={loadingFinance ? "animate-spin" : ""} />
                    Sync Ledger
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={financeSearch}
                      onChange={(e) => setFinanceSearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                    />
                  </div>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[460px] pr-2">
                  {loadingFinance ? (
                    <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing ledger...</div>
                  ) : financeTransactions.filter(tx => !financeSearch || tx.reference_id?.includes(financeSearch)).length > 0 ? (
                    financeTransactions.filter(tx => !financeSearch || tx.reference_id?.includes(financeSearch)).map((tx) => (
                      <div key={tx.id} className="py-3 flex justify-between items-center text-xs border-b border-slate-100 last:border-0">
                        <div>
                          <p className="font-bold text-slate-800">{tx.schools?.name || "Independent Parent Payment"}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">Ref: {tx.reference_id || "N/A"} • {new Date(tx.created_at).toLocaleString()}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className={`font-bold font-mono ${tx.amount < 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {tx.amount < 0 ? "-" : "+"}₹{Math.abs(Number(tx.amount)).toLocaleString("en-IN")}
                          </p>
                          <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${
                            tx.transaction_type === "INVOICE"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : tx.transaction_type === "PAYMENT"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-red-50 text-red-700 border border-red-100"
                          }`}>
                            {tx.transaction_type}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">No ledger entries matched search filters.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 12: Reports Center */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-display font-bold text-slate-808 text-base">Bulk Export Engine</h3>
                <p className="text-xs text-slate-500 font-medium">Extract system registers in CSV formats</p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Registrations Ledger</h4>
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,ID,Name,Class,Status\n" + registrations.map(r => `"${r.cnts_id}","${r.student_name}","${r.student_class}","${r.payment_status}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `cnts_registrations_export_${Date.now()}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      showToast("Registrations CSV downloaded successfully!");
                    }}
                    className="w-full py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    Export CSV
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800">Finance Double-Entry Ledger</h4>
                  <button
                    onClick={() => {
                      const csvContent = "data:text/csv;charset=utf-8,ID,Type,Amount,OutstandingBalance,RefID,CreatedAt\n" + financeTransactions.map(t => `"${t.id}","${t.transaction_type}","${t.amount}","${t.outstanding_balance}","${t.reference_id}","${t.created_at}"`).join("\n");
                      const encodedUri = encodeURI(csvContent);
                      const link = document.createElement("a");
                      link.setAttribute("href", encodedUri);
                      link.setAttribute("download", `cnts_finance_ledger_export_${Date.now()}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      showToast("Finance Ledger CSV downloaded successfully!");
                    }}
                    className="w-full py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow"
                  >
                    Export CSV
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-800 text-base">Templates & Schedules</h3>
              </div>

              <div className="space-y-4 pr-1">
                {[
                  { title: "Weekly Revenue Statement Summary", interval: "Weekly (Every Mon 08:00)", dest: "Finance Coordinator", active: true },
                  { title: "Daily Registrations Growth Analytics", interval: "Daily (Every Day 23:50)", dest: "Academic Leads", active: true },
                  { title: "Monthly GST Tax Audit Log Sheet", interval: "Monthly (1st Day 01:00)", dest: "GST Tax Auditor", active: true }
                ].map((s, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 bg-slate-50/20 rounded-2xl flex items-center justify-between transition-colors hover:bg-slate-50/50">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900">{s.title}</h4>
                      <p className="text-[10px] text-slate-500 font-medium font-mono">Interval: {s.interval} • Target: {s.dest}</p>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 13: Monitoring & Mission Control */}
        {activeTab === "monitoring" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Database Connection</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">Healthy</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">API Gateways Status</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">Healthy</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">System Latency (Avg)</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">114 ms</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Memory Allocation</p>
                  <p className="text-xl font-bold text-slate-800 mt-1">42% (6.7 GB)</p>
                </div>
                <div className="w-3 h-3 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50 animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                  <h3 className="font-display font-bold text-slate-808 text-base">Background Worker Jobs</h3>
                  <button
                    onClick={fetchMonitoring}
                    className="text-xs font-bold text-blue-800 flex items-center gap-1.5"
                  >
                    <RefreshCw size={12} className={loadingMonitoring ? "animate-spin" : ""} />
                    Sync Worker
                  </button>
                </div>

                <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px] pr-2">
                  {backgroundJobs.length > 0 ? (
                    backgroundJobs.map((job) => (
                      <div key={job.id} className="py-3 flex justify-between items-center text-xs border-b border-slate-100 last:border-0">
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800">{job.job_type}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono truncate">ID: {job.id} • Attempts: {job.attempts}/{job.max_attempts}</p>
                          {job.error_logs && <p className="text-[9px] text-red-500 mt-1 bg-red-50/50 p-2 rounded-lg border border-red-100 font-mono leading-relaxed">{job.error_logs}</p>}
                        </div>
                        <div className="text-right space-y-2 shrink-0">
                          <span className={`inline-block px-2 py-0.5 rounded font-black uppercase text-[8px] ${
                            job.status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : job.status === "FAILED"
                              ? "bg-red-50 text-red-700 border border-red-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {job.status}
                          </span>
                          {job.status === "FAILED" && (
                            <button
                              onClick={() => handleRetryJob(job.id)}
                              disabled={monitoringSaving}
                              className="block text-[9px] text-blue-800 hover:text-blue-700 font-bold ml-auto cursor-pointer"
                            >
                              Retry Job
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">No background job records found.</div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-display font-bold text-slate-808 text-base">Security & Health Alerts</h3>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[500px]">
                  {systemAlerts.length > 0 ? (
                    systemAlerts.map((alt) => (
                      <div key={alt.id} className={`p-4 rounded-2xl border ${
                        alt.resolved
                          ? "bg-slate-50 border-slate-100"
                          : alt.severity === "CRITICAL"
                          ? "bg-red-50/50 border-red-100 text-red-800"
                          : "bg-amber-50/50 border-amber-100 text-amber-800"
                      }`}>
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[10px] font-bold font-mono uppercase tracking-wider">{alt.alert_rule}</span>
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                            alt.resolved
                              ? "bg-slate-100 text-slate-600"
                              : alt.severity === "CRITICAL"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {alt.resolved ? "Resolved" : alt.severity}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-2 leading-relaxed font-medium">{alt.description}</p>
                        {!alt.resolved && (
                          <button
                            onClick={() => handleResolveAlert(alt.id)}
                            disabled={monitoringSaving}
                            className="mt-3 text-[10px] font-bold text-blue-800 hover:text-blue-700 cursor-pointer"
                          >
                            Resolve Alert
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400">All systems operational. No active alerts.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 14: Audit Explorer */}
        {activeTab === "audit" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-808 text-base">Immutable Audit Registry</h3>
                <button
                  onClick={fetchAuditLogs}
                  className="text-xs font-bold text-blue-800 flex items-center gap-1.5"
                >
                  <RefreshCw size={12} className={loadingAudit ? "animate-spin" : ""} />
                  Sync Registry
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by action or actor..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 bg-slate-50/50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <select
                  value={auditFilterModule}
                  onChange={(e) => setAuditFilterModule(e.target.value)}
                  className="w-full sm:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none cursor-pointer"
                >
                  <option value="ALL">All Modules</option>
                  <option value="EXAMS">Exams</option>
                  <option value="QUESTIONS">Questions</option>
                  <option value="CMS">CMS</option>
                  <option value="USERS">Users</option>
                  <option value="FINANCE">Finance</option>
                  <option value="SYSTEM">System</option>
                </select>
              </div>

              <div className="divide-y divide-slate-100 overflow-y-auto max-h-[500px] pr-2">
                {loadingAudit ? (
                  <div className="text-center py-8 text-xs text-slate-400 animate-pulse">Syncing registry...</div>
                ) : auditLogs.filter(log => {
                  const matchS = !auditSearch || log.action.toLowerCase().includes(auditSearch.toLowerCase()) || log.actor_role.toLowerCase().includes(auditSearch.toLowerCase());
                  const matchM = auditFilterModule === "ALL" || log.module === auditFilterModule;
                  return matchS && matchM;
                }).length > 0 ? (
                  auditLogs.filter(log => {
                    const matchS = !auditSearch || log.action.toLowerCase().includes(auditSearch.toLowerCase()) || log.actor_role.toLowerCase().includes(auditSearch.toLowerCase());
                    const matchM = auditFilterModule === "ALL" || log.module === auditFilterModule;
                    return matchS && matchM;
                  }).map((log) => (
                    <div
                      key={log.id}
                      onClick={() => setSelectedAudit(log)}
                      className="py-3 flex justify-between items-center text-xs border-b border-slate-100 last:border-0 cursor-pointer hover:bg-slate-50/50 transition-colors"
                    >
                      <div>
                        <p className="font-bold text-slate-800">{log.action}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Module: {log.module} • IP: {log.ip_address} • {new Date(log.created_at).toLocaleString()}</p>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${
                        log.actor_role === "SUPER_ADMIN"
                          ? "bg-red-50 text-red-700 border border-red-100"
                          : log.actor_role === "ADMIN"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : "bg-slate-50 text-slate-700 border border-slate-100"
                      }`}>
                        {log.actor_role}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">No audit logs matched search filters.</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4 animate-slide-up">
              <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                <h3 className="font-display font-bold text-slate-808 text-base">Diff & Payload Viewer</h3>
              </div>

              {selectedAudit ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500">Operation Action</p>
                    <p className="text-sm font-bold text-slate-800">{selectedAudit.action}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">Actor Role</p>
                      <p className="text-xs font-bold text-slate-800">{selectedAudit.actor_role}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-500">IP Address</p>
                      <p className="text-xs font-bold font-mono text-slate-800">{selectedAudit.ip_address}</p>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold text-slate-800">Payload Comparison State</p>
                    
                    <div className="space-y-2">
                      <div className="p-3 bg-red-50/50 rounded-xl border border-red-100">
                        <p className="text-[9px] font-bold text-red-700 uppercase">Previous State value</p>
                        <pre className="text-[10px] font-mono text-red-650 overflow-x-auto max-h-32 mt-1">
                          {JSON.stringify(selectedAudit.previous_value, null, 2)}
                        </pre>
                      </div>

                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                        <p className="text-[9px] font-bold text-emerald-700 uppercase">New State value</p>
                        <pre className="text-[10px] font-mono text-emerald-650 overflow-x-auto max-h-32 mt-1">
                          {JSON.stringify(selectedAudit.new_value, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-slate-400 font-medium">Select an entry from registry list to view JSON payload state difference comparisons.</div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-xl z-50 text-sm font-semibold animate-in fade-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
