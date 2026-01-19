import Image from 'next/image'

interface LogoDarkProps {
  className?: string
}

export default function LogoDark({ className }: LogoDarkProps) {
  return (
    <Image
      src="/img/logo_dark_variant.png"
      alt="Logo"
      width={200}
      height={50}
      className={className}
    />
  )
}
