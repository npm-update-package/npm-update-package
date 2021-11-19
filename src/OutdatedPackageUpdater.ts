// TODO: Keep it less than 100 lines.

import type { PackageManager } from './package-manager/PackageManager'
import type { OutdatedPackage } from './types/OutdatedPackage'
import type { GitRepository } from './values/GitRepository'
import type { RemoteBranchExistenceChecker } from './RemoteBranchExistenceChecker'
import { createBranchName } from './createBranchName'
import { createCommitMessage } from './createCommitMessage'
import { createPullRequestBody } from './createPullRequestBody'
import { createPullRequestTitle } from './createPullRequestTitle'
import type { Git } from './Git'
import type {
  GitHub,
  Repository as GitHubRepository
} from './GitHub'
import { logger } from './logger'
import { updateOutdatedPackage } from './updateOutdatedPackage'

export class OutdatedPackageUpdater {
  private readonly git: Git
  private readonly gitRepo: GitRepository
  private readonly github: GitHub
  private readonly githubRepo: GitHubRepository
  private readonly packageManager: PackageManager
  private readonly remoteBranchExistenceChecker: RemoteBranchExistenceChecker

  constructor ({
    git,
    gitRepo,
    github,
    githubRepo,
    packageManager,
    remoteBranchExistenceChecker
  }: {
    git: Git
    gitRepo: GitRepository
    github: GitHub
    githubRepo: GitHubRepository
    packageManager: PackageManager
    remoteBranchExistenceChecker: RemoteBranchExistenceChecker
  }) {
    this.git = git
    this.gitRepo = gitRepo
    this.github = github
    this.githubRepo = githubRepo
    this.packageManager = packageManager
    this.remoteBranchExistenceChecker = remoteBranchExistenceChecker
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
    const title = createPullRequestTitle(outdatedPackage)
    logger.debug(`title=${title}`)
    const body = createPullRequestBody(outdatedPackage)
    logger.debug(`body=${body}`)
    const pullRequest = await this.github.createPullRequest({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      base: this.githubRepo.default_branch,
      head: branchName,
      title,
      body
    })
    logger.debug(`pullRequest=${JSON.stringify(pullRequest)}`)
    logger.info(`Pull request for ${outdatedPackage.name} has created. ${pullRequest.html_url}`)

    await this.git.checkout('-')
    await this.git.removeBranch(branchName)
    logger.info(`${branchName} branch has removed.`)
  }
}
