import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./global.css";
import { Metadata } from "next";
import { ViewModeProvider } from "@/context/ViewModeContext";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Saheli Mondal | Full Stack Developer",
  description:
    "Portfolio of Saheli Mondal - Building real projects and learning daily.",
  icons: {
    icon: "/assets/portrait.png",
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
