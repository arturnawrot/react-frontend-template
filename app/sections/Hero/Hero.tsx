import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Navbar from '~/components/Navbar/Navbar';
import CollapsingMenuMobile from "~/components/CollapsingMenuMobile/CollapsingMenuMobile";
import styles from './Hero.module.scss';

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div 
        className="
          relative 
          w-full 
          bg-cover bg-center bg-no-repeat
          md:h-[700px]
          md:min-h-[700px]
        "
        style={{ backgroundImage: "url('/img/hero_section_background.png')" }}
      >
        <div className="relative z-10 flex flex-col h-full pb-10">
          <Navbar />
          
          <div
            className="
              mt-10
              md:mt-0
              md:flex-1
              md:flex
              md:flex-col
              md:items-center
              md:justify-center
              px-6
              text-center
              flex flex-col items-center
            "
          >
            <h1
              className={`
                text-white 
                text-4xl md:text-7xl
                font-bold mb-6 
                ${styles.heroHeading}
              `}
            >
              <div className="flex flex-col lg:flex-row lg:gap-4 lg:flex-wrap lg:justify-center">
                <span className="inline-block">
                  Smart Moves.
                </span>
                <span className="text-[#DAE684] inline-block">
                  Strong Futures.
                </span>
              </div>
            </h1>
            
            <p className={`${styles.heroSubheading} max-w-[1200px] max-[1150px]:max-w-[800px] max-[768px]:max-w-[400px]`}>
              Advisory-led commercial real estate solutions across the Southeast. 
              Rooted in partnership. Driven by performance. Informed by perspective.
            </p>
          </div>
          
          <div className="md:hidden flex justify-center mt-8 px-6">
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
    </>
  );
}