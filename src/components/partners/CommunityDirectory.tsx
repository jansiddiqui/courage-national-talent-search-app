'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  Award, 
  MapPin, 
  Share2, 
  ExternalLink, 
  Video, 
  GraduationCap, 
  Building2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface PartnerDirectoryItem {
  slug: string;
  name: string;
  role: string;
  location: string;
  followersOrReach: string;
  impactStudents: number;
  schoolsConnected: number;
  reputationScore: number;
  isFounding: boolean;
  channels: string[];
}

export const CommunityDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('All');

  const directory: PartnerDirectoryItem[] = [
    {
      slug: 'ananya-sharma',
      name: 'Ananya Sharma',
      role: 'LinkedIn Creator & Educator',
      location: 'Patna, Bihar',
      followersOrReach: '32,000 Network',
      impactStudents: 1420,
      schoolsConnected: 14,
      reputationScore: 99,
      isFounding: true,
      channels: ['LinkedIn', 'WhatsApp', 'Schools']
    },
    {
      slug: 'rahul-sharma',
      name: 'Rahul Sharma',
      role: 'School Coordinator & Teacher',
      location: 'Lucknow, UP',
      followersOrReach: '12,500 Network',
      impactStudents: 1240,
      schoolsConnected: 14,
      reputationScore: 98,
      isFounding: true,
      channels: ['WhatsApp', 'YouTube', 'LinkedIn']
    },
    {
      slug: 'vikram-singh',
      name: 'Vikram Singh',
      role: 'YouTube Science Educator',
      location: 'Jaipur, Rajasthan',
      followersOrReach: '180,000 Subscribers',
      impactStudents: 3450,
      schoolsConnected: 8,
      reputationScore: 97,
      isFounding: true,
      channels: ['YouTube', 'Telegram']
    },
    {
      slug: 'shreya-das',
      name: 'Shreya Das',
      role: 'Educational NGO Founder',
      location: 'Kolkata, WB',
      followersOrReach: '50+ School Network',
      impactStudents: 2100,
      schoolsConnected: 28,
      reputationScore: 99,
      isFounding: true,
      channels: ['NGO', 'Schools', 'WhatsApp']
    },
    {
      slug: 'amit-kumar',
      name: 'Amit Kumar',
      role: 'Telegram EdTech Admin',
      location: 'Ranchi, Jharkhand',
      followersOrReach: '45,000 Members',
      impactStudents: 1890,
      schoolsConnected: 4,
      reputationScore: 95,
      isFounding: false,
      channels: ['Telegram', 'Discord']
    }
  ];

  const filtered = directory.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || p.role.includes(filterRole);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full mb-2">
            <Users className="w-3.5 h-3.5" /> Peer Educator Ecosystem
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Partner Community Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover and collaborate with fellow Courage Partners across India.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by name, city, role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-600 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* FEATURED SPOTLIGHT CARD */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-lg border border-slate-800 flex flex-col md:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-amber-400 p-0.5 shadow-md flex-shrink-0">
          <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center font-bold text-xl text-amber-300">
            AS
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-amber-400/30">
            <Sparkles className="w-3 h-3" /> Featured Partner of the Month
          </div>
          <h3 className="font-display text-xl font-bold text-white">Ananya Sharma</h3>
          <p className="text-xs text-indigo-200">Patna, Bihar • 1,420 Students Mobilized • 14 Rural Schools Connected</p>
          <p className="text-xs text-slate-300 mt-2 italic">
            "Empowering students in Tier-3 Bihar towns through Courage Library's CNTS scholarship program has been the most fulfilling educational milestone of my career."
          </p>
        </div>
        <button 
          onClick={() => window.open('/partners/profile/ananya-sharma', '_blank')}
          className="btn-primary text-xs py-2.5 px-4 bg-amber-400 text-slate-900 hover:bg-amber-300 font-bold flex-shrink-0 cursor-pointer"
        >
          View Full Profile <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </button>
      </div>

      {/* DIRECTORY CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(partner => (
          <div 
            key={partner.slug}
            className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-tight">{partner.name}</h3>
                    <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {partner.location}
                    </span>
                  </div>
                </div>

                {partner.isFounding && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full">
                    🏅 Founding
                  </span>
                )}
              </div>

              <p className="text-xs font-medium text-indigo-700 bg-indigo-50/70 p-2 rounded-lg mb-4">
                {partner.role} • <span className="font-mono text-slate-700">{partner.followersOrReach}</span>
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/60 mb-4">
                <div>
                  <span className="text-slate-400 block text-[10px]">Impact</span>
                  <span className="font-mono font-bold text-slate-900">{partner.impactStudents} Students</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Reputation</span>
                  <span className="font-mono font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-500" /> {partner.reputationScore} / 100
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-400">
                {partner.channels.map((c, i) => (
                  <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                    #{c}
                  </span>
                ))}
              </div>
              <button
                onClick={() => window.open(`/partners/profile/${partner.slug}`, '_blank')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
              >
                Profile <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
