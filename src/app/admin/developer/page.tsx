"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Terminal, RefreshCw, Play, CheckCircle, Clock, AlertCircle, Database, Cpu, Zap, Activity } from "lucide-react";

interface PlatformMetrics {
  cpuUsage: string;
  memoryAllocated: string;
  openConnections: number;
  slowQueriesCount: number;
  tableCount: number;
  healthScore: number;
  dbVersion?: string;
}

interface QueueSnapshot {
  adminPending: number;
  adminProcessing: number;
  adminFailed: number;
  schoolPending: number;
  schoolProcessing: number;
  schoolFailed: number;
}

const MOCK_METRICS: PlatformMetrics = {
  cpuUsage: "18%",
  memoryAllocated: "6.7 GB",
  openConnections: 12,
  slowQueriesCount: 0,
  tableCount: 22,
  healthScore: 99,
  dbVersion: "PostgreSQL 15.x (Supabase)",
};

const MOCK_QUEUE: QueueSnapshot = {
  adminPending: 2,
  adminProcessing: 1,
  adminFailed: 0,
  schoolPending: 5,
  schoolProcessing: 2,
  schoolFailed: 1,
};

function MetricTile({ label, value, icon: Icon, accent }: { label: string; value: string | number; icon: any; accent: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{label}</span>
        <span className="text-2xl font-bold text-slate-800">{value}</span>
      </div>
      <div className={`p-2.5 rounded-xl ${accent}`}>
        <Icon size={18} />
      </div>
    </div>
  );
}

export default function DeveloperPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics>(MOCK_METRICS);
  const [queueSnapshot, setQueueSnapshot] = useState<QueueSnapshot>(MOCK_QUEUE);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportJobId, setExportJobId] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/monitoring");
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (data.queueSnapshot) setQueueSnapshot(data.queueSnapshot);
      }
    } catch {
      // keep mock data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const handleExport = async () => {
    setExportLoading(true);
    setExportStatus("Submitting export job...");
    setExportJobId(null);
    try {
      const res = await fetch("/api/admin/reports/async-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType: "FULL_EXPORT", format: "CSV" }),
      });
      const data = await res.json();
      if (res.ok && data.jobId) {
        setExportJobId(data.jobId);
        setExportStatus("Job queued — processing in background. You will be notified when complete.");
        showToast("Export job queued successfully!");
      } else {
        setExportStatus(data.message || "Failed to queue export job.");
      }
    } catch (e: any) {
      setExportStatus(e.message || "Network error while triggering export.");
    } finally {
      setExportLoading(false);
    }
  };

  const healthColor = metrics.healthScore >= 95
    ? "text-emerald-700"
    : metrics.healthScore >= 80
    ? "text-amber-700"
    : "text-red-700";

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Terminal size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Developer Console</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Platform Health & Mission Control</p>
          </div>
        </div>
        <button
          onClick={fetchMetrics}
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

        {/* Health Score Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform Health Score</p>
            <div className="flex items-end gap-2 mt-1">
              <span className={`text-5xl font-bold ${healthColor}`}>{metrics.healthScore}</span>
              <span className="text-slate-400 text-lg mb-1">/100</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{metrics.dbVersion || "Supabase PostgreSQL"}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${metrics.healthScore >= 95 ? "bg-emerald-400" : metrics.healthScore >= 80 ? "bg-amber-400" : "bg-red-400"} animate-pulse`} />
            <span className={`text-sm font-bold ${healthColor}`}>
              {metrics.healthScore >= 95 ? "Healthy" : metrics.healthScore >= 80 ? "Degraded" : "Critical"}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricTile label="CPU Usage" value={metrics.cpuUsage} icon={Cpu} accent="bg-blue-50 text-blue-700" />
          <MetricTile label="Memory" value={metrics.memoryAllocated} icon={Database} accent="bg-purple-50 text-purple-700" />
          <MetricTile label="DB Connections" value={metrics.openConnections} icon={Activity} accent="bg-emerald-50 text-emerald-700" />
          <MetricTile label="Slow Queries" value={metrics.slowQueriesCount} icon={Zap} accent={metrics.slowQueriesCount > 0 ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-500"} />
          <MetricTile label="Tables" value={metrics.tableCount} icon={Database} accent="bg-indigo-50 text-indigo-700" />
        </div>

        {/* Queue Snapshot */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-800" />
            Queue Snapshot
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Admin Queue</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600 font-medium">Pending</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.adminPending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">Processing</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.adminProcessing}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 font-medium">Failed</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.adminFailed}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">School Queue</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-amber-600 font-medium">Pending</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.schoolPending}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600 font-medium">Processing</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.schoolProcessing}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-600 font-medium">Failed</span>
                  <span className="font-bold text-slate-700">{queueSnapshot.schoolFailed}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Total Load</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Active Jobs</span>
                  <span className="font-bold text-slate-700">
                    {queueSnapshot.adminProcessing + queueSnapshot.schoolProcessing}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Queued</span>
                  <span className="font-bold text-slate-700">
                    {queueSnapshot.adminPending + queueSnapshot.schoolPending}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-red-500 font-medium">Failures</span>
                  <span className="font-bold text-red-700">
                    {queueSnapshot.adminFailed + queueSnapshot.schoolFailed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Async Export */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-800">Async Report Export</h2>
              <p className="text-xs text-slate-500 mt-1">
                Trigger a full platform data export job. The job runs in the background and you will be notified when ready.
              </p>
            </div>
            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="px-5 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap"
            >
              {exportLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <Play size={14} />
              )}
              {exportLoading ? "Queuing..." : "Trigger Export"}
            </button>
          </div>

          {exportStatus && (
            <div className={`p-4 rounded-xl border text-sm flex items-start gap-2 ${
              exportJobId
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-amber-50 border-amber-100 text-amber-700"
            }`}>
              {exportJobId ? <CheckCircle size={16} className="shrink-0 mt-0.5" /> : <Clock size={16} className="shrink-0 mt-0.5" />}
              <div>
                <p>{exportStatus}</p>
                {exportJobId && (
                  <p className="text-xs mt-1 font-mono text-emerald-600">Job ID: {exportJobId}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-slate-700 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Job Queues", href: "/admin/jobs" },
              { label: "Audit Trail", href: "/admin/audit" },
              { label: "Approvals", href: "/admin/approvals" },
              { label: "RBAC", href: "/admin/rbac" },
            ].map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-3 bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-800 transition-all text-center"
              >
                {link.label} →
              </a>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
