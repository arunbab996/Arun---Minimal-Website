import type { Metadata } from "next";
import Nav from "./nav";
import Providers from "./providers";
import BusinessCardTrigger from "./components/business-card-trigger";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arun Baburaj",
  description:
    "Product Manager, Researcher, and Generalist. Building software at the intersection of AI, Venture Capital, and Human Behavior.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        {/* Typefaces the business card canvas draws with */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
        />
      </head>
      <body className="min-h-full bg-black text-[#e5e5e5]">
        <Providers>
          <div className="min-h-screen">
            <Nav />
            {children}
            <BusinessCardTrigger />
          </div>
        </Providers>
      </body>
    </html>
  );
}
