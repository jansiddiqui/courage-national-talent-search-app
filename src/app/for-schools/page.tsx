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
  Phone,
  AlertCircle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { saveContactMessage } from "@/services/supabaseService";

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

export default function ForSchoolsPage() {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: "",
    schoolBoard: "CBSE",
    name: "",
    designation: "Principal",
    email: "",
    phone: "",
    studentStrength: "100-200",
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
        if (value.trim().length < 5) return "Please enter the full official school name";
        return "";
      case "name":
        if (!value.trim()) return "Contact name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        return "";
      case "email":
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter a valid 10-digit mobile number (starts with 6-9)";
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

    // Validate all fields
    const newErrors: Partial<Record<keyof SchoolFormData, string>> = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof SchoolFormData>).forEach((key) => {
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
School Board: ${formData.schoolBoard}
Coordinator Name: ${formData.name}
Designation: ${formData.designation}
Estimated Candidate Pool: ${formData.studentStrength} students
Remarks: ${formData.message || "None provided"}
      `.trim();

      const success = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: "School Partnership Inquiry",
        message: compiledMessage
      });

      if (!success) {
        throw new Error("Failed to write submission. Database returned error.");
      }

      setSubmitSuccess(true);
      // Reset form
      setFormData({
        schoolName: "",
        schoolBoard: "CBSE",
        name: "",
        designation: "Principal",
        email: "",
        phone: "",
        studentStrength: "100-200",
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white pt-32 pb-20 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1e3a8a,transparent_60%)] opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#0f172a_100%)] opacity-80" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 mb-6 uppercase tracking-wider mx-auto">
            <Building size={12} /> Institutional Partnership Portal
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            Enable Talent Discovery in Your School
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Empower your students in Classes 5–8 with conceptual cognitive diagnostics. Move beyond rote memorization and benchmark academic skills against state and national standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#inquiry-form"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg text-sm flex items-center gap-2"
            >
              Partner with Us <ArrowRight size={16} />
            </a>
            <Link
              href="/why-cnts"
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-semibold py-3 px-8 rounded-xl transition-all text-sm"
            >
              Why CNTS?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
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
              title: "No-Cost Center Hosting",
              desc: "Host the OMR-based offline test right in your classrooms. We provide complete testing materials, guidelines, and OMR packets at zero cost."
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

      {/* Contact Form Section */}
      <section id="inquiry-form" className="py-20 max-w-3xl mx-auto px-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600" />
          
          <div className="text-center mb-8">
            <Building size={32} className="text-blue-600 mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900">Partner School Inquiry</h2>
            <p className="text-slate-500 text-xs mt-1">
              Submit your school details below. Our Academic Partnerships team will get in touch with you within 24 hours with brochures and guidelines.
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
                className="mt-6 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors shadow-sm"
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-900 text-xs">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p>{submitError}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-5">
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
                    placeholder="e.g., Delhi Public School"
                    className={`w-full text-xs py-3 px-4 rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-none ${
                      touched.schoolName && errors.schoolName 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {touched.schoolName && errors.schoolName && (
                    <p className="text-[10px] text-red-500 font-medium">{errors.schoolName}</p>
                  )}
                </div>

                {/* School Board */}
                <div className="space-y-1">
                  <label htmlFor="schoolBoard" className="text-xs font-semibold text-slate-700">Affiliation Board *</label>
                  <select
                    id="schoolBoard"
                    value={formData.schoolBoard}
                    onChange={(e) => handleInputChange("schoolBoard", e.target.value)}
                    className="w-full text-xs py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE / ISC</option>
                    <option value="State Board">State Board</option>
                    <option value="IB / Cambridge">IB / Cambridge</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Contact Person Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold text-slate-700">Coordinator/Contact Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleBlur("name")}
                    placeholder="e.g., Mrs. Shalini Sen"
                    className={`w-full text-xs py-3 px-4 rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-none ${
                      touched.name && errors.name 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {touched.name && errors.name && (
                    <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>
                  )}
                </div>

                {/* Designation */}
                <div className="space-y-1">
                  <label htmlFor="designation" className="text-xs font-semibold text-slate-700">Your Designation *</label>
                  <select
                    id="designation"
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    className="w-full text-xs py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
                  >
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Exam Coordinator">CNTS Exam Coordinator</option>
                    <option value="Academic Coordinator">Academic Coordinator</option>
                    <option value="Director / Trustee">School Director / Trustee</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700">Official Email *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="e.g., info@yourschool.com"
                    className={`w-full text-xs py-3 px-4 rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-none ${
                      touched.email && errors.email 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {touched.email && errors.email && (
                    <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-slate-700">Contact Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    placeholder="10-digit mobile number"
                    className={`w-full text-xs py-3 px-4 rounded-xl border bg-slate-50/50 focus:bg-white transition-all outline-none ${
                      touched.phone && errors.phone 
                        ? "border-red-300 focus:border-red-500" 
                        : "border-slate-200 focus:border-blue-600"
                    }`}
                  />
                  {touched.phone && errors.phone && (
                    <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Student Strength */}
              <div className="space-y-1">
                <label htmlFor="studentStrength" className="text-xs font-semibold text-slate-700">Estimated Candidate Pool (Classes 5-8) *</label>
                <select
                  id="studentStrength"
                  value={formData.studentStrength}
                  onChange={(e) => handleInputChange("studentStrength", e.target.value)}
                  className="w-full text-xs py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none"
                >
                  <option value="50-100">50 to 100 Students</option>
                  <option value="100-200">100 to 200 Students</option>
                  <option value="200-500">200 to 500 Students</option>
                  <option value="500+">More than 500 Students</option>
                </select>
              </div>

              {/* Remarks/Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-slate-700">Message / Custom Requirements</label>
                <textarea
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Tell us about preferred dates, bulk sponsorships, or request a visit by our team."
                  className="w-full text-xs py-3 px-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none resize-none transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    Submit Inquiry <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Alternative Support Options */}
      <section className="bg-slate-100 border-t border-slate-200 py-16 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="font-display font-bold text-slate-900 text-lg mb-6">Contact Our Academic Partnerships Team</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-xs text-slate-600">
            <a
              href="mailto:partners@thecouragelibrary.com"
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl py-4 px-6 hover:shadow-sm transition-all w-full md:w-auto"
            >
              <Mail size={16} className="text-blue-500" />
              <span>Email: <strong>partners@thecouragelibrary.com</strong></span>
            </a>
            <a
              href="tel:+911800000000"
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl py-4 px-6 hover:shadow-sm transition-all w-full md:w-auto"
            >
              <Phone size={16} className="text-emerald-500" />
              <span>Toll-Free: <strong>1800-XXX-XXXX</strong></span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
