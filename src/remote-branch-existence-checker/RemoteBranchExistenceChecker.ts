import type { Branch } from '../GitHub'
import { logger } from '../logger'

// TODO: add test
export class RemoteBranchExistenceChecker {
  constructor (private readonly remoteBranchNames: string[]) {}

  static of (remoteBranches: Branch[]): RemoteBranchExistenceChecker {
    const remoteBranchNames = remoteBranches.map(({ name }) => name)
    logger.debug(`remoteBranchNames=${JSON.stringify(remoteBranchNames)}`)
    return new RemoteBranchExistenceChecker(remoteBranchNames)
  }

  check (branchName: string): boolean {
    return this.remoteBranchNames.includes(branchName)
  }
}
