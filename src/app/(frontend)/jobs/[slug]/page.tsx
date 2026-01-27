import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import type { Job } from '@/payload-types'
import ShareButtons from '@/components/ShareButtons/ShareButtons'
import JobApplicationForm from '@/components/JobApplicationForm/JobApplicationForm'
import NavbarWrapper from '@/components/Navbar/NavbarWrapper'
import AgentIconsSection from '@/components/AgentIconsSection/AgentIconsSection'
import Link from 'next/link'
import Arrow from '@/components/Arrow/Arrow'
import CTAFooter from '@/components/CTAFooter/CTAFooter'
import Footer from '@/components/Footer/Footer'
import Container from '@/components/Container/Container'

// Mark as dynamic to prevent build-time prerendering (requires MongoDB connection)
export const dynamic = 'force-dynamic'

interface JobPageProps {
  params: Promise<{ slug: string }>
}

export default async function JobPage({ params }: JobPageProps) {
  const { slug } = await params

  const payload = await getPayload({ config })

  // Fetch the job by slug
  const { docs } = await payload.find({
    collection: 'jobs',
    where: {
      slug: {
        equals: slug,
      },
    },
    depth: 2,
    limit: 1,
  })

  const job = docs[0] as Job | undefined

  if (!job) {
    notFound()
  }

  // Fetch agents for AgentDecoration section
  let agents: Array<{
    id: string
    firstName: string
    lastName: string
    fullName?: string | null
    slug?: string
    cardImage?: any
  }> = []

  try {
    const global = await payload.findGlobal({
      slug: 'agentIconsSets',
      depth: 2,
    })

    if (global?.sets && Array.isArray(global.sets)) {
      const set = (global.sets as Array<{ name: string; agents?: any[] }>).find((s) => s.name === 'default')

      if (set?.agents && Array.isArray(set.agents)) {
        agents = set.agents
          .map((agent: any) => {
            if (typeof agent === 'string') return null
            return {
              id: agent.id,
              firstName: agent.firstName,
              lastName: agent.lastName,
              fullName: agent.fullName || `${agent.firstName} ${agent.lastName}`,
              slug: agent.slug,
              cardImage: agent.cardImage || agent.backgroundImage,
            }
          })
          .filter((agent): agent is NonNullable<typeof agent> => agent !== null)
      }
    }
  } catch (error) {
    console.error('[JobPage] Error fetching agent icons:', error)
  }

  // Format employment type for display
  const formatEmploymentType = (type: string | undefined) => {
    if (!type) return ''
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')
  }

  return (
    <>
    <div className="bg-transparent md:bg-[var(--strong-green)]">
        <NavbarWrapper darkVariant={true} />
    </div>
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back to Careers Link */}
        <Link 
          href="/careers" 
          className="inline-flex items-center gap-2 text-[#1C2F29] hover:opacity-70 transition-opacity mb-8 text-sm font-medium uppercase tracking-wider"
        >
          <Arrow direction="left" size={12} />
          Back to Careers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Title */}
            <h1 className="text-4xl md:text-5xl font-serif text-[#1C2F29] mb-8">
              {job.title}
            </h1>

            {/* Job Details */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C2F29] mb-4">Job Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-sans">Department:</span>
                  <span className="text-gray-900 font-sans font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-sans">Location:</span>
                  <span className="text-gray-900 font-sans font-medium">{job.location}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <span className="text-gray-600 font-sans">Employment Type:</span>
                  <span className="text-gray-900 font-sans font-medium">
                    {formatEmploymentType(job.employmentType)}
                  </span>
                </div>
                {job.reportsTo && (
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-sans">Reports To:</span>
                    <span className="text-gray-900 font-sans font-medium">{job.reportsTo}</span>
                  </div>
                )}
                {/* Custom Fields - inline with other job details */}
                {job.customFields && Array.isArray(job.customFields) && job.customFields.map((field, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-sans">{field.label}:</span>
                    <span className="text-gray-900 font-sans font-medium">{field.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Job Description */}
            <section>
              <h2 className="text-2xl font-serif text-[#1C2F29] mb-4">Job Description</h2>
              <div className="prose prose-lg max-w-none text-gray-700 font-sans">
                {job.jobDescription ? (
                  <LexicalRenderer content={job.jobDescription as any} />
                ) : (
                  <p className="text-gray-500 italic">No content available.</p>
                )}
              </div>
            </section>
          </div>

          {/* Right Column - CTA and Share */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-sans font-semibold text-[#1C2F29] mb-4">
                  Interested in This Job?
                </h3>
                {job.applyUrl ? (
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-[#DAE684] hover:bg-[#c5d073] text-[#1C2F29] font-bold font-sans text-center py-3 px-6 rounded-lg transition-colors mb-6"
                  >
                    Apply Now
                  </a>
                ) : (
                  <div className="mb-6">
                    <JobApplicationForm jobId={job.id} jobTitle={job.title || ''} />
                  </div>
                )}

                <ShareButtons title={job.title || ''} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Grow With a Team Section */}
    <div className="mb-16 md:mb-24">
      <AgentIconsSection 
        block={{
          blockType: 'agentIconsSection',
          agentIconsSetName: 'default',
          header: "Grow With a Team That's Going Places",
          paragraph: "We're always looking for professionals who think strategically, act decisively, and put clients first.",
          linkText: 'Explore Careers',
          linkType: 'custom',
          customUrl: '/careers',
          openInNewTab: false,
          agents,
        } as any}
      />
    </div>


    {/* Explore More Opportunities Section */}
    
    <CTAFooter 
      block={{
        blockType: 'ctaFooter',
        heading: 'Explore More Opportunities',
        subheading: 'View other open roles across Meybohm Commercial and join a team shaping the future of real estate in the Southeast.',
        buttons: [
          {
            label: 'Careers',
            linkType: 'custom',
            customUrl: '/careers',
            openInNewTab: false,
            variant: 'primary',
          },
          {
            label: 'Contact Us',
            linkType: 'custom',
            customUrl: '/contact',
            openInNewTab: false,
            variant: 'secondary',
          },
        ],
      }}
    />

    {/* Footer */}
    <Footer />
    </>
  )
}

