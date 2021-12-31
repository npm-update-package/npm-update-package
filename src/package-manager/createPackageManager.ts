import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

export const createPackageManager = ({
  terminal,
  packageManager
}: {
  terminal: Terminal
  packageManager: PackageManagerName
}): PackageManager => {
  switch (packageManager) {
    case PackageManagerName.Npm:
      return new Npm(terminal)
    case PackageManagerName.Yarn:
      return new Yarn(terminal)
  }
}
