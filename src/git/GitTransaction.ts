import { logger } from '../logger'
import type { Git } from './Git'

// TODO: Add test
export class GitTransaction {
  private readonly git: Git
  private readonly branchName: string
  private readonly files: string[]

  constructor ({
    git,
    branchName,
    files
  }: {
    git: Git
    branchName: string
    files: string[]
  }) {
    this.git = git
    this.branchName = branchName
    this.files = files
  }

  async run<T> (operation: (params: {
    git: Git
    branchName: string
    files: string[]
  }) => Promise<T>): Promise<T> {
    await this.git.createBranch(this.branchName)
    logger.info(`${this.branchName} branch has created.`)

    try {
      return await operation({
        git: this.git,
        branchName: this.branchName,
        files: this.files
      })
    } finally {
      await this.rollback()
    }
  }

  private async rollback (): Promise<void> {
    await this.git.restore(...this.files)
    await this.git.switch('-')
    await this.git.removeBranch(this.branchName)
    logger.info(`${this.branchName} branch has removed.`)
  }
}
