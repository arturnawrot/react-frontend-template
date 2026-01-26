import Hero from '../Hero'
import type { Page } from '@/payload-types'
import { getNavbarLinks } from '@/utils/navbar'
import { getConstantLinksMap } from '@/utils/linkResolver'
import { getPayload } from 'payload'
import config from '@payload-config'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

interface HeroWrapperProps {
  block: HeroBlock
}

export default async function HeroWrapper({ block }: HeroWrapperProps) {
  const { upperLinks, mainLinks } = await getNavbarLinks()
  
  // Fetch constant links for resolving constant link types
  const payload = await getPayload({ config })
  const constantLinksMap = await getConstantLinksMap(payload)

  return <Hero block={block} upperLinks={upperLinks} mainLinks={mainLinks} constantLinksMap={constantLinksMap} />
}

