import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

/**
 * 🔍 SEO METADATA
 * Pentru cursanți: Metadata = informații pentru Google și social media
 */
export const metadata: Metadata = {
  title: "Vibe Coffee - Cafea de Specialitate în București",
  description: "Descoperă aromele autentice ale cafelei de specialitate într-un ambient modern și prietenos. Boabe proaspăt prăjite, bariști experimentați, WiFi gratuit.",
  keywords: ["cafenea bucuresti", "cafea specialitate", "coffee shop", "vibe coffee"],
  authors: [{ name: "Vibe Coffee Team" }],
  openGraph: {
    title: "Vibe Coffee - Cafea de Specialitate",
    description: "Locul perfect pentru cafeaua ta zilnică",
    type: "website",
    locale: "ro_RO",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${plusJakartaSans.variable} ${dmSerifDisplay.variable}`}>
      <body
        className={`antialiased ${plusJakartaSans.className}`}
      >
        {children}
      </body>
    </html>
  );
}
