"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Key, 
  Lock, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  MessageSquare,
  CheckCircle,
  HelpCircle,
  Mail,
  Calendar,
  Phone
} from "lucide-react";
import { authService } from "@/services/authService";

type LoginTab = "credentials" | "magic-link";

export default function LoginPage() {
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>("credentials");
  const [showForgotId, setShowForgotId] = useState(false);
  
  // Credentials form state
  const [cntsId, setCntsId] = useState("");
  const [dob, setDob] = useState("");
  
  // Magic link form state
  const [email, setEmail] = useState("");
  
  // Forgot ID form state
  const [phone, setPhone] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      
      // Check URL query parameters for errors
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        setError(err);
      }
    }, 0);

    authService.checkSession().then((res) => {
      if (res.isAuthenticated) {
        if (res.role === "ADMIN" || res.role === "SUPER_ADMIN" || res.role === "VOLUNTEER") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }
    });
    return () => clearTimeout(timer);
  }, [router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!cntsId.trim()) {
      setError("Please enter your CNTS ID");
      return;
    }
    if (!dob) {
      setError("Please select the student's date of birth");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.loginWithCredentials(cntsId.trim(), dob);
      if (res.success) {
        setSuccessMessage("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          if (res.role === "ADMIN" || res.role === "SUPER_ADMIN" || res.role === "VOLUNTEER") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!email.trim()) {
      setError("Please enter your registered email address");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.sendEmailLink(email.trim());
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to request sign-in link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit registered phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.forgotCNTSId(phone);
      if (res.success) {
        setSuccessMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("Failed to recover CNTS ID. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotId(false);
    setError("");
    setSuccessMessage("");
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen mesh-bg py-12 px-6 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        
        {/* Navigation & Logo */}
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-9 h-9">
              <Image
                src="/images/logo.png"
                alt="CNTS Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="font-display font-bold text-sm leading-tight text-slate-900">CNTS</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wide font-medium">Founding Edition 2026</div>
            </div>
          </Link>
          <Link 
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-8 relative overflow-hidden">
          {/* Confetti backgrounds */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full blur-2xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

          <div className="relative space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-wider mx-auto">
                <Sparkles size={11} className="text-blue-800" />
                Secure Parent Portal
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                {showForgotId ? "Recover CNTS ID" : "Parent Login"}
              </h2>
              <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                {showForgotId 
                  ? "Enter the registered phone number and we will send the CNTS ID to your WhatsApp number."
                  : "Access registrations, download admit cards, view result keys, and download certified talent profiles."}
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-xs text-red-800 animate-slide-up">
                <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={15} />
                <p className="font-semibold text-left">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800 animate-slide-up">
                <CheckCircle className="shrink-0 text-emerald-600 mt-0.5" size={15} />
                <p className="font-semibold text-left">{successMessage}</p>
              </div>
            )}

            {/* Tab Selection */}
            {!showForgotId && (
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("credentials");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "credentials" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  CNTS ID + DOB
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("magic-link");
                    setError("");
                    setSuccessMessage("");
                  }}
                  className={`py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === "magic-link" 
                      ? "bg-white text-slate-900 shadow-sm" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Email Magic Link
                </button>
              </div>
            )}

            {/* Forms rendering */}
            {showForgotId ? (
              /* Forgot CNTS ID Form */
              <form onSubmit={handleForgotIdSubmit} className="space-y-4 animate-slide-up">
                <div className="space-y-1.5">
                  <label htmlFor="recoveryPhone" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" />
                    Registered Mobile / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="recoveryPhone"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all font-semibold"
                    maxLength={10}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    disabled={loading}
                    className="flex-1 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-60 text-center"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-850/10 hover:shadow-blue-750/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {loading ? "Recovering..." : "Send CNTS ID"}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : activeTab === "credentials" ? (
              /* Tab 1: CNTS ID + DOB */
              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div className="space-y-4">
                  {/* CNTS ID */}
                  <div className="space-y-1.5">
                    <label htmlFor="cntsId" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Key size={12} className="text-slate-400" />
                      CNTS ID
                    </label>
                    <input
                      type="text"
                      id="cntsId"
                      placeholder="CNTS260001"
                      value={cntsId}
                      onChange={(e) => setCntsId(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all font-semibold uppercase"
                      disabled={loading}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      Student Date of Birth
                    </label>
                    <input
                      type="date"
                      id="dob"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all font-semibold"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <Link 
                    href="/recover-id"
                    className="text-[10px] text-blue-800 hover:underline font-bold cursor-pointer"
                  >
                    Forgot CNTS ID?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-850/10 hover:shadow-blue-750/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Logging in..." : "Login to Portal"}
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              /* Tab 2: Email Magic Link */
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" />
                    Registered Parent Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="parent@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-850/10 transition-all font-semibold"
                    disabled={loading}
                  />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MessageSquare size={10} className="text-emerald-500 animate-pulse" />
                    We will email you a secure login link that expires in 15 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-850/10 hover:shadow-blue-750/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {loading ? "Sending link..." : "Send Login Link"}
                  <ArrowRight size={14} />
                </button>
              </form>
            )}

            {/* Help / Footer support shortcut */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <HelpCircle size={12} /> Don&apos;t have a registration yet?{" "}
                <Link href="/register" className="text-blue-800 font-bold hover:underline">
                  Register Now
                </Link>
              </span>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
