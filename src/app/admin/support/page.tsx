"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, ShieldAlert, Clock, Inbox, CornerDownRight, ArrowRight } from "lucide-react";

interface Ticket {
  id: string;
  reference: string;
  student_name: string;
  category: string;
  status: string;
  priority: string;
  subject: string;
  description: string;
  created_at: string;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to load support tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      setError(err.message || "Failed to load support tickets.");
    } finally {
      setLoading(false);
    }
  };

  const selectTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    // Fetch replies/messages for the selected ticket
    try {
      const res = await fetch(`/api/admin/support/tickets/${ticket.reference}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.messages || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    setReplying(true);
    try {
      const res = await fetch(`/api/admin/support/tickets/${selectedTicket.reference}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: replyText.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Reply sent successfully!");
        setReplies([...replies, { role: "admin", message: replyText.trim(), created_at: new Date().toISOString() }]);
        setReplyText("");
      } else {
        showToast(data.message || "Failed to send reply.");
      }
    } catch (err: any) {
      showToast(err.message || "Network error.");
    } finally {
      setReplying(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-6 text-slate-800">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <Inbox className="text-blue-800" />
          Support Desk
        </h1>
        <p className="text-sm text-slate-500 mt-1">Review candidate inquiries, resolve transaction failures, and send replies.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets List */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inbound Tickets</h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-800 rounded-full animate-spin" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm">No tickets found.</div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => selectTicket(t)}
                  className={`p-4 cursor-pointer hover:bg-slate-50/50 transition-all space-y-2 ${
                    selectedTicket?.id === t.id ? "bg-blue-50/30 border-l-4 border-blue-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">{t.reference}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      t.status === "OPEN" ? "bg-red-50 border border-red-100 text-red-700" : "bg-emerald-50 border border-emerald-100 text-emerald-700"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-slate-800 truncate">{t.subject}</h3>
                  <p className="text-[10px] text-slate-450 truncate">{t.student_name} · {t.category}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation Pane */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-sm">
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              {/* Ticket details */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-850 font-bold">{selectedTicket.subject}</span>
                  <span className="text-[10px] font-mono text-blue-850">{selectedTicket.reference}</span>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50/50 p-3 border border-slate-100 rounded-xl">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/10">
                {replies.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No correspondence logged. Send a reply below.</div>
                ) : (
                  replies.map((msg: any, idx: number) => (
                    <div
                      key={idx}
                      className={`flex gap-2 max-w-[80%] ${
                        msg.role === "admin" ? "ml-auto flex-row-reverse" : "mr-auto"
                      }`}
                    >
                      <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                        msg.role === "admin" 
                          ? "bg-blue-800 text-white rounded-tr-none" 
                          : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
                      }`}>
                        <p>{msg.message}</p>
                        <span className="block text-[9px] opacity-70 text-right">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-slate-50/30 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-800"
                />
                <button
                  type="submit"
                  disabled={replying || !replyText.trim()}
                  className="px-4 py-2 bg-blue-800 hover:bg-blue-750 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0"
                >
                  Reply <ArrowRight size={12} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <MessageSquare size={36} className="text-slate-200" />
              <p className="text-xs">Select a support ticket from the side-list to begin audit.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
