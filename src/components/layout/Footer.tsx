import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MessageSquare } from "lucide-react";

const footerNav = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Why CNTS?", href: "/why-cnts" },
      { label: "About CNTS", href: "/about" },
      { label: "For Schools", href: "/for-schools" },
      { label: "Blog & Resources", href: "/blog" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Exam & Prep",
    links: [
      { label: "Exam Syllabus", href: "/prepare" },
      { label: "Exam Pattern", href: "/exam-pattern" },
      { label: "Test Day Guidelines", href: "/exam-instructions" },
      { label: "Sample Brain Report", href: "/sample-report" },
      { label: "Parent's Guide", href: "/parent-guide" },
      { label: "Download Admit Card", href: "/admit-card-portal" },
    ],
  },
  {
    title: "Recognition",
    links: [
      { label: "Prizes & Rankings", href: "/prizes" },
      { label: "Achievers Hall of Fame", href: "/achievers" },
      { label: "Important Dates", href: "/timeline" },
      { label: "Notice Board", href: "/announcements" },
      { label: "WhatsApp Community", href: "/updates" },
      { label: "Results Portal", href: "/results" },
    ],
  },
  {
    title: "Legal & Support",
    links: [
      { label: "FAQs & Support", href: "/faq" },
      { label: "Verify Certificate", href: "/verify" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Data Deletion", href: "/data-deletion" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#04081a] overflow-hidden">

      {/* Subtle ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-700/6 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-700/5 rounded-full blur-3xl" />
      </div>


      {/* Main Navigation Grid */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="py-14 flex flex-col lg:grid lg:grid-cols-[1.8fr_1fr_1fr_1fr_1fr] gap-10 lg:gap-6 border-b border-white/[0.05]">

          {/* Brand Column */}
          <div className="space-y-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative w-8 h-8 shrink-0">
                <Image src="/images/logo.png" alt="CNTS Logo" fill className="object-contain" />
              </div>
              <div>
                <div className="font-display font-black text-white text-[14px] leading-none tracking-tight">CNTS</div>
                <span className="text-[8.5px] text-blue-400 font-extrabold tracking-widest uppercase block mt-0.5">
                  Founding Edition 2026
                </span>
              </div>
            </Link>

            {/* Brand description */}
            <p className="text-[12.5px] text-slate-500 leading-relaxed max-w-[260px] font-medium">
              An official talent discovery program of{" "}
              <span className="text-slate-300 font-semibold">Courage Library</span>.
              We help families understand a child&apos;s true cognitive potential — beyond marks and memory.
            </p>

            {/* Contact list */}
            <div className="space-y-2.5">
              <a
                href="mailto:cnts@thecouragelibrary.com"
                className="flex items-center gap-2.5 text-[11.5px] text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-200 shrink-0">
                  <Mail size={11} />
                </div>
                cnts@thecouragelibrary.com
              </a>
              <a
                href="tel:+918360603173"
                className="flex items-center gap-2.5 text-[11.5px] text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-200 shrink-0">
                  <Phone size={11} />
                </div>
                +91 83606 03173
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2.5 text-[11.5px] text-slate-500 hover:text-slate-200 transition-colors group"
              >
                <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent transition-all duration-200 shrink-0">
                  <MessageSquare size={11} />
                </div>
                Submit Support Ticket
              </Link>
            </div>
          </div>

          {/* Nav Link Columns — 2-col grid on mobile, 4-col on lg */}
          <div className="grid grid-cols-2 lg:contents gap-x-6 gap-y-10">
            {footerNav.map((col) => (
              <div key={col.title}>
                <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-5">
                  {col.title}
                </h5>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[12.5px] text-slate-600 hover:text-slate-200 font-medium transition-colors duration-150 block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-[10.5px] text-slate-700">
            <span>© 2026 Courage National Talent Search. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-800">·</span>
            <span>Official Program of Courage Library</span>
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/[0.07] border border-emerald-500/15 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold text-emerald-500 tracking-wide">
              Platform Operational · 2026
            </span>
          </div>

          <p className="text-[10px] text-slate-800 text-center sm:text-right max-w-[240px] leading-relaxed">
            Not affiliated with government NTSE/NTS exams.
          </p>
        </div>
      </div>
    </footer>
  );
}
