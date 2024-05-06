import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { createOutdatedPackagesTable } from './createOutdatedPackagesTable.js'

describe('createOutdatedPackagesTable', () => {
  it('returns outdated packages table', () => {
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    const actual = createOutdatedPackagesTable(outdatedPackage)

    expect(actual).toBe(`|Package|Dependency type|Level|Current version|New version|
|---|---|---|---|---|
|[@npm-update-package/example](https://www.npmjs.com/package/@npm-update-package/example)|dependencies|major|[\`1.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/1.0.0)|[\`2.0.0\`](https://www.npmjs.com/package/@npm-update-package/example/v/2.0.0)|`)
  })
})
