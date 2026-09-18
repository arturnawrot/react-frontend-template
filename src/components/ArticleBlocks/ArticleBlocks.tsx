import React from 'react'
import BaseButton from '@/components/PrimaryButton/BaseButton'
import { resolveLink, type ConstantLinksMap, type LinkType } from '@/utils/linkResolver'

/**
 * Presentational components for the editorial Lexical blocks defined in
 * `src/blocks/ArticleBlocks.ts`.
 *
 * These are dispatched from `LexicalRenderer`, so an editor can drop any of them
 * into rich text on any collection whose editor registers `articleBlocks`.
 *
 * Palette (shared with the article design):
 *   navy #1C2F29 · blue #1C566C · lime #DAE684 · cream #FAF9F7
 *   tan  #D2A781 · row  #F4F1EA · line #E4E0D6
 */

/** Renders text that may contain newlines, preserving them as line breaks. */
function MultilineText({ text }: { text?: string | null }): React.ReactNode {
  if (!text) return null
  const parts = String(text).split('\n')
  return parts.map((part, i) => (
    <React.Fragment key={i}>
      {part}
      {i < parts.length - 1 && <br />}
    </React.Fragment>
  ))
}

/**
 * Renders text that may contain `[^n]` citation markers, turning each into a
 * superscript link to entry n of the Sources block.
 */
function TextWithCitations({ text }: { text?: string | null }): React.ReactNode {
  if (!text) return null
  const parts = String(text).split(/(\[\^\d+\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[\^(\d+)\]$/)
    if (m) {
      return (
        <sup key={i}>
          <a href={`#s${m[1]}`} className="text-[#1C566C] no-underline hover:underline">
            {m[1]}
          </a>
        </sup>
      )
    }
    return <MultilineText key={i} text={part} />
  })
}

type ButtonData = {
  label?: string | null
  linkType?: LinkType
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  constantLink?: string | null
  calLink?: string | null
  calNamespace?: string | null
  openInNewTab?: boolean
  disabled?: boolean
} | null | undefined

/**
 * Renders a CTA button from a link field group.
 * Delegates to BaseButton so Cal.com embeds, internal/external links and the
 * disabled state behave exactly as they do elsewhere on the site.
 */
function CtaButton({
  button,
  variant = 'solid',
  constantLinksMap,
}: {
  button: ButtonData
  variant?: 'solid' | 'ghost'
  constantLinksMap?: ConstantLinksMap
}) {
  if (!button || !button.label) return null

  const link = resolveLink(
    {
      linkType: button.linkType,
      page: button.page,
      customUrl: button.customUrl,
      constantLink: button.constantLink,
      calLink: button.calLink,
      calNamespace: button.calNamespace,
      openInNewTab: button.openInNewTab,
      disabled: button.disabled,
    },
    constantLinksMap,
  )

  // Nothing to point at and not a Cal embed — don't render a dead button.
  if (!link.href && !link.calLink) return null

  // inline-flex + centring keeps the label centred even if a flex row stretches
  // the button to match a taller sibling (e.g. the bordered ghost variant).
  const base =
    'inline-flex items-center justify-center text-center font-bold text-[15px] tracking-[0.3px] px-[22px] py-3 rounded-lg no-underline transition-colors'
  const className =
    variant === 'ghost'
      ? `${base} bg-transparent border-2 border-[#DAE684] text-[#DAE684] hover:bg-[#DAE684] hover:text-[#1C2F29]`
      : `${base} bg-[#DAE684] text-[#1C2F29] hover:bg-[#cbd96a]`

  return (
    <BaseButton link={link} className={className}>
      {button.label}
    </BaseButton>
  )
}

/* ------------------------------------------------------------------ */
/* Blocks                                                              */
/* ------------------------------------------------------------------ */

export function LeadAnswer({ text }: { text?: string | null }) {
  if (!text) return null
  return (
    <p className="not-prose text-[17px] md:text-[19px] leading-relaxed text-[#2D2321] bg-[#F4F1EA] border-l-[5px] border-[#1C566C] px-[18px] py-3.5 rounded-r-lg my-6">
      <MultilineText text={text} />
    </p>
  )
}

