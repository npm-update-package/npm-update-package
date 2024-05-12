import sampleSize from 'lodash/sampleSize.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { GitHub } from '../../GitHub.js'

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
    size
  }: {
    issueNumber: number
    assignees: string[]
    size?: number
  }): Promise<void> {
    await this.github.addAssignees({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issueNumber,
      assignees: size === undefined ? assignees : sampleSize(assignees, size)
    })
  }
}
