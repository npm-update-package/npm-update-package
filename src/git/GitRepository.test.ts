import { URL } from 'url'
import { GitRepository } from './GitRepository'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if repository is valid', () => {
      interface TestCase {
        repository: string
        expected: {
          url: URL
          owner: string
          name: string
        }
      }
      const cases: TestCase[] = [
        {
          repository: 'npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'https://github.com/npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'https://github.com/npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'git@github.com:npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'https://git.test/npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'https://git.test/npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        },
        {
          repository: 'git@git.test:npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example'
          }
        }
      ]

      it.each<TestCase>(cases)('repository=$repository', ({ repository, expected }) => {
        const actual = GitRepository.of(repository)
        expect(actual).toBeInstanceOf(GitRepository)
        expect(actual.url).toEqual(expected.url)
        expect(actual.owner).toBe(expected.owner)
        expect(actual.name).toBe(expected.name)
      })
    })

    describe('throws error if repository is invalid', () => {
      type TestCase = string
      const cases: TestCase[] = [
        '',
        'https://github.com/',
        'git@github.com',
        'https://git.test/',
        'git@git.test'
      ]

      it.each<TestCase>(cases)('repository=%p', (repository) => {
        expect(() => GitRepository.of(repository)).toThrow(Error)
      })
    })
  })
})
