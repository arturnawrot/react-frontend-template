import type { Block } from 'payload'
import { createLinkFields } from '../fields/linkField'

/**
 * Editorial blocks for long-form article content.
 *
 * These are Lexical blocks (inserted through the rich text editor), not page
 * template blocks — so any collection whose rich text editor registers
 * `articleBlocks` gets all of them, and editors can place them anywhere in the
 * body copy without a developer touching a template.
 *
 * Rendered by `src/components/ArticleBlocks/*` via `LexicalRenderer`.
 */

/** Button group used by the CTA block. Nested in a group so field names stay short. */
function buttonGroup(name: string, label: string, required = false) {
  return {
    name,
    type: 'group' as const,
    label,
    fields: createLinkFields({
      linkTextName: 'label',
      linkTextLabel: 'Button Label',
      linkTextRequired: required,
      defaultLinkType: 'custom',
    }),
  }
}

/** Lime "Key takeaways" summary box. */
export const KeyTakeawaysBlock: Block = {
  slug: 'keyTakeaways',
  labels: { singular: 'Key Takeaways Box', plural: 'Key Takeaways Boxes' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Key takeaways',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Takeaway', plural: 'Takeaways' },
      admin: {
        description: 'Each takeaway renders as a bullet. The lead-in is bolded at the start of the line.',
      },
      fields: [
        {
          name: 'lead',
          type: 'text',
          admin: { description: 'Optional bolded lead-in, e.g. "A BOV is not an appraisal."' },
        },
        {
          name: 'text',
          type: 'textarea',
          required: true,
          admin: { description: 'The rest of the takeaway.' },
        },
      ],
    },
    {
      name: 'oneLine',
      type: 'textarea',
      label: 'One-line Summary',
      admin: {
        description: 'Optional bold closing line, separated by a divider. E.g. "If you remember one thing: …"',
      },
    },
  ],
}

/** Table of contents card with in-page anchor links. */
export const TableOfContentsBlock: Block = {
  slug: 'tableOfContents',
  labels: { singular: 'Table of Contents', plural: 'Tables of Contents' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: "What's in this guide",
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: 'two',
      options: [
        { label: 'One column', value: 'one' },
        { label: 'Two columns', value: 'two' },
      ],
      admin: { description: 'Two columns collapse to one on mobile.' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Entry', plural: 'Entries' },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'anchor',
          type: 'text',
          required: true,
          admin: {
            description:
              'The id of the section to jump to, without the "#". Add a matching Section Anchor block above that heading.',
          },
        },
      ],
    },
  ],
}

/**
 * Invisible anchor target so the Table of Contents can link to a heading.
 * Rich text headings have no id of their own, so editors drop one of these
 * directly above the heading they want to link to.
 */
export const SectionAnchorBlock: Block = {
  slug: 'sectionAnchor',
  labels: { singular: 'Section Anchor', plural: 'Section Anchors' },
  fields: [
    {
      name: 'anchor',
      type: 'text',
      required: true,
      admin: {
        description:
          'Anchor id without the "#", e.g. "bov-vs-appraisal". Place this block right above the heading it belongs to. It renders nothing visible.',
      },
    },
  ],
}

/** Navy snapshot bar: a row of label/value stats plus an optional CTA button. */
export const SnapshotBarBlock: Block = {
  slug: 'snapshotBar',
  labels: { singular: 'Snapshot Bar', plural: 'Snapshot Bars' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: { description: 'E.g. "Read time" / "9 minutes".' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    buttonGroup('cta', 'Call to Action Button'),
  ],
}

/** Highlighted direct answer paragraph (answer-engine friendly). */
export const LeadAnswerBlock: Block = {
  slug: 'leadAnswer',
  labels: { singular: 'Lead Answer', plural: 'Lead Answers' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      admin: {
        description:
          'A direct, self-contained answer to the section heading. Placed right under the heading, it is what search and AI answer engines tend to quote.',
      },
    },
  ],
}

