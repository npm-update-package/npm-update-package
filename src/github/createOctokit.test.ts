import { Octokit } from '@octokit/rest'
import { GitRepository } from '../git'
import { createOctokit } from './createOctokit'

describe('createOctokit', () => {
  const token = 'token'

  it('returns new Octokit instance for GitHub.com if repository is GitHub.com', () => {
    const repository = GitRepository.of('https://github.com/npm-update-package/npm-update-package.git')
    const octokit = createOctokit({
      repository,
      token
    })

    expect(octokit).toBeInstanceOf(Octokit)
  })

  it('returns new Octokit instance for GitHub Enterprise if repository is not GitHub.com', () => {
    const repository = GitRepository.of('https://git.example.com/npm-update-package/npm-update-package.git')
    const octokit = createOctokit({
      repository,
      token
    })

    expect(octokit).toBeInstanceOf(Octokit)
  })
})
