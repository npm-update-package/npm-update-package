import type { GitRepository } from '../git'
import type { Logger } from '../logger'
import type { OutdatedPackage } from '../ncu'
import { createPullRequestBody } from './createPullRequestBody'
import type { GitHub } from './GitHub'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'
import type { Repository as GitHubRepository } from './Repository'

// TODO: add test
export class PullRequestCreator {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository
  private readonly pullRequestTitleCreator: PullRequestTitleCreator
  private readonly logger: Logger

  constructor ({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    logger
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    pullRequestTitleCreator: PullRequestTitleCreator
    logger: Logger
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.pullRequestTitleCreator = pullRequestTitleCreator
    this.logger = logger
  }

  async create ({
    outdatedPackage,
    branchName
  }: {
    outdatedPackage: OutdatedPackage
    branchName: string
  }): Promise<void> {
    const title = this.pullRequestTitleCreator.create(outdatedPackage)
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
