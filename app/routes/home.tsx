import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/Hero/FlippedM/FlippedM";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero/>
      <FlippedM/>
    </>
  );
}