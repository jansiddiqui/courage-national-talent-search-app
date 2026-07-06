import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Mail, Clock, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Data Deletion Request | Courage National Talent Search",
  description: "Request deletion of personal information associated with Courage National Talent Search (CNTS).",
};

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar theme="light" />

      {/* Hero section */}
      <div className="pt-36 pb-12 border-b border-slate-100 bg-white w-full shrink-0">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors mb-6 uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck size={12} className="text-emerald-500 fill-emerald-500 animate-pulse" />
              <span>Privacy & Data Protection</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 mb-3">
            Data Deletion Request
          </h1>
          <p className="text-slate-500 text-sm max-w-xl font-medium">
            Courage National Talent Search (CNTS) respects your privacy and provides a transparent process for requesting deletion of personal information stored within our systems.
          </p>
        </div>
      </div>

      {/* Main Document Layout */}
      <div className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 shadow-sm text-slate-600 text-sm leading-relaxed space-y-12">
          
          {/* Section 1: How to Request Deletion */}
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              How to Request Deletion
            </h2>
            <p>
              Parents, guardians, and registered users may request deletion of their personal information at any time by contacting the CNTS support team.
            </p>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6">
              <ol className="list-decimal pl-4 space-y-4 text-slate-700 font-medium">
                <li>Send an email to <strong>support@thecouragelibrary.com</strong></li>
                <li>
                  Use the subject line: <br/>
                  <span className="inline-block mt-1 bg-white border border-slate-200 px-3 py-1.5 rounded text-slate-900 font-bold shadow-sm">"Data Deletion Request"</span>
                </li>
                <li>
                  Include the following details:
                  <ul className="list-disc pl-5 mt-3 space-y-1.5 font-normal text-slate-600">
                    <li>Candidate Name</li>
                    <li>CNTS ID (if available)</li>
                    <li>Registered Email Address</li>
                    <li>Registered Mobile Number</li>
                  </ul>
                </li>
                <li className="pt-2 border-t border-blue-100/50">Our team will verify ownership of the account before processing the request.</li>
              </ol>
            </div>
          </section>

          {/* Section 2: Information Eligible for Deletion */}
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Information Eligible for Deletion
            </h2>
            
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" /> Parent Information
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>• Name</li>
                  <li>• Email Address</li>
                  <li>• Mobile Number</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-emerald-600" /> Candidate Information
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>• Candidate Name</li>
                  <li>• Class</li>
                  <li>• School Details</li>
                  <li>• State Information</li>
                </ul>
              </div>
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-purple-600" /> Portal Data
                </h3>
                <ul className="space-y-2 text-xs">
                  <li>• Registration Records</li>
                  <li>• Dashboard Access Records</li>
                  <li>• Communication Preferences</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Information That May Be Retained */}
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Information That May Be Retained
            </h2>
            <p>
              Certain information may be retained where required by applicable laws, accounting obligations, fraud prevention requirements, payment reconciliation records, dispute resolution processes, or regulatory compliance obligations.
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Payment transaction references</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Audit records</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Legal compliance records</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Security logs</li>
              </ul>
            </div>
          </section>

          {/* Section 4: Processing Timeline */}
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Deletion Timeline
            </h2>
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start text-xs font-semibold text-slate-600 space-y-2">
                  <div className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md w-full sm:w-auto text-center">Request Received</div>
                  <div className="text-slate-300 sm:ml-8 py-1">↓</div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md w-full sm:w-auto text-center">Identity Verification</div>
                  <div className="text-slate-300 sm:ml-8 py-1">↓</div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md w-full sm:w-auto text-center">Deletion Review</div>
                  <div className="text-slate-300 sm:ml-8 py-1">↓</div>
                  <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md w-full sm:w-auto text-center">Data Removal</div>
                  <div className="text-slate-300 sm:ml-8 py-1">↓</div>
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-md w-full sm:w-auto text-center">Confirmation Sent</div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-6 text-center w-full sm:w-64 shrink-0">
                  <Clock size={28} className="mx-auto text-blue-600 mb-3" />
                  <div className="text-[10px] uppercase tracking-widest text-blue-800 font-bold mb-2">Target Processing Time</div>
                  <div className="text-sm font-semibold text-slate-800 leading-snug">Within 30 days of successful verification.</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Contact Information */}
          <section className="space-y-5">
            <h2 className="text-xl md:text-2xl font-display font-bold text-slate-900 flex items-center gap-3">
              Need Assistance?
            </h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="space-y-3 text-sm">
                <div className="font-semibold text-slate-900 text-base">Courage National Talent Search (CNTS)</div>
                <div className="text-slate-500 flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  support@thecouragelibrary.com
                </div>
              </div>
              <a
                href="https://thecouragelibrary.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-sm shrink-0 text-sm"
              >
                Official Website
              </a>
            </div>
          </section>

          {/* Section 6: Legal Notice */}
          <section className="pt-10 border-t border-slate-100 space-y-4 text-xs text-slate-500">
            <h2 className="font-bold text-slate-700 uppercase tracking-wider mb-2">Legal Notice</h2>
            <p>
              This Data Deletion Policy applies to all CNTS services, registrations, parent portals, candidate records, and associated communication systems.
            </p>
            <p>
              CNTS reserves the right to retain information required for legal compliance, security investigations, dispute resolution, and financial recordkeeping as permitted under applicable laws.
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
