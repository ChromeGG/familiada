import withTM from 'next-transpile-modules'
import { createSecureHeaders } from 'next-secure-headers'
import nextTranslate from 'next-translate'

// console.log(process.env.NEXT_PUBLIC_API_URL)
// const apiUrl = process.env.NEXT_PUBLIC_API_URL
/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }]
  },
}

export default withTM([])(nextTranslate(nextConfig))
