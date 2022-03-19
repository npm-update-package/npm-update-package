import { URL } from 'url'
import { GitRepository } from '../git'
import { extractRepository } from './extractRepository'
import type { PackageMetadata } from './PackageMetadata'

describe('extractRepository', () => {
  describe('if repository is string', () => {
    it('returns GitRepository instance if repository is GitHub', () => {
      const metadata: PackageMetadata = {
        name: '@npm-update-package/example',
        version: '1.0.0',
        repository: 'npm-update-package/example'
      }

      const actual = extractRepository(metadata)

      expect(actual).toBeInstanceOf(GitRepository)
      expect(actual?.url).toEqual(new URL('https://github.com/npm-update-package/example'))
      expect(actual?.owner).toBe('npm-update-package')
      expect(actual?.name).toBe('example')
    })

    it('returns undefined if repository is not GitHub', () => {
      const metadata: PackageMetadata = {
        name: '@npm-update-package/example',
        version: '1.0.0',
        repository: 'gitlab:npm-update-package/example'
      }

      expect(extractRepository(metadata)).toBeUndefined()
    })
  })

  it('returns GitRepository instance if repository is object', () => {
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0',
      repository: {
        url: 'https://github.com/npm-update-package/example.git'
      }
    }

    const actual = extractRepository(metadata)

    expect(actual).toBeInstanceOf(GitRepository)
    expect(actual?.url).toEqual(new URL('https://github.com/npm-update-package/example'))
    expect(actual?.owner).toBe('npm-update-package')
    expect(actual?.name).toBe('example')
  })

  it('returns undefined if repository is undefined', () => {
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0'
    }
    expect(extractRepository(metadata)).toBeUndefined()
  })
})
