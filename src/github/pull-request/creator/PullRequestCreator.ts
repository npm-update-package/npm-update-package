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
  private readonly reviewers: string[] | undefined

  constructor ({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    logger,
    reviewers
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    pullRequestTitleCreator: PullRequestTitleCreator
    logger: Logger
    reviewers?: string[]
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.pullRequestTitleCreator = pullRequestTitleCreator
    this.logger = logger
    this.reviewers = reviewers
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
      baseBranch: this.githubRepo.default_branch,
      headBranch: branchName,
      title,
      body
    })
    this.logger.debug(`pullRequest=${JSON.stringify(pullRequest)}`)

    await this.github.addLabels({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issueNumber: pullRequest.number,
      labels: ['npm-update-package']
    })

    if (this.reviewers !== undefined) {
      await this.github.requestReviewers({
        owner: this.gitRepo.owner,
        repo: this.gitRepo.name,
        pullNumber: pullRequest.number,
        reviewers: this.reviewers
      })
    }

    return pullRequest
  }
}
