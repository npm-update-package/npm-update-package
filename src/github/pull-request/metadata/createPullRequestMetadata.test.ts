import { app } from '../../../app'
import type { OutdatedPackage } from '../../../core'
import { SemVer } from '../../../semver'
import { createPullRequestMetadata } from './createPullRequestMetadata'

describe('createPullRequestMetadata', () => {
  it('returns PullRequestMetadata', () => {
    const outdatedPackages: OutdatedPackage[] = [
      {
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: 'major'
      }
    ]
    const metadata = createPullRequestMetadata(outdatedPackages)

    expect(metadata).toEqual({
      version: app.version,
      packages: [
        {
          name: '@typescript-eslint/eslint-plugin',
          currentVersion: '1.0.0',
          newVersion: '2.0.0',
          level: 'major'
        }
      ]
    })
  })
})
