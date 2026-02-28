import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/toast";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import "./globals.css";
import Footer from "@/components/footer/footer";

/** General Sans variable font (weight 200–700) from app/fonts. */
const generalSans = localFont({
  src: "./fonts/GeneralSans-Variable.ttf",
  variable: "--font-general",
  weight: "200 700",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../public/fonts/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
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
        className={`${generalSans.variable} ${clashDisplay.variable} font-sans antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <NavbarWrapper />
            {children}
            <Footer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
