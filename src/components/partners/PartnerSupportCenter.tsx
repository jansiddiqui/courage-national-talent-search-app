'use client';

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, BookOpen, Send, CheckCircle2, ShieldCheck, Search } from 'lucide-react';

export const PartnerSupportCenter: React.FC = () => {
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setSubject('');
      setMessage('');
    }, 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <HelpCircle className="w-3.5 h-3.5" /> Partner Support & Helpdesk
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Support Center & Knowledge Base
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Dedicated 24/7 assistance for Courage Partners, school coordinators, and creators.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* TICKET FORM */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600" /> Raise a Support Ticket
          </h3>
          
          <form onSubmit={handleTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Issue Topic</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium">
                <option>Campaign & Mission Guidance</option>
                <option>Payout & Settlement Query</option>
                <option>School Institutional Verification</option>
                <option>AI Studio & Media Assets</option>
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={ticketSubmitted}
              className="w-full btn-primary text-xs py-3 bg-indigo-600 hover:bg-indigo-700 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {ticketSubmitted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
              {ticketSubmitted ? 'Ticket #8942 Submitted! Priority Review' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" /> Partner FAQs
          </h3>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Q: How are partner payouts calculated and verified?</span>
              <p className="text-slate-600">A: Honorariums are calculated per verified student test registration and school connection. Verification completes automatically when students verify their OTP or school code.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Q: How do I request physical posters and school brochures?</span>
              <p className="text-slate-600">A: Submit a ticket above specifying your address and quantity required. Founding Partners receive priority dispatch within 48 hours.</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Q: Can I add my Courage Partner certification to my resume & LinkedIn?</span>
              <p className="text-slate-600">A: Absolutely! Go to Learning & Certifications to download your verified digital certificate PDF and direct LinkedIn credential link.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
