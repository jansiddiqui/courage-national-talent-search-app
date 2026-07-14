"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  School, 
  Search, 
  RefreshCw, 
  Trash2, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  Upload, 
  ArrowRight,
  Filter,
  Sparkles,
  ChevronRight
} from "lucide-react";

export default function ProspectsPage() {
  const router = useRouter();
  const [prospects, setProspects] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Search & Filter States
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [minScoreFilter, setMinScoreFilter] = useState("0");
  const [page, setPage] = useState(1);
  const limit = 20;

  // Seeding/Import State
  const [showImporter, setShowImporter] = useState(false);
  const [importJsonText, setImportJsonText] = useState("");
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchProspects = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (search) params.append("search", search);
      if (stateFilter !== "ALL") params.append("state", stateFilter);
      if (statusFilter !== "ALL") params.append("status", statusFilter);
      if (minScoreFilter !== "0") params.append("minScore", minScoreFilter);

      const res = await fetch(`/api/admin/prospects?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProspects(data.prospects || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load prospects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProspects();
  }, [page, stateFilter, statusFilter, minScoreFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProspects();
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    setImporting(true);
    try {
      // Expecting array of { name, city, state, board, affiliation_number }
      const parsed = JSON.parse(importJsonText.trim());
      const res = await fetch("/api/admin/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Successfully imported ${data.importedCount} schools!`);
        setShowImporter(false);
        setImportJsonText("");
        fetchProspects();
      } else {
        showToast(data.message || "Failed to import schools.");
      }
    } catch (err: any) {
      showToast(`Invalid JSON: ${err.message}`);
    } finally {
      setImporting(false);
    }
  };

  const handleEnrichSelected = async () => {
    if (selectedIds.length === 0) return;
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds: selectedIds })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Queued enrichment for ${data.queuedJobsCount} schools!`);
        setSelectedIds([]);
        fetchProspects();
      } else {
        showToast(data.message || "Failed to queue enrichment jobs.");
      }
    } catch (err) {
      showToast("Network error.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleRunEnrichSingle = async (id: string) => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospectIds: [id] })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Enrichment job successfully queued!");
        fetchProspects();
      } else {
        showToast(data.message || "Failed to queue job.");
      }
    } catch (err) {
      showToast("Network error.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteProspect = async (id: string) => {
    if (!confirm("Are you sure you want to delete this prospect school?")) return;
    try {
      const res = await fetch(`/api/admin/prospects/${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Prospect deleted successfully.");
        fetchProspects();
      }
    } catch (err) {
      showToast("Failed to delete.");
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === prospects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(prospects.map(p => p.id));
    }
  };

  // KPIs
  const totalCount = total;
  const pendingCount = prospects.filter(p => p.enrichment_status === "PENDING").length;
  const processingCount = prospects.filter(p => p.enrichment_status === "PROCESSING").length;
  const completedCount = prospects.filter(p => p.enrichment_status === "COMPLETED").length;
  const qualifiedCount = prospects.filter(p => p.outreach_score >= 70).length;

  return (
    <div className="space-y-6 text-slate-800 animate-slide-up">
      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-xs font-semibold flex items-center gap-2">
          <Sparkles size={14} className="text-indigo-400 animate-pulse" />
          {toast}
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <School className="text-indigo-600" />
            School Intelligence Engine
          </h1>
          <p className="text-xs text-slate-500 mt-1">Discover, enrich, rank, and pitch prospective school partnerships</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImporter(!showImporter)}
            className="px-4 py-2 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={14} />
            Seeding / Import
          </button>
          <button
            onClick={fetchProspects}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-50 rounded-xl border border-slate-200/50 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* JSON importer window */}
      {showImporter && (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800">Seed Candidate Prospects (JSON Array)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Copy and paste a list of high-potential target schools to seed the database.</p>
          </div>
          <form onSubmit={handleImport} className="space-y-3">
            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder={`[\n  { "name": "Greenfield Public School", "city": "Noida", "state": "Uttar Pradesh", "board": "CBSE", "affiliation_number": "2130122" }\n]`}
              rows={6}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowImporter(false)}
                className="px-4 py-2 text-slate-500 hover:bg-slate-50 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={importing}
                className="px-4 py-2 bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
              >
                {importing ? "Importing..." : "Run Seed"}
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Prospects</span>
          <span className="text-xl font-black text-slate-800 block mt-1">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pending</span>
          <span className="text-xl font-black text-slate-800 block mt-1">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Processing</span>
          <span className="text-xl font-black text-amber-700 block mt-1">{processingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-xl font-black text-emerald-700 block mt-1">{completedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">High Fit (&gt;70)</span>
          <span className="text-xl font-black text-indigo-700 block mt-1">{qualifiedCount}</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center justify-between">
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search school name..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
          </div>
          <button type="submit" className="px-3.5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer">
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <Filter size={13} className="text-slate-400" />
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All States</option>
              <option value="Delhi">Delhi</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-200 bg-white rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="0">All Scores</option>
            <option value="50">Score &gt;= 50</option>
            <option value="70">Score &gt;= 70</option>
            <option value="85">Score &gt;= 85</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between text-xs font-semibold text-indigo-800">
          <span>{selectedIds.length} schools selected for research.</span>
          <button
            onClick={handleEnrichSelected}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-sm hover:bg-indigo-700 transition-all"
          >
            <Play size={12} />
            Research Batch
          </button>
        </div>
      )}

      {/* Main Prospects Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    checked={prospects.length > 0 && selectedIds.length === prospects.length}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </th>
                <th className="p-4">School Details</th>
                <th className="p-4">State Affiliation</th>
                <th className="p-4">Outreach Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
              {prospects.length > 0 ? (
                prospects.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-slate-300 text-indigo-600"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {p.city} · {p.board || "CBSE"}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-slate-600">{p.state}</span>
                        {p.affiliation_number && (
                          <div className="text-[9px] text-slate-400 mt-0.5">Aff: {p.affiliation_number}</div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-black text-indigo-700">{p.outreach_score}</span>
                          <span className="text-[10px] text-slate-400">({p.confidence_score}% conf)</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          p.enrichment_status === "COMPLETED" ? "bg-emerald-50 text-emerald-700" :
                          p.enrichment_status === "PROCESSING" ? "bg-amber-50 text-amber-700" :
                          p.enrichment_status === "FAILED" ? "bg-rose-50 text-rose-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {p.enrichment_status}
                        </span>
                        {p.identity_status !== "DISTINCT" && (
                          <span className="ml-1.5 px-2 py-0.5 bg-amber-50 text-amber-800 rounded-full text-[9px] font-semibold border border-amber-100">
                            {p.identity_status.replace("_", " ")}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleRunEnrichSingle(p.id)}
                            disabled={refreshing || p.enrichment_status === "PROCESSING"}
                            className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:border-indigo-100 bg-white transition-all cursor-pointer"
                            title="Run research pipeline"
                          >
                            <Play size={12} />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/prospects/${p.id}`)}
                            className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 bg-white text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-0.5"
                          >
                            Report
                            <ChevronRight size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProspect(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    {loading ? "Loading school prospects..." : "No prospective schools seeded yet. Click 'Seeding / Import' to get started."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
