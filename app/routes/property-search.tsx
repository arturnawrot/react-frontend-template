import type { Route } from "./+types/buy";

import Hero from "~/sections/Hero/Hero";
import MapSearchAdvanced from "~/sections/MapSearchAdvanced/MapSearchAdvanced";
import Footer from "~/sections/Footer/Footer";

export default function PropertySearchPage(_: Route.ComponentProps) {
    return (
        <>
            <Hero
            variant="full-width-color"
            headingSegments={[
                { text: "Find Properties for" },
                { text: "Sale", color: "#DAE684" },
            ]}
            subheading="Browse commercial opportunities across Augusta, Aiken, Columbia, and beyond."
            belowContent={<div className="md:mb-80"></div>}
            />
            
            <div className="-mt-0 md:-mt-[420px] relative z-10">
                <MapSearchAdvanced backgroundColor="var(--strong-green)" backgroundExtendPx={320} />
            </div>

            <div className="mt-10"></div>

            <Footer/>
        </>
    );
}

