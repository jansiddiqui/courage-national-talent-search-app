/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Building, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { saveContactMessage } from "@/services/supabaseService";

export interface SchoolFormData {
  schoolName: string;
  cityState: string;
  schoolBoard: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  studentStrength: string;
  message: string;
}

export default function InquiryForm() {
  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: "",
    cityState: "",
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
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentError, setConsentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (name: keyof SchoolFormData, value: string): string => {
    switch (name) {
      case "schoolName":
        if (!value.trim()) return "Official school name is required";
        if (value.trim().length < 2) return "Please enter at least 2 characters";
        return "";
      case "cityState":
        if (!value.trim()) return "City and State are required";
        if (value.trim().length < 2) return "Please enter city and state (e.g., Jaipur, Rajasthan)";
        return "";
      case "schoolBoard":
        if (!value) return "Please select an affiliation board";
        return "";
      case "name":
        if (!value.trim()) return "Contact name is required";
        if (value.trim().length < 2) return "Name must be at least 2 characters";
        return "";
      case "email":
        if (!value.trim()) return "Official email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Enter a valid email address";
        return "";
      case "phone":
        if (!value.trim()) return "Phone number is required";
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[1-9]\d{5,11}$|^[0-9\+\-\s\(\)]{8,15}$/;
        if (!phoneRegex.test(value.trim())) {
          return "Enter a valid mobile or landline number with STD code";
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

    const newErrors: Partial<Record<keyof SchoolFormData, string>> = {};
    let isValid = true;

    (["schoolName", "cityState", "schoolBoard", "name", "email", "phone"] as Array<keyof SchoolFormData>).forEach((key) => {
      const errorMsg = validateField(key, formData[key]);
      if (errorMsg) {
        newErrors[key] = errorMsg;
        isValid = false;
      }
    });

    if (!consentGiven) {
      setConsentError("Please provide consent to proceed with partnership inquiry.");
      isValid = false;
    } else {
      setConsentError("");
    }

    setErrors(newErrors);
    setTouched(
      (Object.keys(formData) as Array<keyof SchoolFormData>).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      )
    );

    if (!isValid) {
      setSubmitError("Please correct the validation errors below.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const compiledMessage = `
--- School Partnership Request (Founding Edition) ---
School Name: ${formData.schoolName}
City & State: ${formData.cityState}
School Board: ${formData.schoolBoard || "Not specified"}
Coordinator Name: ${formData.name}
Designation: ${formData.designation}
Estimated Candidate Pool: ${formData.studentStrength || "Not specified"}
Remarks: ${formData.message || "None provided"}
Consent Given: Yes (DPDP Compliant)
      `.trim();

      const success = await saveContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `School Partnership Request: ${formData.schoolName} (${formData.cityState})`,
        message: compiledMessage
      });

      if (!success) {
        throw new Error("Failed to submit inquiry to database.");
      }

      setSubmitSuccess(true);
      setFormData({
        schoolName: "",
        cityState: "",
        schoolBoard: "",
        name: "",
        designation: "Principal",
        email: "",
        phone: "",
        studentStrength: "",
        message: "",
      });
      setConsentGiven(false);
      setTouched({});
    } catch (err: any) {
      console.error("School lead submission error:", err);
      setSubmitError("Submission encountered a network issue. Please call us directly at +91 83606 03173 or email partners@thecouragelibrary.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="inquiry-form" className="bg-white border-t-4 border-t-blue-600 border-x border-b border-slate-200 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden scroll-mt-28">
      <div className="text-left mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Building size={22} className="text-blue-600 shrink-0" />
          <h2 className="text-xl font-display font-bold text-slate-900">Partner School Inquiry</h2>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed">
          Submit your school details to receive the official prospectus kit and schedule an orientation briefing.
        </p>
      </div>

      {submitSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center py-8 text-emerald-900">
          <CheckCircle2 size={44} className="text-emerald-500 mx-auto mb-3" />
          <h3 className="font-display font-bold text-base mb-1">Inquiry Registered Successfully!</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed mb-4">
            Thank you for expressing interest in CNTS 2026. An Academic Relationship Officer will contact you within 24 business hours.
          </p>
          <button
            onClick={() => setSubmitSuccess(false)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors shadow-sm min-h-[44px]"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2.5 text-red-900 text-xs">
              <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p>{submitError}</p>
            </div>
          )}

          {/* Official School Name */}
          <div className="space-y-1">
            <label htmlFor="schoolName" className="text-xs font-semibold text-slate-700">Official School Name *</label>
            <input
              id="schoolName"
              type="text"
              required
              value={formData.schoolName}
              onChange={(e) => handleInputChange("schoolName", e.target.value)}
              onBlur={() => handleBlur("schoolName")}
              placeholder="e.g., Delhi Public School, R.K. Puram"
              className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                touched.schoolName && errors.schoolName 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {touched.schoolName && errors.schoolName && (
              <p className="text-[11px] text-red-500 font-medium">{errors.schoolName}</p>
            )}
          </div>

          {/* City & State */}
          <div className="space-y-1">
            <label htmlFor="cityState" className="text-xs font-semibold text-slate-700">City &amp; State *</label>
            <input
              id="cityState"
              type="text"
              required
              value={formData.cityState}
              onChange={(e) => handleInputChange("cityState", e.target.value)}
              onBlur={() => handleBlur("cityState")}
              placeholder="e.g., Jaipur, Rajasthan"
              className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                touched.cityState && errors.cityState 
                  ? "border-red-300 focus:border-red-500" 
                  : "border-slate-200 focus:border-blue-600"
              }`}
            />
            {touched.cityState && errors.cityState && (
              <p className="text-[11px] text-red-500 font-medium">{errors.cityState}</p>
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
              className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-all ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
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
              <label htmlFor="designation" className="text-xs font-semibold text-slate-700">Your Designation</label>
              <select
                id="designation"
                value={formData.designation}
                onChange={(e) => handleInputChange("designation", e.target.value)}
                className="w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">Official Email *</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
                placeholder="e.g., principal@school.com"
                className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
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
                placeholder="+91 XXXXX XXXXX"
                className={`w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] bg-slate-50/50 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  touched.phone && errors.phone 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-200 focus:border-blue-600"
                }`}
              />
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
              className="w-full text-base py-2.5 px-4 rounded-xl border min-h-[44px] border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <option value="">Select range...</option>
              <option value="Under 100">Under 100</option>
              <option value="100 - 300">100 - 300</option>
              <option value="300 - 600">300 - 600</option>
              <option value="600+">600+</option>
            </select>
          </div>

          {/* DPDP Act Explicit Consent Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 shrink-0"
              />
              <span className="leading-tight">
                I consent to Courage Library contacting me regarding CNTS 2026 school partnerships under DPDP Act compliance. Read our <Link href="/privacy" target="_blank" className="text-blue-600 underline">Privacy Policy</Link>.
              </span>
            </label>
            {consentError && (
              <p className="text-[11px] text-red-500 font-medium mt-1">{consentError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting Partnership Request...
              </>
            ) : (
              <>
                Submit Partnership Request <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
