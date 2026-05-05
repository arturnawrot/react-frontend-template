import Image from 'next/image'
import Link from 'next/link'
import { resolveLink, type ConstantLinksMap, type LinkType } from '@/utils/linkResolver'
import type { Media } from '@/payload-types'

interface BlogBannerProps {
  image: Media | string | null | undefined
  linkType?: string
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  constantLink?: string | null
  calLink?: string | null
  calNamespace?: string | null
  openInNewTab?: boolean
  disabled?: boolean
  constantLinksMap?: ConstantLinksMap
  className?: string
}

export default function BlogBanner({
  image,
  linkType,
  page,
  customUrl,
  constantLink,
  calLink,
  calNamespace,
  openInNewTab,
  disabled,
  constantLinksMap,
  className,
}: BlogBannerProps) {
  if (!image || typeof image === 'string') return null

  const { url, alt, width, height } = image
  if (!url) return null

  const link = resolveLink(
    {
      linkType: linkType as LinkType,
      page,
      customUrl,
      constantLink,
      calLink,
      calNamespace,
      openInNewTab,
      disabled,
    },
    constantLinksMap,
  )

  const img = (
    <Image
      src={url}
      alt={alt || ''}
      width={width || 800}
      height={height || 400}
      className="w-full h-auto"
      sizes="(max-width: 1024px) 100vw, 350px"
    />
  )

  if (!link.href || link.disabled) {
    return <div className={className}>{img}</div>
  }

  return (
    <div className={className}>
      <Link
        href={link.href}
        target={link.openInNewTab ? '_blank' : undefined}
        rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {img}
      </Link>
    </div>
  )
}
