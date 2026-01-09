import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  // Exclude non-payloadcms-version from build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  typescript: {
    // Skip type checking during build (optional, but helps with seed files)
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // Allow localhost for development (if needed)
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  // Your Next.js config here
  webpack: (webpackConfig, { isServer, webpack }) => {
    // Exclude non-payloadcms-version and seed directories from webpack processing
    webpackConfig.watchOptions = {
      ...webpackConfig.watchOptions,
      ignored: ['**/node_modules/**', '**/non-payloadcms-version/**', '**/src/seed/**', '**/src/seed.ts'],
    }
    
    // Ignore seed files completely using webpack's IgnorePlugin
    webpackConfig.plugins = webpackConfig.plugins || []
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/seed/,
        contextRegExp: /src$/,
      })
    )
    webpackConfig.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /src\/seed/,
      })
    )
    
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Fix for Payload CMS components with webpack
    if (!isServer) {
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }


    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
