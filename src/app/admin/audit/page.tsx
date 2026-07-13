"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ShieldCheck, RefreshCw, AlertCircle, Filter } from "lucide-react";

interface AuditEntry {
  id: string;
  actor_id: string;
  actor_role: string;
  action: string;
  module: string;
  ip_address?: string;
  created_at: string;
  previous_value?: any;
  new_value?: any;
}

const MODULES = ["ALL", "RBAC", "QUESTION_BANK", "APPROVALS", "EXAM", "RESULT", "FINANCE", "CMS", "USER"];

const MODULE_COLORS: Record<string, string> = {
  RBAC: "bg-purple-50 text-purple-700",
  QUESTION_BANK: "bg-blue-50 text-blue-700",
  APPROVALS: "bg-amber-50 text-amber-700",
  EXAM: "bg-emerald-50 text-emerald-700",
  RESULT: "bg-red-50 text-red-700",
  FINANCE: "bg-green-50 text-green-700",
  CMS: "bg-indigo-50 text-indigo-700",
  USER: "bg-slate-100 text-slate-600",
};

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleFilter, setModuleFilter] = useState("ALL");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (moduleFilter !== "ALL") params.set("module", moduleFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const res = await fetch(`/api/admin/audit?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotal(data.total ?? (data.logs?.length ?? 0));
    } catch (e: any) {
      setError(e.message || "Failed to load audit trail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, page]);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <ShieldCheck size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Audit Trail</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Immutable Admin Activity Log</p>
          </div>
        </div>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200/50 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-6">
        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Filter Row */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter by Module:</label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800 bg-white"
            >
              {MODULES.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total records:</span>
            <span className="text-sm font-bold text-slate-700">{total.toLocaleString()}</span>
          </div>
        </div>

        {/* Audit Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actor</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Module</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">IP Address</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-sm">
                        No audit entries found.
                      </td>
                    </tr>
                  ) : (
                    logs.map(log => (
                      <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString("en-IN")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs">
                            <p className="text-slate-700 font-medium font-mono">{log.actor_id?.slice(0, 8)}…</p>
                            <p className="text-slate-400">{log.actor_role}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{log.action}</code>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${MODULE_COLORS[log.module] || "bg-slate-100 text-slate-600"}`}>
                            {log.module}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs font-mono">{log.ip_address || "—"}</td>
                        <td className="px-4 py-3">
                          {(log.new_value || log.previous_value) && (
                            <details>
                              <summary className="text-xs text-blue-800 cursor-pointer hover:underline select-none">
                                View diff
                              </summary>
                              <div className="mt-1 text-xs bg-slate-50 border border-slate-100 rounded-lg p-2 max-w-xs overflow-auto">
                                {log.previous_value && (
                                  <p className="text-red-600">− {JSON.stringify(log.previous_value).slice(0, 120)}</p>
                                )}
                                {log.new_value && (
                                  <p className="text-emerald-600">+ {JSON.stringify(log.new_value).slice(0, 120)}</p>
                                )}
                              </div>
                            </details>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl">
              <span className="text-xs text-slate-500 font-medium">
                Showing {logs.length} of {total} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= total}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Read-only notice */}
        <p className="text-center text-xs text-slate-400">
          🔒 This audit trail is read-only and immutable. No modifications are permitted.
        </p>
      </main>
    </div>
  );
}
