"use client";

import { usePortal } from "@/contexts/PortalContext";
import { UserCircle, Globe, Bell, Moon, BellRing, Mail, MessageCircle, Clock, ChevronRight } from "lucide-react";

const LANGUAGES = ["English", "Hindi", "Marathi", "Telugu", "Tamil", "Kannada", "Bengali", "Gujarati"];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${checked ? "bg-blue-800" : "bg-slate-200"}`}
      style={{ height: "22px", width: "40px" }}
      role="switch"
      aria-checked={checked}
    >
      <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-[18px]" : "translate-x-0"}`} />
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

function PrefRow({ icon: Icon, label, subtitle, children }: { icon: React.ElementType; label: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-3">
        <Icon size={16} className="text-slate-500 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-800">{label}</p>
          {subtitle && <p className="text-[10px] text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { activeCandidate, parentSession, candidates, preferences, updatePreference, handleLogout } = usePortal();

  const c = activeCandidate;
  const parentName = c?.parent_name || parentSession?.displayName || "Parent";
  const phone = c?.mobile_number || parentSession?.phoneNumber;
  const email = c?.parent_email || parentSession?.email;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-slate-900">Profile & Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Parent Info Card */}
      <div className="bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl p-5 text-white flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-black shrink-0">
          {parentName.charAt(0)}
        </div>
        <div>
          <h2 className="font-display font-bold text-lg text-white">{parentName}</h2>
          <p className="text-blue-200 text-xs mt-0.5">{phone}</p>
          {email && <p className="text-blue-300 text-[10px] mt-0.5">{email}</p>}
          <p className="text-blue-300 text-[10px] mt-1">{candidates.length} child{candidates.length !== 1 ? "ren" : ""} registered</p>
        </div>
      </div>

      {/* Linked Children */}
      <Section title="Linked Children">
        {candidates.map((c) => (
          <div key={c.id} className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm shrink-0">
              {c.student_name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{c.student_name}</p>
              <p className="text-[10px] text-slate-400 font-mono">{c.registration_id}</p>
            </div>
            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${c.payment_status === "PAID" || c.payment_status === "SPONSORED" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
              {c.payment_status === "PAID" ? "Enrolled" : c.payment_status}
            </span>
          </div>
        ))}
      </Section>

      {/* Language & Regional */}
      <Section title="Language & Region">
        <PrefRow icon={Globe} label="Preferred Language" subtitle="Reports and communications">
          <select
            value={preferences.preferredLanguage}
            onChange={(e) => updatePreference("preferredLanguage", e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none cursor-pointer"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>
        </PrefRow>
        <PrefRow icon={Clock} label="Timezone" subtitle="Auto-detected">
          <span className="text-xs font-semibold text-slate-500">IST (UTC+5:30)</span>
        </PrefRow>
      </Section>

      {/* Notifications */}
      <Section title="Notification Preferences">
        <PrefRow icon={MessageCircle} label="WhatsApp Notifications" subtitle="Exam reminders and updates">
          <Toggle checked={preferences.notificationsWhatsApp} onChange={(v) => updatePreference("notificationsWhatsApp", v)} />
        </PrefRow>
        <PrefRow icon={Mail} label="Email Notifications" subtitle="Official communications">
          <Toggle checked={preferences.notificationsEmail} onChange={(v) => updatePreference("notificationsEmail", v)} />
        </PrefRow>
        <PrefRow icon={BellRing} label="Exam Reminders" subtitle="Countdown alerts before assessment">
          <Toggle checked={preferences.examReminders} onChange={(v) => updatePreference("examReminders", v)} />
        </PrefRow>
        <PrefRow icon={Bell} label="Marketing Updates" subtitle="News, events, future editions">
          <Toggle checked={true} onChange={() => {}} />
        </PrefRow>
      </Section>

      {/* Appearance */}
      <Section title="Appearance">
        <PrefRow icon={Moon} label="Dark Mode" subtitle="Coming soon in a future update">
          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Soon</span>
        </PrefRow>
      </Section>

      {/* Account Actions */}
      <Section title="Account">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between px-5 py-3.5 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <UserCircle size={16} className="shrink-0" />
            <span className="text-xs font-semibold">Logout</span>
          </div>
          <ChevronRight size={14} />
        </button>
      </Section>
    </div>
  );
}
