import { URL } from 'url'
import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if URL is valid', () => {
      type TestCase = [
        string,
        {
          url: URL
          owner: string
          name: string
        }
      ]
      const cases: TestCase[] = [
        [
          'https://github.com/npm-update-package/example.git',
          {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        ],
        [
          'git@github.com:npm-update-package/example.git',
          {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        ],
        [
          'https://git.example.com/npm-update-package/example.git',
          {
            url: new URL('https://git.example.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        ],
        [
          'git@git.example.com:npm-update-package/example.git',
          {
            url: new URL('https://git.example.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        ]
      ]

      it.each<TestCase>(cases)('url=%p', (url, expected) => {
        const actual = GitRepository.of(url)
        expect(actual).toBeInstanceOf(GitRepository)
        expect(actual.url).toEqual(expected.url)
        expect(actual.owner).toBe(expected.owner)
        expect(actual.name).toBe(expected.name)
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
