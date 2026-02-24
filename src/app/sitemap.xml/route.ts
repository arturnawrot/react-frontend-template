import { getPayload } from 'payload'
import config from '@payload-config'
import { buildoutApi } from '@/utils/buildout-api'
import { addressToSlug } from '@/utils/address-slug'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

function generateSitemapXml(urls: SitemapUrl[]): string {
  const urlEntries = urls
    .map((url) => {
      let entry = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`
      if (url.lastmod) {
        entry += `\n    <lastmod>${url.lastmod}</lastmod>`
      }
      if (url.changefreq) {
        entry += `\n    <changefreq>${url.changefreq}</changefreq>`
      }
      if (url.priority !== undefined) {
        entry += `\n    <priority>${url.priority.toFixed(1)}</priority>`
      }
      entry += '\n  </url>'
      return entry
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Fetch SEO settings
    const seoSettings = await payload.findGlobal({
      slug: 'seoSettings',
    })
    
    const sitemapConfig = seoSettings?.sitemapConfig
    
    // If sitemap is disabled, return 404
    if (!sitemapConfig?.enabled) {
      return new Response('Not Found', { status: 404 })
    }
    
    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000')
    
    const defaultChangeFreq = sitemapConfig.defaultChangeFrequency || 'weekly'
    const defaultPriority = sitemapConfig.defaultPriority || 0.5
    
    const urls: SitemapUrl[] = []
    
    // Add homepage
    urls.push({
      loc: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
    })
    
    // =====================
    // CMS Pages
    // =====================
    if (sitemapConfig.includePages) {
      try {
        const { docs: pages } = await payload.find({
          collection: 'pages',
          limit: 1000,
          depth: 0,
        })
        
        for (const page of pages) {
          // Skip "home" page as it's already the root
          if (page.slug === 'home') continue
          
          urls.push({
            loc: `${baseUrl}/${page.slug}`,
            lastmod: page.updatedAt ? formatDate(page.updatedAt) : undefined,
            changefreq: defaultChangeFreq,
            priority: 0.8,
          })
        }
      } catch (error) {
        console.error('Error fetching pages for sitemap:', error)
      }
    }
    
    // =====================
    // Agents
    // =====================
    if (sitemapConfig.includeAgents) {
      try {
        const { docs: agents } = await payload.find({
          collection: 'agents',
          limit: 1000,
          depth: 0,
        })
        
        for (const agent of agents) {
          if (!agent.slug) continue
          
          urls.push({
            loc: `${baseUrl}/agents/${agent.slug}`,
            lastmod: agent.updatedAt ? formatDate(agent.updatedAt) : undefined,
            changefreq: 'weekly',
            priority: 0.7,
          })
        }
      } catch (error) {
        console.error('Error fetching agents for sitemap:', error)
      }
    }
    
    // =====================
    // Properties (from Buildout API)
    // =====================
    if (sitemapConfig.includeProperties) {
      try {
        const propertiesResponse = await buildoutApi.getAllProperties()
        
        for (const property of propertiesResponse.properties) {
          // Only include published listings
          const isPublished = 
            (property.sale && property.sale_listing_published) || 
            (property.lease && property.lease_listing_published)
          
          if (!isPublished) continue
          
          // Use address to create slug
          const address = property.address || property.name
          if (!address) continue
          
          const slug = addressToSlug(address)
          
          urls.push({
            loc: `${baseUrl}/property/${slug}`,
            lastmod: property.updated_at ? formatDate(property.updated_at) : undefined,
            changefreq: 'weekly',
            priority: 0.6,
          })
        }
      } catch (error) {
        console.error('Error fetching properties for sitemap:', error)
      }
    }
    
    // =====================
    // Blogs (Articles, Market Reports, Investment Spotlights)
    // =====================
    if (sitemapConfig.includeBlogs) {
      try {
        const { docs: blogs } = await payload.find({
          collection: 'blogs',
          limit: 1000,
          depth: 0,
        })
        
        for (const blog of blogs) {
          if (!blog.slug || !blog.type) continue
          
          // Map type to URL path
          const typePathMap: Record<string, string> = {
            'article': 'article',
            'market-report': 'market-report',
            'investment-spotlight': 'investment-spotlight',
          }
          
          const path = typePathMap[blog.type] || 'article'
          
          urls.push({
            loc: `${baseUrl}/${path}/${blog.slug}`,
            lastmod: blog.updatedAt ? formatDate(blog.updatedAt) : undefined,
            changefreq: 'monthly',
            priority: 0.7,
          })
        }
        
        // Add blog listing pages
        urls.push({
          loc: `${baseUrl}/blog/all`,
          changefreq: 'weekly',
          priority: 0.6,
        })
      } catch (error) {
        console.error('Error fetching blogs for sitemap:', error)
      }
    }
    
    // =====================
    // Jobs
    // =====================
    if (sitemapConfig.includeJobs) {
      try {
        const { docs: jobs } = await payload.find({
          collection: 'jobs',
          limit: 1000,
          depth: 0,
        })
        
        for (const job of jobs) {
          if (!job.slug) continue
          
          urls.push({
            loc: `${baseUrl}/jobs/${job.slug}`,
            lastmod: job.updatedAt ? formatDate(job.updatedAt) : undefined,
            changefreq: 'weekly',
            priority: 0.6,
          })
        }
      } catch (error) {
        console.error('Error fetching jobs for sitemap:', error)
      }
    }
    
    // =====================
    // Static Pages
    // =====================
    if (sitemapConfig.includeStaticPages) {
      // Property Search page
      urls.push({
        loc: `${baseUrl}/property-search`,
        changefreq: 'daily',
        priority: 0.9,
      })
      
      // Saved Properties page
      urls.push({
        loc: `${baseUrl}/saved-properties`,
        changefreq: 'weekly',
        priority: 0.5,
      })
      
      // Agents listing page (main agents directory)
      urls.push({
        loc: `${baseUrl}/agents`,
        changefreq: 'weekly',
        priority: 0.8,
      })
      
      // Jobs listing page
      urls.push({
        loc: `${baseUrl}/jobs`,
        changefreq: 'weekly',
        priority: 0.7,
      })
    }
    
    // Generate sitemap XML
    const sitemapXml = generateSitemapXml(urls)
    
    return new Response(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Return minimal sitemap as fallback
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <priority>1.0</priority>
  </url>
</urlset>`
    
    return new Response(fallbackSitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    })
  }
}
