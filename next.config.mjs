import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  // Exclude non-payloadcms-version from build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Your Next.js config here
  webpack: (webpackConfig, { isServer, webpack }) => {
    // Exclude non-payloadcms-version directory from webpack processing
    webpackConfig.watchOptions = {
      ...webpackConfig.watchOptions,
      ignored: ['**/node_modules/**', '**/non-payloadcms-version/**'],
    }
    
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
