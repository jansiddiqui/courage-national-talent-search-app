"use client";

import { usePortal } from "@/contexts/PortalContext";
import Link from "next/link";
import { Bell, Check, CheckCheck, ExternalLink, Calendar, CreditCard, Award, Megaphone, BookOpen } from "lucide-react";

const TYPE_META: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  exam_reminder: { icon: Calendar, color: "text-blue-700", bg: "bg-blue-50" },
  payment: { icon: CreditCard, color: "text-emerald-700", bg: "bg-emerald-50" },
  result: { icon: Award, color: "text-indigo-700", bg: "bg-indigo-50" },
  certificate: { icon: Award, color: "text-purple-700", bg: "bg-purple-50" },
  announcement: { icon: Megaphone, color: "text-amber-700", bg: "bg-amber-50" },
  admit_card: { icon: BookOpen, color: "text-slate-700", bg: "bg-slate-100" },
  general: { icon: Bell, color: "text-slate-600", bg: "bg-slate-100" },
};

function formatDateTime(ts: string) {
  const d = new Date(ts);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = usePortal();

  // Group by date label
  const groups: Record<string, typeof notifications> = {};
  for (const n of notifications) {
    const label = formatDateTime(n.timestamp);
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}` : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-colors border border-blue-200 cursor-pointer"
          >
            <CheckCheck size={13} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          <Bell size={32} className="mx-auto text-slate-300 mb-3" />
          <p className="text-sm font-semibold text-slate-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groups).map(([dateLabel, items]) => (
            <div key={dateLabel}>
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2 px-1">{dateLabel}</p>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-100">
                {items.map((notif) => {
                  const meta = TYPE_META[notif.type] || TYPE_META.general;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={notif.id}
                      className={`flex gap-4 px-5 py-4 hover:bg-slate-50 transition-colors ${!notif.read ? "bg-blue-50/40" : ""}`}
                    >
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                        <Icon size={17} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-bold ${notif.read ? "text-slate-700" : "text-slate-900"}`}>{notif.title}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[10px] text-slate-400">
                              {new Date(notif.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                            </span>
                            {!notif.read && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{notif.body}</p>

                        {/* Actionable CTA */}
                        <div className="flex items-center gap-2 mt-2.5">
                          {notif.actionLabel && notif.actionLink && (
                            <Link
                              href={notif.actionLink}
                              onClick={() => markNotificationRead(notif.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors"
                            >
                              {notif.actionLabel} <ExternalLink size={10} />
                            </Link>
                          )}
                          {!notif.read && (
                            <button
                              onClick={() => markNotificationRead(notif.id)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer"
                            >
                              <Check size={10} /> Dismiss
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
