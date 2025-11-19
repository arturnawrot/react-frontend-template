import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/FlippedM/FlippedM";
import CardSection from "~/sections/CardSection/CardSection";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero/>

      <FlippedM/>

      <div class="-mt-20 md:-mt-40 lg:-mt-60 xl:-mt-100">
        <CardSection/>
      </div>
    </>
  );
}