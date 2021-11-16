import { getLogger as get } from 'log4js'
import type { Logger } from 'log4js'

const DEFAULT_LOG_LEVEL = 'info'

export const getLogger = (): Logger => {
  const logger = get()
  logger.level = process.env.LOG_LEVEL ?? DEFAULT_LOG_LEVEL
  return logger
}
