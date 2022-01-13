import type { Branch } from './Branch'

export class BranchExistenceChecker {
  constructor (private readonly branchNames: string[]) {}

  static of (branches: Branch[]): BranchExistenceChecker {
    const branchNames = branches.map(({ name }) => name)
    return new BranchExistenceChecker(branchNames)
  }

  check (branchName: string): boolean {
    return this.branchNames.includes(branchName)
  }
}
