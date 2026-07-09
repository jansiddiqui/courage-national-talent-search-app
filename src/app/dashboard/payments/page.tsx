"use client";

import { usePortal } from "@/contexts/PortalContext";
import { Download, CreditCard, Tag, CheckCircle, Clock, ExternalLink, Receipt } from "lucide-react";

export default function PaymentsPage() {
  const { activeCandidate, addRecentDownload } = usePortal();

  if (!activeCandidate) return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-500 text-sm">No candidate selected</div>
  );

  const c = activeCandidate;
  const isPaid = c.payment_status === "PAID" || c.payment_status === "SPONSORED";
  const paymentDate = isPaid ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Payment Center</h1>
        <p className="text-slate-500 text-sm mt-1">Payment history, invoices, and receipts for {c.student_name}</p>
      </div>

      {/* Summary Card */}
      <div className={`rounded-2xl p-5 border shadow-sm ${isPaid ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isPaid ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
              {isPaid ? <CheckCircle size={20} /> : <Clock size={20} />}
            </div>
            <div>
              <p className={`text-xs font-black uppercase tracking-wide ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
                {c.payment_status === "SPONSORED" ? "School-Sponsored Registration" : isPaid ? "Payment Complete" : "Payment Pending"}
              </p>
              <p className="text-slate-700 text-sm font-semibold mt-0.5">
                {isPaid ? "Registration fee fully paid and confirmed" : "Complete payment to activate your Candidate ID"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction details */}
      {isPaid && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Receipt size={15} className="text-blue-800" /> Transaction Details
            </h2>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-5 py-4">
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wide">Amount</p>
                <p className="text-sm font-black text-slate-900 mt-0.5">₹{c.payment_status === "SPONSORED" ? "0" : "99"}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wide">Status</p>
                <p className="text-sm font-black text-emerald-700 mt-0.5">Confirmed</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wide">Date</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{paymentDate}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wide">Method</p>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">{c.payment_status === "SPONSORED" ? "School" : "Razorpay"}</p>
              </div>
            </div>

            {c.payment_id && (
              <div className="px-5 py-4">
                <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wide mb-1">Transaction ID</p>
                <p className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 break-all">{c.payment_id}</p>
              </div>
            )}

            {c.referral_code && (
              <div className="px-5 py-4 flex items-center gap-2">
                <Tag size={14} className="text-blue-600" />
                <div>
                  <p className="text-[10px] font-bold text-slate-500">Referral code applied</p>
                  <p className="text-xs font-mono font-bold text-blue-800">{c.referral_code}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Download Section */}
      {isPaid && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Payment Receipt</p>
                <p className="text-[10px] text-slate-500">Official PDF receipt</p>
              </div>
            </div>
            <a
              href={`/api/receipt/${c.registration_id}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => addRecentDownload({ id: c.registration_id, name: "Payment Receipt", type: "receipt" })}
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Download size={13} /> PDF
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                <ExternalLink size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">Payment Proof</p>
                <p className="text-[10px] text-slate-500">Razorpay confirmation</p>
              </div>
            </div>
            <a
              href="https://razorpay.com"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <ExternalLink size={13} /> View
            </a>
          </div>
        </div>
      )}

      {!isPaid && (
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 text-center space-y-3">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Clock size={22} />
          </div>
          <h3 className="font-bold text-slate-800">Payment Not Yet Completed</h3>
          <p className="text-xs text-slate-500">Complete your registration payment to receive a Candidate ID and access all features.</p>
          <a href="/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
            Complete Registration
          </a>
        </div>
      )}
    </div>
  );
}
