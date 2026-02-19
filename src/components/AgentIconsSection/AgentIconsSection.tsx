import React from 'react'
import Image from 'next/image'
import type { Page, Media } from '@/payload-types'
import { resolveLink, resolvePrefixedLink } from '@/utils/linkResolver'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import PrimaryButton from '@/components/PrimaryButton'
import ArrowLink from '@/components/ArrowLink/ArrowLink'

type AgentIconsSectionBlock = Extract<Page['blocks'][number], { blockType: 'agentIconsSection' }>

interface Agent {
  id: string
  firstName: string
  lastName: string
  fullName?: string | null
  slug?: string
  cardImage?: Media | string | null
}

interface AgentIconsSectionProps {
  block: AgentIconsSectionBlock & {
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

export default function AgentIconsSection({ block }: AgentIconsSectionProps) {
  const header = block.header || ''
  const paragraph = block.paragraph || ''
  const buttonText = (block as any).buttonText
  const buttonLink = resolvePrefixedLink(block as Record<string, unknown>, 'button')
  const linkText = block.linkText
  const arrowLink = resolveLink(block as any)
  
  const allAgents = block.agents || []
  
  // --- Data Slicing ---
  const desktopRow1 = allAgents.slice(0, 4)
  const desktopRow2 = allAgents.slice(4, 9)
  const desktopRow3 = allAgents.slice(9, 13)
  
  // Mobile: First 6 then next 7 (as per your snippet)
  const mobileRow1 = allAgents.slice(0, 6)
  const mobileRow2 = allAgents.slice(6, 13)

  // --- Reusable Card ---
  const AgentCard = ({ agent, sizeClass }: { agent: Agent, sizeClass: string }) => (
    <div className={`z-11 relative flex-shrink-0 ${sizeClass}`}>
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-transform duration-300 hover:z-10 hover:scale-105">
        <Image
          src={getImageUrl(agent.cardImage)}
          alt={agent.fullName || "Agent"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 25vw, 15vw"
          loading="lazy"
          quality={50}
        />
      </div>
    </div>
  )

  return (
    // 'overflow-hidden' on the SECTION is critical to handle the negative margins safely
    <section className="w-full overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        
        <div className="flex flex-col gap-10 md:flex-row md:items-center">
          
          {/* 
             LEFT COLUMN WRAPPER 
             
             1. md:w-[50vw] -> Sets width to exactly half the viewport.
             2. md:ml-[calc(50%-50vw)] -> The Magic Calculation.
                - 50% is the center of the container.
                - 50vw is the distance from the center of the screen to the left edge.
                - Subtracting them forces the element's left edge to touch the browser window.
          */}
          <div className="w-full md:w-[50vw] md:ml-[calc(90%-90vw)]">
            
            {/* --- MOBILE LAYOUT (< md) --- */}
            {/* 
                Same logic here: 'w-screen' ensures full width, 
                and 'ml-[calc(50%-50vw)]' pulls it to the edge properly.
            */}
            <div className="flex w-screen ml-[calc(50%-50vw)] flex-col gap-2 md:hidden">
              
              {/* Row 1: Starts 10px from left */}
              <div className="flex w-full gap-1">
                {mobileRow1.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    // Calculation ensures items fit within the viewport width minus the indentation
                    sizeClass="w-[calc((100vw-10px-3rem)/4)]" 
                  />
                ))}
              </div>

              {/* Row 2: Starts 20px from left */}
              <div className="flex w-full gap-1">
                {mobileRow2.map(agent => (
                  <AgentCard 
                    key={agent.id} 
                    agent={agent} 
                    sizeClass="w-[calc((100vw-20px-3rem)/4)]" 
                  />
                ))}
              </div>

            </div>

            {/* --- DESKTOP LAYOUT (>= md) --- */}
            <div className="hidden flex-col gap-2 md:flex">
              
              {/* Row 1: 4 Agents */}
              <div className="flex justify-center gap-2">
                {desktopRow1.map((agent) => (
                  <AgentCard key={agent.id} agent={agent} sizeClass="w-[calc((100%-2rem)/5)]" />
                ))}
              </div>

              {/* Row 2: 5 Agents */}
              <div className="flex justify-center gap-2">
                {desktopRow2.map((agent) => (
                   <AgentCard key={agent.id} agent={agent} sizeClass="w-[calc((100%-2rem)/5)]" />
                ))}
              </div>

              {/* Row 3: 4 Agents */}
              <div className="flex justify-center gap-2">
                {desktopRow3.map((agent) => (
                   <AgentCard key={agent.id} agent={agent} sizeClass="w-[calc((100%-2rem)/5)]" />
                ))}
              </div>

            </div>
          </div>

           {/* RIGHT COLUMN: Content */}
           <div className="w-full md:w-[40vw] md:ml-[calc(10%-10vw)] flex md:justify-end">
             <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-[480px]">
               <SectionHeading>
                 {header}
               </SectionHeading>
               
               {paragraph && (
                 <p 
                   className="text-[#1a2e2a]"
                   style={{
                     fontFamily: '"GT America Condensed", sans-serif',
                     fontWeight: 400,
                     fontSize: 'var(--xl)',
                     lineHeight: '27px',
                     letterSpacing: '0px',
                   }}
                 >
                   {paragraph}
                 </p>
               )}

               {(buttonText && buttonLink.href) || (linkText && arrowLink.href) ? (
                 <div className="pt-2 sm:pt-3 md:pt-4 flex flex-col gap-3 md:gap-4 max-w-[325px]">
                   {buttonText && buttonLink.href && (
                     <PrimaryButton
                       href={buttonLink.href}
                       openInNewTab={buttonLink.openInNewTab}
                       disabled={buttonLink.disabled}
                       fullWidth
                     >
                       {buttonText}
                     </PrimaryButton>
                   )}
                   {linkText && arrowLink.href && (
                    <div className="mt-5">
                      <ArrowLink href={arrowLink.href} openInNewTab={arrowLink.openInNewTab} disabled={arrowLink.disabled}>
                        {linkText}
                      </ArrowLink>
                    </div>
                   )}
                 </div>
               ) : null}
             </div>
           </div>

        </div>
      </div>
    </section>
  )
}