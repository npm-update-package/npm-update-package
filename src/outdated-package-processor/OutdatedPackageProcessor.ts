import type {
  Committer,
  Git,
  PackageFilesAdder
} from '../git'
import type {
  PullRequestCreator,
  RemoteBranchExistenceChecker
} from '../github'
import { logger } from '../logger'
import type { OutdatedPackageUpdater } from '../outdated-package-updater'
import type {
  OutdatedPackage,
  Result
} from '../types'
import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'

// TODO: add test
export class OutdatedPackageProcessor {
  private readonly committer: Committer
  private readonly git: Git
  private readonly outdatedPackageUpdater: OutdatedPackageUpdater
  private readonly packageFilesAdder: PackageFilesAdder
  private readonly pullRequestCreator: PullRequestCreator
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker

  constructor ({
    committer,
    git,
    outdatedPackageUpdater,
    packageFilesAdder,
    pullRequestCreator,
    remoteBranchExistenceChecker
  }: {
    committer: Committer
    git: Git
    outdatedPackageUpdater: OutdatedPackageUpdater
    packageFilesAdder: PackageFilesAdder
    pullRequestCreator: PullRequestCreator
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  }) {
    this.committer = committer
    this.git = git
    this.outdatedPackageUpdater = outdatedPackageUpdater
    this.packageFilesAdder = packageFilesAdder
    this.pullRequestCreator = pullRequestCreator
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async process (outdatedPackage: OutdatedPackage): Promise<Result> {
    const branchName = createBranchName(outdatedPackage)
    logger.debug(`branchName=${branchName}`)

    if (this.remoteBranchExistenceChecker.check(branchName)) {
      logger.info(`Skip ${outdatedPackage.name} because ${branchName} branch already exists on remote.`)
      return {
        outdatedPackage,
        skipped: true
      }
    }

    await this.git.createBranch(branchName)
    logger.info(`${branchName} branch has created.`)

    await this.outdatedPackageUpdater.update(outdatedPackage)
    logger.info(`${outdatedPackage.name} has updated from v${outdatedPackage.currentVersion.version} to v${outdatedPackage.newVersion.version}`)

    await this.packageFilesAdder.add()
    const message = createCommitMessage(outdatedPackage)
    logger.debug(`message=${message}`)

    await this.committer.commit(message)
    await this.git.push(branchName)
    await this.pullRequestCreator.create({
      outdatedPackage,
      branchName
    })
    await this.git.checkout('-')
    await this.git.removeBranch(branchName)
    logger.info(`${branchName} branch has removed.`)

    return {
      outdatedPackage,
      updated: true
    }
  }
}
