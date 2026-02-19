import React from 'react'
import Image from 'next/image'
import type { Page, Media } from '@/payload-types'
import { resolveLink, type ConstantLinksMap } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'

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
  constantLinksMap?: ConstantLinksMap
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

export default function AgentDecoration({ block, constantLinksMap }: AgentDecorationProps) {
  const heading = block.heading || 'Find the Right\nPartner for Your\nProperty Goals'
  const buttonText = block.buttonText
  const link = resolveLink(block as any, constantLinksMap)
  const variant = (block as any).variant || 'full'
  const description = (block as any).description
  const bulletPoints = (block as any).bulletPoints || []
  const isCompact = variant === 'compact'
  
  // Split heading by \n for line breaks
  const headingLines = heading.split('\\n')
  
  const allAgents = block.agents || []
  
  // Use fewer agents for compact variant
  const maxAgents = isCompact ? 5 : 8
  const agents = allAgents.slice(0, maxAgents)

  // Split bullet points into 2 columns
  const midPoint = Math.ceil(bulletPoints.length / 2)
  const leftBullets = bulletPoints.slice(0, midPoint)
  const rightBullets = bulletPoints.slice(midPoint)

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 lg:py-24">
      
      <div className="flex flex-col items-center justify-center relative w-full z-10">
        
        {/* --- Text & Button Section --- */}
        <div className={`flex flex-col items-center text-center px-6 mx-auto mb-12 lg:mb-0 
                        transition-all duration-300 ${isCompact ? 'max-w-2xl xl:max-w-4xl' : 'max-w-lg xl:max-w-3xl'}`}>
          
          {isCompact ? (
            <h2 className="font-serif italic text-3xl md:text-4xl lg:text-5xl text-[#1E3A2F] mb-6 tracking-tight">
              {headingLines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < headingLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </h2>
          ) : (
            <SectionHeading align="center" className="mb-8 tracking-tight">
              {headingLines.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < headingLines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </SectionHeading>
          )}

          {/* Description (compact variant) */}
          {isCompact && description && (
            <p className="text-[#1E3A2F] text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
              {description}
            </p>
          )}

          {/* Bullet Points (compact variant) */}
          {isCompact && bulletPoints.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 md:gap-12 text-left">
              <ul className="space-y-2">
                {leftBullets.map((bullet: { text: string; id?: string }, idx: number) => (
                  <li key={bullet.id || idx} className="flex items-start gap-2 text-[#1E3A2F]">
                    <span className="text-[#1E3A2F] mt-1.5">•</span>
                    <span className="text-sm md:text-base">{bullet.text}</span>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2">
                {rightBullets.map((bullet: { text: string; id?: string }, idx: number) => (
                  <li key={bullet.id || idx} className="flex items-start gap-2 text-[#1E3A2F]">
                    <span className="text-[#1E3A2F] mt-1.5">•</span>
                    <span className="text-sm md:text-base">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {buttonText && link.href && (
            <div className={isCompact ? 'mt-8' : ''}>
              <PrimaryButton
                href={link.href}
                openInNewTab={link.openInNewTab}
                disabled={link.disabled}
                className="font-bold py-4 px-10 rounded-full text-lg w-full md:w-auto"
              >
                {buttonText}
              </PrimaryButton>
            </div>
          )}
        </div>

        {/* --- MOBILE: Image Grid --- */}
        {agents.length > 0 && (
          <>
            <div className="flex lg:hidden flex-col gap-4 w-full mt-4">
              <div className="flex justify-center gap-4 min-w-[120%] -ml-[10%]">
                {agents.slice(0, isCompact ? 3 : 5).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className="flex justify-center gap-4">
                {agents.slice(isCompact ? 2 : 2, isCompact ? 5 : 6).map((agent) => (
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
              <div className={`flex gap-2 ${isCompact ? 'translate-x-[-60px]' : 'translate-x-[-40px]'}`}>
                {agents.slice(0, isCompact ? 2 : 3).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className={`flex gap-2 ${isCompact ? 'translate-x-[-100px]' : 'translate-x-[-80px]'}`}>
                {agents.slice(isCompact ? 1 : 2, isCompact ? 4 : 6).map((agent) => (
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
              <div className={`flex gap-2 ${isCompact ? 'translate-x-[90px]' : 'translate-x-[170px]'}`}>
                {agents.slice(isCompact ? 2 : 2, isCompact ? 4 : 5).map((agent) => (
                  <AgentCard 
                    key={agent.id} 
                    src={getImageUrl(agent.cardImage)} 
                    alt={agent.fullName || 'Agent'} 
                  />
                ))}
              </div>
              <div className={`flex gap-2 ${isCompact ? 'translate-x-[20px]' : 'translate-x-[80px]'}`}>
                {agents.slice(isCompact ? 3 : 4, isCompact ? 5 : 8).map((agent) => (
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
