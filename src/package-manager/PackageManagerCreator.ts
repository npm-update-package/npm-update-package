import type { Options } from '../options'
import type { Terminal } from '../terminal'
import { detectPackageManager } from './detectPackageManager'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

export class PackageManagerCreator {
  constructor (private readonly options: Options) {}

  async create (terminal: Terminal): Promise<PackageManager> {
    const packageManagerName = this.options.packageManager ?? await detectPackageManager()

    switch (packageManagerName) {
      case PackageManagerName.Npm:
        return new Npm(terminal)
      case PackageManagerName.Yarn:
        return new Yarn(terminal)
    }
  }
}
