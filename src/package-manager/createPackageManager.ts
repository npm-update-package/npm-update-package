import type { PackageManagerName } from '../enums'
import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { Yarn } from './Yarn'

// TODO: add test
export const createPackageManager = ({
  terminal,
  packageManager
}: {
  terminal: Terminal
  packageManager: PackageManagerName
}): PackageManager => {
  switch (packageManager) {
    case 'npm':
      return new Npm(terminal)
    case 'yarn':
      return new Yarn(terminal)
  }
}
