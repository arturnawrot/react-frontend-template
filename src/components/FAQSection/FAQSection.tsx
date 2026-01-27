'use client'
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import Container from '@/components/Container/Container'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'

type FAQSectionBlock = Extract<Page['blocks'][number], { blockType: 'faqSection' }> & {
  questions?: Array<{
    question: string
    answer: any // RichText field (Lexical)
  }>
}

interface FAQSectionProps {
  block: FAQSectionBlock
}

export default function FAQSection({ block }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const heading = block.heading || 'FAQs'
  const description = block.description || 'Common questions from our clients. Feel free to reach out with more.'
  const contactButtonText = block.contactButtonText || 'Contact Us'
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)

  // Use questions from the block (fetched from global set in renderBlocks)
  const questions = block.questions || []

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Handle empty questions
  if (questions.length === 0) {
    return (
      <section className="w-full bg-[var(--strong-green)] py-20">
        <Container>
          <div className="text-center text-white">
            <p className="text-white/60">No FAQs available. Please select an FAQ set.</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="w-full bg-[var(--strong-green)] py-20">
      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* LEFT SECTION: Fixed Content (1/3 width) */}
        <div className="lg:col-span-4 flex flex-col z-10">
          <div>
            <SectionHeading as="h2" className="mb-8 whitespace-normal leading-[1.1]">
              <span className="text-white">
              {heading}
              </span>
            </SectionHeading>
            
            <p className="text-white text-base leading-relaxed mb-8">
              {description}
            </p>

            {contactButtonText && linkHref && (
              <PrimaryButton
                href={linkHref}
                openInNewTab={openInNewTab}
                className="font-bold px-6 py-3 rounded-lg"
              >
                {contactButtonText}
              </PrimaryButton>
            )}
          </div>
        </div>

        {/* RIGHT SECTION: Accordion (2/3 width) */}
        <div className="lg:col-span-8">
          <div className="space-y-0">
            {questions.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div key={index} className="border-b border-white/20 last:border-b-0">
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-white text-base font-medium pr-8 flex-1">
                      {faq.question}
                    </span>
                    <span className="text-white text-2xl font-light flex-shrink-0 transition-transform duration-200 group-hover:opacity-80">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  
                  {isOpen && (
                    <div className="pb-6 pr-12">
                      <div className="text-white text-base leading-relaxed [&_p]:text-white [&_p]:text-base [&_p]:mb-4 [&_p]:font-sans [&_*]:text-white [&_strong]:text-white [&_strong]:font-bold [&_em]:text-white [&_a]:text-white [&_a]:underline [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_h4]:text-white [&_h5]:text-white [&_h6]:text-white [&_li]:text-white [&_ul]:text-white [&_ol]:text-white">
                        <LexicalRenderer content={faq.answer} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </Container>
    </section>
  )
}
