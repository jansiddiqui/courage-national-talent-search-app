"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowRight, Check, Download, HelpCircle, ChevronDown, Sparkles, BookOpen, MessageSquare, ShieldCheck, Clock, Award, Star, Zap, Brain, Trophy } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TIMELINE, TIMELINE_LABELS } from "@/config/timeline";
import { saveFoundingFamily, fetchFoundingFamiliesCount } from "@/services/supabaseService";

/* ─────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────── */
const BENEFITS = [
  { icon: Zap,         title: "Priority WhatsApp Alert",    desc: "You'll be the first notified the moment registrations open on July 15."             },
  { icon: BookOpen,    title: "Free Sample Worksheets",      desc: "Instant access to cognitive reasoning practice sets for Classes 5–8."               },
  { icon: Brain,       title: "Syllabus Prep Guidance",      desc: "Expert-designed prep newsletters delivered to your inbox before launch."            },
  { icon: Award,       title: "Founding Edition Badge",      desc: "A unique verifiable Founding Family ID card — a keepsake of early support."         },
  { icon: ShieldCheck, title: "No-Spam Guarantee",           desc: "Only critical timeline alerts. No marketing. Unsubscribe any time."                 },
  { icon: Star,        title: "Priority Counseling Access",  desc: "Early booking for 1:1 child roadmap sessions with our educational advisors."        },
];

const TIMELINE_STEPS = [
  { label: "Founding Families", date: "Now",                            color: "bg-emerald-500",  active: true  },
  { label: "Registrations Open", date: TIMELINE_LABELS.REGISTRATION_OPEN, color: "bg-blue-600",   active: false },
  { label: "Online Exam",        date: TIMELINE_LABELS.EXAM_DATE.replace(" (Sunday)", ""), color: "bg-indigo-600", active: false },
  { label: "Results & Reports",  date: TIMELINE_LABELS.TALENT_PROFILE_DATE, color: "bg-amber-500", active: false },
];

const FAQS = [
  {
    q: "Does joining the Founding Families program cost anything?",
    a: "No — it's completely free. You are reserving a priority notification token. The ₹99 exam fee is only charged when you complete formal registration on July 15.",
  },
  {
    q: `What happens on ${TIMELINE_LABELS.REGISTRATION_OPEN}?`,
    a: `At 10:00 AM on ${TIMELINE_LABELS.REGISTRATION_OPEN}, you will receive a WhatsApp priority alert with your direct enrollment link. Slots are capped, so Founding Families get first access.`,
  },
  {
    q: "How will you use my details?",
    a: "Your details are stored securely in our encrypted database. We send only critical exam timeline alerts — no marketing emails, no third-party sharing, ever.",
  },
];

