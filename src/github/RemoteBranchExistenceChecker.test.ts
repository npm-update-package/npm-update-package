import type { Branch } from './Branch'
import { RemoteBranchExistenceChecker } from './RemoteBranchExistenceChecker'

describe('RemoteBranchExistenceChecker', () => {
  describe('of', () => {
    it('returns new RemoteBranchExistenceChecker instance', () => {
      const remoteBranches = [
        {
          name: 'test_branch_name'
        }
      ] as Branch[]
      const remoteBranchExistenceChecker = RemoteBranchExistenceChecker.of(remoteBranches)
      expect(remoteBranchExistenceChecker).toBeInstanceOf(RemoteBranchExistenceChecker)
    })
  })

  describe('check', () => {
    const remoteBranchNames: string[] = ['test_branch_name']
    const remoteBranchExistenceChecker = new RemoteBranchExistenceChecker(remoteBranchNames)

    it('returns true if branch exists', () => {
      const actual = remoteBranchExistenceChecker.check('test_branch_name')
      expect(actual).toBe(true)
    })

    it('returns false if branch exists', () => {
      const actual = remoteBranchExistenceChecker.check('not_test_branch_name')
      expect(actual).toBe(false)
    })
  })
})
