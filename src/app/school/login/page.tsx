"use client";

import { useState } from "react";
import { School, Lock, AlertCircle } from "lucide-react";

export default function StandaloneSchoolLoginPage() {
  const [formData, setFormData] = useState({ schoolCode: "", pin: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/schools/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.success) {
        window.location.href = "/school";
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-blue-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <School size={120} />
          </div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <School className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">School Portal Access</h1>
          <p className="text-blue-100 text-sm">Manage candidate registrations and performance analytics</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl flex gap-2 items-start border border-red-100">
              <AlertCircle size={18} className="shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">School Code</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <School size={18} />
                </div>
                <input 
                  type="text" 
                  value={formData.schoolCode}
                  onChange={e => setFormData({ ...formData, schoolCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. CNTS-KAN-7375"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-mono font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Secure 4-Digit PIN</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={formData.pin}
                  onChange={e => setFormData({ ...formData, pin: e.target.value })}
                  placeholder="Enter your 4-digit PIN"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-mono font-bold tracking-widest"
                  required
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Access School Workspace →"}
          </button>
        </form>
      </div>
    </div>
  );
}
