#!/usr/bin/env node

import { app } from './app'
import { createLogger } from './logger'
import { main } from './main'
import { initOptions } from './options'

const options = initOptions()
const logger = createLogger(options.logLevel)
logger.info(`Start ${app.name} v${app.version}`)

main({
  options,
  logger
})
  .then(() => {
    logger.info(`End ${app.name} v${app.version}`)
  })
  .catch((error: unknown) => {
    logger.fatal(error)
    throw error
  })
