#!/usr/bin/env node

import pkg from '../../package.json' with { type: 'json '}
import { logger } from '../logger/logger.js'
import { main } from '../main.js'
import { initOptions } from '../options/initOptions.js'

try {
  const options = initOptions()
  logger.level = options.logLevel
  logger.info(`Start ${pkg.name} v${pkg.version}`)
  await main(options)
  logger.info(`End ${pkg.name} v${pkg.version}`)
} catch (error) {
  logger.fatal(error)
  throw error
}
