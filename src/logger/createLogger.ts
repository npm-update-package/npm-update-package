import { getLogger } from 'log4js'
import type { Logger } from 'log4js'

// TODO: add test
export const createLogger = (): Logger => {
  const logger = getLogger()
  // TODO replace environments with options
  logger.level = process.env.LOG_LEVEL ?? 'info'
  return logger
}
