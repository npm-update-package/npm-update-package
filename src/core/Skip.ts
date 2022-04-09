import {
  left,
  right,
  type Either
} from 'fp-ts/lib/Either'
import {
  createBranchName,
  type CommitMessageCreator,
  type Git
} from '../git'
import type {
  BranchFinder,
  PullRequestCreator,
  PullRequestFinder
} from '../github'
import { logger } from '../logger'
import type { PackageManager } from '../package-manager'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import type { PackageUpdater } from './PackageUpdater'
import type { SucceededResult } from './SucceededResult'

// TODO: Add test
// TODO: Split into multiple classes and functions
export class Skip implements OutdatedPackageProcessor {
  private readonly git: Git
  private readonly packageManager: PackageManager
  private readonly pullRequestCreator: PullRequestCreator
  private readonly branchFinder: BranchFinder
  private readonly commitMessageCreator: CommitMessageCreator
  private readonly pullRequestFinder: PullRequestFinder
  private readonly packageUpdater: PackageUpdater

  constructor ({
    git,
    packageManager,
    pullRequestCreator,
    branchFinder,
    commitMessageCreator,
    pullRequestFinder,
    packageUpdater
  }: {
    git: Git
    packageManager: PackageManager
    pullRequestCreator: PullRequestCreator
    branchFinder: BranchFinder
    commitMessageCreator: CommitMessageCreator
    pullRequestFinder: PullRequestFinder
    packageUpdater: PackageUpdater
  }) {
    this.git = git
    this.packageManager = packageManager
    this.pullRequestCreator = pullRequestCreator
    this.branchFinder = branchFinder
    this.commitMessageCreator = commitMessageCreator
    this.pullRequestFinder = pullRequestFinder
    this.packageUpdater = packageUpdater
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async process (outdatedPackage: OutdatedPackage): Promise<Either<FailedResult, SucceededResult>> {
    const branchName = createBranchName(outdatedPackage)
    logger.debug(`branchName=${branchName}`)

    if (this.branchFinder.findByName(branchName) !== undefined) {
      logger.info(`Skip ${outdatedPackage.name} because ${branchName} branch already exists on remote.`)
      return right({
        outdatedPackage,
        skipped: true
      })
    }

    const pullRequests = this.pullRequestFinder.findByPackageName(outdatedPackage.name)
    logger.trace(`pullRequests=${JSON.stringify(pullRequests)}`)

    if (pullRequests.length > 0) {
      logger.info(`Skip ${outdatedPackage.name} because outdated pull requests exist.`)
      return right({
        outdatedPackage,
        skipped: true
      })
    }

    await this.git.createBranch(branchName)
    logger.info(`${branchName} branch has created.`)

    try {
      try {
        await this.packageUpdater.update(outdatedPackage)
      } catch (error) {
        logger.error(error)
        return left({
          outdatedPackage,
          error
        })
      }

      logger.info(`${outdatedPackage.name} has updated from v${outdatedPackage.currentVersion.version} to v${outdatedPackage.newVersion.version}`)

      await this.git.add(this.packageManager.packageFile, this.packageManager.lockFile)
      const message = this.commitMessageCreator.create(outdatedPackage)
      logger.debug(`message=${message}`)

      await this.git.commit(message)
      await this.git.push(branchName)
      const pullRequest = await this.pullRequestCreator.create({
        outdatedPackage,
        branchName
      })
      logger.info(`Pull request for ${outdatedPackage.name} has created. ${pullRequest.html_url}`)
      return right({
        outdatedPackage,
        created: true
      })
    } finally {
      await this.git.restore(this.packageManager.packageFile, this.packageManager.lockFile)
      await this.git.switch('-')
      await this.git.removeBranch(branchName)
      logger.info(`${branchName} branch has removed.`)
    }
  }
}
