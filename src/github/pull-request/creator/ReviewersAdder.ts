import type { GitRepository } from '../../../git/GitRepository.js'
import { sampleSize } from '../../../util/sampleSize.js'
import type { GitHub } from '../../GitHub.js'

export class ReviewersAdder {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository

  constructor ({
    github,
    gitRepo
  }: {
    github: GitHub
    gitRepo: GitRepository
  }) {
    this.github = github
    this.gitRepo = gitRepo
  }

  async add ({
    pullNumber,
    reviewers,
    size
  }: {
    pullNumber: number
    reviewers: string[]
    size?: number
  }): Promise<void> {
    await this.github.requestReviewers({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      pullNumber,
      reviewers: size === undefined ? reviewers : sampleSize(reviewers, size)
    })
  }
}
