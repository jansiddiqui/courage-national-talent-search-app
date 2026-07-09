"use client";

import { usePortal } from "@/contexts/PortalContext";
import { TIMELINE_LABELS, TIMELINE } from "@/config/timeline";
import { Calendar, CheckCircle, Clock, BookOpen, CreditCard, Award, ArrowRight, User } from "lucide-react";

export default function TimelinePage() {
  const { activeCandidate } = usePortal();

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const isPaid = activeCandidate.payment_status === "PAID" || activeCandidate.payment_status === "SPONSORED";

  const timelineSteps = [
    {
      id: "registered",
      label: "Registrations Open",
      desc: "Enroll candidate with basic student and school details.",
      dateLabel: TIMELINE_LABELS.REGISTRATION_OPEN,
      dateVal: TIMELINE.REGISTRATION_OPEN,
      done: true,
      icon: User,
    },
    {
      id: "payment",
      label: "Payment Confirmation",
      desc: "Unlock the Candidate ID and full workspace prep features.",
      dateLabel: isPaid ? "Confirmed" : `Closes ${TIMELINE_LABELS.REGISTRATION_CLOSE}`,
      dateVal: TIMELINE.REGISTRATION_CLOSE,
      done: isPaid,
      icon: CreditCard,
    },
    {
      id: "admit_card",
      label: "Admit Card Released",
      desc: "Download and print candidate's official hall ticket.",
      dateLabel: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
      dateVal: TIMELINE.ADMIT_CARD_RELEASE,
      done: false,
      icon: Clock,
    },
    {
      id: "exam",
      label: "Assessment Day (CNTS 2026)",
      desc: "Online MCQ cognitive evaluation (60 minutes).",
      dateLabel: TIMELINE_LABELS.EXAM_DATE,
      dateVal: TIMELINE.EXAM_DATE,
      done: false,
      icon: Calendar,
    },
    {
      id: "results",
      label: "Results Announcement",
      desc: "Scores published online and accessible via portal.",
      dateLabel: TIMELINE_LABELS.RESULTS_DATE,
      dateVal: TIMELINE.RESULTS_DATE,
      done: false,
      icon: Award,
    },
    {
      id: "report",
      label: "Cognitive Talent Profile",
      desc: "Interpretive learning insights and national standing report.",
      dateLabel: TIMELINE_LABELS.TALENT_PROFILE_DATE,
      dateVal: TIMELINE.TALENT_PROFILE_DATE,
      done: false,
      icon: BookOpen,
    },
    {
      id: "certificate",
      label: "Certificate & Recognition",
      desc: "Download participation certificate and award honors.",
      dateLabel: TIMELINE_LABELS.CERTIFICATE_DATE,
      dateVal: TIMELINE.CERTIFICATE_DATE,
      done: false,
      icon: Award,
    }
  ];

  const currentStepIndex = timelineSteps.findLastIndex((s) => s.done);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Exam Timeline</h1>
        <p className="text-slate-500 text-sm mt-1">Founding Edition 2026 milestones and dates for {activeCandidate.student_name}</p>
      </div>

      {/* Timeline Layout */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
        <div className="space-y-0">
          {timelineSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = idx === currentStepIndex + 1;
            const isPast = idx <= currentStepIndex;

            return (
              <div key={step.id} className="flex gap-4 sm:gap-6">
                {/* Visual Line connector */}
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      isPast
                        ? "bg-emerald-500 border-emerald-400 text-white"
                        : isCurrent
                        ? "bg-blue-800 border-blue-700 text-white ring-4 ring-blue-100"
                        : "bg-white border-slate-200 text-slate-400"
                    }`}
                  >
                    {isPast ? <CheckCircle size={16} /> : <Icon size={14} />}
                  </div>
                  {idx < timelineSteps.length - 1 && (
                    <div className={`w-0.5 h-16 my-1 ${isPast ? "bg-emerald-400" : "bg-slate-200"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1 pb-6 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
                    <div>
                      <h3 className={`text-sm font-bold ${isPast ? "text-slate-800" : isCurrent ? "text-blue-900" : "text-slate-500"}`}>
                        {step.label}
                      </h3>
                      <p className="text-[10px] text-slate-500 mt-1 leading-relaxed max-w-lg">
                        {step.desc}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-xl shrink-0 ${
                      isPast ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : isCurrent ? "bg-blue-50 text-blue-800 border border-blue-100" : "bg-slate-50 text-slate-400 border border-slate-200"
                    }`}>
                      {step.dateLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
