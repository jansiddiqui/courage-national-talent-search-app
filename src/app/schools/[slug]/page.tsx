import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { 
  School, 
  Award, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  TrendingUp,
  Users,
  Globe
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
  const totalCandidates = school.snapshots?.reduce((acc, s) => acc + (s.student_count || 0), 0) || 0;
  const totalScholarships = school.snapshots?.reduce((acc, s) => acc + (s.scholarship_count || 0), 0) || 0;

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
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Breadcrumb Header */}
          <div className="flex items-center justify-between gap-4 text-xs font-semibold text-slate-400 flex-wrap">
            <div className="flex items-center gap-2">
              <span>Home</span>
              <span>/</span>
              <span>Schools</span>
              <span>/</span>
              <span className="text-slate-700 truncate max-w-[200px] sm:max-w-xs">{school.name}</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80 flex items-center gap-1">
              ✓ Official CNTS School Profile
            </span>
          </div>

          {/* School Hero Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs space-y-6 relative overflow-hidden">
            {/* Top Accent Gradient */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-2">
              <div className="flex items-start gap-4">
                {school.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={school.logo_url} 
                    alt={`${school.name} Logo`} 
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain rounded-2xl p-1 bg-white border border-slate-200 shadow-xs shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center shadow-inner shrink-0 text-blue-700">
                    <School size={36} />
                  </div>
                )}
                <div className="space-y-1.5">
                  <h1 className="font-display font-black text-2xl sm:text-4xl text-slate-900 tracking-tight leading-tight">
                    {school.name}
                  </h1>
                  <p className="text-slate-500 font-medium text-sm sm:text-base flex items-center gap-1.5">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    {school.city}{school.state ? `, ${school.state}` : ""}
                  </p>
                </div>
              </div>

              {/* Share & Website Actions */}
              <ShareSchoolProfileButton schoolName={school.name} schoolSlug={school.slug} website={school.website} />
            </div>

            {/* Status & Identity Badges */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <ShieldCheck size={14} className="text-blue-600" />
                CNTS Partner School
              </span>

              {school.is_founding_school && (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                  <Sparkles size={14} className="text-amber-600" />
                  🏛️ CNTS Founding School — 2026
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                Board: {school.board}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                Partner Since {joinYear}
              </span>
            </div>

            {/* Aggregate Institutional Metrics Grid */}
            {school.snapshots && school.snapshots.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                  <span className="text-xs font-semibold text-slate-400 block">Total Candidates</span>
                  <span className="text-xl font-bold text-slate-900 mt-0.5 block">{totalCandidates}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                  <span className="text-xs font-semibold text-amber-800 block">Scholarships Awarded</span>
                  <span className="text-xl font-bold text-amber-900 mt-0.5 block">{totalScholarships}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-center col-span-2 sm:col-span-1">
                  <span className="text-xs font-semibold text-blue-800 block">Evaluation Status</span>
                  <span className="text-sm font-bold text-blue-900 mt-1 block">✓ Verified Record</span>
                </div>
              </div>
            )}
          </div>

          {/* CNTS Journey / Participation History */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp size={22} className="text-blue-600" />
                <h2 className="font-display font-bold text-xl text-slate-900">
                  CNTS Talent Search Journey
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Official Record</span>
            </div>

            {school.snapshots && school.snapshots.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold border-b border-slate-100 rounded-l-xl">CNTS Edition</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Candidates Participated</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Average Score</th>
                      <th className="p-4 font-semibold border-b border-slate-100">Scholarships & Merit Awards</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-800">
                    {school.snapshots.map((snap, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-blue-900 flex items-center gap-2">
                          <Award size={16} className="text-amber-500 shrink-0" />
                          CNTS {snap.academic_session_name}
                        </td>
                        <td className="p-4 font-medium">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                            <Users size={14} className="text-slate-400" />
                            {snap.student_count} Candidates
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">
                          {snap.average_score > 0 ? `${snap.average_score.toFixed(1)}%` : "Verified"}
                        </td>
                        <td className="p-4">
                          {snap.scholarship_count > 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              <Sparkles size={12} className="text-amber-600" />
                              {snap.scholarship_count} Scholarships Awarded
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500 font-medium">Merit Certificates Issued</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700 space-y-1">
                  <p className="font-bold text-blue-950">Official Registered School Partner (CNTS 2026)</p>
                  <p className="text-slate-600 leading-relaxed">
                    {school.name} is an active participating institution in the Courage National Talent Search 2026 edition. Historical evaluation metrics and performance records will populate automatically upon completion of the national examination cycle.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* About the School Section (Rendered only if description exists) */}
          {school.public_description && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
              <h2 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                About {school.name}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {school.public_description}
              </p>
            </div>
          )}

          {/* Institutional Trust Notice */}
          <div className="p-6 rounded-2xl bg-slate-100/80 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShieldCheck size={16} className="text-blue-600 shrink-0" />
              <span>Official Institutional Record • Courage National Talent Search (CNTS)</span>
            </div>
            <p className="text-slate-400">
              Individual candidate data is protected under CNTS Privacy Directives.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
