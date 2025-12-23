'use client'

import React from 'react'
import type { SerializedEditorState } from 'lexical'

interface LexicalRendererProps {
  content: SerializedEditorState | null | undefined
}

/**
 * Renders Lexical rich text content as HTML
 * This is a simple renderer that converts Lexical nodes to HTML
 */
export default function LexicalRenderer({ content }: LexicalRendererProps) {
  if (!content || !content.root || !content.root.children) {
    return null
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    // Text node
    if (node.type === 'text') {
      let text: React.ReactNode = node.text || ''
      
      // Apply formatting (format is a bitmask)
      if (node.format) {
        const format = node.format
        
        // Build wrapper components - each format wraps the previous result
        // This creates nested components like <strong><em>text</em></strong>
        if (format & 1) text = <strong key={`bold-${index}`}>{text}</strong> // Bold (bit 0)
        if (format & 2) text = <em key={`italic-${index}`}>{text}</em> // Italic (bit 1) - wraps previous
        if (format & 4) text = <s key={`strikethrough-${index}`}>{text}</s> // Strikethrough (bit 2)
        if (format & 8) text = <u key={`underline-${index}`}>{text}</u> // Underline (bit 3)
        if (format & 16) text = <code key={`code-${index}`} className="bg-gray-100 px-1 rounded">{text}</code> // Code (bit 4)
        if (format & 32) text = <sub key={`subscript-${index}`}>{text}</sub> // Subscript (bit 5)
        if (format & 64) text = <sup key={`superscript-${index}`}>{text}</sup> // Superscript (bit 6)
      }

      return text
    }

    // Paragraph
    if (node.type === 'paragraph') {
      return (
        <p key={`para-${index}`} className="text-lg leading-relaxed font-sans mb-6">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </p>
      )
    }

    // Heading
    if (node.type === 'heading') {
      const Tag = `h${node.tag}` as keyof JSX.IntrinsicElements
      return (
        <Tag key={`heading-${index}`} className="font-serif mb-4">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      )
    }

    // List
    if (node.type === 'list') {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={`list-${index}`} className="mb-4 ml-6">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </Tag>
      )
    }

    // List item
    if (node.type === 'listitem') {
      return (
        <li key={`listitem-${index}`} className="mb-2">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      )
    }

    // Quote
    if (node.type === 'quote') {
      return (
        <blockquote key={`quote-${index}`} className="border-l-4 border-gray-300 pl-4 italic my-4">
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </blockquote>
      )
    }

    // Link
    if (node.type === 'link') {
      return (
        <a
          key={`link-${index}`}
          href={node.url}
          target={node.target || undefined}
          rel={node.target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-blue-600 hover:underline"
        >
          {node.children?.map((child: any, i: number) => renderNode(child, i))}
        </a>
      )
    }

    // Line break
    if (node.type === 'linebreak') {
      return <br key={`br-${index}`} />
    }

    // Default: render children if they exist
    if (node.children && Array.isArray(node.children)) {
      return (
        <React.Fragment key={`fragment-${index}`}>
          {node.children.map((child: any, i: number) => renderNode(child, i))}
        </React.Fragment>
      )
    }

    return null
  }

  const children = content.root.children.map((node: any, index: number) => renderNode(node, index))

  return <div className="space-y-6 text-[#1a2e2a]">{children}</div>
}

