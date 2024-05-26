import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { URL } from 'node:url'
import { GitRepository } from '../git/GitRepository.js'
import { extractRepository } from './extractRepository.js'
import type { PackageMetadata } from './PackageMetadata.js'

await describe('extractRepository', async () => {
  await describe('returns GitRepository instance if repository exists', async () => {
    const { each } = await import('test-each')
    const inputs: Array<{
      metadata: PackageMetadata
      expected: {
        url: URL
        owner: string
        name: string
        isGitHub: boolean
      }
    }> = [
      {
        metadata: {
          name: '@npm-update-package/example',
          version: '1.0.0',
          repository: 'npm-update-package/example'
        },
        expected: {
          url: new URL('https://github.com/npm-update-package/example'),
          owner: 'npm-update-package',
          name: 'example',
          isGitHub: true
        }
      },
      {
        metadata: {
          name: '@npm-update-package/example',
          version: '1.0.0',
          repository: {
            url: 'https://github.com/npm-update-package/example'
          }
        },
        expected: {
          url: new URL('https://github.com/npm-update-package/example'),
          owner: 'npm-update-package',
          name: 'example',
          isGitHub: true
        }
      },
      {
        metadata: {
          name: '@npm-update-package/example',
          version: '1.0.0',
          repository: {
            url: 'https://git.test/npm-update-package/example'
          }
        },
        expected: {
          url: new URL('https://git.test/npm-update-package/example'),
          owner: 'npm-update-package',
          name: 'example',
          isGitHub: false
        }
      }
    ]
    each(inputs, ({ title }, { metadata, expected }) => {
      void it(title, () => {
        const actual = extractRepository(metadata)

        assert.ok(actual instanceof GitRepository)
        assert.strictEqual(actual.url.toString(), expected.url.toString())
        assert.strictEqual(actual.owner, expected.owner)
        assert.strictEqual(actual.name, expected.name)
        assert.strictEqual(actual.isGitHub, expected.isGitHub)
      })
    })
  })

  await it('returns undefined if repository does not exist', () => {
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0'
    }

    const actual = extractRepository(metadata)

    assert.strictEqual(actual, undefined)
  })
})
