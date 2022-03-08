import {
  isPackageMetadataRepository,
  type PackageMetadataRepository
} from './PackageMetadataRepository'

describe('isPackageMetadataRepository', () => {
  const repository: PackageMetadataRepository = {
    url: 'https://github.com/npm-update-package/example.git'
  }

  it('returns true if value is PackageMetadataRepository', () => {
    expect(isPackageMetadataRepository(repository)).toBe(true)
  })

  it('returns false if value is not PackageMetadataRepository', () => {
    expect(isPackageMetadataRepository(JSON.stringify(repository))).toBe(false)
  })
})
