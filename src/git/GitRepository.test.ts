import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('if URL is HTTPS', () => {
      describe('if URL is github.com', () => {
        const url = 'https://github.com/npm-update-package/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.host).toBe('github.com')
          expect(repo.owner).toBe('npm-update-package')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://api.github.com')
          expect(repo.isGitHubDotCom).toBe(true)
        })
      })

      describe('if URL is not github.com', () => {
        const url = 'https://git.example.com/npm-update-package/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.host).toBe('git.example.com')
          expect(repo.owner).toBe('npm-update-package')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://git.example.com/api/v3')
          expect(repo.isGitHubDotCom).toBe(false)
        })
      })
    })

    describe('if URL is SSH', () => {
      describe('if URL is github.com', () => {
        const url = 'git@github.com:npm-update-package/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.host).toBe('github.com')
          expect(repo.owner).toBe('npm-update-package')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://api.github.com')
          expect(repo.isGitHubDotCom).toBe(true)
        })
      })

      describe('if URL is not github.com', () => {
        const url = 'git@git.example.com:npm-update-package/npm-update-package.git'

        it('returns new GitRepository instance', () => {
          const repo = GitRepository.of(url)
          expect(repo.host).toBe('git.example.com')
          expect(repo.owner).toBe('npm-update-package')
          expect(repo.name).toBe('npm-update-package')
          expect(repo.apiEndPoint).toBe('https://git.example.com/api/v3')
          expect(repo.isGitHubDotCom).toBe(false)
        })
      })
    })
  })
})
