import type { Route } from "./+types/buy";

import Hero from "~/sections/Hero/Hero";
import PropertySearchAdvanced from "~/sections/PropertySearchAdvanced/PropertySearchAdvanced";
import Footer from "~/sections/Footer/Footer";

const properties = Array(8).fill({
    id: 1,
    address: "105 Lancaster St SW",
    cityStateZip: "Aiken, SC 29801",
    price: "$700,000",
    sqft: "4,961 SF",
    type: "Office Space",
    agent: "Jane Smith",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    badges: [
      { text: "For Sale", color: "bg-[#CDDC39]" },
      { text: "Price Reduction - 25k, July 1st", color: "bg-[#D4E157]" }
    ]
  });


export default function SavedPropertiesPage(_: Route.ComponentProps) {
    return (
        <>
            <Hero
            variant="full-width-color"
            headingSegments={[
                { text: "Your" },
                { text: "Saved", color: "#DAE684" },
                { text: "Properties" },
            ]}
            subheading="Revisit and manage your favorited listings so you're ready to take the next step?"
            ctaPrimaryLabel="Start the Conversation"
            belowContent={<div className="md:mb-110"></div>}
            />
            
            {/* Wrapper that spans both sections for perfect centering */}
            <div className="relative">
                {/* Background wrapper section */}
                <div className="bg-white relative">
                    {/* PropertySearchAdvanced overlapping between sections - centered on border */}
                    <div className="-mt-0 md:-mt-[420px]" style={{ background: 'linear-gradient(to bottom, var(--strong-green) 50%, transparent 50%)' }}>
                        <PropertySearchAdvanced variant="grid-only" properties={properties} />
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

