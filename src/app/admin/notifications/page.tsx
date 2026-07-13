"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Send, CheckCircle, ShieldAlert, Sparkles, MessageSquare, AlertCircle } from "lucide-react";

export default function NotificationsPage() {
  const [audience, setAudience] = useState("ALL");
  const [templateName, setTemplateName] = useState("ANNOUNCEMENT");
  const [channel, setChannel] = useState("WHATSAPP");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, templateName, channel }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Broadcast initiated successfully to ${data.sentCount || 0} candidates!`);
      } else {
        setError(data.message || "Failed to launch notification campaign.");
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 max-w-xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <MessageSquare className="text-blue-800" />
          Broadcast Center
        </h1>
        <p className="text-sm text-slate-500 mt-1">Dispatch templates via WhatsApp or Email channels to student groups.</p>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-blue-800 border border-blue-700 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <CheckCircle size={14} />
          {toast}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Sparkles size={16} className="text-blue-800" />
          New Broadcast Campaign
        </h2>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Target Audience</label>
            <select
              value={audience}
              onChange={e => setAudience(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
            >
              <option value="ALL">All Candidates</option>
              <option value="PAID">All Paid Candidates</option>
              <option value="CLASS_5">Class 5 Students</option>
              <option value="CLASS_6">Class 6 Students</option>
              <option value="CLASS_7">Class 7 Students</option>
              <option value="CLASS_8">Class 8 Students</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Message Template</label>
            <select
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
            >
              <option value="ANNOUNCEMENT">General Announcement Notification</option>
              <option value="EXAM_REMINDER">Exam Schedule Reminder</option>
              <option value="HALL_TICKET">Admit Card Release Notice</option>
              <option value="RESULT_OUT">Result Compilation Release Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Channel</label>
            <select
              value={channel}
              onChange={e => setChannel(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-blue-800"
            >
              <option value="WHATSAPP">WhatsApp Messenger API</option>
              <option value="EMAIL">Transactional Email (Brevo)</option>
            </select>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start gap-2 text-xs text-slate-500">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              <strong>Security Notice:</strong> Large broadcasts to over 1,000 candidates will trigger maker-checker compliance. Your request will be queued in the Approvals Center until authorized.
            </p>
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full py-2.5 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Send size={14} />
            {sending ? "Launching campaign..." : "Send Broadcast Now"}
          </button>
        </form>
      </div>
    </div>
  );
}
