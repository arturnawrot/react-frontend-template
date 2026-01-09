import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  darkVariant?: boolean
}

export default function Logo({ darkVariant = false }: LogoProps) {
  return (
    <Link href="/">
      {/* Normal logo - always visible on desktop, visible on mobile when darkVariant is false */}
      <Image
        src="/img/logo.png"
        alt="Logo"
        width={200}
        height={50}
        className={`h-8 md:h-10 w-auto ${darkVariant ? 'hidden md:block' : ''}`}
      />
      {/* Dark variant logo - only visible on mobile when darkVariant is true */}
      {darkVariant && (
        <Image
          src="/img/logo_dark_variant.png"
          alt="Logo"
          width={200}
          height={50}
          className="h-8 md:hidden w-auto"
        />
      )}
    </Link>
  )
}

