import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { GitRepository } from '../git/GitRepository.js'
import { extractRepository } from './extractRepository.js'
import type { PackageMetadata } from './PackageMetadata.js'

await describe('extractRepository', async () => {
  await describe('returns GitRepository instance if repository exists', async () => {
    const inputs: Array<{
      metadata: PackageMetadata
      expected: {
        url: string
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
          url: 'https://github.com/npm-update-package/example',
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
          url: 'https://github.com/npm-update-package/example',
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
          url: 'https://git.test/npm-update-package/example',
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
        assert.strictEqual(actual.url.toString(), expected.url)
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
