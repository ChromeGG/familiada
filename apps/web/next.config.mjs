import withTM from 'next-transpile-modules'
import { createSecureHeaders } from 'next-secure-headers'
import nextTranslate from 'next-translate'

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }]
  },
}

export default withTM([])(nextTranslate(nextConfig))
