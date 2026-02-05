'use client'
import React, { useState, useEffect } from 'react'
import type { Page } from '@/payload-types'
import AgentCard from '../AgentCard/AgentCard'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ArrowLink from '@/components/ArrowLink/ArrowLink'

type AgentsByCategoryBlock = Extract<Page['blocks'][number], { blockType: 'agentsByCategory' }>

interface Category {
  id: string
  title: string
  backgroundColor: string
  linkText?: string | null
  linkType?: 'none' | 'page' | 'custom' | null
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  openInNewTab?: boolean | null
  agents: Array<{
    id: string
    name: string
    role: string
    image?: string | null
    servingLocations: string[]
    serviceTags: string[]
    email?: string | null
    phone?: string | null
    linkedin?: string | null
    slug?: string
  }>
}

interface AgentsByCategoryProps {
  block: AgentsByCategoryBlock & {
    categories?: Category[]
    heading?: string
    description?: string
  }
}

export default function AgentsByCategory({ block }: AgentsByCategoryProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [heading, setHeading] = useState('Expertise That Moves Markets')
  const [description, setDescription] = useState('Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.')

  // Check mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Use block props if provided (from server-side rendering) - this takes precedence
  useEffect(() => {
    if (block.categories && block.categories.length > 0) {
      setCategories(block.categories)
      if (!activeId) {
        setActiveId(block.categories[0].id)
      }
    }
    if (block.heading) {
      setHeading(block.heading)
    }
    if (block.description) {
      setDescription(block.description)
    }
  }, [block])

  // Fetch categories from global (fallback if not provided via block props)
  useEffect(() => {
    // Only fetch if categories weren't provided via block props
    if (block.categories && block.categories.length > 0) {
      return
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/globals/agentCategories', {
          credentials: 'include',
        })
        if (!response.ok) throw new Error('Failed to fetch categories')

        const data = await response.json()
        
        // Payload REST API returns { result: { ...globalData } }
        const global = data?.result || data

          // Set heading and description
          if (global.heading) {
            setHeading(global.heading)
          }
          if (global.description) {
            setDescription(global.description)
          }

          // Transform categories
          if (global.categories && Array.isArray(global.categories)) {
            const transformedCategories: Category[] = global.categories.map((cat: any, index: number) => {
              // Extract agents
              type MappedAgent = {
                id: string
                name: string
                role: string
                image: string | null
                servingLocations: string[]
                serviceTags: string[]
                email: string | null
                phone: string | null
                linkedin: string | null
                slug: string | undefined
              }

              const agents = (cat.agents || [])
                .map((agent: any): MappedAgent | null => {
                  if (typeof agent === 'string') {
                    return null // Skip IDs, they should be populated
                  }

                  // Extract roles
                  const roles = (agent.roles || [])
                    .map((r: any) => (typeof r === 'object' && r !== null && 'name' in r ? r.name : null))
                    .filter((name: any): name is string => Boolean(name))

                  // Extract specialties
                  const specialties = (agent.specialties || [])
                    .map((s: any) => (typeof s === 'object' && s !== null && 'name' in s ? s.name : null))
                    .filter((name: any): name is string => Boolean(name))

                  // Extract serving locations
                  const servingLocations = (agent.servingLocations || [])
                    .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
                    .filter((name: any): name is string => Boolean(name))

                  // Get image URL
                  const cardImage = agent.cardImage && typeof agent.cardImage === 'object'
                    ? agent.cardImage.url || null
                    : null

                  return {
                    id: agent.id,
                    name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                    role: roles.length > 0 ? roles.join(' & ') : 'Agent & Broker',
                    image: cardImage,
                    servingLocations,
                    serviceTags: specialties,
                    email: agent.email || null,
                    phone: agent.phone || null,
                    linkedin: agent.linkedin || null,
                    slug: agent.slug,
                  }
                })
                .filter((agent: MappedAgent | null): agent is MappedAgent => agent !== null)

              return {
                id: cat.id || `category-${index}`,
                title: cat.title || '',
                backgroundColor: cat.backgroundColor || '#F2F7D5',
                linkText: cat.linkText || null,
                linkType: cat.linkType || null,
                page: cat.page || null,
                customUrl: cat.customUrl || null,
                openInNewTab: cat.openInNewTab || null,
                agents: agents.slice(0, 3), // Ensure max 3 agents
              }
            })

            setCategories(transformedCategories)

            // Set first category as active by default
            if (transformedCategories.length > 0 && !activeId) {
              setActiveId(transformedCategories[0].id)
            }
          }
      } catch (err) {
        console.error('Error fetching agent categories:', err)
      }
    }

    fetchCategories()
  }, [block.categories, activeId])

  if (categories.length === 0) {
    return null
  }

  return (
    <section className="w-full bg-[#FAF9F6]">
      {/* Top Header Section */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-20">
        <SectionHeading className="mb-4">
          {heading}
        </SectionHeading>
        <p className="text-[#1C2B28] font-medium text-lg max-w-2xl leading-relaxed">
          {description}
        </p>
      </div>

      {/* Accordion Categories */}
      <div className="flex flex-col">
        {categories.map((cat) => {
          const isOpen = activeId === cat.id
          const bgColor = cat.backgroundColor.startsWith('#') 
            ? cat.backgroundColor 
            : `#${cat.backgroundColor}`

          return (
            <div
              key={cat.id}
              className="transition-colors duration-300"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className={`max-w-[1400px] mx-auto px-6 ${isOpen ? 'py-16' : 'py-8 cursor-pointer group'}`}
                onClick={() => !isOpen && setActiveId(cat.id)}
              >
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                  {/* Left Column: Title & Link */}
                  <div className={`flex-shrink-0 lg:w-1/4 ${isOpen ? '' : 'flex items-center'}`}>
                    <h3 className={`font-serif text-3xl md:text-4xl text-[#1C2B28] transition-opacity ${!isOpen && 'group-hover:opacity-70'}`}>
                      {cat.title}
                    </h3>

                    {/* Only show link if open */}
                    {isOpen && cat.linkText && (() => {
                      // Convert Category to match utility function types (null -> undefined)
                      const linkData = {
                        ...cat,
                        linkType: cat.linkType ?? undefined,
                        openInNewTab: cat.openInNewTab ?? undefined,
                      }
                      const linkHref = resolveLinkUrl(linkData)
                      const openInNewTab = shouldOpenInNewTab(linkData)
                      
                      if (!linkHref) {
                        return null
                      }
                      
                      return (
                        <div className="mt-6 md:mt-12">
                          <ArrowLink href={linkHref} openInNewTab={openInNewTab}>
                            {cat.linkText}
                          </ArrowLink>
                        </div>
                      )
                    })()}
                  </div>

                  {/* Right Column: Agent Grid (Only if open) */}
                  {isOpen && (
                    <div className="flex-grow">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {cat.agents.map((agent) => (
                          <div key={agent.id} className="w-full h-full">
                            <AgentCard
                              variant={isMobile ? "horizontal" : "vertical"}
                              name={agent.name}
                              role={agent.role}
                              image={agent.image}
                              servingLocations={agent.servingLocations}
                              serviceTags={agent.serviceTags}
                              email={agent.email}
                              phone={agent.phone}
                              linkedin={agent.linkedin}
                              slug={agent.slug}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
