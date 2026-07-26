/* eslint-disable react/no-unescaped-entities */
"use client";

import { FileText, Download, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OfficialDocumentsVault() {
  const documents = [
    {
      id: "INV-01",
      refCode: "Ref: CNTS/2026/INV-01",
      title: "Official School Invitation Letter",
      pages: "2 Pages · PDF (340 KB)",
      desc: "Formal invitation letter for School Principals, Academic Directors, and Management Trustees outlining CNTS 2026 participation.",
      badge: "Approved Document",
      downloadUrl: "#inquiry-form"
    },
    {
      id: "PROSP",
      refCode: "Ref: CNTS/2026/PROSP",
      title: "Institutional Prospectus 2026",
      pages: "12 Pages · PDF (1.8 MB)",
      desc: "Comprehensive program prospectus containing cognitive syllabus breakdown, assessment methodology, and sample diagnostic reports.",
      badge: "Version 1.0",
      downloadUrl: "#inquiry-form"
    },
    {
      id: "GUIDE",
      refCode: "Ref: CNTS/2026/GUIDE",
      title: "School Coordinator Handbook",
      pages: "6 Pages · PDF (850 KB)",
      desc: "Operational handbook detailing zero-strain computer lab configuration, candidate roll number generation, and scheduling.",
      badge: "Implementation Guide",
      downloadUrl: "#inquiry-form"
    },
    {
      id: "DECK",
      refCode: "Ref: CNTS/2026/DECK",
      title: "Board Briefing Presentation Deck",
      pages: "8 Slides · PPTX (2.4 MB)",
      desc: "Summary slide deck for presentation during School Management Trustee or Academic Committee evaluation meetings.",
      badge: "Leadership Brief",
      downloadUrl: "#inquiry-form"
    }
  ];

  return (
    <section id="official-documents" className="py-16 md:py-20 bg-slate-50 border-b border-slate-200 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-blue-700 mb-3">
            <FileText size={14} className="text-blue-600" /> Institutional Documentation
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-1">
            Official school partnership documents
          </h2>
          <p className="text-slate-600 text-sm md:text-base mt-2 leading-relaxed">
            Download complete documentation for school leadership, academic committees, and trustee review.
          </p>
        </div>

        {/* 4 Official Document Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                    {doc.refCode}
                  </span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase">
                    {doc.badge}
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 text-base mb-1.5">{doc.title}</h3>
                <p className="text-slate-500 text-xs mb-3">{doc.pages}</p>
                <p className="text-slate-600 text-xs leading-relaxed mb-5">{doc.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-700 font-semibold flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-blue-600" /> Official Release
                </span>
                <a
                  href={doc.downloadUrl}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors min-h-[38px]"
                >
                  <Download size={14} /> Request Document
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Human Reassurance Footnote */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-4 text-center max-w-2xl mx-auto shadow-sm flex items-center justify-center gap-2 text-xs text-slate-700 font-medium">
          <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
          <span>Need printed document copies dispatched to your school office? Email partners@thecouragelibrary.com</span>
        </div>

      </div>
    </section>
  );
}
