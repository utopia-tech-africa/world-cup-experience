import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { QueryProvider } from "@/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/toast";
import { NavbarWrapper } from "@/components/navbar-wrapper";
import "./globals.css";
import Footer from "@/components/footer/footer";
import { HotPackagesToggle } from "@/components/hot-packages-toggle";
import { ContactToggle } from "@/components/contact-toggle";

/** General Sans variable font (weight 200–700) from app/fonts. */
const generalSans = localFont({
  src: [
    {
      path: "../../public/fonts/general-sans/GeneralSans-Extralight.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-ExtralightItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-LightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-MediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/general-sans/GeneralSans-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-general",
  weight: "200 700",
  display: "swap",
});

const clashDisplay = localFont({
  src: [
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/clash-display/ClashDisplay-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-clash",
  display: "swap",
});

const helveticaNeue = localFont({
  src: [
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueUltraLight.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueUltraLightItalic.otf",
      weight: "100",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueThin.otf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueThinItalic.otf",
      weight: "200",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueLight.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueLightItalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueRoman.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueMedium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueMediumItalic.otf",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueBoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueHeavy.otf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueHeavyItalic.otf",
      weight: "800",
      style: "italic",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueBlack.otf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/helvetica-neue/HelveticaNeueBlackItalic.otf",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-helvetica",
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
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-VMS93J5NPV"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VMS93J5NPV');
          `}
        </Script>
        <Script type="text/javascript">
          {` window.smartlook||(function(d) {
    var o=smartlook=function(){ o.api.push(arguments)},h=d.getElementsByTagName('head')[0];
    var c=d.createElement('script');o.api=new Array();c.async=true;c.type='text/javascript';
    c.charset='utf-8';c.src='https://web-sdk.smartlook.com/recorder.js';h.appendChild(c);
    })(document);
    smartlook('init', '35f9aa36c383fc1daac3e9160d82fc79653bd499', { region: 'eu' });`}
        </Script>
      </head>
      <body
        className={`${generalSans.variable} ${clashDisplay.variable} ${helveticaNeue.variable} font-helvetica antialiased`}
      >
        <QueryProvider>
          <ToastProvider>
            {/* <NavbarWrapper /> */}
            {children}
            <Footer />
            <HotPackagesToggle />
            <ContactToggle />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
