import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { createRequirePackageJSON } from '../../../util/createRequirePackageJSON.js'
import { createPullRequestMetadata } from './createPullRequestMetadata.js'

const pkg = createRequirePackageJSON(import.meta.url)('../../../../package.json')

await describe('createPullRequestMetadata', async () => {
  await it('returns PullRequestMetadata', () => {
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

    assert.deepStrictEqual(actual, {
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
