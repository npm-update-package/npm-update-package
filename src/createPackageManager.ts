import type { PackageManager } from './package-manager/PackageManager'
import { Npm } from './package-manager/Npm'
import { Yarn } from './package-manager/Yarn'
import { logger } from './logger'
import type { Terminal } from './Terminal'

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
