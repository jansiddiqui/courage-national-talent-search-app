"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ClipboardCheck, RefreshCw, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface ApprovalRequest {
  id: string;
  action_type: string;
  module: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  requested_by: string;
  reviewed_by?: string;
  rejection_reason?: string;
  payload: any;
  created_at: string;
  reviewed_at?: string;
}

function StatusBadge({ status }: { status: string }) {
  if (status === "PENDING") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
        <Clock size={11} /> PENDING
      </span>
    );
  }
  if (status === "APPROVED") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
        <CheckCircle size={11} /> APPROVED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold">
      <XCircle size={11} /> REJECTED
    </span>
  );
}

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchApprovals = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/approvals");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setApprovals(data.approvals || []);
    } catch (e: any) {
      setError(e.message || "Failed to load approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (approvalId: string) => {
    setActionLoading(approvalId);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve", approvalId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Request approved successfully!");
        fetchApprovals();
      } else {
        showToast(data.message || "Failed to approve.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (approvalId: string) => {
    if (!rejectionReason.trim()) {
      showToast("Please enter a rejection reason.");
      return;
    }
    setActionLoading(approvalId);
    try {
      const res = await fetch("/api/admin/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", approvalId, rejectionReason: rejectionReason.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Request rejected.");
        setRejectingId(null);
        setRejectionReason("");
        fetchApprovals();
      } else {
        showToast(data.message || "Failed to reject.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = approvals.filter(a => a.status === "PENDING").length;

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <ClipboardCheck size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Approval Queue</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Maker-Checker Workflow</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-100">
              {pendingCount} pending
            </span>
          )}
          <button
            onClick={fetchApprovals}
            disabled={loading}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-blue-800 text-white rounded-xl shadow-lg text-sm font-medium">
            {toast}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
                <ClipboardCheck size={36} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">No approval requests found.</p>
                <p className="text-slate-400 text-sm mt-1">All caught up!</p>
              </div>
            ) : (
              approvals.map(approval => (
                <div
                  key={approval.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={approval.status} />
                        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                          {approval.module}
                        </span>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                          {approval.action_type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-700">Requested by:</span> {approval.requested_by}
                      </p>
                      {approval.reviewed_by && (
                        <p className="text-sm text-slate-500">
                          <span className="font-semibold">Reviewed by:</span> {approval.reviewed_by}
                        </p>
                      )}
                      {approval.rejection_reason && (
                        <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                          <span className="font-semibold">Reason:</span> {approval.rejection_reason}
                        </p>
                      )}
                      <p className="text-xs text-slate-400">
                        {new Date(approval.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {approval.status === "PENDING" && (
                      <div className="flex flex-col gap-2 min-w-[200px]">
                        {rejectingId === approval.id ? (
                          <div className="space-y-2">
                            <textarea
                              value={rejectionReason}
                              onChange={e => setRejectionReason(e.target.value)}
                              placeholder="Enter rejection reason..."
                              rows={2}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleReject(approval.id)}
                                disabled={actionLoading === approval.id}
                                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                {actionLoading === approval.id ? "Rejecting..." : "Confirm Reject"}
                              </button>
                              <button
                                onClick={() => { setRejectingId(null); setRejectionReason(""); }}
                                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(approval.id)}
                              disabled={actionLoading === approval.id}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle size={13} />
                              {actionLoading === approval.id ? "..." : "Approve"}
                            </button>
                            <button
                              onClick={() => setRejectingId(approval.id)}
                              className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <XCircle size={13} />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payload Preview */}
                  {approval.payload && Object.keys(approval.payload).length > 0 && (
                    <details className="mt-4">
                      <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700 font-medium select-none">
                        View payload details
                      </summary>
                      <pre className="mt-2 text-xs bg-slate-50 border border-slate-100 rounded-xl p-3 text-slate-600 overflow-x-auto whitespace-pre-wrap break-all">
                        {JSON.stringify(approval.payload, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
