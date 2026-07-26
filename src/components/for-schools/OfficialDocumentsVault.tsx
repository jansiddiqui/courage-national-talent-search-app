"use client";

import { Download } from "lucide-react";

export default function OfficialDocumentsVault() {
  const documents = [
    {
      ref: "Ref: CNTS/2026/INV-01",
      title: "Official Invitation Letter",
      meta: "2 Pages · PDF (340 KB)",
      desc: "Formal invitation letter for School Principals & Management."
    },
    {
      ref: "Ref: CNTS/2026/PROSP",
      title: "Institutional Prospectus",
      meta: "12 Pages · PDF (1.2 MB)",
      desc: "Complete program syllabus, diagnostic parameters, and timeline."
    },
    {
      ref: "Ref: CNTS/2026/GUIDE",
      title: "Coordinator Handbook",
      meta: "6 Pages · PDF (850 KB)",
      desc: "Computer lab setup guidelines & zero-load workflow rules."
    },
    {
      ref: "Ref: CNTS/2026/DECK",
      title: "Board Presentation Deck",
      meta: "8 Slides · PPTX (2.4 MB)",
      desc: "Summary presentation deck for School Board of Trustees."
    }
  ];

  return (
    <section id="official-documents" className="py-20 bg-slate-50 border-b border-slate-200 px-6 scroll-mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Institutional Documentation</span>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-slate-900 mt-2">
            Official Partnership Documents
          </h2>
          <p className="text-slate-600 text-sm mt-3">
            Download complete documentation for school leadership, academic committees, and trustee review.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documents.map((doc) => (
            <div key={doc.ref} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{doc.ref}</span>
                <h3 className="font-display font-bold text-slate-900 text-base mt-2 mb-1">{doc.title}</h3>
                <p className="text-[11px] text-slate-500 mb-3">{doc.meta}</p>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">{doc.desc}</p>
              </div>
              <button
                onClick={() => alert(`Downloading ${doc.title} (${doc.ref})...`)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200 min-h-[44px]"
              >
                <Download size={14} className="text-blue-600" /> Download PDF
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
