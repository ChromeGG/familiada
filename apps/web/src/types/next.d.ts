import type { NormalizedCacheObject } from '@apollo/client'
import type { ErrorMessageKey } from 'core/errorHandler'
import type {
  NextComponentType,
  NextPageContext,
  ParsedUrlQuery,
  PreviewData,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import type { Session } from 'next-auth'
import type { Router } from 'next/router'

declare module 'next/app' {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P>
    router: Router
    __N_SSG?: boolean
    __N_SSP?: boolean
    pageProps: P & {
      /** Initial session passed in from `getServerSideProps` or `getInitialProps` */
      session?: Session
      error?: ErrorMessageKey
      initialGqlClientState: NormalizedCacheObject
    }
  }
}

// TODO if error is returned, nothing else should be returned
declare module 'next' {
  type GetServerSideProps<
    P extends { [key: string]: any } = { [key: string]: any },
    Q extends ParsedUrlQuery = ParsedUrlQuery,
    D extends PreviewData = PreviewData
  > = (
    context: GetServerSidePropsContext<Q, D>
  ) => Promise<
    GetServerSidePropsResult<P> | { props: { error: ErrorMessageKey } }
  >
}
