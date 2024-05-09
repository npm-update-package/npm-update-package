import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { createRequirePackageJSON } from '../../../util/createRequirePackageJSON.js'
import { createPullRequestMetadata } from './createPullRequestMetadata.js'

const requirePackageJSON = createRequirePackageJSON(import.meta.url)
const pkg = requirePackageJSON('../../../../package.json')

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
