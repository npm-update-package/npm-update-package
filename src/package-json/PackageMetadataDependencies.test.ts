import {
  isPackageMetadataDependencies,
  type PackageMetadataDependencies
} from './PackageMetadataDependencies'

describe('isPackageMetadataDependencies', () => {
  const dependencies: PackageMetadataDependencies = {
    '@npm-update-package/example': '1.0.0'
  }

  it('returns true if value is PackageMetadataDependencies', () => {
    expect(isPackageMetadataDependencies(dependencies)).toBe(true)
  })

  it('returns false if value is not PackageMetadataDependencies', () => {
    expect(isPackageMetadataDependencies(JSON.stringify(dependencies))).toBe(false)
  })
})
