import type { GitRepository } from '../../../git'
import { isNotFoundError } from '../../errors'
import type { GitHub } from '../../GitHub'

export interface Label {
  name: string
  description?: string
  color?: string
}

// TODO: Add test
export class LabelCreator {
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

  async createIfNotExists ({
    name,
    description,
    color
  }: Label): Promise<void> {
    try {
      await this.github.fetchLabel({
        owner: this.gitRepo.owner,
        repo: this.gitRepo.name,
        label: name
      })
    } catch (e) {
      if (isNotFoundError(e)) {
        await this.github.createLabel({
          owner: this.gitRepo.owner,
          repo: this.gitRepo.name,
          name,
          description,
          color
        })
      } else {
        throw e
      }
    }
  }
}
