import { URL } from 'url'
import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if URL is valid', () => {
      type TestCase = [
        string,
        {
          url: URL
          host: string
          owner: string
          name: string
          apiEndPoint: string
          isGitHubDotCom: boolean
        }
      ]
      const cases: TestCase[] = [
        [
          'https://github.com/npm-update-package/example.git',
          {
            url: new URL('https://github.com/npm-update-package/example'),
            host: 'github.com',
            owner: 'npm-update-package',
            name: 'example',
            apiEndPoint: 'https://api.github.com',
            isGitHubDotCom: true
          }
        ],
        [
          'git@github.com:npm-update-package/example.git',
          {
            url: new URL('https://github.com/npm-update-package/example'),
            host: 'github.com',
            owner: 'npm-update-package',
            name: 'example',
            apiEndPoint: 'https://api.github.com',
            isGitHubDotCom: true
          }
        ],
        [
          'https://git.example.com/npm-update-package/example.git',
          {
            url: new URL('https://git.example.com/npm-update-package/example'),
            host: 'git.example.com',
            owner: 'npm-update-package',
            name: 'example',
            apiEndPoint: 'https://git.example.com/api/v3',
            isGitHubDotCom: false
          }
        ],
        [
          'git@git.example.com:npm-update-package/example.git',
          {
            url: new URL('https://git.example.com/npm-update-package/example'),
            host: 'git.example.com',
            owner: 'npm-update-package',
            name: 'example',
            apiEndPoint: 'https://git.example.com/api/v3',
            isGitHubDotCom: false
          }
        ]
      ]

      it.each<TestCase>(cases)('url=%p', (url, expected) => {
        const actual = GitRepository.of(url)
        expect(actual).toBeInstanceOf(GitRepository)
        expect(actual.url).toEqual(expected.url)
        expect(actual.host).toBe(expected.host)
        expect(actual.owner).toBe(expected.owner)
        expect(actual.name).toBe(expected.name)
        expect(actual.apiEndPoint).toBe(expected.apiEndPoint)
        expect(actual.isGitHubDotCom).toBe(expected.isGitHubDotCom)
      })
    })

    describe('throws error if URL is invalid', () => {
      type TestCase = string
      const cases: TestCase[] = [
        '',
        'https://example.com/'
      ]

      it.each<TestCase>(cases)('url=%p', (url) => {
        expect(() => GitRepository.of(url)).toThrow(Error)
      })
    })
  })
})
