import type { Branch } from '../../GitHub'

export class BranchFinder {
  constructor (private readonly branches: Branch[]) {}

  findByName (branchName: string): Branch | undefined {
    return this.branches.find(({ name }) => name === branchName)
  }
}
