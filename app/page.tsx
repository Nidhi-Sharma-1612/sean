import Hero from "@/components/Hero";
import FeaturedCabins from "@/components/FeaturedCabins";
import WhyStay from "@/components/WhyStay";
import OurStory from "@/components/OurStory";
import ExploreSmokies from "@/components/ExploreSmokies";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import { averageRating, cabins, totalReviews } from "@/lib/data/cabins";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  image: photos.pineTopCabin,
  sameAs: [site.facebook],
  priceRange: `From $${Math.min(...cabins.map((cabin) => cabin.nightlyFrom))} per night`,
  areaServed: "Great Smoky Mountains, Tennessee",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: averageRating,
    reviewCount: totalReviews,
    bestRating: 5,
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <FeaturedCabins />
      <WhyStay />
      <OurStory />
      <ExploreSmokies />
      <Testimonials />
      <CtaBand />
    </>
  );
}
