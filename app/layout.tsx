import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./global.css";
import { Metadata } from "next";
import { ViewModeProvider } from "@/context/ViewModeContext";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://sahelimondal.in"),

  title: {
    default: "Saheli Mondal | Full Stack Developer",
    template: "%s | Saheli Mondal",
  },

  description:
    "Full Stack Developer crafting modern, scalable web applications using React, Next.js, and cutting-edge technologies. Explore my projects, skills, and journey.",

  keywords: [
    "Saheli Mondal",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "Web Developer India",
  ],

  authors: [{ name: "Saheli Mondal" }],
  creator: "Saheli Mondal",

  icons: {
    icon: "/assets/portrait_meta.png",
  },

  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sahelimondal.in",
    siteName: "Saheli Mondal Portfolio",

    title: "Saheli Mondal | Full Stack Developer",
    description:
      "Full Stack Developer building real-world projects with React & Next.js. Explore my work and skills.",

    images: [
      {
        url: "https://sahelimondal.in/assets/og-image.png", // 🔥 NEW IMAGE (IMPORTANT)
        width: 1200,
        height: 630,
        alt: "Saheli Mondal Portfolio",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Saheli Mondal | Full Stack Developer",
    description:
      "Full Stack Developer building modern web apps with React & Next.js.",
    images: ["https://sahelimondal.in/assets/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://sahelimondal.in",
  },
};
type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>

      <body className="bg-[#0a0a0a]" suppressHydrationWarning>
        <ViewModeProvider>
          <main>
            <Navbar />
            {children}
          </main>
          <Footer />
        </ViewModeProvider>

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JVCL7CLKHH"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JVCL7CLKHH');
          `}
        </Script>
      </body>
    </html>
  );
}
