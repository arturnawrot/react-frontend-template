import type { Route } from "../../.react-router/types/non-payloadcms-version/app/routes/+types/individual-property-page";

import Navbar from "non-payloadcms-version/app/components/Navbar/Navbar";
import Footer from "non-payloadcms-version/app/sections/Footer/Footer";
import PropertyDetails from "non-payloadcms-version/app/sections/PropertyDetails/PropertyDetails";
import FeaturedProperties from "non-payloadcms-version/app/sections/FeaturedProperties/FeaturedProperties";

export default function IndividualPropertyPage(_: Route.ComponentProps) {
    return (
        <>
            <div className="bg-transparent md:bg-[var(--strong-green)]">
                <Navbar darkVariant={true} />
            </div>
            <PropertyDetails />
            <div className="bg-[#D7D1C4]">
                <FeaturedProperties />
            </div>
            <Footer />
        </>
    );
}
