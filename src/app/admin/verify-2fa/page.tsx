"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function Verify2FAPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
  const [trustDevice, setTrustDevice] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!useRecovery && code.length !== 6) || (useRecovery && code.length !== 8)) {
      setError(useRecovery ? "Recovery code must be 8 characters" : "Please enter a 6-digit code");
      return;
    }
    
    setVerifying(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, isRecovery: useRecovery, trustDevice })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid code");
      }
      
      router.push("/admin");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-blue-400 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Two-Factor Authentication</h1>
          <p className="text-sm text-slate-400 mt-1">Enter your verification code to continue</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {useRecovery ? "Enter Recovery Code" : "Enter 6-digit code"}
              </label>
              <input
                type="text"
                maxLength={useRecovery ? 8 : 6}
                value={code}
                onChange={(e) => setCode(useRecovery ? e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') : e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                placeholder={useRecovery ? "ABCDEF12" : "000000"}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="trustDevice" 
                checked={trustDevice} 
                onChange={(e) => setTrustDevice(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="trustDevice" className="text-sm text-slate-600 cursor-pointer">
                Trust this device for 30 days
              </label>
            </div>

            <button
              type="submit"
              disabled={verifying || (!useRecovery && code.length !== 6) || (useRecovery && code.length !== 8)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setUseRecovery(!useRecovery); setCode(""); setError(""); }}
              className="text-sm text-blue-600 hover:underline"
            >
              {useRecovery ? "Use Authenticator App instead" : "Use a Recovery Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
