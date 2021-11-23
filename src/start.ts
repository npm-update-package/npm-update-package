import { createLogger } from './logger'
import { main } from './main'
import { initOptions } from './options'

const options = initOptions()
const logger = createLogger(options.logLevel)
logger.info('Start npm-update-package.')

main({
  options,
  logger
})
  .then(() => logger.info('End npm-update-package'))
  .catch((e: unknown) => logger.fatal('Unexpected error has occurred.', e))
