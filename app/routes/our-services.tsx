import Hero from "~/sections/Hero/Hero";
import Footer from "~/sections/Footer/Footer";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";

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

            <CTAFooter 
                heading="Ready to Talk with [Agent First Name]?"
                subheading="Get in touch to explore listings, strategies, or your next move."
            />            
            <Footer />
        </>
    );
}