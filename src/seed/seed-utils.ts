import type { Payload } from 'payload'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const filename = fileURLToPath(import.meta.url)
const _dirname_path = dirname(filename)

/**
 * Seeds CSS styles that are common across all pages
 */
export async function seedCSSStyles(payload: Payload) {
  const cssStyles = [
    {
      name: 'Sand Gradient',
      cssClass: 'sand-gradient-background',
      css: `.sand-gradient-background {
  background: radial-gradient(97.87% 101.48% at 97.87% 11.48%, rgba(215, 209, 196, 0.7) 0%, rgba(215, 209, 196, 0.0121075) 72.23%, rgba(215, 209, 196, 0) 100%);
}`,
      active: true,
    },
    {
      name: 'Tan Linear Background',
      cssClass: 'tan-linear-background',
      css: `.tan-linear-background {
  background: linear-gradient(
    360deg,
    rgba(210, 167, 129, 0) 40%,
    rgba(217, 161, 113, 0.1) 100%
  );
}`,
      active: true,
    },
    {
      name: 'Flipped M Background',
      cssClass: 'flipped-m-background',
      css: `.flipped-m-background {
  background: linear-gradient(
    0deg,
    rgba(217, 161, 113, 0) 0%,
    rgba(217, 161, 113, 0.1) 100%
  );
}`,
      active: true,
    },
    {
      name: '-mt-100',
      cssClass: '-mt-100',
      css: `.-mt-100 {
  margin-top: -100px;
}`,
      active: true,
    },
    {
      name: '-mb-300',
      cssClass: '-mb-300',
      css: `.-mb-300 {
  margin-bottom: -300px;
}`,
      active: true,
    },
    {
      name: 'linear-gradient-50white-50transparent',
      cssClass: 'linear-gradient-50white-50transparent',
      css: `.linear-gradient-50white-50transparent {
  background: linear-gradient(to bottom, #ffffff 50%, transparent 50%);
}`,
      active: true,
    },
    {
      name: 'background-50strong_green-50transparent',
      cssClass: 'background-50strong_green-50transparent',
      css: `.background-50strong_green-50transparent {
  background: linear-gradient(to bottom, var(--strong-green) 50%, transparent 50%);
}`,
      active: true,
    },
    {
      name: 'wet-sand-background',
      cssClass: 'wet-sand-background',
      css: `.wet-sand-background {
  background-color: #dad6cc;
}`,
      active: true,
    },
  ]

  for (const styleData of cssStyles) {
    const existing = await payload.find({
      collection: 'css-styles',
      where: {
        cssClass: {
          equals: styleData.cssClass,
        },
      },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'css-styles',
        data: styleData,
      })
      console.log(`✅ Created CSS style: ${styleData.name}`)
    } else {
      console.log(`⏭️  CSS style already exists: ${styleData.name}`)
    }
  }
}

/**
 * Gets a CSS style ID by class name
 */
export async function getStyleId(payload: Payload, cssClass: string): Promise<string | null> {
  const style = await payload.find({
    collection: 'css-styles',
    where: {
      cssClass: {
        equals: cssClass,
      },
    },
    limit: 1,
  })

  if (style.docs.length > 0) {
    return style.docs[0].id
  } else {
    console.error(`❌ CSS style not found: ${cssClass}`)
    return null
  }
}

/**
 * Seeds the navbar global
 */
