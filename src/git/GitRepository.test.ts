import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if URL is valid', () => {
      interface TestCase {
        url: string
        expected: {
          host: string
          owner: string
          name: string
          apiEndPoint: string
          isGitHubDotCom: boolean
        }
      }
      const cases: TestCase[] = [
        {
          url: 'https://github.com/npm-update-package/npm-update-package.git',
          expected: {
            host: 'github.com',
            owner: 'npm-update-package',
            name: 'npm-update-package',
            apiEndPoint: 'https://api.github.com',
            isGitHubDotCom: true
          }
        },
        {
          url: 'git@github.com:npm-update-package/npm-update-package.git',
          expected: {
            host: 'github.com',
            owner: 'npm-update-package',
            name: 'npm-update-package',
            apiEndPoint: 'https://api.github.com',
            isGitHubDotCom: true
          }
        },
        {
          url: 'https://git.example.com/npm-update-package/npm-update-package.git',
          expected: {
            host: 'git.example.com',
            owner: 'npm-update-package',
            name: 'npm-update-package',
            apiEndPoint: 'https://git.example.com/api/v3',
            isGitHubDotCom: false
          }
        },
        {
          url: 'git@git.example.com:npm-update-package/npm-update-package.git',
          expected: {
            host: 'git.example.com',
            owner: 'npm-update-package',
            name: 'npm-update-package',
            apiEndPoint: 'https://git.example.com/api/v3',
            isGitHubDotCom: false
          }
        }
      ]

      it.each<TestCase>(cases)('url="$url"', ({ url, expected }) => {
        const actual = GitRepository.of(url)
        expect(actual).toBeInstanceOf(GitRepository)
        expect(actual.host).toBe(expected.host)
        expect(actual.owner).toBe(expected.owner)
        expect(actual.name).toBe(expected.name)
        expect(actual.apiEndPoint).toBe(expected.apiEndPoint)
        expect(actual.isGitHubDotCom).toBe(expected.isGitHubDotCom)
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

      it.each<TestCase>(cases)('url="$url"', ({ url }) => {
        expect(() => GitRepository.of(url)).toThrow(Error)
      })
    })
  })
})
