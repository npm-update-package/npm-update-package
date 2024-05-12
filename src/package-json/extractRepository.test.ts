// TODO: Replace Jest with Node.js's test runner

import { URL } from 'node:url'
import {
  describe,
  expect,
  it
} from '@jest/globals'
import { GitRepository } from '../git/GitRepository.js'
import { extractRepository } from './extractRepository.js'
import type { PackageMetadata } from './PackageMetadata.js'

describe('extractRepository', () => {
  describe('returns GitRepository instance if repository exists', () => {
    interface TestCase {
      metadata: PackageMetadata
      expected: {
        url: URL
        owner: string
        name: string
        isGitHub: boolean
      }
    }
    const cases: TestCase[] = [
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

    it.each(cases)('metadata=$metadata', ({ metadata, expected }) => {
      const actual = extractRepository(metadata)

      expect(actual).toBeDefined()
      expect(actual).toBeInstanceOf(GitRepository)
      expect(actual?.url).toEqual(expected.url)
      expect(actual?.owner).toBe(expected.owner)
      expect(actual?.name).toBe(expected.name)
      expect(actual?.isGitHub).toBe(expected.isGitHub)
    })
  })

  it('returns undefined if repository does not exist', () => {
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0'
    }

    const actual = extractRepository(metadata)

    expect(actual).toBeUndefined()
  })
})
