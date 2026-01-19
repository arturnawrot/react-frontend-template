import Image from 'next/image'

interface IconProps {
  className?: string
}

export default function Icon({ className }: IconProps) {
  return (
    <Image
      src="/favicon.ico"
      alt="Icon"
      width={25}
      height={25}
      className={className}
    />
  )
}
