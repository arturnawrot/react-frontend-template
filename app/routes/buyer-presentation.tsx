import SplitSection, { 
  SplitSectionHeader, 
  SplitSectionBulletPoint,
  SplitSectionBulletList,
  SplitSectionSubheader,
  SplitSectionContent
} from "~/sections/SplitSection/SplitSection";
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
        <SplitSectionContent>
            <SplitSectionHeader>
              Buying With Us Means a Tangible Advantage
            </SplitSectionHeader>
            
            <SplitSectionBulletList spacing="tight">
              <SplitSectionBulletPoint>
                Gain access to off-market and pre-list opportunities
              </SplitSectionBulletPoint>
              <SplitSectionBulletPoint>
                Let our team guide zoning, use, and location fit
              </SplitSectionBulletPoint>
              <SplitSectionBulletPoint>
                Reduce negotiation friction with experienced advisors
              </SplitSectionBulletPoint>
            </SplitSectionBulletList>
          </SplitSectionContent>
      </SplitSection>

      <FlippedM/>

      <SplitSection imageSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705">
        <SplitSectionContent>
            <SplitSectionHeader>
              Leverage Our Network
            </SplitSectionHeader>
            
            <SplitSectionSubheader>
              Many of our acquisitions never hit the public market. We'll match your criteria to properties quietly available or privately held.
            </SplitSectionSubheader>
          </SplitSectionContent>
      </SplitSection>
      <CTAFooter/>
      <Footer/>
    </>

  );
}

