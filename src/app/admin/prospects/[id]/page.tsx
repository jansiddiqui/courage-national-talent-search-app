"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  School, 
  MapPin, 
  Globe, 
  Mail, 
  Phone, 
  Award, 
  Clock, 
  Copy, 
  CheckCircle,
  FileText,
  AlertTriangle,
  Check,
  User,
  ExternalLink,
  MessageSquare
} from "lucide-react";

export default function ProspectDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [activeOutreachTab, setActiveOutreachTab] = useState<"longEmail" | "shortEmail" | "whatsapp" | "callScript">("longEmail");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2000);
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/prospects/${id}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load prospect details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data || !data.prospect) {
    return (
      <div className="p-8 text-center bg-white border rounded-2xl max-w-lg mx-auto mt-12 space-y-4">
        <AlertTriangle className="text-rose-500 mx-auto" size={32} />
        <h3 className="font-bold text-slate-800">Prospect Profile Not Found</h3>
        <button onClick={() => router.push("/admin/prospects")} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold">
          Back to Prospects
        </button>
      </div>
    );
  }

  const { prospect, evidence } = data;
  const templates = prospect.outreach_templates || {};
  const breakdown = prospect.scoring_breakdown || {};

  return (
    <div className="space-y-6 text-slate-800 animate-slide-up">
      {/* Toast Notice */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-xs font-semibold">
          {toast}
        </div>
      )}

      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/prospects")}
          className="p-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={14} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">{prospect.name}</h1>
          <p className="text-xs text-slate-500 mt-0.5">Prospect Research Profile & Intelligence Report</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & Scores */}
        <div className="space-y-6">
          {/* Identity Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-display font-bold">
                <School size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{prospect.name}</h3>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                  {prospect.board || "CBSE"}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs font-medium border-t border-slate-50 pt-4">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={13} className="text-slate-400" />
                <span>{prospect.city}, {prospect.state}</span>
              </div>
              {prospect.website && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Globe size={13} className="text-slate-400" />
                  <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    Visit Website
                    <ExternalLink size={10} />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Scoring Card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 text-sm">Outreach Fit Score</h3>
              <div className="text-right">
                <div className="text-2xl font-black text-indigo-700">{prospect.outreach_score}</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Scale of 100</div>
              </div>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${prospect.outreach_score}%` }}></div>
            </div>

            {/* Breakdown detail list */}
            <div className="space-y-2 pt-2 border-t border-slate-50 text-xs font-semibold">
              <div className="flex justify-between text-slate-600">
                <span>Target Classes Available</span>
                <span className="font-bold text-slate-800">{breakdown.classesOffered || 0} / 20</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Olympiads & Competitions</span>
                <span className="font-bold text-slate-800">{breakdown.olympiads || 0} / 20</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>STEM Lab & Facilities</span>
                <span className="font-bold text-slate-800">{breakdown.stem || 0} / 15</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Contact Details Found</span>
                <span className="font-bold text-slate-800">{breakdown.contacts || 0} / 15</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Decision Maker Identified</span>
                <span className="font-bold text-slate-800">{breakdown.decisionMaker || 0} / 15</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Website Discovery</span>
                <span className="font-bold text-slate-800">{breakdown.digitalFootprint || 0} / 10</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CBSE Board Confirmed</span>
                <span className="font-bold text-slate-800">{breakdown.board || 0} / 5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Research Report & Outreach */}
        <div className="lg:col-span-2 space-y-6">
          {/* Research Snippets & Evidence */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Extracted Claims & Evidence</h3>
              <p className="text-xs text-slate-500 mt-0.5">Field-level provenance data matched from website crawling.</p>
            </div>

            <div className="space-y-4 pt-2">
              {evidence.length > 0 ? (
                evidence.map((ev: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs uppercase tracking-wide text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                        {ev.claim_key.replace(/_/g, " ")}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold">
                        <span className={`px-2 py-0.5 rounded-full ${
                          ev.evidence_status === "VERIFIED" ? "bg-emerald-50 text-emerald-700" :
                          ev.evidence_status === "INFERRED" ? "bg-amber-50 text-amber-700" :
                          "bg-slate-100 text-slate-600"
                        }`}>
                          {ev.evidence_status}
                        </span>
                        <span className="text-slate-400">{ev.confidence}% confidence</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed font-semibold italic">
                      &quot;{ev.evidence_text}&quot;
                    </div>

                    <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <span>Source URL:</span>
                      <a href={ev.source_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline inline-flex items-center gap-0.5">
                        {ev.source_url}
                        <ExternalLink size={8} />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs font-semibold">
                  No evidence claims verified yet. Start enrichment research to compile metrics.
                </div>
              )}
            </div>
          </div>

          {/* Outreach Materials Drafts */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Grounded Outreach Copy</h3>
                <p className="text-xs text-slate-500 mt-0.5">AI drafts personalized using only verified evidence.</p>
              </div>
              <div className="flex gap-1 text-[11px] font-bold">
                <button
                  onClick={() => setActiveOutreachTab("longEmail")}
                  className={`px-3 py-1.5 rounded-lg ${activeOutreachTab === "longEmail" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
                >
                  Email (Long)
                </button>
                <button
                  onClick={() => setActiveOutreachTab("shortEmail")}
                  className={`px-3 py-1.5 rounded-lg ${activeOutreachTab === "shortEmail" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
                >
                  Email (Short)
                </button>
                <button
                  onClick={() => setActiveOutreachTab("whatsapp")}
                  className={`px-3 py-1.5 rounded-lg ${activeOutreachTab === "whatsapp" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
                >
                  WhatsApp
                </button>
                <button
                  onClick={() => setActiveOutreachTab("callScript")}
                  className={`px-3 py-1.5 rounded-lg ${activeOutreachTab === "callScript" ? "bg-indigo-50 text-indigo-700" : "text-slate-500"}`}
                >
                  Call Script
                </button>
              </div>
            </div>

            {/* Template Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 relative">
              <button
                onClick={() => {
                  let text = "";
                  if (activeOutreachTab === "longEmail") text = templates.emailLong;
                  else if (activeOutreachTab === "shortEmail") text = templates.emailShort;
                  else if (activeOutreachTab === "whatsapp") text = templates.whatsappMessage;
                  else if (activeOutreachTab === "callScript") text = templates.callOpeningScript;
                  copyToClipboard(text || "");
                }}
                className="absolute top-3 right-3 p-2 bg-white hover:bg-slate-50 border border-slate-200/50 rounded-xl text-slate-500 cursor-pointer shadow-sm"
              >
                <Copy size={13} />
              </button>

              <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed pt-4">
                {activeOutreachTab === "longEmail" && (templates.emailLong || "Generate research first.")}
                {activeOutreachTab === "shortEmail" && (templates.emailShort || "Generate research first.")}
                {activeOutreachTab === "whatsapp" && (templates.whatsappMessage || "Generate research first.")}
                {activeOutreachTab === "callScript" && (templates.callOpeningScript || "Generate research first.")}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
