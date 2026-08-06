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
  UserX
} from 'lucide-react';

export default function AdminPartnersPage() {
  const [activeTab, setActiveTab] = useState<'approvals' | 'directory' | 'payouts' | 'broadcast'>('approvals');
  const [partners, setPartners] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Rate Editing State
  const [editingPartnerId, setEditingPartnerId] = useState<string | null>(null);
  const [newRate, setNewRate] = useState<number>(25);

  // Settlement Modal State
  const [settlingPayoutId, setSettlingPayoutId] = useState<string | null>(null);
  const [transactionRef, setTransactionRef] = useState('');

  // Broadcast Form State
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState<'ALL' | 'SPECIFIC'>('ALL');
  const [targetRefCode, setTargetRefCode] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState<'Mission' | 'Payout' | 'System' | 'Badge'>('System');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/partners');
      const data = await res.json();
      if (data.success && Array.isArray(data.partners)) {
        setPartners(data.partners);
      } else {
        // Mock fallback if DB empty
        setPartners([
          {
            id: 'p1',
            full_name: 'Jan Mohammad',
            email: 'jan@example.com',
            phone: '+91 83606 03173',
            referral_code: 'CNTSJN',
            custom_slug: 'cntsjn',
            partner_id: 'CP-2026-000412',
            primary_role: 'Content Creator & Educator',
            audience_scale: '10k - 50k',
            status: 'PENDING',
            tier: 'GOLD',
            honorarium_rate: 25.00,
            created_at: new Date().toISOString(),
          },
          {
            id: 'p2',
            full_name: 'Rahul Sharma',
            email: 'rahul@example.com',
            phone: '+91 98765 43210',
            referral_code: 'RAHULEDU',
            custom_slug: 'rahuledu',
            partner_id: 'CP-2026-000384',
            primary_role: 'EdTech Reviewer',
            audience_scale: '50k - 250k',
            status: 'APPROVED',
            tier: 'PLATINUM',
            honorarium_rate: 40.00,
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          },
          {
            id: 'p3',
            full_name: 'Ananya Sharma',
            email: 'ananya@example.com',
            phone: '+91 91234 56789',
            referral_code: 'ANANYA26',
            custom_slug: 'ananyasharma',
            partner_id: 'CP-2026-000519',
            primary_role: 'School Teacher & Mentor',
            audience_scale: '1k - 10k',
            status: 'APPROVED',
            tier: 'SILVER',
            honorarium_rate: 25.00,
            created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch admin partners:', err);
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
        setPayouts([
          {
            id: 'pay-1',
            partner_id: 'p1',
            referral_code: 'CNTSJN',
            amount: 3100,
            status: 'PENDING',
            requested_at: new Date().toISOString(),
            batch_date: '2026-08-10',
            partners: { full_name: 'Jan Mohammad', email: 'jan@example.com', referral_code: 'CNTSJN' }
          }
        ]);
      }
    } catch (err) {
      console.error('Failed to fetch admin payouts:', err);
    }
  };

  useEffect(() => {
    fetchPartners();
    fetchPayouts();
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
      }
    } catch (err) {
      console.error('Failed to update partner status:', err);
    }
  };

  const handleUpdateRate = async (partnerId: string) => {
    try {
      const res = await fetch('/api/admin/partners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ partnerId, honorariumRate: newRate })
      });
      const data = await res.json();
      if (data.success) {
        setPartners(prev => prev.map(p => p.id === partnerId ? { ...p, honorarium_rate: newRate } : p));
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

  return (
    <>
      <div className="space-y-8 p-6 md:p-8 animate-fade-in max-w-7xl mx-auto">
        
        {/* TOP BANNER */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 md:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-3 py-1 rounded-full mb-3">
              <Users className="w-3.5 h-3.5" /> Official Partner & Creator Control Console
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-white">
              Courage Partner & Creator Ecosystem
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Verify pending applications, configure custom student honorarium rates, process weekly payouts, and dispatch inbox broadcasts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">Pending Approval</span>
              <span className="font-mono text-2xl font-black text-white">{pendingPartners.length}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">Active Partners</span>
              <span className="font-mono text-2xl font-black text-white">{approvedPartners.length}</span>
            </div>

            <div className="bg-slate-900/90 border border-slate-700/80 px-4 py-3 rounded-2xl shrink-0 text-center">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">Queued Payouts</span>
              <span className="font-mono text-2xl font-black text-white">{pendingPayouts.length}</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1 text-xs font-bold w-fit border border-slate-200">
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
            <Users className="w-4 h-4 text-indigo-600" /> Partner Directory & Rates
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
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
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
                  placeholder="Search partner name or code..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-600 w-64"
                />
              </div>
            </div>

            {filteredPartners.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
                <Users className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-700">No partner applications match the filter</h3>
                <p className="text-xs text-slate-400">Try changing the status filter or clearing your search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredPartners.map(p => (
                  <div key={p.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 relative flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase text-indigo-600 tracking-wider block mb-0.5">
                            {p.partner_id || 'CP-2026-000412'} • Code: {p.referral_code}
                          </span>
                          <h3 className="font-display font-bold text-lg text-slate-900">{p.full_name}</h3>
                          <p className="text-xs text-slate-500">{p.email} • {p.phone || 'No Phone'}</p>
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
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Tier</span>
                          <span className="font-bold text-amber-700">{p.tier || 'BRONZE'}</span>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      {p.status === 'PENDING' ? (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'APPROVED')}
                            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <UserCheck className="w-4 h-4" /> Approve Application
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.id, 'REJECTED')}
                            className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <UserX className="w-4 h-4" /> Reject
                          </button>
                        </>
                      ) : (
                        <div className="w-full flex items-center justify-between">
                          <span className="text-xs text-slate-500 font-medium">Status set to {p.status}</span>
                          <button
                            onClick={() => handleUpdateStatus(p.id, p.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED')}
                            className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Toggle Status
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
                  <Users className="w-5 h-5 text-indigo-600" /> Active Partner Directory & Dynamic Honorarium Rates
                </h2>
                <p className="text-xs text-slate-500">As Admin, customize the student honorarium rate (₹25 default, ₹40, ₹50, ₹100) per partner.</p>
              </div>
            </div>

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
          </div>
        )}

        {/* TAB 3: WEEKLY PAYOUT SETTLEMENT QUEUE */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-600" /> Weekly Payout Settlement Queue
                </h2>
                <p className="text-xs text-slate-500">Review submitted partner withdrawal requests and enter UTR / transaction ref to mark settled.</p>
              </div>
            </div>

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
                        <span className="font-bold text-slate-900 block">{p.partners?.full_name || 'Jan Mohammad'}</span>
                        <span className="text-[10.5px] text-slate-400">{p.partners?.email || 'jan@example.com'}</span>
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
          </div>
        )}

        {/* TAB 4: DISPATCH INBOX BROADCAST */}
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
                  placeholder="e.g. 🎉 CNTS 2026 Phase 2 Referral Bonus Unlocked!"
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
      </div>
    </>
  );
}
