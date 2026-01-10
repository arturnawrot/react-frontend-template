import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import CTAFooter from "non-payloadcms-version/app/sections/CTAFooter/CTAFooter";
import AgentDecoration from "non-payloadcms-version/app/sections/AgentDecoration/AgentDecoration";
import AgentDirectory from "non-payloadcms-version/app/sections/AgentDirectory/AgentDirectory";
import AgentsByCategory from "non-payloadcms-version/app/sections/AgentsByCategory/AgentsByCategory";
import TrackRecord from "non-payloadcms-version/app/sections/TrackRecord/TrackRecord";
import CardOnBackground from "non-payloadcms-version/app/sections/CardOnBackground/CardOnBackground";

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