/** Responsive comparison table with an optional caption. */
export const ComparisonTableBlock: Block = {
  slug: 'comparisonTable',
  labels: { singular: 'Comparison Table', plural: 'Comparison Tables' },
  fields: [
    {
      name: 'columns',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Column', plural: 'Columns' },
      admin: { description: 'Column headers, left to right.' },
      fields: [{ name: 'heading', type: 'text', required: true }],
    },
    {
      name: 'rows',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Row', plural: 'Rows' },
      admin: { description: 'Add one cell per column, in the same left-to-right order.' },
      fields: [
        {
          name: 'cells',
          type: 'array',
          minRows: 1,
          labels: { singular: 'Cell', plural: 'Cells' },
          fields: [{ name: 'value', type: 'textarea', required: true }],
        },
      ],
    },
    {
      name: 'caption',
      type: 'textarea',
      admin: { description: 'Optional caption shown under the table.' },
    },
  ],
}

/** Navy pull quote with attribution. */
export const PullQuoteBlock: Block = {
  slug: 'pullQuote',
  labels: { singular: 'Pull Quote', plural: 'Pull Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    {
      name: 'attribution',
      type: 'text',
      admin: { description: 'Optional, e.g. "The advisory perspective at Meybohm Commercial".' },
    },
  ],
}

/** Dashed-border aside for caveats and side notes. */
export const CalloutNoteBlock: Block = {
  slug: 'calloutNote',
  labels: { singular: 'Callout Note', plural: 'Callout Notes' },
  fields: [
    {
      name: 'title',
      type: 'text',
      admin: { description: 'Optional bold lead-in, e.g. "A note on precision:".' },
    },
    { name: 'text', type: 'textarea', required: true },
  ],
}

/** Mid-article or end-of-article call to action. */
export const CtaBannerBlock: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    {
      name: 'style',
      type: 'select',
      defaultValue: 'mid',
      options: [
        { label: 'Mid-article (blue)', value: 'mid' },
        { label: 'End of article (navy, larger)', value: 'end' },
      ],
    },
    {
      name: 'eyebrow',
      type: 'text',
      admin: {
        condition: (_: unknown, siblingData: Record<string, unknown>) => siblingData?.style === 'end',
        description: 'Small uppercase line above the heading, e.g. a tagline.',
      },
    },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    buttonGroup('primaryButton', 'Primary Button'),
    buttonGroup('secondaryButton', 'Secondary Button (optional)'),
  ],
}

/** Expandable FAQ list, optionally emitting FAQPage structured data. */
export const FaqAccordionBlock: Block = {
  slug: 'faqAccordion',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently asked questions',
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Question', plural: 'Questions' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
    {
      name: 'emitSchema',
      type: 'checkbox',
      label: 'Add FAQ structured data (schema.org FAQPage)',
      defaultValue: true,
      admin: {
        description:
          'Outputs JSON-LD so search engines can show these as rich results. Use only one FAQ block per page with this enabled.',
      },
    },
  ],
}

/** Numbered source list with an optional disclaimer. */
export const SourcesListBlock: Block = {
  slug: 'sourcesList',
  labels: { singular: 'Sources List', plural: 'Sources Lists' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Sources' },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      labels: { singular: 'Source', plural: 'Sources' },
      fields: [
        {
          name: 'citation',
          type: 'textarea',
          required: true,
          admin: { description: 'Publisher and title, e.g. "JPMorgan Chase, \'CRE Valuation Approaches\'".' },
        },
        { name: 'url', type: 'text', admin: { description: 'Optional link to the source.' } },
        {
          name: 'linkText',
          type: 'text',
          admin: { description: 'Optional display text for the link. Defaults to the URL host.' },
        },
        {
          name: 'extraPrefix',
          type: 'text',
          admin: { description: 'Optional text between the two links, e.g. "; also reported by".' },
        },
        {
          name: 'extraUrl',
          type: 'text',
          admin: { description: 'Optional second link, for sources that cite two places.' },
        },
        {
          name: 'extraLinkText',
          type: 'text',
          admin: { description: 'Display text for the second link. Defaults to its URL host.' },
        },
        {
          name: 'suffix',
          type: 'text',
          admin: { description: 'Optional trailing note shown after the link, e.g. a data-as-of caveat.' },
        },
      ],
    },
    {
      name: 'disclaimer',
      type: 'textarea',
      admin: { description: 'Optional italic disclaimer shown beneath the sources.' },
    },
  ],
}

