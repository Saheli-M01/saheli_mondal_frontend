import Navbar from "@/components/Navbar";
import "./global.css";

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
        <main>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
