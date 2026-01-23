import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'
import config from '@/payload.config'
import LexicalRenderer from '@/components/LexicalRenderer/LexicalRenderer'
import type { Job } from '@/payload-types'
import ShareButtons from '@/components/ShareButtons/ShareButtons'
import JobApplicationForm from '@/components/JobApplicationForm/JobApplicationForm'

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

  // Format employment type for display
  const formatEmploymentType = (type: string | undefined) => {
    if (!type) return ''
    return type
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('-')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
  )
}

