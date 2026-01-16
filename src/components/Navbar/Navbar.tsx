'use client'

import { useState } from 'react'
import Logo from '../Logo/Logo'
import {
  MainNavbarLink,
  UpperNavbarLink,
} from '../NavbarLink/NavbarLink'
import LocationSearchSuggestion, { type AddressSuggestion } from '../LocationSearchSuggestion/LocationSearchSuggestion'
import styles from './Navbar.module.scss'

export interface NavbarLink {
  label: string
  href: string
}

interface NavbarProps {
  darkVariant?: boolean
  upperLinks?: NavbarLink[]
  mainLinks?: NavbarLink[]
}

export default function Navbar({ 
  darkVariant = false,
  upperLinks = [],
  mainLinks = [],
}: NavbarProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSelect = (suggestion: AddressSuggestion) => {
    // LocationSearchSuggestion handles redirect internally when propertySlug is available
    // This handler is for side effects only
    setSearchValue('') // Clear search after navigation
  }

  return (
    <>
      {/* Desktop: Top Search Bar - Hidden on Mobile */}
      <div className="px-[5%] hidden md:block border-b-[0.5px] border-[#FAF9F7]">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex-1 max-w-md">
            <div className={`${styles.navbarSearchInput} relative z-50`}>
              <LocationSearchSuggestion
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearchSelect}
                placeholder="Search..."
                showSearchIcon={true}
                searchIconClassName="text-white opacity-70"
                wrapperClassName=""
                inputClassName="w-full bg-transparent text-white placeholder-white placeholder-opacity-70 rounded-full py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>
          </div>
          <div className="flex gap-8 ml-8">
            {upperLinks.map((link, index) => (
              <UpperNavbarLink key={`${link.href}-${index}`} href={link.href}>
                {link.label}
              </UpperNavbarLink>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Main Navigation - Hidden on Mobile */}
      <div className="hidden md:block px-[5%]">
        <div className="flex items-center justify-between px-8 py-4">
          <Logo darkVariant={darkVariant} />
          <div className="flex gap-2 md:gap-3 lg:gap-5 xl:gap-8 flex-nowrap" id="mainNavbarLinks">
            {mainLinks.map((link, index) => (
              <MainNavbarLink key={`${link.href}-${index}`} href={link.href}>
                {link.label}
              </MainNavbarLink>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Logo at Top - Hidden on Desktop */}
      <div className="md:hidden flex justify-center py-6">
        <Logo darkVariant={darkVariant} />
      </div>
    </>
  )
}

