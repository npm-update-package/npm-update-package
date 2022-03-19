import { URL } from 'url'
import { GitRepository } from '../git'
import { extractRepository } from './extractRepository'
import type { PackageMetadata } from './PackageMetadata'

describe('extractRepository', () => {
  it('returns GitRepository instance if repository is string', () => {
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0',
      repository: 'npm-update-package/example'
    }

    const actual = extractRepository(metadata)

    expect(actual).toBeDefined()
    expect(actual).toBeInstanceOf(GitRepository)
    expect(actual?.url).toEqual(new URL('https://github.com/npm-update-package/example'))
    expect(actual?.owner).toBe('npm-update-package')
    expect(actual?.name).toBe('example')
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

    expect(actual).toBeDefined()
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

    const actual = extractRepository(metadata)

    expect(actual).toBeUndefined()
  })
})
