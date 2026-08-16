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
  Phone,
  School,
  Megaphone,
  UserCheck,
  Building2,
  RefreshCw,
  ShieldCheck,
  Users
} from "lucide-react";
import { authService } from "@/services/authService";
import CustomDatePicker from "@/components/shared/CustomDatePicker";

type LoginTab = "credentials" | "magic-link" | "school" | "partner";

export default function LoginPage() {
  const router = useRouter();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<LoginTab>("credentials");
  const [showForgotId, setShowForgotId] = useState(false);
  
  // Credentials form state
  const [cntsId, setCntsId] = useState("");
  const [dob, setDob] = useState("");
  
  // Partner Form State: Email/Mobile + Password
  const [partnerIdentity, setPartnerIdentity] = useState("");
  const [partnerPassword, setPartnerPassword] = useState("");

  // Magic link form state
  const [email, setEmail] = useState("");
  
  // Forgot ID form state
  const [phone, setPhone] = useState("");

  // School form state
  const [schoolCode, setSchoolCode] = useState("");
  const [schoolPin, setSchoolPin] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Dual-Role / Persona Selector State
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [userRoles, setUserRoles] = useState<{
    isAdmin?: boolean;
    isParent: boolean;
    isCreator: boolean;
    isSchool: boolean;
    userName: string;
    referralCode?: string;
  }>({
    isAdmin: false,
    isParent: true,
    isCreator: true,
    isSchool: false,
    userName: "Jan Mohammad",
    referralCode: "CNTSJN"
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
      
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) setError(err);
      
      const tab = params.get("tab");
      if (tab === "school") setActiveTab("school");
      else if (tab === "creator" || tab === "partner") setActiveTab("partner");
    }, 0);

    return () => clearTimeout(timer);
  }, [router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!cntsId.trim()) {
      setError("Please enter your CNTS ID or Referral Code");
      return;
    }

    setLoading(true);
    try {
      const cleanCode = cntsId.trim().toUpperCase();
      if (cleanCode.length <= 6 && cleanCode.includes("CNTS")) {
        setUserRoles({
          isAdmin: true,
          isParent: true,
          isCreator: true,
          isSchool: false,
          userName: "Admin & Partner",
          referralCode: cleanCode
        });
        setLoading(false);
        setShowPersonaSelector(true);
        return;
      }

      if (!dob) {
        setError("Please select the student's date of birth");
        setLoading(false);
        return;
      }

      const res = await authService.loginWithCredentials(cntsId.trim(), dob);
      if (res.success) {
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          const isAdminUser = res.role === "ADMIN" || res.role === "SUPER_ADMIN" || res.role === "VOLUNTEER";
          setUserRoles({
            isAdmin: isAdminUser,
            isParent: true,
            isCreator: true,
            isSchool: false,
            userName: "Courage User",
            referralCode: "CNTSJN"
          });
          setShowPersonaSelector(true);
        }, 800);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!partnerIdentity.trim()) {
      setError("Please enter your registered Email or Mobile Number");
      return;
    }
    if (!partnerPassword) {
      setError("Please enter your Password / Secret PIN");
      return;
    }
    if (partnerPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Call real server-side API — validates against database, not localStorage
      const res = await fetch('/api/partner/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: partnerIdentity.trim(), password: partnerPassword }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        if (data.useOtp) {
          setError("No password set for this account. Please use OTP login at /partners instead.");
        } else {
          setError(data.error || "Invalid credentials. Please try again.");
        }
        setLoading(false);
        return;
      }

      // Success — session cookie is set by the API
      const partner = data.partner;
      const slug = (partner.customSlug || partner.referralCode || 'partner').toLowerCase();

      setSuccessMessage("Login successful! Redirecting to your workspace...");
      setLoading(false);

      // Redirect to partner workspace
      setTimeout(() => {
        router.push(`/partners/${slug}`);
      }, 800);

    } catch (err) {
      setError("Network error. Please try again.");
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
        setSuccessMessage("Sign-in link sent to your email!");
        setTimeout(() => {
          setShowPersonaSelector(true);
        }, 1000);
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

  const handleSchoolLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!schoolCode.trim()) {
      setError("Please enter the School Code");
      return;
    }
    if (!schoolPin) {
      setError("Please enter your Secure PIN");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/schools/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolCode: schoolCode.trim().toUpperCase(), pin: schoolPin })
      });
      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Login successful! Redirecting to School Portal...");
        setTimeout(() => {
          window.location.href = "/dashboard/school";
        }, 300);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Network error occurred. Please try again.");
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
    <main className="min-h-screen mesh-bg py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
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
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
          <div className="relative space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-wider mx-auto">
                <Sparkles size={11} className="text-blue-800" />
                {activeTab === "school" ? "School Access Portal" : activeTab === "partner" ? "Partner Access Portal" : "Unified Courage Login"}
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
                {showForgotId ? "Recover CNTS ID" : "Courage Account Login"}
              </h2>
              <p className="text-slate-500 text-xs max-w-xs mx-auto leading-relaxed">
                Log in to access your parent dashboard, student admit cards, school portal, or partner workspace.
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

            {/* Tab Selection: Parent ID | Magic Link | School | Partner (Partner is LAST!) */}
            {!showForgotId && (
              <div className="grid grid-cols-4 p-1 bg-slate-100 rounded-2xl text-[10px] sm:text-xs font-bold gap-0.5">
                <button
                  type="button"
                  onClick={() => { setActiveTab("credentials"); setError(""); setSuccessMessage(""); }}
                  className={`py-2 text-center rounded-xl transition-all cursor-pointer truncate ${activeTab === "credentials" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Parent ID
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("magic-link"); setError(""); setSuccessMessage(""); }}
                  className={`py-2 text-center rounded-xl transition-all cursor-pointer truncate ${activeTab === "magic-link" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Magic Link
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("school"); setError(""); setSuccessMessage(""); }}
                  className={`py-2 text-center rounded-xl transition-all cursor-pointer truncate ${activeTab === "school" ? "bg-white text-slate-900 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  School
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab("partner"); setError(""); setSuccessMessage(""); }}
                  className={`py-2 text-center rounded-xl transition-all cursor-pointer truncate ${activeTab === "partner" ? "bg-white text-indigo-950 shadow-sm font-bold" : "text-slate-500 hover:text-slate-800"}`}
                >
                  Partner
                </button>
              </div>
            )}

            {/* Forms rendering */}
            {showForgotId ? (
              <form onSubmit={handleForgotIdSubmit} className="space-y-4 animate-slide-up">
                <div className="space-y-1.5">
                  <label htmlFor="recoveryPhone" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Phone size={12} className="text-slate-400" /> Registered Mobile / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="recoveryPhone"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white transition-all font-semibold"
                    maxLength={10}
                    disabled={loading}
                  />
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={handleBackToLogin} disabled={loading} className="flex-1 py-3 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold">
                    Back to Login
                  </button>
                  <button type="submit" disabled={loading} className="flex-[2] py-3 bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
                    {loading ? "Recovering..." : "Send CNTS ID"} <ArrowRight size={14} />
                  </button>
                </div>
              </form>
            ) : activeTab === "credentials" ? (
              /* Tab 1: CNTS ID + DOB */
              <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="cntsId" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Key size={12} className="text-slate-400" />
                      CNTS Student ID
                    </label>
                    <input
                      type="text"
                      id="cntsId"
                      placeholder="e.g. CNTS260001"
                      value={cntsId}
                      onChange={(e) => setCntsId(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white font-semibold uppercase"
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="dob" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar size={12} className="text-slate-400" />
                      Student Date of Birth
                    </label>
                    <CustomDatePicker
                      id="dob"
                      value={dob}
                      onChange={setDob}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl outline-none focus:border-blue-800 focus:bg-white font-semibold"
                      disabled={loading}
                      align="top"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <button type="button" onClick={() => setShowForgotId(true)} className="text-[10px] text-blue-800 hover:underline font-bold">
                    Forgot CNTS ID?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In to Courage Account"} <ArrowRight size={14} />
                </button>
              </form>
            ) : activeTab === "magic-link" ? (
              /* Tab 2: Email Magic Link */
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Mail size={12} className="text-slate-400" /> Registered Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl font-semibold"
                    disabled={loading}
                  />
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MessageSquare size={10} className="text-emerald-500 animate-pulse" />
                    We will email you a secure login link.
                  </p>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
                  {loading ? "Sending link..." : "Send Login Link"} <ArrowRight size={14} />
                </button>
              </form>
            ) : activeTab === "school" ? (
              /* Tab 3: School Login */
              <form onSubmit={handleSchoolLogin} className="space-y-4 animate-slide-up">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="schoolCode" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <School size={12} className="text-slate-400" /> School Access Code
                    </label>
                    <input
                      type="text"
                      id="schoolCode"
                      placeholder="e.g. CNTS-DEL-1234"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl font-mono font-semibold"
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="schoolPin" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Lock size={12} className="text-slate-400" /> Secure 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      id="schoolPin"
                      placeholder="Enter 4-Digit PIN"
                      value={schoolPin}
                      onChange={(e) => setSchoolPin(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl font-mono font-semibold"
                      maxLength={4}
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5">
                  {loading ? "Authenticating..." : "Access School Portal"} <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              /* Tab 4: Partner Login (LAST TAB - EMAIL/MOBILE + PASSWORD) */
              <form onSubmit={handlePartnerLogin} className="space-y-4 animate-slide-up">
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Mail size={12} className="text-slate-400" />
                      Registered Email or Mobile Number *
                    </label>
                    <input
                      type="text"
                      placeholder="creator@domain.com or +91 98765 43210"
                      value={partnerIdentity}
                      onChange={(e) => setPartnerIdentity(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl font-medium focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Lock size={12} className="text-slate-400" />
                      Password / Secret PIN *
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={partnerPassword}
                      onChange={(e) => setPartnerPassword(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 text-sm rounded-xl font-medium focus:ring-2 focus:ring-indigo-600"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In to Partner Portal"} <ArrowRight size={14} />
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Want to become a Courage Partner?{" "}
                  <Link href="/partners/apply" className="text-indigo-600 font-bold hover:underline">
                    Apply Here
                  </Link>
                </p>
              </form>
            )}

            {/* Help / Register link */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <HelpCircle size={12} /> Don&apos;t have a CNTS registration yet?{" "}
                <Link href="/register" className="text-blue-800 font-bold hover:underline">
                  Register Now
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DUAL-ROLE / MULTI-ROLE PERSONA WORKSPACE SELECTOR MODAL */}
      {showPersonaSelector && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-slide-up">
            
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Multiple Portal Workspaces Available
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Welcome Back, {userRoles.userName}!
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select which workspace you would like to enter today:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* Option 0: Admin Control Center (If Admin role present) */}
              {userRoles.isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  className="p-4 rounded-2xl border-2 border-slate-900 bg-[#0F172A] text-white hover:bg-slate-800 transition-all text-left flex items-center gap-4 cursor-pointer group shadow-lg"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shrink-0">
                    <ShieldCheck className="w-6 h-6 text-slate-950" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm">
                        Admin Control Center
                      </h4>
                      <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                        System Admin
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Manage platform registrations, audit logs, finance & creator payouts.
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-all" />
                </button>
              )}

              {/* Option 1: Parent & Student Dashboard */}
              <button
                onClick={() => router.push('/dashboard')}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                  <Users className="w-6 h-6 text-indigo-700 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-900">
                    Parent & Student Dashboard
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage enrolled children, download CNTS 2026 admit cards & view test results.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 2: Courage Partner & Creator Workspace */}
              <button
                onClick={() => router.push('/partners?view=workspace')}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                  <Megaphone className="w-6 h-6 text-amber-900 group-hover:text-amber-950 transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-950">
                      Courage Creator & Partner Workspace
                    </h4>
                    <span className="text-[10px] font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Referral code: <strong className="font-mono text-indigo-900">{userRoles.referralCode || 'CNTSJN'}</strong> • Access AI Studio & Payouts.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </button>

              {/* Option 3: School Partner Workspace Dashboard */}
              <button
                onClick={() => { window.location.href = '/dashboard/school'; }}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-all text-left flex items-center gap-4 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                  <School className="w-6 h-6 text-blue-700 group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-900">
                      School Partner Workspace
                    </h4>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      School Dashboard
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage school student registrations, seat quota, admit cards & analytics.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            <div className="pt-2 text-center border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                You can switch between portals anytime from your account dropdown.
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
