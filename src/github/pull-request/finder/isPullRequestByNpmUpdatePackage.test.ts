import type { PullRequest } from '../../GitHub'
import { isPullRequestByNpmUpdatePackage } from './isPullRequestByNpmUpdatePackage'

describe('isPullRequestByNpmUpdatePackage', () => {
  describe('returns whether pull request is by npm-update-package', () => {
    interface TestCase {
      pullRequest: PullRequest
      expected: boolean
    }
    const cases: TestCase[] = [
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

    it.each(cases)('pullRequest=$pullRequest', ({ pullRequest, expected }) => {
      const actual = isPullRequestByNpmUpdatePackage(pullRequest)

      expect(actual).toBe(expected)
    })
  })
})
