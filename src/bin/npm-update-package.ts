#!/usr/bin/env node

import pkg from '../../package.json'
import { logger } from '../logger'
import { main } from '../main'
import { initOptions } from '../options'

const options = initOptions()
logger.level = options.logLevel
logger.info(`Start ${pkg.name} v${pkg.version}`)

main(options)
  .then(() => {
    logger.info(`End ${pkg.name} v${pkg.version}`)
  })
  // eslint-disable-next-line unicorn/prefer-top-level-await
  .catch((error: unknown) => {
    logger.fatal(error)
    throw error
  })
