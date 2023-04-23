import { ApolloProvider } from '@apollo/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import type { AppProps } from 'next/app'
import { DefaultSeo } from 'next-seo'
import { SnackbarProvider } from 'notistack'
import { RecoilRoot } from 'recoil'

import { config } from '../configuration'

import { appTheme } from '../configuration/theme'
import { useGqlClientInit } from '../core/graphqlClient'
import Error from '../pages/_error'

function MyApp({ Component, pageProps }: AppProps) {
  const { initialGqlClientState } = pageProps

  const graphqlClient = useGqlClientInit(initialGqlClientState)

  const NextPage = () => {
    if (pageProps.error) {
      return <Error message={pageProps.error} />
    }

    return (
      <>
        <Component {...pageProps} />
      </>
    )
  }

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: 'website',
          locale: 'pl', // TODO should be dynamic
          url: config.apiUrl,
          site_name: '#appTitle',
          title: '#appTitle',
          images: [
            // {
            //   url: '../../public/img/brand/share-logo.png',
            //   width: 1200,
            //   height: 1200,
            //   alt: 'Logo aplikacji',
            //   type: 'image/png',
            // },
          ],
        }}
        titleTemplate="%s | #appTitle"
        // defaultTitle="Familiada lol"
        description="Familiada online"
      />
      <CssBaseline />
      <SnackbarProvider>
        <ApolloProvider client={graphqlClient}>
          <RecoilRoot>
            <ThemeProvider theme={appTheme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <NetworkStateNotification /> */}

                <NextPage />
              </LocalizationProvider>
            </ThemeProvider>
          </RecoilRoot>
        </ApolloProvider>
      </SnackbarProvider>
    </>
  )
}

export default MyApp
