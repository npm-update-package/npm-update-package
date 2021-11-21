import type { Git } from '../git'
import type { GitBranchCleaner } from '../git-branch-cleaner'
import { logger } from '../logger'
import type { Ncu } from '../ncu'
import type { PackageManager } from '../package-manager'
import type { PullRequestCreator } from '../pull-request-creator'
import type { RemoteBranchExistenceChecker } from '../remote-branch-existence-checker'
import type { OutdatedPackage } from '../types'
import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import type { UpdateResult } from './UpdateResult'

// TODO: add test
export class OutdatedPackageUpdater {
  // TODO: remove git from here by creating class using git
  private readonly git: Git
  private readonly packageManager: PackageManager
  private readonly ncu: Ncu
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  private readonly pullRequestCreator: PullRequestCreator
  private readonly gitBranchCleaner: GitBranchCleaner

  constructor ({
    git,
    packageManager,
    ncu,
    remoteBranchExistenceChecker,
    pullRequestCreator,
    gitBranchCleaner
  }: {
    git: Git
    packageManager: PackageManager
    ncu: Ncu
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
    pullRequestCreator: PullRequestCreator
    gitBranchCleaner: GitBranchCleaner
  }) {
    this.git = git
    this.packageManager = packageManager
    this.ncu = ncu
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
    this.pullRequestCreator = pullRequestCreator
    this.gitBranchCleaner = gitBranchCleaner
  }

  /**
   * Update outdated package. Don't run in parallel because it includes file operations.
   */
  async update (outdatedPackage: OutdatedPackage): Promise<UpdateResult> {
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

    const updatedPackages = await this.ncu.update(outdatedPackage)
    logger.debug(`updatedPackages=${JSON.stringify(updatedPackages)}`)

    if (updatedPackages.length !== 1) {
      throw new Error(`Failed to update ${outdatedPackage.name}.`)
    }

    await this.packageManager.install()
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
