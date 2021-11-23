import { getLogger as get } from 'log4js'
import type { Logger } from 'log4js'

// TODO: add test
export const getLogger = (): Logger => {
  const logger = get()
  // TODO replace environments with options
  logger.level = process.env.LOG_LEVEL ?? 'info'
  return logger
}
