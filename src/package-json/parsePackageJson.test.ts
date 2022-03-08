import type { PackageMetadata } from './PackageMetadata'
import { parsePackageJson } from './parsePackageJson'

describe('parsePackageJson', () => {
  it('returns parsed object if json is valid', () => {
    const pkg: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0'
    }
    const json = JSON.stringify(pkg)

    expect(parsePackageJson(json)).toEqual(pkg)
  })

  it('throws error if json is invalid', () => {
    const pkg: Omit<PackageMetadata, 'version'> = {
      name: '@npm-update-package/example'
    }
    const json = JSON.stringify(pkg)

    expect(() => parsePackageJson(json)).toThrow(Error)
  })
})
