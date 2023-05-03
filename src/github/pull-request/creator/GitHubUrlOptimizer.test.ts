import { URL } from 'node:url'
import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { Options } from '../../../options'
import { GitHubUrlOptimizer } from './GitHubUrlOptimizer'

describe('GitHubUrlOptimizer', () => {
  describe('optimize', () => {
    describe('returns optimized URL', () => {
      const options = {
        prBodyGithubHost: 'github.test'
      }
      const gitHubUrlOptimizer = new GitHubUrlOptimizer(options as Options)

      it.each([
        ['https://github.com/foo/', new URL('https://github.test/foo/')],
        [new URL('https://github.com/foo/'), new URL('https://github.test/foo/')],
        ['https://foo.github.com/bar/', new URL('https://foo.github.com/bar/')],
        [new URL('https://foo.github.com/bar/'), new URL('https://foo.github.com/bar/')],
        ['https://github.com.test/foo/', new URL('https://github.com.test/foo/')],
        [new URL('https://github.com.test/foo/'), new URL('https://github.com.test/foo/')]
      ])('url=%p', (url, expected) => {
        const actual = gitHubUrlOptimizer.optimize(url)

        expect(actual).toEqual(expected)
      })
    })
  })
})
