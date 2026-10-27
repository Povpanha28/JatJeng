import type { Metadata, Viewport } from "next";
import { Manrope, Bricolage_Grotesque, Kalam } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display-grotesque",
  subsets: ["latin"],
  display: "swap",
});

// Handwritten accent, used only for the scattered sticky-note illustrations in the hero.
const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JatJeng — AI-Powered Event Management",
    template: "%s | JatJeng",
  },
  description:
    "Plan events, coordinate teams, manage budgets, and analyze performance with JatJeng's AI-powered event management workspace.",
  applicationName: "JatJeng",
  keywords: [
    "AI event management",
    "event planning software",
    "event coordination",
    "event budgeting",
    "event analytics",
    "AI event assistant",
  ],
  authors: [{ name: "JatJeng" }],
  openGraph: {
    title: "JatJeng — AI-Powered Event Management",
    description:
      "Plan events, coordinate teams, manage budgets, and analyze performance with JatJeng's AI-powered event management workspace.",
    siteName: "JatJeng",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "JatJeng — AI-Powered Event Management",
    description:
      "Plan events, coordinate teams, manage budgets, and analyze performance with JatJeng's AI-powered event management workspace.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#3CA6F2",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${bricolage.variable} ${kalam.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#top"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
