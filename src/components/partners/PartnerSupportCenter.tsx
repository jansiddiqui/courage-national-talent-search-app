'use client';

import React, { useState, useEffect } from 'react';
import {
  HelpCircle, MessageSquare, BookOpen, Send, CheckCircle2, ShieldCheck, User,
  Search, ChevronDown, ChevronUp, Phone, X, Clock, AlertCircle, RefreshCw, MessageCircle
} from 'lucide-react';

interface PartnerSupportCenterProps {
  partnerName?: string;
  referralCode?: string;
  partnerEmail?: string;
  partnerPhone?: string;
}

interface TicketMessage {
  id: string;
  sender_role: string;
  message: string;
  created_at: string;
}

interface PartnerTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  topic: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  messages: TicketMessage[];
}

const FAQS = [
  {
    q: 'How are partner payouts calculated and verified?',
    a: 'Honorariums are calculated per verified student test registration and school connection. Verification completes automatically when students verify their OTP or school code. ₹25–₹75 per referral depending on your tier and campaign type.',
  },
  {
    q: 'How do I request physical posters and school brochures?',
    a: 'Submit a ticket with your full postal address and required quantity. Founding Partners receive priority dispatch within 48 hours. Standard partners receive dispatch within 5–7 business days.',
  },
  {
    q: 'Can I add my Courage Partner certification to my resume & LinkedIn?',
    a: 'Absolutely! Your verified digital certificate PDF and LinkedIn credential URL are available in the Tiers & Badges section. Simply click "Download Certificate" to get the print-ready version.',
  },
  {
    q: 'When is the next payout disbursement date?',
    a: 'Payouts are processed every Monday in weekly batches. Withdrawals submitted before Sunday midnight are included in the next Monday batch. Minimum available balance required is ₹500.',
  },
  {
    q: 'How do I upgrade my referral code or change my partner slug?',
    a: 'Referral codes are locked at registration for brand consistency. However, you may request a one-time code change by raising a support ticket with your desired new code (subject to availability).',
  },
  {
    q: 'Can I use the CNTS brand logo and official assets in my campaigns?',
    a: 'Yes! All verified Courage Partners have access to the official media kit including logo files, brand guidelines, banner templates, and school brochures from the Referral & Media Kit tab.',
  },
  {
    q: 'What is the difference between Bronze, Silver, Gold, Platinum and Founding tiers?',
    a: 'Bronze: ₹25/reg. Silver: 25+ refs, ₹30/reg. Gold: 100+ refs, ₹40/reg. Platinum: 500+ refs, ₹50/reg. Founding: First cohort partners locked at ₹65/reg + institutional grant access.',
  },
  {
    q: 'How do I register a school as an institutional partner?',
    a: 'Go to CNTS Missions → School-Wide Talent Identification Drive. Submit the school details via the mission form or raise a school verification support ticket. Institutional grants of ₹5,000 per connected school apply.',
  },
];

