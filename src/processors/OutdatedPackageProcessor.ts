import {
  left,
  right
} from 'fp-ts/lib/Either'
import type { Either } from 'fp-ts/lib/Either'
import type {
  BranchNameCreator,
  CommitMessageCreator,
  Git
} from '../git'
import type {
  PullRequestCreator,
  RemoteBranchExistenceChecker
} from '../github'
import type { Logger } from '../logger'
import type {
  Ncu,
  OutdatedPackage
} from '../ncu'
import type { PackageManager } from '../package-manager'
import type { FailedResult } from './FailedResult'
import type { SucceededResult } from './SucceededResult'

// TODO: add test
export class OutdatedPackageProcessor {
  private readonly git: Git
  private readonly ncu: Ncu
  private readonly packageManager: PackageManager
  private readonly pullRequestCreator: PullRequestCreator
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  private readonly logger: Logger
  private readonly branchNameCreator: BranchNameCreator
  private readonly commitMessageCreator: CommitMessageCreator

  constructor ({
    git,
    ncu,
    packageManager,
    pullRequestCreator,
    remoteBranchExistenceChecker,
    logger,
    branchNameCreator,
    commitMessageCreator
  }: {
    git: Git
    ncu: Ncu
    packageManager: PackageManager
    pullRequestCreator: PullRequestCreator
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
    logger: Logger
    branchNameCreator: BranchNameCreator
    commitMessageCreator: CommitMessageCreator
  }) {
    this.git = git
    this.ncu = ncu
    this.packageManager = packageManager
    this.pullRequestCreator = pullRequestCreator
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
    this.logger = logger
    this.branchNameCreator = branchNameCreator
    this.commitMessageCreator = commitMessageCreator
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async process (outdatedPackage: OutdatedPackage): Promise<Either<FailedResult, SucceededResult>> {
    const branchName = this.branchNameCreator.create(outdatedPackage)
    this.logger.debug(`branchName=${branchName}`)

    if (this.remoteBranchExistenceChecker.check(branchName)) {
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
        const updatedPackages = await this.ncu.update(outdatedPackage)

        if (updatedPackages.length !== 1) {
          throw new Error(`Failed to update ${outdatedPackage.name}.`)
        }

        await this.packageManager.install()
      } catch (error) {
        this.logger.error(error)
        return left({
          outdatedPackage,
          error
        })
      }

      this.logger.info(`${outdatedPackage.name} has updated from v${outdatedPackage.currentVersion.version} to v${outdatedPackage.newVersion.version}`)

      await this.git.add(...this.packageManager.packageFiles)
      const message = this.commitMessageCreator.create(outdatedPackage)
      this.logger.debug(`message=${message}`)

      await this.git.commit(message)
      await this.git.push(branchName)
      await this.pullRequestCreator.create({
        outdatedPackage,
        branchName
      })
      return right({
        outdatedPackage,
        updated: true
      })
    } finally {
      await this.git.restore(...this.packageManager.packageFiles)
      await this.git.switch('-')
      await this.git.removeBranch(branchName)
      this.logger.info(`${branchName} branch has removed.`)
    }
  }
}
