"use client";

import { usePortal } from "@/contexts/PortalContext";
import { FolderOpen, Download, FileText, CreditCard, Award, BookOpen, AlertCircle, Lock, ExternalLink } from "lucide-react";
import { TIMELINE_LABELS } from "@/config/timeline";

const CATEGORIES = [
  { id: "registration", label: "Registration", icon: FileText, color: "text-blue-700 bg-blue-50" },
  { id: "payments", label: "Payments", icon: CreditCard, color: "text-emerald-700 bg-emerald-50" },
  { id: "admit_card", label: "Admit Cards", icon: AlertCircle, color: "text-indigo-700 bg-indigo-50" },
  { id: "results", label: "Results", icon: Award, color: "text-amber-700 bg-amber-50" },
  { id: "certificates", label: "Certificates", icon: Award, color: "text-purple-700 bg-purple-50" },
  { id: "worksheets", label: "Worksheets", icon: BookOpen, color: "text-slate-700 bg-slate-100" },
];

export default function DocumentsPage() {
  const { activeCandidate, systemSettings, addRecentDownload, preferences } = usePortal();

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const c = activeCandidate;
  const isPaid = c.payment_status === "PAID" || c.payment_status === "SPONSORED";
  const admitCardAvailable = systemSettings.admit_card_status === "AVAILABLE";
  const resultsAvailable = systemSettings.result_status === "RELEASED";
  const certificatesAvailable = systemSettings.certificate_status === "RELEASED";

  const documents = [
    {
      category: "registration",
      label: "Registration Acknowledgement",
      subtitle: "PDF confirming your child's enrollment",
      available: isPaid,
      date: new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      href: `/api/receipt/${c.registration_id}`,
      external: true,
    },
    {
      category: "payments",
      label: "Payment Receipt",
      subtitle: "Official Razorpay payment confirmation",
      available: isPaid,
      date: isPaid ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : undefined,
      href: `/api/receipt/${c.registration_id}`,
      external: true,
    },
    {
      category: "admit_card",
      label: "Admit Card",
      subtitle: admitCardAvailable ? "Download and print before exam day" : `Available from ${TIMELINE_LABELS.ADMIT_CARD_RELEASE}`,
      available: admitCardAvailable && isPaid,
      date: admitCardAvailable ? TIMELINE_LABELS.ADMIT_CARD_RELEASE : undefined,
      locked: !admitCardAvailable,
      href: `/api/admit-card/${c.registration_id}`,
      external: true,
      lockedDate: TIMELINE_LABELS.ADMIT_CARD_RELEASE,
    },
    {
      category: "results",
      label: "Talent Report",
      subtitle: resultsAvailable ? "Download your child's full talent report" : `Available from ${TIMELINE_LABELS.RESULTS_DATE}`,
      available: resultsAvailable,
      locked: !resultsAvailable,
      href: "/dashboard/reports",
      lockedDate: TIMELINE_LABELS.RESULTS_DATE,
    },
    {
      category: "certificates",
      label: "Participation Certificate",
      subtitle: certificatesAvailable ? "Download official CNTS certificate" : `Available from ${TIMELINE_LABELS.CERTIFICATE_DATE}`,
      available: certificatesAvailable,
      locked: !certificatesAvailable,
      href: "#",
      lockedDate: TIMELINE_LABELS.CERTIFICATE_DATE,
    },
    {
      category: "worksheets",
      label: "Practice Worksheets",
      subtitle: "Curated worksheets to prepare for the exam",
      available: true,
      href: "/academy",
    },
  ];

  const recentDownloads = preferences.recentDownloads || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Resource Library</h1>
        <p className="text-slate-500 text-sm mt-1">All documents and resources for {c.student_name}</p>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(({ id, label, icon: Icon, color }) => {
          const count = documents.filter((d) => d.category === id && d.available).length;
          return (
            <div key={id} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold ${color} border-current/20`}>
              <Icon size={12} />
              {label}
              {count > 0 && <span className="ml-0.5 text-[9px] font-black">({count})</span>}
            </div>
          );
        })}
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-100">
          {documents.map((doc) => {
            const catInfo = CATEGORIES.find((c) => c.id === doc.category);
            const Icon = catInfo?.icon || FileText;
            const colorClass = catInfo?.color || "text-slate-600 bg-slate-100";

            return (
              <div key={doc.label} className={`flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${doc.locked ? "opacity-70" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                  {doc.locked ? <Lock size={16} /> : <Icon size={16} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs font-bold text-slate-800">{doc.label}</p>
                    {doc.available && !doc.locked && (
                      <span className="text-[9px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md">Ready</span>
                    )}
                    {doc.locked && (
                      <span className="text-[9px] font-black uppercase tracking-wide bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                        Available {doc.lockedDate}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">{doc.subtitle}</p>
                  {doc.date && <p className="text-[9px] text-slate-400 mt-0.5">{doc.date}</p>}
                </div>

                {doc.available && !doc.locked && (
                  <a
                    href={doc.href}
                    target={doc.external ? "_blank" : undefined}
                    rel={doc.external ? "noreferrer" : undefined}
                    onClick={() => addRecentDownload({ id: doc.label, name: doc.label, type: doc.category })}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-[10px] font-bold transition-colors shrink-0"
                  >
                    {doc.external ? <Download size={12} /> : <ExternalLink size={12} />}
                    {doc.external ? "Download" : "View"}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Downloads */}
      {recentDownloads.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Download size={14} className="text-slate-500" /> Recently Downloaded
            </h2>
          </div>
          <div className="divide-y divide-slate-100">
            {recentDownloads.slice(0, 5).map((dl, i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{dl.name}</p>
                  <p className="text-[10px] text-slate-400">{new Date(dl.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <span className="text-[9px] font-bold text-slate-400 uppercase">{dl.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
