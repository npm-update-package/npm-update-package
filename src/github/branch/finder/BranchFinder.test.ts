import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { Branch } from '../../GitHub.js'
import { BranchFinder } from './BranchFinder.js'

await describe('BranchFinder', async () => {
  await describe('findByName', async () => {
    const branch = {
      name: 'main'
    } as unknown as Branch
    const branches: Branch[] = [branch]
    const branchFinder = new BranchFinder(branches)

    await it('returns branch if exists', () => {
      const actual = branchFinder.findByName('main')

      assert.strictEqual(actual, branch)
    })

    await it('returns undefined if branch does not exist', () => {
      const actual = branchFinder.findByName('develop')

      assert.strictEqual(actual, undefined)
    })
  })
})
