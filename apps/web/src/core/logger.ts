import type { LoggerOptions } from 'pino'

import pino from 'pino'

import { isProduction } from '../configuration'

const pinoConfig: LoggerOptions = {
  browser: {
    asObject: true,
  },
}

if (isProduction) {
  pinoConfig.redact = {
    paths: ['*.password', '*.email'],
    censor: '[censored]',
  }
}

if (!isProduction) {
  pinoConfig.transport = {
    target: 'pino-pretty',
    options: {
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  }
}

export const logger = pino(pinoConfig)
export const log = (msg: any) => logger.info(msg)
