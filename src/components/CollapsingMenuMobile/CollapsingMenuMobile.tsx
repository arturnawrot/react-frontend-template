'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import {
  CollapsingMenuMobileLink,
} from '../NavbarLink/NavbarLink'
import type { NavbarLink } from '../Navbar/Navbar'
import LocationSearchSuggestion, { type AddressSuggestion } from '../LocationSearchSuggestion/LocationSearchSuggestion'
import styles from './CollapsingMenuMobile.module.scss'

export default function CollapsingMenuMobile({
  open,
  onClose,
  mainLinks = [],
}: {
  open: boolean
  onClose: () => void
  mainLinks?: NavbarLink[]
}) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSelect = (suggestion: AddressSuggestion) => {
    // LocationSearchSuggestion handles redirect internally when propertySlug is available
    // This handler is for side effects only
    setSearchValue('') // Clear search after navigation
    onClose() // Close mobile menu after navigation
  }

  return (
    <>
      {/* Backdrop: click to close */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`md:hidden fixed inset-x-0 bg-[#DAE684] transition-transform duration-300 ease-in-out z-50 overflow-y-auto rounded-tl-3xl ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          bottom: 0,
          top: '10%',
          backgroundImage: `url("/svg/flipped-m-collapsing-mobile.svg")`,
          backgroundSize: '100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="flex flex-col min-h-full py-15 px-12">
          {/* Navigation Links - Left Aligned */}
          <div className="flex flex-col items-start gap-8 text-2xl flex-1 justify-center">
            {mainLinks.map((link, index) => (
              <CollapsingMenuMobileLink key={`${link.href}-${index}`} href={link.href}>
                {link.label}
              </CollapsingMenuMobileLink>
            ))}

            {/* Search Bar - Left Aligned */}
            <div className="relative w-full mt-4">
              <LocationSearchSuggestion
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearchSelect}
                placeholder="Search..."
                showSearchIcon={false}
                wrapperClassName=""
                inputClassName={`${styles.searchInput} w-full bg-[#D8F5A2] py-3 pr-4 pl-0 focus:outline-none border-0 border-b-1 border-[var(--strong-green)] rounded-none`}
                openUpward={true}
              />
            </div>

            {/* Close Button - Left Aligned */}
            <div className="w-full flex justify-center mt-4">
              <button
                onClick={onClose}
                className="text-white p-5 rounded-full transition-colors"
                style={{ backgroundColor: 'var(--strong-green)' }}
                aria-label="Close menu"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

