import { isPackageManager } from '../enums/PackageManager'
import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { Yarn } from './Yarn'

// TODO: add test
export const createPackageManager = (terminal: Terminal): PackageManager => {
  // TODO replace environments with options
  if (!isPackageManager(process.env.PACKAGE_MANAGER)) {
    throw new Error(`process.env.PACKAGE_MANAGER is invalid. process.env.PACKAGE_MANAGER=${process.env.PACKAGE_MANAGER ?? 'undefined'}`)
  }

  switch (process.env.PACKAGE_MANAGER) {
    case 'npm':
      return new Npm(terminal)
    case 'yarn':
      return new Yarn(terminal)
  }
}
