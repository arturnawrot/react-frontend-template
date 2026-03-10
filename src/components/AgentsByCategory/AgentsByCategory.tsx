'use client'
import React, { useState, useEffect } from 'react'
import type { Page } from '@/payload-types'
import AgentCard from '../AgentCard/AgentCard'
import { resolveLink } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import ArrowLink from '@/components/ArrowLink/ArrowLink'
import Arrow from '@/components/Arrow/Arrow'
import { Carousel, type CarouselRenderProps } from '../Carousel'

type AgentsByCategoryBlock = Extract<Page['blocks'][number], { blockType: 'agentsByCategory' }>

interface AgentData {
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
}

interface Category {
  id: string
  title: string
  backgroundColor: string
  linkText?: string | null
  linkType?: 'none' | 'page' | 'custom' | null
  page?: string | { slug?: string; id?: string } | null
  customUrl?: string | null
  openInNewTab?: boolean | null
  agents: AgentData[]
}

interface AgentsByCategoryProps {
  block: AgentsByCategoryBlock & {
    categories?: Category[]
    heading?: string
    description?: string
  }
}

const CategoryCarousel = ({ agents }: { agents: AgentData[] }) => {
  const renderItem = (agent: AgentData) => (
    <div className="w-[280px] md:w-[320px]">
      <AgentCard
        variant="vertical"
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
  )

  const renderAfter = ({ handleNext, handlePrev, setIsPaused }: CarouselRenderProps) => (
    <div className="flex gap-4 mt-8 justify-start">
      <button
        onClick={() => {
          setIsPaused(true)
          handlePrev()
          setTimeout(() => setIsPaused(false), 5000)
        }}
        className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
      >
        <Arrow direction="up" variant="triangle" size={12} />
      </button>
      <button
        onClick={() => {
          setIsPaused(true)
          handleNext()
          setTimeout(() => setIsPaused(false), 5000)
        }}
        className="flex items-center justify-center hover:opacity-70 text-[#1a2e28] transition-opacity"
      >
        <Arrow direction="down" variant="triangle" size={12} />
      </button>
    </div>
  )

  if (agents.length === 0) return null

  return (
    <Carousel
      items={agents}
      renderItem={renderItem}
      config={{
        cardWidth: [280, 320, 320],
        gap: 32,
        autoplay: true,
        autoplayInterval: 4000,
        pauseDuration: 5000,
      }}
      renderAfter={renderAfter}
      getItemKey={(agent) => agent.id}
    />
  )
}

export default function AgentsByCategory({ block }: AgentsByCategoryProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [heading, setHeading] = useState('Expertise That Moves Markets')
  const [description, setDescription] = useState('Our agents specialize in everything from raw land and infill redevelopment to national net-lease portfolios.')

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
        const global = data?.result || data

        if (global.heading) {
          setHeading(global.heading)
        }
        if (global.description) {
          setDescription(global.description)
        }

        if (global.categories && Array.isArray(global.categories)) {
          // For client-side fallback, fetch agents by specialty
          const transformedCategories: Category[] = await Promise.all(
            global.categories.map(async (cat: any, index: number) => {
              const specialtyId = typeof cat.specialty === 'object' ? cat.specialty?.id : cat.specialty
              let agents: AgentData[] = []

              if (specialtyId) {
                try {
                  const agentsResponse = await fetch(
                    `/api/agents?where[specialties][contains]=${specialtyId}&limit=50&depth=2`,
                    { credentials: 'include' },
                  )
                  if (agentsResponse.ok) {
                    const agentsData = await agentsResponse.json()
                    const docs = agentsData?.docs || []
                    agents = docs.map((agent: any) => {
                      const specialties = (agent.specialties || [])
                        .map((s: any) => (typeof s === 'object' && s !== null && 'name' in s ? s.name : null))
                        .filter((name: any): name is string => Boolean(name))

                      const servingLocations = (agent.servingLocations || [])
                        .map((l: any) => (typeof l === 'object' && l !== null && 'name' in l ? l.name : null))
                        .filter((name: any): name is string => Boolean(name))

                      const cardImage = agent.cardImage && typeof agent.cardImage === 'object'
                        ? agent.cardImage.url || null
                        : null

                      return {
                        id: agent.id,
                        name: agent.fullName || `${agent.firstName} ${agent.lastName}`,
                        role: agent.displayTitle || 'Agent & Broker',
                        image: cardImage,
                        servingLocations,
                        serviceTags: specialties,
                        email: agent.email || null,
                        phone: agent.phone || null,
                        linkedin: agent.linkedin || null,
                        slug: agent.slug,
                      }
                    })
                  }
                } catch (err) {
                  console.error('Error fetching agents for specialty:', err)
                }
              }

              return {
                id: cat.id || `category-${index}`,
                title: cat.title || '',
                backgroundColor: cat.backgroundColor || '#F2F7D5',
                linkText: cat.linkText || null,
                linkType: cat.linkType || null,
                page: cat.page || null,
                customUrl: cat.customUrl || null,
                openInNewTab: cat.openInNewTab || null,
                agents,
              }
            })
          )

          setCategories(transformedCategories)

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
    <section className="w-full bg-[#FAF9F6] overflow-x-clip">
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
                  {/* Left Column: Title, Link & Arrows */}
                  <div className={`flex-shrink-0 lg:w-1/4 ${isOpen ? '' : 'flex items-center'}`}>
                    <h3 className={`font-serif text-3xl md:text-4xl text-[#1C2B28] transition-opacity ${!isOpen && 'group-hover:opacity-70'}`}>
                      {cat.title}
                    </h3>

                    {isOpen && cat.linkText && (() => {
                      const link = resolveLink(cat as any)

                      if (!link.href) {
                        return null
                      }

                      return (
                        <div className="mt-6 md:mt-12">
                          <ArrowLink link={link}>{cat.linkText}</ArrowLink>
                        </div>
                      )
                    })()}

                  </div>

                  {/* Right Column: Agent Carousel (Only if open) — overflows to right edge */}
                  {isOpen && cat.agents.length > 0 && (
                    <div className="flex-grow overflow-visible" style={{ marginRight: 'calc(-50vw + 50%)' }}>
                      <CategoryCarousel agents={cat.agents} />
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
