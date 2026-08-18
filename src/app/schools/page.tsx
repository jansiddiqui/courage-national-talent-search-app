import type { Metadata } from "next";
import Link from "next/link";
import { 
  ShieldCheck, 
  Building2, 
  GraduationCap
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/shared/JsonLd";
import { getPublishedSchoolsDirectory } from "@/lib/schoolProfiles";
import SchoolsDirectoryClient from "./SchoolsDirectoryClient";

export const metadata: Metadata = {
  title: "CNTS Partner Schools | Courage National Talent Search",
  description: "Explore official CNTS Partner Schools across India participating in the Courage National Talent Search 2026. View participating institutions, evaluation records, and academic affiliations.",
  alternates: {
    canonical: "https://thecouragelibrary.com/schools",
  },
  openGraph: {
    title: "CNTS Partner Schools | Courage National Talent Search",
    description: "Explore official CNTS Partner Schools across India participating in the Courage National Talent Search 2026. View participating institutions and institutional records.",
    url: "https://thecouragelibrary.com/schools",
    siteName: "Courage National Talent Search (CNTS)",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://thecouragelibrary.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "CNTS Partner Schools Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS Partner Schools | Courage National Talent Search",
    description: "Explore official CNTS Partner Schools across India participating in the Courage National Talent Search 2026.",
    images: ["https://thecouragelibrary.com/images/og-image.png"],
  },
};

export default async function SchoolsDirectoryPage() {
  const schools = await getPublishedSchoolsDirectory();
  const publishedCount = schools.length;

  // Schema.org CollectionPage + ItemList + BreadcrumbList Schemas
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "CNTS Partner Schools Directory",
    "description": "Official directory of educational institutions participating in the Courage National Talent Search 2026.",
    "url": "https://thecouragelibrary.com/schools",
    "publisher": {
      "@type": "Organization",
      "name": "Courage National Talent Search",
      "url": "https://thecouragelibrary.com",
    },
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "CNTS Partner Schools",
    "itemListElement": schools.map((school, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": school.name,
      "url": `https://thecouragelibrary.com/schools/${school.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://thecouragelibrary.com",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Partner Schools",
        "item": "https://thecouragelibrary.com/schools",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      <Navbar theme="light" />
      <JsonLd schema={[collectionSchema, itemListSchema, breadcrumbSchema]} />

      <main className="flex-grow pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* ==================================================================== */}
          {/* HERO SECTION — DIRECTORY HEADER & BREADCRUMB                         */}
          {/* ==================================================================== */}
          <div className="space-y-4">
            {/* Breadcrumb Strip */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <Link href="/" className="hover:text-slate-600 transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-slate-700 font-semibold">Partner Schools</span>
            </div>

            {/* Title & Description Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/80 inline-flex items-center gap-1.5 shadow-2xs">
                  <ShieldCheck size={13} className="text-blue-600 shrink-0" />
                  Official Institutional Directory
                </span>
                <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-slate-900 tracking-tight">
                  CNTS Partner Schools
                </h1>
                <p className="text-slate-600 text-xs sm:text-sm sm:leading-relaxed">
                  Explore educational institutions across India participating in the Courage National Talent Search 2026.
                </p>
              </div>

              {/* Total Verified School Count Pill */}
              <div className="shrink-0 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-2xs text-left md:text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Verified Directory
                </span>
                <span className="font-display font-bold text-sm sm:text-base text-slate-900">
                  {publishedCount} {publishedCount === 1 ? "Partner School" : "Partner Schools"}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* SEARCH, FILTER & SCHOOLS GRID (CLIENT INTERACTION)                   */}
          {/* ==================================================================== */}
          <SchoolsDirectoryClient initialSchools={schools} />

          {/* ==================================================================== */}
          {/* INSTITUTIONAL CALL-TO-ACTION SECTION                                 */}
          {/* ==================================================================== */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white text-center space-y-4 border border-slate-800 shadow-md relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block">
                Courage National Talent Search 2026
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-white">
                Empower Your Child or Partner Your School
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Participate in India&apos;s premier cognitive talent evaluation for Classes 5–8. Diagnostic reports, national percentile benchmarks, and merit scholarships.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
              >
                <GraduationCap size={16} className="text-blue-200" />
                <span>Register Student</span>
              </Link>

              <Link
                href="/for-schools"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-sm hover:shadow-md cursor-pointer"
              >
                <Building2 size={16} className="text-amber-400" />
                <span>Partner Your School</span>
              </Link>
            </div>
          </div>

          {/* ==================================================================== */}
          {/* TRUST & PRIVACY NOTICE                                               */}
          {/* ==================================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100/70 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-600 font-medium">
              <ShieldCheck size={15} className="text-blue-600 shrink-0" />
              <span>Official CNTS Institutional Directory • Courage National Talent Search</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Only schools with verified partner status are listed. Individual candidate data remains protected.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
