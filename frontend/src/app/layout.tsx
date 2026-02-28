import type { Metadata } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/providers/QueryProvider";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Figma uses "General Sans Variable"; Plus Jakarta Sans is the closest Google Fonts alternative. */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-general-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "World Cup Experience Booking Platform",
  description: "Book your World Cup travel packages with Altair Logistics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} antialiased`}>
        <QueryProvider>
          <NavbarWrapper />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
