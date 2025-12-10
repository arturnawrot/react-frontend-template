import type { Route } from "./+types/buyer-presentation";

import Hero from "~/sections/Hero/Hero";

export default function BuyerPresentation(_: Route.ComponentProps) {
  return (
    <Hero
      variant="split"
      headingSegments={[
        { text: "We Represent Buyers Who" },
        { text: "Think Strategically", color: "#DAE684" },
      ]}
      subheading="From investment acquisitions to site selection, we find opportunities that align with your best interests."
      ctaPrimaryLabel="Start the Conversation"
    />
  );
}

