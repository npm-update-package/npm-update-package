import type { Git } from '../git'
import type { GitBranchCleaner } from '../git-branch-cleaner'
import type { RemoteBranchExistenceChecker } from '../github'
import type { PullRequestCreator } from '../github/pull-request-creator'
import { logger } from '../logger'
import type { OutdatedPackageUpdater } from '../outdated-package-updater'
import type { OutdatedPackage } from '../types'
import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import type { UpdateResult } from './UpdateResult'

// TODO: add test
export class OutdatedPackageProcessor {
  // TODO: remove git from here by creating class using git
  private readonly git: Git
  private readonly outdatedPackageUpdater: OutdatedPackageUpdater
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  private readonly pullRequestCreator: PullRequestCreator
  private readonly gitBranchCleaner: GitBranchCleaner

  constructor ({
    git,
    outdatedPackageUpdater,
    remoteBranchExistenceChecker,
    pullRequestCreator,
    gitBranchCleaner
  }: {
    git: Git
    outdatedPackageUpdater: OutdatedPackageUpdater
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
    pullRequestCreator: PullRequestCreator
    gitBranchCleaner: GitBranchCleaner
  }) {
    this.git = git
    this.outdatedPackageUpdater = outdatedPackageUpdater
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
    this.pullRequestCreator = pullRequestCreator
    this.gitBranchCleaner = gitBranchCleaner
  }

  /**
   * Don't run in parallel because it includes file operations.
   */
  async process (outdatedPackage: OutdatedPackage): Promise<UpdateResult> {
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

    // TODO: add only necessary files （package.json & package-lock.json or yarn.lock）
    await this.git.addAll()
    const message = createCommitMessage(outdatedPackage)
    logger.debug(`message=${message}`)

    if (process.env.GIT_USER_NAME !== undefined && process.env.GIT_USER_EMAIL !== undefined) {
      const name = await this.git.getConfig('user.name')
      logger.debug(`name=${name}`)
      const email = await this.git.getConfig('user.email')
      logger.debug(`email=${email}`)
      await this.git.setConfig('user.name', process.env.GIT_USER_NAME)
      await this.git.setConfig('user.email', process.env.GIT_USER_EMAIL)
      await this.git.commit(message)
      await this.git.setConfig('user.name', name)
      await this.git.setConfig('user.email', email)
    } else {
      await this.git.commit(message)
    }

    await this.git.push(branchName)
    await this.pullRequestCreator.create({
      outdatedPackage,
      branchName
    })
    await this.gitBranchCleaner.clean()
    logger.info(`${branchName} branch has removed.`)

    return {
      outdatedPackage,
      updated: true
    }
  }
}
