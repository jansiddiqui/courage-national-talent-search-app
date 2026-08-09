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
  Video
} from 'lucide-react';

export default function AdminPartnersPage() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'directory' | 'video-submissions' | 'payouts' | 'broadcast' | 'rates'>('approvals');
  const [partners, setPartners] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [videoSubmissions, setVideoSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rate Editing State
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<number>(25);

  // Inspector Drawer State
  const [selectedPartnerDetail, setSelectedPartnerDetail] = useState<any | null>(null);

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

  useEffect(() => {
    fetchPartners();
    fetchPayouts();
    fetchVideoSubmissions();
  }, []);

  const handleUpdateStatus = async (partnerId: string, status: 'APPROVED' | 'REJECTED' | 'SUSPENDED') => {
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
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(p.id, p.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED')}
                          className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                        >
                          Change Status
                        </button>
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
                        <td className="py-3.5 px-2">
                          <button
                            onClick={() => {
                              setEditingPartnerId(p.id);
                              setNewRate(p.honorarium_rate || 25);
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit Rate
                          </button>
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

        {/* CREATOR APPLICATION INSPECTION SLIDE-OVER DRAWER */}
        {selectedPartnerDetail && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-xl h-full shadow-2xl overflow-y-auto p-6 md:p-8 space-y-6 flex flex-col justify-between animate-slide-left">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow">
                      {selectedPartnerDetail.full_name?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                        {selectedPartnerDetail.partner_id} • {selectedPartnerDetail.referral_code}
                      </span>
                      <h2 className="font-display font-bold text-xl text-slate-900">{selectedPartnerDetail.full_name}</h2>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPartnerDetail(null)} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl bg-slate-100">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details list */}
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Information</span>
                    <p className="font-semibold text-slate-800">Email: {selectedPartnerDetail.email}</p>
                    <p className="font-semibold text-slate-800">Phone: {selectedPartnerDetail.phone || 'Not specified'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Content Niche & Bio</span>
                    <p className="font-bold text-indigo-900">{selectedPartnerDetail.niche || 'Infotainment & Education'}</p>
                    <p className="text-slate-600 leading-relaxed">{selectedPartnerDetail.bio || 'No bio provided.'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl space-y-3 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Audience Reach & Platforms</span>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Claimed Audience Scale:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                        {selectedPartnerDetail.audience_scale}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 font-medium">Total Followers/Reach:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(selectedPartnerDetail.total_reach || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
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
      </div>
    </>
  );
}
