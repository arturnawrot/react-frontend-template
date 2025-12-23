'use client'

import { Search } from 'lucide-react'
import Logo from '../Logo/Logo'
import {
  MainNavbarLink,
  UpperNavbarLink,
} from '../NavbarLink/NavbarLink'
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
  return (
    <>
      {/* Desktop: Top Search Bar - Hidden on Mobile */}
      <div className="px-[5%] hidden md:block border-b-[0.5px] border-[#FAF9F7]">
        <div className="flex items-center justify-between px-8 py-4">
          <div className="flex-1 max-w-md">
            <div className={`${styles.navbarSearchInput} relative`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white opacity-70 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-transparent text-white placeholder-white placeholder-opacity-70 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
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
          <div className="flex gap-8" id="mainNavbarLinks">
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

