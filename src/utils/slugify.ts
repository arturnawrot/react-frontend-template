/**
 * Generates a URL-friendly slug from a string
 * Everything that is not a number or letter gets replaced by -, but no double -- etc
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-') // Replace everything that's not a letter or number with -
    .replace(/-+/g, '-') // Replace multiple consecutive dashes with single dash
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
}
