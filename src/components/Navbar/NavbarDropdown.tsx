'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Arrow from '../Arrow/Arrow'
import LocationSearchSuggestion, { type AddressSuggestion } from '../LocationSearchSuggestion/LocationSearchSuggestion'
import type { DropdownColumn, DropdownQuote } from '@/utils/navbar'
import styles from './NavbarDropdown.module.scss'

interface NavbarDropdownProps {
  columns: DropdownColumn[]
  quote?: DropdownQuote
  isVisible: boolean
  variant?: 'upper' | 'main'
  showSearch?: boolean
}

// Render quote text with highlighted portion in green
function renderQuoteText(text: string, highlightedText?: string) {
  if (!highlightedText) {
    return text
  }

  // If highlighted text is found within the main text, split and highlight it
  if (text.includes(highlightedText)) {
    const parts = text.split(highlightedText)
    return (
      <>
        {parts[0]}
        <span className={styles.highlightedText}>{highlightedText}</span>
        {parts[1]}
      </>
    )
  }

  // If highlighted text is separate, append it after the main text
  return (
    <>
      {text} <span className={styles.highlightedText}>{highlightedText}</span>
    </>
  )
}

export default function NavbarDropdown({
  columns,
  quote,
  isVisible,
  variant = 'main',
  showSearch = false,
}: NavbarDropdownProps) {
  const [searchValue, setSearchValue] = useState('')

  const handleSearchSelect = (suggestion: AddressSuggestion) => {
    setSearchValue('')
  }

  const hasLeftContent = showSearch || quote

  return (
    <div
      className={`${styles.dropdown} ${isVisible ? styles.visible : ''} ${variant === 'upper' ? styles.upper : styles.main}`}
    >
      <div className={styles.dropdownInner}>
        {/* Left side: Search (for upper) + Quote */}
        {hasLeftContent && (
          <div className={styles.leftSection}>
            {showSearch && (
              <div className={styles.searchSection}>
                <LocationSearchSuggestion
                  value={searchValue}
                  onChange={setSearchValue}
                  onSelect={handleSearchSelect}
                  placeholder="Search for an Agent, Property, Offices and More..."
                  showSearchIcon={true}
                  searchIconPosition="right"
                  searchIconClassName={styles.searchIcon}
                  wrapperClassName={styles.searchWrapper}
                  inputClassName={styles.searchInput}
                />
              </div>
            )}
            {quote && (
              <div className={styles.quoteSection}>
                <blockquote className={styles.quote}>
                  &ldquo;...{renderQuoteText(quote.text, quote.highlightedText)}&rdquo;
                </blockquote>
                <p className={styles.author}>
                  -{quote.author}
                  {quote.company && <> | {quote.company}</>}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Right side: Columns */}
        <div className={styles.columnsSection}>
          {columns.map((column, colIndex) => (
            <div key={colIndex} className={styles.column}>
              <h4 className={styles.columnTitle}>{column.columnName}</h4>
              <ul className={styles.linkList}>
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className={styles.dropdownLink}>
                      <span>{link.label}</span>
                      <Arrow direction="right" variant="fill" size={16} />
                    </Link>
                  </li>
                ))}
              </ul>
              {column.bottomLink && (
                <Link href={column.bottomLink.href} className={styles.bottomLink}>
                  {column.bottomLink.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
