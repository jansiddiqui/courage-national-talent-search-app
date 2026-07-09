"use client";

import { useState, useEffect } from "react";
import { usePortal } from "@/contexts/PortalContext";
import Link from "next/link";
import { HelpCircle, MessageSquare, ChevronDown, ChevronUp, Phone, Mail, Send, CheckCircle, Lightbulb } from "lucide-react";

export default function SupportPage() {
  const { activeCandidate, addActivity } = usePortal();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: activeCandidate?.parent_name || "", email: activeCandidate?.parent_email || "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketReference, setTicketReference] = useState("");

  const [faqs, setFaqs] = useState<any[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch("/api/support/articles?category=FAQ");
        if (res.ok) {
          const data = await res.json();
          const normalized = (data.articles || []).map((art: any) => ({
            q: art.title,
            a: art.content
          }));
          setFaqs(normalized);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFaqs(false);
      }
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    const query = (form.message || form.subject || "").trim();
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/support/articles?limit=3&search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.articles || []);
        }
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [form.message, form.subject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: activeCandidate?.mobile_number || undefined,
          subject: form.subject,
          message: form.message,
          category: "GENERAL"
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTicketReference(data.ticket?.reference || "CNTS-SUP-REF");
        addActivity({ type: "system", title: "Support ticket submitted", description: form.subject, timestamp: new Date().toISOString() });
        setSubmitted(true);
      } else {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Support Center</h1>
        <p className="text-slate-500 text-sm mt-1">Find answers or get in touch with our team</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a href="https://wa.me/918360603173" target="_blank" rel="noreferrer" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
            <Phone size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide">WhatsApp</p>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">+91 83606 03173</p>
            <p className="text-[10px] text-slate-400">Mon–Sat, 10am–6pm</p>
          </div>
        </a>
        <a href="mailto:support@thecouragelibrary.com" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-11 h-11 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 uppercase tracking-wide">Email</p>
            <p className="text-sm font-semibold text-slate-600 mt-0.5">support@thecouragelibrary.com</p>
            <p className="text-[10px] text-slate-400">Response within 24h</p>
          </div>
        </a>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <HelpCircle size={15} className="text-blue-800" /> Frequently Asked Questions
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loadingFaqs ? (
            <div className="p-5 text-center text-xs text-slate-400">Loading FAQ articles...</div>
          ) : faqs.length === 0 ? (
            <div className="p-5 text-center text-xs text-slate-400">No FAQ articles found.</div>
          ) : (
            faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-semibold text-slate-800 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-slate-400 shrink-0" /> : <ChevronDown size={16} className="text-slate-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-[11px] text-slate-600 leading-relaxed border-l-2 border-blue-200 pl-3">{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare size={15} className="text-blue-800" /> Submit a Ticket
          </h2>
        </div>
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={26} />
            </div>
            <h3 className="font-bold text-slate-800">Message Received</h3>
            <p className="text-xs text-blue-800 font-bold bg-blue-50 border border-blue-100 rounded-lg px-3 py-1 inline-block">
              Ticket Ref: {ticketReference}
            </p>
            <p className="text-xs text-slate-500">Our team will respond to you within 24 hours on working days.</p>
            <button onClick={() => { setSubmitted(false); setForm({ ...form, subject: "", message: "" }); }} className="text-xs text-blue-700 font-bold hover:underline cursor-pointer">
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="Parent name"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                placeholder="Brief description of your query"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wide block mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                placeholder="Describe your issue or question in detail…"
              />
            </div>

            {/* Dynamic suggestions block */}
            {suggestions.length > 0 && (
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2 animate-slide-up">
                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1">
                  <Lightbulb size={12} className="text-amber-500 fill-amber-500" />
                  Suggested Articles (Could these help?)
                </p>
                <div className="space-y-2 text-xs">
                  {suggestions.map((art) => (
                    <div key={art.slug} className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-slate-800">{art.title}</h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{art.content.replace(/<[^>]*>/g, "").slice(0, 100)}</p>
                      </div>
                      <a
                        href={`/help/${art.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="shrink-0 text-[10px] font-bold text-blue-800 hover:underline"
                      >
                        Open
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Send size={13} /> {submitting ? "Sending…" : "Send Message"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
