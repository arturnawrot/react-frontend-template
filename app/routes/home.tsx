import type { Route } from "./+types/home";

import Hero from "~/sections/Hero/Hero";
import FlippedM from "~/sections/Hero/FlippedM/FlippedM";

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Hero/>
      <FlippedM/>

      <div class="relative -mt-24">
  <div class="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-12">
    <h2 class="text-3xl font-semibold text-center mb-6">
      Relationships Built for the Long Game
    </h2>

    <div class="grid md:grid-cols-3 gap-12 text-center">
      <div>
        <div class="text-4xl mb-3">🤝</div>
        <h3 class="font-bold text-lg mb-2">Partnership</h3>
        <p class="text-gray-600 text-sm">We build lasting relationships...</p>
      </div>

      <div>
        <div class="text-4xl mb-3">📈</div>
        <h3 class="font-bold text-lg mb-2">Performance</h3>
        <p class="text-gray-600 text-sm">Our data-driven insights...</p>
      </div>

      <div>
        <div class="text-4xl mb-3">🏛️</div>
        <h3 class="font-bold text-lg mb-2">Perspective</h3>
        <p class="text-gray-600 text-sm">We take a holistic approach...</p>
      </div>
    </div>
  </div>
</div>
    </>
  );
}