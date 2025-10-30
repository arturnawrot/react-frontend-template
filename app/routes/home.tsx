import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <Hero/>
  );
}