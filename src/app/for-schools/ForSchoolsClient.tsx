/* eslint-disable @typescript-eslint/no-explicit-any, react/no-unescaped-entities */
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building, 
  Award, 
  BarChart3, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Mail, 
  AlertCircle,
  FileText,
  PhoneCall,
  Rocket,
  Lock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { saveContactMessage } from "@/services/supabaseService";
import { BlogPost } from "@/lib/blog";

interface SchoolFormData {
  schoolName: string;
  schoolBoard: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  studentStrength: string;
  message: string;
}

export default function ForSchoolsPage({ initialPosts = [] }: { initialPosts?: BlogPost[] }) {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: "",
    schoolBoard: "",
    name: "",
    designation: "Principal",
    email: "",
    phone: "",
    studentStrength: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SchoolFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof SchoolFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (name: keyof SchoolFormData, value: string): string => {
    switch (name) {
      case "schoolName":
        if (!value.trim()) return "School name is required";
        if (value.trim().length < 2) return "Please enter at least 2 characters";
        return "";
      case "schoolBoard":
        if (!value) return "Please select an affiliation board";
        return "";
      case "name":
        if (!value.trim()) return "Contact name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        // Accepts 10-digit mobile, landlines with STD codes (e.g. 011-26123456), and +91 formatted numbers
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[1-9]\d{5,11}$|^[0-9\+\-\s\(\)]{8,15}$/;
        if (!phoneRegex.test(value.trim())) {
          return "Enter a valid phone or landline number";
        }
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (name: keyof SchoolFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: keyof SchoolFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Partial<Record<keyof SchoolFormData, string>> = {};
    let isValid = true;

    (["schoolName", "schoolBoard", "name", "email", "phone"] as Array<keyof SchoolFormData>).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(
      (Object.keys(formData) as Array<keyof SchoolFormData>).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );

    if (!isValid) {
      setSubmitError("Please correct the validation errors in the form.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const compiledMessage = `
--- School Partnership Request ---
School Name: ${formData.schoolName}
School Board: ${formData.schoolBoard || "Not specified"}
Coordinator Name: ${formData.name}
Designation: ${formData.designation}
Estimated Candidate Pool: ${formData.studentStrength || "Not specified"}
Remarks: ${formData.message || "None provided"}
      `.trim();

      const success = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: "School Partnership Inquiry (Founding Edition)",
        message: compiledMessage
      });

      if (!success) {
        throw new Error("Failed to write submission. Database returned error.");
      }

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        schoolName: "",
        schoolBoard: "",
        name: "",
        designation: "Principal",
        email: "",
        phone: "",
        studentStrength: "",
        message: "",
      });
      setTouched({});
    } catch (err: any) {
      console.error("School lead submission failed:", err);
      setSubmitError("Failed to submit inquiry. Please try again or email us directly at partners@thecouragelibrary.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-16 md:pb-0">
      <Navbar theme="light" />

      {/* Split-Screen Hero Section (Above Fold on Desktop) */}
      <section className="pt-32 pb-16 px-6 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (60% Desktop - lg:col-span-7) */}
            <div className="lg:col-span-7 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-6 tracking-wider shadow-sm">
                🔥 Founding Partner Cohort — Limited to 100 Schools
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-slate-900 mb-6 leading-tight">
                Discover Potential Beyond Marks: CNTS 2026 Founding Edition
              </h1>

              <p className="text-slate-600 text-base md:text-lg mb-2 font-medium leading-relaxed">
                Empower your students in Classes 5–8 with conceptual cognitive diagnostics. Move beyond rote memorization and benchmark academic skills against state and national standards.
              </p>

              <p className="text-blue-700 text-sm font-semibold mb-6">
                Join the inaugural cohort of schools redefining student assessment.
              </p>

              {/* Mobile Hero CTA Button (Only visible < lg) */}
              <a
                href="#inquiry-form"
                className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base mb-8 flex items-center justify-center gap-2 shadow-lg transition-all min-h-[48px]"
              >
                👉 Request Founding Partner Kit
              </a>

              {/* Desktop Partnership Details Link (Only visible >= lg) */}
              <div className="hidden lg:flex items-center gap-4 mb-8">
                <a
                  href="#features-section"
                  className="bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold py-3 px-6 rounded-xl transition-all text-sm flex items-center gap-2 min-h-[44px]"
                >
                  View Partnership Details ↓
                </a>
              </div>

              {/* 3-Step Evaluation Roadmap Timeline */}
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-5 md:p-6 mt-4">
                <div className="mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700">Evaluation Roadmap</span>
                  <h3 className="text-sm md:text-base font-display font-bold text-slate-900 mt-0.5">
                    Simple 3-Step School Evaluation Process
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2 shrink-0">
                      <FileText size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">Instant Prospectus</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Digital brochure &amp; sample papers</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2 shrink-0">
                      <PhoneCall size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">15-Min Call</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Briefing with Academic Director</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-sm flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-2 shrink-0">
                      <Rocket size={16} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-xs mb-0.5">Zero-Cost Setup</h4>
                    <p className="text-slate-500 text-[10px] leading-tight">Online lab hosting &amp; roll numbers</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (40% Desktop - lg:col-span-5) - Premium Form Card */}
            <div className="lg:col-span-5 w-full">
              <div id="inquiry-form" className="bg-white border-t-4 border-t-blue-600 border-x border-b border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden scroll-mt-28">
                
                <div className="text-left mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Building size={24} className="text-blue-600 shrink-0" />
                    <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">Partner School Inquiry</h2>
                  </div>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Submit your school details below to receive digital brochures, sample test papers, and onboarding guidelines.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center py-10 text-emerald-900">
                    <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="font-display font-bold text-base mb-1">Inquiry Submitted Successfully!</h3>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                      Thank you for your interest in the Courage National Talent Search. Our representative has received your request and will call/email you shortly.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm min-h-[44px]"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-900 text-xs">
                        <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <p>{submitError}</p>
                      </div>
                    )}

                    {/* School Name */}
                    <div className="space-y-1">
                      <label htmlFor="schoolName" className="text-xs font-semibold text-slate-700">Official School Name *</label>
                      <input
                        id="schoolName"
                        type="text"
                        required
                        value={formData.schoolName}
                        onChange={(e) => handleInputChange("schoolName", e.target.value)}
                        onBlur={() => handleBlur("schoolName")}
                        placeholder="e.g., Delhi Public School or DPS"
                        className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none ${
                          touched.schoolName && errors.schoolName 
                            ? "border-red-300 focus:border-red-500" 
                            : "border-slate-200 focus:border-blue-600"
                        }`}
                      />
                      {touched.schoolName && errors.schoolName && (
                        <p className="text-[11px] text-red-500 font-medium">{errors.schoolName}</p>
                      )}
                    </div>

                    {/* School Board */}
                    <div className="space-y-1">
                      <label htmlFor="schoolBoard" className="text-xs font-semibold text-slate-700">Affiliation Board *</label>
                      <select
                        id="schoolBoard"
                        required
                        value={formData.schoolBoard}
                        onChange={(e) => handleInputChange("schoolBoard", e.target.value)}
                        onBlur={() => handleBlur("schoolBoard")}
                        className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white outline-none transition-all ${
                          touched.schoolBoard && errors.schoolBoard 
                            ? "border-red-300 focus:border-red-500" 
                            : "border-slate-200 focus:border-blue-600"
                        }`}
                      >
                        <option value="" disabled>Select Affiliation Board...</option>
                        <option value="CBSE">CBSE</option>
                        <option value="ICSE">ICSE / ISC</option>
                        <option value="State Board">State Board</option>
                        <option value="IB">IB</option>
                        <option value="IGCSE / Cambridge">IGCSE / Cambridge</option>
                        <option value="Other">Other</option>
                      </select>
                      {touched.schoolBoard && errors.schoolBoard && (
                        <p className="text-[11px] text-red-500 font-medium">{errors.schoolBoard}</p>
                      )}
                    </div>

                    {/* Contact Person Name & Designation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-semibold text-slate-700">Your Full Name *</label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          onBlur={() => handleBlur("name")}
                          placeholder="e.g., Mrs. Shalini Sen"
                          className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none ${
                            touched.name && errors.name 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-slate-200 focus:border-blue-600"
                          }`}
                        />
                        {touched.name && errors.name && (
                          <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="designation" className="text-xs font-semibold text-slate-700">Your Designation *</label>
                        <select
                          id="designation"
                          value={formData.designation}
                          onChange={(e) => handleInputChange("designation", e.target.value)}
                          className="w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
                        >
                          <option value="Principal">Principal</option>
                          <option value="Vice Principal">Vice Principal</option>
                          <option value="Academic Coordinator">Academic Coordinator</option>
                          <option value="Director / Trustee">School Director / Trustee</option>
                          <option value="Teacher">Teacher</option>
                        </select>
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-semibold text-slate-700">Official Email *</label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          placeholder="e.g., principal@yourschool.com"
                          className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none ${
                            touched.email && errors.email 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-slate-200 focus:border-blue-600"
                          }`}
                        />
                        {touched.email && errors.email && (
                          <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="phone" className="text-xs font-semibold text-slate-700">Contact Number *</label>
                        <input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          onBlur={() => handleBlur("phone")}
                          placeholder="+91 XXXXX XXXXX or Landline"
                          className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none ${
                            touched.phone && errors.phone 
                              ? "border-red-300 focus:border-red-500" 
                              : "border-slate-200 focus:border-blue-600"
                          }`}
                        />
                        <p className="text-[11px] text-slate-500">Landline with STD code or mobile number</p>
                        {touched.phone && errors.phone && (
                          <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Student Strength */}
                    <div className="space-y-1">
                      <label htmlFor="studentStrength" className="text-xs font-semibold text-slate-700">Approximate Student Strength (Classes 5-8) (Optional)</label>
                      <select
                        id="studentStrength"
                        value={formData.studentStrength}
                        onChange={(e) => handleInputChange("studentStrength", e.target.value)}
                        className="w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
                      >
                        <option value="">Select range...</option>
                        <option value="Under 100">Under 100</option>
                        <option value="100 - 300">100 - 300</option>
                        <option value="300 - 600">300 - 600</option>
                        <option value="600+">600+</option>
                      </select>
                      <p className="text-[11px] text-slate-500">Estimate is fine — exact numbers not required</p>
                    </div>

                    {/* Remarks/Message */}
                    <div className="space-y-1">
                      <label htmlFor="message" className="text-xs font-semibold text-slate-700">Message / Custom Requirements (Optional)</label>
                      <textarea
                        id="message"
                        rows={2}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Optional: Preferred exam dates, bulk sponsorship needs, or questions."
                        className="w-full text-base py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none resize-none transition-all"
                      />
                    </div>

                    {/* Privacy Note Above Button */}
                    <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl my-2">
                      <Lock size={14} className="shrink-0 text-emerald-600" />
                      <span>Your data is secure &amp; DPDP compliant</span>
                    </div>

                    {/* Upgraded Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-transform duration-200 text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting Inquiry...
                        </>
                      ) : (
                        <>
                          Submit Inquiry <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="bg-slate-100/90 border-b border-slate-200/80 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-4 md:gap-10 text-xs md:text-sm font-semibold text-slate-700 text-center">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-blue-600 shrink-0" /> Trusted by 50+ Educators
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-blue-600 shrink-0" /> NEP 2020 Aligned
          </span>
          <span className="hidden md:inline text-slate-300">|</span>
          <span className="flex items-center gap-2">
            <Award size={16} className="text-blue-600 shrink-0" /> Cognitive Science Backed
          </span>
        </div>
      </section>

      {/* Features Grid (Positioned Directly Below Hero/Form Section) */}
      <section id="features-section" className="py-16 max-w-7xl mx-auto px-6 scroll-mt-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Why CNTS for Institutions</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-2">
            The Gold Standard in Student Skill Mapping
          </h2>
          <p className="text-slate-500 text-sm mt-3">
            Hosting the CNTS assessment provides your institution with invaluable insights, helping you align teaching strategies to bridge conceptual gaps.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              Icon: BarChart3,
              color: "text-blue-600 bg-blue-50 border-blue-100",
              title: "Institutional Insights",
              desc: "Receive customized class-wise and section-wise diagnostic summaries highlighting specific academic strengths and improvement scopes."
            },
            {
              Icon: Award,
              color: "text-emerald-600 bg-emerald-50 border-emerald-100",
              title: "National Benchmarking",
              desc: "Compare your school's average performance against state-wide and national metrics to evaluate your curriculum depth."
            },
            {
              Icon: MapPin,
              color: "text-amber-600 bg-amber-50 border-amber-100",
              title: "Flexible Online Hosting",
              desc: "Host the online assessment right in your computer labs or classrooms. We provide complete institutional setups and technical guidelines at zero cost."
            },
            {
              Icon: ShieldCheck,
              color: "text-indigo-600 bg-indigo-50 border-indigo-100",
              title: "Build Parent Trust",
              desc: "Show parents that your school prioritizes true cognitive intelligence, critical reasoning, and real understanding over standard rote memorization."
            }
          ].map((feat, idx) => (
            <div 
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col items-start"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-5 ${feat.color}`}>
                <feat.Icon size={22} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-base mb-2">{feat.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Partnership Statement Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-16 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/5" />
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Custom School Partnership Plans</h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
            We understand that schools have diverse student counts, calendars, and structural setups. Whether you want to integrate CNTS as an annual diagnostic assessment, secure bulk sponsored entries for your toppers, or establish a regional test center, our academic partnerships team is here to coordinate.
          </p>
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" /> Dedicated Relationship Officers
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" /> Complete Testing Logistics Provided
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-emerald-400" /> Custom School Topper Medals & Kits
            </span>
          </div>
        </div>
      </section>

      {/* Alternative Support Options */}
      <section className="bg-slate-100 border-t border-slate-200 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6">Contact Our Academic Partnerships Team</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-xs text-slate-600">
            <a
              href="mailto:partners@thecouragelibrary.com"
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl py-4 px-6 hover:shadow-sm transition-all w-full md:w-auto min-h-[44px]"
            >
              <Mail size={16} className="text-blue-500" />
              <span>Email: <strong>partners@thecouragelibrary.com</strong></span>
            </a>
          </div>
        </div>
      </section>

      {/* School Insights & Resources */}
      {initialPosts && initialPosts.length > 0 && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-display font-black text-2xl text-slate-900 mb-8 text-center">
              School Insights &amp; Assessment Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-slate-50 border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-550 text-xs leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <span className="text-blue-600 text-xs font-semibold group-hover:underline inline-flex items-center gap-1 mt-4">
                    Read Article &rarr;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 z-50 md:hidden shadow-lg">
        <a
          href="#inquiry-form"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold min-h-[44px] rounded-xl text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          Request Founding Info Kit →
        </a>
      </div>

      <Footer />
    </div>
  );
}


