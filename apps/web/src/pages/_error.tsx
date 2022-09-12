/**
 * Typescript class based component for custom-error, inspired from
 * @link https://github.com/belgattitude/nextjs-monorepo-example/blob/main/apps/web-app/src/pages/_error.tsx
 */

// import * as Sentry from '@sentry/nextjs'
import type { NextPage, NextPageContext } from 'next'

import NextErrorComponent from 'next/error'

import { logger } from '../core/logger'

// Adds HttpException to the list of possible error types.
type AugmentedError = NonNullable<NextPageContext['err']> | null
type CustomErrorProps = {
  err?: AugmentedError
  message?: string
  hasGetInitialPropsRun?: boolean
}

type AugmentedNextPageContext = Omit<NextPageContext, 'err'> & {
  err: AugmentedError
}

export const captureException = (err: unknown) => {
  logger.error(err)
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Sentry.captureException(err)
  }
}

const captureExceptionAndFlush = async (
  err: string | Error,
  flushAfter = 2000
) => {
  // if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  //   // Sentry.captureException(err)
  //   if (flushAfter > 0) {
  //     // await Sentry.flush(flushAfter)
  //   }
  // }
}

const CustomError: NextPage<CustomErrorProps> = (props) => {
  const { err, hasGetInitialPropsRun, message = 'UNEXPECTED_ERROR' } = props

  // if (message === 'VALIDATION_ERROR') {
  //   return <ValidationFailed />
  // }

  if (!hasGetInitialPropsRun && err) {
    captureException(err)
  }

  return <h1>Error: {message}</h1>
}

CustomError.getInitialProps = async ({
  res,
  err,
  asPath,
}: AugmentedNextPageContext) => {
  const errorInitialProps = (await NextErrorComponent.getInitialProps({
    res,
    err,
  } as NextPageContext)) as CustomErrorProps

  errorInitialProps.hasGetInitialPropsRun = true

  if (err) {
    await captureExceptionAndFlush(err)
    return errorInitialProps
  }

  await captureExceptionAndFlush(
    new Error(`_error.js getInitialProps missing data at path: ${asPath}`)
  )

  return errorInitialProps
}

export default CustomError
