import Hero from "~/sections/Hero/Hero";
import Footer from "~/sections/Footer/Footer";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";
import AgentDecoration from "~/sections/AgentDecoration/AgentDecoration";
import AgentDirectory from "~/sections/AgentDirectory/AgentDirectory";
import AgentsByCategory from "~/sections/AgentsByCategory/AgentsByCategory";
import TrackRecord from "~/sections/TrackRecord/TrackRecord";
import CardOnBackground from "~/sections/CardOnBackground/CardOnBackground";
import FeaturedProperties from "~/sections/FeaturedProperties/FeaturedProperties";
import AboutAgent from "~/sections/AboutAgent/AboutAgent";

export default function AgentPage() {
    return (
        <>
            <Hero variant="agent" 
                headingSegments={[
                    { text: "Jordan Collier" }
                ]}
                subheading="Agent & Broker" 
                ctaPrimaryLabel="Schedule A Consultation" 
                agentImage="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop"
                agentEmail="jordan@meybohm.com"
                agentPhone="803-555-1234"
                agentLinkedin="https://www.linkedin.com/in/jordan-collier"
            />
            <AboutAgent
                agentName="Jordan Collier"
                email="jordan@meybohm.com"
                phone="803-555-1234"
                linkedin="https://www.linkedin.com/in/jordan-collier"
            />
            <div className="tan-linear-background">
                <FeaturedProperties/>
                <TrackRecord/>
            </div>
            
            <CTAFooter 
                heading="Ready to Talk with [Agent First Name]?"
                subheading="Get in touch to explore listings, strategies, or your next move."
            />            
            <Footer />
        </>
    );
}