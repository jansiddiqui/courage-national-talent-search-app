import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  PlayCircle,
  Share2,
  Globe,
  Link2,
  MessageSquare,
  Phone,
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
  "Important Links": [
    { label: "Important Dates", href: "/timeline" },
    { label: "Exam Syllabus", href: "/prepare" },
    { label: "Download Admit Card", href: "/admit-card-portal" },
    { label: "Results Portal", href: "/results" },
    { label: "Certificate Verification", href: "/verify" },
    { label: "FAQs & Support", href: "/faq" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Data Deletion Instructions", href: "/data-deletion" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main footer */}
        <div className="py-12 md:py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-8 border-b border-white/5">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 flex flex-col space-y-4">
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
                <div className="font-display font-bold text-white text-[15px]">
                  CNTS
                </div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                  Founding Edition 2026
                </div>
              </div>
            </div>
            <p className="text-xs md:text-sm leading-relaxed text-slate-500 max-w-xs">
              <strong>Courage National Talent Search (CNTS) is an official program operated by Courage Library.</strong> We help parents and students understand true potential — beyond marks and memory.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 text-xs">
              <a
                href="mailto:cnts@thecouragelibrary.com"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <Mail size={13} className="text-blue-500 shrink-0" />
                <div>
                  <span className="text-slate-550 block text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5">Support Email</span>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">cnts@thecouragelibrary.com</span>
                </div>
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <MessageSquare size={13} className="text-blue-500 shrink-0" />
                <div>
                  <span className="text-slate-550 block text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5">Website Support</span>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">Submit Support Ticket</span>
                </div>
              </Link>
              <a
                href="tel:+918360603173"
                className="flex items-center gap-2.5 hover:text-white transition-colors group"
              >
                <Phone size={13} className="text-blue-400 shrink-0" />
                <div>
                  <span className="text-slate-550 block text-[8px] font-bold uppercase tracking-wider leading-none mb-0.5">Call Support (Calls Only)</span>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">+91 83606 03173</span>
                </div>
              </a>
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Mon-Sat, 9 AM - 6 PM (Replies within 2 hours)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-500">
                <MapPin size={13} className="text-slate-600 mt-0.5 shrink-0" />
                <span className="text-[11px] leading-tight">Courage National Talent Search · Kanpur, UP</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="col-span-2 sm:col-span-1 lg:col-span-1">
              <h4 className="font-semibold text-white text-sm mb-3.5">
                {category}
              </h4>
              <ul className="space-y-2 text-xs">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="hover:text-white transition-colors hover:underline underline-offset-4"
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
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="space-y-1">
            <p>© 2026 Courage National Talent Search. All rights reserved.</p>
            <p className="text-[10px] text-slate-500 font-medium">Courage National Talent Search (CNTS) — Official Program of Courage Library</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>Platform operational · Founding Edition 2026</span>
          </div>
          <p>CNTS is not affiliated with government NTSE/NTS programs.</p>
        </div>
      </div>
    </footer>
  );
}
