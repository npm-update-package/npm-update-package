import type { PackageManager } from './package-manager'
import type { PullRequestCreator } from './pull-request-creator'
import type { RemoteBranchExistenceChecker } from './remote-branch-existence-checker'
import type { OutdatedPackage } from './types'
import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import type { Git } from './Git'
import { logger } from './logger'
import { updateOutdatedPackage } from './updateOutdatedPackage'

// TODO: add test
export class OutdatedPackageUpdater {
  private readonly git: Git
  private readonly packageManager: PackageManager
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  private readonly pullRequestCreator: PullRequestCreator

  constructor ({
    git,
    packageManager,
    remoteBranchExistenceChecker,
    pullRequestCreator
  }: {
    git: Git
    packageManager: PackageManager
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
    pullRequestCreator: PullRequestCreator
  }) {
    this.git = git
    this.packageManager = packageManager
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
    this.pullRequestCreator = pullRequestCreator
  }

  async update (outdatedPackage: OutdatedPackage): Promise<void> {
    const branchName = createBranchName(outdatedPackage)
    logger.debug(`branchName=${branchName}`)

    if (this.remoteBranchExistenceChecker.check(branchName)) {
      logger.info(`Skip ${outdatedPackage.name} because ${branchName} branch already exists on remote.`)
      return
    }

    await this.git.createBranch(branchName)
    logger.info(`${branchName} branch has created.`)

    const updatedPackages = await updateOutdatedPackage(outdatedPackage)
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
    await this.git.checkout('-')
    await this.git.removeBranch(branchName)
    logger.info(`${branchName} branch has removed.`)
  }
}
