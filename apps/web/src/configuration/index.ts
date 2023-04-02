export const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL, //  '//process.env.API_URL,
}
