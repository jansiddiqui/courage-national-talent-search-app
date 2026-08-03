"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { 
  Send, 
  CheckCircle, 
  ShieldAlert, 
  Sparkles, 
  MessageSquare, 
  AlertCircle,
  Calendar,
  Clock,
  School,
  User,
  Phone,
  ExternalLink,
  Copy,
  Check,
  Zap
} from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"meeting" | "broadcast">("meeting");

  // MEETING CONFIRMATION STATE
  const [principalName, setPrincipalName] = useState("Dr. R. K. Sharma");
  const [schoolName, setSchoolName] = useState("Delhi Public School, Lucknow");
  const [phoneNumber, setPhoneNumber] = useState("8707884735");
  const [meetingTime, setMeetingTime] = useState("Today at 7:00 PM");
  const [meetingMode, setMeetingMode] = useState("Google Meet");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/qzz-gykt-msm");
  const [customNote, setCustomNote] = useState("As discussed, sharing CNTS 2026 brochure and ₹0 school fee details.");
  const [copiedMsg, setCopiedMsg] = useState(false);
  const [meetingSending, setMeetingSending] = useState(false);

  // MASS BROADCAST STATE
  const [audience, setAudience] = useState("ALL");
  const [templateName, setTemplateName] = useState("MEETING_CONFIRMATION");
  const [channel, setChannel] = useState("WHATSAPP");
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  // Generate meeting confirmation WhatsApp formatted text
  const meetingConfirmationText = `Respected Principal ${principalName || "Ma'am/Sir"},

Greetings from Courage National Talent Search (CNTS) Academic Team!

This message confirms our scheduled discussion meeting regarding CNTS 2026 Student Scholarships & School Partnership:

📅 *Meeting Time:* ${meetingTime}
🏫 *School:* ${schoolName}
💻 *Mode:* ${meetingMode}${meetingLink ? `\n🔗 *Meeting Link:* ${meetingLink}` : ""}
👥 *Agenda:* Student Scholarship Badges, ₹0 Cost Model & Exam Portal Walkthrough${customNote ? `\n\n📌 *Note:* ${customNote}` : ""}

Please let us know if you need to adjust the time. Looking forward to our conversation at ${meetingTime}!

Warm regards,
*Courage National Talent Search (CNTS) Team*
Powered by Courage Library
Official Support: www.thecouragelibrary.com`;

  const handleOpenWhatsAppBusiness = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(meetingConfirmationText)}`;
    window.open(url, "_blank");
    showToast("WhatsApp Business launched with pre-filled meeting confirmation message!");
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(meetingConfirmationText);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleSendMeetingConfirmationAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    setMeetingSending(true);
    setError("");
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audience: "INDIVIDUAL_PRINCIPAL",
          templateName: "school_meeting_confirmation",
          channel: "WHATSAPP",
          recipientPhone: phoneNumber,
          principalName,
          meetingTime,
          schoolName,
          meetingMode,
          meetingLink
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Meta WhatsApp Template dispatched to ${phoneNumber}!`);
      } else {
        setError(data.message || "Failed to dispatch WhatsApp API message.");
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred.");
    } finally {
      setMeetingSending(false);
    }
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
        showToast(`Broadcast campaign launched to candidates successfully!`);
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
    <div className="space-y-6 text-slate-800 max-w-4xl mx-auto">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <MessageSquare className="text-emerald-600" />
            WhatsApp & Broadcast Center
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Send 1-on-1 WhatsApp meeting confirmations to school principals or launch student mass broadcasts.
          </p>
        </div>

        {/* TAB SELECTOR */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold gap-1 shrink-0">
          <button
            onClick={() => setActiveTab("meeting")}
            className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "meeting" ? "bg-white text-emerald-950 shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Meeting Confirmation (7 PM)
          </button>
          
          <button
            onClick={() => setActiveTab("broadcast")}
            className={`py-2 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "broadcast" ? "bg-white text-indigo-950 shadow-sm font-extrabold" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Student Mass Broadcast
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-slide-up">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-sm text-red-700 font-semibold">
          <ShieldAlert size={18} className="shrink-0" />
          {error}
        </div>
      )}

      {/* TAB 1: 1-ON-1 WHATSAPP MEETING CONFIRMATION CENTER */}
      {activeTab === "meeting" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* FORM CARD */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                1-on-1 Tele-Calling Outreach
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" /> Schedule Meeting & Confirmation
              </h2>
              <p className="text-xs text-slate-500">
                Fill in the principal's details to generate and send an official WhatsApp Business meeting confirmation.
              </p>
            </div>

            <form onSubmit={handleSendMeetingConfirmationAPI} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Principal Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={principalName}
                      onChange={e => setPrincipalName(e.target.value)}
                      placeholder="Dr. R. K. Sharma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="9876543210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  School Name *
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={schoolName}
                    onChange={e => setSchoolName(e.target.value)}
                    placeholder="Delhi Public School, Lucknow"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Scheduled Meeting Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 text-amber-500" size={14} />
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={e => setMeetingTime(e.target.value)}
                      placeholder="Today at 7:00 PM"
                      className="w-full pl-9 pr-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Meeting Mode / Platform *
                  </label>
                  <select
                    value={meetingMode}
                    onChange={e => setMeetingMode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Direct Phone Call">Direct Phone Call</option>
                    <option value="Zoom Meeting">Zoom Meeting</option>
                    <option value="WhatsApp Video Call">WhatsApp Video Call</option>
                    <option value="In-Person School Visit">In-Person School Visit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Meeting Link (Google Meet / Zoom URL)
                </label>
                <div className="relative">
                  <ExternalLink className="absolute left-3 top-2.5 text-indigo-500" size={14} />
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={e => setMeetingLink(e.target.value)}
                    placeholder="https://meet.google.com/abc-defg-hij"
                    className="w-full pl-9 pr-3 py-2 bg-indigo-50/50 border border-indigo-200 rounded-xl text-xs text-indigo-950 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Custom Personal Note (Optional)
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={e => setCustomNote(e.target.value)}
                  placeholder="e.g. As requested, sending brochure PDF in advance"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* DUAL DISPATCH ACTION BUTTONS */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={handleOpenWhatsAppBusiness}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-extrabold shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <ExternalLink size={15} /> Launch WhatsApp Business (1-Click Pre-filled)
                </button>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={meetingSending}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Zap size={14} className="text-emerald-400" />
                    {meetingSending ? "Sending API..." : "Auto-Send Cloud API"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    {copiedMsg ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    {copiedMsg ? "Copied" : "Copy Text"}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* LIVE WHATSAPP MESSAGE PREVIEW CARD */}
          <div className="bg-emerald-950 text-white rounded-3xl p-6 border border-emerald-900 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-emerald-900/80 pb-3 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Live Text Preview
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2.5 py-0.5 rounded-full">
                  Target: {phoneNumber || "Principal"}
                </span>
              </div>

              {/* WHATSAPP CHAT BUBBLE PREVIEW */}
              <div className="bg-emerald-900/60 border border-emerald-800/80 rounded-2xl p-4 text-xs font-sans leading-relaxed text-emerald-100 whitespace-pre-line shadow-inner max-h-[350px] overflow-y-auto">
                {meetingConfirmationText}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-900/40 border border-emerald-800/50 text-xs text-emerald-200 space-y-1">
              <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                💡 Why WhatsApp Business 1-Click Send is Recommended:
              </span>
              <p className="text-[11.5px] text-emerald-300/80 leading-relaxed">
                Opening WhatsApp Business directly allows tele-callers and admins to send the exact meeting confirmation with personal touch from your official Business account instantly.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MASS STUDENT BROADCAST CAMPAIGN */}
      {activeTab === "broadcast" && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in max-w-xl mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Sparkles size={16} className="text-blue-800" />
              New Student Group Broadcast Campaign
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Dispatch bulk template notifications via WhatsApp or Email channels to student candidate groups.
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Target Audience</label>
              <select
                value={audience}
                onChange={e => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-800"
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-800"
              >
                <option value="MEETING_CONFIRMATION">📅 School Principal Meeting Confirmation (7 PM)</option>
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
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-800"
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
              className="w-full py-3 bg-blue-800 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Send size={14} />
              {sending ? "Launching campaign..." : "Send Mass Broadcast Now"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
