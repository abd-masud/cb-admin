import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Lato } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import Providers from "@/providers/Providers";
import LayoutContent from "./server/LayoutContent";
import CanonicalURL from "./server/CanonicalURL";
import OpenGraphURL from "./server/OpenGraphURL";
import Script from "next/script";
// import Window from "./server/Window";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Copa Business | Ultimate Business Software Solution</title>
        <link rel="shortcut icon" href="/images/logo.webp" type="image/png" />
        <CanonicalURL />
        <meta name="release-date" content="2025-05-10"></meta>
        <meta
          name="description"
          content="Copa Business: All-in-one cloud ERP for accounting, CRM & inventory. Automate workflows & scale smarter. Start Free Trial!"
        />
        <meta
          name="keywords"
          content="Automate Workflows, Smart CRM Tools, Efficient Product Management, Optimized Inventory Control, Data-Driven Decisions"
        />
        <meta
          property="og:title"
          content="Copa Business | Ultimate Business Software Solution"
        />
        <meta
          property="og:description"
          content="Copa Business: All-in-one cloud ERP for accounting, CRM & inventory. Automate workflows & scale smarter. Start Free Trial!"
        />
        <meta
          property="og:image"
          content="https://copaac.19872000.xyz/images/logo.webp"
        />
        <OpenGraphURL />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Copa Business | Ultimate Business Software Solution"
        />
        <meta
          name="twitter:description"
          content="Copa Business: All-in-one cloud ERP for accounting, CRM & inventory. Automate workflows & scale smarter. Start Free Trial!"
        />
        <meta name="twitter:image" content="/images/logo.webp" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="EN" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Dhaka",
              addressRegion: "Bangladesh",
              streetAddress: "Road - 06, Avenue -01, Mirpur DOHS",
            },
            description: "Copa Business | Ultimate Business Software Solution",
            name: "Copa Business",
            telephone: "09647123456",
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Copa Business | Ultimate Business Software Solution",
            description:
              "All-in-one cloud ERP for accounting, CRM & inventory management. Automate workflows & scale smarter with Copa Business.",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web, Windows, macOS, Android, iOS",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "BDT",
              priceValidUntil: "2025-05-10",
              url: "https://copaac.19872000.xyz/",
              availability: "https://schema.org/InStock",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              bestRating: "5",
              ratingCount: "250",
            },
            brand: {
              "@type": "Organization",
              name: "Copa Business",
            },
            keywords:
              "Automate Workflows, Smart CRM Tools, Efficient Product Management, Optimized Inventory Control, Data-Driven Decisions",
            screenshot: "https://copaac.19872000.xyz/images/copa-dashboard.jpg",
          })}
        </script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WS4GF5R5PQ"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WS4GF5R5PQ');
            `,
          }}
        />
      </head>
      <body
        className={`${lato.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <Providers>
            {/* <Window> */}
            <LayoutContent>{children}</LayoutContent>
            {/* </Window> */}
          </Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
