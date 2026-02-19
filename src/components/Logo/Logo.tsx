import Link from 'next/link'
import Image from 'next/image'
import LogoDark from './LogoDark'

interface LogoProps {
  darkVariant?: boolean
}

export default function Logo({ darkVariant = false }: LogoProps) {
  return (
    <Link href="/">
      {/* Normal logo - always visible on desktop, visible on mobile when darkVariant is false */}
      <Image
        src="/svg/meybohm-navbar-logo-light.svg"
        alt="Logo"
        width={200}
        height={50}
        className={`h-8 md:h-10 w-auto ${darkVariant ? 'hidden md:block' : ''}`}
      />
      {/* Dark variant logo - only visible on mobile when darkVariant is true */}
      {darkVariant && <LogoDark className="h-8 w-auto md:hidden" />}
    </Link>
  )
}

