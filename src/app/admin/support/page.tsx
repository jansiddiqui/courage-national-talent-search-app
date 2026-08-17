"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Inbox, 
  Search, 
  RefreshCw, 
  ArrowRight,
  Send,
  User,
  ShieldCheck
} from "lucide-react";

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
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const fetchTickets = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/support");
      if (!res.ok) throw new Error("Failed to load support tickets");
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      if (!silent) setError(err.message || "Failed to load support tickets.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchTicketDetails = async (reference: string) => {
    try {
      const res = await fetch(`/api/admin/support/tickets/${encodeURIComponent(reference)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && Array.isArray(data.messages)) {
          setReplies(data.messages);
        }
      }
    } catch (err) {
      console.error("Failed to fetch ticket messages:", err);
    }
  };

  const selectTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setReplyText("");
    await fetchTicketDetails(ticket.reference);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;
    const msg = replyText.trim();
    setReplying(true);
    setReplyText("");

    // Optimistic UI update
    setReplies(prev => [...prev, {
      role: "admin",
      sender_role: "ADMIN",
      message: msg,
      created_at: new Date().toISOString()
    }]);

    try {
      const res = await fetch(`/api/admin/support/tickets/${encodeURIComponent(selectedTicket.reference)}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { success: res.ok };
      }

      if (res.ok && data.success !== false) {
        showToast("Reply dispatched successfully!");
        fetchTickets(true);
        fetchTicketDetails(selectedTicket.reference);
      } else {
        showToast(data.message || data.error || "Failed to send reply.");
      }
    } catch (err: any) {
      showToast(err.message || "Network error.");
    } finally {
      setReplying(false);
    }
  };

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies.length]);

  // Real-time live polling (every 3.5 seconds) without needing page reload
  useEffect(() => {
    fetchTickets();
    const interval = setInterval(() => {
      fetchTickets(true);
      if (selectedTicket) {
        fetchTicketDetails(selectedTicket.reference);
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [selectedTicket?.reference]);

  const filteredTickets = tickets.filter(t => 
    search === "" ||
    t.reference.toLowerCase().includes(search.toLowerCase()) ||
    t.student_name.toLowerCase().includes(search.toLowerCase()) ||
    t.subject.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-blue-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-slide-up">
          <CheckCircle2 size={16} />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-bold font-display text-slate-900 tracking-tight flex items-center gap-2">
            Central Support Desk
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Sync
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">Manage, route, and resolve inbound candidate, parent, and partner tickets in real-time.</p>
        </div>
        <button
          onClick={() => fetchTickets()}
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer shadow-xs"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2 text-sm text-red-700">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search reference, name, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs outline-none bg-transparent"
            />
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-xs">Loading incoming tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">No matching tickets found.</div>
            ) : (
              filteredTickets.map((t) => (
                <div
                  key={t.reference}
                  onClick={() => selectTicket(t)}
                  className={`p-4 hover:bg-slate-50 cursor-pointer transition flex flex-col gap-1.5 ${
                    selectedTicket?.reference === t.reference ? "bg-blue-50/50 border-l-4 border-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono font-bold text-slate-500">{t.reference}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      t.status === "OPEN" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      t.status === "RESOLVED" || t.status === "CLOSED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-xs text-slate-900 truncate">{t.subject}</h3>
                  <p className="text-[10px] text-slate-500 truncate">{t.student_name} · {t.category}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Conversation Pane */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl overflow-hidden h-[600px] flex flex-col shadow-xs">
          {selectedTicket ? (
            <div className="flex flex-col h-full">
              {/* Ticket details */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-900 font-bold">{selectedTicket.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9.5px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Sync
                    </span>
                    <span className="text-[10.5px] font-mono font-bold text-blue-700">{selectedTicket.reference}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 bg-white p-3 border border-slate-200 rounded-xl leading-relaxed">
                  {selectedTicket.description}
                </p>
              </div>

              {/* Messages feed */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50/30">
                {replies.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">No correspondence logged yet. Send a response below.</div>
                ) : (
                  replies.map((msg: any, idx: number) => {
                    const isAdmin = msg.role === "admin" || msg.sender_role === "ADMIN";
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2 max-w-[85%] ${
                          isAdmin ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        <div className={`p-3.5 rounded-2xl text-xs space-y-1.5 shadow-xs transition-all ${
                          isAdmin 
                            ? "bg-blue-600 text-white rounded-tr-none" 
                            : "bg-white text-slate-800 rounded-tl-none border border-slate-200"
                        }`}>
                          <div className="flex items-center justify-between gap-3 text-[10px] font-bold opacity-90">
                            <span className="flex items-center gap-1">
                              {isAdmin ? (
                                <>
                                  <ShieldCheck className="w-3.5 h-3.5" />
                                  <span>Helpdesk Admin</span>
                                </>
                              ) : (
                                <>
                                  <User className="w-3.5 h-3.5" />
                                  <span>{selectedTicket.student_name || "Requester"}</span>
                                </>
                              )}
                            </span>
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-slate-100 bg-white flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type administrative response (live syncs immediately)..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="submit"
                  disabled={replying || !replyText.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <Send size={13} />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
              <MessageSquare size={36} className="text-slate-300" />
              <p className="text-xs">Select a support ticket from the list to view message stream.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
