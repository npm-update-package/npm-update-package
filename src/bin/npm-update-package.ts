#!/usr/bin/env node

import * as app from '../app.js'
import { logger } from '../logger/logger.js'
import { main } from '../main.js'
import { initOptions } from '../options/initOptions.js'

try {
  const options = initOptions()
  logger.level = options.logLevel
  logger.info(`Start ${app.name} v${app.version}`)
  await main(options)
  logger.info(`End ${app.name} v${app.version}`)
} catch (error) {
  logger.fatal(error)
  throw error
}
