import {
  isPackageMetadata,
  type PackageMetadata
} from './PackageMetadata'

describe('isPackageMetadata', () => {
  const metadata: PackageMetadata = {
    name: '@npm-update-package/example',
    version: '1.0.0',
    dependencies: {
      '@npm-update-package/example-dependencies': '1.0.0'
    },
    devDependencies: {
      '@npm-update-package/example-devDependencies': '1.0.0'
    },
    peerDependencies: {
      '@npm-update-package/example-peerDependencies': '1.0.0'
    },
    optionalDependencies: {
      '@npm-update-package/example-optionalDependencies': '1.0.0'
    },
    repository: 'npm-update-package/example'
  }

  it('returns true if value is PackageMetadata', () => {
    expect(isPackageMetadata(metadata)).toBe(true)
  })

  it('returns false if value is not PackageMetadata', () => {
    expect(isPackageMetadata(JSON.stringify(metadata))).toBe(false)
  })
})
