import { isPullRequestByNpmUpdatePackage } from './isPullRequestByNpmUpdatePackage'
import type { PullRequest } from './PullRequest'

describe('isPullRequestByNpmUpdatePackage', () => {
  it('returns true if pull request has label `npm-update-package`', () => {
    const pullRequest = {
      labels: [
        {
          name: 'npm-update-package'
        }
      ]
    } as unknown as PullRequest

    expect(isPullRequestByNpmUpdatePackage(pullRequest)).toBe(true)
  })

  it('returns false if pull request does not have label `npm-update-package`', () => {
    const pullRequest = {
      labels: []
    } as unknown as PullRequest

    expect(isPullRequestByNpmUpdatePackage(pullRequest)).toBe(false)
  })
})
