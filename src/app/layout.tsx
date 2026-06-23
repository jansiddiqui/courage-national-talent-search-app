import type { Metadata } from "next";
import Script from "next/script";
import JsonLd from "@/components/shared/JsonLd";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thecouragelibrary.com"),
  title: "CNTS 2026 Founding Edition – Courage National Talent Search",
  description: "India's premier talent discovery platform for students in Classes 5–8. Uncover your child's unique strengths and unlock a future-ready profile.",
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  openGraph: {
    title: "CNTS 2026 Founding Edition – Courage National Talent Search",
    description: "India's premier talent discovery platform for students in Classes 5–8. Uncover your child's unique strengths and unlock a future-ready profile.",
    url: "https://thecouragelibrary.com",
    siteName: "CNTS",
    images: [
      {
        url: "/og-cnts.png",
        width: 1200,
        height: 630,
        alt: "Courage National Talent Search (CNTS) 2026",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CNTS 2026 Founding Edition – Courage National Talent Search",
    description: "India's premier talent discovery platform for students in Classes 5–8. Uncover your child's unique strengths and unlock a future-ready profile.",
    images: ["/og-cnts.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Courage Library",
    "url": "https://thecouragelibrary.com",
    "logo": "https://thecouragelibrary.com/images/logo.png",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Courage Library",
    "url": "https://thecouragelibrary.com",
  };

  return (
    <html lang="en">
      <head>
        <JsonLd schema={[orgSchema, websiteSchema]} />
      </head>
      <body>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  );
}
