import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { OutdatedPackage } from '../core/OutdatedPackage.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { SemVer } from '../semver/SemVer.js'
import { SemVerLevel } from '../semver/SemVerLevel.js'
import { createBranchName } from './createBranchName.js'

await describe('createBranchName', async () => {
  await it('returns branch name', () => {
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    const actual = createBranchName(outdatedPackage)

    assert.strictEqual(actual, 'npm-update-package/@npm-update-package/example/v2.0.0')
  })
})
