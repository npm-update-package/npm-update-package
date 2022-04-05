import type { Logger } from '../logger'
import type { Options } from '../options'
import type { Terminal } from '../terminal'
import { detectPackageManager } from './detectPackageManager'
import { Npm } from './npm'
import type { PackageManager } from './PackageManager'
import { PackageManagerName } from './PackageManagerName'
import { Yarn } from './Yarn'

export class PackageManagerCreator {
  private readonly options: Options
  private readonly logger: Logger

  constructor ({
    options,
    logger
  }: {
    options: Options
    logger: Logger
  }) {
    this.options = options
    this.logger = logger
  }

  async create (terminal: Terminal): Promise<PackageManager> {
    const packageManagerName = await this.getPackageManagerName()
    this.logger.trace(`packageManagerName=${packageManagerName}`)

    switch (packageManagerName) {
      case PackageManagerName.Npm:
        this.logger.info('Use npm as package manager')
        return new Npm(terminal)
      case PackageManagerName.Yarn:
        this.logger.info('Use Yarn as package manager')
        return new Yarn(terminal)
    }
  }

  private async getPackageManagerName (): Promise<PackageManagerName> {
    if (this.options.packageManager !== undefined) {
      return this.options.packageManager
    }

    this.logger.info('Try to detect package manager from lock file.')
    return await detectPackageManager()
  }
}
