import { SemVerLevel } from '../../../semver'
import {
  isPullRequestMetadata,
  type PullRequestMetadata
} from './PullRequestMetadata'

describe('isPullRequestMetadata', () => {
  const metadata: PullRequestMetadata = {
    version: '1.0.0',
    packages: [
      {
        name: '@npm-update-package/example',
        currentVersion: '1.0.0',
        newVersion: '2.0.0',
        level: SemVerLevel.Major
      }
    ]
  }

  it('returns true if value is PullRequestMetadata', () => {
    expect(isPullRequestMetadata(metadata)).toBe(true)
  })

  it('returns false if value is not PullRequestMetadata', () => {
    expect(isPullRequestMetadata(JSON.stringify(metadata))).toBe(false)
  })
})
