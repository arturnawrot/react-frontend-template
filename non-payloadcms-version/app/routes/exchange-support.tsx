import type { Route } from "../../.react-router/types/non-payloadcms-version/app/routes/+types/exchange-support";

import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import SplitSection, { 
  SplitSectionHeader, 
  SplitSectionBulletPoint,
  SplitSectionBulletList,
  SplitSectionContent
} from "non-payloadcms-version/app/sections/SplitSection/SplitSection";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import FlippedM from "non-payloadcms-version/app/sections/FlippedM/FlippedM";
import CardSection, { type CardItem } from "non-payloadcms-version/app/sections/CardSection/CardSection";
import FeaturedProperties from "non-payloadcms-version/app/sections/FeaturedProperties/FeaturedProperties";
import CTAFooter, { type CTAButton } from "non-payloadcms-version/app/sections/CTAFooter/CTAFooter";

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
  }
];

export default function ExchangeSupportPage(_: Route.ComponentProps) {
    return (
        <>
            <Hero
            variant="split"
            headingSegments={[
                { text: "Your 1031 Exchange," },
                { text: "Strategiaclly Aligned", color: "#DAE684" },
            ]}
            subheading="We help investors plan, identify, and acquire 1031 replacement properties with clarity and confidence."
            ctaPrimaryLabel="Request 1031 Guidance"
            />

            <SplitSection imageSrc="https://images.unsplash.com/photo-1506905925346-21bda4d32df4">
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Success Isn't Just About 
                        <br />
                        Deferral. It's About 
                        <br />
                        Direction.
                    </SplitSectionHeader>
                    
                    <SplitSectionBulletList spacing="normal">
                        <SplitSectionBulletPoint>
                            Identify the right replacement property before the clock runs out
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Balance timing, yield, and growth goals
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Avoid 11th-hour, misaligned reinvestments
                        </SplitSectionBulletPoint>
                    </SplitSectionBulletList>
                </SplitSectionContent>
            </SplitSection>

            <FlippedM ctaText="Talk to a 1031 Specialist" ctaHref="/contact"/>

            <div className="tan-linear-background pb-10">
                <div style={{ background: 'linear-gradient(to bottom, #ffffff 50%, transparent 50%)' }}>
                    <CardSection cards={cardData}/>
                </div>
                <FeaturedProperties/>
            </div>
            
            <CTAFooter
                heading="Have a Property to Sell or Funds to Reinvest?"
                subheading="Let's map your 1031 strategy."
                buttons={[
                    { label: "Talk to a 1031 Specialist", variant: 'primary' },
                    { label: "Submit Your Buy-Criteria", variant: 'secondary' },
                    { label: "See Investment Listings", variant: 'secondary' }
                ]}
            />
            <Footer/>
        </>
    );
}

