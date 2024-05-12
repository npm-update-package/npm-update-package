// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { Octokit } from '@octokit/rest'
import { createOctokit } from './createOctokit.js'

describe('createOctokit', () => {
  describe('returns new Octokit instance', () => {
    interface TestCase {
      host: string
      token?: string
    }
    const cases: TestCase[] = [
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

    it.each(cases)('host=$host, token=$token', ({ host, token }) => {
      const actual = createOctokit({
        host,
        token
      })

      expect(actual).toBeInstanceOf(Octokit)
    })
  })
})
