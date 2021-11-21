import { logger } from '../logger'
import type { Git } from './Git'

// TODO: add test
export class BranchCleaner {
  constructor (private readonly git: Git) {}

  async clean (): Promise<void> {
    const currentBranchName = await this.git.getCurrentBranch()
    logger.debug(`currentBranchName=${currentBranchName}`)
    await this.git.checkout('-')
    await this.git.removeBranch(currentBranchName)
  }
}