/* ─────────────────────────────────────────────────────────────
   Component
───────────────────────────────────────────────────────────── */
export default function FoundingFamiliesClient() {
  /* State */
  const [mounted, setMounted]               = useState(false);
  const [parentName, setParentName]         = useState("");
  const [mobileNumber, setMobileNumber]     = useState("");
  const [parentEmail, setParentEmail]       = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [submitError, setSubmitError]       = useState("");
  const [submitted, setSubmitted]           = useState<{ familyId: string; parentName: string } | null>(null);
  const [familyCount, setFamilyCount]       = useState(342);
  const [countdown, setCountdown]           = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openFaq, setOpenFaq]               = useState<number | null>(0);
  const [puzzleAnswer, setPuzzleAnswer]     = useState<number | null>(null);
  const [registrationIsOpen, setRegistrationIsOpen] = useState(false);
  const canvasRef                           = useRef<HTMLCanvasElement | null>(null);

  /* Lifecycle */
  useEffect(() => {
    setMounted(true);

    // Check if registration is now open (July 15 2026 10:00 AM)
    const regOpenDate = new Date(`${TIMELINE.REGISTRATION_OPEN}T10:00:00`);
    setRegistrationIsOpen(new Date() >= regOpenDate);

    fetchFoundingFamiliesCount().then(setFamilyCount).catch(() => {});

    const saved = localStorage.getItem("cnts_founding_family_data");
    if (saved) setSubmitted(JSON.parse(saved));

    const target = new Date(`${TIMELINE.REGISTRATION_OPEN}T10:00:00`).getTime();
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setCountdown({
        days:    Math.floor(diff / 86_400_000),
        hours:   Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000)  / 60_000),
        seconds: Math.floor((diff % 60_000)     / 1_000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Form submit */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    try {
      const res    = await fetch("/api/founding-families", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ parentName, mobileNumber, parentEmail }),
      });
      const result = await res.json();
      if (result.success) {
        const payload = { familyId: result.familyId, parentName };
        setSubmitted(payload);
        localStorage.setItem("cnts_founding_family_data", JSON.stringify(payload));
        setFamilyCount(c => c + 1);
      } else {
        setSubmitError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Connection error. Please check your internet and retry.");
    } finally {
      setSubmitting(false);
    }
  };

  /* Canvas card download — Premium Credential Redesign */
  const downloadCard = () => {
    if (!canvasRef.current || !submitted) return;
    const cvs = canvasRef.current, ctx = cvs.getContext("2d");
    if (!ctx) return;

    const W = 1040, H = 580;
    cvs.width = W; cvs.height = H;
    const SPLIT = 590; // Left panel ends here
    const PAD = 52;

    // ─── Card Base ─────────────────────────────────────────────────
    ctx.fillStyle = "#05080f";
    roundRect(ctx, 0, 0, W, H, 20);
    ctx.fill();

    // ─── Right Panel: Security Pattern Background ──────────────────
    ctx.save();
    ctx.beginPath();
    // Clip to right panel with diagonal left edge
    ctx.moveTo(SPLIT + 40, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, H);
    ctx.lineTo(SPLIT - 40, H);
    ctx.closePath();
    ctx.clip();

    // Right panel bg — slightly lighter deep navy
    ctx.fillStyle = "#0a0f1e";
    ctx.fillRect(SPLIT - 40, 0, W - SPLIT + 40, H);

    // Guilloche — concentric sinusoidal wave pattern (security print)
    ctx.lineWidth = 0.6;
    for (let row = 0; row < 28; row++) {
      const yBase = (H / 28) * row + H / 56;
      ctx.beginPath();
      const amp = 4 + (row % 3) * 2;
      const freq = 0.035 + (row % 5) * 0.005;
      for (let x = SPLIT - 40; x <= W; x += 2) {
        const y = yBase + Math.sin(x * freq + row * 0.8) * amp;
        x === SPLIT - 40 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      // Alternating amber and white for security-print feel
      const alpha = 0.04 + (row % 4 === 0 ? 0.03 : 0);
      ctx.strokeStyle = row % 6 === 0
        ? `rgba(245,158,11,${alpha + 0.02})`
        : `rgba(255,255,255,${alpha})`;
      ctx.stroke();
    }

    // Rosette: concentric rings at center-right
    const rx = SPLIT + (W - SPLIT) / 2 + 10, ry = H / 2;
    for (let ring = 3; ring <= 22; ring++) {
      ctx.beginPath();
      ctx.arc(rx, ry, ring * 11, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245,158,11,${ring % 4 === 0 ? 0.06 : 0.025})`;
      ctx.lineWidth = ring % 4 === 0 ? 0.8 : 0.4;
      ctx.stroke();
    }

    // Star-burst lines from rosette center
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 / 24) * i;
      ctx.beginPath();
      ctx.moveTo(rx + Math.cos(angle) * 30, ry + Math.sin(angle) * 30);
      ctx.lineTo(rx + Math.cos(angle) * 200, ry + Math.sin(angle) * 200);
      ctx.strokeStyle = "rgba(245,158,11,0.04)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    ctx.restore();

    // ─── Diagonal Divider Line ─────────────────────────────────────
    const divGrad = ctx.createLinearGradient(SPLIT - 40, 0, SPLIT - 40, H);
    divGrad.addColorStop(0, "rgba(245,158,11,0.0)");
    divGrad.addColorStop(0.2, "rgba(245,158,11,0.5)");
    divGrad.addColorStop(0.8, "rgba(245,158,11,0.5)");
    divGrad.addColorStop(1, "rgba(245,158,11,0.0)");
    ctx.strokeStyle = divGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SPLIT + 40, 0);
    ctx.lineTo(SPLIT - 40, H);
    ctx.stroke();

    // ─── Gold Foil Top Strip ───────────────────────────────────────
    const foil = ctx.createLinearGradient(0, 0, W, 0);
    foil.addColorStop(0,    "#7c2d12");
    foil.addColorStop(0.15, "#d97706");
    foil.addColorStop(0.35, "#fef3c7");
    foil.addColorStop(0.5,  "#fbbf24");
    foil.addColorStop(0.65, "#fef3c7");
    foil.addColorStop(0.85, "#d97706");
    foil.addColorStop(1,    "#92400e");
    ctx.fillStyle = foil;
    roundRect(ctx, 0, 0, W, 5, { tl: 20, tr: 20, br: 0, bl: 0 });
    ctx.fill();

    // ─── Outer Border ──────────────────────────────────────────────
    ctx.strokeStyle = "rgba(245,158,11,0.2)";
    ctx.lineWidth = 1;
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, 20);
    ctx.stroke();

    // ─── LEFT PANEL CONTENT ───────────────────────────────────────

    // Brand name — small, tracked, dignified
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.font = "600 9px 'Helvetica Neue', Arial, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("COURAGE NATIONAL TALENT SEARCH", PAD, 58);

    ctx.fillStyle = "rgba(245,158,11,0.6)";
    ctx.font = "500 8px Arial, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("FOUNDING EDITION 2026", PAD, 76);
    ctx.letterSpacing = "0px";

    // Thin amber rule
    const rule1 = ctx.createLinearGradient(PAD, 0, SPLIT - 80, 0);
    rule1.addColorStop(0, "rgba(245,158,11,0.7)");
    rule1.addColorStop(1, "rgba(245,158,11,0.0)");
    ctx.strokeStyle = rule1;
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(PAD, 90); ctx.lineTo(SPLIT - 80, 90); ctx.stroke();

    // ─── TITLE: Founding Family Member ────────────────────────────
    // Subtle amber glow behind title text
    const titleGlow = ctx.createRadialGradient(PAD + 200, 155, 0, PAD + 200, 155, 220);
    titleGlow.addColorStop(0, "rgba(245,158,11,0.08)");
    titleGlow.addColorStop(1, "transparent");
    ctx.fillStyle = titleGlow;
    ctx.fillRect(PAD, 100, 450, 100);

    // Title line 1 — large word with gold gradient fill
    const titleFill = ctx.createLinearGradient(PAD, 130, PAD + 500, 175);
    titleFill.addColorStop(0,   "#fef3c7");
    titleFill.addColorStop(0.3, "#fbbf24");
    titleFill.addColorStop(0.7, "#f59e0b");
    titleFill.addColorStop(1,   "#d97706");
    ctx.fillStyle = titleFill;
    ctx.font = "300 42px 'Georgia', serif";
    ctx.fillText("Founding", PAD, 148);
    ctx.font = "700 42px 'Georgia', serif";
    ctx.fillText("Family Member", PAD, 195);

    // Small italic tagline
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.font = "italic 10px 'Georgia', serif";
    ctx.fillText("Since July 2026  ·  Pre-Launch Invitational Pass", PAD, 216);

    // ─── Thin rule 2 ───────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(PAD, 234); ctx.lineTo(SPLIT - 80, 234); ctx.stroke();

    // ─── MEMBER NAME BLOCK ─────────────────────────────────────────
    ctx.fillStyle = "rgba(245,158,11,0.55)";
    ctx.font = "600 7.5px Arial, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("REGISTERED MEMBER", PAD, 262);
    ctx.letterSpacing = "0px";

    // Name — large, dignified, mixed case
    const name = submitted.parentName
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 38px 'Georgia', serif";
    ctx.fillText(name, PAD, 305);

    // ─── Thin rule 3 ───────────────────────────────────────────────
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(PAD, 325); ctx.lineTo(SPLIT - 80, 325); ctx.stroke();

    // ─── Family ID + Status row ────────────────────────────────────
    // ID block
    ctx.fillStyle = "rgba(16,185,129,0.08)";
    roundRect(ctx, PAD - 2, 340, 230, 56, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(16,185,129,0.18)";
    ctx.lineWidth = 0.8;
    roundRect(ctx, PAD - 2, 340, 230, 56, 8);
    ctx.stroke();

    ctx.fillStyle = "rgba(52,211,153,0.5)";
    ctx.font = "600 7px Arial, sans-serif";
    ctx.letterSpacing = "2.5px";
    ctx.fillText("FAMILY ID", PAD + 10, 357);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = "#34d399";
    ctx.font = "700 19px 'Courier New', monospace";
    ctx.fillText(submitted.familyId, PAD + 10, 382);

    // Validity block (right of ID)
    ctx.fillStyle = "rgba(148,163,184,0.4)";
    ctx.font = "600 7px Arial, sans-serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("VALID FOR", PAD + 255, 357);
    ctx.letterSpacing = "0px";

    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "700 12px 'Helvetica Neue', Arial, sans-serif";
    ctx.fillText("CNTS 2026", PAD + 255, 373);

    ctx.fillStyle = "rgba(148,163,184,0.35)";
    ctx.font = "500 8.5px Arial, sans-serif";
    ctx.fillText("Priority · First Access", PAD + 255, 388);

    // ─── Micro fine-print assurance text ──────────────────────────
    ctx.fillStyle = "rgba(148,163,184,0.22)";
    ctx.font = "400 7.5px Arial, sans-serif";
    ctx.fillText("This pass guarantees priority access to the Founding Edition 2026 registration.", PAD, 430);
    ctx.fillText("Non-transferable. Valid for one registered family only.", PAD, 444);

    // ─── RIGHT PANEL: CNTS Seal ────────────────────────────────────
    const sx = rx, sy = ry;

    // Outer seal ring
    ctx.beginPath();
    ctx.arc(sx, sy, 68, 0, Math.PI * 2);
    const sealRingGrad = ctx.createRadialGradient(sx, sy, 44, sx, sy, 68);
    sealRingGrad.addColorStop(0, "rgba(245,158,11,0.0)");
    sealRingGrad.addColorStop(0.7, "rgba(245,158,11,0.12)");
    sealRingGrad.addColorStop(1, "rgba(245,158,11,0.25)");
    ctx.fillStyle = sealRingGrad;
    ctx.fill();
    ctx.strokeStyle = "rgba(245,158,11,0.35)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Inner seal ring
    ctx.beginPath();
    ctx.arc(sx, sy, 52, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(245,158,11,0.18)";
    ctx.lineWidth = 0.7;
    ctx.stroke();

    // Seal text along top arc
    ctx.save();
    ctx.translate(sx, sy);
    const sealLabel = "COURAGE NATIONAL TALENT SEARCH";
    const charCount = sealLabel.length;
    const arcRadius = 58;
    const startAngle = -Math.PI * 0.75;
    const totalArc = Math.PI * 1.15;
    ctx.font = "600 6.5px Arial, sans-serif";
    ctx.fillStyle = "rgba(245,158,11,0.65)";
    for (let i = 0; i < charCount; i++) {
      const charAngle = startAngle + (totalArc / (charCount - 1)) * i;
      ctx.save();
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(sealLabel[i], -3, -arcRadius);
      ctx.restore();
    }

    // Seal bottom arc text
    const bottomLabel = "FOUNDING EDITION 2026";
    const bCharCount = bottomLabel.length;
    const bStartAngle = Math.PI * 0.1;
    const bTotalArc = Math.PI * 0.8;
    for (let i = 0; i < bCharCount; i++) {
      const charAngle = bStartAngle + (bTotalArc / (bCharCount - 1)) * i;
      ctx.save();
      ctx.rotate(charAngle - Math.PI / 2);
      ctx.fillText(bottomLabel[i], -3, arcRadius);
      ctx.restore();
    }
    ctx.restore();

    // CNTS center text
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(245,158,11,0.9)";
    ctx.font = "700 22px 'Georgia', serif";
    ctx.fillText("CNTS", sx, sy + 8);
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "500 8px Arial, sans-serif";
    ctx.letterSpacing = "3px";
    ctx.fillText("2026", sx, sy + 26);
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left";

    // ─── Bottom holographic strip ──────────────────────────────────
    const holo = ctx.createLinearGradient(0, H - 22, W, H - 22);
    holo.addColorStop(0,    "rgba(0,0,0,0)");
    holo.addColorStop(0.08, "rgba(139,92,246,0.4)");
    holo.addColorStop(0.22, "rgba(59,130,246,0.5)");
    holo.addColorStop(0.38, "rgba(16,185,129,0.45)");
    holo.addColorStop(0.5,  "rgba(245,158,11,0.55)");
    holo.addColorStop(0.62, "rgba(239,68,68,0.35)");
    holo.addColorStop(0.78, "rgba(139,92,246,0.4)");
    holo.addColorStop(0.92, "rgba(59,130,246,0.3)");
    holo.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = holo;
    ctx.fillRect(0, H - 22, W, 22);

    // Footer micro text
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.font = "400 7px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("CNTS · FOUNDING EDITION 2026 · thecouragelibrary.com · Non-transferable credential", W / 2, H - 7);
    ctx.textAlign = "left";

    const url = cvs.toDataURL("image/png");
    const a = document.createElement("a");
    a.download = `CNTS-Founding-Pass-${submitted.familyId}.png`;
    a.href = url; a.click();
  };

  /* Helper: rounded rectangle path */
  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    r: number | { tl: number; tr: number; br: number; bl: number }
  ) {
    const rad = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
    ctx.beginPath();
    ctx.moveTo(x + rad.tl, y);
    ctx.lineTo(x + w - rad.tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad.tr);
    ctx.lineTo(x + w, y + h - rad.br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad.br, y + h);
    ctx.lineTo(x + rad.bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad.bl);
    ctx.lineTo(x, y + rad.tl);
    ctx.quadraticCurveTo(x, y, x + rad.tl, y);
    ctx.closePath();
  }

  if (!mounted) return (
    <div className="min-h-screen bg-[#F8FAFF] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-800 rounded-full animate-spin" />
    </div>
  );

  /* ── POST-SUBMIT DASHBOARD ────────────────────────────────── */
  if (submitted) return (
    <main className="min-h-screen mesh-bg">
      <Navbar theme="light" />
      <canvas ref={canvasRef} className="hidden" />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-20 sm:pb-28 space-y-6 sm:space-y-8 animate-slide-up">

        {/* Success banner */}
        <div className="card-primary text-center space-y-5 py-8 sm:py-12">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto">
            <Check size={26} className="text-emerald-600 stroke-[2.5]" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Founding Registry Confirmed</p>
            <h1 className="font-display font-bold text-2xl sm:text-4xl text-slate-900">
              Welcome, {submitted.parentName}!
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Your Founding Family seat is reserved. We&apos;ll notify you on WhatsApp the moment registrations open.
            </p>
          </div>

          <div className="inline-flex flex-col items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl px-6 sm:px-8 py-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Family ID</span>
            <span className="text-xl sm:text-2xl font-black font-mono text-emerald-600 tracking-wider">{submitted.familyId}</span>
          </div>

          <div className="flex flex-col gap-3 justify-center pt-2 max-w-xs mx-auto sm:max-w-none sm:flex-row">
            <button onClick={downloadCard} className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto">
              <Download size={15} /> Download Digital Pass
            </button>
            {registrationIsOpen && (
              <a href="/register" className="btn-outline w-full sm:w-auto flex items-center justify-center gap-2">
                <ArrowRight size={15} /> Register Now
              </a>
            )}
          </div>
        </div>

        {/* Countdown */}
        <div className="card-primary space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">Live Countdown</p>
              <h2 className="font-display font-bold text-xl text-slate-900 mt-0.5">Registrations Open In</h2>
            </div>
            <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            {[
              { v: countdown.days,    l: "Days"  },
              { v: countdown.hours,   l: "Hrs"   },
              { v: countdown.minutes, l: "Mins"  },
              { v: countdown.seconds, l: "Secs"  },
            ].map(({ v, l }) => (
              <div key={l} className="card-data text-center px-1">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{String(v).padStart(2, "0")}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{l}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">Registration opens on <strong className="text-slate-600">{TIMELINE_LABELS.REGISTRATION_OPEN}</strong> at 10:00 AM.</p>
        </div>

        {/* Timeline steps */}
        <div className="card-primary space-y-4">
          <h2 className="font-display font-bold text-xl text-slate-900">CNTS Official Timeline</h2>
          <div className="space-y-3">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full shrink-0 ${step.color} ${step.active ? "ring-4 ring-emerald-100" : ""}`} />
                <div className="flex-1 flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className={`text-sm font-semibold ${step.active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</span>
                  <span className={`text-xs font-bold font-mono ${step.active ? "text-emerald-600" : "text-slate-400"}`}>{step.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free worksheets */}
        <div className="card-primary space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <BookOpen size={18} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Unlocked For You</p>
              <h2 className="font-display font-bold text-lg text-slate-900">Free Reasoning Worksheets</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[5, 6, 7, 8].map(cls => (
              <a key={cls} href={`/sample-papers/class${cls}.pdf`} download
                className="card-data flex flex-col items-center gap-2 text-center hover:border-blue-200 hover:bg-blue-50/20 group transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Class {cls}</span>
                <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Download PDF</span>
              </a>
            ))}
          </div>
        </div>

      </section>
      <Footer />
    </main>
  );

  /* ── PRE-REGISTRATION LANDING ──────────────────────────────── */
  return (
    <main className="min-h-screen mesh-bg overflow-x-hidden">
      <Navbar theme="light" />
      <canvas ref={canvasRef} className="hidden" />

      {/* ── HERO ── */}
      <section className="relative pt-28 sm:pt-36 pb-12 sm:pb-20 overflow-hidden">
        {/* Background decorative blurs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: "linear-gradient(#1E40AF 1px, transparent 1px), linear-gradient(90deg, #1E40AF 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full">
            <Sparkles size={13} className="text-blue-700" />
            <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">CNTS 2026 · Founding Families Program</span>
          </div>

          {/* Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-7xl text-slate-900 leading-[1.06] tracking-tight">
            Become a<br />
            <span className="gradient-text">Founding Family.</span>
          </h1>

          <p className="text-slate-500 text-sm sm:text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            India&apos;s premier talent discovery program opens registrations on{" "}
            <strong className="text-slate-700">July 15, 2026</strong>. Join today to secure early priority access, free resources, and your exclusive Founding Family ID.
          </p>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <div className="flex -space-x-2">
              {["#3B82F6","#8B5CF6","#10B981","#F59E0B","#EF4444"].map((color, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[#F8FAFF] flex items-center justify-center text-white text-[9px] font-bold" style={{ background: color }}>
                  {["A","R","S","M","K"][i]}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 sm:px-4 py-2 shadow-sm text-xs font-semibold text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>{familyCount.toLocaleString()} families already registered</span>
            </div>
          </div>

          {/* Countdown */}
          <div className="card-glass flex flex-col items-center gap-4 p-5 sm:p-6 rounded-2xl mx-auto w-full max-w-sm sm:max-w-md shadow-lg">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Registrations Open In</p>
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
              {[
                { v: countdown.days,    l: "Days" },
                { v: countdown.hours,   l: "Hrs"  },
                { v: countdown.minutes, l: "Mins" },
                { v: countdown.seconds, l: "Secs" },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="card-data rounded-xl py-2 sm:py-3">
                    <div className="text-xl sm:text-2xl font-black font-mono text-slate-900">{String(v).padStart(2, "0")}</div>
                  </div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-1.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Registration open banner — shown only after July 15 */}
          {registrationIsOpen && (
            <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700">Registrations are now open!</span>
              <a href="/register" className="text-xs font-black text-emerald-800 underline underline-offset-2">Register →</a>
            </div>
          )}

          {/* Progress line */}
          <div className="max-w-xs mx-auto space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>Platform Setup Progress</span>
              <span className="text-blue-700">58%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-[58%] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
            </div>
          </div>

        </div>
      </section>

      {/* ── FORM + BENEFITS ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8 items-start">

        {/* Benefits list — left 3 cols, shown AFTER form on mobile */}
        <div className="lg:col-span-3 space-y-4 order-last lg:order-first">
          <div className="space-y-1 mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Cohort Perks</p>
            <h2 className="font-display font-bold text-2xl text-slate-900">Founding Family Benefits</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BENEFITS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card-primary group hover:border-blue-200 transition-all duration-200 cursor-default">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{title}</p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mini timeline */}
          <div className="card-primary space-y-4 mt-6">
            <h3 className="font-display font-bold text-base text-slate-900">Official CNTS Timeline</h3>
            <div className="relative">
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-slate-200" />
              <div className="space-y-4">
                {TIMELINE_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 pl-4 relative">
                    <div className={`absolute left-0 w-2.5 h-2.5 rounded-full border-2 border-white shrink-0 ${step.color}`} />
                    <p className={`text-sm font-semibold flex-1 ${step.active ? "text-slate-900" : "text-slate-500"}`}>{step.label}</p>
                    <span className={`text-xs font-bold font-mono ${step.active ? "text-emerald-600" : "text-slate-400"}`}>{step.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form — shown FIRST on mobile via order, sticky on desktop */}
        <div className="lg:col-span-2 lg:sticky lg:top-24 space-y-4 order-first lg:order-last">

          {/* Live preview card — Premium two-panel credential */}
          <div className="rounded-2xl overflow-hidden shadow-2xl relative select-none" style={{ background: "#05080f", border: "1px solid rgba(245,158,11,0.18)" }}>

            {/* Gold foil top strip */}
            <div className="h-[5px] w-full" style={{ background: "linear-gradient(90deg, #7c2d12, #d97706, #fef3c7, #fbbf24, #fef3c7, #d97706, #92400e)" }} />

            {/* Two-panel body */}
            <div className="flex min-h-[230px] sm:min-h-[270px] relative overflow-hidden">

              {/* RIGHT PANEL — guilloche security pattern */}
              <div className="absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden" style={{ background: "#0a0f1e" }}>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 270">
                  {Array.from({ length: 22 }, (_, i) => {
                    const y = (270 / 22) * i + 6;
                    const amp = 3 + (i % 3) * 2;
                    const freq = 0.04 + (i % 5) * 0.006;
                    const d = Array.from({ length: 100 }, (_, j) => {
                      const x = j * 2;
                      const py = y + Math.sin(x * freq + i * 0.8) * amp;
                      return `${j === 0 ? "M" : "L"}${x},${py.toFixed(2)}`;
                    }).join(" ");
                    return <path key={i} d={d} fill="none"
                      stroke={i % 6 === 0 ? "rgba(245,158,11,0.14)" : "rgba(255,255,255,0.055)"}
                      strokeWidth={i % 4 === 0 ? "0.8" : "0.45"} />;
                  })}
                  {[65, 53, 41, 29, 17].map(r => (
                    <circle key={r} cx="100" cy="135" r={r} fill="none"
                      stroke={r === 65 ? "rgba(245,158,11,0.1)" : "rgba(245,158,11,0.04)"} strokeWidth="0.5" />
                  ))}
                  {Array.from({ length: 16 }, (_, i) => {
                    const a = (Math.PI * 2 / 16) * i;
                    return <line key={i}
                      x1={(100 + Math.cos(a) * 14).toFixed(1)} y1={(135 + Math.sin(a) * 14).toFixed(1)}
                      x2={(100 + Math.cos(a) * 68).toFixed(1)} y2={(135 + Math.sin(a) * 68).toFixed(1)}
                      stroke="rgba(245,158,11,0.04)" strokeWidth="0.4" />;
                  })}
                </svg>

                {/* CNTS Seal */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[72px] h-[72px] sm:w-[84px] sm:h-[84px] flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
                      <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(245,158,11,0.28)" strokeWidth="0.9"/>
                      <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(245,158,11,0.14)" strokeWidth="0.6"/>
                      <defs>
                        <path id="cArc" d="M 8,50 A 42,42 0 0,1 92,50"/>
                        <path id="cArcB" d="M 14,56 A 37,37 0 0,0 86,56"/>
                      </defs>
                      <text fontSize="7" fill="rgba(245,158,11,0.65)" fontFamily="Arial" letterSpacing="1.2">
                        <textPath href="#cArc" startOffset="2%">COURAGE NATIONAL TALENT SEARCH</textPath>
                      </text>
                      <text fontSize="6.5" fill="rgba(245,158,11,0.48)" fontFamily="Arial" letterSpacing="1">
                        <textPath href="#cArcB" startOffset="10%">FOUNDING EDITION 2026</textPath>
                      </text>
                    </svg>
                    <div className="text-center z-10 relative">
                      <div className="text-[13px] sm:text-[15px] font-bold" style={{ color: "rgba(245,158,11,0.88)", fontFamily: "Georgia, serif" }}>CNTS</div>
                      <div className="text-[6px] font-medium tracking-[3px] mt-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>2026</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diagonal divider */}
              <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                right: "calc(40% - 1px)",
                width: "1px",
                background: "linear-gradient(to bottom, transparent 0%, rgba(245,158,11,0.45) 20%, rgba(245,158,11,0.45) 80%, transparent 100%)",
              }} />

              {/* LEFT PANEL */}
              <div className="w-[62%] p-4 sm:p-5 flex flex-col justify-between relative z-10 gap-3">

                {/* Brand */}
                <div>
                  <p className="text-[8px] sm:text-[9px] font-semibold tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.48)" }}>
                    Courage National Talent Search
                  </p>
                  <p className="text-[7px] font-medium tracking-[0.15em] uppercase mt-0.5" style={{ color: "rgba(245,158,11,0.58)" }}>
                    Founding Edition 2026
                  </p>
                  <div className="mt-2.5 h-px" style={{ background: "linear-gradient(90deg, rgba(245,158,11,0.55), transparent)" }} />
                </div>

                {/* Title */}
                <div>
                  <p className="text-[10px] font-light leading-none" style={{ color: "#fef3c7", fontFamily: "Georgia, serif" }}>Founding</p>
                  <p className="text-sm sm:text-[15px] font-bold leading-tight mt-0.5" style={{ color: "#fbbf24", fontFamily: "Georgia, serif" }}>
                    Family Member
                  </p>
                  <p className="text-[7px] italic mt-1" style={{ color: "rgba(255,255,255,0.18)", fontFamily: "Georgia, serif" }}>
                    Since July 2026 · Pre-Launch Pass
                  </p>
                </div>

                {/* Member name */}
                <div>
                  <p className="text-[7px] font-semibold tracking-[0.22em] uppercase mb-1" style={{ color: "rgba(245,158,11,0.52)" }}>
                    Registered Member
                  </p>
                  <p className="text-sm sm:text-base font-bold truncate" style={{ color: "#f8fafc", fontFamily: "Georgia, serif" }}>
                    {parentName.trim()
                      ? parentName.split(" ").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ")
                      : <span style={{ color: "rgba(255,255,255,0.18)", fontStyle: "italic" }}>Your Name Here…</span>
                    }
                  </p>

                  <div className="mt-2.5 h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

                  {/* Family ID */}
                  <div className="mt-2 inline-flex flex-col rounded-lg px-2.5 py-1.5" style={{ background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.17)" }}>
                    <span className="text-[6.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: "rgba(52,211,153,0.5)" }}>Family ID</span>
                    <span className="text-[11px] sm:text-xs font-bold font-mono mt-0.5" style={{ color: "#34d399" }}>
                      CNTS-FF-XXXXX
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Holographic strip */}
            <div className="h-[6px] w-full" style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.5) 10%, rgba(59,130,246,0.55) 25%, rgba(16,185,129,0.5) 40%, rgba(245,158,11,0.6) 55%, rgba(239,68,68,0.4) 70%, rgba(139,92,246,0.45) 85%, transparent 100%)"
            }} />

            {/* Footer */}
            <div className="px-4 py-2" style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              <p className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.28)" }}>
                ← Your name appears on the pass as you type
              </p>
            </div>
          </div>


          {/* Form card */}
          <div className="card-primary space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Become a Founding Family</h3>
              <p className="text-xs text-slate-400 mt-0.5">No payment today. Just your details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold flex items-center gap-2">
                  <span className="shrink-0">⚠</span> {submitError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Parent / Guardian Name</label>
                <input
                  type="text" required placeholder="e.g. Anil Kumar"
                  value={parentName} onChange={e => setParentName(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 font-mono">+91</span>
                  <input
                    type="tel" required pattern="[6-9][0-9]{9}" maxLength={10}
                    placeholder="10-digit number"
                    value={mobileNumber} onChange={e => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full h-11 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-mono"
                  />
                </div>
                <p className="text-[9px] text-slate-400">Only critical exam alerts — no spam, ever.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                <input
                  type="email" required placeholder="e.g. anil@gmail.com"
                  value={parentEmail} onChange={e => setParentEmail(e.target.value)}
                  className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-secondary w-full gap-2 mt-1 text-sm sm:text-base">
                {submitting ? "Registering..." : "Become a Founding Family"}
                {!submitting && <ArrowRight size={15} />}
              </button>
            </form>

            <div className="flex items-center justify-center gap-4 pt-2 text-[10px] text-slate-400 font-medium border-t border-slate-100">
              <span className="flex items-center gap-1"><MessageSquare size={10} className="text-emerald-600" /> WhatsApp Confirmed</span>
              <span>·</span>
              <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-blue-600" /> Secure &amp; Free</span>
            </div>
          </div>
        </div>

      </section>

      {/* ── REASONING PUZZLE ── */}
      <section className="bg-white border-y border-slate-200 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6 sm:space-y-8 text-center">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">A Taste of CNTS</p>
            <h2 className="font-display font-bold text-3xl text-slate-900">Try a Sample Puzzle</h2>
            <p className="text-slate-500 text-sm leading-relaxed">CNTS measures logical reasoning, not rote memory. Can you spot the pattern?</p>
          </div>

          <div className="card-primary text-center space-y-6 text-left">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Find the next number in the sequence</p>
              <p className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-widest break-words">
                2, 6, 12, 20, 30,{" "}
                <span className={puzzleAnswer === 42 ? "text-emerald-600" : "text-blue-600"}>?</span>
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[36, 40, 42, 45].map(ans => {
                const selected = puzzleAnswer === ans;
                const correct  = ans === 42;
                return (
                  <button
                    key={ans}
                    onClick={() => setPuzzleAnswer(ans)}
                    className={`py-3 sm:py-3 text-sm sm:text-base font-black rounded-xl border transition-all cursor-pointer active:scale-95 ${
                      selected
                        ? correct
                          ? "bg-emerald-50 border-emerald-400 text-emerald-700"
                          : "bg-red-50 border-red-400 text-red-700"
                        : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {ans}
                  </button>
                );
              })}
            </div>

            {puzzleAnswer !== null && (
              <div className={`rounded-xl p-4 text-sm font-medium leading-relaxed flex items-start gap-3 animate-slide-up ${
                puzzleAnswer === 42
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-amber-50 border border-amber-200 text-amber-800"
              }`}>
                <span className="text-base mt-0.5">{puzzleAnswer === 42 ? "🎉" : "🤔"}</span>
                <p>
                  {puzzleAnswer === 42
                    ? "Correct! The differences are +4, +6, +8, +10, +12 — giving 30 + 12 = 42. CNTS measures exactly this kind of pattern intelligence."
                    : "Not quite. Look at the differences between numbers: +4, +6, +8, +10 — do you see the pattern? Try again!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOUNDER QUOTE ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-center space-y-5 sm:space-y-6">
        <div className="relative w-16 h-16 mx-auto">
          <Image
            src="/images/logo.png"
            alt="Courage Library Logo"
            fill
            className="object-contain"
          />
        </div>
        <p className="text-amber-600 text-[10px] font-bold uppercase tracking-widest">Why we&apos;re building CNTS</p>
        <blockquote className="font-display font-semibold text-lg sm:text-2xl text-slate-800 leading-relaxed px-2">
          &ldquo;Every child deserves an opportunity to discover their strengths beyond marks. Traditional systems evaluate memory — CNTS maps potential.&rdquo;
        </blockquote>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">— Courage Library Academic Board</p>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white border-t border-slate-200 py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-700">Questions</p>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">Frequently Asked</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div key={i} className="card-primary overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="w-full flex justify-between items-start sm:items-center gap-3 sm:gap-4 cursor-pointer py-1"
                  >
                    <span className="text-sm font-bold text-slate-800 text-left leading-snug">{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-400 shrink-0 mt-0.5 sm:mt-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && (
                    <div className="pt-3 mt-3 border-t border-slate-100 text-sm text-slate-500 leading-relaxed animate-slide-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-slate-400 pt-4">
            Still have questions?{" "}
            <a href="/contact" className="text-blue-700 font-semibold hover:underline">Contact us →</a>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