/** Caption fields shared by the diagram blocks. */
function figureCaptionFields() {
  return [
    {
      name: 'caption',
      type: 'textarea' as const,
      admin: { description: 'Optional caption shown under the figure.' },
    },
    {
      name: 'captionSource',
      type: 'text' as const,
      admin: { description: 'Optional muted source note appended to the caption.' },
    },
  ]
}

/**
 * Horizontal spectrum: a labelled axis with a card per point along it.
 * E.g. CMA → BOV → Appraisal, from informal/free to formal/regulated.
 */
export const SpectrumDiagramBlock: Block = {
  slug: 'spectrumDiagram',
  labels: { singular: 'Spectrum Diagram', plural: 'Spectrum Diagrams' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'text' },
    {
      name: 'leftLabel',
      type: 'text',
      admin: { description: 'Label at the left end of the axis, e.g. "Informal · Free · Fast".' },
    },
    {
      name: 'rightLabel',
      type: 'text',
      admin: { description: 'Label at the right end, e.g. "Formal · Paid · Regulated".' },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 5,
      required: true,
      labels: { singular: 'Point', plural: 'Points' },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        {
          name: 'lines',
          type: 'textarea',
          admin: { description: 'Body copy. Each new line renders as its own line.' },
        },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'muted',
          options: [
            { label: 'Muted (dark card, tan marker)', value: 'muted' },
            { label: 'Accent (dark card, blue marker)', value: 'accent' },
            { label: 'Highlighted (lime card)', value: 'highlight' },
          ],
        },
      ],
    },
    { name: 'footnote', type: 'text' },
    ...figureCaptionFields(),
  ],
}

/** A formula banner plus side-by-side worked examples. */
export const FormulaCalloutBlock: Block = {
  slug: 'formulaCallout',
  labels: { singular: 'Formula Callout', plural: 'Formula Callouts' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'formula',
      type: 'text',
      required: true,
      admin: { description: 'The headline formula, e.g. "Value = NOI ÷ Cap Rate".' },
    },
    { name: 'formulaNote', type: 'text' },
    { name: 'compareHeading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      maxRows: 3,
      labels: { singular: 'Worked Example', plural: 'Worked Examples' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'expression', type: 'text' },
        { name: 'result', type: 'text' },
        { name: 'highlight', type: 'checkbox', defaultValue: false },
      ],
    },
    { name: 'footnote', type: 'text' },
    ...figureCaptionFields(),
  ],
}

/** Numbered grid of coloured cards — the "four levers" style figure. */
export const QuadrantGridBlock: Block = {
  slug: 'quadrantGrid',
  labels: { singular: 'Quadrant Grid', plural: 'Quadrant Grids' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      minRows: 2,
      maxRows: 6,
      required: true,
      labels: { singular: 'Card', plural: 'Cards' },
      admin: { description: 'Cards are numbered automatically in order.' },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'lines',
          type: 'textarea',
          admin: { description: 'Body copy. Each new line renders as its own line.' },
        },
        {
          name: 'tone',
          type: 'select',
          defaultValue: 'lime',
          options: [
            { label: 'Lime', value: 'lime' },
            { label: 'Blue', value: 'blue' },
            { label: 'Tan', value: 'tan' },
            { label: 'Outlined', value: 'outline' },
          ],
        },
      ],
    },
    { name: 'footnote', type: 'text' },
    ...figureCaptionFields(),
  ],
}

/**
 * All editorial blocks, ready to hand to `BlocksFeature({ blocks: articleBlocks })`.
 * Register this on any rich text field that should offer the full set.
 */
export const articleBlocks: Block[] = [
  LeadAnswerBlock,
  KeyTakeawaysBlock,
  TableOfContentsBlock,
  SectionAnchorBlock,
  SnapshotBarBlock,
  ComparisonTableBlock,
  PullQuoteBlock,
  CalloutNoteBlock,
  CtaBannerBlock,
  FaqAccordionBlock,
  SourcesListBlock,
  SpectrumDiagramBlock,
  FormulaCalloutBlock,
  QuadrantGridBlock,
]
