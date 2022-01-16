import { Octokit } from '@octokit/rest'
import { GitRepository } from '../git'
import { createOctokit } from './createOctokit'

describe('createOctokit', () => {
  const token = 'token'

  describe('if repository is GitHub.com', () => {
    const repository = GitRepository.of('https://github.com/npm-update-package/npm-update-package.git')

    it('returns new Octokit instance for GitHub.com', () => {
      const octokit = createOctokit({
        repository,
        token
      })

      expect(octokit).toBeInstanceOf(Octokit)
    })
  })

  describe('if repository is not GitHub.com', () => {
    const repository = GitRepository.of('https://git.example.com/npm-update-package/npm-update-package.git')

    it('returns new Octokit instance for GitHub Enterprise', () => {
      const octokit = createOctokit({
        repository,
        token
      })

      expect(octokit).toBeInstanceOf(Octokit)
    })
  })
})
