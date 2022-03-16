import { getLogger } from 'log4js'
import type { Logger } from './Logger'
import type { LogLevel } from './LogLevel'

export const createLogger = (logLevel: LogLevel): Logger => {
  const logger = getLogger()
  logger.level = logLevel
  return logger
}
