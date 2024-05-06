import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import { logger } from '../../../logger/logger.js'
import type { Options } from '../../../options/Options.js'
import type {
  CreatedPullRequest,
  GitHub,
  Repository as GitHubRepository
} from '../../GitHub.js'
import type { AssigneesAdder } from './AssigneesAdder.js'
import type { LabelsAdder } from './LabelsAdder.js'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator.js'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator.js'
import type { ReviewersAdder } from './ReviewersAdder.js'
export class PullRequestCreator {
  private readonly options: Options
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository
  private readonly pullRequestTitleCreator: PullRequestTitleCreator
  private readonly pullRequestBodyCreator: PullRequestBodyCreator
  private readonly labelsAdder: LabelsAdder
  private readonly assigneesAdder: AssigneesAdder
  private readonly reviewersAdder: ReviewersAdder

  constructor ({
    options,
    github,
    gitRepo,
    githubRepo,
    pullRequestTitleCreator,
    pullRequestBodyCreator,
    labelsAdder,
    assigneesAdder,
    reviewersAdder
  }: {
    options: Options
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
    pullRequestTitleCreator: PullRequestTitleCreator
    pullRequestBodyCreator: PullRequestBodyCreator
    labelsAdder: LabelsAdder
    assigneesAdder: AssigneesAdder
    reviewersAdder: ReviewersAdder
  }) {
    this.options = options
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
    this.pullRequestTitleCreator = pullRequestTitleCreator
    this.pullRequestBodyCreator = pullRequestBodyCreator
    this.labelsAdder = labelsAdder
    this.assigneesAdder = assigneesAdder
    this.reviewersAdder = reviewersAdder
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
      body,
      draft: this.options.draftPr
    })
    logger.debug(`pullRequest=${JSON.stringify(pullRequest)}`)

    await this.labelsAdder.add(pullRequest.number)

    if (this.options.assignees !== undefined) {
      await this.assigneesAdder.add({
        issueNumber: pullRequest.number,
        assignees: this.options.assignees,
        size: this.options.assigneesSampleSize
      })
    }

    if (this.options.reviewers !== undefined) {
      await this.reviewersAdder.add({
        pullNumber: pullRequest.number,
        reviewers: this.options.reviewers,
        size: this.options.reviewersSampleSize
      })
    }

    return pullRequest
  }
}
