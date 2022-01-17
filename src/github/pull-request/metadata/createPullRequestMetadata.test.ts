import { app } from '../../../app'
import type { OutdatedPackage } from '../../../core'
import { SemVer } from '../../../semver'
import { createPullRequestMetadata } from './createPullRequestMetadata'

describe('createPullRequestMetadata', () => {
  it('returns PullRequestMetadata', () => {
    const outdatedPackages: OutdatedPackage[] = [
      {
        name: '@npm-update-package/example',
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
          name: '@npm-update-package/example',
          currentVersion: '1.0.0',
          newVersion: '2.0.0',
          level: 'major'
        }
      ]
    })
  })
})
