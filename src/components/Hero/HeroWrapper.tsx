import Hero from '../Hero'
import type { Page } from '@/payload-types'
import { getNavbarLinks } from '@/utils/navbar'
import type { ConstantLinksMap } from '@/utils/linkResolver'

type HeroBlock = Extract<Page['blocks'][number], { blockType: 'hero' }>

interface HeroWrapperProps {
  block: HeroBlock
  constantLinksMap?: ConstantLinksMap
}

export default async function HeroWrapper({ block, constantLinksMap }: HeroWrapperProps) {
  const { upperLinks, mainLinks, dropdownQuote } = await getNavbarLinks()

  return (
    <Hero
      block={block}
      upperLinks={upperLinks}
      mainLinks={mainLinks}
      dropdownQuote={dropdownQuote}
      constantLinksMap={constantLinksMap}
    />
  )
}

