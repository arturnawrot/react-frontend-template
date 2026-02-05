'use client'

import { Linkedin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Arrow from '../Arrow/Arrow'
import CopyableContactLink from '../CopyableContactLink'
import ResponsiveText from '../ResponsiveText/ResponsiveText'

interface AgentCardProps {
  name: string
  role: string
  license?: string
  image?: string | null
  variant?: 'horizontal' | 'vertical'
  servingLocations?: string[]
  serviceTags?: string[]
  email?: string | null
  phone?: string | null
  linkedin?: string | null
  slug?: string
}

export default function AgentCard({ 
  name, 
  role, 
  license, 
  image, 
  variant = 'vertical',
  servingLocations = [],
  serviceTags = [],
  email,
  phone,
  linkedin,
  slug
}: AgentCardProps) {
  const isVertical = variant === 'vertical'
  const agentHref = slug ? `/agents/${slug}` : '#'

  if (isVertical) {
    return (
      <div className="flex flex-col h-full">
        {/* Agent Image with Service Tags Overlay */}
        <div className="relative w-full aspect-[328/388] bg-gray-300 rounded-[16px] overflow-hidden mb-4">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={75}
              loading="lazy"
            />
          )}
          {serviceTags.length > 0 && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 z-10">
              {serviceTags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-[#F5F5F0] text-[#1C2B28] text-[10px] font-semibold px-2 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Agent Name */}
        <ResponsiveText
          as="h3"
          desktop="--headline1"
          mobile="--headline1"
          desktopLineHeight="40px"
          mobileLineHeight="40px"
          fontFamily="GT America Condensed"
          fontWeight={500}
          color="var(--strong-green)"
          letterSpacing="0px"
          className="mb-1"
        >
          {name}
        </ResponsiveText>
        
        {/* Agent Title */}
        <ResponsiveText
          as="p"
          desktop="--l"
          mobile="--l"
          desktopLineHeight="24px"
          mobileLineHeight="24px"
          fontFamily="GT America Condensed"
          fontWeight={500}
          color="var(--strong-green)"
          letterSpacing="0px"
          className="mb-3"
        >
          {role}
        </ResponsiveText>
        
        {/* Serving Locations */}
        {servingLocations.length > 0 && (
          <div className="mb-4">
            <ResponsiveText
              as="p"
              desktop="--xs"
              mobile="--xs"
              fontFamily="GT America Condensed"
              fontWeight={400}
              color="var(--strong-green)"
              letterSpacing="3px"
              className="uppercase mb-1"
            >
              SERVING
            </ResponsiveText>
            <ResponsiveText
              as="p"
              desktop="--l"
              mobile="--l"
              desktopLineHeight="24px"
              mobileLineHeight="24px"
              fontFamily="GT America Condensed"
              fontWeight={400}
              color="var(--strong-green)"
              letterSpacing="0px"
            >
              {servingLocations.join(', ')}
            </ResponsiveText>
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {email && (
            <CopyableContactLink
              type="email"
              value={email}
              className="flex items-center gap-2 font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[length:var(--l)] text-[rgba(28,47,41,1)] hover:opacity-70"
            />
          )}
          {linkedin && (
            <a 
              href={linkedin} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-2 font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[length:var(--l)] text-[rgba(28,47,41,1)] hover:opacity-70"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
          {phone && (
            <CopyableContactLink
              type="phone"
              value={phone}
              className="flex items-center gap-2 font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[length:var(--l)] text-[rgba(28,47,41,1)] hover:opacity-70"
            />
          )}
        </div>

        {/* Spacer to push View Bio to bottom */}
        <div className="flex-grow" />

        {/* View Bio Link */}
        <Link 
          href={agentHref} 
          className="mt-8 flex items-center gap-1 font-[GT_America_Condensed] font-normal leading-none text-[length:var(--l)] text-[rgba(28,47,41,1)] hover:opacity-70 group"
        >
          View Bio
          <Arrow direction="right" size="w-4 h-4" className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    )
  }

  // Horizontal variant
  return (
    <div className="flex gap-4 mb-6">
      {/* Agent Image Placeholder */}
      <div className="relative w-24 h-24 bg-gray-300 rounded-[16px] flex-shrink-0 overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="96px"
            quality={70}
            loading="lazy"
          />
        )}
      </div>
      
      <div className="flex flex-col justify-start">
        <h3 className="font-[GT_America_Condensed] font-medium text-lg text-[var(--strong-green)] leading-[40px] tracking-[0px]">{name}</h3>
        <p className="font-[GT_America_Condensed] font-medium text-xs text-[var(--strong-green)] leading-[24px] tracking-[0px]">{role}</p>
        
        <div className="flex items-center justify-between w-full mt-1">
          <Link href={agentHref} className="text-xs font-[GT_America_Condensed] font-normal leading-none text-[rgba(28,47,41,1)] hover:opacity-70 flex items-center gap-1 group">
            View Agent Profile 
            <Arrow direction="right" size="w-3 h-3" className="transition-transform group-hover:translate-x-1" />
          </Link>
          {license && <span className="text-[10px] font-[GT_America_Condensed] font-normal text-[var(--strong-green)] uppercase tracking-[3px] ml-4">{license}</span>}
        </div>

        <div className="flex gap-4 mt-3">
          {email && (
            <CopyableContactLink
              type="email"
              value={email}
              className="flex items-center gap-1 text-xs font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[rgba(28,47,41,1)] hover:opacity-70"
            />
          )}
          {phone && (
            <CopyableContactLink
              type="phone"
              value={phone}
              className="flex items-center gap-1 text-xs font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[rgba(28,47,41,1)] hover:opacity-70"
            />
          )}
          {linkedin && (
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-[GT_America_Condensed] font-normal leading-none tracking-normal text-[rgba(28,47,41,1)] hover:opacity-70">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
