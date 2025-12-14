import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/FlippedM/FlippedM";
import CardSection, { type CardItem } from "~/sections/CardSection/CardSection";
import TestimonialCarousel from "~/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "~/sections/AgentCarousel/AgentCarousel";
import Footer from "~/sections/Footer/Footer";
import MapSearch from "~/sections/MapSearch/MapSearch";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";

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
      <Hero/>

      <FlippedM/>

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
            <MapSearch/>
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