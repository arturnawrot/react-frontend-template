import Hero from "~/sections/Hero/Hero";
import Footer from "~/sections/Footer/Footer";
import CTAFooter from "~/sections/CTAFooter/CTAFooter";
import AgentDecoration from "~/sections/AgentDecoration/AgentDecoration";
import AgentDirectory from "~/sections/AgentDirectory/AgentDirectory";
import AgentsByCategory from "~/sections/AgentsByCategory/AgentsByCategory";
import TrackRecord from "~/sections/TrackRecord/TrackRecord";
import CardOnBackground from "~/sections/CardOnBackground/CardOnBackground";

export default function OurAgentsPage() {
    return (
        <>
            <Hero variant="split" 
                headingSegments={[
                    { text: "Find a Broker You Can Trust" },
                    { text: "Through Every Stage"},
                ]}
                subheading="Meybohm agents are not just salespeople. They’re advisors, advocates, and long-term partners." 
                ctaPrimaryLabel="Browse All Agents" 
            />
            <AgentDirectory/>
            <CardOnBackground/>
            <CTAFooter 
                heading="Not Sure Who to Talk To?"
                subheading="Tell us about your property or project — we’ll match you with the right broker."
            />            
            <Footer />
        </>
    );
}