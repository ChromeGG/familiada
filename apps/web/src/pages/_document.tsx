import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

import { appTheme } from '../configuration/theme'

class MyDocument extends Document {
  render() {
    return (
      // TODO lang should be dynamic
      <Html lang="pl-Pl">
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com/icon?family=Material+Icons"
          />
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="theme-color" content={appTheme.palette.primary.main} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="#appTitle" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&family=Press+Start+2P&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
