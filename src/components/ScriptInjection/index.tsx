import Script from 'next/script'
import type { ScriptInjection as ScriptInjectionType } from '@/payload-types'

/**
 * Head scripts component - renders scripts for the head using Next.js Script
 */
export function HeadScripts({
  scripts,
}: {
  scripts: ScriptInjectionType['headScripts']
}) {
  if (!scripts || scripts.length === 0) return null

  const enabledScripts = scripts.filter((script) => script.enabled !== false)

  return (
    <>
      {enabledScripts.map((script, index) => {
        const key = `head-script-${script.id || index}`

        if (script.type === 'external' && script.src) {
          return (
            <Script
              key={key}
              id={key}
              src={script.src}
              strategy={script.loadStrategy || 'afterInteractive'}
            />
          )
        }

        if (script.type === 'inline' && script.code) {
          return (
            <Script
              key={key}
              id={key}
              strategy={script.loadStrategy || 'afterInteractive'}
              dangerouslySetInnerHTML={{ __html: script.code }}
            />
          )
        }

        return null
      })}
    </>
  )
}

/**
 * Head tags component - renders meta, link, and raw HTML tags in the head
 */
export function HeadTags({
  tags,
}: {
  tags: ScriptInjectionType['headTags']
}) {
  if (!tags || tags.length === 0) return null

  const enabledTags = tags.filter((tag) => tag.enabled !== false)

  return (
    <>
      {enabledTags.map((tag, index) => {
        const key = `head-tag-${tag.id || index}`

        if (tag.tagType === 'meta' && tag.metaContent) {
          // Determine if it's a name or property attribute based on common patterns
          const isOgOrTwitter = tag.metaName?.startsWith('og:') || tag.metaName?.startsWith('twitter:')
          
          if (isOgOrTwitter) {
            return (
              <meta
                key={key}
                property={tag.metaName || undefined}
                content={tag.metaContent}
              />
            )
          }
          
          return (
            <meta
              key={key}
              name={tag.metaName || undefined}
              content={tag.metaContent}
            />
          )
        }

        if (tag.tagType === 'link' && tag.linkHref) {
          return (
            <link
              key={key}
              rel={tag.linkRel || undefined}
              href={tag.linkHref}
            />
          )
        }

        if (tag.tagType === 'raw' && tag.rawHtml) {
          // For raw HTML in head, we use a script with type="text/html" as a workaround
          // This is safe because browsers ignore script tags with unknown types
          // Alternatively, for style tags, we can parse and render properly
          
          // Check if it's a style tag
          if (tag.rawHtml.trim().startsWith('<style')) {
            // Extract the CSS content
            const match = tag.rawHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
            if (match && match[1]) {
              return (
                <style key={key} dangerouslySetInnerHTML={{ __html: match[1] }} />
              )
            }
          }
          
          // For other raw HTML that's valid in head, render directly
          // Note: This may not work for all HTML types in the head
          return null
        }

        return null
      })}
    </>
  )
}

/**
 * Body scripts component - renders scripts/HTML for body start or end
 */
export function BodyScripts({
  scripts,
  position,
}: {
  scripts: ScriptInjectionType['bodyStartScripts'] | ScriptInjectionType['bodyEndScripts']
  position: 'start' | 'end'
}) {
  if (!scripts || scripts.length === 0) return null

  const enabledScripts = scripts.filter((script) => script.enabled !== false)

  return (
    <>
      {enabledScripts.map((script, index) => {
        const key = `body-${position}-${script.id || index}`

        if (script.type === 'external' && script.src) {
          return (
            <Script
              key={key}
              id={key}
              src={script.src}
              strategy={script.loadStrategy || 'afterInteractive'}
            />
          )
        }

        if (script.type === 'inline' && script.code) {
          return (
            <div
              key={key}
              data-injection={script.name}
              suppressHydrationWarning
              dangerouslySetInnerHTML={{ __html: script.code }}
              style={{ display: 'contents' }}
            />
          )
        }

        return null
      })}
    </>
  )
}
