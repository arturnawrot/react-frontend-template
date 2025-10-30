import React, { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Navbar from '~/components/Navbar/Navbar';
import CollapsingMenuMobile from "~/components/CollapsingMenuMobile/CollapsingMenuMobile";

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="relative h-96 md:h-[700px] w-full">
        {/* Background Image */}
        <img 
          src="/img/hero_section_background.png"
          alt="Hero background"
          className="absolute inset-0 w-full h-full"
          id="home-landing-hero-background"
        />
        <div className="absolute inset-0"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col z-10">
          <Navbar/>

          {/* Hero Content - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6">
              Smart Moves. Strong Futures.
            </h1>
            <p className="text-white text-lg md:text-xl max-w-2xl opacity-90">
            Advisory-led commercial real estate solutions across the Southeast. Rooted in partnership. Driven by performance. Informed by perspective.
            </p>
          </div>

          {/* Mobile: Hamburger Button - Hidden on Desktop */}
          <div className="md:hidden flex justify-center pb-8">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white bg-white bg-opacity-20 p-3 rounded-full hover:bg-opacity-30 transition"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        <CollapsingMenuMobile open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      
      {/* Example section below */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Next Section</h2>
          <p className="text-gray-600">This is content below the hero section with a white background.</p>
        </div>
      </div>
    </>
  );
}