import type { Metadata } from "next";
import { Suspense } from "react";
import Script from "next/script";
import JsonLd from "@/components/shared/JsonLd";
import CookieBanner from "@/components/shared/CookieBanner";
import MetaPixelRouteTracker from "@/components/analytics/MetaPixel";
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
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

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
        {pixelId && (
          <>
            <Script id="meta-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${pixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
            <Suspense fallback={null}>
              <MetaPixelRouteTracker />
            </Suspense>
          </>
        )}
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
