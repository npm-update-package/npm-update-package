import shuffle from 'lodash/shuffle'
import type { GitRepository } from '../../../git'
import type { GitHub } from '../../GitHub'

// TODO: Add test
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
    sampleSize
  }: {
    pullNumber: number
    reviewers: string[]
    sampleSize?: number
  }): Promise<void> {
    await this.github.requestReviewers({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      pullNumber,
      reviewers: sampleSize !== undefined ? shuffle(reviewers).slice(0, sampleSize) : reviewers
    })
  }
}
