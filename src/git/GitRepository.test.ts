import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { URL } from 'node:url'
import { each } from 'test-each'
import { GitRepository } from './GitRepository.js'

await describe('GitRepository', async () => {
  await describe('of', async () => {
    await describe('returns new GitRepository instance if repository is valid', () => {
      const inputs: Array<{
        repository: string
        expected: {
          url: URL
          owner: string
          name: string
          isGitHub: boolean
        }
      }> = [
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
      each(inputs, ({ title }, { repository, expected }) => {
        void it(title, () => {
          const actual = GitRepository.of(repository)

          assert.ok(actual instanceof GitRepository)
          assert.strictEqual(actual.url.toString(), expected.url.toString())
          assert.strictEqual(actual.owner, expected.owner)
          assert.strictEqual(actual.name, expected.name)
          assert.strictEqual(actual.isGitHub, expected.isGitHub)
        })
      })
    })

    await describe('returns undefined if repository is invalid', () => {
      const inputs: string[] = [
        '',
        'gist:npm-update-package/example',
        'bitbucket:npm-update-package/example',
        'gitlab:npm-update-package/example',
        'unknown:npm-update-package/example',
        'https://github.com',
        'https://github.com/npm-update-package'
      ]
      each(inputs, ({ title }, repository) => {
        void it(title, () => {
          const actual = GitRepository.of(repository)

          assert.strictEqual(actual, undefined)
        })
      })
    })
  })
})
