import type { Branch } from '../../GitHub'
import { BranchFinder } from './BranchFinder'

describe('BranchFinder', () => {
  describe('findByName', () => {
    const branch = {
      name: 'test_branch_name'
    } as unknown as Branch
    const branchFinder = new BranchFinder([branch])

    it('returns branch if exists', () => {
      const actual = branchFinder.findByName('test_branch_name')
      expect(actual).toBe(branch)
    })

    it('returns undefined if does not exists', () => {
      const actual = branchFinder.findByName('not_test_branch_name')
      expect(actual).toBeUndefined()
    })
  })
})
