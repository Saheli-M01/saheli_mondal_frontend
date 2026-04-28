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
    "Portfolio of Saheli Mondal — Full Stack Developer building real-world projects with React, Next.js, and modern technologies. Passionate about creating impactful web experiences.",

  keywords: [
    "Saheli Mondal",
    "Full Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Web Developer Portfolio",
    "Frontend Developer India",
    "Software Engineer Portfolio",
  ],

  authors: [{ name: "Saheli Mondal" }],
  creator: "Saheli Mondal",

  icons: {
    icon: "/assets/portrait_meta.png",
  },

  openGraph: {
    type: "website",
    url: "https://sahelimondal.in",
    title: "Saheli Mondal | Full Stack Developer",
    description:
      "Explore projects, skills, and experience of Saheli Mondal — Full Stack Developer building modern web applications.",
    images: [
      {
        url: "https://sahelimondal.in/assets/portrait_meta.png", // ✅ fixed
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
    images: ["https://sahelimondal.in/assets/portrait_meta.png"],
  },

  robots: {
    index: true,
    follow: true,
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
