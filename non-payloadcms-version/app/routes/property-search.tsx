import type { Route } from "../../.react-router/types/non-payloadcms-version/app/routes/+types/buy";

import Hero from "non-payloadcms-version/app/sections/Hero/Hero";
import PropertySearchAdvanced from "non-payloadcms-version/app/sections/PropertySearchAdvanced/PropertySearchAdvanced";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";

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
            
            {/* Wrapper that spans both sections for perfect centering */}
            <div className="relative">
                {/* Background wrapper section */}
                <div className="bg-white relative">
                    {/* PropertySearchAdvanced overlapping between sections - centered on border */}
                    <div className="-mt-0 md:-mt-[420px]" style={{ background: 'linear-gradient(to bottom, var(--strong-green) 50%, transparent 50%)' }}>
                        <PropertySearchAdvanced/>
                    </div>

                    {/* Spacer to push content below the PropertySearchAdvanced - accounts for bottom half */}
                    <div className="mt-20">
                    </div>
                </div>
            </div>

            <Footer/>
        </>
    );
}

