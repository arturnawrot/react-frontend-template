import SplitSection from "~/sections/SplitSection/SplitSection";
import type { Route } from "./+types/buyer-presentation";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/FlippedM/FlippedM";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";
import Footer from "~/sections/Footer/Footer";

export default function BuyerPresentation(_: Route.ComponentProps) {
  return (
    <>
      <Hero
        variant="split"
        headingSegments={[
          { text: "We Represent Buyers Who" },
          { text: "Think Strategically", color: "#DAE684" },
        ]}
        subheading="From investment acquisitions to site selection, we find opportunities that align with your best interests."
        ctaPrimaryLabel="Start the Conversation"
      />

      <SplitSection imageSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705">
        <div className="space-y-6 md:pl-8">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
              Buying With Us Means a Tangible Advantage
            </h2>
            
            <ul className="space-y-2 text-gray-700 font-medium">
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                Gain access to off-market and pre-list opportunities
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                Let our team guide zoning, use, and location fit
              </li>
              <li className="flex items-center gap-3">
                <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                Reduce negotiation friction with experienced advisors
              </li>
            </ul>
          </div>
      </SplitSection>

      <FlippedM/>

      <SplitSection imageSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705">
        <div className="space-y-6 md:pl-8">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
              Leverage Our Network
            </h2>
            
            <p>
              Many of our acquisitions never hit the public market. We’ll match your criteria to properties quietly available or privately held.
            </p>
          </div>
      </SplitSection>
      <CTAFooter/>
      <Footer/>
    </>

  );
}

