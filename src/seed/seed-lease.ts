import type { Payload } from 'payload'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { existsSync } from 'fs'
import { getStyleId } from './seed-utils'

const filename = fileURLToPath(import.meta.url)
const dirname_path = dirname(filename)

/**
 * Helper function to get media ID by filename
 */
async function getMediaIdByFilename(
  payload: Payload,
  filename: string
): Promise<string | null> {
  try {
    const existing = await payload.find({
      collection: 'media',
      where: {
        filename: {
          equals: filename,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id
    }
    return null
  } catch (error) {
    console.error(`❌ Error finding media ${filename}:`, error)
    return null
  }
}

/**
 * Helper function to upload media file if it exists
 */
async function uploadMediaIfExists(
  payload: Payload,
  filePath: string,
  alt: string
): Promise<string | null> {
  try {
    if (!existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`)
      return null
    }

    const filename = filePath.split("/").pop() || filePath.split("\\").pop() || "unknown"
    
    // Check if already exists
    const existingId = await getMediaIdByFilename(payload, filename)
    if (existingId) {
      return existingId
    }

    const uploaded = await payload.create({
      collection: 'media',
      data: {
        alt,
      },
      filePath,
    })

    return uploaded.id
  } catch (error) {
    console.error(`❌ Error uploading media ${filePath}:`, error)
    return null
  }
}

/**
 * Helper function to get page ID by slug
 */
async function getPageIdBySlug(
  payload: Payload,
  slug: string
): Promise<string | null> {
  try {
    const existing = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return existing.docs[0].id
    }
    return null
  } catch (error) {
    console.error(`❌ Error finding page ${slug}:`, error)
    return null
  }
}

/**
 * Seeds the lease page
 * This function can be called from the main seed.ts or run independently
 */
export async function seedLeasePage(payload: Payload) {
  try {
    console.log("Seeding lease page...")

    // Get media IDs
    const laptopStickyNoteImageId = await getMediaIdByFilename(payload, "laptop-purple-sticky-note.jpg")
    const milamsMarketImageId = await getMediaIdByFilename(payload, "milams-market.jpg")

    // Try to upload if they don't exist
    const publicDir = join(dirname_path, "..", "..", "public")
    
    let finalLaptopImageId = laptopStickyNoteImageId
    if (!finalLaptopImageId) {
      const laptopImagePath = join(publicDir, "img", "laptop-purple-sticky-note.jpg")
      finalLaptopImageId = await uploadMediaIfExists(payload, laptopImagePath, "laptop-purple-sticky-note")
    }

    let finalMilamsImageId = milamsMarketImageId
    if (!finalMilamsImageId) {
      const milamsImagePath = join(publicDir, "img", "milams-market.jpg")
      finalMilamsImageId = await uploadMediaIfExists(payload, milamsImagePath, "milams-market")
    }

    // Get CSS style IDs
    const tanLinearStyleId = await getStyleId(payload, "tan-linear-background")
    const linearGradientStyleId = await getStyleId(payload, "linear-gradient-50white-50transparent")
    const background50StrongGreenId = await getStyleId(payload, "background-50strong_green-50transparent")

    // Get page ID for home page (referenced in links)
    const homePageId = await getPageIdBySlug(payload, "home")

    // Check if page with slug "lease" already exists
    const existing = await payload.find({
      collection: "pages",
      where: {
        slug: {
          equals: "lease",
        },
      },
      depth: 2,
      limit: 1,
    })

    const pageBlocks = [
      {
        blockType: "hero" as const,
        variant: "full-width-color" as const,
        headingSegments: [
          {
            text: "Space That",
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: "Works.",
            breakOnMobile: false,
            breakOnDesktop: false,
          },
          {
            text: "Strategy",
            color: "#DAE684",
            breakOnMobile: true,
            breakOnDesktop: false,
          },
          {
            text: "That Leads",
            color: "#DAE684",
            breakOnMobile: false,
            breakOnDesktop: false,
          },
        ],
        subheading: "Whether you're opening your first location or scaling across markets, Meybohm helps tenants find space that supports growth.",
        ctaPrimaryLabel: "Search Lease Opportunities",
        ctaPrimaryLinkType: "none" as const,
        ctaPrimaryOpenInNewTab: false,
        ctaSecondaryLabel: "Schedule a Stie Strategy Call",
        ctaSecondaryLinkType: "none" as const,
        ctaSecondaryOpenInNewTab: false,
      },
      {
        blockType: "container" as const,
        includeSpacing: false,
        cssStyles: background50StrongGreenId ? [background50StrongGreenId] : [],
        blocks: [
          {
            blockType: "propertySearchInput" as const,
          },
        ],
      },
      {
        blockType: "featuredProperties" as const,
        featuredPropertySetName: "default",
        heading: "Featured Properties",
        seeAllLink: "/property-search",
      },
      {
        blockType: "container" as const,
        includeSpacing: false,
        cssStyles: tanLinearStyleId ? [tanLinearStyleId] : [],
        blocks: [
          {
            blockType: "container" as const,
            includeSpacing: false,
            cssStyles: linearGradientStyleId ? [linearGradientStyleId] : [],
            blocks: [
              {
                blockType: "cardSection" as const,
                title: "When Space Becomes Strategy",
                description: "",
                buttonText: "Talk to a Tenant Rep",
                linkType: "none" as const,
                openInNewTab: false,
                cardTextAlign: "left" as const,
                cards: [
                  {
                    title: "Tenant Advocay",
                    icon: "fa-regular fa-handshake",
                    description: "Off-market access, timing insights.",
                  },
                  {
                    title: "Market Insight",
                    icon: "fa-regular fa-handshake",
                    description: "Neighborhood, foot traffic, zoning, ROI",
                  },
                  {
                    title: "Custom Fit",
                    icon: "fa-regular fa-handshake",
                    description: "We match business needs with real opportunity",
                  },
                ],
              },
            ],
          },
          {
            blockType: "flippedM" as const,
            heading: "A Process Built for Business Growth",
            subheading: "We'll make sure you never have to guess when navigating the complexities of leasing property.",
            bulletPoints: [
              {
                title: "Needs Discovery",
                description: "Detail your full list of needs so you're ready to search strategically.",
                linkType: "none" as const,
                openInNewTab: false,
              },
              {
                title: "Market Scan & Fit Analysis",
                description: "Comb through available options armed with detailed analytics.",
                linkType: "none" as const,
                openInNewTab: false,
              },
              {
                title: "Tour & Feasibility",
                description: "Tour potential sites and check them against your criteria.",
                linkType: "none" as const,
                openInNewTab: false,
              },
              {
                title: "Lease Negotiation",
                description: "Negotiate a lease that aligns with your business goals.",
                linkType: "none" as const,
                openInNewTab: false,
              },
              {
                title: "Move-in & Transition Support",
                description: "Move in to your new site and let us handle the logistics.",
                linkType: "none" as const,
                openInNewTab: false,
              },
            ],
            image: finalLaptopImageId,
            ctaText: "See How it Works",
            linkType: "page" as const,
            page: homePageId || undefined,
            openInNewTab: false,
          },
          {
            blockType: "splitSection" as const,
            image: finalMilamsImageId,
            imageAlt: "Section image",
            isReversed: false,
            header: "Purpose-Built Space—Delivered.",
            paragraph: "We support custom development and lease-up coordination through our in-house development team and partner network. ",
            bulletPoints: [
              {
                text: "Pad-ready land packages",
              },
              {
                text: "Retail strip planning",
              },
              {
                text: "Flex and warehouse use cases",
              },
            ],
            linkText: "Learn About Build-to-Suit",
            linkType: "page" as const,
            page: homePageId || undefined,
            openInNewTab: false,
          },
        ],
      },
      {
        blockType: "testimonialCarousel" as const,
        testimonialSetName: "default",
      },
      {
        blockType: "trackRecordSection" as const,
        heading: "Proven Track Record",
        provenTrackRecordSetName: "default",
      },
      {
        blockType: "propertySearch" as const,
        heading: "Local Insight. National Scale.",
        description: "From neighborhood retail to regional expansion, our leasing support scales with your business.",
        buttonText: "Explore Available Space",
        propertiesCount: "99 Properties For Sale in or near Aiken",
      },
      {
        blockType: "agentCarousel" as const,
        preHeading: "Meet Our Reps",
        heading: "Find the Right Tenant Rep",
        description: "Work with a committed partner who knows the industry in and out.",
        linkText: "Meet Our Leasing Team",
        linkType: "page" as const,
        page: homePageId || undefined,
        openInNewTab: false,
        featuredAgentSetName: "default",
      },
      {
        blockType: "ctaFooter" as const,
        heading: "Let's Find Space That Moves Your Business Forward.",
        buttons: [
          {
            label: "Start Property Search",
            linkType: "none" as const,
            openInNewTab: false,
            variant: "primary" as const,
          },
          {
            label: "Request Site Selection Help",
            linkType: "none" as const,
            openInNewTab: false,
            variant: "secondary" as const,
          },
          {
            label: "Get in Touch With a Broker",
            linkType: "none" as const,
            openInNewTab: false,
            variant: "secondary" as const,
          },
        ],
      },
      {
        blockType: "footer" as const,
      },
    ]

    if (existing.docs.length > 0) {
      console.log("Page with slug \"lease\" already exists. Updating...")

      await payload.update({
        collection: "pages",
        id: existing.docs[0].id,
        data: {
          title: "Lease",
          slug: "lease",
          blocks: pageBlocks,
        },
      })

      console.log("✅ Lease page updated successfully!")
    } else {
      console.log("Creating new lease page...")

      await payload.create({
        collection: "pages",
        data: {
          title: "Lease",
          slug: "lease",
          blocks: pageBlocks,
        },
      })

      console.log("✅ Lease page created successfully!")
    }
  } catch (error) {
    console.error("❌ Error seeding lease page:", error)
    throw error
  }
}

// Allow running this file directly: pnpm run seed:lease
// Check if this file is being run directly (not imported)
    const isMainModule = import.meta.url === `file://${process.argv[1]?.replace(/\\/g, "/")}` ||
                      process.argv[1]?.includes("seed-lease.ts") ||
                      process.argv[1]?.includes("seed-lease")

if (isMainModule) {
  import("dotenv/config").then(async () => {
    const { default: config } = await import("../payload.config")
    const { getPayload } = await import("payload")
    const { seedCSSStyles, seedNavbar } = await import("./seed-utils")
    
    const payload = await getPayload({ config })
    
    try {
      await seedCSSStyles(payload)
      await seedNavbar(payload)
      await seedLeasePage(payload)
      process.exit(0)
    } catch (error) {
      console.error("❌ Error:", error)
      process.exit(1)
    }
  })
}
