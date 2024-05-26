import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { GitRepository } from '../../../git/GitRepository.js'
import { DependencyType } from '../../../package-json/DependencyType.js'
import { SemVer } from '../../../semver/SemVer.js'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer.js'
import { PackageDiffsSectionCreator } from './PackageDiffsSectionCreator.js'

await describe('PackageDiffsSectionCreator', async () => {
  await describe('create', async () => {
    await describe('returns Package Diffs section', async () => {
      const outdatedPackage: OutdatedPackage = {
        name: '@npm-update-package/example',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
      const inputs: Array<{
        gitRepo?: GitRepository
        expected: string
      }> = [
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
      each(inputs, ({ title }, { gitRepo, expected }) => {
        void it(title, ({ mock }) => {
          const optimizeMock = mock.fn<GitHubUrlOptimizer['optimize']>()
          const gitHubUrlOptimizer = {
            optimize: optimizeMock
          } as unknown as GitHubUrlOptimizer
          const packageDiffsSectionCreator = new PackageDiffsSectionCreator(gitHubUrlOptimizer)
          // eslint-disable-next-line unicorn/consistent-function-scoping
          const optimizeMockImplementation: GitHubUrlOptimizer['optimize'] = (url) => {
            const newUrl = new URL(typeof url === 'string' ? url : url.toString())
            newUrl.host = 'github.test'
            return newUrl
          }
          optimizeMock.mock.mockImplementation(optimizeMockImplementation)

          const actual = packageDiffsSectionCreator.create({
            outdatedPackage,
            gitRepo
          })

          assert.strictEqual(actual, expected)

          if (gitRepo?.isGitHub === true) {
            assert.strictEqual(optimizeMock.mock.callCount(), 1)
            assert.deepStrictEqual(optimizeMock.mock.calls.map(call => call.arguments), [
              ['https://github.com/npm-update-package/example/compare/v1.0.0...v2.0.0']
            ])
          } else {
            assert.strictEqual(optimizeMock.mock.callCount(), 0)
            assert.deepStrictEqual(optimizeMock.mock.calls.map(call => call.arguments), [])
          }
        })
      })
    })
  })
})
