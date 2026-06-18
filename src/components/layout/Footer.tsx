import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  PlayCircle,
  Share2,
  Globe,
  Link2,
} from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Home", href: "/" },
    { label: "About CNTS", href: "/about" },
    { label: "For Schools", href: "/for-schools" },
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
              India&apos;s premier talent discovery platform. We help parents and
              students understand true potential — beyond marks and memory.
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
              <div className="flex items-center gap-2.5 text-[11px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Mon-Sat, 9 AM - 6 PM (Replies within 2 hours)</span>
              </div>
              <div className="flex items-start gap-2.5 text-slate-500">
                <MapPin size={13} className="text-slate-600 mt-0.5 shrink-0" />
                <span className="text-[11px] leading-tight">Courage Education Pvt. Ltd. · Kanpur, UP</span>
              </div>
            </div>

            {/* WhatsApp updates connection button */}
            <div className="pt-2">
              <a
                href="https://whatsapp.com/channel/0029Vb8NYaiEquiRSLwDD338"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-2.5 px-5 py-2.5 overflow-hidden rounded-xl bg-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 transition-all active:scale-[0.98] shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="absolute inset-0 bg-emerald-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
                <svg className="w-4 h-4 fill-emerald-500 relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.413 9.863-9.847.001-2.63-1.019-5.101-2.871-6.958C16.612 1.943 14.137 1.94 12.01 1.94c-5.44 0-9.866 4.414-9.869 9.848-.002 1.71.453 3.382 1.32 4.874L2.44 21.908l5.207-1.366z"/>
                </svg>
                <span className="text-[13px] font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors relative z-10">Subscribe to WhatsApp Channel</span>
              </a>
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
          <p>© 2026 Courage Education Pvt. Ltd. All rights reserved.</p>
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
