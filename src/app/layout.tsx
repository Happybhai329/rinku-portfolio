import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rinku Dhakad | Premium Video Editor, Motion Designer & Colorist",
  description: "Portfolio of Rinku Dhakad, a professional Video Editor, Motion Graphics Artist, and Colorist. Crafting high-impact commercial advertisements, social content, and cinematic visual stories.",
  keywords: ["Video Editor", "Motion Graphics", "Colorist", "DaVinci Resolve", "Rinku Dhakad", "Cinematic Storytelling", "Commercial Ads", "Fusion Compositing", "Video Editor India"],
  authors: [{ name: "Rinku Dhakad" }],
  openGraph: {
    title: "Rinku Dhakad | Premium Video Editor & Motion Designer",
    description: "Portfolio of Rinku Dhakad, professional Video Editor, Motion Graphics Artist, and Colorist.",
    type: "website",
    locale: "en_US",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark antialiased`}
      style={{ colorScheme: "dark" }}
    >
      <body className="bg-dark-950 text-white min-h-screen relative selection:bg-gold-500 selection:text-dark-950">
        {/* Subtle global film grain overlay */}
        <div className="noise-overlay" />
        
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
