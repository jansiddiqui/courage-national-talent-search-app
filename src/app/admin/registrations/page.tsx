"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Search, 
  X, 
  User, 
  School, 
  Phone, 
  Mail, 
  Languages, 
  HelpCircle, 
  Copy, 
  Check, 
  RefreshCw,
  EyeIcon,
  MessageSquare,
  Sparkles,
  ClipboardList,
  FileText,
  Download
} from "lucide-react";
import { fetchRegistrations, fetchRegistrationEvents, saveRegistrationNote } from "@/services/supabaseService";
import { hasSupabaseConfig } from "@/lib/supabaseClient";

// 12 Mock registrations for demo mode
const MOCK_REGISTRATIONS = [
  { registration_id: "CNTS26-8XK4P", student_name: "Aditya Verma", student_class: "7", school_name: "Delhi Public School", school_city: "Kanpur", parent_name: "Sanjay Verma", whatsapp_number: "9876543210", parent_email: "sanjay.verma@example.com", state: "Uttar Pradesh", district: "Pune", language: "English", why_participating: "Talent Discovery", how_heard: "Instagram", utm_source: "Instagram", utm_medium: "Social", utm_campaign: "launch_campaign", referral_code: null, admin_notes: "Followed up with father.", payment_status: "PAID", created_at: new Date().toISOString() },
  { registration_id: "CNTS26-A7D9K", student_name: "Priya Sharma", student_class: "6", school_name: "Modern School", school_city: "Delhi", parent_name: "Kamal Sharma", whatsapp_number: "9812345678", parent_email: "kamal@example.com", state: "Delhi (NCT)", district: "Central Delhi", language: "English", why_participating: "Scholarship Opportunities", how_heard: "School", utm_source: "School", utm_medium: "Direct", utm_campaign: "school_outreach", referral_code: null, admin_notes: null, payment_status: "PENDING", created_at: new Date(Date.now() - 3600000).toISOString() },
  { registration_id: "CNTS26-K3M8Y", student_name: "Rohan Das", student_class: "8", school_name: "Don Bosco School", school_city: "Kolkata", parent_name: "Amit Das", whatsapp_number: "9988776655", parent_email: "amit.das@example.com", state: "West Bengal", district: "Kolkata", language: "English", why_participating: "Competitive Practice", how_heard: "Friend", utm_source: "WhatsApp", utm_medium: "Chat", utm_campaign: null, referral_code: "CNTS26-A7D9K", admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 7200000).toISOString() },
  { registration_id: "CNTS26-H4X1P", student_name: "Aanya Patel", student_class: "5", school_name: "Zydus School", school_city: "Ahmedabad", parent_name: "Nikhil Patel", whatsapp_number: "9765432109", parent_email: "nikhil@example.com", state: "Gujarat", district: "Ahmedabad", language: "English", why_participating: "National Ranking", how_heard: "Facebook", utm_source: "Facebook", utm_medium: "Social", utm_campaign: "paid_ads", referral_code: null, admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 86400000).toISOString() },
  { registration_id: "CNTS26-N9J4W", student_name: "Arjun Singh", student_class: "7", school_name: "St. John's Academy", school_city: "Lucknow", parent_name: "Manoj Singh", whatsapp_number: "9456789012", parent_email: "manoz.singh@example.com", state: "Uttar Pradesh", district: "Lucknow", language: "Hindi", why_participating: "Parent Recommendation", how_heard: "WhatsApp", utm_source: "WhatsApp", utm_medium: "Chat", utm_campaign: null, referral_code: null, admin_notes: null, payment_status: "PENDING", created_at: new Date(Date.now() - 172800000).toISOString() },
  { registration_id: "CNTS26-Q8F4L", student_name: "Diya Menon", student_class: "6", school_name: "Chinmaya Vidyalaya", school_city: "Kochi", parent_name: "Pradeep Menon", whatsapp_number: "9123456789", parent_email: "pradeep.menon@example.com", state: "Kerala", district: "Kochi", language: "English", why_participating: "Talent Discovery", how_heard: "Instagram", utm_source: "Instagram", utm_medium: "Social", utm_campaign: "influencers", referral_code: null, admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 259200000).toISOString() },
  { registration_id: "CNTS26-L5D7X", student_name: "Kabir Mehta", student_class: "5", school_name: "Singhania School", school_city: "Thane", parent_name: "Vikram Mehta", whatsapp_number: "9900112233", parent_email: "vikram.mehta@example.com", state: "Maharashtra", district: "Thane", language: "English", why_participating: "Competitive Practice", how_heard: "YouTube", utm_source: "YouTube", utm_medium: "Video", utm_campaign: "organic", referral_code: null, admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 345600000).toISOString() },
  { registration_id: "CNTS26-W3K9P", student_name: "Meera Nair", student_class: "8", school_name: "National Public School", school_city: "Bengaluru", parent_name: "Suresh Nair", whatsapp_number: "9898989898", parent_email: "suresh.nair@example.com", state: "Karnataka", district: "Bengaluru", language: "English", why_participating: "School Recommendation", how_heard: "School", utm_source: "School", utm_medium: "Direct", utm_campaign: null, referral_code: null, admin_notes: null, payment_status: "PENDING", created_at: new Date(Date.now() - 432000000).toISOString() },
  { registration_id: "CNTS26-M4P2Z", student_name: "Yash Gupta", student_class: "6", school_name: "CMS Lucknow", school_city: "Kanpur", parent_name: "Alok Gupta", whatsapp_number: "9565656565", parent_email: "alok.gupta@example.com", state: "Uttar Pradesh", district: "Kanpur", language: "Hindi", why_participating: "National Ranking", how_heard: "Friend", utm_source: null, utm_medium: null, utm_campaign: null, referral_code: "CNTS26-H4X1P", admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 518400000).toISOString() },
  { registration_id: "CNTS26-T9V5S", student_name: "Sania Mirza", student_class: "7", school_name: "Gitanjali Devshala", school_city: "Hyderabad", parent_name: "Imran Mirza", whatsapp_number: "9848022338", parent_email: "imran.mirza@example.com", state: "Telangana", district: "Hyderabad", language: "English", why_participating: "Talent Discovery", how_heard: "Instagram", utm_source: "Instagram", utm_medium: "Social", utm_campaign: null, referral_code: null, admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 604800000).toISOString() },
  { registration_id: "CNTS26-Y8H2K", student_name: "Devendra Jha", school_name: "St. Xavier's Patna", school_city: "Patna", student_class: "5", parent_name: "Anil Jha", whatsapp_number: "9112233445", parent_email: "anil.jha@example.com", state: "Bihar", district: "Patna", language: "Hindi", why_participating: "Scholarship Opportunities", how_heard: "Facebook", utm_source: "Facebook", utm_medium: "Social", utm_campaign: "paid_ads", referral_code: null, admin_notes: null, payment_status: "PENDING", created_at: new Date(Date.now() - 691200000).toISOString() },
  { registration_id: "CNTS26-Z7N3M", student_name: "Ishaan Kaul", student_class: "6", school_name: "DPS Gurugram", school_city: "Gurugram", parent_name: "Sanjay Kaul", whatsapp_number: "9311223344", parent_email: "sanjay.kaul@example.com", state: "Haryana", district: "Gurugram", language: "English", why_participating: "Competitive Practice", how_heard: "Other", utm_source: "YouTube", utm_medium: "Video", utm_campaign: "organic", referral_code: null, admin_notes: null, payment_status: "PAID", created_at: new Date(Date.now() - 777600000).toISOString() }
];

