import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('if URL is HTTPS', () => {
      describe('if URL is github.com', () => {
        const url = 'https://github.com/munierujp/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.url).toBe('https://github.com/munierujp/npm-update-package.git')
          expect(repo.host).toBe('github.com')
          expect(repo.owner).toBe('munierujp')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://api.github.com')
          expect(repo.isGitHubDotCom).toBe(true)
        })
      })

      describe('if URL is not github.com', () => {
        const url = 'https://git.example.com/munierujp/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.url).toBe('https://git.example.com/munierujp/npm-update-package.git')
          expect(repo.host).toBe('git.example.com')
          expect(repo.owner).toBe('munierujp')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://git.example.com/api/v3')
          expect(repo.isGitHubDotCom).toBe(false)
        })
      })
    })

    describe('if URL is SSH', () => {
      describe('if URL is github.com', () => {
        const url = 'git@github.com:munierujp/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.url).toBe('https://github.com/munierujp/npm-update-package.git')
          expect(repo.host).toBe('github.com')
          expect(repo.owner).toBe('munierujp')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://api.github.com')
          expect(repo.isGitHubDotCom).toBe(true)
        })
      })

      describe('if URL is not github.com', () => {
        const url = 'git@git.example.com:munierujp/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.url).toBe('https://git.example.com/munierujp/npm-update-package.git')
          expect(repo.host).toBe('git.example.com')
          expect(repo.owner).toBe('munierujp')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://git.example.com/api/v3')
          expect(repo.isGitHubDotCom).toBe(false)
        })
      })
    })
  })
})
