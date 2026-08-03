'use client';

import React, { useState } from 'react';
import { Inbox, Bell, Award, CheckCircle2, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export const PartnerInbox: React.FC = () => {
  const [messages, setMessages] = useState([
    {
      id: 'm1',
      sender: 'Courage Partner Desk',
      title: 'Founding Partner Badge Granted 🏅',
      preview: 'Congratulations! Your Founding Partner status has been locked in. View your lifetime profile credential.',
      time: '10 mins ago',
      unread: true,
      category: 'Badge'
    },
    {
      id: 'm2',
      sender: 'Finance Operations',
      title: 'Monthly Honorarium Settled: ₹42,500 Available',
      preview: 'Your settlement for July-August 2026 mobilization has been verified and added to your available withdrawal balance.',
      time: '2 hours ago',
      unread: true,
      category: 'Payout'
    },
    {
      id: 'm3',
      sender: 'Campaign Leadership',
      title: 'CNTS 2026 Phase 1 Awareness Week Live',
      preview: 'New media assets, school brochure PDFs, and AI script templates are now live in your workspace.',
      time: '1 day ago',
      unread: true,
      category: 'Mission'
    }
  ]);

  const markAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, unread: false })));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-1">
            <Inbox className="w-3.5 h-3.5" /> Direct Communications
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Partner Inbox & Notifications</h1>
        </div>
        <button 
          onClick={markAllRead}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 underline cursor-pointer"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {messages.map(msg => (
          <div 
            key={msg.id}
            className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
              msg.unread 
                ? 'bg-white border-indigo-200 shadow-sm' 
                : 'bg-slate-50 border-slate-200/80 opacity-80'
            }`}
          >
            <div className={`p-2.5 rounded-xl text-white flex-shrink-0 ${
              msg.category === 'Badge' ? 'bg-amber-500' : msg.category === 'Payout' ? 'bg-emerald-600' : 'bg-indigo-600'
            }`}>
              {msg.category === 'Badge' ? <Award className="w-5 h-5" /> : msg.category === 'Payout' ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">{msg.sender}</span>
                <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {msg.time}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">{msg.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{msg.preview}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
