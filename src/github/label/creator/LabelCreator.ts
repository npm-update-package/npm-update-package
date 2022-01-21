import type { GitRepository } from '../../../git'
import type { Logger } from '../../../logger'
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
  private readonly logger: Logger

  constructor ({
    github,
    gitRepo,
    logger
  }: {
    github: GitHub
    gitRepo: GitRepository
    logger: Logger
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.logger = logger
  }

  async create ({
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
        this.logger.info(`${name} label has created.`)
      } else {
        throw e
      }
    }
  }
}
