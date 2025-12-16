import type { Route } from "./+types/exchange-support";

import Hero from "~/sections/Hero/Hero";
import SplitSection from "~/sections/SplitSection/SplitSection";
import Footer from "~/sections/Footer/Footer";
import FlippedM from "~/sections/FlippedM/FlippedM";
import CardSection, { type CardItem } from "~/sections/CardSection/CardSection";
import FeaturedProperties from "~/sections/FeaturedProperties/FeaturedProperties";
import CTAFooter, { type CTAButton } from "~/sections/CTAFooter/CTAFooter";

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
                <div className="space-y-6 md:pl-8">
                    <h2 className="text-4xl md:text-5xl font-serif text-[#1a2e2a] leading-tight">
                        Success Isn't Just About 
                        <br />
                        Deferral. It's About 
                        <br />
                        Direction.
                    </h2>
                    
                    <ul className="space-y-3 text-gray-700 font-medium">
                        <li className="flex items-center gap-3">
                            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                            Identify the right replacement property before the clock runs out
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                            Balance timing, yield, and growth goals
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="w-1 h-1 bg-gray-800 rounded-full"></span>
                            Avoid 11th-hour, misaligned reinvestments
                        </li>
                    </ul>
                </div>
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

