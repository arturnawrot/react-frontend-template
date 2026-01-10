import type { Endpoint } from 'payload'
import { APIError } from 'payload'
import { seedCSSStyles, seedNavbar, seedFooter } from '../seed/seed-utils'
import { seedHomePage } from '../seed/seed-home'
import { seedBuyPage } from '../seed/seed-buy'
import { seedBrokers } from '../seed/seed-brokers'
import { seedFeaturedAgents } from '../seed/seed-featured-agents'

export const seedEndpoint: Endpoint = {
  path: '/seed',
  method: 'get',
  handler: async (req) => {
    // Check if user is authenticated
    if (!req.user) {
      throw new APIError('Unauthorized', 401)
    }

    // Check if user is admin by verifying they can access admin operations
    // In Payload, users with admin access can access the admin panel
    // We verify admin access by checking if the user can perform admin-only operations
    try {
      // Verify user exists and can access their own record
      await req.payload.findByID({
        collection: 'users',
        id: req.user.id,
        depth: 0,
        overrideAccess: false,
        user: req.user,
      })

      // Check if user can access admin operations by trying to list all users
      // In Payload, by default only admins can list all users
      // This is a simple way to verify admin access without a roles field
      await req.payload.find({
        collection: 'users',
        limit: 1,
        overrideAccess: false,
        user: req.user,
      })

      // If we get here, the user can access admin operations and is an admin
      // In Payload, the first user is typically an admin
      // Note: If you add a roles field to Users collection, you can check userDoc.roles?.includes('admin')
    } catch (error) {
      // If user can't access admin operations, deny access
      throw new APIError('Unauthorized: Admin access required', 403)
    }

    // Create a streaming response using Server-Sent Events (SSE)
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        
        // Helper function to send a message to the stream
        const sendMessage = (message: string, type: 'log' | 'error' | 'success' = 'log') => {
          const data = JSON.stringify({ type, message, timestamp: new Date().toISOString() })
          controller.enqueue(encoder.encode(`data: ${data}\n\n`))
        }

        // Override console.log and console.error to stream output
        const originalLog = console.log
        const originalError = console.error
        
        console.log = (...args: unknown[]) => {
          originalLog(...args)
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          sendMessage(message, 'log')
        }

        console.error = (...args: unknown[]) => {
          originalError(...args)
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ')
          sendMessage(message, 'error')
        }

        try {
          // Run seed operations
          sendMessage('🚀 Starting seed operation...', 'log')
          
          // Seed CSS styles (idempotent)
          sendMessage('Seeding CSS styles...', 'log')
          await seedCSSStyles(req.payload)
          sendMessage('✅ CSS styles seeded', 'success')

          // Seed Navbar (idempotent)
          sendMessage('Seeding Navbar...', 'log')
          await seedNavbar(req.payload)
          sendMessage('✅ Navbar seeded', 'success')

          // Seed Footer (idempotent)
          sendMessage('Seeding Footer...', 'log')
          await seedFooter(req.payload)
          sendMessage('✅ Footer seeded', 'success')

          // Seed all pages
          sendMessage('Seeding Home Page...', 'log')
          await seedHomePage(req.payload)
          sendMessage('✅ Home Page seeded', 'success')
          
          sendMessage('Seeding Buy Page...', 'log')
          await seedBuyPage(req.payload)
          sendMessage('✅ Buy Page seeded', 'success')

          // Seed all brokers from Buildout API (includes all agents)
          sendMessage('Seeding Brokers...', 'log')
          await seedBrokers(req.payload)
          sendMessage('✅ Brokers seeded', 'success')

          // Seed featured agents sets (creates default set with 6 random agents)
          sendMessage('Seeding Featured Agents...', 'log')
          await seedFeaturedAgents(req.payload)
          sendMessage('✅ Featured Agents seeded', 'success')

          sendMessage('✅ All data seeded successfully!', 'success')
          
          // Restore original console methods
          console.log = originalLog
          console.error = originalError
          
          // Close the stream
          controller.close()
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          sendMessage(`❌ Error seeding data: ${errorMessage}`, 'error')
          
          // Restore original console methods
          console.log = originalLog
          console.error = originalError
          
          // Close the stream with error
          controller.close()
        }
      },
    })

    // Return streaming response with SSE headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  },
}