export function KeyTakeaways({
  heading,
  items,
  oneLine,
}: {
  heading?: string | null
  items?: Array<{ lead?: string | null; text?: string | null }> | null
  oneLine?: string | null
}) {
  if (!items?.length) return null
  return (
    <aside className="not-prose bg-[#DAE684] rounded-xl px-6 py-6 md:px-7 my-8">
      {heading && (
        <h2 className="font-serif text-[22px] font-bold text-[#1C2F29] m-0 mb-3">{heading}</h2>
      )}
      <ul className="list-disc pl-5 m-0 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="text-[#1C2F29] leading-relaxed">
            {item.lead && <strong className="font-bold">{item.lead} </strong>}
            <MultilineText text={item.text} />
          </li>
        ))}
      </ul>
      {oneLine && (
        <p className="mt-3.5 pt-3.5 border-t border-[rgba(28,47,41,0.25)] font-bold text-[#1C2F29] m-0">
          <MultilineText text={oneLine} />
        </p>
      )}
    </aside>
  )
}

export function TableOfContents({
  heading,
  columns,
  items,
}: {
  heading?: string | null
  columns?: string | null
  items?: Array<{ label?: string | null; anchor?: string | null }> | null
}) {
  if (!items?.length) return null
  const twoCol = columns !== 'one'
  return (
    <nav
      aria-label="Table of contents"
      className="not-prose bg-white border border-[#E4E0D6] rounded-xl px-6 py-5 my-8"
    >
      {heading && (
        <h2 className="text-[16px] font-bold uppercase tracking-[1px] text-[#1C566C] m-0 mb-3">
          {heading}
        </h2>
      )}
      <ol className={`list-decimal pl-5 m-0 ${twoCol ? 'sm:columns-2 sm:gap-8' : ''}`}>
        {items.map((item, i) => (
          <li key={i} className="text-[15px] mb-2 break-inside-avoid">
            <a
              href={`#${(item.anchor || '').replace(/^#/, '')}`}
              className="text-[#1C566C] hover:underline"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function SectionAnchor({ anchor }: { anchor?: string | null }) {
  if (!anchor) return null
  // scroll-mt keeps the heading clear of any sticky header after a jump.
  return <span id={anchor.replace(/^#/, '')} className="block scroll-mt-28" aria-hidden="true" />
}

export function SnapshotBar({
  items,
  cta,
  constantLinksMap,
}: {
  items?: Array<{ label?: string | null; value?: string | null }> | null
  cta?: ButtonData
  constantLinksMap?: ConstantLinksMap
}) {
  if (!items?.length) return null
  return (
    <section className="not-prose my-8">
      <div className="flex flex-wrap gap-2.5 bg-[#1C2F29] rounded-[10px] px-5 py-4">
        {items.map((item, i) => (
          <div key={i} className="basis-[45%] sm:basis-[150px] grow">
            <span className="block text-[12px] sm:text-[13px] tracking-[1px] uppercase text-[#D2A781] mb-1">
              {item.label}
            </span>
            <span className="block text-[16px] sm:text-[17px] font-semibold text-[#FAF9F7] leading-tight">
              {item.value}
            </span>
          </div>
        ))}
        {cta?.label && (
          <div className="basis-full mt-1">
            <CtaButton button={cta} constantLinksMap={constantLinksMap} />
          </div>
        )}
      </div>
    </section>
  )
}

export function ComparisonTable({
  columns,
  rows,
  caption,
}: {
  columns?: Array<{ heading?: string | null }> | null
  rows?: Array<{ cells?: Array<{ value?: string | null }> | null }> | null
  caption?: string | null
}) {
  if (!columns?.length || !rows?.length) return null
  return (
    <figure className="not-prose my-8 m-0">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[15px] bg-white rounded-[10px] overflow-hidden">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className="text-left px-3.5 py-3 bg-[#1C2F29] text-[#FAF9F7] text-[13px] uppercase tracking-[0.5px] font-semibold"
                >
                  {col.heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className={r % 2 === 1 ? 'bg-[#F4F1EA]' : undefined}>
                {columns.map((_, c) => {
                  const cell = row.cells?.[c]
                  return (
                    <td
                      key={c}
                      className={`text-left px-3.5 py-3 align-top border-b border-[#E4E0D6] ${
                        c === 0 ? 'font-bold text-[#1C2F29]' : 'text-[#2D2321]'
                      }`}
                    >
                      <MultilineText text={cell?.value} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && (
        <figcaption className="text-[14px] text-[#6f6a5f] mt-2.5 leading-normal">
          <MultilineText text={caption} />
        </figcaption>
      )}
    </figure>
  )
}

export function PullQuote({
  quote,
  attribution,
}: {
  quote?: string | null
  attribution?: string | null
}) {
  if (!quote) return null
  return (
    <blockquote className="not-prose border-l-[5px] border-[#DAE684] bg-[#1C2F29] text-[#FAF9F7] px-6 py-5 rounded-r-[10px] my-8 text-[17px] md:text-[19px] leading-relaxed">
      <MultilineText text={quote} />
      {attribution && (
        <cite className="block mt-3 text-[14px] text-[#D2A781] not-italic">{attribution}</cite>
      )}
    </blockquote>
  )
}

export function CalloutNote({ title, text }: { title?: string | null; text?: string | null }) {
  if (!text) return null
  return (
    <aside className="not-prose bg-[#F4F1EA] border border-dashed border-[#D2A781] rounded-[10px] px-5 py-4 my-6 text-[16px] leading-relaxed text-[#2D2321]">
      {title && <b className="text-[#1C2F29]">{title} </b>}
      <TextWithCitations text={text} />
    </aside>
  )
}

export function CtaBanner({
  style,
  eyebrow,
  heading,
  text,
  primaryButton,
  secondaryButton,
  constantLinksMap,
}: {
  style?: string | null
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
  primaryButton?: ButtonData
  secondaryButton?: ButtonData
  constantLinksMap?: ConstantLinksMap
}) {
  if (!heading) return null
  const isEnd = style === 'end'

  return (
    <section
      className={
        isEnd
          ? 'not-prose bg-[#1C2F29] text-[#FAF9F7] rounded-[14px] px-6 py-8 md:px-8 my-10 text-center'
          : 'not-prose bg-[#1C566C] text-[#FAF9F7] rounded-xl px-6 py-6 my-9 text-center'
      }
    >
      {isEnd && eyebrow && (
        <span className="block text-[#DAE684] text-[12px] tracking-[2px] uppercase font-bold mb-2.5">
          {eyebrow}
        </span>
      )}
      {/* The end-of-article CTA is a top-level section, the mid-article one is not. */}
      {isEnd ? (
        <h2 className="font-serif font-bold m-0 mb-2 text-[#FAF9F7] text-[28px] md:text-[32px]">{heading}</h2>
      ) : (
        <h3 className="font-serif font-bold m-0 mb-2 text-[#FAF9F7] text-[22px] md:text-[24px]">{heading}</h3>
      )}
      {text && (
        <p
          className={`m-0 mb-4 mx-auto ${isEnd ? 'text-[#cfd6c9] max-w-[520px]' : 'text-[#dfeaed]'}`}
        >
          <MultilineText text={text} />
        </p>
      )}
      <div className="flex gap-3 justify-center items-center flex-wrap">
        <CtaButton button={primaryButton} constantLinksMap={constantLinksMap} />
        <CtaButton button={secondaryButton} variant="ghost" constantLinksMap={constantLinksMap} />
      </div>
    </section>
  )
}

export function FaqAccordion({
  heading,
  items,
  emitSchema,
}: {
  heading?: string | null
  items?: Array<{ question?: string | null; answer?: string | null }> | null
  emitSchema?: boolean | null
}) {
  if (!items?.length) return null

  const valid = items.filter((i) => i.question && i.answer)

  const schema = emitSchema
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: valid.map((item) => ({
          '@type': 'Question',
          name: item.question,
          // Citation markers are presentational — keep them out of structured data.
          acceptedAnswer: { '@type': 'Answer', text: String(item.answer).replace(/\[\^\d+\]/g, '') },
        })),
      }
    : null

  return (
    <section className="not-prose my-8">
      {heading && (
        <h2 className="font-serif text-[25px] md:text-[29px] font-bold text-[#1C2F29] mt-10 mb-4">
          {heading}
        </h2>
      )}
      <div>
        {valid.map((item, i) => (
          <details
            key={i}
            className="group bg-white border border-[#E4E0D6] rounded-[10px] mb-3 px-2"
          >
            <summary className="flex justify-between items-start gap-4 cursor-pointer font-bold text-[#1C2F29] px-2.5 py-3.5 text-[17px] list-none [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <span aria-hidden="true" className="text-[#1C566C] text-[22px] leading-none shrink-0">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">&ndash;</span>
              </span>
            </summary>
            <div className="px-2.5 pb-4 text-[#2D2321] leading-relaxed">
              <TextWithCitations text={item.answer} />
            </div>
          </details>
        ))}
      </div>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </section>
  )
}

export function SourcesList({
  heading,
  items,
  disclaimer,
}: {
  heading?: string | null
  items?: Array<{
    citation?: string | null
    url?: string | null
    linkText?: string | null
    extraPrefix?: string | null
    extraUrl?: string | null
    extraLinkText?: string | null
    suffix?: string | null
  }> | null
  disclaimer?: string | null
}) {
  if (!items?.length) return null

  const hostOf = (url: string) => {
    try {
      return new URL(url).host.replace(/^www\./, '')
    } catch {
      return url
    }
  }

  return (
    <section className="not-prose mt-11 pt-5 border-t-2 border-[#E4E0D6]">
      {heading && (
        <h2 className="text-[19px] font-bold uppercase tracking-[1px] text-[#1C566C] m-0 mb-3">
          {heading}
        </h2>
      )}
      <ol className="list-decimal pl-5 text-[13.5px] text-[#6f6a5f] leading-normal m-0">
        {items.map((item, i) => (
          // id="s1", "s2", … so inline superscript citations can link here.
          <li key={i} id={`s${i + 1}`} className="mb-2 break-words scroll-mt-28">
            <MultilineText text={item.citation} />
            {item.url && (
              <>
                {' '}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6f6a5f] underline"
                >
                  {item.linkText || hostOf(item.url)}
                </a>
              </>
            )}
            {item.extraUrl && (
              <>
                {/* No leading space: the prefix usually starts with punctuation. */}
                {item.extraPrefix ? `${item.extraPrefix} ` : ' '}
                <a
                  href={item.extraUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#6f6a5f] underline"
                >
                  {item.extraLinkText || hostOf(item.extraUrl)}
                </a>
              </>
            )}
            {item.suffix && <> {item.suffix}</>}
          </li>
        ))}
      </ol>
      {disclaimer && (
        <p className="text-[12.5px] text-[#9a9488] italic mt-5 leading-normal">
          <MultilineText text={disclaimer} />
        </p>
      )}
    </section>
  )
}

/** Caption shown beneath a diagram figure. */
function FigureCaption({ caption, source }: { caption?: string | null; source?: string | null }) {
  if (!caption && !source) return null
  return (
    <figcaption className="text-[14px] text-[#6f6a5f] mt-2.5 leading-normal">
      <MultilineText text={caption} />
      {source && <span className="text-[#9a9488]"> {source}</span>}
    </figcaption>
  )
}

export function SpectrumDiagram({
  heading,
  subheading,
  leftLabel,
  rightLabel,
  items,
  footnote,
  caption,
  captionSource,
}: {
  heading?: string | null
  subheading?: string | null
  leftLabel?: string | null
  rightLabel?: string | null
  items?: Array<{ title?: string | null; subtitle?: string | null; lines?: string | null; tone?: string | null }> | null
  footnote?: string | null
  caption?: string | null
  captionSource?: string | null
}) {
  if (!items?.length) return null

  const dot = (tone?: string | null) =>
    tone === 'highlight' ? 'bg-[#DAE684] w-6 h-6' : tone === 'accent' ? 'bg-[#1C566C] w-[18px] h-[18px]' : 'bg-[#D2A781] w-[18px] h-[18px]'

  return (
    <figure className="not-prose my-8 m-0">
      <div className="bg-[#1C2F29] rounded-[10px] px-5 py-6 sm:px-8 sm:py-8">
        <h3 className="font-serif text-[26px] sm:text-[32px] font-bold text-[#DAE684] m-0">{heading}</h3>
        {subheading && <p className="text-[#FAF9F7] m-0 mt-1.5 text-[16px] sm:text-[18px]">{subheading}</p>}

        {/* axis */}
        <div className="relative mt-8 mb-3" aria-hidden="true">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-[#D2A781]" />
          {/* One column per card so each marker sits above its card's centre. */}
          <div
            className="relative grid items-center"
            style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
          >
            {items.map((it, i) => (
              <span key={i} className={`justify-self-center rounded-full shrink-0 ${dot(it.tone)}`} />
            ))}
          </div>
        </div>
        {(leftLabel || rightLabel) && (
          <div className="flex justify-between gap-4 text-[13px] sm:text-[15px] font-bold text-[#D2A781]">
            <span>{leftLabel}</span>
            <span className="text-right">{rightLabel}</span>
          </div>
        )}

        {/* cards */}
        <div className="grid gap-4 mt-6 sm:grid-cols-3">
          {items.map((it, i) => {
            const hot = it.tone === 'highlight'
            return (
              <div
                key={i}
                className={`rounded-xl px-4 py-5 ${hot ? 'bg-[#DAE684]' : 'bg-[#243b34]'}`}
              >
                <div className={`font-serif font-bold text-[24px] text-center ${hot ? 'text-[#1C2F29]' : 'text-[#FAF9F7]'}`}>
                  {it.title}
                </div>
                {it.subtitle && (
                  <div className={`text-[14px] font-bold text-center mt-1 ${hot ? 'text-[#1C2F29]' : 'text-[#D2A781]'}`}>
                    {it.subtitle}
                  </div>
                )}
                {it.lines && (
                  <div className={`mt-3 text-[15px] leading-relaxed ${hot ? 'text-[#1C2F29]' : 'text-[#eef0ea]'}`}>
                    <MultilineText text={it.lines} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {footnote && <p className="text-center text-[14px] text-[#9fb0a8] mt-6 mb-0">{footnote}</p>}
      </div>
      <FigureCaption caption={caption} source={captionSource} />
    </figure>
  )
}

export function FormulaCallout({
  heading,
  formula,
  formulaNote,
  compareHeading,
  items,
  footnote,
  caption,
  captionSource,
}: {
  heading?: string | null
  formula?: string | null
  formulaNote?: string | null
  compareHeading?: string | null
  items?: Array<{ label?: string | null; expression?: string | null; result?: string | null; highlight?: boolean | null }> | null
  footnote?: string | null
  caption?: string | null
  captionSource?: string | null
}) {
  if (!formula) return null
  return (
    <figure className="not-prose my-8 m-0">
      <div className="bg-[#FAF9F7] border border-[#E4E0D6] rounded-[10px] overflow-hidden">
        <div className="bg-[#1C2F29] px-5 py-4 sm:px-7">
          <h3 className="font-serif text-[24px] sm:text-[30px] font-bold text-[#DAE684] m-0">{heading}</h3>
        </div>

        <div className="px-5 py-6 sm:px-7">
          <div className="bg-[#1C566C] rounded-xl px-5 py-6 text-center">
            <div className="font-serif font-bold text-[24px] sm:text-[34px] text-[#FAF9F7]">{formula}</div>
            {formulaNote && <div className="text-[#DAE684] text-[15px] mt-2">{formulaNote}</div>}
          </div>

          {compareHeading && (
            <h4 className="font-serif font-bold text-[20px] sm:text-[24px] text-[#1C2F29] mt-7 mb-3">{compareHeading}</h4>
          )}

          {!!items?.length && (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((it, i) => (
                <div key={i} className={`rounded-xl px-4 py-5 text-center ${it.highlight ? 'bg-[#DAE684]' : 'bg-[#EEF3C9]'}`}>
                  <div className="font-bold text-[17px] text-[#1C2F29]">{it.label}</div>
                  {it.expression && (
                    <div className="font-serif font-bold text-[20px] sm:text-[24px] text-[#1C2F29] mt-2">{it.expression}</div>
                  )}
                  {it.result && (
                    <div className={`font-serif font-bold text-[30px] sm:text-[38px] mt-2 ${it.highlight ? 'text-[#1C2F29]' : 'text-[#1C566C]'}`}>
                      {it.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {footnote && <p className="text-center text-[15px] text-[#6f6a5f] mt-5 mb-0">{footnote}</p>}
        </div>
      </div>
      <FigureCaption caption={caption} source={captionSource} />
    </figure>
  )
}

export function QuadrantGrid({
  heading,
  subheading,
  items,
  footnote,
  caption,
  captionSource,
}: {
  heading?: string | null
  subheading?: string | null
  items?: Array<{ title?: string | null; lines?: string | null; tone?: string | null }> | null
  footnote?: string | null
  caption?: string | null
  captionSource?: string | null
}) {
  if (!items?.length) return null

  const skin = (tone?: string | null) => {
    switch (tone) {
      case 'blue':
        return { card: 'bg-[#1C566C]', title: 'text-[#FAF9F7]', body: 'text-[#eef4f6]' }
      case 'tan':
        return { card: 'bg-[#D2A781]', title: 'text-[#2D2321]', body: 'text-[#2D2321]' }
      case 'outline':
        return { card: 'bg-[#243b34] border-2 border-[#DAE684]', title: 'text-[#DAE684]', body: 'text-[#FAF9F7]' }
      default:
        return { card: 'bg-[#DAE684]', title: 'text-[#1C2F29]', body: 'text-[#1C2F29]' }
    }
  }

  return (
    <figure className="not-prose my-8 m-0">
      <div className="bg-[#1C2F29] rounded-[10px] px-5 py-6 sm:px-8 sm:py-8">
        <h3 className="font-serif text-[26px] sm:text-[32px] font-bold text-[#DAE684] m-0">{heading}</h3>
        {subheading && <p className="text-[#FAF9F7] m-0 mt-1.5 text-[16px] sm:text-[18px]">{subheading}</p>}

        <div className="grid gap-4 mt-6 sm:grid-cols-2">
          {items.map((it, i) => {
            const s = skin(it.tone)
            return (
              <div key={i} className={`rounded-xl px-5 py-5 ${s.card}`}>
                <div className={`font-serif font-bold text-[21px] sm:text-[23px] ${s.title}`}>
                  {`${i + 1}  ${it.title ?? ''}`}
                </div>
                {it.lines && (
                  <div className={`mt-3 text-[15px] sm:text-[16px] leading-relaxed ${s.body}`}>
                    <MultilineText text={it.lines} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {footnote && <p className="text-[14px] text-[#9fb0a8] mt-6 mb-0">{footnote}</p>}
      </div>
      <FigureCaption caption={caption} source={captionSource} />
    </figure>
  )
}

/* ------------------------------------------------------------------ */
/* Dispatcher                                                          */
/* ------------------------------------------------------------------ */

/**
 * Maps a Lexical block node's `fields` to its component.
 * Returns `undefined` when the blockType is not an article block, so the caller
 * can fall through to its own handling.
 */
export function renderArticleBlock(
  fields: Record<string, any>,
  key: string,
  constantLinksMap?: ConstantLinksMap,
): React.ReactNode | undefined {
  switch (fields.blockType) {
    case 'leadAnswer':
      return <LeadAnswer key={key} text={fields.text} />
    case 'keyTakeaways':
      return (
        <KeyTakeaways
          key={key}
          heading={fields.heading}
          items={fields.items}
          oneLine={fields.oneLine}
        />
      )
    case 'tableOfContents':
      return (
        <TableOfContents
          key={key}
          heading={fields.heading}
          columns={fields.columns}
          items={fields.items}
        />
      )
    case 'sectionAnchor':
      return <SectionAnchor key={key} anchor={fields.anchor} />
    case 'snapshotBar':
      return (
        <SnapshotBar
          key={key}
          items={fields.items}
          cta={fields.cta}
          constantLinksMap={constantLinksMap}
        />
      )
    case 'comparisonTable':
      return (
        <ComparisonTable
          key={key}
          columns={fields.columns}
          rows={fields.rows}
          caption={fields.caption}
        />
      )
    case 'pullQuote':
      return <PullQuote key={key} quote={fields.quote} attribution={fields.attribution} />
    case 'calloutNote':
      return <CalloutNote key={key} title={fields.title} text={fields.text} />
    case 'ctaBanner':
      return (
        <CtaBanner
          key={key}
          style={fields.style}
          eyebrow={fields.eyebrow}
          heading={fields.heading}
          text={fields.text}
          primaryButton={fields.primaryButton}
          secondaryButton={fields.secondaryButton}
          constantLinksMap={constantLinksMap}
        />
      )
    case 'faqAccordion':
      return (
        <FaqAccordion
          key={key}
          heading={fields.heading}
          items={fields.items}
          emitSchema={fields.emitSchema}
        />
      )
    case 'sourcesList':
      return (
        <SourcesList
          key={key}
          heading={fields.heading}
          items={fields.items}
          disclaimer={fields.disclaimer}
        />
      )
    case 'spectrumDiagram':
      return (
        <SpectrumDiagram
          key={key}
          heading={fields.heading}
          subheading={fields.subheading}
          leftLabel={fields.leftLabel}
          rightLabel={fields.rightLabel}
          items={fields.items}
          footnote={fields.footnote}
          caption={fields.caption}
          captionSource={fields.captionSource}
        />
      )
    case 'formulaCallout':
      return (
        <FormulaCallout
          key={key}
          heading={fields.heading}
          formula={fields.formula}
          formulaNote={fields.formulaNote}
          compareHeading={fields.compareHeading}
          items={fields.items}
          footnote={fields.footnote}
          caption={fields.caption}
          captionSource={fields.captionSource}
        />
      )
    case 'quadrantGrid':
      return (
        <QuadrantGrid
          key={key}
          heading={fields.heading}
          subheading={fields.subheading}
          items={fields.items}
          footnote={fields.footnote}
          caption={fields.caption}
          captionSource={fields.captionSource}
        />
      )
    default:
      return undefined
  }
}
