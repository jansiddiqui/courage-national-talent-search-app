"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  Check, 
  AlertCircle, 
  HelpCircle, 
  School,
  Building,
  User,
  BookOpen,
  ArrowRight,
  Lightbulb
} from "lucide-react";
import Image from "next/image";
import { saveContactMessage } from "@/services/supabaseService";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface ContactFormData {
  name: string;
  email: string;
  whatsapp_number: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    whatsapp_number: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validateField = (name: keyof ContactFormData, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Full name is required";
        if (value.trim().length < 3) return "Name must be at least 3 characters";
        return "";

      case "email":
        if (!value.trim()) return "Email address is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return "Enter a valid email address";
        return "";

      case "whatsapp_number":
        if (!value) return "WhatsApp number is required";
        if (!/^[6-9]\d{9}$/.test(value)) {
          return "Enter a valid 10-digit Indian WhatsApp number (should start with 6-9)";
        }
        return "";

      case "subject":
        if (!value) return "Please select a subject";
        return "";

      case "message":
        if (!value.trim()) return "Message content is required";
        if (value.trim().length < 10) return "Message must be at least 10 characters";
        return "";

      default:
        return "";
    }
  };

  const handleInputChange = (name: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (name: keyof ContactFormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const errorMsg = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      const field = key as keyof ContactFormData;
      const errorMsg = validateField(field, formData[field]);
      if (errorMsg) {
        newErrors[field] = errorMsg;
        isValid = false;
      }
      setTouched(prev => ({ ...prev, [field]: true }));
    });

    setErrors(newErrors);

    if (isValid) {
      setIsSubmitting(true);
      setSubmitError("");
      try {
        const success = await saveContactMessage({
          name: formData.name,
          email: formData.email,
          phone: formData.whatsapp_number,
          subject: formData.subject,
          message: formData.message,
        });

        if (success) {
          setSubmitSuccess(true);
          setFormData({
            name: "",
            email: "",
            whatsapp_number: "",
            subject: "",
            message: "",
          });
          setTouched({});
        } else {
          setSubmitError("Failed to deliver your message. Please try again.");
        }
      } catch (err) {
        console.error("Contact message submission failed:", err);
        setSubmitError("An unexpected network error occurred. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFF]">
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-36 pb-20 md:pb-28 px-6 text-center">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-3xl mx-auto space-y-6 relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
            <Mail size={12} className="text-amber-400" />
            <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">
              Contact Us
            </span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            How can we <span className="text-blue-400">help you</span>?
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Have questions about CNTS registrations, diagnostic parameters, or school partnerships? Get in touch with our team.
          </p>
        </div>
      </section>

      {/* Main Content Body */}
      <div className="max-w-5xl mx-auto py-20 px-6 animate-slide-up">
        
        {/* Main Grid */}
        <div className="grid md:grid-cols-5 gap-8 items-start">
          
          {/* Left: Contact Info & Teasers (3 Columns on medium+) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Quick Contact Links */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-base">Direct Channels</h3>
              
              <div className="space-y-3">
                {/* Email Support */}
                <a 
                  href="mailto:support@thecouragelibrary.com"
                  className="flex items-start gap-3 p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-750 shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Support</span>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-850 transition-colors">support@thecouragelibrary.com</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Response within 24 hours</p>
                  </div>
                </a>

              </div>
            </div>

            {/* School Coordinator Teaser */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-md border border-slate-950 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                  <School size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-white text-base">For School Partners</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Interested in conducting the Courage National Talent Search diagnostic at your school? We offer custom coordination, offline OMR options, and school-wide comparison matrices.
                  </p>
                </div>
                <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5 rounded-lg inline-block">
                  <span className="flex items-center"><Lightbulb size={12} className="text-amber-500 mr-1" /> Select &quot;School Partnership Inquiry&quot; in the form</span>
                </p>
              </div>
            </div>

            {/* Quick FAQs shortcuts */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-slate-800 text-base flex items-center gap-1.5">
                <HelpCircle size={16} className="text-slate-400" />
                Quick Answers
              </h3>

              <div className="space-y-3.5 text-xs text-slate-500 leading-normal">
                <div>
                  <h4 className="font-bold text-slate-700">Who can participate?</h4>
                  <p className="mt-0.5">Students studying in Classes 5, 6, 7, and 8 from any recognized board in India.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-700">What is the exam format?</h4>
                  <p className="mt-0.5">A 2.5-hour online diagnostic evaluation covering Logical Reasoning, Mathematics, Language, and Critical Thinking.</p>
                </div>
                <Link 
                  href="/#faq"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-800 hover:text-blue-700 group mt-1"
                >
                  View All FAQs
                  <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right: Contact Form Card (3 Columns) */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-md relative overflow-hidden min-h-[450px] flex flex-col justify-center">
              
              {/* Submission loading spinner overlay */}
              {isSubmitting && (
                <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-slate-600 mt-3">Sending inquiry...</p>
                </div>
              )}

              {/* Success Screen */}
              {submitSuccess ? (
                <div className="text-center py-8 space-y-6 flex flex-col items-center animate-slide-up">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-25 scale-125" />
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-sm relative z-10">
                      <Check size={28} className="stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-display font-bold text-2xl text-slate-900">Message Sent!</h3>
                    <p className="text-slate-500 text-xs max-w-sm mx-auto leading-normal">
                      Thank you for contacting us. A CNTS advisor will review your message and get in touch with you shortly on WhatsApp or your registered email address.
                    </p>
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Send Another Message
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-2.5 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-850/10 cursor-pointer"
                    >
                      Back to Home
                    </Link>
                  </div>
                </div>
              ) : (
                /* The Contact Form */
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div className="space-y-1.5">
                    <h3 className="font-display font-bold text-lg text-slate-800">Send an Inquiry</h3>
                    <p className="text-slate-400 text-xs">Fill out the form below. We respond to all inquiries within 24 hours.</p>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2.5 text-xs text-red-800 animate-slide-up">
                      <AlertCircle className="shrink-0 text-red-650" size={14} />
                      <p className="font-semibold">{submitError}</p>
                    </div>
                  )}

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <User size={12} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      onBlur={() => handleBlur("name")}
                      placeholder="e.g. Anand Sen"
                      className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs outline-none transition-all duration-200 ${
                        touched.name && errors.name
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.name && !!errors.name}
                    />
                    {touched.name && errors.name && (
                      <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Grid for Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1">
                      <label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Mail size={12} className="text-slate-400" /> Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        onBlur={() => handleBlur("email")}
                        placeholder="parent@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs outline-none transition-all duration-200 ${
                          touched.email && errors.email
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.email && !!errors.email}
                      />
                      {touched.email && errors.email && (
                        <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>
                      )}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                      <label htmlFor="whatsapp_number" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        <Phone size={12} className="text-slate-400" /> WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                          +91
                        </div>
                        <input
                          type="tel"
                          id="whatsapp_number"
                          value={formData.whatsapp_number}
                          onChange={(e) => handleInputChange("whatsapp_number", e.target.value.replace(/\D/g, "").slice(0, 10))}
                          onBlur={() => handleBlur("whatsapp_number")}
                          placeholder="9876543210"
                          className={`w-full pl-11 pr-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs outline-none transition-all duration-200 ${
                            touched.whatsapp_number && errors.whatsapp_number
                              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                              : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                          }`}
                          maxLength={10}
                          aria-invalid={touched.whatsapp_number && !!errors.whatsapp_number}
                        />
                      </div>
                      {touched.whatsapp_number && errors.whatsapp_number && (
                        <p className="text-[10px] text-red-500 font-medium">{errors.whatsapp_number}</p>
                      )}
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className="space-y-1">
                    <label htmlFor="subject" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Building size={12} className="text-slate-400" /> Subject / Inquiry Type <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        onBlur={() => handleBlur("subject")}
                        className={`w-full px-4 py-2.5 pr-10 rounded-xl border bg-slate-50/50 text-xs outline-none appearance-none transition-all duration-200 ${
                          touched.subject && errors.subject
                            ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                            : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                        }`}
                        aria-invalid={touched.subject && !!errors.subject}
                      >
                        <option value="">Select Topic</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="School Partnership Inquiry">School Partnership Inquiry</option>
                        <option value="Registration Support">Registration Support</option>
                        <option value="Feedback / Suggestions">Feedback / Suggestions</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                        ▼
                      </div>
                    </div>
                    {touched.subject && errors.subject && (
                      <p className="text-[10px] text-red-500 font-medium">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="space-y-1">
                    <label htmlFor="message" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <BookOpen size={12} className="text-slate-400" /> Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      onBlur={() => handleBlur("message")}
                      placeholder="Tell us what you need help with..."
                      className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50/50 text-xs outline-none resize-none transition-all duration-200 ${
                        touched.message && errors.message
                          ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                          : "border-slate-200 focus:border-blue-800 focus:bg-white focus:ring-4 focus:ring-blue-800/10"
                      }`}
                      aria-invalid={touched.message && !!errors.message}
                    />
                    {touched.message && errors.message && (
                      <p className="text-[10px] text-red-500 font-medium">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-800 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-850/10 hover:shadow-blue-750/20 cursor-pointer text-center"
                  >
                    Send Message
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      <Footer />
    </main>
  );
}