export const PartnerSupportCenter: React.FC<PartnerSupportCenterProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN',
  partnerEmail = '',
  partnerPhone = '',
}) => {
  const [activeTab, setActiveTab] = useState<'raise' | 'history' | 'faqs'>('raise');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('Campaign & Mission Guidance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState<{ ticketNumber: string; message: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Tickets history
  const [tickets, setTickets] = useState<PartnerTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<PartnerTicket | null>(null);
  const [followUpText, setFollowUpText] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  // FAQs
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fetchTickets = async (silent = false) => {
    if (!referralCode) return;
    if (!silent) setLoadingTickets(true);
    try {
      const res = await fetch(`/api/partner/tickets?referralCode=${encodeURIComponent(referralCode)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
        if (selectedTicket) {
          const updated = data.tickets.find((t: any) => t.id === selectedTicket.id);
          if (updated) {
            setSelectedTicket(updated);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch partner tickets:', err);
    } finally {
      if (!silent) setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [referralCode]);

  // Live Auto-Polling Heartbeat (No reload needed)
  useEffect(() => {
    if (!referralCode || activeTab !== 'history') return;
    const interval = setInterval(() => {
      fetchTickets(true);
    }, 3500);
    return () => clearInterval(interval);
  }, [referralCode, activeTab, selectedTicket?.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages?.length]);

  const handleSendFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !followUpText.trim()) return;
    const msg = followUpText.trim();
    setIsSendingFollowUp(true);
    setFollowUpText('');

    // Optimistic instant UI update
    const optimisticMsg: TicketMessage = {
      id: `temp-${Date.now()}`,
      sender_role: 'PARTNER',
      message: msg,
      created_at: new Date().toISOString()
    };
    setSelectedTicket(prev => prev ? {
      ...prev,
      messages: [...(prev.messages || []), optimisticMsg]
    } : null);

    try {
      const res = await fetch('/api/partner/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId: selectedTicket.id,
          message: msg,
          partnerName,
          referralCode
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchTickets(true);
      }
    } catch (err) {
      console.error('Failed to send follow up:', err);
    } finally {
      setIsSendingFollowUp(false);
    }
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setFormError('Please fill in both subject and message.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/partner/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subject: subject.trim(),
          message: message.trim(),
          partnerName,
          referralCode,
          email: partnerEmail,
          phone: partnerPhone
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTicketSuccess({
          ticketNumber: data.ticket?.ticketNumber || 'CNTS-PRT-RECORDED',
          message: data.message || 'Support ticket submitted successfully.'
        });
        setSubject('');
        setMessage('');
        fetchTickets();
      } else {
        setFormError(data.message || 'Failed to submit ticket. Please try again.');
      }
    } catch (err) {
      console.error('Ticket submission error:', err);
      setFormError('Network error. Please check your connection and retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = FAQS.filter(faq =>
    searchQuery === '' ||
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const whatsappSupport = `https://api.whatsapp.com/send?phone=918360603173&text=${encodeURIComponent(
    `Hi, I am ${partnerName} (Partner Code: ${referralCode}). I need support regarding: `
  )}`;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Partner Helpdesk & Resolution
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Support Center & Knowledge Base
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Direct line to the Courage Partner Operations Desk. Average response time: &lt; 4 hours.
            </p>
          </div>
          <a
            href={whatsappSupport}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Phone className="w-4 h-4 fill-white" /> WhatsApp Support Desk
          </a>
        </div>

        {/* Support Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('raise')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'raise' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Raise New Ticket
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('history');
              fetchTickets();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> My Tickets & Replies
            {tickets.length > 0 && (
              <span className="bg-white text-indigo-700 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-black ml-1">
                {tickets.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'faqs' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> Partner FAQs
          </button>
        </div>
      </div>

      {/* TAB 1: RAISE TICKET FORM + FAQS SIDEBAR */}
      {activeTab === 'raise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* TICKET FORM */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" /> Raise a Support Ticket
            </h3>

            {ticketSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center animate-fade-in bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-base text-slate-900">
                  Ticket #{ticketSuccess.ticketNumber} Logged!
                </h4>
                <p className="text-xs text-slate-600 max-w-sm">
                  Our Partner Operations Team has received your inquiry and will respond within 4 hours. You will receive updates here and in your inbox.
                </p>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTicketSuccess(null);
                      setActiveTab('history');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-indigo-700 transition cursor-pointer"
                  >
                    View Ticket Timeline
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketSuccess(null)}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition cursor-pointer"
                  >
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Issue Topic</label>
                  <select
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    <option>Campaign & Mission Guidance</option>
                    <option>Payout & Settlement Query</option>
                    <option>School Institutional Verification</option>
                    <option>AI Studio & Media Assets</option>
                    <option>Referral Code / Link Issue</option>
                    <option>Tier Upgrade Request</option>
                    <option>Other Partner Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Need physical school brochures for Patna drive"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Request</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain your query in detail..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div className="text-[10.5px] text-slate-500 font-mono bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Partner: <strong className="text-slate-800 font-bold">{partnerName}</strong></span>
                  <span>Code: <strong className="text-indigo-600 font-bold">{referralCode}</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md active:scale-[0.99]"
                >
                  {isSubmitting ? (
                    <span>Submitting Ticket to Helpdesk...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* QUICK FAQs PREVIEW */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-600" /> Frequently Asked
              </h3>
              <button
                type="button"
                onClick={() => setActiveTab('faqs')}
                className="text-xs text-indigo-600 hover:underline font-bold"
              >
                View all FAQs →
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[380px] pr-1">
              {FAQS.slice(0, 4).map((faq, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    expandedFaq === idx ? 'border-indigo-200 bg-indigo-50/60' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left px-4 py-3 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span className="font-bold text-xs text-slate-900 leading-snug">{faq.q}</span>
                    {expandedFaq === idx
                      ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-4 pb-4 animate-fade-in">
                      <p className="text-xs text-slate-700 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Helpline Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-950">Urgent Campaign Issue?</div>
                  <div className="text-[11px] text-emerald-700">Chat with partner success desk on WhatsApp</div>
                </div>
              </div>
              <a
                href={whatsappSupport}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
              >
                Chat
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY TICKETS & ADMIN REPLIES */}
      {activeTab === 'history' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-600" /> My Submitted Support Tickets
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Track status and correspondence with the Courage Partner Operations Desk.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchTickets()}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl border border-slate-200 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingTickets ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {loadingTickets ? (
            <div className="text-center py-12 space-y-2">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Loading your tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl space-y-3">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">No Support Tickets Raised Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Have questions about payouts, missions, or promotional materials? Raise a ticket and get resolved within 4 hours.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('raise')}
                className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-indigo-700 transition cursor-pointer"
              >
                Raise a Support Ticket
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ticket List */}
              <div className="space-y-3 lg:col-span-1 border-r border-slate-100 pr-0 lg:pr-4">
                {tickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      selectedTicket?.id === t.id
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-slate-400">
                        #{t.ticketNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-slate-900 line-clamp-1">{t.subject}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{t.topic}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                      <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                      {t.messages.length > 1 && (
                        <span className="text-indigo-600 font-bold flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" /> {t.messages.length} messages
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket Timeline Conversation Detail */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-indigo-700">#{selectedTicket.ticketNumber}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs font-semibold text-slate-600">{selectedTicket.topic}</span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 mt-0.5">{selectedTicket.subject}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Live Sync</span>
                        </span>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                          selectedTicket.status === 'RESOLVED' || selectedTicket.status === 'CLOSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedTicket.status}
                        </span>
                      </div>
                    </div>

                    {/* Messages Thread */}
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {selectedTicket.messages.map((m, idx) => {
                        const isAdmin = m.sender_role === 'ADMIN';
                        return (
                          <div
                            key={idx}
                            className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`p-3.5 rounded-2xl text-xs space-y-1.5 transition-all max-w-[85%] ${
                                isAdmin
                                  ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200 shadow-xs'
                                  : 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                              }`}
                            >
                              <div className="flex items-center justify-between gap-4 text-[10px] font-bold opacity-90">
                                <span className="flex items-center gap-1.5">
                                  {isAdmin ? (
                                    <>
                                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                                      <span className="text-slate-800 font-bold">Courage Helpdesk Admin</span>
                                    </>
                                  ) : (
                                    <>
                                      <User className="w-3.5 h-3.5 text-indigo-200" />
                                      <span>You ({partnerName})</span>
                                    </>
                                  )}
                                </span>
                                <span className={isAdmin ? 'text-slate-400 font-normal' : 'text-indigo-100 font-normal'}>
                                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Interactive Follow-up Reply Box */}
                    <form onSubmit={handleSendFollowUp} className="pt-2 border-t border-slate-200/80 flex items-center gap-2">
                      <input
                        type="text"
                        value={followUpText}
                        onChange={e => setFollowUpText(e.target.value)}
                        placeholder="Type a follow-up reply or question (live syncs immediately)..."
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={isSendingFollowUp || !followUpText.trim()}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSendingFollowUp ? 'Sending...' : 'Reply'}</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl min-h-[250px]">
                    <MessageSquare className="w-8 h-8 text-slate-300" />
                    <p className="text-xs">Select a ticket from the left column to view the resolution timeline and helpdesk replies.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FULL FAQS */}
      {activeTab === 'faqs' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-display font-black text-xl text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" /> Knowledge Base & FAQs
            </h3>
            <p className="text-xs text-slate-500">
              Clear answers to the most frequent partner questions regarding payouts, missions, and referral tracking.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by keyword (payouts, missions, tiers, certificate)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer">
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Accordion items */}
          <div className="space-y-2.5">
            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-12">No FAQs match your search query.</p>
            ) : filteredFaqs.map((faq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  expandedFaq === idx ? 'border-indigo-200 bg-indigo-50/60 shadow-xs' : 'border-slate-200/90 bg-white hover:bg-slate-50/60'
                }`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{faq.q}</span>
                  {expandedFaq === idx
                    ? <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  }
                </button>
                {expandedFaq === idx && (
                  <div className="px-5 pb-5 animate-fade-in border-t border-indigo-100/60 pt-3">
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK ACTIONS FOOTER */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-900">WhatsApp Helpline</div>
            <div className="text-[11px] text-emerald-700">+91 83606 03173</div>
          </div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-indigo-900">Email Helpdesk</div>
            <div className="text-[11px] text-indigo-700">partners@courage.org</div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">SLA Guarantee</div>
            <div className="text-[11px] text-amber-700">&lt; 4 hours response</div>
          </div>
        </div>
      </div>
    </div>
  );
};
