"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Layers, RefreshCw, AlertCircle, Clock, CheckCircle, XCircle, Loader2, Play, StopCircle } from "lucide-react";

interface Job {
  id: string;
  job_type: string;
  status: string;
  created_at: string;
  attempts: number;
  max_attempts: number;
  error_logs?: string;
  execution_time_ms?: number;
}

interface QueueSummary {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

const STATUS_CONFIG: Record<string, { color: string; icon: React.ReactNode }> = {
  PENDING: { color: "bg-amber-50 text-amber-700", icon: <Clock size={11} /> },
  PROCESSING: { color: "bg-blue-50 text-blue-700", icon: <Loader2 size={11} className="animate-spin" /> },
  COMPLETED: { color: "bg-emerald-50 text-emerald-700", icon: <CheckCircle size={11} /> },
  FAILED: { color: "bg-red-50 text-red-700", icon: <XCircle size={11} /> },
  RETRY_PENDING: { color: "bg-orange-50 text-orange-700", icon: <Play size={11} /> },
};

function SummaryCard({ label, value, colorClass }: { label: string; value: number; colorClass: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</span>
        <span className={`text-2xl font-bold mt-1 block ${colorClass}`}>{value}</span>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [selectedQueue, setSelectedQueue] = useState<"admin" | "school">("admin");
  const [adminSummary, setAdminSummary] = useState<QueueSummary>({ pending: 0, processing: 0, completed: 0, failed: 0 });
  const [schoolSummary, setSchoolSummary] = useState<QueueSummary>({ pending: 0, processing: 0, completed: 0, failed: 0 });
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/jobs?queue=${selectedQueue}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      if (data.adminSummary) setAdminSummary(data.adminSummary);
      if (data.schoolSummary) setSchoolSummary(data.schoolSummary);
    } catch (e: any) {
      setError(e.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedQueue]);

  const handleCancel = async (jobId: string) => {
    if (!confirm("Cancel this job?")) return;
    setCancelLoading(jobId);
    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel", jobId, queue: selectedQueue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Job cancelled.");
        fetchJobs();
      } else {
        showToast(data.message || "Failed to cancel job.");
      }
    } catch (e: any) {
      showToast(e.message || "Network error.");
    } finally {
      setCancelLoading(null);
    }
  };

  const currentSummary = selectedQueue === "admin" ? adminSummary : schoolSummary;

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Layers size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Background Job Queues</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Monitor & Manage Jobs</p>
          </div>
        </div>
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-8">
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

        {/* Queue Selector */}
        <div className="flex gap-2">
          {(["admin", "school"] as const).map(q => (
            <button
              key={q}
              onClick={() => setSelectedQueue(q)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                selectedQueue === q
                  ? "bg-blue-800 text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {q === "admin" ? "Admin Queue" : "School Queue"}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryCard label="Pending" value={currentSummary.pending} colorClass="text-amber-700" />
          <SummaryCard label="Processing" value={currentSummary.processing} colorClass="text-blue-700" />
          <SummaryCard label="Completed" value={currentSummary.completed} colorClass="text-emerald-700" />
          <SummaryCard label="Failed" value={currentSummary.failed} colorClass="text-red-700" />
        </div>

        {/* Also show the other queue in a compact row */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {selectedQueue === "admin" ? "School Queue Summary" : "Admin Queue Summary"}
          </p>
          <div className="flex gap-6 flex-wrap">
            {Object.entries(selectedQueue === "admin" ? schoolSummary : adminSummary).map(([key, val]) => (
              <div key={key} className="text-center">
                <span className="text-xs text-slate-400 block capitalize">{key}</span>
                <span className="text-lg font-bold text-slate-700">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-sm">Recent Jobs</h2>
              <span className="text-xs text-slate-400">{jobs.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Job Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attempts</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-slate-400 text-sm">
                        No jobs found in this queue.
                      </td>
                    </tr>
                  ) : (
                    jobs.map(job => {
                      const cfg = STATUS_CONFIG[job.status] || { color: "bg-slate-100 text-slate-600", icon: null };
                      const canCancel = job.status === "PENDING" || job.status === "PROCESSING";
                      return (
                        <tr key={job.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-3">
                            <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">{job.job_type}</code>
                          </td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${cfg.color}`}>
                              {cfg.icon}
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-slate-500 text-xs">
                            {job.attempts}/{job.max_attempts}
                          </td>
                          <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">
                            {new Date(job.created_at).toLocaleString("en-IN")}
                          </td>
                          <td className="px-6 py-3">
                            {canCancel && (
                              <button
                                onClick={() => handleCancel(job.id)}
                                disabled={cancelLoading === job.id}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <StopCircle size={12} />
                                {cancelLoading === job.id ? "..." : "Cancel"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
