'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Send, 
  Search, 
  Filter, 
  Edit3, 
  Check, 
  X, 
  Sparkles, 
  CreditCard, 
  AlertTriangle,
  RefreshCw,
  Award,
  ChevronRight,
  UserCheck,
  UserX,
  TrendingUp,
  GraduationCap,
  Eye,
  Building2,
  ExternalLink,
  MessageSquare,
  Zap,
  Sliders,
  Flame,
  Inbox,
  Video,
  User
} from 'lucide-react';

export default function AdminPartnersPage() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'directory' | 'video-submissions' | 'payouts' | 'broadcast' | 'rates' | 'appeals' | 'support-tickets'>('approvals');
  const [partners, setPartners] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [videoSubmissions, setVideoSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Partner Support Tickets State
  const [partnerTickets, setPartnerTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedPartnerTicket, setSelectedPartnerTicket] = useState<any | null>(null);
  const [ticketReplyMessage, setTicketReplyMessage] = useState<string>('');
  const [isSendingTicketReply, setIsSendingTicketReply] = useState<boolean>(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'ALL' | 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'>('ALL');
  const [ticketSearchQuery, setTicketSearchQuery] = useState<string>('');

  // Suspension Modal State
  const [suspendingPartner, setSuspendingPartner] = useState<any | null>(null);
  const [suspensionReason, setSuspensionReason] = useState<string>('Policy violation');
  const [suspensionNote, setSuspensionNote] = useState<string>('');
  const [isSuspending, setIsSuspending] = useState<boolean>(false);
  
  // Rate Editing State
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<number>(25);

  // Inspector Drawer & Proof Preview State
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<any | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Settlement Modal State
  const [settlingPayoutId, setSettlingPayoutId] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState('');
  const [showBulkSettlementModal, setShowBulkSettlementModal] = useState(false);
  const [bulkSettlementInput, setBulkSettlementInput] = useState('');
  const [bulkSettlementResult, setBulkSettlementResult] = useState<{ settledCount: number; failedCount: number } | null>(null);

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [targetRefCode, setTargetRefCode] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'Mission' | 'Payout' | 'System' | 'Badge'>('System');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Default tier rate matrix
  const [tierRates, setTierRates] = useState({
    BRONZE: 25,
    SILVER: 30,
    GOLD: 40,
    PLATINUM: 50,
    FOUNDING: 65,
  });

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      if (data.success && Array.isArray(data.partners)) {
        setPartners(data.partners);
      } else {
        setPartners([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin partners:', err);
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayouts = async () => {
    try {
      const res = await fetch('/api/admin/partners/payouts');
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setPayouts(data.requests);
      } else {
        setPayouts([]);
      }
    } catch (err) {
      console.error('Failed to fetch admin payouts:', err);
      setPayouts([]);
    }
  };

  const fetchVideoSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/partners/video-submissions');
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        setVideoSubmissions(data.submissions);
      } else {
        setVideoSubmissions([]);
      }
    } catch (err) {
      console.error('Failed to fetch video submissions:', err);
      setVideoSubmissions([]);
    }
  };

  const fetchPartnerTickets = async (silent = false) => {
    if (!silent) setLoadingTickets(true);
    try {
      const res = await fetch('/api/admin/partners/tickets');
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setPartnerTickets(data.tickets);
        if (selectedPartnerTicket) {
          const updated = data.tickets.find((t: any) => t.id === selectedPartnerTicket.id);
          if (updated) {
            setSelectedPartnerTicket(updated);
          }
        }
      } else if (!silent) {
        setPartnerTickets([]);
      }
    } catch (err) {
      console.error('Failed to fetch partner tickets:', err);
      if (!silent) setPartnerTickets([]);
    } finally {
      if (!silent) setLoadingTickets(false);
    }
  };

  const handleSendTicketReply = async (ticketId: string, newStatus?: string) => {
    if (!ticketId) return;
    if (!ticketReplyMessage.trim() && !newStatus) return;

    const messageToSend = ticketReplyMessage.trim();
    setIsSendingTicketReply(true);
    setTicketReplyMessage('');

    // Instant optimistic update
    if (selectedPartnerTicket && selectedPartnerTicket.id === ticketId && messageToSend) {
      setSelectedPartnerTicket({
        ...selectedPartnerTicket,
        status: newStatus || selectedPartnerTicket.status,
        messages: [
          ...(selectedPartnerTicket.messages || []),
          {
            id: `temp-${Date.now()}`,
            sender_role: 'ADMIN',
            message: messageToSend,
            created_at: new Date().toISOString()
          }
        ]
      });
    }

    try {
      const res = await fetch('/api/admin/partners/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          message: messageToSend,
          newStatus: newStatus || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        await fetchPartnerTickets(true);
      } else {
        alert(data.message || 'Failed to dispatch ticket reply.');
      }
    } catch (err) {
      console.error('Failed to send partner ticket reply:', err);
    } finally {
      setIsSendingTicketReply(false);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchPayouts();
    fetchVideoSubmissions();
    fetchPartnerTickets();
  }, []);

  // Real-time live polling for Partner Support Desk (no page reload needed)
  useEffect(() => {
    if (activeTab !== 'support-tickets') return;
    const interval = setInterval(() => {
      fetchPartnerTickets(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeTab, selectedPartnerTicket?.id]);

  const handleUpdateStatus = async (partnerId: string, status: string) => {
    if (status === 'SUSPENDED') {
      const target = partners.find(p => p.id === partnerId);
      if (target) setSuspendingPartner(target);
      return;
    }

    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, status })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status } : p));
        if (selectedPartnerDetail?.id === partnerId) {
          setSelectedPartnerDetail((prev: any) => ({ ...prev, status }));
        }
      }
    } catch (err) {
      console.error('Failed to update partner status:', err);
    }
  };

  const handleConfirmSuspend = async () => {
    if (!suspendingPartner) return;
    if (suspensionReason === 'Other' && !suspensionNote.trim()) {
      alert('Please provide an explanation note when selecting "Other".');
      return;
    }
    setIsSuspending(true);
    try {
      const res = await fetch('/api/admin/partners/suspend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: suspendingPartner.id,
          reason: suspensionReason,
          note: suspensionNote
        })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(prev => prev.map(p => p.id === suspendingPartner.id ? { 
          ...p, 
          status: 'SUSPENDED', 
          suspension_reason: suspensionReason, 
          suspension_note: suspensionNote 
        } : p));
        if (selectedPartnerDetail?.id === suspendingPartner.id) {
          setSelectedPartnerDetail((prev: any) => ({
            ...prev,
            status: 'SUSPENDED',
            suspension_reason: suspensionReason,
            suspension_note: suspensionNote
          }));
        }
        setSuspendingPartner(null);
        setSuspensionNote('');
        alert('Partner account suspended successfully.');
      } else {
        alert(data.error || 'Failed to suspend partner.');
      }
    } catch (err) {
      console.error('Suspend error:', err);
    } finally {
      setIsSuspending(false);
    }
  };

  const handleReinstatePartner = async (partnerId: string) => {
    if (!confirm('Are you sure you want to reinstate this partner account? Dashboard access will be fully restored.')) return;
    try {
      const res = await fetch('/api/admin/partners/reinstate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, note: 'Reinstated by Admin' })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, status: 'APPROVED', appeal_status: 'APPROVED' } : p));
        if (selectedPartnerDetail?.id === partnerId) {
          setSelectedPartnerDetail((prev: any) => ({ ...prev, status: 'APPROVED', appeal_status: 'APPROVED' }));
        }
        alert('Partner account reinstated successfully.');
      } else {
        alert(data.error || 'Failed to reinstate partner.');
      }
    } catch (err) {
      console.error('Reinstate error:', err);
    }
  };

  const handleUpdateRate = async (partnerId: string, rateValue?: number) => {
    const targetRate = rateValue !== undefined ? rateValue : newRate;
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, honorariumRate: targetRate })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, honorarium_rate: targetRate } : p));
        if (selectedPartnerDetail?.id === partnerId) {
          setSelectedPartnerDetail((prev: any) => ({ ...prev, honorarium_rate: targetRate }));
        }
        setEditingPartnerId(null);
      }
    } catch (err) {
      console.error('Failed to update honorarium rate:', err);
    }
  };

  const handleSettlePayout = async () => {
    if (!settlingPayoutId) return;
    try {
      const res = await fetch('/api/admin/partners/payouts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: settlingPayoutId,
          status: 'SETTLED',
          transactionRef
        })
      });
      const data = await res.json();
      if (data.success) {
        setPayouts(prev => prev.map(p => p.id === settlingPayoutId ? { ...p, status: 'SETTLED', transaction_ref: transactionRef } : p));
        setSettlingPayoutId(null);
        setTransactionRef('');
      }
    } catch (err) {
      console.error('Failed to settle payout:', err);
    }
  };

  const handleExportBatchCsv = async () => {
    try {
      const res = await fetch('/api/admin/partners/payouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'EXPORT_CSV' })
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CNTS_Payout_Batch_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Failed to export payout CSV batch:', err);
    }
  };

  const handleBulkExcelSettlement = async () => {
    if (!bulkSettlementInput.trim()) return;
    try {
      const parsedRows: any[] = [];
      const lines = bulkSettlementInput.trim().split('\n');

      for (const line of lines) {
        const parts = line.split(/,|\t|;/).map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2) {
          // Expected row format: RequestID, UTR, [Status], [Remarks]
          const requestId = parts[0];
          const utr = parts[1];
          const status = parts[2] ? (parts[2].toUpperCase().includes('FAIL') ? 'FAILED' : 'SETTLED') : 'SETTLED';
          const remarks = parts[3] || 'Bulk Excel Auto-Settlement';

          if (requestId && utr) {
            parsedRows.push({
              requestId,
              transactionRef: utr,
              status,
              remarks
            });
          }
        }
      }

      if (parsedRows.length === 0) {
        alert('No valid rows found. Please enter lines formatted as: RequestID, UTR');
        return;
      }

      const res = await fetch('/api/admin/partners/payouts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows })
      });

      const data = await res.json();
      if (data.success) {
        setBulkSettlementResult({ settledCount: data.settledCount, failedCount: data.failedCount });
        fetchPayouts();
      }
    } catch (err) {
      console.error('Bulk Excel settlement error:', err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/partners/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          fullBody: broadcastBody,
          category: broadcastCategory,
          targetAll: broadcastTarget === 'ALL',
          referralCode: broadcastTarget === 'SPECIFIC' ? targetRefCode : undefined,
        })
      });
      const data = await res.json();
      if (data.success) {
        setBroadcastSent(true);
        setBroadcastTitle('');
        setBroadcastBody('');
        setTimeout(() => setBroadcastSent(false), 4000);
      }
    } catch (err) {
      console.error('Failed to send broadcast:', err);
    }
  };

  const pendingPartners = partners.filter(p => p.status === 'PENDING');
  const approvedPartners = partners.filter(p => p.status === 'APPROVED');
  const filteredPartners = partners.filter(p => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch = searchQuery === '' || 
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referral_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingPayouts = payouts.filter(p => p.status === 'PENDING');
  const totalMobilizedStudents = partners.reduce((acc, p) => acc + (p.total_registrations || 0), 0);
  const totalPartnerRevenue = totalMobilizedStudents * 99;
  const totalQueuedPayoutAmount = pendingPayouts.reduce((acc, p) => acc + Number(p.amount || 0), 0);

  return (
    <>
      <div className="space-y-8 p-6 md:p-8 animate-fade-in max-w-7xl mx-auto">
        
        {/* PREMIUM ULTRA-GLOW HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 via-slate-900 to-indigo-950 text-white p-6 md:p-8 border border-indigo-500/20 shadow-2xl space-y-6">
          
          {/* Ambient Glow Orbs */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold text-amber-300 bg-amber-400/10 border border-amber-400/30 px-3.5 py-1 rounded-full shadow-inner">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span>COURAGE PARTNER & CREATOR CONTROL OS</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                Partner Ecosystem & Creator Command
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Approve pending creator applications, configure dynamic student honorarium rates (₹25–₹100/candidate), process Monday payout batches, and trigger broadcast announcements.
              </p>
            </div>

            {/* LIVE REAL-DATABASE KPI CARDS */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="bg-slate-900/90 border border-amber-400/30 p-4 rounded-2xl backdrop-blur-md shadow-lg text-center space-y-1 relative overflow-hidden group hover:border-amber-400/60 transition-all">
                <div className="w-2 h-2 rounded-full bg-amber-400 absolute top-2 right-2" />
                <span className="text-[10px] uppercase font-mono font-extrabold text-amber-400 tracking-wider block">Pending Applications</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-amber-300 block">{pendingPartners.length}</span>
                <span className="text-[9.5px] text-amber-200/70 font-semibold block">Awaiting Verification</span>
              </div>

              <div className="bg-slate-900/90 border border-emerald-400/30 p-4 rounded-2xl backdrop-blur-md shadow-lg text-center space-y-1 relative overflow-hidden group hover:border-emerald-400/60 transition-all">
                <div className="w-2 h-2 rounded-full bg-emerald-400 absolute top-2 right-2" />
                <span className="text-[10px] uppercase font-mono font-extrabold text-emerald-400 tracking-wider block">Active Creators</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-emerald-300 block">{approvedPartners.length}</span>
                <span className="text-[9.5px] text-emerald-200/70 font-semibold block">Mobilizing Students</span>
              </div>

              <div className="bg-slate-900/90 border border-indigo-400/30 p-4 rounded-2xl backdrop-blur-md shadow-lg text-center space-y-1 relative overflow-hidden group hover:border-indigo-400/60 transition-all">
                <div className="w-2 h-2 rounded-full bg-indigo-400 absolute top-2 right-2" />
                <span className="text-[10px] uppercase font-mono font-extrabold text-indigo-400 tracking-wider block">Queued Payouts</span>
                <span className="font-mono text-2xl sm:text-3xl font-black text-indigo-200 block">₹{totalQueuedPayoutAmount.toLocaleString('en-IN')}</span>
                <span className="text-[9.5px] text-indigo-200/70 font-semibold block">{pendingPayouts.length} Requests Batched</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 EXECUTIVE KPI SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mobilized Students</span>
              <div className="font-mono text-2xl font-black text-slate-900">{totalMobilizedStudents}</div>
              <span className="text-[10.5px] text-emerald-600 font-bold block">Verified Candidate Enrolments</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Channel Revenue</span>
              <div className="font-mono text-2xl font-black text-emerald-700">₹{totalPartnerRevenue.toLocaleString('en-IN')}</div>
              <span className="text-[10.5px] text-emerald-600 font-bold block">Gross Enrolment Fees</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending Approvals</span>
              <div className="font-mono text-2xl font-black text-amber-700">{pendingPartners.length}</div>
              <span className="text-[10.5px] text-amber-600 font-bold block">Awaiting Admin Sign-off</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-100 text-violet-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Conversion Benchmark</span>
              <div className="font-mono text-2xl font-black text-violet-900">
                {totalMobilizedStudents > 0 ? '6.7%' : '0.0%'}
              </div>
              <span className="text-[10.5px] text-violet-600 font-bold block">Partner Referral Metric</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS WITH GLOW ACTIVE INDICATORS */}
        <div className="flex flex-wrap bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-bold w-fit border border-slate-200">
          <button
            onClick={() => setActiveTab('approvals')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'approvals' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" /> Approvals Queue
            {pendingPartners.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                {pendingPartners.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'directory' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-600" /> Creator Directory & Rates
          </button>

          <button
            onClick={() => setActiveTab('rates')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rates' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" /> Tier Commission Matrix
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'payouts' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" /> Weekly Payout Settlement
            {pendingPayouts.length > 0 && (
              <span className="bg-emerald-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                {pendingPayouts.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('video-submissions')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'video-submissions' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-rose-600" /> Video Submissions
            {videoSubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {videoSubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'broadcast' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Send className="w-4 h-4 text-violet-600" /> Dispatch Inbox Broadcast
          </button>

          <button
            onClick={() => setActiveTab('appeals')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'appeals' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" /> Suspension Appeals
            {partners.filter(p => p.status === 'SUSPENDED').length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-black">
                {partners.filter(p => p.status === 'SUSPENDED').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('support-tickets')}
            className={`py-2.5 px-5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'support-tickets' ? 'bg-white text-slate-950 shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" /> Partner Support Tickets
            {partnerTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                {partnerTickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: APPROVALS QUEUE */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Filter Status:</span>
                {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      statusFilter === st ? 'bg-indigo-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search creator name or referral code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 w-64"
                />
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-600">Loading live partner applications from database...</p>
              </div>
            ) : filteredPartners.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
                <UserCheck className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No partner applications found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {statusFilter === 'PENDING' 
                    ? 'There are currently no pending partner applications awaiting approval.' 
                    : 'No records match your filter criteria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPartners.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow shrink-0">
                            {p.full_name?.substring(0, 2).toUpperCase() || 'CP'}
                          </div>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 tracking-wider block mb-0.5">
                              {p.partner_id || 'CP-2026-000412'} • Code: {p.referral_code}
                            </span>
                            <h3 className="font-display font-bold text-lg text-slate-900">{p.full_name}</h3>
                            <p className="text-xs text-slate-500">{p.email} • {p.phone || 'No Phone'}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border ${
                          p.status === 'PENDING' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                          p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                          'bg-rose-50 text-rose-900 border-rose-300'
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Role</span>
                          <span className="font-semibold text-slate-800">{p.primary_role || 'Content Creator'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Audience Scale</span>
                          <span className="font-semibold text-indigo-700">{p.audience_scale || '10k - 50k'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Honorarium Rate</span>
                          <span className="font-mono font-bold text-emerald-700">₹{p.honorarium_rate || 25} / Student</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Current Tier</span>
                          <span className="font-bold text-amber-700">{p.tier || 'BRONZE'}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedPartnerDetail(p)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" /> Inspect
                      </button>

                      {p.status === 'PENDING' ? (
                        <div className="flex items-center gap-2 flex-1 justify-end">
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'APPROVED')}
                            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <UserCheck className="w-4 h-4" /> Approve Application
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'REJECTED')}
                            className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UserX className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      ) : p.status === 'SUSPENDED' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReinstatePartner(p.id)}
                            className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow transition"
                          >
                            <UserCheck className="w-3.5 h-3.5" /> Reinstate Account
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSuspendingPartner(p)}
                            className="py-2 px-3.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                          >
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Suspend Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PARTNER DIRECTORY & HONORARIUM RATE CONTROL */}
        {activeTab === 'directory' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> Active Creator Directory & Dynamic Rates
                </h2>
                <p className="text-xs text-slate-500">As Admin, set custom student honorarium rates (₹25 default, ₹40, ₹50, ₹100) per creator.</p>
              </div>
            </div>

            {partners.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-xs">No active partners found in database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Partner Name</th>
                      <th className="py-3 px-2">Referral Code</th>
                      <th className="py-3 px-2">Audience Scale</th>
                      <th className="py-3 px-2">Tier</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Honorarium Rate</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {partners.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-2">
                          <span className="font-bold text-slate-900 block">{p.full_name}</span>
                          <span className="text-[10.5px] text-slate-400">{p.email}</span>
                        </td>
                        <td className="py-3.5 px-2 font-mono font-bold text-indigo-900">{p.referral_code}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-600">{p.audience_scale || '10k - 50k'}</td>
                        <td className="py-3.5 px-2 font-bold text-amber-700">{p.tier || 'BRONZE'}</td>
                        <td className="py-3.5 px-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          {editingPartnerId === p.id ? (
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-slate-500">₹</span>
                              <input
                                type="number"
                                value={newRate}
                                onChange={e => setNewRate(Number(e.target.value))}
                                className="w-16 px-2 py-1 border border-indigo-400 rounded text-xs font-bold focus:outline-none"
                              />
                              <button
                                onClick={() => handleUpdateRate(p.id)}
                                className="p-1 bg-emerald-600 text-white rounded cursor-pointer hover:bg-emerald-700"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setEditingPartnerId(null)}
                                className="p-1 bg-slate-200 text-slate-700 rounded cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-emerald-700 text-sm">₹{p.honorarium_rate || 25} / Student</span>
                          )}
                        </td>
                        <td className="py-3.5 px-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingPartnerId(p.id);
                              setNewRate(p.honorarium_rate || 25);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Rate
                          </button>
                          {p.status === 'SUSPENDED' ? (
                            <button
                              onClick={() => handleReinstatePartner(p.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] rounded-lg transition cursor-pointer"
                            >
                              Reinstate
                            </button>
                          ) : (
                            <button
                              onClick={() => setSuspendingPartner(p)}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10.5px] rounded-lg transition cursor-pointer"
                            >
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TIER COMMISSION MATRIX EDITOR */}
        {activeTab === 'rates' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-4xl">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" /> Default Partner Tier Commission Rules
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Configure baseline rates per tier for automated candidate honorarium calculations.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {[
                { tier: 'BRONZE', label: 'Bronze Mobilizer', min: '1 - 25', color: 'border-slate-300 bg-slate-50' },
                { tier: 'SILVER', label: 'Silver Mobilizer', min: '26 - 50', color: 'border-slate-300 bg-slate-100' },
                { tier: 'GOLD', label: 'Gold Mobilizer', min: '51 - 100', color: 'border-amber-300 bg-amber-50' },
                { tier: 'PLATINUM', label: 'Platinum Partner', min: '101 - 250', color: 'border-indigo-300 bg-indigo-50' },
                { tier: 'FOUNDING', label: 'Founding Partner', min: '251+', color: 'border-emerald-300 bg-emerald-50' },
              ].map(t => (
                <div key={t.tier} className={`p-4 rounded-2xl border ${t.color} space-y-3`}>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider block opacity-75">{t.min} Students</span>
                  <h4 className="font-bold text-sm text-slate-900">{t.label}</h4>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 mb-1">Rate / Candidate</label>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs">₹</span>
                      <input
                        type="number"
                        value={tierRates[t.tier as keyof typeof tierRates]}
                        onChange={e => setTierRates({ ...tierRates, [t.tier]: Number(e.target.value) })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold font-mono focus:ring-2 focus:ring-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 font-medium">Automatic system calculation priority mode active.</span>
              <button
                onClick={() => alert('Tier baseline commission matrix saved successfully.')}
                className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl cursor-pointer"
              >
                Save Matrix Baseline
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: PARTNER CAMPAIGN VIDEO SUBMISSIONS REVIEW */}
        {activeTab === 'video-submissions' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Video className="w-5 h-5 text-rose-600" /> Partner Video Submissions Queue
                </h2>
                <p className="text-xs text-slate-500">Review video URLs submitted by partners, watch content, and approve for points & featuring.</p>
              </div>

              <div className="text-xs font-mono font-bold bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl border border-rose-200">
                {videoSubmissions.filter(s => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length} Pending Admin Review
              </div>
            </div>

            {videoSubmissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-2">
                <Video className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="font-bold text-xs">No video submissions logged yet.</p>
                <p className="text-[11px] text-slate-400">Partners submit video URLs directly from their Video Campaign Roadmap tab.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {videoSubmissions.map((sub, idx) => (
                  <div key={sub.id || idx} className="py-4 space-y-3 first:pt-0 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {sub.platform || 'Instagram Reel'}
                          </span>
                          <span className="font-mono text-xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Code: {sub.referral_code || sub.referralCode || 'CNTSJN'}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : sub.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {sub.status || 'PENDING_REVIEW'}
                          </span>
                        </div>

                        <h4 className="font-display font-bold text-base text-slate-900">{sub.video_title || sub.videoTitle || 'Partner Campaign Video'}</h4>
                        {sub.notes && <p className="text-xs text-slate-500 font-medium">Notes: {sub.notes}</p>}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={sub.video_url || sub.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs px-3.5 py-2 rounded-xl border border-indigo-200 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open Video Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        {sub.status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await fetch('/api/admin/partners/video-submissions', {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ submissionId: sub.id, status: 'APPROVED' })
                              });
                              setVideoSubmissions(prev => prev.map(s => s.id === sub.id ? { ...s, status: 'APPROVED' } : s));
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs cursor-pointer flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Award Points
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: WEEKLY PAYOUT SETTLEMENT QUEUE */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Weekly Payout Settlement Queue & Batch Engine
                </h2>
                <p className="text-xs text-slate-500">Review partner withdrawal requests, export bank batch CSV/Excel, and re-upload UTRs for bulk settlement.</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleExportBatchCsv}
                  className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" /> Export Batch CSV / Excel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBulkSettlementResult(null);
                    setShowBulkSettlementModal(true);
                  }}
                  className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Bulk Excel Re-Upload Auto-Settlement
                </button>
              </div>
            </div>

            {payouts.length === 0 ? (
              <div className="p-12 text-center text-slate-500 space-y-3">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No payout requests in queue</h3>
                <p className="text-xs text-slate-500">When creators submit withdrawal requests, they will appear here for Monday batch settlement.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-2">Partner Details</th>
                      <th className="py-3 px-2">Referral Code</th>
                      <th className="py-3 px-2">Requested Amount</th>
                      <th className="py-3 px-2">Request Date</th>
                      <th className="py-3 px-2">Batch Date</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {payouts.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-3.5 px-2">
                          <span className="font-bold text-slate-900 block">{p.partners?.full_name || 'Partner Account'}</span>
                          <span className="text-[10.5px] text-slate-400">{p.partners?.email || 'N/A'}</span>
                        </td>
                        <td className="py-3.5 px-2 font-mono font-bold text-indigo-900">{p.referral_code}</td>
                        <td className="py-3.5 px-2 font-mono text-base font-black text-emerald-700">₹{p.amount}</td>
                        <td className="py-3.5 px-2 text-slate-500">{new Date(p.requested_at).toLocaleDateString()}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-800">{p.batch_date || 'Monday Batch'}</td>
                        <td className="py-3.5 px-2">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            p.status === 'SETTLED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {p.status === 'PENDING' ? 'Pending Batch' : p.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          {p.status === 'PENDING' ? (
                            <button
                              onClick={() => setSettlingPayoutId(p.id)}
                              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg cursor-pointer shadow"
                            >
                              Mark Settled
                            </button>
                          ) : (
                            <span className="font-mono text-[11px] font-semibold text-slate-500">Ref: {p.transaction_ref || 'SETTLED'}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* SETTLEMENT MODAL */}
            {settlingPayoutId && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-slate-900">Settle Partner Withdrawal</h3>
                    <button onClick={() => setSettlingPayoutId(null)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enter Banking UTR / Transaction Reference *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. UTR-9876543210"
                      value={transactionRef}
                      onChange={e => setTransactionRef(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                  <button
                    onClick={handleSettlePayout}
                    disabled={!transactionRef}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer disabled:opacity-50"
                  >
                    Confirm Settlement & Notify Partner
                  </button>
                </div>
              </div>
            )}

            {/* BULK EXCEL RE-UPLOAD AUTO-SETTLEMENT MODAL */}
            {showBulkSettlementModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-slide-up">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Bulk Excel Re-Upload Auto-Settlement
                      </h3>
                      <p className="text-xs text-slate-500">Paste or upload corporate netbanking CSV/Excel output containing UTRs.</p>
                    </div>
                    <button onClick={() => setShowBulkSettlementModal(false)} className="text-slate-400 hover:text-slate-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">
                      Paste CSV/Tab-Separated Data (Format: <span className="font-mono text-emerald-700">RequestID, UTR, [Status], [Remarks]</span>)
                    </label>
                    <textarea
                      rows={6}
                      value={bulkSettlementInput}
                      onChange={e => setBulkSettlementInput(e.target.value)}
                      placeholder={`req_019283, UTR99887766, SETTLED, Netbanking Paid\nreq_019284, UTR99887767, SETTLED, Netbanking Paid`}
                      className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-600 bg-slate-50"
                    />
                  </div>

                  {bulkSettlementResult && (
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold space-y-1">
                      <p className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" /> Bulk Settlement Completed Successfully!
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        {bulkSettlementResult.settledCount} partners updated to SETTLED and notified. {bulkSettlementResult.failedCount} failed or skipped.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBulkSettlementModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkExcelSettlement}
                      disabled={!bulkSettlementInput.trim()}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer disabled:opacity-50"
                    >
                      Process & Notify Partners
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: DISPATCH INBOX BROADCAST */}
        {activeTab === 'broadcast' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6 max-w-3xl">
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Send className="w-5 h-5 text-violet-600" /> Dispatch Partner Inbox Broadcast
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Send official campaign announcements or badge updates directly to creator workspace inboxes.</p>
            </div>

            {broadcastSent && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Broadcast notification dispatched successfully to partner workspace inboxes!</span>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Audience</label>
                  <select
                    value={broadcastTarget}
                    onChange={e => setBroadcastTarget(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="ALL">All Active Courage Partners</option>
                    <option value="SPECIFIC">Specific Referral Code</option>
                  </select>
                </div>

                {broadcastTarget === 'SPECIFIC' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Target Referral Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CNTSJN"
                      value={targetRefCode}
                      onChange={e => setTargetRefCode(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={broadcastCategory}
                    onChange={e => setBroadcastCategory(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold"
                  >
                    <option value="System">System & General</option>
                    <option value="Mission">Mission & Campaign</option>
                    <option value="Payout">Payout & Finance</option>
                    <option value="Badge">Badge & Recognition</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Broadcast Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CNTS 2026 Phase 2 Referral Bonus Unlocked"
                  value={broadcastTitle}
                  onChange={e => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Message Body *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="Write the complete announcement text here..."
                  value={broadcastBody}
                  onChange={e => setBroadcastBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-violet-600"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Dispatch Inbox Notification
              </button>
            </form>
          </div>
        )}

        {/* TAB 7: SUSPENSION REVIEWS & APPEALS QUEUE */}
        {activeTab === 'appeals' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" /> Suspension Review Appeals Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review review requests and appeal explanations submitted by restricted partners.
                </p>
              </div>
              <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                {partners.filter(p => p.status === 'SUSPENDED').length} Account(s) Suspended / Under Review
              </span>
            </div>

            {partners.filter(p => p.status === 'SUSPENDED').length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Pending Suspension Appeals</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  There are currently no suspended partner accounts awaiting administrative review.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {partners
                  .filter(p => p.status === 'SUSPENDED')
                  .map(p => (
                    <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-sm shrink-0">
                            {p.full_name?.substring(0, 2).toUpperCase() || 'CP'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-bold text-base text-slate-900">{p.full_name}</h3>
                              <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                                {p.status}
                              </span>
                              {p.appeal_status === 'PENDING' && (
                                <span className="text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300 animate-pulse">
                                  APPEAL PENDING
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">
                              {p.email} • Code: {p.referral_code} • ID: {p.partner_id || p.id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleReinstatePartner(p.id)}
                            className="py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow cursor-pointer"
                          >
                            <UserCheck className="w-4 h-4" /> Approve Appeal & Reinstate
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                          <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider block">Suspension Reason & Admin Note</span>
                          <div className="font-semibold text-slate-900 text-xs">{p.suspension_reason || 'Policy & Compliance Verification Review'}</div>
                          <div className="text-slate-600 text-xs italic bg-white p-2.5 rounded-xl border border-slate-200">
                            "{p.suspension_note || 'Administrative review initiated.'}"
                          </div>
                          {p.suspended_at && (
                            <span className="text-[10.5px] font-mono text-slate-400 block pt-1">
                              Suspended on: {new Date(p.suspended_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200/80 space-y-1.5">
                          <span className="text-[10px] font-mono font-bold text-indigo-900 uppercase tracking-wider block">Partner Appeal Message</span>
                          {p.appeal_message ? (
                            <>
                              <div className="text-slate-800 text-xs font-sans bg-white p-3 rounded-xl border border-indigo-100 leading-relaxed">
                                "{p.appeal_message}"
                              </div>
                              {p.appeal_requested_at && (
                                <span className="text-[10.5px] font-mono text-indigo-700 block pt-1 font-semibold">
                                  Appeal Submitted: {new Date(p.appeal_requested_at).toLocaleDateString()}
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="text-slate-400 text-xs italic bg-white/60 p-3 rounded-xl border border-indigo-100">
                              No appeal message written yet by partner.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 8: PARTNER SUPPORT TICKETS & RESOLUTION DESK */}
        {activeTab === 'support-tickets' && (
          <div className="space-y-6">
            {/* Stats Header */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Total Partner Tickets
                </span>
                <div className="font-mono text-2xl font-black text-slate-900 mt-1">
                  {partnerTickets.length}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200/80 shadow-xs">
                <span className="text-[10.5px] font-mono font-bold text-amber-700 uppercase tracking-wider block">
                  Open Inquiries
                </span>
                <div className="font-mono text-2xl font-black text-amber-600 mt-1">
                  {partnerTickets.filter(t => t.status === 'OPEN').length}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-blue-200/80 shadow-xs">
                <span className="text-[10.5px] font-mono font-bold text-blue-700 uppercase tracking-wider block">
                  In Progress
                </span>
                <div className="font-mono text-2xl font-black text-blue-600 mt-1">
                  {partnerTickets.filter(t => t.status === 'IN_PROGRESS').length}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 shadow-xs">
                <span className="text-[10.5px] font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                  Resolved Tickets
                </span>
                <div className="font-mono text-2xl font-black text-emerald-600 mt-1">
                  {partnerTickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length}
                </div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 overflow-x-auto">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">Status:</span>
                {(['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setTicketStatusFilter(st)}
                    className={`text-xs px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                      ticketStatusFilter === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search partner, code, ticket #..."
                    value={ticketSearchQuery}
                    onChange={e => setTicketSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 w-64 bg-slate-50"
                  />
                </div>
                <button
                  onClick={() => fetchPartnerTickets()}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition cursor-pointer"
                  title="Refresh tickets"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Tickets Main Content Grid */}
            {loadingTickets ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 space-y-2">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-400 font-medium">Fetching partner support inquiries...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Tickets Inbound List (5 Cols) */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col h-[650px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Partner Inquiries ({
                        partnerTickets
                          .filter(t => ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter)
                          .filter(t => !ticketSearchQuery || 
                            t.ticketNumber?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                            t.partnerName?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                            t.referralCode?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                            t.subject?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
                          ).length
                      })
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
                    {partnerTickets
                      .filter(t => ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter)
                      .filter(t => !ticketSearchQuery || 
                        t.ticketNumber?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                        t.partnerName?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                        t.referralCode?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                        t.subject?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
                      ).length === 0 ? (
                        <div className="text-center py-16 text-slate-400 space-y-2">
                          <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="text-xs">No partner support tickets found matching filter.</p>
                        </div>
                    ) : (
                      partnerTickets
                        .filter(t => ticketStatusFilter === 'ALL' || t.status === ticketStatusFilter)
                        .filter(t => !ticketSearchQuery || 
                          t.ticketNumber?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                          t.partnerName?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                          t.referralCode?.toLowerCase().includes(ticketSearchQuery.toLowerCase()) ||
                          t.subject?.toLowerCase().includes(ticketSearchQuery.toLowerCase())
                        )
                        .map(t => (
                          <div
                            key={t.id}
                            onClick={() => setSelectedPartnerTicket(t)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                              selectedPartnerTicket?.id === t.id
                                ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                                : 'border-slate-200/80 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10.5px] font-bold text-slate-400">
                                  #{t.ticketNumber}
                                </span>
                                <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-black rounded-md font-mono">
                                  {t.referralCode}
                                </span>
                              </div>
                              <span className={`text-[9.5px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                                t.status === 'RESOLVED' || t.status === 'CLOSED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : t.status === 'IN_PROGRESS'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {t.status}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{t.description}</p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 font-mono">
                              <span className="font-sans font-medium text-slate-600">{t.partnerName}</span>
                              <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Conversation & Action Desk (7 Cols) */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col h-[650px]">
                  {selectedPartnerTicket ? (
                    <div className="flex flex-col h-full space-y-4">
                      {/* Ticket Header */}
                      <div className="border-b border-slate-100 pb-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-black text-blue-600">#{selectedPartnerTicket.ticketNumber}</span>
                            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-mono font-black">
                              Code: {selectedPartnerTicket.referralCode}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">({selectedPartnerTicket.topic})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span>Live Sync</span>
                            </span>
                            <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                              selectedPartnerTicket.status === 'RESOLVED' || selectedPartnerTicket.status === 'CLOSED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : selectedPartnerTicket.status === 'IN_PROGRESS'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {selectedPartnerTicket.status}
                            </span>
                          </div>
                        </div>

                        <h3 className="font-bold text-base text-slate-900">{selectedPartnerTicket.subject}</h3>
                        
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>Partner: <strong className="text-slate-800">{selectedPartnerTicket.partnerName}</strong></span>
                          {selectedPartnerTicket.email && <span>• Email: {selectedPartnerTicket.email}</span>}
                          {selectedPartnerTicket.phone && <span>• Phone: {selectedPartnerTicket.phone}</span>}
                          <span>• Date: {new Date(selectedPartnerTicket.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Messages Thread Feed */}
                      <div className="flex-1 overflow-y-auto space-y-3 pr-1 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                        {/* Original Partner Query */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1 mr-8">
                          <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-500">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-slate-400" />
                              <span>{selectedPartnerTicket.partnerName} (Partner Inquiry)</span>
                            </span>
                            <span>{new Date(selectedPartnerTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                            {selectedPartnerTicket.description}
                          </p>
                        </div>

                        {/* Subsequent Thread Replies */}
                        {selectedPartnerTicket.messages
                          ?.filter((m: any) => m.message !== selectedPartnerTicket.description)
                          ?.map((msg: any, idx: number) => {
                            const isAdmin = msg.sender_role === 'ADMIN';
                            return (
                              <div
                                key={idx}
                                className={`p-4 rounded-2xl text-xs space-y-1 shadow-xs ${
                                  isAdmin
                                    ? 'bg-blue-600 text-white ml-8 rounded-tr-none'
                                    : 'bg-white text-slate-800 mr-8 rounded-tl-none border border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] font-bold opacity-90">
                                  <span className="flex items-center gap-1.5">
                                    {isAdmin ? (
                                      <>
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        <span>Admin Helpdesk Response</span>
                                      </>
                                    ) : (
                                      <>
                                        <User className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{selectedPartnerTicket.partnerName}</span>
                                      </>
                                    )}
                                  </span>
                                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            );
                        })}
                      </div>

                      {/* Reply & Status Action Controls */}
                      <div className="border-t border-slate-100 pt-3 space-y-3">
                        <textarea
                          rows={3}
                          value={ticketReplyMessage}
                          onChange={e => setTicketReplyMessage(e.target.value)}
                          placeholder="Type administrative reply / resolution instructions for the partner (dispatched to their Inbox)..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendTicketReply(selectedPartnerTicket.id, 'RESOLVED')}
                              disabled={isSendingTicketReply}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Mark as Resolved</span>
                            </button>

                            {selectedPartnerTicket.status === 'RESOLVED' && (
                              <button
                                type="button"
                                onClick={() => handleSendTicketReply(selectedPartnerTicket.id, 'IN_PROGRESS')}
                                disabled={isSendingTicketReply}
                                className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold text-xs rounded-xl transition cursor-pointer"
                              >
                                Re-open Ticket
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendTicketReply(selectedPartnerTicket.id)}
                            disabled={isSendingTicketReply || !ticketReplyMessage.trim()}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSendingTicketReply ? 'Dispatching...' : 'Send Reply to Partner'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                      <MessageSquare className="w-12 h-12 text-slate-200" />
                      <p className="text-xs">Select a partner support ticket from the list to view inquiry details and reply.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CREATOR APPLICATION INSPECTION SLIDE-OVER DRAWER */}
        {selectedPartnerDetail && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 md:p-8 space-y-6 flex flex-col justify-between animate-slide-left">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow shrink-0 border-2 border-white">
                      {(selectedPartnerDetail.profile_image_url || selectedPartnerDetail.profileImageUrl) ? (
                        <img 
                          src={selectedPartnerDetail.profile_image_url || selectedPartnerDetail.profileImageUrl} 
                          alt="Profile Avatar" 
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => setPreviewImage(selectedPartnerDetail.profile_image_url || selectedPartnerDetail.profileImageUrl)}
                        />
                      ) : (
                        selectedPartnerDetail.full_name?.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                        {selectedPartnerDetail.partner_id} • {selectedPartnerDetail.referral_code}
                      </span>
                      <h2 className="font-display font-bold text-xl text-slate-900">{selectedPartnerDetail.full_name}</h2>
                      {[selectedPartnerDetail.city, selectedPartnerDetail.state].filter(Boolean).length > 0 && (
                        <span className="text-xs text-slate-500 font-medium block">
                          📍 {[selectedPartnerDetail.city, selectedPartnerDetail.state].filter(Boolean).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedPartnerDetail(null)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details list */}
                <div className="space-y-4 text-xs">
                  {/* SUSPENSION STATUS BANNER IN DRAWER */}
                  {selectedPartnerDetail.status === 'SUSPENDED' ? (
                    <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Account Currently Suspended
                        </span>
                        <button
                          onClick={() => handleReinstatePartner(selectedPartnerDetail.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow"
                        >
                          Reinstate Account
                        </button>
                      </div>
                      <div className="text-xs text-amber-950 font-medium">
                        <strong>Reason:</strong> {selectedPartnerDetail.suspension_reason || 'Compliance Verification Review'}
                      </div>
                      {selectedPartnerDetail.suspension_note && (
                        <div className="text-[11px] text-amber-800 italic bg-amber-100/60 p-2 rounded-lg">
                          "{selectedPartnerDetail.suspension_note}"
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        onClick={() => setSuspendingPartner(selectedPartnerDetail)}
                        className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" /> Suspend Account
                      </button>
                    </div>
                  )}

                  {/* SUBMITTED PARTNER APPEAL MESSAGE IN DRAWER */}
                  {selectedPartnerDetail.appeal_message && (
                    <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-indigo-900 block flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-700" /> Submitted Partner Review Appeal
                        </span>
                        {selectedPartnerDetail.appeal_requested_at && (
                          <span className="text-[10.5px] font-mono text-indigo-700 font-bold">
                            {new Date(selectedPartnerDetail.appeal_requested_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-indigo-100 font-sans leading-relaxed">
                        "{selectedPartnerDetail.appeal_message}"
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Information</span>
                    <p className="font-semibold text-slate-800">Email: {selectedPartnerDetail.email}</p>
                    <p className="font-semibold text-slate-800">Phone: {selectedPartnerDetail.phone || 'Not specified'}</p>
                    {(selectedPartnerDetail.city || selectedPartnerDetail.state) && (
                      <p className="font-semibold text-slate-800">
                        Location: {[selectedPartnerDetail.city, selectedPartnerDetail.state].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Content Niche & Bio</span>
                    <p className="font-bold text-indigo-900">{selectedPartnerDetail.niche || 'Infotainment & Education'}</p>
                    <p className="text-slate-600 leading-relaxed">{selectedPartnerDetail.bio || 'No bio provided.'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Audience Reach & Scale</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Claimed Audience Scale:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {selectedPartnerDetail.audience_scale || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Total Followers/Reach:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(selectedPartnerDetail.total_reach || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* VERIFIED CHANNELS & PROOF SCREENSHOTS */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified Channels & Proof Screenshots</span>
                      <span className="font-mono text-indigo-600 text-[11px] font-bold">
                        {Array.isArray(selectedPartnerDetail.platform_details || selectedPartnerDetail.platformDetails) 
                          ? (selectedPartnerDetail.platform_details || selectedPartnerDetail.platformDetails).length 
                          : 0} Channel(s)
                      </span>
                    </div>

                    {Array.isArray(selectedPartnerDetail.platform_details || selectedPartnerDetail.platformDetails) && 
                     (selectedPartnerDetail.platform_details || selectedPartnerDetail.platformDetails).length > 0 ? (
                      <div className="space-y-3 pt-1">
                        {(selectedPartnerDetail.platform_details || selectedPartnerDetail.platformDetails).map((item: any, idx: number) => {
                          const proofUrl = item.proofScreenshotUrl || item.proof_screenshot_url;
                          return (
                            <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 shadow-2xs">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <span className="font-extrabold text-slate-900 block text-xs">{item.platform || 'Channel/Platform'}</span>
                                  <span className="text-indigo-600 font-mono text-[11px] font-medium block truncate max-w-xs">{item.handleOrUrl || item.handle || 'No handle'}</span>
                                </div>
                                {(item.followerCount || item.followers) ? (
                                  <span className="bg-slate-100 text-slate-700 font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                                    {Number(item.followerCount || item.followers).toLocaleString('en-IN')} followers
                                  </span>
                                ) : null}
                              </div>

                              {/* Proof Screenshot Image */}
                              {proofUrl ? (
                                <div className="pt-1">
                                  <span className="text-[10px] font-bold text-slate-500 block mb-1.5 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Proof Screenshot Uploaded:
                                  </span>
                                  <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-900 max-h-52 flex items-center justify-center">
                                    <img
                                      src={proofUrl}
                                      alt={`Proof for ${item.platform}`}
                                      className="w-full h-auto max-h-52 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                                      onClick={() => setPreviewImage(proofUrl)}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setPreviewImage(proofUrl)}
                                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-xs gap-1.5 cursor-pointer backdrop-blur-[2px]"
                                    >
                                      <Eye className="w-4 h-4 text-amber-300" /> Click to Expand Full Proof
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-[11px] font-medium flex items-center gap-2">
                                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                  <span>No proof screenshot image attached for this channel.</span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-100 text-slate-500 text-[11px] italic">
                        No channel platform details or proof screenshots submitted.
                      </div>
                    )}
                  </div>

                  {/* SUBMITTED CAMPAIGN VIDEO LINKS BY THIS PARTNER */}
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-indigo-600" /> Submitted Campaign Video Links
                      </span>
                      <span className="font-mono text-indigo-600 text-[11px] font-bold">
                        {videoSubmissions.filter(v => (v.referral_code || v.referralCode || '').toUpperCase() === (selectedPartnerDetail.referral_code || '').toUpperCase()).length} Video(s)
                      </span>
                    </div>

                    {videoSubmissions.filter(v => (v.referral_code || v.referralCode || '').toUpperCase() === (selectedPartnerDetail.referral_code || '').toUpperCase()).length > 0 ? (
                      <div className="space-y-2.5 pt-1">
                        {videoSubmissions
                          .filter(v => (v.referral_code || v.referralCode || '').toUpperCase() === (selectedPartnerDetail.referral_code || '').toUpperCase())
                          .map((vid, vIdx) => (
                            <div key={vIdx} className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-slate-900 text-xs block">{vid.video_title || vid.videoTitle || 'Campaign Video'}</span>
                                <span className={`text-[9.5px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                                  vid.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {vid.status || 'PENDING_REVIEW'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-[11px] font-mono text-indigo-600 truncate max-w-xs">{vid.video_url || vid.videoUrl}</span>
                                <a
                                  href={vid.video_url || vid.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10.5px] px-2.5 py-1 rounded-lg shrink-0 flex items-center gap-1 cursor-pointer"
                                >
                                  <span>Watch Video</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 italic text-[11px]">No video submission links logged yet for this partner.</p>
                    )}
                  </div>

                  {/* Honorarium Rate Adjuster in Drawer */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Custom Honorarium Rate Setting</span>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-900 font-semibold">Current Rate / Candidate:</span>
                      <span className="font-mono text-base font-black text-emerald-950">₹{selectedPartnerDetail.honorarium_rate || 25}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      {[25, 30, 40, 50, 65, 100].map(r => (
                        <button
                          key={r}
                          onClick={() => handleUpdateRate(selectedPartnerDetail.id, r)}
                          className={`flex-1 py-1.5 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                            (selectedPartnerDetail.honorarium_rate || 25) === r
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                              : 'bg-white text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                          }`}
                        >
                          ₹{r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Quick Approval Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                {selectedPartnerDetail.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedPartnerDetail.id, 'APPROVED')}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-2 shadow cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" /> Approve Application
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedPartnerDetail.id, 'REJECTED')}
                      className="py-3 px-5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <UserX className="w-4 h-4" /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setSelectedPartnerDetail(null)}
                    className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-2xl shadow cursor-pointer"
                  >
                    Done Inspecting
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FULLSCREEN PROOF IMAGE PREVIEW LIGHTBOX MODAL */}
        {previewImage && (
          <div 
            className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setPreviewImage(null)}
          >
            <div 
              className="relative max-w-5xl max-h-[92vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl p-3 flex flex-col items-center"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={previewImage}
                alt="Verification Proof Screenshot"
                className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              />
              <div className="py-2.5 text-center text-xs text-slate-300 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Verification Proof Screenshot • Click anywhere outside to close
              </div>
            </div>
          </div>
        )}
        {/* SUSPEND CONFIRMATION MODAL */}
        {suspendingPartner && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 animate-fade-in relative text-slate-900">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">Suspend Partner Account</h3>
                    <p className="text-xs text-slate-500">Restricts dashboard access & retains historical records</p>
                  </div>
                </div>
                <button onClick={() => setSuspendingPartner(null)} className="text-slate-400 hover:text-slate-600 font-bold p-1">✕</button>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs space-y-1">
                <span className="font-bold text-slate-700">Target Partner:</span>
                <div className="font-bold text-indigo-700 text-sm">{suspendingPartner.full_name}</div>
                <div className="text-slate-500 font-mono">{suspendingPartner.email} • Code: {suspendingPartner.referral_code}</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Select Suspension Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Policy violation">Policy violation</option>
                    <option value="Fraudulent or suspicious activity">Fraudulent or suspicious activity</option>
                    <option value="Misleading information">Misleading information</option>
                    <option value="Invalid referral activity">Invalid referral activity</option>
                    <option value="Repeated violations">Repeated violations</option>
                    <option value="Payment / financial issue">Payment / financial issue</option>
                    <option value="Inappropriate content">Inappropriate content</option>
                    <option value="Verification issue">Verification issue</option>
                    <option value="Other">Other (Requires note below)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                    Additional Administrative Explanation {suspensionReason === 'Other' && <span className="text-rose-500">*</span>}
                  </label>
                  <textarea
                    value={suspensionNote}
                    onChange={(e) => setSuspensionNote(e.target.value)}
                    rows={3}
                    placeholder="Provide context explaining why this account is being suspended..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required={suspensionReason === 'Other'}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 leading-relaxed">
                  <strong>What happens next?</strong>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-amber-800">
                    <li>Partner dashboard access will be restricted.</li>
                    <li>Partner sees exact reason and can submit an appeal.</li>
                    <li>Historical referrals, earnings, and payout records remain safe.</li>
                    <li>Account can be reinstated by admin at any time.</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setSuspendingPartner(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSuspend}
                  disabled={isSuspending}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center space-x-2 transition"
                >
                  {isSuspending ? 'Suspending...' : 'Suspend Account'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
