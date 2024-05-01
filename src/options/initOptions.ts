import { cliOptions } from './cliOptions.js'
import { createOptions } from './createOptions.js'
import type { Options } from './Options.js'

export const initOptions = (): Options => {
  return createOptions(cliOptions)
}
