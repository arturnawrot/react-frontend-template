import type { Route } from "./+types/buy";
import Hero from "~/sections/Hero/Hero";
import CardSection, { type CardItem } from "~/sections/CardSection/CardSection";
import PropertySearchInput from "~/sections/PropertySearchInput/PropertySearchInput";
import TestimonialCarousel from "~/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "~/sections/AgentCarousel/AgentCarousel";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";
import Footer from "~/sections/Footer/Footer";
import FeaturedProperties from "~/sections/FeaturedProperties/FeaturedProperties";
import SplitSection from "~/sections/SplitSection/SplitSection";
import InsightsSection from "~/sections/InsightsSection/InsightsSection";
import TrackRecordSection from "~/sections/TrackRecord/TrackRecord";
import PropertySearch from "~/sections/PropertySearch/PropertySearch";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
);

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
    title: "Performance",
    icon: "fa-regular fa-handshake",
    description: "Our data-driven insights and disciplined approach deliver high-value, measurable results we're proud to stand behind."
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

export default function BuyPage(_: Route.ComponentProps) {
  return (
    <>
    <Hero
      variant="full-width-color"
      headingSegments={[
        { text: "Buy With Insight." },
        { text: "Invest With Confidence.", color: "#DAE684" },
      ]}
      subheading="Approach every deal confidently, knowing you’re backed by analytical excellence, investment foresight, and personal care."
      ctaPrimaryLabel="Start Your Property Search"
      ctaSecondaryLabel="Schedule a Consultation"
      belowContent={<div className="md:mb-20"></div>}
    />

    {/* Header overlap (left as is per original design for Hero/Search) */}
    <div className="-mt-0 md:-mt-[220px] md:-mb-[100px] z-100" style={{ background: 'linear-gradient(to bottom, var(--strong-green) 50%, transparent 50%)' }}>
      <PropertySearchInput/>
    </div>

    {/* Section Above */}
    <FeaturedProperties/>

    {/* Tan Background Wrapper */}
    <div className="tan-linear-background pb-20">
        
        {/* 
            THE FIX:
            We place the CardSection normally in the flow (no absolute).
            We give this wrapper a gradient background:
            - Top 50% White: Merges visually with the FeaturedProperties section above.
            - Bottom 50% Transparent: Reveals the 'tan-linear-background' of the parent div.
        */}
        <div style={{ background: 'linear-gradient(to bottom, #ffffff 50%, transparent 50%)' }}>
            <CardSection cards={cardData}/>
        </div>

        {/* 
           Content below flows naturally. 
           Added pt-20 to give some breathing room between the card and the testimonials.
        */}
        <div className="pt-20 relative z-0">
            <TestimonialCarousel/>
        </div>

        <SplitSection imageSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705">
            <div className="space-y-6 md:pl-8">
                <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
                  Navigating Complex Transactions with Confidence
                </h2>
                
                <ul className="space-y-2 text-gray-700 font-medium">
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                    1031 Exchange Advisory
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                    Portfolio Structuring
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                    Multi-Market Acquisition
                  </li>
                </ul>

                <div className="pt-4">
                  <a 
                    href="#" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#1a2e2a] transition-colors border-b border-transparent hover:border-gray-800 pb-0.5"
                  >
                    Learn About Our Process
                    <ArrowRight />
                  </a>
                </div>
            </div>

            <div className="mt-60"></div>
        </SplitSection>

        <InsightsSection/>
        <TrackRecordSection/>
        <PropertySearch/>
        <AgentCarousel/>
    </div>
    
    <CTAFooter/>
    <Footer/>
    </>
  );
}