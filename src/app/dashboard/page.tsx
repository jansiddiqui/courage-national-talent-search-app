"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import Link from "next/link";
import { CandidateIdentityCard } from "@/components/shared/CandidateIdentityCard";
import { DashboardMissionCarousel } from "@/components/shared/DashboardMissionCarousel";
import { usePortal } from "@/contexts/PortalContext";
import {
  Calendar,
  CheckCircle,
  ExternalLink,
  Award,
  Lock,
  FileText,
  Play,
  ArrowRight,
  Download,
  Check,
  AlertCircle
} from "lucide-react";
import NeedHelp from "@/components/layout/NeedHelp";
import { TIMELINE_LABELS } from "@/config/timeline";

export default function DashboardPage() {
  const {
    activeCandidate,
    systemSettings,
    isDemoMode,
    parentSession
  } = usePortal();

  const [codeCopied, setCodeCopied] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleDownloadCard = async (candidateId: string, candidateName: string) => {
    const element = document.getElementById(`id-card-${candidateId}`);
    if (!element) return;

    try {
      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      const link = document.createElement("a");
      link.download = `CNTS_Founding_Badge_${candidateName.replace(/\s+/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image", error);
    }
  };

  if (!activeCandidate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        <AlertCircle className="mx-auto text-slate-300 mb-3" size={32} />
        <p className="font-semibold text-slate-600">No Candidate Selected</p>
        <p className="text-xs text-slate-400 mt-1">Please register a candidate to view the parent workspace.</p>
        <Link href="/register?action=new" className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm">
          Register Child Now <ArrowRight size={13} />
        </Link>
      </div>
    );
  }

  const c = activeCandidate;
  const isPaid = c.payment_status === "PAID" || c.payment_status === "SPONSORED";

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 md:px-8 space-y-8 animate-slide-up">
      {isDemoMode && (
        <div className="p-3.5 bg-amber-50 border border-amber-100 text-amber-850 rounded-2xl text-xs flex items-center gap-2 shadow-sm">
          <AlertCircle size={15} className="shrink-0" />
          <span>
            <strong>Developer Evaluation Mode:</strong> Showing mock data for phone <strong>{parentSession?.phoneNumber}</strong>.
          </span>
        </div>
      )}

      {/* Welcome Header */}
      <div className="space-y-1.5 pb-2">
        <h2 className="font-display font-bold text-3xl text-slate-900 leading-tight">
          Welcome Back
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
          <div className="text-slate-600 text-sm font-medium">Candidate: <strong className="text-slate-900">{c.student_name}</strong></div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="text-slate-600 text-sm font-medium">Candidate ID: <strong className="text-blue-700 font-mono tracking-wider">{c.registration_id}</strong></div>
        </div>
      </div>

      {/* Candidate Card Section */}
      <div className="space-y-8">
        <div>
          <div id={`id-card-${c.id}`} className="relative rounded-3xl overflow-hidden">
            <CandidateIdentityCard candidate={{
              student_name: c.student_name,
              student_class: c.student_class,
              state: c.state,
              registration_id: c.registration_id,
              payment_status: c.payment_status,
              photo_url: `/api/photo/${c.registration_id || c.id}`
            }} />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            {!isPaid && (
              <Link
                href={`/register?resume=${c.registration_id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                <ExternalLink size={16} />
                Resume & Complete Payment
              </Link>
            )}
            <button
              onClick={() => handleDownloadCard(c.id, c.student_name)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-sm font-bold transition-colors border border-slate-200 shadow-sm"
            >
              <Download size={16} />
              Download Image for Status
            </button>
          </div>
        </div>

        {/* Share & Invite (Organic Referral) */}
        <div className="mt-12">
          <DashboardMissionCarousel
            registration_id={c.registration_id}
            referralsCount={c.total_referrals || 0}
            handleCopyCode={handleCopyCode}
            codeCopied={codeCopied}
          />
        </div>

        {/* Important Dates Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-display font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-800" />
            Important Dates
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:divide-x md:divide-slate-100">
            <div className="md:px-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Registration Status</span>
              <strong className="text-emerald-600 text-sm font-bold flex items-center gap-1.5"><CheckCircle size={14} /> Completed</strong>
            </div>
            <div className="md:px-4">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Admit Card Release</span>
              <strong className="text-slate-800 text-sm font-bold">{TIMELINE_LABELS.ADMIT_CARD_RELEASE}</strong>
            </div>
            <div className="md:px-4">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Assessment Date</span>
              <strong className="text-slate-800 text-sm font-bold">{TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')}</strong>
            </div>
            <div className="md:px-4">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Results Release</span>
              <strong className="text-slate-800 text-sm font-bold">{TIMELINE_LABELS.RESULTS_DATE}</strong>
            </div>
          </div>
        </div>

        {/* What Should I Do Now? Checklist */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <h3 className="font-display font-bold text-slate-800 text-xl mb-6">
            What Should I Do Now?
          </h3>
          <div className="space-y-4">

            {/* Step 1: Complete */}
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-emerald-100 text-emerald-600 rounded-full p-1 border border-emerald-200 shadow-sm shrink-0">
                <Check size={16} className="stroke-[3]" />
              </div>
              <div>
                <h4 className="text-emerald-700 font-bold text-sm">Registration Complete</h4>
                <p className="text-xs text-slate-500 mt-0.5">Your candidate is fully enrolled for the Founding Edition.</p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

             {/* Step 2: Current */}
             <div className="flex items-start gap-4 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
               <div className="mt-0.5 bg-blue-600 text-white rounded-full p-1.5 shadow-md shadow-blue-500/30 shrink-0">
                 <Play size={12} className="fill-current" />
               </div>
               <div>
                 <h4 className="text-blue-900 font-bold text-sm flex items-center gap-2">
                   Current Step
                   <span className="text-[9px] uppercase tracking-wider bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-black hidden sm:inline-block">Action Required</span>
                 </h4>
                 <p className="text-sm text-blue-800 font-medium mt-1">Practice in Academy & Start Mock Test</p>
                 <p className="text-xs text-blue-600/80 mt-1">Strengthen the candidate's core cognitive reasoning and take a simulated mock exam.</p>
                 <div className="mt-3">
                   <Link 
                     href="/academy" 
                     className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-800/10 cursor-pointer"
                   >
                     Go to Academy
                     <ArrowRight size={12} />
                   </Link>
                 </div>
               </div>
             </div>

            {/* Connecting Line */}
            <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

            {/* Step 3: Upcoming Admit Card */}
            <div className="flex items-start gap-4 opacity-60">
              <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
              <div>
                <h4 className="text-slate-600 font-bold text-sm">Upcoming: Admit Card Release</h4>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled for {TIMELINE_LABELS.ADMIT_CARD_RELEASE}. You will be notified via WhatsApp.</p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

            {/* Step 4: Upcoming Assessment */}
            <div className="flex items-start gap-4 opacity-60">
              <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
              <div>
                <h4 className="text-slate-600 font-bold text-sm">Upcoming: Assessment Day</h4>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled for {TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')}. Ensure devices are ready.</p>
              </div>
            </div>

            {/* Connecting Line */}
            <div className="w-px h-6 bg-slate-200 ml-4 border-l-2 border-dashed border-slate-200"></div>

            {/* Step 5: Upcoming Results */}
            <div className="flex items-start gap-4 opacity-60">
              <div className="mt-1 bg-slate-100 text-slate-400 rounded-full p-1 border border-slate-200 shrink-0">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300"></div>
              </div>
              <div>
                <h4 className="text-slate-600 font-bold text-sm">Upcoming: Talent Profile Release</h4>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled for {TIMELINE_LABELS.RESULTS_DATE}. Detailed diagnostic report will be available.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

          {/* Learning Academy */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Award size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Learning Academy</h4>
              <p className="text-xs text-slate-500 mt-1">Access interactive lessons, practice flashcards, and bilingually explained questions for Class {c.student_class}.</p>
            </div>
            <Link href="/academy" className="w-full py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors">
              Enter Academy <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mock Test */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Play size={20} />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Mock Test</h4>
              <p className="text-xs text-slate-500 mt-1">
                Familiarize yourself with the 10-minute simulated testing environment. Run the{" "}
                <Link href="/system-check" className="text-blue-600 font-semibold hover:underline">
                  System Check
                </Link>{" "}
                first to verify your device compatibility.
              </p>
            </div>
            <Link href="/mock-exam" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-colors">
              <Play size={14} className="fill-current" /> Start Practice Test
            </Link>
          </div>

          {/* Admit Card / Assessment Window */}
          <div className="col-span-1 md:col-span-2">
            {systemSettings.admit_card_status === "AVAILABLE" ? (
              <div className="bg-white border border-emerald-200 shadow-sm p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full uppercase tracking-widest">Assessment Window Active</span>
                    <h4 className="text-lg font-bold text-slate-900 mt-2">Official Admit Card & Examination Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Date & Time</span>
                      <strong className="text-sm text-slate-800">{TIMELINE_LABELS.EXAM_DATE.replace(' (Sunday)', '')}, 10:00 AM</strong>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Technical Requirements</span>
                      <strong className="text-sm text-slate-800">Chrome/Safari (Desktop/Laptop)</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Reporting Instructions</span>
                      <strong className="text-xs text-slate-600 mt-0.5 block leading-relaxed">Log into the portal 15 minutes before the start time. Ensure a stable internet connection. Webcams must remain on for the duration of the assessment.</strong>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-auto shrink-0 flex flex-col gap-2">
                  <a href={`/api/admit-card/${c.registration_id}`} className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold text-center flex items-center justify-center gap-2 transition-colors shadow-sm shadow-emerald-600/20">
                    <Download size={16} /> Download Admit Card
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 opacity-75">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                    <Lock size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-700">Assessment Window Locked</h4>
                    <p className="text-xs text-slate-500 mt-1">The official admit card and examination instructions will appear here on {TIMELINE_LABELS.ADMIT_CARD_RELEASE}.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Receipts & Support */}
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {isPaid && (
              <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Payment Receipt</h4>
                    <p className="text-[10px] text-slate-500">Transaction ID: {c.payment_id}</p>
                  </div>
                </div>
                <a href={`/api/receipt/${c.registration_id}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <Download size={18} />
                </a>
              </div>
            )}
            <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-between hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.943 14.137 1.94 12.01 1.94c-5.44 0-9.866 4.414-9.869 9.848-.002 1.71.453 3.382 1.32 4.874L2.44 21.908l5.207-1.366z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Support & Updates</h4>
                  <p className="text-[10px] text-slate-500">Get help via WhatsApp</p>
                </div>
              </div>
              <a href="https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338" target="_blank" rel="noreferrer" className="text-[#25D366] hover:text-[#1da851] p-2 rounded-lg hover:bg-[#25D366]/10 transition-colors">
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Register Another Child Card */}
      <div className="mt-8 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 md:p-10 shadow-xl border border-blue-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-2 text-center md:text-left flex-1">
          <h3 className="font-display font-bold text-2xl text-white">Register Another Child</h3>
          <p className="text-blue-200 text-sm max-w-lg leading-relaxed">
            Have another bright mind in the family? You can manage multiple candidates from this same dashboard. Click below to add another child to the Courage National Talent Search.
          </p>
        </div>
        <div className="relative shrink-0">
          <Link
            href="/register?action=new"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 hover:bg-blue-50 text-sm font-bold rounded-2xl shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5"
          >
            Register Another Child
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <NeedHelp />
    </div>
  );
}
