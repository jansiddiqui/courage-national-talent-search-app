'use client';

import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Download, 
  Share2, 
  Sparkles, 
  PlayCircle,
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';

export const LearningAndCertifications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'certs'>('certs');
  const [downloaded, setDownloaded] = useState<string | null>(null);

  const courses = [
    {
      id: 'c1',
      title: 'Creating Viral & Authentic Educational Reels',
      instructor: 'Priya Mehta (120k Followers)',
      duration: '45 mins',
      modules: '5 Lessons',
      level: 'Beginner',
      completed: true
    },
    {
      id: 'c2',
      title: 'Working With Schools & Principals: Institutional Pitching',
      instructor: 'Dr. Ramesh Kumar (Ex-Principal)',
      duration: '60 mins',
      modules: '6 Lessons',
      level: 'Intermediate',
      completed: true
    },
    {
      id: 'c3',
      title: 'LinkedIn Educational Storytelling for High Reach',
      instructor: 'Ananya Sharma (Featured Partner)',
      duration: '35 mins',
      modules: '4 Lessons',
      level: 'Advanced',
      completed: false
    },
    {
      id: 'c4',
      title: 'WhatsApp Broadcast Strategy for Parent Communities',
      instructor: 'Rahul Sharma (Founding Partner)',
      duration: '30 mins',
      modules: '3 Lessons',
      level: 'Beginner',
      completed: false
    }
  ];

  const handleDownloadCert = (certName: string) => {
    setDownloaded(certName);
    setTimeout(() => setDownloaded(null), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full mb-2 border border-amber-200">
            <Award className="w-3.5 h-3.5" /> Professional Development & Credentials
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900">
            Learning Center & Digital Certifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build your skills as an educational creator, earn institutional certifications, and add verified badges to your LinkedIn profile.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('certs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'certs'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            My Certifications (2)
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'courses'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Masterclass Courses (4)
          </button>
        </div>
      </div>

      {/* CERTIFICATIONS TAB */}
      {activeTab === 'certs' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificate 1: Founding Partner */}
            <div className="bg-gradient-to-br from-[#0F172A] to-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/30 flex items-center gap-1.5">
                  🏅 Lifetime Credential
                </span>
                <span className="font-mono text-xs text-slate-400">ID: CP-2026-000384</span>
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-amber-300 mb-2">
                  Certified Founding Partner
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Issued by Courage Library in recognition of being among the first 1,000 national partners dedicated to expanding educational access.
                </p>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 mb-6">
                  <div className="flex justify-between"><span className="text-slate-400">Recipient:</span> <span className="font-bold text-white">Rahul Sharma</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Issue Date:</span> <span className="font-mono">August 2026</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Verification:</span> <span className="text-emerald-400 font-mono">thecouragelibrary.com/verify/CP-2026-000384</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDownloadCert('Founding Partner Certificate')}
                  className="flex-1 btn-primary text-xs py-2.5 bg-amber-500 text-slate-900 hover:bg-amber-400 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {downloaded === 'Founding Partner Certificate' ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {downloaded === 'Founding Partner Certificate' ? 'PDF Downloaded' : 'Download Certificate PDF'}
                </button>
                <button
                  onClick={() => alert('LinkedIn Credential link copied to clipboard!')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-white hover:bg-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-blue-400" /> Add to LinkedIn
                </button>
              </div>
            </div>

            {/* Certificate 2: Silver Mobilizer */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="bg-indigo-50 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1.5">
                    🥈 Level 2 Credential
                  </span>
                  <span className="font-mono text-xs text-slate-400">Issued: Aug 2026</span>
                </div>

                <h3 className="font-display text-2xl font-bold text-slate-900 mb-2">
                  Silver Education Mobilizer
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">
                  Awarded for mobilizing 50+ students for CNTS merit scholarship assessments with excellence and integrity.
                </p>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 mb-6">
                  <div className="flex justify-between"><span className="text-slate-500">Students Reached:</span> <span className="font-bold text-slate-900 font-mono">1,240</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Schools Connected:</span> <span className="font-bold text-slate-900 font-mono">14</span></div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownloadCert('Silver Mobilizer Certificate')}
                  className="flex-1 btn-outline text-xs py-2.5 font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {downloaded === 'Silver Mobilizer Certificate' ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4" />}
                  {downloaded === 'Silver Mobilizer Certificate' ? 'PDF Downloaded' : 'Download Certificate PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COURSES TAB */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded">
                    {course.level} • {course.modules}
                  </span>
                  {course.completed && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-lg text-slate-900 mb-1">{course.title}</h3>
                <p className="text-xs text-slate-500 mb-4">Instructor: {course.instructor}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400">{course.duration} video</span>
                <button 
                  onClick={() => alert(`Starting course module: ${course.title}`)}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4" /> {course.completed ? 'Watch Again' : 'Start Course'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