export default function AdminRegistrationsPage() {
  const router = useRouter();
  
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Active detail drawer record
  const [activeReg, setActiveReg] = useState<any | null>(null);
  const [activeEvents, setActiveEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Administrative Notes state
  const [adminNotesText, setAdminNotesText] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("");

  const loadData = async (showPulse = false) => {
    if (showPulse) setRefreshing(true);
    else setLoading(true);

    try {
      const dbData = await fetchRegistrations();
      if (!hasSupabaseConfig || dbData.length === 0) {
        setRegistrations(MOCK_REGISTRATIONS);
        setIsDemoMode(true);
      } else {
        setRegistrations(dbData);
        setIsDemoMode(false);
      }
    } catch (e) {
      console.error("Failed to fetch registrations", e);
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
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Filter logic computed dynamically on render
  const filteredRegs = (() => {
    let result = registrations;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => 
        (r.student_name?.toLowerCase() || "").includes(q) ||
        (r.school_name?.toLowerCase() || "").includes(q) ||
        (r.parent_name?.toLowerCase() || "").includes(q) ||
        (r.registration_id?.toLowerCase() || "").includes(q)
      );
    }

    // Class filter
    if (selectedClass) {
      result = result.filter(r => r.student_class === selectedClass);
    }

    // Language filter
    if (selectedLanguage) {
      result = result.filter(r => r.language === selectedLanguage);
    }

    // State filter
    if (selectedState) {
      result = result.filter(r => r.state === selectedState);
    }

    // Source filter
    if (selectedSource) {
      result = result.filter(r => {
        const src = r.utm_source || r.how_heard || "Direct";
        return src === selectedSource;
      });
    }

    // Payment Status filter
    if (selectedPaymentStatus) {
      result = result.filter(r => (r.payment_status || "PENDING") === selectedPaymentStatus);
    }

    return result;
  })();

  // Load audit events on drawer opening
  const handleViewDetails = async (reg: any) => {
    setActiveReg(reg);
    setAdminNotesText(reg.admin_notes || "");
    setLoadingEvents(true);
    try {
      const events = await fetchRegistrationEvents(reg.registration_id);
      setActiveEvents(events);
    } catch (e) {
      console.error("Failed to load audit events", e);
      setActiveEvents([
        {
          id: "mock-event-id",
          registration_id: reg.registration_id,
          event_type: "REGISTERED",
          metadata: { browser: "Chrome/Windows (Simulated)", timestamp: reg.created_at },
          created_at: reg.created_at
        }
      ]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleCopyReferral = (code: string) => {
    const link = `https://cnts.in/register?ref=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    });
  };

  // Administrative notes saver
  const handleSaveNotes = async () => {
    if (!activeReg) return;
    setSavingNotes(true);
    try {
      const success = await saveRegistrationNote(activeReg.registration_id, adminNotesText);
      if (success) {
        // Update local registrations state
        setRegistrations(prev => 
          prev.map(r => 
            r.registration_id === activeReg.registration_id 
              ? { ...r, admin_notes: adminNotesText } 
              : r
          )
        );
        // Update active drawer registration
        setActiveReg((prev: any) => ({ ...prev, admin_notes: adminNotesText }));
        alert("Administrative note saved successfully.");
      } else {
        alert("Failed to save note to database.");
      }
    } catch (err) {
      console.error("Save note error:", err);
      alert("Error saving note.");
    } finally {
      setSavingNotes(false);
    }
  };

  // CSV Exporter
  const downloadCSV = (rows: any[], filename: string) => {
    if (rows.length === 0) {
      alert("No data records found to export.");
      return;
    }

    // Determine headers
    const headers = [
      "registration_id", "student_name", "dob", "student_class", "school_name", 
      "school_city", "parent_name", "whatsapp_number", "parent_email", 
      "state", "district", "language", "payment_status", "utm_source", 
      "utm_medium", "utm_campaign", "referral_code", "admin_notes", "created_at"
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const val = row[header] === null || row[header] === undefined ? "" : String(row[header]);
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // WhatsApp broadcast list exporter (specialized format)
  const downloadWhatsAppList = (rows: any[], filename: string) => {
    if (rows.length === 0) {
      alert("No contacts found to export.");
      return;
    }

    const headers = ["parent_name", "whatsapp_number", "student_name", "student_class", "state"];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => 
        headers.map(header => {
          const val = row[header] === null || row[header] === undefined ? "" : String(row[header]);
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExport = (type: "ALL" | "FILTERED" | "WHATSAPP") => {
    const dateStr = new Date().toISOString().split('T')[0];
    if (type === "ALL") {
      downloadCSV(registrations, `CNTS_All_Registrations_${dateStr}.csv`);
    } else if (type === "FILTERED") {
      downloadCSV(filteredRegs, `CNTS_Filtered_Registrations_${dateStr}.csv`);
    } else if (type === "WHATSAPP") {
      downloadWhatsAppList(filteredRegs, `CNTS_WhatsApp_Broadcast_List_${dateStr}.csv`);
    }
  };

  // Get dynamic lists for dropdown filters
  const uniqueStates = Array.from(new Set(registrations.map(r => r.state))).filter(Boolean).sort();
  const uniqueSources = Array.from(new Set(registrations.map(r => r.utm_source || r.how_heard || "Direct"))).filter(Boolean).sort();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] relative overflow-x-hidden">
      
      {/* Top Banner Header */}
      <header className="sticky top-0 z-35 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push("/admin")}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="font-display font-bold text-base text-slate-800 flex items-center gap-2">
              Registration Explorer
            </h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Total Found: {filteredRegs.length} record{filteredRegs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className={`p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center justify-center gap-1.5 text-xs font-semibold cursor-pointer ${
              refreshing ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Sync Data
          </button>
        </div>
      </header>

      {/* Main Database Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 md:px-12 space-y-6 animate-slide-up">
        
        {isDemoMode && (
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs text-amber-800 shadow-sm flex items-center gap-2">
            <span><strong>Auditing Demo Mode:</strong> Displaying 12 mock candidate records for evaluation. Configured .env.local values to see live database registers.</span>
          </div>
        )}

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by student, parent, school name, or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-8 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10 transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-2 md:flex gap-3 flex-wrap">
              {/* Class Filter */}
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all"
              >
                <option value="">All Classes</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
              </select>

              {/* Language Filter */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all"
              >
                <option value="">All Languages</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>

              {/* State Filter */}
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all max-w-[150px] truncate"
              >
                <option value="">All States</option>
                {uniqueStates.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              {/* Source Filter */}
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all max-w-[150px] truncate"
              >
                <option value="">All Channels</option>
                {uniqueSources.map(src => (
                  <option key={src} value={src}>{src}</option>
                ))}
              </select>

              {/* Payment Status Filter */}
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="px-4 py-3 border border-slate-200 bg-slate-50/50 text-xs font-semibold text-slate-600 rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/5 transition-all"
              >
                <option value="">All Payment Statuses</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
              </select>
            </div>
          </div>

          {/* Export Center */}
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-semibold">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Download size={14} className="text-slate-400" />
              Administrative CSV Reports:
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExport("ALL")}
                className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition-all cursor-pointer"
              >
                Export All ({registrations.length})
              </button>
              <button
                onClick={() => handleExport("FILTERED")}
                className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 rounded-xl transition-all cursor-pointer"
              >
                Export Filtered ({filteredRegs.length})
              </button>
              <button
                onClick={() => handleExport("WHATSAPP")}
                className="px-3.5 py-2 border border-emerald-200 hover:border-emerald-300 bg-emerald-50/20 hover:bg-emerald-50 text-emerald-800 rounded-xl transition-all cursor-pointer flex items-center gap-1"
              >
                <MessageSquare size={12} className="text-emerald-700" />
                Export WhatsApp Broadcast Sheet
              </button>
            </div>
          </div>
        </div>

        {/* Data Grid / Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">CNTS ID</th>
                  <th className="py-4 px-6">Student Name</th>
                  <th className="py-4 px-6">Class</th>
                  <th className="py-4 px-6">WhatsApp</th>
                  <th className="py-4 px-6">State</th>
                  <th className="py-4 px-6">Source</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-sm text-slate-700">
                {filteredRegs.length > 0 ? (
                  filteredRegs.map((reg) => (
                    <tr 
                      key={reg.registration_id}
                      onClick={() => handleViewDetails(reg)}
                      className={`hover:bg-blue-50/20 transition-colors cursor-pointer group ${
                        activeReg?.registration_id === reg.registration_id ? "bg-blue-50/30" : ""
                      }`}
                    >
                      {/* CNTS ID */}
                      <td className="py-4 px-6 font-mono text-xs font-bold text-slate-800 select-all">
                        {reg.registration_id}
                      </td>
                      {/* Name */}
                      <td className="py-4 px-6 font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                        <div className="flex items-center gap-2">
                          <span>{reg.student_name}</span>
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wide uppercase ${
                            reg.payment_status === "PAID"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}>
                            {reg.payment_status || "PENDING"}
                          </span>
                        </div>
                      </td>
                      {/* Class */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200/50">
                          Class {reg.student_class}
                        </span>
                      </td>
                      {/* WhatsApp */}
                      <td className="py-4 px-6 font-medium text-slate-600">{reg.whatsapp_number}</td>
                      {/* State */}
                      <td className="py-4 px-6 font-medium text-slate-500">{reg.state}</td>
                      {/* Source */}
                      <td className="py-4 px-6">
                        <span className="px-2 py-0.5 rounded-md border border-slate-100 bg-slate-50 font-semibold text-[10px] text-slate-500">
                          {reg.utm_source || reg.how_heard || "Direct"}
                        </span>
                      </td>
                      {/* Date */}
                      <td className="py-4 px-6 text-xs text-slate-400 font-medium">
                        {new Date(reg.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      {/* View Button */}
                      <td className="py-4 px-6 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleViewDetails(reg)}
                          className="p-1.5 text-slate-400 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all cursor-pointer flex items-center justify-center mx-auto"
                          title="View Audit Record"
                        >
                          <EyeIcon size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-sm font-medium text-slate-400 bg-white">
                      No registrations match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Slide-out details drawer panel */}
      {activeReg && (
        <>
          {/* Backdrop */}
          <div 
            onClick={() => setActiveReg(null)}
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Drawer body */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-white border-l border-slate-100 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-up duration-300">
            
            <div className="divide-y divide-slate-100 flex-1 flex flex-col">
              
              {/* Drawer Header */}
              <div className="p-6 bg-slate-50 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    Candidate Audit Profile
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-800 mt-1">
                    {activeReg.student_name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveReg(null)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Drawer Body Panel */}
              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                {/* ID & Date Section */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                      Registration ID
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-800 mt-0.5 block">
                      {activeReg.registration_id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide block">
                      Registered On
                    </span>
                    <span className="text-xs text-slate-600 font-semibold mt-0.5 block">
                      {new Date(activeReg.created_at).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                  </div>
                </div>

                {/* Candidate Information Card */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <User size={13} />
                    Student Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Date of Birth</span>
                      <p className="font-semibold text-slate-700">{activeReg.dob}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Class / Grade</span>
                      <p className="font-semibold text-slate-700">Class {activeReg.student_class}</p>
                    </div>
                    <div className="space-y-0.5 col-span-2">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><School size={10} /> School Name</span>
                      <p className="font-semibold text-slate-700">{activeReg.school_name}</p>
                    </div>
                    {activeReg.school_city && (
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-slate-400 font-medium">School City / Town</span>
                        <p className="font-semibold text-slate-700">{activeReg.school_city}</p>
                      </div>
                    )}
                    {activeReg.school_code && (
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-slate-400 font-medium">School Invite Code</span>
                        <p className="font-semibold text-slate-755 font-mono">{activeReg.school_code}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parent Information Card */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Phone size={13} />
                    Parent Contact
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Parent Name</span>
                      <p className="font-semibold text-slate-700">{activeReg.parent_name}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">WhatsApp Number</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-slate-700">{activeReg.whatsapp_number}</span>
                        {/* WhatsApp click-to-chat */}
                        <a
                          href={`https://wa.me/91${activeReg.whatsapp_number}?text=Hello%20${encodeURIComponent(activeReg.parent_name)},%20this%2520is%2520regarding%2520your%2520child's%2520CNTS%2520registration%2520(ID:%2520${activeReg.registration_id}).`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-md border border-emerald-100 transition-all"
                          title="Message Parent on WhatsApp"
                        >
                          <MessageSquare size={10} />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-0.5 col-span-2">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><Mail size={10} /> Email Address</span>
                      <p className="font-semibold text-slate-700 select-all">{activeReg.parent_email}</p>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Languages size={13} />
                    Preferences & Demographics
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">State / Region</span>
                      <p className="font-semibold text-slate-700">{activeReg.state}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">District</span>
                      <p className="font-semibold text-slate-700">{activeReg.district}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Exam Language</span>
                      <p className="font-semibold text-slate-700">{activeReg.language}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">How Heard</span>
                      <p className="font-semibold text-slate-700">{activeReg.how_heard}</p>
                    </div>
                    <div className="space-y-0.5 col-span-2">
                      <span className="text-slate-400 font-medium flex items-center gap-1"><HelpCircle size={10} /> Why Participating?</span>
                      <p className="font-semibold text-slate-700">{activeReg.why_participating}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Status Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Status</span>
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        activeReg.payment_status === "PAID"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-105"
                          : "bg-red-50 text-red-750 border border-red-105"
                      }`}>
                        {activeReg.payment_status}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 font-medium">Payment ID</span>
                      <p className="font-semibold text-slate-700 font-mono text-[11px]">{activeReg.payment_id || "N/A"}</p>
                    </div>
                  </div>
                </div>

                {/* Administrative Notes Form */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                    <FileText size={13} />
                    Administrative Notes
                  </h4>
                  <div className="space-y-2">
                    <textarea
                      rows={3}
                      value={adminNotesText}
                      onChange={(e) => setAdminNotesText(e.target.value)}
                      placeholder="Add candidate verify audits, notes..."
                      className="w-full p-3 border border-slate-200 bg-slate-50/50 text-xs rounded-xl outline-none focus:border-blue-800 focus:bg-white transition-all resize-none text-slate-700 font-semibold"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="px-4 py-2 bg-blue-800 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-60 flex items-center gap-1.5"
                    >
                      {savingNotes ? "Saving..." : "Save Note"}
                    </button>
                  </div>
                </div>

                {/* Audit log milestone timeline */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
                    <ClipboardList size={13} />
                    Audit Logs / Event Timeline
                  </h4>

                  <div className="space-y-4">
                    {loadingEvents ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold py-2">
                        <div className="w-3.5 h-3.5 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
                        Retrieving milestone events...
                      </div>
                    ) : activeEvents.length > 0 ? (
                      activeEvents.map((evt) => (
                        <div key={evt.id} className="flex gap-3 items-start text-xs">
                          {/* Dot indicator */}
                          <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </div>
                          {/* Event description */}
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-slate-800 font-mono text-[11px] uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                                {evt.event_type}
                              </span>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {new Date(evt.created_at).toLocaleString("en-IN", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit"
                                })}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-555 leading-normal">
                              Client: <span className="font-mono text-slate-600 text-[10px] bg-slate-50/50 px-1 py-0.5 rounded select-all block mt-0.5">{evt.metadata?.browser || "Unknown Browser Agent"}</span>
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-2 text-xs text-slate-400">No events found for this registration</div>
                    )}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Actions Drawer Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-3 shrink-0">
              <a
                href={`mailto:${activeReg.parent_email}`}
                className="flex-1 text-center py-3 bg-white text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
              >
                Send Email
              </a>
              <a
                href={`https://wa.me/91${activeReg.whatsapp_number}?text=Hello%20${encodeURIComponent(activeReg.parent_name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/10 transition-all cursor-pointer animate-pulse"
              >
                WhatsApp Chat
              </a>
            </div>

          </div>
        </>
      )}

    </div>
  );
}
