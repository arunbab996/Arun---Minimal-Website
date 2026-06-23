import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "./nav";
import Providers from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-white text-[#111111] dark:bg-[#111111] dark:text-[#e5e5e5]">
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
