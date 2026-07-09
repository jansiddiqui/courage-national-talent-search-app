"use client";

import { usePortal } from "@/contexts/PortalContext";
import { Shield, Smartphone, Globe, Lock, Download, AlertTriangle, Key } from "lucide-react";

export default function SecurityPage() {
  const { parentSession, preferences } = usePortal();

  const loginPhone = parentSession?.phoneNumber || "Phone Session";
  const downloadHistory = preferences.recentDownloads || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Security</h1>
        <p className="text-slate-500 text-sm mt-1">Manage portal sessions, security settings, and audit logs</p>
      </div>

      {/* Security Banner Alert */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <Shield className="text-blue-800 shrink-0 mt-0.5" size={16} />
        <div>
          <h4 className="text-xs font-bold text-blue-900">Your Workspace is Protected</h4>
          <p className="text-[10px] text-blue-700 mt-0.5 leading-relaxed">
            All reports, certificates, and student details are encrypted. Only authorized numbers matching the registration phone can authenticate.
          </p>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Active Session</h2>
          <span className="text-[9px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg">Current Device</span>
        </div>
        <div className="p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center shrink-0 border border-slate-100">
            <Smartphone size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Mobile/Web Browser Session</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Authenticated via phone verification code: {loginPhone}</p>
            <p className="text-[10px] text-slate-400 mt-1">Last active: Just now</p>
          </div>
        </div>
      </div>

      {/* Document Access Logs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Download size={15} className="text-slate-500" /> Document Download History
          </h2>
        </div>
        {downloadHistory.length === 0 ? (
          <div className="p-5 text-center text-slate-400 text-xs">No documents downloaded yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {downloadHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between px-5 py-3 text-xs">
                <div>
                  <p className="font-semibold text-slate-700">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{new Date(item.date).toLocaleString("en-IN")}</p>
                </div>
                <span className="text-[9px] font-black uppercase text-slate-400">{item.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Advanced Settings Placeholders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="px-5 py-4">
          <h2 className="font-bold text-slate-800 text-sm">Authentication Controls</h2>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Key size={16} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Two-Factor Authentication (2FA)</p>
              <p className="text-[10px] text-slate-400">Adds an extra layer of login protection</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Soon</span>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-slate-500 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Biometric Verification</p>
              <p className="text-[10px] text-slate-400">Unlock badge or results using device fingerprint/face identification</p>
            </div>
          </div>
          <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Soon</span>
        </div>
      </div>
    </div>
  );
}
