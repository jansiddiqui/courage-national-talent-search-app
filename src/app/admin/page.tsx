"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

interface MetricCardProps {
  title: string;
  value: string | number;
  desc: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  color: string;
}

function MetricCard({ title, value, desc, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex items-start justify-between">
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          {title}
        </span>
        <h3 className="font-display font-bold text-3xl text-slate-800 leading-none">
          {value}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {desc}
        </p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} />
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

  // WhatsApp logs & test state
  const [waLogs, setWaLogs] = useState<any[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testType, setTestType] = useState("TEST");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "whatsapp" | "coupons" | "support">("overview");

  // Support Inbox states
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [supportFilter, setSupportFilter] = useState<"pending" | "in_progress" | "resolved" | "spam">("pending");
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState("");
  const [draftReply, setDraftReply] = useState("");
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [updatingSupport, setUpdatingSupport] = useState(false);

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
      } else {
        alert("Failed to update message.");
      }
    } catch (err) {
      console.error("Failed to update message:", err);
    } finally {
      setUpdatingSupport(false);
    }
  };

  const handleGenerateReply = async () => {
    if (!selectedMessage) return;
    setIsGeneratingReply(true);
    setDraftReply("");
    try {
      const res = await fetch("/api/admin/generate-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedMessage.name,
          subject: selectedMessage.subject,
          message: selectedMessage.message
        })
      });
      const data = await res.json();
      if (data.success && data.reply) {
        setDraftReply(data.reply);
      } else {
        alert(data.error || "Failed to generate reply.");
      }
    } catch (err) {
      alert("Error calling generate-reply API");
    } finally {
      setIsGeneratingReply(false);
    }
  };


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
        alert(data.message || "Failed to toggle coupon status.");
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
        alert(data.message || "Failed to delete coupon.");
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
      alert("No candidates match the selected audience filter.");
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
        await Promise.all([fetchWaLogs(), fetchCoupons(), fetchSupportMessages()]);
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
    const timer = setTimeout(() => {
      loadData();
      fetchWaLogs();
      fetchCoupons();
      fetchSupportMessages();
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
        alert("Failed to update system setting in database.");
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
        alert(`Success: ${data.message}`);
        setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "success" }));
      } else {
        alert(`Error: ${data.message || "Failed to send bulk notifications."}`);
        setBulkNotifyProgress(prev => ({ ...prev, [settingKey]: "failed" }));
      }
    } catch (err: any) {
      console.error("Bulk notify error:", err);
      alert(`Network error: ${err.message || "Could not dispatch notifications."}`);
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
      <div className="sticky top-0 z-40">
        {/* Top Banner Navigation */}
        <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 shrink-0">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
                CNTS Admin Center
              </h1>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Talent Discovery Auditing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => loadData(true)}
              disabled={refreshing}
              className={`flex-1 md:flex-none p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
                refreshing ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
              Sync
            </button>
            <button
              onClick={() => router.push("/admin/registrations")}
              className="flex-1 md:flex-none px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-800/10 hover:shadow-blue-700/20 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText size={13} />
              Registrations Table
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 md:px-12 shadow-sm overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="max-w-7xl mx-auto flex gap-6 w-max">
            {[
              { id: "overview", label: "Overview & Analytics", icon: Trophy },
              { id: "settings", label: "Global Settings", icon: Settings },
              { id: "whatsapp", label: "WhatsApp Control Center", icon: MessageSquare },
              { id: "coupons", label: "Promo & Coupon Manager", icon: Award },
              { id: "support", label: "Support Inbox", icon: MessageSquare }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 font-display text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                    isActive
                      ? "border-blue-800 text-blue-800"
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-10 md:px-12 space-y-8 animate-slide-up">
        
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
                  <p className="text-xs text-slate-505">Top 5 active locations</p>
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
                          <span className="text-slate-505 font-medium">
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
                  offColor: "text-red-650 bg-red-50 border-red-100"
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
                        className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-300 border border-transparent rounded-lg text-[10px] font-bold text-white transition-all flex items-center justify-center gap-1 cursor-pointer mt-1"
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
                    <div className="text-[11px] text-slate-505 font-medium">
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
                  <p className="text-xs text-slate-505">Manage checkout discount codes and their status</p>
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
            <div className="flex flex-col md:flex-row gap-6">
              
              {/* LEFT: INBOX FILTERS & LIST */}
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <h2 className="font-display font-bold text-xl text-slate-800 mb-6">Inbox Folders</h2>
                  <div className="space-y-2">
                    {[
                      { id: "pending", label: "Pending", icon: <AlertCircle size={14} className="text-red-500" />, count: contactMessages.filter(m => m.status === 'pending' || !m.status).length },
                      { id: "in_progress", label: "In Progress", icon: <Clock size={14} className="text-amber-500" />, count: contactMessages.filter(m => m.status === 'in_progress').length },
                      { id: "resolved", label: "Resolved", icon: <CheckCircle size={14} className="text-emerald-500" />, count: contactMessages.filter(m => m.status === 'resolved').length },
                      { id: "spam", label: "Spam", icon: <XCircle size={14} className="text-slate-400" />, count: contactMessages.filter(m => m.status === 'spam').length }
                    ].map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => setSupportFilter(folder.id as any)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          supportFilter === folder.id 
                            ? "bg-blue-50 text-blue-800 border border-blue-100" 
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"
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
                    ))}
                  </div>
                </div>

                {/* MESSAGE LIST */}
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm flex-1 flex flex-col h-[500px]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <span className="font-bold text-slate-700 text-sm">Messages</span>
                    <button
                      onClick={fetchSupportMessages}
                      disabled={loadingMessages}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={14} className={loadingMessages ? "animate-spin" : ""} />
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {loadingMessages ? (
                      <div className="p-6 text-center text-slate-400 text-sm animate-pulse">Loading messages...</div>
                    ) : contactMessages.filter(m => (m.status || 'pending') === supportFilter).length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm">No messages in this folder.</div>
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
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-colors ${
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
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT: SELECTED MESSAGE DETAILS */}
              <div className="w-full md:w-2/3">
                {selectedMessage ? (
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
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Message Selected</h3>
                    <p className="text-sm text-slate-500 max-w-sm">
                      Select a message from the inbox on the left to view details, add internal notes, and reply to the parent.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

    </div>
  );
}
