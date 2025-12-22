import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Hero from '@/components/Hero'
import FlippedM from '@/components/FlippedM/FlippedM'
import Container from '@/components/Container/Container'
import type { Page as PageType } from '@/payload-types'

export default async function HomePage() {
  const payload = await getPayload({ config })
  
  // Fetch the page with slug 'home' or the first page if no slug matches
  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    depth: 2,
    limit: 1,
  })

  const page = docs[0] as PageType | undefined

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No home page found. Please create a page with slug &quot;home&quot; in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {page.blocks?.map((block, index) => {
        if (block.blockType === 'hero') {
          return <Hero key={index} block={block} />
        }
        if (block.blockType === 'flippedM') {
          return <FlippedM key={index} block={block} />
        }
        if (block.blockType === 'container') {
          return <Container key={index} block={block} />
        }
        return null
      })}
    </div>
  )
}
