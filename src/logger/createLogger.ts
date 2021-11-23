import { getLogger } from 'log4js'
import type { LogLevel } from '../enums'
import type { Logger } from './Logger'

// TODO: add test
export const createLogger = (logLevel: LogLevel): Logger => {
  const logger = getLogger()
  logger.level = logLevel
  return logger
}
