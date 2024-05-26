import { logger } from '../logger/logger.js'
import type { Options } from '../options/Options.js'
import type { Terminal } from '../terminal/Terminal.js'
import type { detectPackageManager as DetectPackageManager } from './detectPackageManager.js'
import { Npm } from './npm/Npm.js'
import type { PackageManager } from './PackageManager.js'
import { PackageManagerName } from './PackageManagerName.js'
import { Yarn } from './yarn/Yarn.js'

export class PackageManagerCreator {
  private readonly options: Options
  private readonly detectPackageManager: typeof DetectPackageManager

  constructor ({
    options,
    detectPackageManager
  }: {
    options: Options
    detectPackageManager: typeof DetectPackageManager
  }) {
    this.options = options
    this.detectPackageManager = detectPackageManager
  }

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
    return await this.detectPackageManager()
  }
}
