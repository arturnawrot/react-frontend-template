'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Logo from '../Logo/Logo'
import LocationSearchSuggestion, { type AddressSuggestion } from '../LocationSearchSuggestion/LocationSearchSuggestion'
import NavbarDropdown from './NavbarDropdown'
import type { NavbarLinkWithDropdown, DropdownQuote } from '@/utils/navbar'
import styles from './Navbar.module.scss'
import linkStyles from '../NavbarLink/NavbarLink.module.scss'

// Keep legacy NavbarLink type for backwards compatibility
export interface NavbarLink {
  label: string
  href: string
}

interface NavbarProps {
  darkVariant?: boolean
  upperLinks?: NavbarLinkWithDropdown[]
  mainLinks?: NavbarLinkWithDropdown[]
  dropdownQuote?: DropdownQuote
}

export default function Navbar({ 
  darkVariant = false,
  upperLinks = [],
  mainLinks = [],
  dropdownQuote,
}: NavbarProps) {
  const [searchValue, setSearchValue] = useState('')
  const [activeUpperDropdown, setActiveUpperDropdown] = useState<number | null>(null)
  const [activeMainDropdown, setActiveMainDropdown] = useState<number | null>(null)
  const upperNavRef = useRef<HTMLDivElement>(null)
  const mainNavRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check if any dropdown is active
  const isUpperDropdownActive = activeUpperDropdown !== null
  const isMainDropdownActive = activeMainDropdown !== null
  const isAnyDropdownActive = isUpperDropdownActive || isMainDropdownActive

  const handleSearchSelect = (suggestion: AddressSuggestion) => {
    setSearchValue('')
  }

  // Handle mouse enter with small delay to prevent accidental triggers
  const handleMouseEnter = (
    index: number,
    setActive: React.Dispatch<React.SetStateAction<number | null>>,
    hasDropdown: boolean,
  ) => {
    if (!hasDropdown) return
    
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActive(index)
    }, 50)
  }

  // Handle mouse leave with delay to allow moving to dropdown
  const handleMouseLeave = (
    setActive: React.Dispatch<React.SetStateAction<number | null>>,
  ) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActive(null)
    }, 150)
  }

  // Keep dropdown open when hovering over it
  const handleDropdownMouseEnter = (
    setActive: React.Dispatch<React.SetStateAction<number | null>>,
    index: number,
  ) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }
    setActive(index)
  }

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Desktop: Top Search Bar - Hidden on Mobile */}
      <div 
        className={`px-[5%] hidden md:block border-b-[0.5px] relative transition-colors duration-200 ${
          isAnyDropdownActive 
            ? 'bg-[#FAF9F7] border-[#e5e5e5]' 
            : 'border-[#FAF9F7]'
        }`} 
        ref={upperNavRef}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex-1 max-w-md">
            <div className={`${styles.navbarSearchInput} relative z-50`}>
              <LocationSearchSuggestion
                value={searchValue}
                onChange={setSearchValue}
                onSelect={handleSearchSelect}
                placeholder="Search..."
                showSearchIcon={true}
                searchIconClassName={isAnyDropdownActive ? 'text-[var(--strong-green)] opacity-70' : 'text-white opacity-70'}
                wrapperClassName=""
                inputClassName={`w-full bg-transparent rounded-full py-2 pr-4 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isAnyDropdownActive 
                    ? 'text-[var(--strong-green)] placeholder-[var(--strong-green)] placeholder-opacity-70 focus:ring-[var(--strong-green)]' 
                    : 'text-white placeholder-white placeholder-opacity-70 focus:ring-white'
                }`}
              />
            </div>
          </div>
          <div className="flex gap-8 ml-8">
            {upperLinks.map((link, index) => (
              <div
                key={`${link.href}-${index}`}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index, setActiveUpperDropdown, link.hasDropdown)}
                onMouseLeave={() => handleMouseLeave(setActiveUpperDropdown)}
              >
                <Link 
                  href={link.href} 
                  className={`${isAnyDropdownActive ? styles.upperNavbarLinkDark : linkStyles.upperNavbarLink} ${
                    activeUpperDropdown === index ? styles.activeLink : ''
                  } ${link.hasDropdown ? styles.hasDropdown : ''}`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Upper navbar dropdowns */}
        {upperLinks.map((link, index) =>
          link.hasDropdown && link.dropdownColumns && link.dropdownColumns.length > 0 ? (
            <div
              key={`upper-dropdown-${index}`}
              onMouseEnter={() => handleDropdownMouseEnter(setActiveUpperDropdown, index)}
              onMouseLeave={() => handleMouseLeave(setActiveUpperDropdown)}
            >
              <NavbarDropdown
                columns={link.dropdownColumns}
                quote={dropdownQuote}
                isVisible={activeUpperDropdown === index}
                variant="upper"
                showSearch={true}
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Desktop: Main Navigation - Hidden on Mobile */}
      <div 
        className={`hidden md:block px-[5%] relative transition-colors duration-200 ${
          isAnyDropdownActive ? 'bg-[#FAF9F7]' : ''
        }`} 
        ref={mainNavRef}
      >
        <div className="flex items-center justify-between px-8 py-4">
          <Logo darkVariant={darkVariant} desktopDark={isAnyDropdownActive} />
          <div className="flex gap-2 md:gap-3 lg:gap-5 xl:gap-8 flex-nowrap" id="mainNavbarLinks">
            {mainLinks.map((link, index) => (
              <div
                key={`${link.href}-${index}`}
                className="relative"
                onMouseEnter={() => handleMouseEnter(index, setActiveMainDropdown, link.hasDropdown)}
                onMouseLeave={() => handleMouseLeave(setActiveMainDropdown)}
              >
                <Link 
                  href={link.href} 
                  className={`${isAnyDropdownActive ? styles.mainNavbarLinkDark : linkStyles.mainNavbarLink} ${
                    activeMainDropdown === index ? styles.activeLink : ''
                  } ${link.hasDropdown ? styles.hasDropdown : ''}`}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Main navbar dropdowns */}
        {mainLinks.map((link, index) =>
          link.hasDropdown && link.dropdownColumns && link.dropdownColumns.length > 0 ? (
            <div
              key={`main-dropdown-${index}`}
              onMouseEnter={() => handleDropdownMouseEnter(setActiveMainDropdown, index)}
              onMouseLeave={() => handleMouseLeave(setActiveMainDropdown)}
            >
              <NavbarDropdown
                columns={link.dropdownColumns}
                quote={dropdownQuote}
                isVisible={activeMainDropdown === index}
                variant="main"
              />
            </div>
          ) : null,
        )}
      </div>

      {/* Mobile: Logo at Top - Hidden on Desktop */}
      <div className="md:hidden flex justify-center py-6">
        <Logo darkVariant={darkVariant} />
      </div>
    </>
  )
}

