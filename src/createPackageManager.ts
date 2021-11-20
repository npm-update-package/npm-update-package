import {
  Npm,
  Yarn
} from './package-manager'
import type { PackageManager } from './package-manager'
import type { Terminal } from './terminal'
import { logger } from './logger'

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
