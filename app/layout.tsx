import type { Metadata } from "next";
import Nav from "./nav";
import Providers from "./providers";
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
      <body className="min-h-full bg-black text-[#e5e5e5]">
        <Providers>
          <div className="min-h-screen">
            <Nav />
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
