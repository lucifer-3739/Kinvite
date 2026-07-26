import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans, Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({subsets:['latin'],variable:'--font-heading'});
const outfit = Outfit({subsets:['latin'],variable:'--font-outfit'});

const notoSans = Noto_Sans({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kinvite - Elegant digital invitations",
  description: "Create elegant online invitation cards, manage guest list RSVPs, and visualize relation trees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", notoSans.variable, playfairDisplayHeading.variable, outfit.variable)}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
