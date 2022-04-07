import shuffle from 'lodash/shuffle'
import type { GitRepository } from '../../../git'
import type { GitHub } from '../../GitHub'

// TODO: Add test
export class AssigneesAdder {
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
    issueNumber,
    assignees,
    sampleSize
  }: {
    issueNumber: number
    assignees: string[]
    sampleSize?: number
  }): Promise<void> {
    await this.github.addAssignees({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issueNumber,
      assignees: sampleSize !== undefined ? shuffle(assignees).slice(0, sampleSize) : assignees
    })
  }
}
