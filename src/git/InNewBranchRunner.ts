import type { Git } from '../git'
import type { Logger } from '../logger'
import type { PackageManager } from '../package-manager'

// TODO: add test
export class InNewBranchRunner {
  private readonly git: Git
  private readonly packageManager: PackageManager
  private readonly logger: Logger

  constructor ({
    git,
    packageManager,
    logger
  }: {
    git: Git
    packageManager: PackageManager
    logger: Logger
  }) {
    this.git = git
    this.packageManager = packageManager
    this.logger = logger
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async run<Result> (branchName: string, callback: (branchName: string) => Promise<Result>): Promise<Result> {
    await this.git.createBranch(branchName)
    this.logger.info(`${branchName} branch has created.`)

    try {
      return await callback(branchName)
    } finally {
      await this.git.restore(...this.packageManager.packageFiles)
      await this.git.switch('-')
      await this.git.removeBranch(branchName)
      this.logger.info(`${branchName} branch has removed.`)
    }
  }
}
