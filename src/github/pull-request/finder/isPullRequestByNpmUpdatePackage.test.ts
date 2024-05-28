import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import type { PullRequest } from '../../GitHub.js'
import { isPullRequestByNpmUpdatePackage } from './isPullRequestByNpmUpdatePackage.js'

await describe('isPullRequestByNpmUpdatePackage', async () => {
  await describe('returns whether pull request is by npm-update-package', async () => {
    const inputs: Array<{
      pullRequest: PullRequest
      expected: boolean
    }> = [
      {
        pullRequest: {
          labels: [
            {
              name: 'npm-update-package'
            }
          ]
        } as unknown as PullRequest,
        expected: true
      },
      {
        pullRequest: {
          labels: []
        } as unknown as PullRequest,
        expected: false
      }
    ]
    each(inputs, ({ title }, { pullRequest, expected }) => {
      void it(title, () => {
        const actual = isPullRequestByNpmUpdatePackage(pullRequest)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
