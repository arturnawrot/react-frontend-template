import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const payload = await getPayload({ config })
    
    // Fetch SEO settings
    const seoSettings = await payload.findGlobal({
      slug: 'seoSettings',
    })
    
    const robotsConfig = seoSettings?.robotsConfig
    
    // If robots.txt is disabled, return 404
    if (!robotsConfig?.enabled) {
      return new Response('Not Found', { status: 404 })
    }
    
    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                   process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                   'http://localhost:3000'
    
    // Start with custom content
    let robotsTxt = robotsConfig.content || ''
    
    // Add sitemap reference if sitemap is enabled
    const sitemapConfig = seoSettings?.sitemapConfig
    if (sitemapConfig?.enabled) {
      // Ensure there's a newline before adding sitemap
      if (robotsTxt && !robotsTxt.endsWith('\n')) {
        robotsTxt += '\n'
      }
      robotsTxt += `\n# Sitemap\nSitemap: ${baseUrl}/sitemap.xml`
    }
    
    return new Response(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Error generating robots.txt:', error)
    
    // Return a basic robots.txt as fallback
    return new Response(
      `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain',
        },
      }
    )
  }
}
