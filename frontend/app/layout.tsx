import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "GlobeTrotter – Intelligent Personalized Travel Planning Platform",
  description:
    "Plan, visualize, and budget your dream journeys with AI-powered itineraries, interactive route maps, and collaborative trip planning.",
  keywords: [
    "travel planner",
    "trip itinerary builder",
    "budget manager",
    "interactive travel map",
    "travel collaboration",
    "GlobeTrotter",
  ],
  authors: [{ name: "GlobeTrotter Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased selection:bg-primary/20 selection:text-primary">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
