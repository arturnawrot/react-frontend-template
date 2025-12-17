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