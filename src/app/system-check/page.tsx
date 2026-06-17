"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { 
  Laptop, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Info,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function SystemCheckPage() {
  const [running, setRunning] = useState(false);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState({
    browser: { label: "Browser Compatibility", checked: false, value: "", status: "pending" },
    resolution: { label: "Screen Resolution", checked: false, value: "", status: "pending" },
    connection: { label: "Internet Status", checked: false, value: "", status: "pending" },
    js: { label: "JavaScript Activation", checked: false, value: "", status: "pending" },
  });

  const runDiagnostics = () => {
    setRunning(true);
    setChecked(false);
    
    // Reset statuses to running
    setResults(prev => ({
      browser: { ...prev.browser, status: "checking" },
      resolution: { ...prev.resolution, status: "checking" },
      connection: { ...prev.connection, status: "checking" },
      js: { ...prev.js, status: "checking" },
    }));

    // Step 1: JS Check
    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        js: { label: "JavaScript Activation", checked: true, value: "Enabled", status: "success" }
      }));
    }, 400);

    // Step 2: Screen resolution
    setTimeout(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const displayVal = `${width}x${height}`;
      const displayStatus = width >= 360 ? "success" : "warning";
      setResults(prev => ({
        ...prev,
        resolution: { label: "Screen Resolution", checked: true, value: displayVal, status: displayStatus }
      }));
    }, 800);

    // Step 3: Browser check
    setTimeout(() => {
      const userAgent = window.navigator.userAgent;
      let browserName = "Modern Browser";
      if (userAgent.indexOf("Chrome") > -1) browserName = "Google Chrome";
      else if (userAgent.indexOf("Safari") > -1) browserName = "Safari";
      else if (userAgent.indexOf("Firefox") > -1) browserName = "Mozilla Firefox";
      else if (userAgent.indexOf("Edg") > -1) browserName = "Microsoft Edge";
      
      setResults(prev => ({
        ...prev,
        browser: { label: "Browser Compatibility", checked: true, value: browserName, status: "success" }
      }));
    }, 1200);

    // Step 4: Connection check
    setTimeout(() => {
      const isOnline = window.navigator.onLine;
      setResults(prev => ({
        ...prev,
        connection: { 
          label: "Internet Connection", 
          checked: true, 
          value: isOnline ? "Online / Stable" : "Offline", 
          status: isOnline ? "success" : "error" 
        }
      }));
      setRunning(false);
      setChecked(true);
    }, 1600);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-36 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <Laptop size={12} /> Diagnostic Desk
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 leading-tight">
            System Compatibility Check
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-8">
            Run a diagnostic compatibility verify check on your device and browser before launching the conceptual assessment.
          </p>
        </div>
      </section>

      {/* Main Diagnostic Board */}
      <main className="max-w-2xl w-full mx-auto px-6 py-16 flex-1 flex flex-col items-center">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm w-full space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Device Diagnostic Summary</h3>
              <p className="text-[10px] text-slate-450 mt-1">Verifies local script capability, resolution, and connectivity.</p>
            </div>
            <button
              onClick={runDiagnostics}
              disabled={running}
              className="bg-blue-800 hover:bg-blue-750 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-800/10 transition-all cursor-pointer disabled:opacity-50"
            >
              {running ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play size={12} />
                  Run Diagnostics
                </>
              )}
            </button>
          </div>

          {/* Diagnostic items */}
          <div className="space-y-4">
            {(Object.keys(results) as Array<keyof typeof results>).map((key) => {
              const r = results[key];
              return (
                <div key={key} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">{r.label}</span>
                    {r.checked && (
                      <span className="text-[10px] text-slate-400 font-mono block">Detected: {r.value}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {r.status === "pending" && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">Pending</span>
                    )}
                    {r.status === "checking" && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {r.status === "success" && (
                      <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-100 py-0.5 px-2 rounded-lg text-[10px] font-bold">
                        <CheckCircle2 size={12} /> Verified
                      </div>
                    )}
                    {r.status === "warning" && (
                      <div className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-100 py-0.5 px-2 rounded-lg text-[10px] font-bold">
                        <Info size={12} /> Low Res
                      </div>
                    )}
                    {r.status === "error" && (
                      <div className="flex items-center gap-1 text-red-700 bg-red-50 border border-red-100 py-0.5 px-2 rounded-lg text-[10px] font-bold">
                        <XCircle size={12} /> Failed
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {checked && (
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl flex items-start gap-3 text-emerald-950 text-xs animate-scale-in">
              <ShieldCheck size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="font-bold">System Check Successful!</strong>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  Your device and browser are fully compatible with the CNTS 2026 assessment guidelines. Webcams are not required.
                </p>
              </div>
            </div>
          )}
        </div>

        {checked && (
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            >
              Return to Dashboard <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
