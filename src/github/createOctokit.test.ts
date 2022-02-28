import { Octokit } from '@octokit/rest'
import { createOctokit } from './createOctokit'

interface TestCase {
  host: string
  token?: string
}

describe('createOctokit', () => {
  describe('returns new Octokit instance', () => {
    const cases: TestCase[] = [
      // for GitHub.com without token
      {
        host: 'github.com',
        token: undefined
      },
      // for GitHub.com with token
      {
        host: 'github.com',
        token: 'test token'
      },
      // for GitHub Enterprise with token
      {
        host: 'git.example.com',
        token: 'test token'
      }
    ]

    it.each<TestCase>(cases)('host=$host, token=$token', ({ host, token }) => {
      const octokit = createOctokit({
        host,
        token
      })
      expect(octokit).toBeInstanceOf(Octokit)
    })
  })
})
