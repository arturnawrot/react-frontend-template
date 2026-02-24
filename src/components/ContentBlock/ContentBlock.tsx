import type { Page } from '@/payload-types'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import Container from '@/components/Container/Container'

type ContentBlockProps = {
  block: Extract<Page['blocks'][number], { blockType: 'contentBlock' }>
}

export default function ContentBlock({ block }: ContentBlockProps) {
  const content = block.content

  if (!content) {
    return null
  }

  return (
    <Container>
      <div className="prose prose-lg max-w-none">
        <LexicalRenderer content={content} />
      </div>
    </Container>
  )
}
