export const ensure = <T>(
  argument: T | undefined | null,
  message = 'This value was promised to be there.'
): T => {
  if (argument === undefined || argument === null) {
    throw new TypeError(message)
  }

  return argument
}

export const assertNever = (x: never): never => {
  throw new Error('Unexpected object: ' + x)
}

export const isProduction = process.env.NODE_ENV === 'production'
