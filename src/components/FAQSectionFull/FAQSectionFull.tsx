'use client'
import React, { useState } from 'react'
import type { Page } from '@/payload-types'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import Container from '@/components/Container/Container'

type FAQSectionFullBlock = Extract<Page['blocks'][number], { blockType: 'faqSectionFull' }> & {
  categories?: Array<{
    categoryName: string
    questions: Array<{
      question: string
      answer: any // RichText field (Lexical)
    }>
  }>
}

interface FAQSectionFullProps {
  block: FAQSectionFullBlock
}

// Shared FAQ accordion item component
function FAQItem({ 
  faq, 
  index, 
  isOpen, 
  onToggle 
}: { 
  faq: { question: string; answer: any }
  index: number
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-300 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-gray-900 text-base font-medium pr-8 flex-1">
          {faq.question}
        </span>
        <span className="text-gray-900 text-2xl font-light flex-shrink-0 transition-transform duration-200 group-hover:opacity-80">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      {isOpen && (
        <div className="pb-6 pr-12">
          <div className="text-gray-700 text-base leading-relaxed [&_p]:text-gray-700 [&_p]:text-base [&_p]:mb-4 [&_p]:font-sans [&_strong]:text-gray-900 [&_strong]:font-bold [&_em]:text-gray-700 [&_a]:text-blue-600 [&_a]:underline [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_h3]:text-gray-900 [&_h4]:text-gray-900 [&_h5]:text-gray-900 [&_h6]:text-gray-900 [&_li]:text-gray-700 [&_ul]:text-gray-700 [&_ol]:text-gray-700">
            <LexicalRenderer content={faq.answer} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function FAQSectionFull({ block }: FAQSectionFullProps) {
  // Track open state per category and question using a string key
  const [openKey, setOpenKey] = useState<string | null>(null)

  // Use categories from the block (fetched from global in renderBlocks)
  const categories = block.categories || []

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenKey(openKey === key ? null : key)
  }

  // Flatten all questions for empty check
  const totalQuestions = categories.reduce((sum, cat) => sum + (cat.questions?.length || 0), 0)

  // Handle empty questions
  if (totalQuestions === 0) {
    return (
      <section className="w-full bg-white py-20">
        <Container>
          <div className="text-center text-gray-600">
            <p>No FAQs available. Please configure the FAQ Full Page global.</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="w-full bg-white py-20">
      <Container>
        {/* Categories and Questions */}
        <div className="space-y-12">
          {categories.map((category, categoryIndex) => {
            const questions = category.questions || []
            
            if (questions.length === 0) return null

            return (
              <div key={categoryIndex}>
                {/* Category Heading */}
                <h2 className="text-gray-900 text-2xl font-serif mb-6">
                  {category.categoryName}
                </h2>
                
                {/* Questions in this category */}
                <div className="space-y-0">
                  {questions.map((faq, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`
                    const isOpen = openKey === key

                    return (
                      <FAQItem
                        key={questionIndex}
                        faq={faq}
                        index={questionIndex}
                        isOpen={isOpen}
                        onToggle={() => toggleQuestion(categoryIndex, questionIndex)}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
