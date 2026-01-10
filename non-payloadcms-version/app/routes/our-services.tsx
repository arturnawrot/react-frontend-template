import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import CTAFooter from "non-payloadcms-version/app/sections/CTAFooter/CTAFooter";
import SplitSection, { 
  SplitSectionHeader, 
  SplitSectionSubheader, 
  SplitSectionBulletPoint,
  SplitSectionBulletList,
  SplitSectionLink,
  SplitSectionContent
} from "non-payloadcms-version/app/sections/SplitSection/SplitSection";

export default function OurServicesPage() {
    return (
        <>
            <Hero variant="split" 
                headingSegments={[
                    { text: "Beyond", breakOnMobile: true },
                    { text: "Brokerage:", breakOnMobile: true },
                    { text: "Services", breakOnDesktop: true },
                    { text: "That", breakOnMobile: true },
                    { text: "Support", color: "#DAE684" },
                    { text: "the Full", breakOnDesktop: true, breakOnMobile: true },
                    { text: "Property Lifecycle" }
                ]}
                subheading="From project planning to property management, Meybohm supports every phase of your commercial investment." 
                ctaPrimaryLabel="Explore Our Capabilities" 
            />

            {/* Section 1: Advisory That's Invested */}
            <SplitSection 
                imageSrc="https://images.unsplash.com/photo-1593062096033-9a26b09da705"
                imageAlt="Advisory services"
            >
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Advisory That's Invested
                    </SplitSectionHeader>
                    
                    <SplitSectionSubheader>
                        We're as committed to your success as you are at every stage of your investment journey.
                    </SplitSectionSubheader>
                    
                    <SplitSectionBulletList spacing="tight">
                        <SplitSectionBulletPoint>
                            Investment planning
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Land use and development strategy
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Portfolio decision support
                        </SplitSectionBulletPoint>
                    </SplitSectionBulletList>

                    <SplitSectionLink href="#">
                        See Planning & Consulting
                    </SplitSectionLink>
                </SplitSectionContent>
            </SplitSection>

            {/* Section 2: Property Management */}
            <SplitSection 
                imageSrc="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                imageAlt="Property management"
                isReversed={true}
            >
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Property Management
                    </SplitSectionHeader>
                    
                    <SplitSectionSubheader>
                        We manage over 1 million square feet of retail and office space - delivering tenant satisfaction, financial clarity, and property performance.
                    </SplitSectionSubheader>
                    
                    <SplitSectionBulletList spacing="tight">
                        <SplitSectionBulletPoint>
                            Tenant relations
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Maintenance coordination
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Financial reporting and accounting
                        </SplitSectionBulletPoint>
                    </SplitSectionBulletList>

                    <SplitSectionLink href="#">
                        View Management Services
                    </SplitSectionLink>
                </SplitSectionContent>
            </SplitSection>

            {/* Section 3: Built for Ground-Up Success */}
            <SplitSection 
                imageSrc="https://images.unsplash.com/photo-1504307651254-35680f356dfd"
                imageAlt="Construction and development"
            >
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Built for Ground-Up Success
                    </SplitSectionHeader>
                    
                    <SplitSectionSubheader>
                        From site selection to construction, we support projects from start to finish.
                    </SplitSectionSubheader>
                    
                    <SplitSectionBulletList spacing="tight">
                        <SplitSectionBulletPoint>
                            Build-to-suit execution
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Project management
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Land acquisition and planning
                        </SplitSectionBulletPoint>
                    </SplitSectionBulletList>

                    <SplitSectionLink href="#">
                        Explore Development
                    </SplitSectionLink>
                </SplitSectionContent>
            </SplitSection>

            {/* Section 4: Vision-Driven Property Guidance */}
            <SplitSection 
                imageSrc="https://images.unsplash.com/photo-1552664730-d307ca884978"
                imageAlt="Vision-driven property guidance"
                isReversed={true}
            >
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Vision-Driven Property Guidance
                    </SplitSectionHeader>
                    
                    <SplitSectionSubheader>
                        Whether you're improving, selling, or holding, we help you think beyond the next transaction.
                    </SplitSectionSubheader>
                    
                    <SplitSectionBulletList spacing="tight">
                        <SplitSectionBulletPoint>
                            Succession planning
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Conservation & use optimization
                        </SplitSectionBulletPoint>
                        <SplitSectionBulletPoint>
                            Land improvement strategies
                        </SplitSectionBulletPoint>
                    </SplitSectionBulletList>

                    <SplitSectionLink href="#">
                        Start Planning
                    </SplitSectionLink>
                </SplitSectionContent>
            </SplitSection>

            {/* Section 5: Portfolio Oversight for Long-Term Growth */}
            <SplitSection 
                imageSrc="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c"
                imageAlt="Portfolio oversight"
            >
                <SplitSectionContent>
                    <SplitSectionHeader>
                        Portfolio Oversight for Long-Term Growth
                    </SplitSectionHeader>
                    
                    <SplitSectionSubheader>
                        For institutional clients and growing owners, we offer holistic portfolio insight and performance monitoring.
                    </SplitSectionSubheader>
                    
                    <div className="pt-4">
                        <p className="text-sm font-semibold text-gray-800">
                            Coming Soon
                        </p>
                    </div>
                </SplitSectionContent>
            </SplitSection>

            <CTAFooter 
                heading="Ready to Talk with [Agent First Name]?"
                subheading="Get in touch to explore listings, strategies, or your next move."
            />            
            <Footer />
        </>
    );
}