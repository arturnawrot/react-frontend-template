import type { Route } from "./+types/buy";

import Hero from "~/sections/Hero/Hero";

export default function BuyPage(_: Route.ComponentProps) {
  return (
    <Hero
      variant="full-width-color"
      headingSegments={[
        { text: "Buy With Insight." },
        { text: "Invest With Confidence.", color: "#DAE684" },
      ]}
      subheading="Approach every deal confidently, knowing you’re backed by analytical excellence, investment foresight, and personal care."
      ctaPrimaryLabel="Start Your Property Search"
      ctaSecondaryLabel="Schedule a Consultation"
    />
  );
}

