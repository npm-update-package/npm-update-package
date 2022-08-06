import type { GitRepository } from '../../../git'
import type { Options } from '../../../options'
import type { GitHub } from '../../GitHub'

const DEFAULT_LABELS = ['npm-update-package']

export class LabelsAdder {
  private readonly options: Options
  private readonly github: GitHub
  private readonly gitRepo: GitRepository

  constructor ({
    options,
    github,
    gitRepo
  }: {
    options: Options
    github: GitHub
    gitRepo: GitRepository
  }) {
    this.options = options
    this.github = github
    this.gitRepo = gitRepo
  }

  async add (issueNumber: number): Promise<void> {
    const labels = this.options.additionalLabels !== undefined ? [...DEFAULT_LABELS, ...this.options.additionalLabels] : DEFAULT_LABELS
    await this.github.addLabels({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      issueNumber,
      labels
    })
  }
}
