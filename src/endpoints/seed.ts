import type { Endpoint } from 'payload'
import { APIError } from 'payload'
import { runSeed } from '../lib/seed-runner'

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
          
          // Use the shared seed function
          await runSeed(req.payload)
          
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

