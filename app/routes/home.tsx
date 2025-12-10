import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/FlippedM/FlippedM";
import CardSection from "~/sections/CardSection/CardSection";
import TestimonialCarousel from "~/sections/TestimonialCarousel/TestimonialCarousel";
import AgentCarousel from "~/sections/AgentCarousel/AgentCarousel";
import Footer from "~/sections/Footer/Footer";
import MapSearch from "~/sections/MapSearch/MapSearch";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero/>

      <FlippedM/>

      {/* Card overlapping between sections */}
      <div className="relative -mt-100 md:-mt-60 lg:-mt-60 xl:-mt-80 z-10">
        <CardSection/>
      </div>

      {/* Background wrapper for testimonial section - starts immediately after card */}
      <div className="tan-linear-background pt-20 pb-20 -mt-80">
        <div className="mt-80">

        </div>
        
        <MapSearch/>
        <TestimonialCarousel/>
        <AgentCarousel/>
      </div>

      <Footer/>
    </>
  );
}