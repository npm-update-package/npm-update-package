import type { PackageManagerName } from '../enums'
import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { Yarn } from './Yarn'

// TODO: add test
export class PackageManagerCreator {
  constructor (private readonly terminal: Terminal) {}

  create (packageManagerName: PackageManagerName): PackageManager {
    switch (packageManagerName) {
      case 'npm':
        return new Npm(this.terminal)
      case 'yarn':
        return new Yarn(this.terminal)
    }
  }
}
