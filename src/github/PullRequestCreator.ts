import type { GitRepository } from '../git'
import type { Logger } from '../logger'
import type { OutdatedPackage } from '../types'
import { createPullRequestBody } from './createPullRequestBody'
import { createPullRequestTitle } from './createPullRequestTitle'
import type { GitHub } from './GitHub'
import type { Repository as GitHubRepository } from './Repository'

// TODO: add test
export class PullRequestCreator {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository
  private readonly logger: Logger

  constructor ({
    github,
    gitRepo,
    githubRepo,
    logger
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    logger: Logger
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.logger = logger
  }

  async create ({
    outdatedPackage,
    branchName
  }: {
    outdatedPackage: OutdatedPackage
    branchName: string
  }): Promise<void> {
    const title = createPullRequestTitle(outdatedPackage)
    this.logger.debug(`title=${title}`)

    const body = createPullRequestBody(outdatedPackage)
    this.logger.debug(`body=${body}`)

    const createdPullRequest = await this.github.createPullRequest({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      base: this.githubRepo.default_branch,
      head: branchName,
      title,
      body
    })
    this.logger.debug(`createdPullRequest=${JSON.stringify(createdPullRequest)}`)
    this.logger.info(`Pull request for ${outdatedPackage.name} has created. ${createdPullRequest.html_url}`)
  }
}
