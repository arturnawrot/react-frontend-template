interface LogoProps {
  darkVariant?: boolean;
}

export default function Logo({ darkVariant = false }: LogoProps) {
  return (
    <a href="/">
      {/* Normal logo - always visible on desktop, visible on mobile when darkVariant is false */}
      <img 
        src="/img/logo.png" 
        alt="Logo" 
        className={`h-8 md:h-10 ${darkVariant ? 'hidden md:block' : ''}`}
      />
      {/* Dark variant logo - only visible on mobile when darkVariant is true */}
      {darkVariant && (
        <img 
          src="/img/logo_dark_variant.png" 
          alt="Logo" 
          className="h-8 md:hidden"
        />
      )}
    </a>
  );
}