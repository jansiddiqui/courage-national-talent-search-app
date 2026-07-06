import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Award,
} from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "Why CNTS?", href: "/why-cnts" },
    { label: "About CNTS", href: "/about" },
    { label: "For Schools", href: "/for-schools" },
    { label: "Blog & Resources", href: "/blog" },
    { label: "Contact Us", href: "/contact" },
  ],
  "Exam & Prep": [
    { label: "Exam Syllabus", href: "/prepare" },
    { label: "Exam Pattern", href: "/exam-pattern" },
    { label: "Test Day Guidelines", href: "/exam-instructions" },
    { label: "Sample Brain Report", href: "/sample-report" },
    { label: "Parent's Guide", href: "/parent-guide" },
    { label: "Download Admit Card", href: "/admit-card-portal" },
  ],
  "Recognition & Updates": [
    { label: "Prizes & Rankings", href: "/prizes" },
    { label: "Achievers Hall of Fame", href: "/achievers" },
    { label: "Important Dates", href: "/timeline" },
    { label: "Notice Board", href: "/announcements" },
    { label: "WhatsApp Community", href: "/updates" },
    { label: "Results Portal", href: "/results" },
  ],
  "Legal & Support": [
    { label: "FAQs & Support", href: "/faq" },
    { label: "Verify Certificate", href: "/verify" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Data Deletion", href: "/data-deletion" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#050b21] text-slate-400 border-t border-blue-950/40 relative overflow-hidden">
      {/* Soft blue footer ambient backlight */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Directory */}
        <div className="py-12 md:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 border-b border-white/[0.06]">
          
          {/* Brand Info & Contacts Section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 flex flex-col space-y-6">
            
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9">
                <Image
                  src="/images/logo.png"
                  alt="CNTS Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div className="font-display font-black text-white text-base leading-none tracking-tight">
                  CNTS
                </div>
                <span className="text-[9px] text-blue-400 font-extrabold tracking-widest uppercase block mt-1">
                  Founding Edition 2026
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400 max-w-sm font-medium">
              <strong>Courage National Talent Search (CNTS) is an official program operated by Courage Library.</strong> We help parents and students understand true potential — beyond marks and memory.
            </p>

            {/* Premium Support Contacts stack */}
            <div className="space-y-3.5 pt-2">
              <a
                href="mailto:cnts@thecouragelibrary.com"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                  <Mail size={14} />
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">
                    Support Email
                  </span>
                  <span className="text-xs font-semibold text-slate-350 group-hover:text-white transition-colors">
                    cnts@thecouragelibrary.com
                  </span>
                </div>
              </a>

              <Link
                href="/contact"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                  <MessageSquare size={14} />
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">
                    Website Support
                  </span>
                  <span className="text-xs font-semibold text-slate-350 group-hover:text-white transition-colors">
                    Submit Support Ticket
                  </span>
                </div>
              </Link>

              <a
                href="tel:+918360603173"
                className="flex items-center gap-3 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all">
                  <Phone size={14} />
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] font-bold uppercase tracking-wider leading-none mb-0.5">
                    Call Support
                  </span>
                  <span className="text-xs font-semibold text-slate-350 group-hover:text-white transition-colors">
                    +91 83606 03173
                  </span>
                </div>
              </a>

              {/* Status details */}
              <div className="space-y-2 pt-2 border-t border-white/[0.05] max-w-xs">
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                  <span>Mon-Sat, 9 AM - 6 PM (Replies &lt; 2h)</span>
                </div>
                <div className="flex items-start gap-2 text-[10px] text-slate-500 font-medium">
                  <MapPin size={12} className="text-slate-600 mt-0.5 shrink-0" />
                  <span className="leading-tight">Courage National Talent Search · Kanpur, UP</span>
                </div>
              </div>

            </div>
          </div>

          {/* Links Directory columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-1 lg:col-span-1">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-slate-400 hover:text-blue-400 transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] text-slate-500">
          
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 Courage National Talent Search. All rights reserved.</p>
            <p className="text-[10px] text-slate-600 font-medium">
              Courage National Talent Search (CNTS) — Official Program of Courage Library
            </p>
          </div>

          {/* SaaS Operational Status Badge */}
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-emerald-400 font-mono shrink-0">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shrink-0" />
            <span>Platform operational · Founding Edition 2026</span>
          </div>

          <p className="text-center md:text-right max-w-xs text-[10px] leading-relaxed text-slate-600">
            CNTS is an independent diagnostic assessment operated by Courage Library and is not affiliated with government NTSE/NTS exams.
          </p>
          
        </div>

      </div>
    </footer>
  );
}
