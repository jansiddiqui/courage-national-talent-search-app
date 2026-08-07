'use client';

import React, { useState } from 'react';
import {
  HelpCircle, MessageSquare, BookOpen, Send, CheckCircle2, ShieldCheck,
  Search, ChevronDown, ChevronUp, Phone, X
} from 'lucide-react';

interface PartnerSupportCenterProps {
  partnerName?: string;
  referralCode?: string;
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
    a: 'Payouts are processed every Monday in weekly batches. Withdrawals submitted before Sunday midnight are included in the next Monday batch. Instant UPI transfers are available for Gold tier and above.',
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
    q: 'What is the difference between Gold, Platinum and Founding tiers?',
    a: 'Gold: 100+ referrals, ₹40/registration. Platinum: 500+ referrals, ₹55/registration + bonus pool. Founding: First 500 partners locked in, lifetime ₹65/registration + institutional grant access. See the Tiers & Badges tab for full details.',
  },
  {
    q: 'How do I register a school as an institutional partner?',
    a: 'Go to CNTS Missions → School-Wide Talent Identification Drive. Submit the school details via the mission form or raise a school verification support ticket. Institutional grants of ₹5,000 per connected school apply.',
  },
];

export const PartnerSupportCenter: React.FC<PartnerSupportCenterProps> = ({
  partnerName = 'Jan Mohammad',
  referralCode = 'CNTSJN',
}) => {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('Campaign & Mission Guidance');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const ticketNumber = React.useRef(`#${Math.floor(1000 + Math.random() * 9000)}`);

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setSubject('');
      setMessage('');
      setTopic('Campaign & Mission Guidance');
    }, 4000);
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
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" /> Partner Helpdesk
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Support Center & Knowledge Base
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              Dedicated assistance for Courage Partners. Average response time: &lt; 4 hours.
            </p>
          </div>
          <a
            href={whatsappSupport}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-3 rounded-2xl transition-all shadow-xs cursor-pointer shrink-0"
          >
            <Phone className="w-4 h-4 fill-white" /> WhatsApp Support
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* TICKET FORM */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Raise a Support Ticket
          </h3>

          {ticketSubmitted ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="font-bold text-slate-900">Ticket {ticketNumber.current} Submitted!</p>
              <p className="text-xs text-slate-500">Our partner team will respond within 4 hours via email and inbox notification.</p>
            </div>
          ) : (
            <form onSubmit={handleTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Topic</label>
                <select
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div className="text-[10px] text-slate-400 font-mono bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                Partner: {partnerName} • Code: {referralCode}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow"
              >
                <Send className="w-4 h-4" /> Submit Support Ticket
              </button>
            </form>
          )}
        </div>

        {/* FAQ ACCORDION */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" /> Partner FAQs
          </h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-slate-50"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                <X className="w-3.5 h-3.5 text-slate-400 hover:text-slate-700" />
              </button>
            )}
          </div>

          {/* Accordion items */}
          <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
            {filteredFaqs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No FAQs match your search.</p>
            ) : filteredFaqs.map((faq, idx) => (
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
        </div>
      </div>

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
            <div className="text-xs font-bold text-indigo-900">Email Support</div>
            <div className="text-[11px] text-indigo-700">partners@courage.org</div>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-900">Avg Response Time</div>
            <div className="text-[11px] text-amber-700">Under 4 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
};
