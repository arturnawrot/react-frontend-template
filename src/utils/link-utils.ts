/**
 * Determines if a URL is internal (should use Next.js Link) or external (should use <a> tag)
 */
export function isInternalLink(href: string | null | undefined): boolean {
  if (!href || href === '#' || href === '') return false
  
  // External protocols
  if (href.startsWith('http://') || href.startsWith('https://')) {
    return false
  }
  
  // Special protocols that should use <a> tag
  if (href.startsWith('mailto:') || href.startsWith('tel:')) {
    return false
  }
  
  // Everything else is internal
  return true
}
