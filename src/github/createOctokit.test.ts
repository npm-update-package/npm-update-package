import { Octokit } from '@octokit/rest'
import { createOctokit } from './createOctokit'

describe('createOctokit', () => {
  const token = 'token'

  it('returns new Octokit instance for GitHub.com if repository is GitHub.com', () => {
    const host = 'github.com'
    const octokit = createOctokit({
      host,
      token
    })

    expect(octokit).toBeInstanceOf(Octokit)
  })

  it('returns new Octokit instance for GitHub Enterprise if repository is not GitHub.com', () => {
    const host = 'github.com'
    const octokit = createOctokit({
      host,
      token
    })

    expect(octokit).toBeInstanceOf(Octokit)
  })
})
