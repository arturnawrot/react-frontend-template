import React from 'react'

export default function Footer() {
  return (
    <div className="w-full font-sans antialiased">
      {/* Footer Section */}
      <footer className="bg-[#1b2e28] text-white pt-20 flex flex-col justify-between overflow-hidden relative">
        
        {/* Main Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-4 mb-20 text-sm items-start">
            
            {/* Column 1 */}
            <div className="flex flex-col gap-3">
              <a href="/buy" className="hover:text-[#dce567] transition w-fit outline-none border-none">Buy</a>
              <a href="/lease" className="hover:text-[#dce567] transition w-fit outline-none border-none">Lease</a>
              <a href="/sell" className="hover:text-[#dce567] transition w-fit outline-none border-none">Sell</a>
              <a href="/insights" className="hover:text-[#dce567] transition w-fit outline-none border-none">Insights & Research</a>
            </div>

            {/* Column 2 */}
            <div className="flex flex-col gap-3">
              <a href="/agents" className="hover:text-[#dce567] transition w-fit outline-none border-none">Our Agents</a>
              <a href="/advantages" className="hover:text-[#dce567] transition w-fit outline-none border-none">Our Advantage</a>
              <a href="/services" className="hover:text-[#dce567] transition w-fit outline-none border-none">Our Services</a>
              <a href="/company" className="hover:text-[#dce567] transition w-fit outline-none border-none">Our Company</a>
            </div>

            {/* Column 3 */}
            <div className="flex flex-col gap-3">
              <a href="/login" className="hover:text-[#dce567] transition w-fit outline-none border-none">Account Login</a>
              <a href="/contact" className="hover:text-[#dce567] transition w-fit outline-none border-none">Contact Us</a>
              <a href="/schedule" className="hover:text-[#dce567] transition w-fit outline-none border-none">Schedule a Tour / Consultation</a>
            </div>

            {/* Column 4 - Addresses */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="font-bold text-xs uppercase text-gray-400 mb-1">Office</p>
                <p>3519 Wheeler Road,</p>
                <p>Augusta, GA 30909</p>
                <p className="mt-1">706.736.0700</p>
              </div>
              <div>
                 <div className="flex justify-between w-32">
                   <span className="font-bold text-xs uppercase text-gray-400">Fax</span>
                 </div>
                 <p>706.736.5363</p>
              </div>
            </div>

             {/* Column 5 - Address 2 & Social */}
             <div className="flex flex-col gap-6">
              <div>
                <p className="font-bold text-xs uppercase text-gray-400 mb-1">Office</p>
                <p>142 Laurens Street NW,</p>
                <p>Aiken, SC 29801</p>
                <p className="mt-1">803.644.1770</p>
              </div>
              
              <div className="mt-2">
                 <p className="font-bold text-xs uppercase text-gray-400 mb-1">Toll Free</p>
                 <p className="mb-4">800.241.9726</p>
                 
                 {/* Socials */}
                 <div className="flex gap-4">
                    {/* Facebook Icon */}
                    <a href="#" className="text-white hover:text-[#dce567] transition duration-300">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>

                    {/* LinkedIn Icon */}
                    <a href="#" className="text-white hover:text-[#dce567] transition duration-300">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                 </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center text-[10px] text-gray-400 border-t border-gray-700/30 pt-4 pb-12">
            <p>&copy; 2025 Real Estate Co. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition outline-none">Accessibility</a>
              <a href="#" className="hover:text-white transition outline-none">Privacy Policy</a>
              <a href="#" className="hover:text-white transition outline-none">Terms of Service</a>
              <a href="#" className="hover:text-white transition outline-none">Cookies Settings</a>
            </div>
          </div>
        </div>

        {/* Block CSS Text */}
        <div className="w-full flex justify-center overflow-hidden select-none pointer-events-none">
             <h1 className="text-[24vw] font-bold text-white opacity-10 leading-[0.75] tracking-tighter m-0 whitespace-nowrap">
               SAMPLE
             </h1>
        </div>

      </footer>
    </div>
  )
}

