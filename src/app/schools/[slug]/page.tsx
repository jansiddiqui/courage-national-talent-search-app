import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  School, 
  Award, 
  MapPin, 
  Sparkles, 
  ShieldCheck,
  BadgeCheck,
  TrendingUp,
  Users,
  Calendar,
  Building2,
  Globe,
  Clock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { getPublishedSchoolProfile } from "@/lib/schoolProfiles";
import ShareSchoolProfileButton from "@/components/schools/ShareSchoolProfileButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = await getPublishedSchoolProfile(slug);

  if (!school) {
    return {
      title: "School Profile Not Found | Courage Library",
    };
  }

  const title = `${school.name}, ${school.city} | CNTS Partner School`;
  const description = `${school.name} in ${school.city}${school.state ? `, ${school.state}` : ""} is an official Courage National Talent Search (CNTS) Partner School. View institution details and participation records.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://thecouragelibrary.com/schools/${school.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://thecouragelibrary.com/schools/${school.slug}`,
      type: "website",
      siteName: "Courage National Talent Search",
      images: [
        {
          url: school.logo_url || "https://thecouragelibrary.com/og-cnts.png",
          width: 1200,
          height: 630,
          alt: `${school.name} CNTS Profile`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [school.logo_url || "https://thecouragelibrary.com/og-cnts.png"],
    },
  };
}

