#!/usr/bin/env node

import pkg from '../package.json'
import { createLogger } from './logger'
import { main } from './main'
import { initOptions } from './options'

const options = initOptions()
const logger = createLogger(options.logLevel)
logger.info(`Start ${pkg.name} v${pkg.version}`)

main({
  options,
  logger
})
  .then(() => {
    logger.info(`End ${pkg.name} v${pkg.version}`)
  })
  .catch((error: unknown) => {
    logger.fatal(error)
    throw error
  })
