import type { GitRepository } from '../../../git/GitRepository.js'
import { logger } from '../../../logger/logger.js'
import { isNotFoundError } from '../../errors/NotFoundError.js'
import type {
  Label,
  GitHub
} from '../../GitHub.js'

// TODO: Split into multiple classes and functions
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

  async create ({
    name,
    description,
    color
  }: {
    name: string
    description?: string
    color?: string
  }): Promise<void> {
    const label = await this.fetchLabel(name)

    if (label !== undefined) {
      logger.info(`Skip creating ${name} label because it already exists.`)
      return
    }

    await this.createLabel({
      name,
      description,
      color
    })
    logger.info(`${name} label has created.`)
  }

  private async createLabel ({
    name,
    description,
    color
  }: {
    name: string
    description?: string
    color?: string
  }): Promise<void> {
    await this.github.createLabel({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      name,
      description,
      color
    })
  }

  private async fetchLabel (name: string): Promise<Label | undefined> {
    try {
      return await this.github.fetchLabel({
        owner: this.gitRepo.owner,
        repo: this.gitRepo.name,
        name
      })
    } catch (error) {
      if (isNotFoundError(error)) {
        logger.warn(error)
        return undefined
      } else {
        throw error
      }
    }
  }
}
