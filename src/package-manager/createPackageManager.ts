import { logger } from '../logger'
import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { Yarn } from './Yarn'

// TODO: add test
export const createPackageManager = (terminal: Terminal): PackageManager => {
  const packageManager = process.env.PACKAGE_MANAGER ?? 'undefined'
  logger.debug(`process.env.PACKAGE_MANAGER=${packageManager}`)

  switch (packageManager) {
    case 'npm':
      return new Npm(terminal)
    case 'yarn':
      return new Yarn(terminal)
    default:
      throw new Error(`process.env.PACKAGE_MANAGER is invalid. process.env.PACKAGE_MANAGER=${packageManager}`)
  }
}
