import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { Octokit } from '@octokit/rest'
import { each } from 'test-each'
import { createOctokit } from './createOctokit.js'

await describe('createOctokit', async () => {
  await describe('returns new Octokit instance', async () => {
    const inputs: Array<[host: string, token: string | undefined]> = [
      // for GitHub without token
      ['github.com', undefined],
      // for GitHub with token
      ['github.com', 'test token'],
      // for GitHub Enterprise with token
      ['git.test', 'test token']
    ]
    each(inputs, ({ title }, [host, token]) => {
      void it(title, () => {
        const actual = createOctokit({
          host,
          token
        })

        assert.ok(actual instanceof Octokit)
      })
    })
  })
})
