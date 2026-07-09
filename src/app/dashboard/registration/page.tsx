"use client";

import { usePortal } from "@/contexts/PortalContext";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, Download, ExternalLink, Calendar, FileText, User } from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
    SPONSORED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REGISTERED: "bg-blue-100 text-blue-700 border-blue-200",
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    DRAFT: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide border ${map[status] || map.PENDING}`}>
      {status}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value || "—"}</span>
    </div>
  );
}

export default function RegistrationPage() {
  const { activeCandidate, addRecentDownload } = usePortal();

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const c = activeCandidate;
  const isPaid = c.payment_status === "PAID" || c.payment_status === "SPONSORED";

  const timeline = [
    { label: "Registration Submitted", date: new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), done: true, icon: FileText },
    { label: "Payment Confirmed", date: isPaid ? "Completed" : "Pending", done: isPaid, icon: CheckCircle },
    { label: "Candidate ID Issued", date: isPaid ? c.registration_id : "After payment", done: isPaid, icon: User },
    { label: "Admit Card Release", date: TIMELINE_LABELS.ADMIT_CARD_RELEASE, done: false, icon: Calendar },
    { label: "Assessment Day", date: TIMELINE_LABELS.EXAM_DATE, done: false, icon: Calendar },
    { label: "Results Published", date: TIMELINE_LABELS.RESULTS_DATE, done: false, icon: CheckCircle },
    { label: "Certificate Issued", date: TIMELINE_LABELS.CERTIFICATE_DATE, done: false, icon: Download },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Registration</h1>
          <p className="text-slate-500 text-sm mt-1">Full registration details for {c.student_name}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <StatusBadge status={c.registration_status || "REGISTERED"} />
          <StatusBadge status={c.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Student Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><User size={15} className="text-blue-800" /> Student Information</h2>
          <InfoRow label="Full Name" value={c.student_name} />
          <InfoRow label="Date of Birth" value={c.dob ? new Date(c.dob).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : undefined} />
          <InfoRow label="Class" value={`Class ${c.student_class}`} />
          <InfoRow label="Language Medium" value={c.language} />
          <InfoRow label="Candidate ID" value={c.registration_id} />
        </div>

        {/* School Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2"><FileText size={15} className="text-blue-800" /> School & Location</h2>
          <InfoRow label="School Name" value={c.school_name} />
          <InfoRow label="City" value={c.school_city} />
          <InfoRow label="District" value={c.district} />
          <InfoRow label="State" value={c.state} />
          <InfoRow label="Parent Name" value={c.parent_name} />
        </div>
      </div>

      {/* Registration Timeline */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
          <Calendar size={15} className="text-blue-800" /> Registration Timeline
        </h2>
        <div className="space-y-0">
          {timeline.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${step.done ? "bg-emerald-500 border-emerald-400 text-white" : "bg-white border-slate-300 text-slate-400"}`}>
                    <Icon size={14} />
                  </div>
                  {i < timeline.length - 1 && <div className={`w-0.5 h-6 my-1 ${step.done ? "bg-emerald-300" : "bg-slate-200"}`} />}
                </div>
                <div className="flex-1 pt-1 pb-4">
                  <p className={`text-xs font-bold ${step.done ? "text-slate-800" : "text-slate-500"}`}>{step.label}</p>
                  <p className={`text-[10px] font-semibold mt-0.5 ${step.done ? "text-emerald-600" : "text-slate-400"}`}>{step.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Acknowledgement */}
      {isPaid && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Registration Acknowledgement</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Download your official registration receipt</p>
          </div>
          <a
            href={`/api/receipt/${c.registration_id}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => addRecentDownload({ id: c.registration_id, name: "Registration Receipt", type: "receipt" })}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <Download size={14} /> Download PDF
          </a>
        </div>
      )}
    </div>
  );
}
