import type { OutdatedPackage } from '../../../core'
import { GitRepository } from '../../../git'
import { DependencyType } from '../../../package-json'
import {
  SemVer,
  SemVerLevel
} from '../../../semver'
import { createPackageDiffsSection } from './createPackageDiffsSection'

describe('createPackageDiffsSection', () => {
  describe('returns Package Diffs section', () => {
    interface TestCase {
      gitRepo?: GitRepository
      expected: string
    }
    const cases: TestCase[] = [
      // Repository does not exist
      {
        gitRepo: undefined,
        expected: `## Package diffs

- [npmfs](https://npmfs.com/compare/@npm-update-package/example/1.0.0/2.0.0)
- [Renovate Bot Package Diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0)`
      },
      // Repository exists
      {
        gitRepo: GitRepository.of('https://github.com/npm-update-package/example'),
        expected: `## Package diffs

- [GitHub](https://togithub.com/npm-update-package/example/compare/v1.0.0...v2.0.0)
- [npmfs](https://npmfs.com/compare/@npm-update-package/example/1.0.0/2.0.0)
- [Renovate Bot Package Diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0)`
      }
    ]
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    it.each(cases)('gitRepo=$gitRepo', async ({
      gitRepo,
      expected
    }) => {
      const actual = createPackageDiffsSection({
        outdatedPackage,
        gitRepo
      })

      expect(actual).toBe(expected)
    })
  })
})
