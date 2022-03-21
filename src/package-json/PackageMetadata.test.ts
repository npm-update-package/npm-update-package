import {
  isPackageMetadata,
  type PackageMetadata
} from './PackageMetadata'

describe('isPackageMetadata', () => {
  describe('returns whether value is PackageMetadata', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
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
    const cases: TestCase[] = [
      {
        value: metadata,
        expected: true
      },
      {
        value: {
          ...metadata,
          name: undefined
        },
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isPackageMetadata(value)

      expect(actual).toBe(expected)
    })
  })
})
