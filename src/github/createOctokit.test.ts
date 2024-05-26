import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { Octokit } from '@octokit/rest'
import { createOctokit } from './createOctokit.js'

await describe('createOctokit', async () => {
  await describe('returns new Octokit instance', async () => {
    const { each } = await import('test-each')
    const inputs: Array<{
      host: string
      token?: string
    }> = [
      // for GitHub without token
      {
        host: 'github.com',
        token: undefined
      },
      // for GitHub with token
      {
        host: 'github.com',
        token: 'test token'
      },
      // for GitHub Enterprise with token
      {
        host: 'git.test',
        token: 'test token'
      }
    ]

    each(inputs, ({ title }, { host, token }) => {
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
