import { createSecureHeaders } from 'next-secure-headers'
import nextTranslate from 'next-translate-plugin'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    esmExternals: true,
  },
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }]
  },
}

export default nextTranslate(nextConfig)
