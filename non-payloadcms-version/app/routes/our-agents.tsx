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
                    { text: "Built On Relationships." },
                    { text: "Proven by Results.", color: "#DAE684" },
                ]} 
                subheading="Work with a partner as committed to your success as you are." 
                ctaPrimaryLabel="View Agent Directory" 
            />
            <AgentDecoration />
            <AgentDirectory/>
            <AgentsByCategory/>
            <TrackRecord/>
            <CardOnBackground/>
            <CTAFooter />
            <Footer />
        </>
    );
}