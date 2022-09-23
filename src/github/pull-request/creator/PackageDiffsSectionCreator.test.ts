import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals'
import type { OutdatedPackage } from '../../../core'
import { GitRepository } from '../../../git'
import { DependencyType } from '../../../package-json'
import { SemVer, SemVerLevel } from '../../../semver'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer'
import { PackageDiffsSectionCreator } from './PackageDiffsSectionCreator'

describe('PackageDiffsSectionCreator', () => {
  describe('create', () => {
    const optimizeMock = jest.fn<GitHubUrlOptimizer['optimize']>()
    const gitHubUrlOptimizer = {
      optimize: optimizeMock
    } as unknown as GitHubUrlOptimizer
    const packageDiffsSectionCreator = new PackageDiffsSectionCreator(gitHubUrlOptimizer)

    beforeEach(() => {
      optimizeMock.mockImplementation((url) => {
        const newUrl = new URL(typeof url === 'string' ? url : url.toString())
        newUrl.host = 'github.test'
        return newUrl
      })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    describe('returns Package Diffs section', () => {
      const outdatedPackage: OutdatedPackage = {
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
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
- [Package Diff](https://diff.intrinsic.com/@npm-update-package/example/1.0.0/2.0.0)
- [Renovate Bot Package Diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0)`
        },
        // Repository exists
        {
          gitRepo: GitRepository.of('https://github.com/npm-update-package/example'),
          expected: `## Package diffs

- [GitHub](https://github.test/npm-update-package/example/compare/v1.0.0...v2.0.0)
- [npmfs](https://npmfs.com/compare/@npm-update-package/example/1.0.0/2.0.0)
- [Package Diff](https://diff.intrinsic.com/@npm-update-package/example/1.0.0/2.0.0)
- [Renovate Bot Package Diff](https://renovatebot.com/diffs/npm/@npm-update-package/example/1.0.0/2.0.0)`
        }
      ]

      it.each(cases)('gitRepo=$gitRepo', async ({
        gitRepo,
        expected
      }) => {
        const actual = packageDiffsSectionCreator.create({
          outdatedPackage,
          gitRepo
        })

        expect.assertions(2)
        expect(actual).toBe(expected)

        if (gitRepo?.isGitHub === true) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(optimizeMock).toHaveBeenCalledWith('https://github.com/npm-update-package/example/compare/v1.0.0...v2.0.0')
        } else {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(optimizeMock).not.toHaveBeenCalled()
        }
      })
    })
  })
})
