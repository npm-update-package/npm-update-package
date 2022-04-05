import type { OutdatedPackage } from '../../../core'
import type { GitRepository } from '../../../git'
import { logger } from '../../../logger/singleton'
import type {
  CreatedPullRequest,
  GitHub,
  Repository as GitHubRepository
} from '../../GitHub'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'

export class PullRequestCreator {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository
  private readonly pullRequestTitleCreator: PullRequestTitleCreator
  private readonly pullRequestBodyCreator: PullRequestBodyCreator
  private readonly reviewers: string[] | undefined
  private readonly assignees: string[] | undefined

  constructor ({
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    reviewers,
    assignees
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    pullRequestTitleCreator: PullRequestTitleCreator
    pullRequestBodyCreator: PullRequestBodyCreator
    reviewers?: string[]
    assignees?: string[]
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.pullRequestTitleCreator = pullRequestTitleCreator
    this.pullRequestBodyCreator = pullRequestBodyCreator
    this.reviewers = reviewers
    this.assignees = assignees
  }

  async create ({
    outdatedPackage,
    branchName
  }: {
    outdatedPackage: OutdatedPackage
    branchName: string
  }): Promise<CreatedPullRequest> {
    const title = this.pullRequestTitleCreator.create(outdatedPackage)
    logger.debug(`title=${title}`)

    const body = await this.pullRequestBodyCreator.create(outdatedPackage)
    logger.debug(`body=${body}`)

    const pullRequest = await this.github.createPullRequest({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      baseBranch: this.githubRepo.default_branch,
      headBranch: branchName,
      title,
      body
    })
    logger.debug(`pullRequest=${JSON.stringify(pullRequest)}`)

    await this.github.addLabels({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issueNumber: pullRequest.number,
      labels: ['npm-update-package']
    })

    if (this.assignees !== undefined) {
      await this.github.addAssignees({
        owner: this.gitRepo.owner,
        repo: this.gitRepo.name,
        issueNumber: pullRequest.number,
        assignees: this.assignees
      })
    }

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
