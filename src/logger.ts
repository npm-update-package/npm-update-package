import { getLogger } from 'log4js'

// TODO: add test
const logger = getLogger()
logger.level = process.env.LOG_LEVEL ?? 'info'

export { logger }
