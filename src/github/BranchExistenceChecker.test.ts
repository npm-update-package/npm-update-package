import type { Branch } from './Branch'
import { BranchExistenceChecker } from './BranchExistenceChecker'

describe('BranchExistenceChecker', () => {
  describe('of', () => {
    it('returns new BranchExistenceChecker instance', () => {
      const branches = [
        {
          name: 'test_branch_name'
        }
      ] as Branch[]
      const branchExistenceChecker = BranchExistenceChecker.of(branches)
      expect(branchExistenceChecker).toBeInstanceOf(BranchExistenceChecker)
    })
  })

  describe('check', () => {
    const branchNames: string[] = ['test_branch_name']
    const branchExistenceChecker = new BranchExistenceChecker(branchNames)

    it('returns true if branch exists', () => {
      const actual = branchExistenceChecker.check('test_branch_name')
      expect(actual).toBe(true)
    })

    it('returns false if branch exists', () => {
      const actual = branchExistenceChecker.check('not_test_branch_name')
      expect(actual).toBe(false)
    })
  })
})
