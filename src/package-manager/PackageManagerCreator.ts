import { canReadWrite } from '../file'
import type { Options } from '../options'
import type { Terminal } from '../terminal'
import { Npm } from './Npm'
import type { PackageManager } from './PackageManager'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

// TODO: Add test
export class PackageManagerCreator {
  private readonly options: Options

  constructor ({
    options
  }: {
    options: Options
  }) {
    this.options = options
  }

  async create (terminal: Terminal): Promise<PackageManager> {
    const packageManagerName = this.options.packageManager ?? await this.detect()

    switch (packageManagerName) {
      case PackageManagerName.Npm:
        return new Npm(terminal)
      case PackageManagerName.Yarn:
        return new Yarn(terminal)
    }
  }

  private async detect (): Promise<PackageManagerName> {
    if (await canReadWrite('package-lock.json')) {
      return PackageManagerName.Npm
    }

    if (await canReadWrite('yarn.lock')) {
      return PackageManagerName.Yarn
    }

    throw new Error('No lock file exists.')
  }
}
