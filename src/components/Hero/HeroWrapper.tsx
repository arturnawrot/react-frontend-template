import Hero from '../Hero'
import type { Page } from '@/payload-types'
import { getNavbarLinks } from '@/utils/navbar'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

interface HeroWrapperProps {
  block: HeroBlock
}

export default async function HeroWrapper({ block }: HeroWrapperProps) {
  const { upperLinks, mainLinks } = await getNavbarLinks()

  return <Hero block={block} upperLinks={upperLinks} mainLinks={mainLinks} />
}

