import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { getPageSections, img, str } from "@/lib/cms";
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

const FALLBACK_TITLE = "GSM Cabin Rentals | Smoky Mountain Cabins in Gatlinburg, Pigeon Forge & Sevierville";
const FALLBACK_DESCRIPTION = site.description;

export async function generateMetadata(): Promise<Metadata> {
  const global = await getPageSections("global");
  const seo = global.seo ?? {};
  const title = str(seo, "title", FALLBACK_TITLE);
  const description = str(seo, "description", FALLBACK_DESCRIPTION);
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: "%s | GSM Cabin Rentals" },
    description,
    openGraph: {
      title: "GSM Cabin Rentals | Smoky Mountain Cabins",
      description,
      url: site.url,
      siteName: site.name,
      type: "website",
      images: [{ url: photos.pineTopCabin, width: 1200, height: 900 }],
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const global = await getPageSections("global");
  const navbar = global.navbar ?? {};

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white font-sans text-bark-800">
        <MotionProvider>
          <Navbar logo={img(navbar, "logo", "/images/logo.jpg")} bookLabel={str(navbar, "bookLabel", "Book Now")} />
          <main id="top" className="flex-1">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
