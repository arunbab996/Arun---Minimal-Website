import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import Nav from "./nav";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({ subsets: ["latin"], weight: ["400", "700"], style: ["normal", "italic"], variable: "--font-libre" });

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
    <html lang="en" className={`${libreBaskerville.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-[#1a1a1a]">
        <div className="min-h-screen">
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
