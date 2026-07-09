import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import JsonLd from "@/components/shared/JsonLd";
import { getLatestBlogPosts } from "@/lib/blog";
import { 
  Sparkles, 
  Brain, 
  Trophy, 
  Star, 
  Shield, 
  ArrowRight, 
  CheckCircle2, 
  BookOpen, 
  School, 
  Users, 
  Mail, 
  Globe, 
  CalendarDays, 
  Layers, 
  Compass, 
  GraduationCap 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
  description: "Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library for school students across India.",
  keywords: [
    "CNTS",
    "Courage National Talent Search",
    "Courage Library",
    "Talent Search Exam",
    "Student Assessment",
    "School Assessment",
    "National Talent Discovery Program"
  ],
  alternates: {
    canonical: "https://thecouragelibrary.com/cnts",
  },
  openGraph: {
    title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
    description: "Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library for school students across India.",
    url: "https://thecouragelibrary.com/cnts",
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "CNTS Open Graph Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courage National Talent Search (CNTS) | Official Program by Courage Library",
    description: "Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library for school students across India.",
    images: ["/og-cnts.png"],
  },
};

export default function CntsLandingPage() {
  const latestPosts = getLatestBlogPosts(3);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the Courage National Talent Search (CNTS)?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The Courage National Talent Search (CNTS) is the official talent discovery and assessment program operated by Courage Library for students in Classes 5–8 across India."
        }
      },
      {
        "@type": "Question",
        "name": "Who can participate in CNTS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Students currently studying in Classes 5, 6, 7, and 8 from any recognized school board in India (CBSE, ICSE, State Boards, or International Boards) are eligible."
        }
      },
      {
        "@type": "Question",
        "name": "What is the registration fee for CNTS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The registration fee is ₹99 per student. It is all-inclusive and covers access to mock assessments, final online test, detailed cognitive profile report, and verified merit certificate."
        }
      },
      {
        "@type": "Question",
        "name": "How are CNTS results and certificates released?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "National rankings are published on 28 July 2026. Detailed diagnostic reports and digital verifiable certificates are unlocked in the Parent Dashboard on 30 July 2026."
        }
      },
      {
        "@type": "Question",
        "name": "Can schools participate in CNTS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, schools can onboard as official partners. Partner schools receive school dashboard access, bulk onboarding tools via Excel, and detailed institutional diagnostics comparison matrices."
        }
      }
    ]
  };

  const pageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://thecouragelibrary.com/cnts/#webpage",
    "url": "https://thecouragelibrary.com/cnts",
    "name": "Courage National Talent Search (CNTS) | Official Program by Courage Library",
    "isPartOf": {
      "@type": "WebSite",
      "@id": "https://thecouragelibrary.com/#website",
      "name": "Courage Library",
      "url": "https://thecouragelibrary.com"
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://thecouragelibrary.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "CNTS",
        "item": "https://thecouragelibrary.com/cnts"
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-600">
      <JsonLd schema={[faqSchema, pageSchema, breadcrumbSchema]} />
      <Navbar theme="dark" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white pt-40 pb-20 md:pb-32 px-6">
        {/* Sleek background decoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-800/10 rounded-full blur-3xl pointer-events-none -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#FFFFFF 1px, transparent 1px), linear-gradient(90deg, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-8 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 uppercase tracking-widest mx-auto">
            <Sparkles size={12} className="text-amber-400" />
            Official Program of Courage Library
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-white leading-tight max-w-4xl mx-auto">
            Courage National Talent Search (CNTS)
          </h1>
          
          <p className="text-lg sm:text-xl font-medium text-blue-100 max-w-2xl mx-auto">
            India&apos;s Talent Discovery and Assessment Program for School Students
          </p>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            <strong>Courage National Talent Search (CNTS) is an official program operated by Courage Library.</strong> The program is designed to identify, assess, and recognize student talent through structured national-level assessments and talent profiling initiatives.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2 group"
            >
              Register Now
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#about"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-all border border-white/10 flex items-center justify-center"
            >
              View Assessment Details
            </a>
          </div>
        </div>
      </section>

      {/* About CNTS Section */}
      <section id="about" className="py-20 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              What is the Courage National Talent Search?
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="space-y-6 text-slate-650 leading-relaxed text-base sm:text-lg">
            <p>
              The <strong className="text-slate-800">Courage National Talent Search (CNTS)</strong> is the official talent discovery and assessment initiative operated by <strong className="text-slate-800">Courage Library</strong>.
            </p>
            <p>
              The program evaluates school students on critical thinking, cognitive aptitude, analytical reasoning, logical problem solving, and academic readiness. Through a carefully structured online assessment system, the Courage National Talent Search identifies hidden potential and guides students toward future success.
            </p>
            <p>
              CNTS aims to provide meaningful talent recognition, performance insights, official certificates, national rankings, and growth opportunities for students across India. By participating in the Courage National Talent Search, students gain a clear understanding of their strengths across key cognitive domains.
            </p>
          </div>
        </div>
      </section>

      {/* About Courage Library (Visually Prominent Card - Meta Verification Pivot) */}
      <section className="py-20 px-6 bg-gradient-to-b from-slate-50 to-slate-100/50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  Parent Organization
                </div>
                
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">
                  Courage National Talent Search Powered by Courage Library
                </h2>
                
                <div className="space-y-4 text-slate-300 leading-relaxed text-sm sm:text-base">
                  <p>
                    <strong className="text-white">Courage Library</strong> is an educational organization focused on student development, learning resources, assessment systems, mentorship programs, and academic growth initiatives.
                  </p>
                  <p>
                    The <strong className="text-white">Courage National Talent Search (CNTS)</strong> is one of the flagship programs operated, managed, and funded under the Courage Library ecosystem. All registrations, portal systems, student analytics, and certificates are managed directly by Courage Library.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4 flex justify-center">
                <div className="w-40 h-40 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-inner relative overflow-hidden">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 text-2xl font-black text-white font-display">
                    CL
                  </div>
                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Courage Library</span>
                  <span className="text-[9px] text-blue-400 font-semibold mt-1">Official Operator</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Highlights */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Program Highlights
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Key highlights of the Courage National Talent Search (CNTS) program:
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Highlight 1 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Globe size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">National Participation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Open to students from multiple schools across India, establishing a diverse assessment group.
              </p>
            </div>

            {/* Highlight 2 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Brain size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Talent Assessment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Evaluates student aptitude, reasoning, critical thinking, and logical academic readiness.
              </p>
            </div>

            {/* Highlight 3 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Trophy size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Certificates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every candidate in the Courage National Talent Search receives official verified digital certificates.
              </p>
            </div>

            {/* Highlight 4 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Layers size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Student Talent Profile</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Provides a detailed performance-based mapping report detailing cognitive strengths and insights.
              </p>
            </div>

            {/* Highlight 5 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <School size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">School Participation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Offers dedicated onboarding, access dashboards, and support systems for partner schools.
              </p>
            </div>

            {/* Highlight 6 */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all space-y-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                <Compass size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Online Experience</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Simple online registration, active dashboards, and secure digital delivery of results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Participate? */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Who Can Participate?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              The Courage National Talent Search welcomes students to enroll in one of our main student segments:
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Junior */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Junior Category</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tailored for students in <strong className="text-slate-800">Classes 5–6</strong>. Evaluates foundational logic, math patterns, basic reading comprehension, and spatial problem solving.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xs font-semibold text-slate-500">
                <span>Medium: English & Hindi</span>
                <span className="text-blue-700">Founding Edition</span>
              </div>
            </div>

            {/* Senior */}
            <div className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-md transition-all flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center">
                  <GraduationCap size={24} />
                </div>
                <h3 className="font-display font-bold text-2xl text-slate-900">Senior Category</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Tailored for students in <strong className="text-slate-800">Classes 7–8</strong>. Focuses on advanced critical thinking, mathematical reasoning, logic sequences, and scientific aptitude.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-xs font-semibold text-slate-500">
                <span>Medium: English & Hindi</span>
                <span className="text-blue-700">Founding Edition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Timeline */}
      <section className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Assessment Timeline
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Follow the official Courage National Talent Search calendar for the Founding Edition:
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="relative border-l-2 border-blue-200 ml-4 md:ml-32 space-y-12">
            {/* Timeline Item 1 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                    June 15, 2026
                  </span>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-lg">Registration Open</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    National portal opens for parents and partner schools to register student profiles.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                    July 10, 2026
                  </span>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-lg">Admit Card Release</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Parents download entry passes detailing Roll Numbers and exam day instructions.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                    July 19, 2026
                  </span>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-lg">Assessment Window</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Online evaluation conducted on the official exam server at 10:00 AM.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                    July 28, 2026
                  </span>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-lg">Result Announcement</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Final answer keys and candidate merit lists published on the verification page.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="relative pl-8 md:pl-12">
              <div className="absolute left-0 top-1.5 -translate-x-1/2 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-8 items-start">
                <div className="md:col-span-1">
                  <span className="text-sm font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full whitespace-nowrap">
                    July 30, 2026
                  </span>
                </div>
                <div className="md:col-span-3 space-y-1">
                  <h4 className="font-display font-bold text-slate-900 text-lg">Talent Profile Release</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Cognitive mapping roadmap, performance charts, and digital certificates unlocked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* School Partnership Section */}
      <section className="py-20 px-6 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
                School Partnership Program
              </h2>
              <p className="text-slate-650 leading-relaxed text-sm sm:text-base">
                Schools across India can partner with the <strong className="text-slate-800">Courage National Talent Search</strong> to provide sponsored participation opportunities to their students. Partnering creates a streamlined diagnostic environment.
              </p>
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Partner schools receive:</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    School Dashboard Access for administrators
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    Student Registration Management portals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    Real-time student participation tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    Bulk Student Onboarding via Excel upload
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600 shrink-0" />
                    Detailed performance analytics & reports
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 hover:bg-blue-750 text-white font-bold rounded-xl text-xs transition-all shadow-md"
                >
                  Become a School Partner
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900">Partner School Onboarding</h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                If your school has received onboarding credentials, administrators can log in directly to manage seats, register candidates, and view class statistics.
              </p>
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-normal flex items-start gap-2.5">
                <School className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <div>
                  <h4 className="font-bold">Are you a school representative?</h4>
                  <p className="text-blue-800 mt-0.5">Contact the support desk to create your school account and request sponsored seat codes.</p>
                </div>
              </div>
              <Link
                href="/login"
                className="block text-center w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                Go to Dashboard Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Parents Trust CNTS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Why Parents Trust CNTS
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
              Why parents across India trust the Courage National Talent Search:
            </p>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Transparent Assessment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                All mock papers, syllabus guides, and scoring methods are shared in advance.
              </p>
            </div>

            {/* Card 2 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Official Certificates</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every candidate is recognized with formal digital credentials issued by Courage Library.
              </p>
            </div>

            {/* Card 3 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Secure Registration</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Candidate data, contacts, and payment integrations are secure.
              </p>
            </div>

            {/* Card 4 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Student-Centric Evaluation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Designed to map conceptual logic strengths without creating exam stress.
              </p>
            </div>

            {/* Card 5 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Parent Dashboard</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Real-time tracking of registration progress, mock tests, and final scores.
              </p>
            </div>

            {/* Card 6 */}
            <div className="border border-slate-200 rounded-3xl p-6 space-y-3">
              <h3 className="font-display font-bold text-slate-900 text-lg">Dedicated Support</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Fast resolution support over email and our online helpdesk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Official Program Identity (Verification Section - Crucial for reviewers) */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">
              Official Program Identity
            </h2>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 leading-relaxed text-sm sm:text-base text-slate-650">
            <p>
              The <strong className="text-slate-800">Courage National Talent Search (CNTS)</strong> is an official educational assessment program operated, managed, and maintained by <strong className="text-slate-800">Courage Library</strong>.
            </p>
            <p>
              The Courage National Talent Search brand and identity are utilized consistently across all of the following touchpoints:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700 font-semibold pl-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Registration Portal
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Student Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                School Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Admit Cards & Entry Passes
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Official Certificates
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Email Communications
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                WhatsApp Notification Logs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                Official Marketing Materials
              </li>
            </ul>
            <p className="border-t border-slate-100 pt-4 text-xs text-slate-500 leading-normal">
              All Courage National Talent Search operations, including payment processing and data management, are conducted securely under the registered parameters of Courage Library.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
              Contact & Support
            </h2>
            <div className="w-12 h-1 bg-blue-600 mx-auto rounded-full" />
          </div>

          <div className="border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 font-bold text-slate-900 w-1/3">Organization</th>
                  <td className="p-4 text-slate-700">Courage Library</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-900">Program</th>
                  <td className="p-4 text-slate-700">Courage National Talent Search (CNTS)</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="p-4 font-bold text-slate-900">Website</th>
                  <td className="p-4 text-blue-700 font-medium">
                    <a href="https://thecouragelibrary.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
                      https://thecouragelibrary.com
                    </a>
                  </td>
                </tr>
                <tr className="border-b border-slate-200">
                  <th className="p-4 font-bold text-slate-900">Program Email</th>
                  <td className="p-4 text-blue-700 font-medium flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    <a href="mailto:cnts@thecouragelibrary.com" className="hover:underline">cnts@thecouragelibrary.com</a>
                  </td>
                </tr>
                <tr className="bg-slate-50/50">
                  <th className="p-4 font-bold text-slate-900">General Support</th>
                  <td className="p-4 text-blue-700 font-medium flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    <a href="mailto:support@thecouragelibrary.com" className="hover:underline">support@thecouragelibrary.com</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Recommended Reading Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 bg-slate-50 border-t border-slate-200/50">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-display font-black text-2xl text-slate-900 mb-8 text-center">
              Recommended Reading for Parents &amp; Schools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block bg-white border border-slate-200 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {post.category}
                    </span>
                    <h3 className="font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-3">
                      {post.title}
                    </h3>
                    <p className="text-slate-550 text-xs leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <span className="text-blue-600 text-xs font-semibold group-hover:underline inline-flex items-center gap-1 mt-4">
                    Read Article &rarr;
                  </span>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-blue-600 underline transition-colors"
              >
                View all articles in Courage Library &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 px-6 border-t border-slate-800 shrink-0">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-6 space-y-4">
            <h3 className="font-display font-black text-xl text-white">Courage National Talent Search (CNTS)</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              An Official Program of Courage Library
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Courage National Talent Search (CNTS) is the official talent discovery and assessment initiative operated and managed by Courage Library.
            </p>
          </div>
          
          <div className="md:col-span-6 flex justify-end md:justify-end gap-12 text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/for-schools" className="hover:text-white transition-colors">Schools</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500">
          <p>© {new Date().getFullYear()} Courage Library. All rights reserved.</p>
          <p>Courage National Talent Search is conducted under the registered educational operations of Courage Library.</p>
        </div>
      </footer>
    </main>
  );
}
