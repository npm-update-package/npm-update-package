import { logger } from '../logger/logger.js'
import type { Options } from '../options/Options.js'
import type { Terminal } from '../terminal/Terminal.js'
import { detectPackageManager } from './detectPackageManager.js'
import { Npm } from './npm/Npm.js'
import type { PackageManager } from './PackageManager.js'
import { PackageManagerName } from './PackageManagerName.js'
import { Yarn } from './yarn/Yarn.js'

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
