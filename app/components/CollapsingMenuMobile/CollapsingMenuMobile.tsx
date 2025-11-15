import React from "react";
import { Search, X } from "lucide-react";
import { CollapsingMenuMobileLink, MAIN_LINKS } from "../NavbarLink/NavbarLink";
import styles from './CollapsingMenuMobile.module.scss';

export default function CollapsingMenuMobile({ open, onClose }) {
  return (
    <>
      {/* Backdrop: click to close */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`md:hidden fixed inset-x-0 bg-[#DAE684] transition-transform duration-300 ease-in-out z-50 overflow-y-auto rounded-tl-3xl ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ 
          bottom: 0, 
          top: "10%",
          backgroundImage: `url("./svg/flipped-m-collapsing-mobile.svg")`,
          // backgroundBlendMode: 'overlay',
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
          // backgroundPosition: 'left'
        }}
      >
        <div className="flex flex-col min-h-full py-8">
          {/* Navigation Links - Left Aligned */}
          <div className="flex flex-col items-start gap-8 text-2xl flex-1 justify-center">
            {MAIN_LINKS.map(link => (
              <CollapsingMenuMobileLink key={link.href} href={link.href}>
                {link.label}
              </CollapsingMenuMobileLink>
            ))}
            
            {/* Search Bar - Left Aligned */}
            <div className="relative w-full px-8 mt-4">
              <Search className="absolute left-11 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/20 text-white placeholder-white/70 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Close Button - Left Aligned */}
            <div className="w-full flex justify-center mt-4">
              <button
                onClick={onClose}
                className="text-white bg-white/20 p-3 rounded-full hover:bg-opacity-30 transition"
                aria-label="Close menu"
              >
                <X size={28} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}