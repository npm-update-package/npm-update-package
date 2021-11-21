import type { Git } from '../git'
import { logger } from '../logger'

// TODO: add test
export class GitBranchCleaner {
  constructor (private readonly git: Git) {}

  async clean (): Promise<void> {
    const currentBranchName = await this.git.getCurrentBranch()
    logger.debug(`currentBranchName=${currentBranchName}`)
    await this.git.checkout('-')
    await this.git.removeBranch(currentBranchName)
  }
}
