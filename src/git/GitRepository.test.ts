import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if URL is valid', () => {
      interface TestCase {
        url: string
        host: string
        owner: string
        name: string
        apiEndPoint: string
        isGitHubDotCom: boolean
      }
      const cases: TestCase[] = [
        {
          url: 'https://github.com/npm-update-package/npm-update-package.git',
          host: 'github.com',
          owner: 'npm-update-package',
          name: 'npm-update-package',
          apiEndPoint: 'https://api.github.com',
          isGitHubDotCom: true
        },
        {
          url: 'git@github.com:npm-update-package/npm-update-package.git',
          host: 'github.com',
          owner: 'npm-update-package',
          name: 'npm-update-package',
          apiEndPoint: 'https://api.github.com',
          isGitHubDotCom: true
        },
        {
          url: 'https://git.example.com/npm-update-package/npm-update-package.git',
          host: 'git.example.com',
          owner: 'npm-update-package',
          name: 'npm-update-package',
          apiEndPoint: 'https://git.example.com/api/v3',
          isGitHubDotCom: false
        },
        {
          url: 'git@git.example.com:npm-update-package/npm-update-package.git',
          host: 'git.example.com',
          owner: 'npm-update-package',
          name: 'npm-update-package',
          apiEndPoint: 'https://git.example.com/api/v3',
          isGitHubDotCom: false
        }
      ]

      it.each<TestCase>(cases)('url="$url"', ({
        url,
        host,
        owner,
        name,
        apiEndPoint,
        isGitHubDotCom
      }) => {
        const repo = GitRepository.of(url)
        expect(repo).toBeInstanceOf(GitRepository)
        expect(repo.host).toBe(host)
        expect(repo.owner).toBe(owner)
        expect(repo.name).toBe(name)
        expect(repo.apiEndPoint).toBe(apiEndPoint)
        expect(repo.isGitHubDotCom).toBe(isGitHubDotCom)
      })
    })

    describe('throws error if URL is invalid', () => {
      interface TestCase {
        url: string
      }
      const cases: TestCase[] = [
        {
          url: ''
        },
        {
          url: 'https://example.com/'
        }
      ]

      it.each<TestCase>(cases)('url="$url"', ({
        url
      }) => {
        expect(() => GitRepository.of(url)).toThrow(Error)
      })
    })
  })
})
