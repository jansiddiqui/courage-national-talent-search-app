'use client';

import React from 'react';
import { Calendar, Clock, Video, Users, ExternalLink, CheckCircle2 } from 'lucide-react';

export const EventsAndWebinars: React.FC = () => {
  const events = [
    {
      id: 'e1',
      title: 'National Partner Launch & CNTS 2026 Townhall',
      date: 'Aug 15, 2026',
      time: '6:00 PM IST',
      host: 'Courage Library Leadership Team',
      type: 'Live AMA & Townhall',
      attendees: 384,
      joined: true
    },
    {
      id: 'e2',
      title: 'Masterclass: Engaging School Principals for Scholarship Drives',
      date: 'Aug 22, 2026',
      time: '5:00 PM IST',
      host: 'Ananya Sharma & Guest Educators',
      type: 'Training Session',
      attendees: 190,
      joined: false
    },
    {
      id: 'e3',
      title: 'AI Studio Masterclass: Scaling WhatsApp Outreach Without Spam',
      date: 'Aug 28, 2026',
      time: '7:00 PM IST',
      host: 'Courage Tech Team',
      type: 'Technical Workshop',
      attendees: 240,
      joined: false
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Calendar className="w-3.5 h-3.5" /> Events & Live AMAs
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Partner Events & Live Training
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Join live masterclasses, monthly townhalls, and training sessions with the Courage Library leadership.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map(ev => (
          <div key={ev.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  {ev.type}
                </span>
                <span className="text-xs text-slate-400 font-mono">{ev.attendees} Registered</span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mb-2">{ev.title}</h3>
              <p className="text-xs text-slate-500 mb-4">Host: {ev.host}</p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1 mb-6">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {ev.date}
                </div>
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> {ev.time}
                </div>
              </div>
            </div>

            <button 
              onClick={() => alert(`Registered for event: ${ev.title}`)}
              className={`w-full text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                ev.joined 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'btn-primary'
              }`}
            >
              {ev.joined ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Video className="w-4 h-4" />}
              {ev.joined ? 'RSVP Confirmed' : 'Register for Event'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
