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
  PullRequestCloser,
  PullRequestCreator,
  PullRequestFinder
} from '../github'
import type { Logger } from '../logger'
import type { Ncu } from '../ncu'
import type { Options } from '../options'
import type { PackageManager } from '../package-manager'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import type { SucceededResult } from './SucceededResult'

// TODO: add test
export class OutdatedPackageProcessor {
  private readonly git: Git
  private readonly ncu: Ncu
  private readonly packageManager: PackageManager
  private readonly pullRequestCreator: PullRequestCreator
  private readonly branchFinder: BranchFinder
  private readonly logger: Logger
  private readonly commitMessageCreator: CommitMessageCreator
  private readonly pullRequestFinder: PullRequestFinder
  private readonly pullRequestCloser: PullRequestCloser
  private readonly options: Options

  constructor ({
    git,
    ncu,
    packageManager,
    pullRequestCreator,
    branchFinder,
    logger,
    commitMessageCreator,
    pullRequestFinder,
    pullRequestCloser,
    options
  }: {
    git: Git
    ncu: Ncu
    packageManager: PackageManager
    pullRequestCreator: PullRequestCreator
    branchFinder: BranchFinder
    logger: Logger
    commitMessageCreator: CommitMessageCreator
    pullRequestFinder: PullRequestFinder
    pullRequestCloser: PullRequestCloser
    options: Options
  }) {
    this.git = git
    this.ncu = ncu
    this.packageManager = packageManager
    this.pullRequestCreator = pullRequestCreator
    this.branchFinder = branchFinder
    this.logger = logger
    this.commitMessageCreator = commitMessageCreator
    this.pullRequestFinder = pullRequestFinder
    this.pullRequestCloser = pullRequestCloser
    this.options = options
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async process (outdatedPackage: OutdatedPackage): Promise<Either<FailedResult, SucceededResult>> {
    const ignoredPackages = this.options.ignorePackages ?? []

    if (ignoredPackages.includes(outdatedPackage.name)) {
      this.logger.info(`Skip ${outdatedPackage.name} because ignorePackages contains it.`)
      return right({
        outdatedPackage,
        skipped: true
      })
    }

    const branchName = createBranchName(outdatedPackage)
    this.logger.debug(`branchName=${branchName}`)

    if (this.branchFinder.findByName(branchName) !== undefined) {
      this.logger.info(`Skip ${outdatedPackage.name} because ${branchName} branch already exists on remote.`)
      return right({
        outdatedPackage,
        skipped: true
      })
    }

    await this.git.createBranch(branchName)
    this.logger.info(`${branchName} branch has created.`)

    try {
      try {
        await this.updatePackage(outdatedPackage)
      } catch (error) {
        this.logger.error(error)
        return left({
          outdatedPackage,
          error
        })
      }

      this.logger.info(`${outdatedPackage.name} has updated from v${outdatedPackage.currentVersion.version} to v${outdatedPackage.newVersion.version}`)

      await this.git.add(this.packageManager.packageFile, this.packageManager.lockFile)
      const message = this.commitMessageCreator.create(outdatedPackage)
      this.logger.debug(`message=${message}`)

      await this.git.commit(message)
      await this.git.push(branchName)
      const pullRequest = await this.pullRequestCreator.create({
        outdatedPackage,
        branchName
      })
      this.logger.info(`Pull request for ${outdatedPackage.name} has created. ${pullRequest.html_url}`)

      const pullRequests = this.pullRequestFinder.findByPackageName(outdatedPackage.name)
      this.logger.debug(`pullRequests=${JSON.stringify(pullRequests)}`)

      await Promise.all(pullRequests.map(async (pullRequest) => {
        await this.pullRequestCloser.close(pullRequest)
        this.logger.info(`Pull request for ${outdatedPackage.name} has closed. ${pullRequest.html_url}`)
      }))
      return right({
        outdatedPackage,
        created: true
      })
    } finally {
      await this.git.restore(this.packageManager.packageFile, this.packageManager.lockFile)
      await this.git.switch('-')
      await this.git.removeBranch(branchName)
      this.logger.info(`${branchName} branch has removed.`)
    }
  }

  private async updatePackage (outdatedPackage: OutdatedPackage): Promise<void> {
    const updatedPackages = await this.ncu.update(outdatedPackage)

    if (updatedPackages.length !== 1) {
      throw new Error(`Failed to update ${outdatedPackage.name}.`)
    }

    await this.packageManager.install()
  }
}
