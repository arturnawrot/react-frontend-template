import type { Route } from "./+types/individual-property-page";

import Navbar from "~/components/Navbar/Navbar";
import Footer from "~/sections/Footer/Footer";
import PropertyDetails from "~/sections/PropertyDetails/PropertyDetails";
import FeaturedProperties from "~/sections/FeaturedProperties/FeaturedProperties";

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
