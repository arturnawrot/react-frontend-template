'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { SerializedEditorState } from 'lexical'
import { isInternalLink } from '@/utils/link-utils'

interface LexicalRendererProps {
  content: SerializedEditorState | null | undefined
}

/**
 * Renders Lexical rich text content as HTML
 * This renderer converts Lexical nodes to React components
 */
export default function LexicalRenderer({ content }: LexicalRendererProps) {
  // Handle null/undefined content
  if (!content || !content.root) {
    return null
  }

  const rootNode = content.root

  if (!rootNode.children || !Array.isArray(rootNode.children) || rootNode.children.length === 0) {
    return null
  }

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (!node) return null

    const nodeType = node.type || node.nodeType

    // Text node
    if (nodeType === 'text') {
      const text = node.text || ''
      if (!text) return null

      // Split text by newlines and render with <br> tags
      const textParts = text.split('\n')
      let formattedText: React.ReactNode = textParts.length > 1 
        ? textParts.map((part: string, partIndex: number) => (
            <React.Fragment key={`text-part-${index}-${partIndex}`}>
              {part}
              {partIndex < textParts.length - 1 && <br />}
            </React.Fragment>
          ))
        : text

      // Apply formatting (format is a bitmask)
      if (node.format !== undefined && node.format !== null) {
        const format = node.format

        // Build wrapper components - each format wraps the previous result
        // This creates nested components like <strong><em>text</em></strong>
        if (format & 1) formattedText = <strong key={`bold-${index}`}>{formattedText}</strong> // Bold (bit 0)
        if (format & 2) formattedText = <em key={`italic-${index}`}>{formattedText}</em> // Italic (bit 1)
        if (format & 4) formattedText = <s key={`strikethrough-${index}`}>{formattedText}</s> // Strikethrough (bit 2)
        if (format & 8) formattedText = <u key={`underline-${index}`}>{formattedText}</u> // Underline (bit 3)
        if (format & 16) formattedText = <code key={`code-${index}`} className="bg-gray-100 px-1 rounded">{formattedText}</code> // Code (bit 4)
        if (format & 32) formattedText = <sub key={`subscript-${index}`}>{formattedText}</sub> // Subscript (bit 5)
        if (format & 64) formattedText = <sup key={`superscript-${index}`}>{formattedText}</sup> // Superscript (bit 6)
      }

      return formattedText
    }

    // Paragraph
    if (nodeType === 'paragraph') {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      // Don't render empty paragraphs
      if (!children || children.length === 0) {
        return null
      }

      return (
        <p key={`para-${index}`} className="text-lg leading-relaxed font-sans mb-6 whitespace-pre-line">
          {children}
        </p>
      )
    }

    // Heading
    if (nodeType === 'heading') {
      const headingTag = node.tag || node.headingTag || 2
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (!children || children.length === 0) {
        return null
      }

      const headingProps = {
        key: `heading-${index}`,
        className: 'font-serif mb-4 mt-8',
        children,
      }

      switch (headingTag) {
        case 1:
          return <h1 {...headingProps} className="text-4xl font-serif mb-4 mt-8" />
        case 2:
          return <h2 {...headingProps} className="text-3xl font-serif mb-4 mt-8" />
        case 3:
          return <h3 {...headingProps} className="text-2xl font-serif mb-4 mt-8" />
        case 4:
          return <h4 {...headingProps} className="text-xl font-serif mb-4 mt-8" />
        case 5:
          return <h5 {...headingProps} className="text-lg font-serif mb-4 mt-8" />
        case 6:
          return <h6 {...headingProps} className="text-base font-serif mb-4 mt-8" />
        default:
          return <h2 {...headingProps} className="text-3xl font-serif mb-4 mt-8" />
      }
    }

    // List
    if (nodeType === 'list') {
      const listType = node.listType || 'bullet'
      const Tag = listType === 'number' ? 'ol' : 'ul'
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (!children || children.length === 0) {
        return null
      }

      return (
        <Tag key={`list-${index}`} className="mb-4 ml-6 list-disc">
          {children}
        </Tag>
      )
    }

    // List item
    if (nodeType === 'listitem') {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (!children || children.length === 0) {
        return null
      }

      return (
        <li key={`listitem-${index}`} className="mb-2">
          {children}
        </li>
      )
    }

    // Quote / Blockquote
    if (nodeType === 'quote' || nodeType === 'blockquote') {
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (!children || children.length === 0) {
        return null
      }

      return (
        <blockquote key={`quote-${index}`} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700">
          {children}
        </blockquote>
      )
    }

    // Link
    if (nodeType === 'link') {
      const url = node.url || node.href || '#'
      const children = node.children?.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (!children || children.length === 0) {
        return null
      }

      const isInternal = isInternalLink(url) && node.target !== '_blank'
      const LinkComponent = isInternal ? Link : 'a'
      const linkProps = isInternal
        ? { href: url, className: 'text-blue-600 hover:underline' }
        : {
            href: url,
            target: node.target || undefined,
            rel: node.target === '_blank' ? 'noopener noreferrer' : undefined,
            className: 'text-blue-600 hover:underline',
          }

      return (
        <LinkComponent
          key={`link-${index}`}
          {...linkProps}
        >
          {children}
        </LinkComponent>
      )
    }

    // Line break
    if (nodeType === 'linebreak') {
      return <br key={`br-${index}`} />
    }

    // Horizontal rule
    if (nodeType === 'horizontalrule' || nodeType === 'hr') {
      return <hr key={`hr-${index}`} className="my-8 border-gray-300" />
    }

    // Upload/Image node (Payload Lexical upload blocks)
    if (nodeType === 'upload' || nodeType === 'image' || nodeType === 'payloadUpload') {
      // Try multiple possible structures for upload nodes
      let uploadValue: any = null

      // Check various possible locations for the upload value
      if (node.value) {
        uploadValue = node.value
      } else if (node.fields?.value) {
        uploadValue = node.fields.value
      } else if (node.relationTo === 'media' && node.id) {
        uploadValue = node.id
      }

      let imageUrl: string | null = null
      let imageAlt: string = ''

      // Handle different upload value structures
      if (uploadValue) {
        if (typeof uploadValue === 'string') {
          if (uploadValue.startsWith('http') || uploadValue.startsWith('/')) {
            imageUrl = uploadValue
          }
        } else if (typeof uploadValue === 'object' && uploadValue !== null) {
          imageUrl = uploadValue.url || uploadValue.filename || null
          imageAlt = uploadValue.alt || uploadValue.name || ''
        }
      }

      // Also check for direct properties on the node itself
      if (!imageUrl) {
        if (node.url) {
          imageUrl = node.url
        } else if (node.src) {
          imageUrl = node.src
        } else if (typeof node.media === 'object' && node.media !== null) {
          imageUrl = (node.media as any).url || (node.media as any).filename || null
          imageAlt = (node.media as any).alt || (node.media as any).name || ''
        }
      }

      if (!imageAlt) {
        imageAlt = node.alt || node.caption || ''
      }

      if (imageUrl) {
        return (
          <figure key={`upload-${index}`} className="my-8 relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt={imageAlt || 'Blog image'}
              fill
              className="object-contain object-left"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
            {imageAlt && (
              <figcaption className="mt-2 text-sm text-gray-600 italic text-center">
                {imageAlt}
              </figcaption>
            )}
          </figure>
        )
      }
    }

    // Default: render children if they exist
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      const children = node.children.map((child: any, i: number) => renderNode(child, i)).filter(Boolean)
      
      if (children.length > 0) {
        return (
          <React.Fragment key={`fragment-${index}`}>
            {children}
          </React.Fragment>
        )
      }
    }

    return null
  }

  const children = rootNode.children
    .map((node: any, index: number) => renderNode(node, index))
    .filter(Boolean)

  if (children.length === 0) {
    return null
  }

  return <div className="space-y-6 text-[#1a2e2a]">{children}</div>
}

