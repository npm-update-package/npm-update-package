import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { URL } from 'node:url'
import type { Options } from '../../../options/Options.js'
import { GitHubUrlOptimizer } from './GitHubUrlOptimizer.js'

await describe('GitHubUrlOptimizer', async () => {
  await describe('optimize', async () => {
    await describe('returns optimized URL', async () => {
      const { each } = await import('test-each')
      const options = {
        prBodyGithubHost: 'github.test'
      } as unknown as Options
      const gitHubUrlOptimizer = new GitHubUrlOptimizer(options)
      const inputs: Array<[url: string | URL, expected: URL]> = [
        ['https://github.com/foo/', new URL('https://github.test/foo/')],
        [new URL('https://github.com/foo/'), new URL('https://github.test/foo/')],
        ['https://foo.github.com/bar/', new URL('https://foo.github.com/bar/')],
        [new URL('https://foo.github.com/bar/'), new URL('https://foo.github.com/bar/')],
        ['https://github.com.test/foo/', new URL('https://github.com.test/foo/')],
        [new URL('https://github.com.test/foo/'), new URL('https://github.com.test/foo/')]
      ]
      each(inputs, ({ title }, [url, expected]) => {
        void it(title, () => {
          const actual = gitHubUrlOptimizer.optimize(url)

          assert.strictEqual(actual.toString(), expected.toString())
        })
      })
    })
  })
})
