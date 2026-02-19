import Link from 'next/link'
import Image from 'next/image'
import LogoDark from './LogoDark'

interface LogoProps {
  darkVariant?: boolean // Controls mobile dark variant
  desktopDark?: boolean // Controls desktop dark variant (e.g., when dropdown is open)
}

export default function Logo({ darkVariant = false, desktopDark = false }: LogoProps) {
  return (
    <Link href="/">
      {/* Light logo on desktop (hidden when desktopDark), light logo on mobile (hidden when darkVariant) */}
      <Image
        src="/svg/meybohm-navbar-logo-light.svg"
        alt="Logo"
        width={200}
        height={50}
        className={`h-8 md:h-10 w-auto ${darkVariant ? 'hidden md:block' : ''} ${desktopDark ? 'md:hidden' : ''}`}
      />
      {/* Dark logo on mobile - only when darkVariant is true */}
      {darkVariant && <LogoDark className="h-8 w-auto md:hidden" />}
      {/* Dark logo on desktop - only when desktopDark is true */}
      {desktopDark && <LogoDark className="hidden md:block md:h-10 w-auto" />}
    </Link>
  )
}

