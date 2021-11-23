import { logger } from './logger'
import { main } from './main'
import { initOptions } from './options'

logger.info('Start npm-update-package.')

const options = initOptions()
logger.debug(`options=${JSON.stringify(options)}`)

main(options)
  .then(() => logger.info('End npm-update-package'))
  .catch((e: unknown) => logger.fatal('Unexpected error has occurred.', e))
