import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "GSM Cabin Rentals | Smoky Mountain Cabins in Gatlinburg, Pigeon Forge & Sevierville",
    template: "%s | GSM Cabin Rentals",
  },
  description: site.description,
  openGraph: {
    title: "GSM Cabin Rentals | Smoky Mountain Cabins",
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: photos.pineTopCabin, width: 1200, height: 900 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-bark-800">
        <MotionProvider>
          <Navbar />
          <main id="top" className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
