import type { GitRepository } from '../../../git'
import type { Logger } from '../../../logger'
import { isNotFoundError } from '../../errors'
import type {
  GitHub,
  Label
} from '../../GitHub'

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
  }: {
    name: string
    description?: string
    color?: string
  }): Promise<void> {
    const label = await this.fetchLabel(name)

    if (label !== undefined) {
      this.logger.info(`Skip creating ${name} label because it already exists.`)
      return
    }

    await this.github.createLabel({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      name,
      description,
      color
    })
    this.logger.info(`${name} label has created.`)
  }

  private async fetchLabel (name: string): Promise<Label | undefined> {
    try {
      return await this.github.fetchLabel({
        owner: this.gitRepo.owner,
        repo: this.gitRepo.name,
        name
      })
    } catch (e) {
      if (isNotFoundError(e)) {
        this.logger.warn(e)
        return undefined
      } else {
        throw e
      }
    }
  }
}
