import { cliOptions } from './cliOptions'
import { createOptions } from './createOptions'
import type { Options } from './Options'

// TODO: add test
export const initOptions = (): Options => {
  return createOptions(cliOptions)
}
