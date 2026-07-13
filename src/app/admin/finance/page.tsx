"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { DollarSign, Search, RefreshCw, AlertCircle, Info, ClipboardCheck } from "lucide-react";

interface LedgerEntry {
  id: string;
  school_id: string;
  transaction_type: string;
  amount: number;
  reference?: string;
  description?: string;
  created_at: string;
}

interface FinanceApproval {
  id: string;
  action_type: string;
  status: string;
  payload: any;
  created_at: string;
}

const MOCK_LEDGER: LedgerEntry[] = [
  { id: "1", school_id: "SCH001", transaction_type: "PAYMENT", amount: 5000, reference: "PAY-001", description: "School registration batch", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "2", school_id: "SCH001", transaction_type: "REFUND", amount: -200, reference: "REF-001", description: "Student withdrawal refund", created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: "3", school_id: "SCH001", transaction_type: "PAYMENT", amount: 8000, reference: "PAY-002", description: "Additional students", created_at: new Date(Date.now() - 3600000).toISOString() },
];

const MOCK_APPROVALS: FinanceApproval[] = [
  {
    id: "ap1",
    action_type: "LARGE_REFUND",
    status: "PENDING",
    payload: { amount: 12500, reason: "School closure", school_id: "SCH002" },
    created_at: new Date().toISOString(),
  },
];

export default function FinancePage() {
  const [schoolId, setSchoolId] = useState("");
  const [searchedSchoolId, setSearchedSchoolId] = useState("");
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [financeApprovals, setFinanceApprovals] = useState<FinanceApproval[]>(MOCK_APPROVALS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isDemoData, setIsDemoData] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId.trim()) return;
    setLoading(true);
    setError("");
    setIsDemoData(false);
    try {
      const res = await fetch(`/api/admin/finance?schoolId=${encodeURIComponent(schoolId.trim())}`);
      if (res.ok) {
        const data = await res.json();
        if (data.transactions && data.transactions.length > 0) {
          setLedger(data.transactions);
          setSearchedSchoolId(schoolId.trim());
        } else {
          setLedger([]);
          setSearchedSchoolId(schoolId.trim());
        }
      } else {
        setLedger([]);
        setSearchedSchoolId(schoolId.trim());
      }
    } catch {
      setLedger([]);
      setSearchedSchoolId(schoolId.trim());
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = ledger.reduce((sum, e) => sum + e.amount, 0);
  const hasLargeRefund = ledger.some(e => e.transaction_type === "REFUND" && Math.abs(e.amount) > 10000);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 py-4 px-4 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <DollarSign size={20} className="text-blue-800" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-800">Finance Dashboard</h1>
            <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">Fee Ledger & Refund Management</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-12 py-8 space-y-8">
        {/* Toast */}
        {toast && (
          <div className="fixed top-4 right-4 z-50 px-4 py-3 bg-blue-800 text-white rounded-xl shadow-lg text-sm font-medium">
            {toast}
          </div>
        )}

        {/* Refund Policy Notice */}
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-sm text-amber-800">
          <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Refund Policy Notice</p>
            <p className="text-amber-700 text-xs mt-1">
              Refunds above ₹10,000 require maker-checker approval before processing. They will be submitted as approval requests and cannot be executed directly.
            </p>
          </div>
        </div>

        {/* School Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Search size={16} className="text-blue-800" />
            School Fee Ledger Lookup
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={schoolId}
              onChange={e => setSchoolId(e.target.value)}
              placeholder="Enter School ID (e.g., SCH001)"
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-800/20 focus:border-blue-800"
            />
            <button
              type="submit"
              disabled={loading || !schoolId.trim()}
              className="px-6 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
              Search
            </button>
          </form>
        </div>

        {/* Ledger Table */}
        {(searchedSchoolId || ledger.length > 0) && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">
                Fee Ledger — {searchedSchoolId}
              </h2>
              {isDemoData && (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-2.5 py-1 rounded-lg font-semibold">
                  Demo Data
                </span>
              )}
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Net Balance</span>
                <span className={`text-2xl font-bold ${totalAmount >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Transactions</span>
                <span className="text-2xl font-bold text-slate-700">{ledger.length}</span>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Refunds</span>
                <span className="text-2xl font-bold text-red-700">
                  {ledger.filter(e => e.transaction_type === "REFUND").length}
                </span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reference</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {ledger.map(entry => (
                    <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${
                          entry.transaction_type === "PAYMENT"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-red-50 text-red-700"
                        }`}>
                          {entry.transaction_type}
                        </span>
                      </td>
                      <td className={`px-6 py-3 font-semibold text-sm ${entry.amount >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        ₹{Math.abs(entry.amount).toLocaleString("en-IN")}
                        {Math.abs(entry.amount) > 10000 && entry.transaction_type === "REFUND" && (
                          <span className="ml-2 text-xs bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-normal">Needs approval</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-slate-500 text-xs font-mono">{entry.reference || "—"}</td>
                      <td className="px-6 py-3 text-slate-600 text-xs">{entry.description || "—"}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pending Finance Approvals */}
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <ClipboardCheck size={16} className="text-blue-800" />
            Pending Finance Approvals
          </h2>
          {financeApprovals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center text-slate-400 text-sm">
              No pending finance approvals.
            </div>
          ) : (
            <div className="space-y-3">
              {financeApprovals.map(ap => (
                <div key={ap.id} className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg">{ap.status}</span>
                      <span className="text-xs text-slate-500 font-mono">{ap.action_type}</span>
                    </div>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold">School:</span> {ap.payload?.school_id} —{" "}
                      <span className="font-semibold">Amount:</span> ₹{ap.payload?.amount?.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-slate-400">{ap.payload?.reason}</p>
                  </div>
                  <a
                    href="/admin/approvals"
                    className="px-4 py-2 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    Review →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
