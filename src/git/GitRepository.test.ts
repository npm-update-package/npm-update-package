// TODO: Replace Jest with Node.js's test runner

import { URL } from 'node:url'
import {
  describe,
  expect,
  it
} from '@jest/globals'
import { GitRepository } from './GitRepository.js'

describe('GitRepository', () => {
  describe('of', () => {
    describe('returns new GitRepository instance if repository is valid', () => {
      interface TestCase {
        repository: string
        expected: {
          url: URL
          owner: string
          name: string
          isGitHub: boolean
        }
      }
      const cases: TestCase[] = [
        {
          repository: 'npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'github:npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'https://github.com/npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'https://github.com/npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git://github.com/npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git://github.com/npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git+https://github.com/npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git+https://github.com/npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git+ssh://github.com/npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git+ssh://github.com/npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git@github.com:npm-update-package/example',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'git@github.com:npm-update-package/example.git',
          expected: {
            url: new URL('https://github.com/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: true
          }
        },
        {
          repository: 'https://git.test/npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'https://git.test/npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git://git.test/npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git://git.test/npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git+https://git.test/npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git+https://git.test/npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git+ssh://git.test/npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git+ssh://git.test/npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git@git.test:npm-update-package/example',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        },
        {
          repository: 'git@git.test:npm-update-package/example.git',
          expected: {
            url: new URL('https://git.test/npm-update-package/example'),
            owner: 'npm-update-package',
            name: 'example',
            isGitHub: false
          }
        }
      ]

      it.each(cases)('repository=$repository', ({ repository, expected }) => {
        const actual = GitRepository.of(repository)

        expect(actual).toBeDefined()
        expect(actual).toBeInstanceOf(GitRepository)
        expect(actual?.url).toEqual(expected.url)
        expect(actual?.owner).toBe(expected.owner)
        expect(actual?.name).toBe(expected.name)
        expect(actual?.isGitHub).toBe(expected.isGitHub)
      })
    })

    describe('returns undefined if repository is invalid', () => {
      type TestCase = string
      const cases: TestCase[] = [
        '',
        'gist:npm-update-package/example',
        'bitbucket:npm-update-package/example',
        'gitlab:npm-update-package/example',
        'unknown:npm-update-package/example',
        'https://github.com',
        'https://github.com/npm-update-package'
      ]

      it.each(cases)('repository=%p', (repository) => {
        const actual = GitRepository.of(repository)

        expect(actual).toBeUndefined()
      })
    })
  })
})
