import React from "react";
import { Search, X } from "lucide-react";

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

      {/* Mobile Menu Sliding from Bottom */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`md:hidden fixed inset-x-0 bg-black bg-opacity-95 transition-transform duration-300 ease-in-out z-50 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ bottom: 0, top: "10%" }}
      >
        <div className="flex flex-col justify-between h-full py-8">
          {/* Navigation Links */}
          <div className="flex flex-col items-center gap-8 text-2xl">
            <a href="#" className="text-white hover:text-opacity-80 transition">Home</a>
            <a href="#" className="text-white hover:text-opacity-80 transition">Services</a>
            <a href="#" className="text-white hover:text-opacity-80 transition">Portfolio</a>
            <a href="#" className="text-white hover:text-opacity-80 transition">Blog</a>
            <a href="#" className="text-white hover:text-opacity-80 transition">About</a>
            <a href="#" className="text-white hover:text-opacity-80 transition">Contact</a>

            <div className="relative w-64 mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-white/20 text-white placeholder-white/70 rounded-full py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            {/* Close Button */}
            <div className="flex justify-center">
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