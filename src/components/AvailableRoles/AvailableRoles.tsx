'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Job } from '@/payload-types'
import SectionHeading from '@/components/SectionHeading/SectionHeading'
import Container from '../Container/Container'

interface AvailableRolesBlock {
  availableJobSetName?: string | null
  id?: string | null
  blockName?: string | null
  blockType: 'availableRoles'
  jobs?: Job[]
}

interface AvailableRolesProps {
  block: AvailableRolesBlock
}

export default function AvailableRoles({ block }: AvailableRolesProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const jobs = block.jobs || []

  const toggleJob = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Handle empty jobs
  if (jobs.length === 0) {
    return (
      <section className="w-full py-16">
        <div className="text-center">
          <p className="text-gray-500">No available roles at this time. Please check back later.</p>
        </div>
      </section>
    )
  }

  return (
    <Container>
      <SectionHeading as="h2" className="text-[var(--strong-green)] mb-10">
        Available Roles
      </SectionHeading>

      <div className="space-y-0">
        {jobs.map((job, index) => {
          const isOpen = openIndex === index

          return (
            <div key={job.id || index} className="border-b border-gray-200 first:border-t">
              <div
                className="flex items-center py-5 cursor-pointer"
                onClick={() => toggleJob(index)}
              >
                {job.slug ? (
                  <Link
                    href={`/jobs/${job.slug}`}
                    className="text-[var(--strong-green)] text-lg font-medium hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {job.title}
                  </Link>
                ) : (
                  <span className="text-[var(--strong-green)] text-lg font-medium">
                    {job.title}
                  </span>
                )}
                <span className="flex-1" />
                <span className="text-[var(--strong-green)] text-2xl font-light flex-shrink-0">
                  {isOpen ? '−' : '+'}
                </span>
              </div>

              {isOpen && (
                <div className="pb-6 pr-12">
                  {/* Job details */}
                  <div className="space-y-3 mb-6">
                    {job.department && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Department:</span>
                        <span>{job.department}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Location:</span>
                        <span>{job.location}</span>
                      </div>
                    )}
                    {job.employmentType && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Type:</span>
                        <span className="capitalize">{job.employmentType.replace('-', ' ')}</span>
                      </div>
                    )}
                    {job.reportsTo && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Reports To:</span>
                        <span>{job.reportsTo}</span>
                      </div>
                    )}
                  </div>

                  {/* See more link */}
                  {job.slug && (
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="inline-block bg-[var(--strong-green)] text-white font-medium px-4 py-2 text-sm rounded-lg hover:opacity-90 transition-opacity"
                    >
                      See more...
                    </Link>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Container>
  )
}
