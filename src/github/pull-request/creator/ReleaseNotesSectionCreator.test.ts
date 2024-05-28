import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { Release } from '../../releases/Release.js'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer.js'
import { ReleaseNotesSectionCreator } from './ReleaseNotesSectionCreator.js'

await describe('ReleaseNotesSectionCreator', async () => {
  await describe('create', async () => {
    await it('returns release notes section', async ({ mock }) => {
      const optimizeMock = mock.fn<GitHubUrlOptimizer['optimize']>()
      const gitHubUrlOptimizer = {
        optimize: optimizeMock
      } as unknown as GitHubUrlOptimizer
      const releaseNotesSectionCreator = new ReleaseNotesSectionCreator(gitHubUrlOptimizer)
      const releases: Release[] = [
        {
          tag: 'v1.0.0',
          url: 'https://github.com/npm-update-package/example/releases/tag/v1.0.0'
        },
        {
          tag: 'v2.0.0',
          url: 'https://github.com/npm-update-package/example/releases/tag/v2.0.0'
        }
      ]
      // eslint-disable-next-line unicorn/consistent-function-scoping
      const optimizeMockImplementation: GitHubUrlOptimizer['optimize'] = (url) => {
        const newUrl = new URL(typeof url === 'string' ? url : url.toString())
        newUrl.host = 'github.test'
        return newUrl
      }
      optimizeMock.mock.mockImplementation(optimizeMockImplementation)

      const actual = releaseNotesSectionCreator.create(releases)

      assert.strictEqual(actual, `## Release notes

- [v1.0.0](https://github.test/npm-update-package/example/releases/tag/v1.0.0)
- [v2.0.0](https://github.test/npm-update-package/example/releases/tag/v2.0.0)`)
      assert.strictEqual(optimizeMock.mock.callCount(), 2)
      assert.deepStrictEqual(optimizeMock.mock.calls.map(call => call.arguments), [
        ['https://github.com/npm-update-package/example/releases/tag/v1.0.0'],
        ['https://github.com/npm-update-package/example/releases/tag/v2.0.0']
      ])
    })
  })
})
