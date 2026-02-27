'use client'

import { Linkedin } from 'lucide-react'
import type { SerializedEditorState } from 'lexical'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import PrimaryButton from '@/components/PrimaryButton'
import CopyableContactLink from '@/components/CopyableContactLink'
import type { ResolvedLink } from '@/utils/linkResolver'

type AboutAgentProps = {
  agentFirstName?: string
  paragraphs?: string[]
  serving?: string[]
  specialties?: string[]
  roles?: string[]
  email?: string
  phone?: string
  linkedin?: string
  about?: SerializedEditorState | null
  consultationLink?: ResolvedLink | null
}

export default function AboutAgent({
  agentFirstName = 'Agent',
  paragraphs = [],
  serving = [],
  specialties = [],
  roles = [],
  email,
  phone,
  linkedin,
  about,
  consultationLink,
}: AboutAgentProps) {
  const hasConsultationLink = !!consultationLink?.href
  return (
    <section className="w-full pt-20 md:pt-24 pb-16 md:pb-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left Column - Main Content */}
          <div className="flex-1">
            <h2 className="text-5xl md:text-6xl font-serif text-[#1a2e2a] mb-8 leading-tight">
              About {agentFirstName}
            </h2>
            <div className="space-y-6 text-[#1a2e2a]">
              {about ? (
                <LexicalRenderer content={about} />
              ) : paragraphs.length > 0 ? (
                paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed font-sans">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-lg leading-relaxed font-sans text-gray-500 italic">
                  No about information available.
                </p>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-[#F5F3F0] rounded-2xl p-8">
              {/* SERVING Section */}
              {serving.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                    SERVING
                  </p>
                  <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                    {serving.join(', ')}
                  </p>
                  <div className="border-t border-gray-300 mt-6"></div>
                </div>
              )}

              {/* SPECIALTIES Section */}
              {specialties.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                    SPECIALTIES
                  </p>
                  <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                    {specialties.join(', ')}
                  </p>
                  <div className="border-t border-gray-300 mt-6"></div>
                </div>
              )}

              {/* ROLES Section */}
              {roles.length > 0 && (
                <div className="mb-8">
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-3 font-sans font-medium">
                    ROLES
                  </p>
                  <p className="text-lg font-bold text-[#1a2e2a] font-sans">
                    {roles.join(', ')}
                  </p>
                  <div className="border-t border-gray-300 mt-6"></div>
                </div>
              )}

              {/* Contact Information */}
              {(email || phone || linkedin) && (
                <div className="mb-8">
                  <div className="flex flex-wrap gap-6">
                    {email && (
                      <CopyableContactLink
                        type="email"
                        value={email}
                        className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                      />
                    )}
                    {phone && (
                      <CopyableContactLink
                        type="phone"
                        value={phone}
                        className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                      />
                    )}
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-sans text-[#1a2e2a] hover:opacity-70 transition-opacity"
                      >
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Schedule A Consultation Button */}
              {hasConsultationLink && (
                <PrimaryButton
                  link={consultationLink}
                  className="font-semibold rounded-full px-8 py-3 text-base text-center font-sans"
                  fullWidth
                >
                  Schedule A Consultation
                </PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

