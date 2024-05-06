import {
  describe,
  expect,
  it
} from '@jest/globals'
import * as app from '../../../app.js'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { createPullRequestMetadata } from './createPullRequestMetadata.js'

describe('createPullRequestMetadata', () => {
  it('returns PullRequestMetadata', () => {
    const outdatedPackages: OutdatedPackage[] = [
      {
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
    ]

    const actual = createPullRequestMetadata(outdatedPackages)

    expect(actual).toEqual({
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
