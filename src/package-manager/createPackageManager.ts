import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import type { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

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
