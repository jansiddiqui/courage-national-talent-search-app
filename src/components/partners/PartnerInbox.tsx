'use client';

import React, { useState } from 'react';
import {
  Inbox, Bell, Award, CheckCircle2, Clock, ShieldCheck, Sparkles,
  X, ChevronDown, ChevronUp, Trash2, MessageSquare
} from 'lucide-react';

interface PartnerInboxProps {
  partnerName?: string;
}

interface Message {
  id: string;
  sender: string;
  title: string;
  preview: string;
  fullBody: string;
  time: string;
  unread: boolean;
  category: 'Badge' | 'Payout' | 'Mission' | 'System';
}

export const PartnerInbox: React.FC<PartnerInboxProps> = ({
  partnerName = 'Jan Mohammad',
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'Courage Partner Desk',
      title: 'Founding Partner Badge Granted 🏅',
      preview: 'Congratulations! Your Founding Partner status has been locked in.',
      fullBody: `Dear ${partnerName},\n\nCongratulations! 🎉 Your Founding Partner status has officially been locked in. You are among the first 500 verified partners of the Courage National Talent Search 2026 initiative.\n\nYour Founding Partner badge is now permanently visible on your public partner profile and all earned certificates. This credential is recognized by Courage Library as a lifetime institutional achievement.\n\nThank you for your belief in early-stage educational excellence.\n\n— Courage Partner Desk`,
      time: '10 mins ago',
      unread: true,
      category: 'Badge',
    },
    {
      id: 'm2',
      sender: 'Finance Operations',
      title: 'Monthly Honorarium Settled: ₹3,100 Available',
      preview: 'Your settlement for July-August 2026 mobilization has been verified and added to your available withdrawal balance.',
      fullBody: `Dear ${partnerName},\n\nYour monthly honorarium for July–August 2026 has been successfully verified and credited to your available payout balance.\n\n💰 Amount Credited: ₹3,100\n📅 Verification Date: August 3, 2026\n🏦 Next Disbursement: Monday, August 10, 2026\n\nYou can initiate a withdrawal request from the Payouts & Requests tab anytime. Minimum withdrawal is ₹100.\n\nFor any settlement discrepancy, raise a support ticket within 7 days.\n\n— Finance Operations Team`,
      time: '2 hours ago',
      unread: true,
      category: 'Payout',
    },
    {
      id: 'm3',
      sender: 'Campaign Leadership',
      title: 'CNTS 2026 Phase 1 Awareness Week Live',
      preview: 'New media assets, school brochure PDFs, and AI script templates are now live in your workspace.',
      fullBody: `Dear ${partnerName},\n\nCNTS 2026 Phase 1 Awareness Week is now officially live! 🚀\n\nNew resources available in your workspace:\n• 📄 School Brochure PDF (A4, Print-Ready)\n• 🎨 Social Media Templates (9:16, 1:1, 16:9)\n• 🤖 AI-Generated WhatsApp, LinkedIn & Reel Scripts\n• 📊 Campaign Tracking Dashboard (live now)\n\nTarget: 500 student registrations in Phase 1.\nYour current progress: 78 registrations.\n\nKeep mobilizing — every referral counts!\n\n— Campaign Leadership`,
      time: '1 day ago',
      unread: true,
      category: 'Mission',
    },
    {
      id: 'm4',
      sender: 'System Notification',
      title: 'Workspace Security Check Completed ✅',
      preview: 'Your partner workspace login was verified securely. No suspicious activity detected.',
      fullBody: `Dear ${partnerName},\n\nA routine security verification was performed on your partner workspace account.\n\n✅ Status: Secure\n📍 Last Login: Today, 9:15 AM\n🔒 Two-Factor Auth: Active\n\nIf you did not initiate this login, please raise a support ticket immediately.\n\n— Courage Security Team`,
      time: '3 days ago',
      unread: false,
      category: 'System',
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = messages.filter(m => m.unread).length;

  const markAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })));
  };

  const markRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, unread: false } : m));
  };

  const dismissMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
    markRead(id);
  };

  const categoryConfig: Record<string, { color: string; icon: React.ReactNode; border: string }> = {
    Badge: { color: 'bg-amber-500', border: 'border-l-amber-400', icon: <Award className="w-5 h-5" /> },
    Payout: { color: 'bg-emerald-600', border: 'border-l-emerald-500', icon: <CheckCircle2 className="w-5 h-5" /> },
    Mission: { color: 'bg-indigo-600', border: 'border-l-indigo-500', icon: <Sparkles className="w-5 h-5" /> },
    System: { color: 'bg-slate-500', border: 'border-l-slate-400', icon: <ShieldCheck className="w-5 h-5" /> },
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 bg-indigo-900/50 border border-indigo-700/50 px-3 py-1 rounded-full mb-2">
              <Inbox className="w-3.5 h-3.5" /> Partner Inbox
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Notifications & Updates</h1>
            <p className="text-slate-400 text-sm mt-1">Welcome back, {partnerName}. You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="flex items-center gap-1.5 bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold px-3 py-1.5 rounded-full">
                <Bell className="w-3.5 h-3.5" /> {unreadCount} Unread
              </span>
            )}
            <button
              onClick={markAllRead}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>

      {/* MESSAGE LIST */}
      {messages.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="font-bold text-slate-500">Your inbox is empty</p>
          <p className="text-xs text-slate-400 mt-1">New notifications from Courage Partner Desk will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => {
            const cfg = categoryConfig[msg.category];
            const isExpanded = expandedId === msg.id;
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border border-l-4 transition-all shadow-sm hover:shadow-md ${cfg.border} ${
                  msg.unread ? 'border-slate-200' : 'border-slate-100 opacity-80'
                }`}
              >
                {/* TOP ROW — always visible */}
                <div
                  className="p-4 flex items-start gap-4 cursor-pointer"
                  onClick={() => toggleExpand(msg.id)}
                >
                  {/* Category icon */}
                  <div className={`${cfg.color} text-white p-2.5 rounded-xl flex-shrink-0`}>
                    {cfg.icon}
                  </div>

                  {/* Content preview */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5 gap-2">
                      <span className="text-xs font-bold text-slate-700 truncate">{msg.sender}</span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {msg.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {msg.unread && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                      )}
                      <h3 className="font-bold text-sm text-slate-900 truncate">{msg.title}</h3>
                    </div>
                    {!isExpanded && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{msg.preview}</p>
                    )}
                  </div>

                  {/* Expand/collapse icon */}
                  <div className="shrink-0 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {/* EXPANDED BODY */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-slate-100 animate-fade-in">
                    <pre className="whitespace-pre-wrap text-xs text-slate-700 leading-relaxed font-sans mt-3 bg-slate-50 rounded-xl p-4 border border-slate-200">
                      {msg.fullBody}
                    </pre>
                    <div className="flex items-center justify-between mt-3">
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(msg.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Share via WhatsApp
                      </a>
                      <button
                        onClick={() => dismissMessage(msg.id)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