export async function seedNavbar(payload: Payload) {
  console.log('Seeding navbar...')
  
  // Find pages by slug for mainLinks
  const pageSlugs = ['buy', 'lease', 'sell', 'our-agents', 'our-advantage', 'our-services']
  const pages = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        in: pageSlugs,
      },
    },
    limit: 100,
  })

  // Create a map of slug to page ID
  const pageMap = new Map<string, string>()
  pages.docs.forEach((page) => {
    if (page.slug) {
      pageMap.set(page.slug, page.id)
    }
  })

  // Warn about missing pages
  for (const slug of pageSlugs) {
    if (!pageMap.has(slug)) {
      console.warn(`⚠️  Page with slug "${slug}" not found. Navbar link will be skipped or use fallback.`)
    }
  }

  // Helper to create a main link - uses page if available, falls back to custom URL
  const createMainLink = (
    label: string,
    slug: string,
    fallbackUrl: string
  ): { label: string; linkType: 'page' | 'custom'; page?: string; customUrl?: string } => {
    const pageId = pageMap.get(slug)
    if (pageId) {
      return {
        label,
        linkType: 'page' as const,
        page: pageId,
      }
    } else {
      console.warn(`⚠️  Using custom URL fallback for "${label}" (page "${slug}" not found)`)
      return {
        label,
        linkType: 'custom' as const,
        customUrl: fallbackUrl,
      }
    }
  }

  const navbarData = {
    upperLinks: [
      {
        label: 'Schedule',
        linkType: 'custom' as const,
        customUrl: '/schedule',
      },
      {
        label: 'Contact Us',
        linkType: 'custom' as const,
        customUrl: '/contact',
      },
      {
        label: 'Login',
        linkType: 'custom' as const,
        customUrl: '/login',
      },
    ],
    mainLinks: [
      createMainLink('Buy', 'buy', '/buy'),
      createMainLink('Lease', 'lease', '/lease'),
      createMainLink('Sell', 'sell', '/sell'),
      createMainLink('Our Agents', 'our-agents', '/agents'),
      createMainLink('Our Advantages', 'our-advantage', '/advantages'),
      createMainLink('Our Services', 'our-services', '/services'),
      {
        label: 'Insights & Research',
        linkType: 'custom' as const,
        customUrl: '/insights',
      },
    ],
  }

  try {
    await payload.updateGlobal({
      slug: 'navbar',
      data: navbarData,
    })
    console.log('✅ Navbar seeded successfully!')
  } catch (error) {
    console.log('Navbar global not found, creating...')
    try {
      await payload.updateGlobal({
        slug: 'navbar',
        data: navbarData,
      })
      console.log('✅ Navbar created and seeded successfully!')
    } catch (createError) {
      console.error('❌ Error creating navbar:', createError)
    }
  }
}

/**
 * Seeds the footer global
 */
export async function seedFooter(payload: Payload) {
  console.log('Seeding footer...')

  const footerData = {
    navigationColumns: [
      // Column 1: Property Focus
      {
        links: [
          {
            label: 'Buy',
            linkType: 'custom' as const,
            customUrl: '/buy',
          },
          {
            label: 'Lease',
            linkType: 'custom' as const,
            customUrl: '/lease',
          },
          {
            label: 'Sell',
            linkType: 'custom' as const,
            customUrl: '/sell',
          },
          {
            label: 'Insights & Research',
            linkType: 'custom' as const,
            customUrl: '/insights',
          },
        ],
      },
      // Column 2: Company Focus
      {
        links: [
          {
            label: 'Our Agents',
            linkType: 'custom' as const,
            customUrl: '/agents',
          },
          {
            label: 'Our Advantage',
            linkType: 'custom' as const,
            customUrl: '/advantages',
          },
          {
            label: 'Our Services',
            linkType: 'custom' as const,
            customUrl: '/services',
          },
          {
            label: 'Our Company',
            linkType: 'custom' as const,
            customUrl: '/company',
          },
        ],
      },
      // Column 3: User Interaction
      {
        links: [
          {
            label: 'Account Login',
            linkType: 'custom' as const,
            customUrl: '/login',
          },
          {
            label: 'Contact Us',
            linkType: 'custom' as const,
            customUrl: '/contact',
          },
          {
            label: 'Schedule a Tour / Consultation',
            linkType: 'custom' as const,
            customUrl: '/schedule',
          },
        ],
      },
    ],
    offices: [
      // Augusta Office
      {
        label: 'Office',
        address: '3519 Wheeler Road,\nAugusta, GA 30909',
        phone: '706.736.0700',
        fax: '706.736.5363',
      },
      // Aiken Office
      {
        label: 'Office',
        address: '142 Laurens Street NW,\nAiken, SC 29801',
        phone: '803.644.1770',
        tollFree: '800.241.9726',
      },
    ],
    socialMedia: {
      facebook: '#',
      linkedin: '#',
    },
    bottomBar: {
      copyrightText: '© 2025 Real Estate Co. All rights reserved.',
      policyLinks: [
        {
          label: 'Accessibility',
          linkType: 'custom' as const,
          customUrl: '#',
        },
        {
          label: 'Privacy Policy',
          linkType: 'custom' as const,
          customUrl: '#',
        },
        {
          label: 'Terms of Service',
          linkType: 'custom' as const,
          customUrl: '#',
        },
        {
          label: 'Cookies Settings',
          linkType: 'custom' as const,
          customUrl: '#',
        },
      ],
    },
  }

  try {
    await payload.updateGlobal({
      slug: 'footer',
      data: footerData,
    })
    console.log('✅ Footer seeded successfully!')
  } catch (error) {
    console.log('Footer global not found, creating...')
    try {
      await payload.updateGlobal({
        slug: 'footer',
        data: footerData,
      })
      console.log('✅ Footer created and seeded successfully!')
    } catch (createError) {
      console.error('❌ Error creating footer:', createError)
    }
  }
}

