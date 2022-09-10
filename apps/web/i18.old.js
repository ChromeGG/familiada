const formatters = {
  en: new Intl.NumberFormat('en-EN'),
  pl: new Intl.NumberFormat('pl'),
}

/**
 * @type {import('next-translate').LoaderConfig}
 */
export default {
  locales: ['pl'], // ['pl', 'en' ...]
  defaultLocale: 'pl',
  defaultNS: 'common',
  logBuild: process.env.NODE_ENV !== 'production',
  pages: {
    '*': ['common', 'error'],
  },
  interpolation: {
    // we cannot type it, it's not .ts file :(
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    format: (value, format, lang) => {
      if (format === 'number') {
        return formatters[lang].format(value)
      }
      return value
    },
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  },
}
