import { logger } from '../logger/singleton'
import type { Options } from '../options'
import type { Terminal } from '../terminal'
import { detectPackageManager } from './detectPackageManager'
import { Npm } from './npm'
import type { PackageManager } from './PackageManager'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './yarn'

export class PackageManagerCreator {
  constructor (private readonly options: Options) {}

  async create (terminal: Terminal): Promise<PackageManager> {
    const packageManagerName = await this.getPackageManagerName()
    logger.trace(`packageManagerName=${packageManagerName}`)

    switch (packageManagerName) {
      case PackageManagerName.Npm:
        logger.info('Use npm as package manager')
        return new Npm(terminal)
      case PackageManagerName.Yarn:
        logger.info('Use Yarn as package manager')
        return new Yarn(terminal)
    }
  }

  private async getPackageManagerName (): Promise<PackageManagerName> {
    if (this.options.packageManager !== undefined) {
      return this.options.packageManager
    }

    logger.info('Try to detect package manager from lock file.')
    return await detectPackageManager()
  }
}
