import type { Route } from "../../.react-router/types/non-payloadcms-version/app/routes/+types/buy";
import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import CardSection, { type CardItem } from "non-payloadcms-version/app/sections/CardSection/CardSection";
import PropertySearchInput from "non-payloadcms-version/app/sections/PropertySearchInput/PropertySearchInput";
import TestimonialCarousel from "non-payloadcms-version/app/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "non-payloadcms-version/app/sections/AgentCarousel/AgentCarousel";
import CTAFooter from "non-payloadcms-version/app/sections/CTAFooter/CTAFooter";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import FeaturedProperties from "non-payloadcms-version/app/sections/FeaturedProperties/FeaturedProperties";
import SplitSection, { 
  SplitSectionHeader, 
  SplitSectionBulletPoint,
  SplitSectionBulletList,
  SplitSectionLink,
  SplitSectionContent
} from "non-payloadcms-version/app/sections/SplitSection/SplitSection";
import InsightsSection from "non-payloadcms-version/app/sections/InsightsSection/InsightsSection";
import TrackRecordSection from "non-payloadcms-version/app/sections/TrackRecord/TrackRecord";
import PropertySearch from "non-payloadcms-version/app/sections/PropertySearch/PropertySearch";

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
        { text: "Buy With Insight.", breakOnMobile: true },
        { text: "Invest With", color: "#DAE684", breakOnMobile: true },
        { text: "Confidence.", color: "#DAE684" },
      ]}
      subheading="Approach every deal confidently, knowing you’re backed by analytical excellence, investment foresight, and personal care."
      ctaPrimaryLabel="Start Your Property Search"
      ctaSecondaryLabel="Schedule a Consultation"
      belowContent={<div className="md:mb-50"></div>}
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
            <SplitSectionContent>
                <SplitSectionHeader>
                  Navigating Complex Transactions with Confidence
                </SplitSectionHeader>
                
                <SplitSectionBulletList spacing="tight">
                  <SplitSectionBulletPoint>
                    1031 Exchange Advisory
                  </SplitSectionBulletPoint>
                  <SplitSectionBulletPoint>
                    Portfolio Structuring
                  </SplitSectionBulletPoint>
                  <SplitSectionBulletPoint>
                    Multi-Market Acquisition
                  </SplitSectionBulletPoint>
                </SplitSectionBulletList>

                <SplitSectionLink href="#">
                  Learn About Our Process
                </SplitSectionLink>
            </SplitSectionContent>
        </SplitSection>

        <InsightsSection/>

        <div className="tan-linear-background">
          <TrackRecordSection/>
          <PropertySearch/>
          <AgentCarousel/>
        </div>
    </div>
    
    <CTAFooter/>
    <Footer/>
    </>
  );
}