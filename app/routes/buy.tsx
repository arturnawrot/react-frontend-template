import type { Route } from "./+types/buy";

import Hero from "~/sections/Hero/Hero";
import CardSection from "~/sections/CardSection/CardSection";
import MapSearch from "~/sections/MapSearch/MapSearch";
import TestimonialCarousel from "~/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "~/sections/AgentCarousel/AgentCarousel";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";
import Footer from "~/sections/Footer/Footer";
import PropertySearch from "~/sections/PropertySearch/PropertySearch";
import FeaturedProperties from "~/sections/FeaturedProperties/FeaturedProperties";
import SplitSection from "~/sections/SplitSection/SplitSection";
import InsightsSection from "~/sections/InsightsSection/InsightsSection";
import TrackRecordSection from "~/sections/TrackRecord/TrackRecord";

const ArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
  </svg>
);


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

    {/* Card overlapping between sections */}
    <div className="-mt-0 md:-mt-[280px] md:-mb-[100px] relative z-1">
      <PropertySearch/>
    </div>

    <FeaturedProperties/>

    <div className="relative z-10">
        <CardSection/>
    </div>

    {/* Background wrapper for testimonial section - starts immediately after card */}
    <div className="tan-linear-background pt-20 pb-20 -mt-80">
      <div className="mt-70"></div>

      <TestimonialCarousel/>

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

      <div className="mt-20"></div>

      <TrackRecordSection/>

      <MapSearch/>
      <AgentCarousel/>
    </div>
    
    <CTAFooter/>
    <Footer/>
    </>
  );
}

