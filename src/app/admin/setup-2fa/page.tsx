"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Copy, Download, ArrowRight, Loader2, KeyRound } from "lucide-react";
import Image from "next/image";

export default function Setup2FAPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [step, setStep] = useState<"SETUP" | "RECOVERY">("SETUP");

  useEffect(() => {
    async function initSetup() {
      try {
        const res = await fetch("/api/auth/setup-2fa");
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to initialize 2FA setup");
        }
        const data = await res.json();
        setQrCodeUrl(data.qrCode);
        setSecret(data.secret);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    initSetup();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }
    
    setVerifying(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/setup-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verificationCode, secret })
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid verification code");
      }
      
      setRecoveryCodes(data.recoveryCodes);
      setStep("RECOVERY");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleFinish = () => {
    router.push("/admin");
  };

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join("\n"));
    alert("Recovery codes copied to clipboard!");
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-slate-900 p-6 text-center">
          <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="text-blue-400 w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white">Protect Your Account</h1>
          <p className="text-sm text-slate-400 mt-1">Setup Two-Factor Authentication</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {step === "SETUP" ? (
            <div className="space-y-6">
              <div className="text-sm text-slate-600 leading-relaxed text-center">
                Scan this QR code with your Authenticator App (Google Authenticator, Authy, etc.) to link your device.
              </div>

              {qrCodeUrl && (
                <div className="flex justify-center p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <Image src={qrCodeUrl} alt="QR Code" width={200} height={200} />
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-slate-500 mb-1">Can't scan the QR code? Use this setup key:</p>
                <code className="text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono break-all">
                  {secret}
                </code>
              </div>

              <form onSubmit={handleVerify} className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enter 6-digit code</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                    placeholder="000000"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={verifying || verificationCode.length !== 6}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Enable 2FA"}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto">
                <KeyRound className="text-emerald-600 w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Save your recovery codes</h3>
                <p className="text-sm text-slate-600 mt-2">
                  If you lose your device, these codes are the ONLY way to access your account. Save them somewhere safe. They will not be shown again.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {recoveryCodes.map((code, idx) => (
                    <div key={idx} className="bg-white px-3 py-2 rounded border border-slate-100 text-center text-slate-700 font-medium">
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyCodes}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" /> Copy
                </button>
                <button
                  onClick={handlePrint}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> Print
                </button>
              </div>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                I have saved my codes <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
