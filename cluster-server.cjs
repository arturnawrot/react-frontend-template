// Cluster wrapper for Next.js standalone server
// Spawns multiple workers to handle concurrent SSR requests
const cluster = require('cluster')
const os = require('os')

// Use CLUSTER_WORKERS env var, or default to number of CPUs (max 4)
const numWorkers = parseInt(process.env.CLUSTER_WORKERS || '0', 10) || Math.min(os.cpus().length, 4)

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} starting ${numWorkers} workers...`)

  for (let i = 0; i < numWorkers; i++) {
    cluster.fork()
  }

  cluster.on('exit', (worker, code, signal) => {
    console.warn(`Worker ${worker.process.pid} exited (code: ${code}, signal: ${signal}). Restarting...`)
    cluster.fork()
  })
} else {
  require('./server.js')
}
