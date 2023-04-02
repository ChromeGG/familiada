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
    return [
      {
        // matching all API routes
        source: '/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
}

export default withTM([])(nextTranslate(nextConfig))
