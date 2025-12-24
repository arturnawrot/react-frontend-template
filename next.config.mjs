import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  devIndicators: false,
  // Exclude non-payloadcms-version from build
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // Your Next.js config here
  webpack: (webpackConfig) => {
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

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
