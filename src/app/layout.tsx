import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://cnts.in"),
  title: "CNTS 2026 Founding Edition – Courage National Talent Search",
  description: "India&apos;s premier talent discovery platform for students in Classes 5–8. Uncover your child&apos;s unique strengths and unlock a future-ready profile.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CNTS 2026 Founding Edition – Courage National Talent Search",
    description: "India&apos;s premier talent discovery platform for students in Classes 5–8. Uncover your child&apos;s unique strengths and unlock a future-ready profile.",
    url: "https://cnts.in",
    siteName: "CNTS",
    images: [
      {
        url: "/images/logo.png",
        width: 512,
        height: 512,
        alt: "CNTS Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
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
