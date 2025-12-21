import type { Route } from "../../.react-router/types/non-payloadcms-version/app/routes/+types/home";

import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import FlippedM from "non-payloadcms-version/app/sections/FlippedM/FlippedM";
import CardSection, { type CardItem } from "non-payloadcms-version/app/sections/CardSection/CardSection";
import TestimonialCarousel from "non-payloadcms-version/app/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "non-payloadcms-version/app/sections/AgentCarousel/AgentCarousel";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import PropertySearch from "non-payloadcms-version/app/sections/PropertySearch/PropertySearch";
import CTAFooter from "non-payloadcms-version/app/sections/CTAFooter/CTAFooter";

const cardData: CardItem[] = [
  {
    title: "Partnership",
    icon: "fa-regular fa-handshake",
    description: "We build lasting relationships, offering fiduciary-level care and strategic guidance beyond the deal."
  },
  {
    title: "Performance",
    icon: "fa-regular fa-handshake",
    description: "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind."
  },
  {
    title: "Perspective",
    icon: "fa-regular fa-handshake",
    description: "We take a holistic approach, ensuring real estate decisions align with broader wealth strategies and your highest priority values."
  }
];

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero
        headingSegments={[
          { text: "Smart Moves.", breakOnMobile: true },
          { text: "Strong Futures.", color: "#DAE684" },
        ]} 
        subheading="Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective." 
      />

      <div className="flipped-m-background">
        <FlippedM/>
      </div>

      {/* Wrapper that spans both sections for perfect centering */}
      <div className="relative">
        {/* Background wrapper for testimonial section - border starts here */}

        <div className="tan-linear-background relative">
          {/* Card overlapping between sections - centered on border (top of tan section) */}

          <div className="-mt-80" style={{ background: 'linear-gradient(to bottom, #ffffff 50%, transparent 50%)' }}>
              <CardSection cards={cardData}/>
          </div>

          {/* Spacer to push content below the card - accounts for bottom half of card */}

          <div className="mt-20">

          </div>
          
          <div className="relative z-0">
            <PropertySearch/>
          </div>
          <TestimonialCarousel/>
          <AgentCarousel/>
        </div>
      </div>
      
      <CTAFooter/>
      <Footer/>
    </>
  );
}