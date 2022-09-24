import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { Branch } from '../../GitHub'
import { BranchFinder } from './BranchFinder'

describe('BranchFinder', () => {
  describe('findByName', () => {
    const branch = {
      name: 'foo'
    } as unknown as Branch
    const branches = [branch]
    const branchFinder = new BranchFinder(branches)

    it('returns branch if exists', () => {
      const actual = branchFinder.findByName('foo')

      expect(actual).toBe(branch)
    })

    it('returns undefined if branch does not exist', () => {
      const actual = branchFinder.findByName('bar')

      expect(actual).toBeUndefined()
    })
  })
})
