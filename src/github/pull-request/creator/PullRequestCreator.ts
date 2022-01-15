import type { OutdatedPackage } from '../../../core'
import type { GitRepository } from '../../../git'
import type { Logger } from '../../../logger'
import type {
  CreatedPullRequest,
  GitHub,
  Repository as GitHubRepository
} from '../../GitHub'
import { createPullRequestBody } from './createPullRequestBody'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'

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
  }): Promise<CreatedPullRequest> {
    const title = this.pullRequestTitleCreator.create(outdatedPackage)
    this.logger.debug(`title=${title}`)

    const body = createPullRequestBody(outdatedPackage)
    this.logger.debug(`body=${body}`)

    const pullRequest = await this.github.createPullRequest({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      base: this.githubRepo.default_branch,
      head: branchName,
      title,
      body
    })
    this.logger.debug(`pullRequest=${JSON.stringify(pullRequest)}`)

    await this.github.addLabels({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issue_number: pullRequest.number,
      labels: ['npm-update-package']
    })
    return pullRequest
  }
}
