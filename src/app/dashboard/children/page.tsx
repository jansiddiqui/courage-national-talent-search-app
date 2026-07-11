"use client";

import { usePortal } from "@/contexts/PortalContext";
import Link from "next/link";
import { Users, ArrowRight, CheckCircle, Clock, MapPin, BookOpen, CreditCard, Download } from "lucide-react";

export default function ChildrenPage() {
  const { candidates, activeCandidate, setActiveChild, systemSettings, getPortalHealth } = usePortal();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Children</h1>
        <p className="text-slate-500 text-sm mt-1">Manage all registered candidates in your family.</p>
      </div>

      {/* Child Cards */}
      <div className="space-y-4">
        {candidates.map((c) => {
          const health = getPortalHealth(c);
          const isActive = activeCandidate?.id === c.id;
          return (
            <div
              key={c.id}
              onClick={() => setActiveChild(c)}
              className={`bg-white rounded-3xl border p-5 shadow-sm cursor-pointer transition-all hover:shadow-md ${isActive ? "border-blue-200 ring-2 ring-blue-100" : "border-slate-100"}`}
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shrink-0 ${isActive ? "bg-blue-800 text-white" : "bg-slate-100 text-slate-600"}`}>
                  {c.student_name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-display font-bold text-lg text-slate-900">{c.student_name}</h2>
                    {isActive && (
                      <span className="text-[9px] font-black uppercase tracking-wide bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Active</span>
                    )}
                    <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full ${c.payment_status === "PAID" || c.payment_status === "SPONSORED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                      {c.payment_status === "PAID" ? "Enrolled" : c.payment_status === "SPONSORED" ? "Sponsored" : "Pending"}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">Class</p>
                      <p className="text-xs font-semibold text-slate-700">Class {c.student_class}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">Candidate ID</p>
                      <p className="text-xs font-mono font-bold text-blue-800">{c.registration_id}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[9px] text-slate-400 uppercase tracking-wide font-bold">School</p>
                      <p className="text-xs font-semibold text-slate-700 truncate">{c.school_name}, {c.school_city}</p>
                    </div>
                  </div>

                  {/* Health bar */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${health.score >= 80 ? "bg-emerald-500" : health.score >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                        style={{ width: `${health.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{health.label}</span>
                  </div>
                </div>
              </div>

              {/* Actions Row */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                <Link href="/dashboard/registration" onClick={() => setActiveChild(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200">
                  <CheckCircle size={12} /> Registration
                </Link>
                {(c.payment_status === "PAID" || c.payment_status === "SPONSORED") ? (
                  <Link href="/dashboard/payments" onClick={() => setActiveChild(c)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors border border-slate-200">
                    <CreditCard size={12} /> Payments
                  </Link>
                ) : (
                  <Link href={`/register?resume=${c.registration_id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors border border-blue-800">
                    <CreditCard size={12} /> Resume & Pay
                  </Link>
                )}
                {systemSettings.admit_card_status === "AVAILABLE" && (
                  <a href={`/api/admit-card/${c.registration_id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-colors border border-emerald-200">
                    <Download size={12} /> Admit Card
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Register another */}
      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Register Another Child</h3>
          <p className="text-xs text-slate-500 mt-0.5">Add another candidate to your Parent Workspace</p>
        </div>
        <Link href="/register?action=new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm">
          <Users size={14} /> Register Now <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
