import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from '@/components/Providers'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Career Journal - AI-Powered Career Growth",
  description: "Track your daily achievements and let AI help build your career story",
  keywords: "career, journal, AI, resume, achievements, professional growth",
  authors: [{ name: "Career Journal" }],
  creator: "Career Journal",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://career-journal.com",
    siteName: "Career Journal",
    title: "Career Journal - AI-Powered Career Growth",
    description: "Track your daily achievements and let AI help build your career story",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Journal - AI-Powered Career Growth",
    description: "Track your daily achievements and let AI help build your career story",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
