import type { GitRepository } from '../git'
import type { Logger } from '../logger'
import type { OutdatedPackage } from '../ncu'
import type { GitHub } from './GitHub'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'
import type { Repository as GitHubRepository } from './Repository'

export class PullRequestCreator {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository
  private readonly pullRequestTitleCreator: PullRequestTitleCreator
  private readonly pullRequestBodyCreator: PullRequestBodyCreator
  private readonly logger: Logger

  constructor ({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    logger
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    pullRequestTitleCreator: PullRequestTitleCreator
    pullRequestBodyCreator: PullRequestBodyCreator
    logger: Logger
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.pullRequestTitleCreator = pullRequestTitleCreator
    this.pullRequestBodyCreator = pullRequestBodyCreator
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

    const body = this.pullRequestBodyCreator.create(outdatedPackage)
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
