import React from 'react'
import Link from 'next/link'
import { getFooterData } from '@/utils/footer'

export default async function Footer() {
  const footerData = await getFooterData()

  // Calculate total columns: navigation columns + offices
  const totalColumns = footerData.navigationColumns.length + footerData.offices.length

  return (
    <div className="w-full font-sans antialiased">
      {/* Footer Section */}
      <footer className="bg-[#1b2e28] text-white pt-20 flex flex-col justify-between overflow-hidden relative">
        
        {/* Main Content */}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden">
            
            {/* Top Section: Navigation Links - 2 columns on mobile */}
            <div className="grid grid-cols-2 gap-10 mb-10 text-sm">
              {footerData.navigationColumns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col gap-3">
                  {column.map((link, linkIndex) => (
                    <Link
                      key={linkIndex}
                      href={link.href}
                      className="hover:text-[#dce567] transition w-fit outline-none border-none"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Middle Section: Account & Contact Actions */}
            <div className="flex flex-col gap-3 mb-6 text-sm">
              <Link href="#" className="hover:text-[#dce567] transition w-fit outline-none border-none">
                Account Login
              </Link>
              <Link href="#" className="hover:text-[#dce567] transition w-fit outline-none border-none">
                Contact Us
              </Link>
              <Link href="#" className="hover:text-[#dce567] transition w-fit outline-none border-none">
                Schedule a Tour / Consultation
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700/30 mb-6"></div>

            {/* Office Locations */}
            <div className="flex flex-col gap-6 mb-6">
              {footerData.offices.map((office, officeIndex) => (
                <React.Fragment key={officeIndex}>
                  {officeIndex > 0 && (
                    <div className="border-t border-gray-700/30"></div>
                  )}
                  <div className="flex flex-col gap-4 pt-6 first:pt-0">
                    {office.address && (
                      <div>
                        {office.label && (
                          <p className="font-bold text-xs uppercase text-gray-400 mb-2">
                            {office.label}
                          </p>
                        )}
                        {office.address.split('\n').map((line, lineIndex) => (
                          <p key={lineIndex} className="text-sm">{line}</p>
                        ))}
                        {office.phone && (
                          <p className="mt-2 text-sm">
                            <span className="font-bold text-xs uppercase text-gray-400">OFFICE: </span>
                            {office.phone}
                          </p>
                        )}
                        {office.fax && (
                          <p className="mt-1 text-sm">
                            <span className="font-bold text-xs uppercase text-gray-400">FAX: </span>
                            {office.fax}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700/30 mb-6"></div>

            {/* Toll-Free & Social Media */}
            <div className="flex items-center justify-between mb-6">
              {footerData.offices[footerData.offices.length - 1]?.tollFree && (
                <div>
                  <p className="text-sm">
                    <span className="font-bold text-xs uppercase text-gray-400">TOLL FREE: </span>
                    {footerData.offices[footerData.offices.length - 1].tollFree}
                  </p>
                </div>
              )}
              <div className="flex gap-4">
                {footerData.socialMedia.facebook && (
                  <a
                    href={footerData.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#dce567] transition duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {footerData.socialMedia.linkedin && (
                  <a
                    href={footerData.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#dce567] transition duration-300"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="flex flex-col border-t border-gray-700/30 pt-4 pb-12">
              <p className="text-[10px] text-gray-400 mb-4">{footerData.bottomBar.copyrightText}</p>
              <div className="flex flex-wrap gap-4">
                {footerData.bottomBar.policyLinks.map((link, index) => (
                  <Link
                    key={index}
                    href={link.href}
                    className="text-[10px] text-gray-400 hover:text-white transition outline-none"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div 
            className="hidden md:grid gap-10 lg:gap-4 mb-20 text-sm items-start"
            style={{
              gridTemplateColumns: totalColumns > 0 
                ? `repeat(${totalColumns}, minmax(0, 1fr))` 
                : 'repeat(5, minmax(0, 1fr))'
            }}
          >
            
            {/* Navigation Columns */}
            {footerData.navigationColumns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col gap-3">
                {column.map((link, linkIndex) => (
                  <Link
                    key={linkIndex}
                    href={link.href}
                    className="hover:text-[#dce567] transition w-fit outline-none border-none"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

            {/* Office Columns */}
            {footerData.offices.map((office, officeIndex) => (
              <div key={officeIndex} className="flex flex-col gap-6">
                {office.address && (
                  <div>
                    <p className="font-bold text-xs uppercase text-gray-400 mb-1">
                      {office.label || 'Office'}
                    </p>
                    {office.address.split('\n').map((line, lineIndex) => (
                      <p key={lineIndex}>{line}</p>
                    ))}
                    {office.phone && <p className="mt-1">{office.phone}</p>}
                  </div>
                )}
                {office.fax && (
                  <div>
                    <div className="flex justify-between w-32">
                      <span className="font-bold text-xs uppercase text-gray-400">Fax</span>
                    </div>
                    <p>{office.fax}</p>
                  </div>
                )}
                {office.tollFree && (
                  <div className={office.fax ? '' : 'mt-2'}>
                    <p className="font-bold text-xs uppercase text-gray-400 mb-1">Toll Free</p>
                    <p className={officeIndex === footerData.offices.length - 1 ? 'mb-4' : ''}>
                      {office.tollFree}
                    </p>
                    
                    {/* Social Media Icons - Only show on last office */}
                    {officeIndex === footerData.offices.length - 1 && (
                      <div className="flex gap-4">
                        {footerData.socialMedia.facebook && (
                          <a
                            href={footerData.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#dce567] transition duration-300"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                          </a>
                        )}
                        {footerData.socialMedia.linkedin && (
                          <a
                            href={footerData.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:text-[#dce567] transition duration-300"
                          >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Bottom Bar */}
          <div className="hidden md:flex flex-row justify-between items-center text-[10px] text-gray-400 border-t border-gray-700/30 pt-4 pb-12">
            <p>{footerData.bottomBar.copyrightText}</p>
            <div className="flex gap-6">
              {footerData.bottomBar.policyLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="hover:text-white transition outline-none"
                >
                  {link.label}
                </Link>
              ))}
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

