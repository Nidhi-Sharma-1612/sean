import Hero from "@/components/Hero";
import FeaturedCabins from "@/components/FeaturedCabins";
import WhyStay from "@/components/WhyStay";
import OurStory from "@/components/OurStory";
import ExploreSmokies from "@/components/ExploreSmokies";
import Testimonials from "@/components/Testimonials";
import CtaBand from "@/components/CtaBand";
import { averageRating, totalReviews } from "@/lib/data/cabins";
import { photos } from "@/lib/photos";
import { site } from "@/lib/site";
import { getCmsCabins } from "@/lib/cabin-cms";
import { getPageSections, img, objList, str } from "@/lib/cms";
import { DEFAULT_FEATURES, DEFAULT_JOURNEY, DEFAULT_TILES } from "@/lib/home-content";

const looksLikeUrl = (v: string) => v.startsWith("/") || /^https?:\/\//.test(v);

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: site.name,
  description: site.description,
  url: site.url,
  email: site.email,
  image: photos.pineTopCabin,
  sameAs: [site.facebook],
  areaServed: "Great Smoky Mountains, Tennessee",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: averageRating,
    reviewCount: totalReviews,
    bestRating: 5,
  },
};

export default async function Home() {
  const [cabins, sections] = await Promise.all([getCmsCabins(), getPageSections("home")]);
  const hero = sections.hero ?? {};
  const featuredIntro = sections.featuredCabins ?? {};
  const whyStay = sections.whyStay ?? {};
  const ourStory = sections.ourStory ?? {};
  const cta = sections.cta ?? {};
  const explore = sections.explore ?? {};
  const nearby = sections.nearbyPlanner ?? {};

  const whyStayFeatures = objList(whyStay, "features", ["title", "description", "image"] as const, DEFAULT_FEATURES);
  const featureContent =
    whyStayFeatures.length === DEFAULT_FEATURES.length && whyStayFeatures.every((f) => looksLikeUrl(f.image))
      ? whyStayFeatures
      : DEFAULT_FEATURES;

  const journeyItems = objList(ourStory, "journey", ["place", "detail"] as const, DEFAULT_JOURNEY);
  const journey = journeyItems.length === DEFAULT_JOURNEY.length ? journeyItems : DEFAULT_JOURNEY;

  const exploreTiles = objList(explore, "tiles", ["title", "description", "image"] as const, DEFAULT_TILES);
  const tileContent =
    exploreTiles.length === DEFAULT_TILES.length && exploreTiles.every((t) => looksLikeUrl(t.image))
      ? exploreTiles
      : DEFAULT_TILES;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Hero
        eyebrow={str(hero, "eyebrow", "Gatlinburg · Pigeon Forge · Sevierville")}
        heading={str(hero, "heading", "Your Basecamp in the Great Smoky Mountains")}
        subheading={str(hero, "subheading", `${site.tagline}, in three cabins cared for by their owners.`)}
        image={img(hero, "image", photos.pineTopFall)}
      />
      <FeaturedCabins
        cabins={cabins}
        eyebrow={str(featuredIntro, "eyebrow", "Our Cabins")}
        heading={str(featuredIntro, "heading", "Three cabins, three ways to do the Smokies")}
        description={str(
          featuredIntro,
          "description",
          "Big views in Gatlinburg, an indoor pool close to the Pigeon Forge strip, and a secluded retreat outside Sevierville.",
        )}
        linkLabel={str(featuredIntro, "linkLabel", "See all availability")}
      />
      <WhyStay
        eyebrow={str(whyStay, "eyebrow", "Why GSM")}
        heading={str(whyStay, "heading", "Everything your crew needs under one roof")}
        description={str(
          whyStay,
          "description",
          "Plan a day out in the mountains, or don't. These cabins are built for rainy days and lazy mornings too.",
        )}
        featureContent={featureContent}
      />
      <OurStory
        eyebrow={str(ourStory, "eyebrow", "Our Story")}
        heading={str(ourStory, "heading", "Hello from Sean & Sarah")}
        paragraph1={str(
          ourStory,
          "paragraph1",
          "We're Sean and Sarah—originally from California and now based in North Carolina. Along the way, we fell in love with the Great Smoky Mountains and the Carolina coast.",
        )}
        paragraph2={str(
          ourStory,
          "paragraph2",
          "Our homes are places we personally enjoy, care for hands-on, and love sharing with guests. We hope they're where your family makes lasting memories, just like we do.",
        )}
        image1={img(ourStory, "image1", photos.pineTopCabin)}
        image2={img(ourStory, "image2", photos.bluffRidgeFireplace)}
        journey={journey}
        primaryLabel={str(ourStory, "primaryLabel", "Say hello")}
        secondaryLabel={str(ourStory, "secondaryLabel", "Meet our cabins")}
      />
      <ExploreSmokies
        eyebrow={str(explore, "eyebrow", "Explore the Smokies")}
        heading={str(explore, "heading", "More than just a place to stay")}
        description={str(
          explore,
          "description",
          "Trails and waterfalls on one side, the bright lights of the Parkway on the other. Your cabin puts you between them.",
        )}
        tileContent={tileContent}
        nearbyHeading={str(nearby, "heading", "How close is everything?")}
        nearbyDescription={str(nearby, "description", "Pick a cabin to see what's nearby.")}
      />
      <Testimonials />
      <CtaBand
        eyebrow={str(cta, "eyebrow", "Start Planning")}
        heading={str(cta, "heading", "Your cabin in the Smokies is waiting")}
        description={str(
          cta,
          "description",
          "Pick your dates and book, or send us a note and we'll help you find the right cabin for your group.",
        )}
        image={img(cta, "image", photos.pineTopSunset)}
        primaryLabel={str(cta, "primaryLabel", "Check Availability")}
        secondaryLabel={str(cta, "secondaryLabel", "Contact Us")}
        priceNote={str(cta, "priceNote", "Rates vary by date")}
        priceDetail={str(cta, "priceDetail", "See your exact total before you pay")}
      />
    </>
  );
}
