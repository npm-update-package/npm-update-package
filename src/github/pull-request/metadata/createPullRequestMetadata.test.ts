import {
  describe,
  expect,
  it
} from '@jest/globals'
import pkg from '../../../../package.json'
import type { OutdatedPackage } from '../../../core'
import { DependencyType } from '../../../package-json'
import {
  SemVer,
  SemVerLevel
} from '../../../semver'
import { createPullRequestMetadata } from './createPullRequestMetadata'

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
      version: pkg.version,
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