export default async function SchoolPublicProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const school = await getPublishedSchoolProfile(slug);

  if (!school) {
    notFound();
  }

  const joinYear = new Date(school.joined_at).getFullYear() || 2026;
  const hasSnapshots = Boolean(school.snapshots && school.snapshots.length > 0);
  const totalCandidates = school.snapshots?.reduce((acc, s) => acc + (s.student_count || 0), 0) || 0;
  const totalScholarships = school.snapshots?.reduce((acc, s) => acc + (s.scholarship_count || 0), 0) || 0;
  const editionsCount = school.snapshots?.length || 1;

  // JSON-LD Schemas
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": school.name,
    "url": school.website || `https://thecouragelibrary.com/schools/${school.slug}`,
    "logo": school.logo_url || undefined,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": school.city,
      "addressRegion": school.state || "India",
      "addressCountry": "IN"
    },
    "description": school.public_description || `${school.name} is an official CNTS Partner School.`,
    "memberOf": {
      "@type": "Organization",
      "name": "Courage National Talent Search",
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
        "name": "Partner Schools",
        "item": "https://thecouragelibrary.com/for-schools"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": school.name,
        "item": `https://thecouragelibrary.com/schools/${school.slug}`
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar theme="light" />
      <JsonLd schema={[orgSchema, breadcrumbSchema]} />

      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Breadcrumb & Verification Header Strip */}
          <div className="flex items-center justify-between gap-4 text-xs font-medium text-slate-400 flex-wrap px-1">
            <div className="flex items-center gap-2">
              <span className="hover:text-slate-600 transition-colors">Home</span>
              <span>/</span>
              <span className="hover:text-slate-600 transition-colors">Schools</span>
              <span>/</span>
              <span className="text-slate-700 font-semibold truncate max-w-[200px] sm:max-w-xs">{school.name}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50/90 px-3 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              Official CNTS School Profile
            </span>
          </div>

          {/* ==================================================================== */}
          {/* SECTION 1 — SCHOOL HERO (PREMIUM INSTITUTIONAL IDENTITY HEADER)      */}
          {/* ==================================================================== */}
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-xs space-y-5 relative overflow-hidden">
            {/* Top Accent Brand Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

            {/* School Identity Unit (Logo + Name with Inline Verification + Location) */}
            <div className="flex items-start gap-4 sm:gap-5 min-w-0 pt-1">
              {school.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={school.logo_url} 
                  alt={`${school.name} Logo`} 
                  className="w-14 h-14 sm:w-20 sm:h-20 object-contain rounded-2xl p-1.5 bg-white border border-slate-200 shadow-xs shrink-0"
                />
              ) : (
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-b from-blue-50 to-slate-50 border border-blue-100/90 rounded-2xl flex items-center justify-center shadow-xs shrink-0 text-blue-700">
                  <School className="w-7 h-7 sm:w-9 sm:h-9 stroke-[1.75]" />
                </div>
              )}

              <div className="space-y-1 min-w-0 flex-1">
                <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900 tracking-tight leading-snug flex items-center flex-wrap gap-1.5 sm:gap-2">
                  <span>{school.name}</span>
                  {school.profile_status === "PUBLISHED" && (
                    <span 
                      className="inline-flex items-center text-blue-600 shrink-0 align-middle" 
                      title="Verified CNTS Partner School"
                      aria-label="Verified CNTS Partner School"
                    >
                      <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 fill-blue-50 stroke-blue-600" />
                    </span>
                  )}
                </h1>
                <p className="text-slate-500 font-medium text-xs sm:text-sm flex items-center gap-1.5 pt-0.5">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>{school.city}{school.state ? `, ${school.state}` : ""}</span>
                </p>
              </div>
            </div>

            {/* Bottom Metadata & Utility Row */}
            <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3.5 border-t border-slate-100/90 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {school.is_founding_school ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                    <Sparkles size={13} className="text-amber-600" />
                    CNTS Founding School — 2026
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                    <ShieldCheck size={13} className="text-blue-600" />
                    CNTS Partner School
                  </span>
                )}

                {school.board && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full font-semibold bg-slate-100/80 text-slate-600 border border-slate-200/60">
                    Board: {school.board}
                  </span>
                )}

                <span className="inline-flex items-center px-3 py-1 rounded-full font-semibold bg-slate-100/80 text-slate-600 border border-slate-200/60">
                  Partner Since {joinYear}
                </span>
              </div>

              {/* Secondary Utility Share Action */}
              <div className="shrink-0">
                <ShareSchoolProfileButton schoolName={school.name} schoolSlug={school.slug} />
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* SECTION 2 — INSTITUTIONAL SNAPSHOT (CORRECTED REAL METRICS)         */}
          {/* ==================================================================== */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Calendar size={11} className="text-slate-400" /> Partner Since
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block">{joinYear}</span>
              <span className="text-[11px] font-medium text-slate-500 block">Registered Partner</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                <Award size={11} className="text-slate-400" /> CNTS Edition
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-900 block">{editionsCount} {editionsCount === 1 ? "Edition" : "Editions"}</span>
              <span className="text-[11px] font-medium text-blue-700 block">Active Participation</span>
            </div>

            {hasSnapshots ? (
              <>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                    <Users size={11} className="text-slate-400" /> Candidates
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 block">{totalCandidates}</span>
                  <span className="text-[11px] font-medium text-slate-500 block">Verified Candidates</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                    <Sparkles size={11} className="text-amber-600" /> Scholarships
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-900 block">{totalScholarships}</span>
                  <span className="text-[11px] font-medium text-amber-700 block">Merit Recognitions</span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block flex items-center justify-center gap-1">
                    <Clock size={11} className="text-slate-400" /> Current Cycle
                  </span>
                  <span className="text-lg sm:text-xl font-black text-slate-900 block">CNTS 2026</span>
                  <span className="text-[11px] font-medium text-slate-500 block">Active Examination</span>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center justify-center gap-1">
                    <ShieldCheck size={11} className="text-amber-600" /> Recognition
                  </span>
                  <span className="text-lg sm:text-xl font-black text-amber-900 block">
                    {school.is_founding_school ? "Founding" : "Partner"}
                  </span>
                  <span className="text-[11px] font-medium text-amber-700 block">CNTS Status</span>
                </div>
              </>
            )}
          </div>

          {/* ==================================================================== */}
          {/* SECTION 3 — OFFICIAL CNTS RECOGNITION (RESTRAINED WEIGHT)           */}
          {/* ==================================================================== */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white space-y-3 shadow-sm border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block flex items-center gap-1.5">
                  <Award size={13} className="text-amber-400" /> Official CNTS Recognition
                </span>
                <h2 className="font-display font-bold text-lg sm:text-xl text-white">
                  {school.is_founding_school ? "CNTS Founding School — 2026" : "Official CNTS Partner School"}
                </h2>
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              {school.name} is officially recognized by the Courage National Talent Search (CNTS) for its partnership in national student cognitive reasoning evaluation, talent identification, and academic empowerment.
            </p>
          </div>

          {/* ==================================================================== */}
          {/* SECTION 4 — HISTORICAL CNTS PARTICIPATION (TIMELINE)                 */}
          {/* ==================================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp size={20} className="text-blue-600" />
                <h2 className="font-display font-bold text-lg text-slate-900">
                  Historical CNTS Participation
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Timeline</span>
            </div>

            {/* Vertical Timeline Layout */}
            <div className="relative border-l-2 border-slate-200/80 ml-3 sm:ml-4 pl-5 sm:pl-7 space-y-6 py-1">
              {hasSnapshots ? (
                school.snapshots.map((snap, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xs" />

                    <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                          CNTS Edition {snap.academic_session_name}
                        </span>
                        <span className="text-xs font-medium text-slate-500">
                          {snap.average_score > 0 ? `Avg Score: ${snap.average_score.toFixed(1)}%` : "Verified Snapshot"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                        <span className="inline-flex items-center gap-1.5 font-bold text-slate-900">
                          <Users size={14} className="text-blue-600" />
                          {snap.student_count} Candidates Participated
                        </span>

                        {snap.scholarship_count > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            <Sparkles size={12} className="text-amber-600" />
                            {snap.scholarship_count} Scholarships Awarded
                          </span>
                        ) : (
                          <span className="text-xs text-slate-500 font-medium">Merit Certificates Issued</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                /* Pre-Exam Timeline Node (Concise 2026 Active Cycle) */
                <div className="relative group">
                  <div className="absolute -left-[27px] sm:-left-[35px] top-0.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow-xs" />

                  <div className="bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-blue-950">
                          CNTS 2026 Edition
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                          <Clock size={11} className="text-blue-600" /> Active Examination Cycle
                        </span>
                      </div>
                      <span className="text-xs font-bold text-blue-700">Official Partner</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                      {school.name} is participating in the CNTS 2026 examination cycle. Performance and achievement records will appear here after verified examination results are available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==================================================================== */}
          {/* SECTION 5 — SCHOOL INFORMATION (DESCRIPTION OR FACT SHEET)          */}
          {/* ==================================================================== */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 size={18} className="text-blue-600" />
              School Information
            </h2>

            {school.public_description && school.public_description.trim().length > 0 ? (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {school.public_description}
              </p>
            ) : (
              /* Clean Structured Institutional Fact Sheet Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">School Name</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">{school.name}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">{school.city}{school.state ? `, ${school.state}` : ""}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Board</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">{school.board || "Recognized Board"}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">School Type</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">{school.school_type || "Educational Institution"}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Partner Since</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">{joinYear}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Website</span>
                  {school.website ? (
                    <a 
                      href={school.website.startsWith("http") ? school.website : `https://${school.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs sm:text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe size={12} /> Visit Website ↗
                    </a>
                  ) : (
                    <span className="text-xs sm:text-sm font-medium text-slate-500 block">Official CNTS Partner</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================================== */}
          {/* SECTION 6 — TRUST & DPDP PRIVACY NOTICE (SUBDUED FOOTER STATEMENT)  */}
          {/* ==================================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShieldCheck size={15} className="text-blue-600 shrink-0" />
              <span>CNTS Institutional Record • Courage National Talent Search</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Individual candidate data is protected under CNTS privacy directives.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
