import { logger } from './logger'
import { main } from './main'

logger.info('Start npm-update-package.')
main()
  .then(() => logger.info('End npm-update-package'))
  .catch((e: unknown) => logger.fatal('Unexpected error has occurred.', e))
