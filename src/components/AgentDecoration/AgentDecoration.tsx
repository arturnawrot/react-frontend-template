import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Page, Media } from '@/payload-types'
import { resolveLinkUrl, shouldOpenInNewTab } from '@/utils/linkResolver'
import { isInternalLink } from '@/utils/link-utils'
import SectionHeading from '@/components/SectionHeading/SectionHeading'

type AgentDecorationBlock = Extract<Page['blocks'][number], { blockType: 'agentDecoration' }>

interface Agent {
  id: string
  firstName: string
  lastName: string
  fullName?: string | null
  slug?: string
  cardImage?: Media | string | null
}

interface AgentDecorationProps {
  block: AgentDecorationBlock & {
    agents?: Agent[]
  }
}

// --- Helper for Image URLs ---
const getImageUrl = (image?: Media | string | null): string => {
  if (!image) return ''
  if (typeof image === 'string') return image
  if (typeof image === 'object' && image !== null && 'url' in image) {
    return image.url || ''
  }
  return ''
}

const AgentCard = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  if (!src) return null
  
  return (
    <div className={`relative overflow-hidden rounded-3xl aspect-square shadow-sm shrink-0 
      w-36 h-36           /* Mobile: Standard size (144px) */
      lg:w-[100px] lg:h-[100px]     /* Laptop: Smaller to prevent overlap */
      xl:w-[140px] xl:h-[140px]     /* Desktop: Full size */
      ${className || ''}`}>
      <Image 
        src={src} 
        alt={alt} 
        fill
        className="w-full h-full object-cover"
        sizes="(max-width: 1024px) 144px, 140px"
        loading="lazy"
        quality={75}
      />
    </div>
  )
}

export default function AgentDecoration({ block }: AgentDecorationProps) {
  const heading = block.heading || 'Find the Right\nPartner for Your\nProperty Goals'
  const buttonText = block.buttonText || 'Browse All Agents'
  const linkHref = resolveLinkUrl(block as any)
  const openInNewTab = shouldOpenInNewTab(block as any)
  
  // Split heading by \n for line breaks
  const headingLines = heading.split('\\n')
  
  const allAgents = block.agents || []
  
  // Use up to 8 agents for the decorative layout
  const agents = allAgents.slice(0, 8)

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24">
      
      <div className="flex flex-col items-center justify-center relative w-full z-10">
        
        {/* --- Text & Button Section --- */}
        <div className="flex flex-col items-center text-center px-6 mx-auto mb-12 lg:mb-0 
                        max-w-lg xl:max-w-3xl transition-all duration-300">
          
          <SectionHeading align="center" className="mb-8 tracking-tight">
            {headingLines.map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < headingLines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </SectionHeading>
          
          {buttonText && linkHref && (
            <div>
              {(() => {
                const isInternal = isInternalLink(linkHref) && !openInNewTab
                const LinkComponent = isInternal ? Link : 'a'
                const linkProps = isInternal
                  ? { 
                      href: linkHref, 
                      className: 'bg-[#dce775] hover:bg-[#d2dd6e] text-[#1a3b32] font-bold py-4 px-10 rounded-full transition-colors duration-300 text-lg w-full md:w-auto shadow-sm inline-block text-center' 
                    }
                  : {
                      href: linkHref,
                      target: openInNewTab ? '_blank' : undefined,
                      rel: openInNewTab ? 'noopener noreferrer' : undefined,
                      className: 'bg-[#dce775] hover:bg-[#d2dd6e] text-[#1a3b32] font-bold py-4 px-10 rounded-full transition-colors duration-300 text-lg w-full md:w-auto shadow-sm inline-block text-center',
                    }
                return (
                  <LinkComponent {...linkProps}>
                    {buttonText}
                  </LinkComponent>
                )
              })()}
            </div>
          )}
        </div>

        {/* --- MOBILE: Image Grid --- */}
        {agents.length > 0 && (
          <>
            <div className="flex lg:hidden flex-col gap-4 w-full mt-4">
              <div className="flex justify-center gap-4 min-w-[120%] -ml-[10%]">
                {agents.slice(0, 5).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4">
                {agents.slice(2, 6).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
            </div>

            {/* --- DESKTOP: Left Side Images --- */}
            <div className="hidden lg:flex flex-col gap-6 absolute left-0 top-1/2 -translate-y-1/2 
                            xl:left-[-5%] 2xl:left-0 transition-all duration-300">
              <div className="flex gap-2 translate-x-[-40px]">
                {agents.slice(0, 3).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className="flex gap-2 translate-x-[-80px]">
                {agents.slice(2, 6).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
            </div>

            {/* --- DESKTOP: Right Side Images --- */}
            <div className="hidden lg:flex flex-col gap-6 absolute right-0 top-1/2 -translate-y-1/2 
                            xl:right-[-5%] 2xl:right-0 transition-all duration-300">
              <div className="flex gap-2 translate-x-[170px]">
                {agents.slice(2, 5).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className="flex gap-2 translate-x-[80px]">
                {agents.slice(4, 8).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </section>
  )
}
