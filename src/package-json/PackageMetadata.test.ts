// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { isPackageMetadata } from './PackageMetadata.js'
import type { PackageMetadata } from './PackageMetadata.js'

describe('isPackageMetadata', () => {
  describe('returns whether value is PackageMetadata', () => {
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
      bundledDependencies: {
        '@npm-update-package/example-bundledDependencies': '1.0.0'
      },
      optionalDependencies: {
        '@npm-update-package/example-optionalDependencies': '1.0.0'
      },
      repository: 'npm-update-package/example'
    }

    it.each([
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
    ])('value=$value', ({ value, expected }) => {
      const actual = isPackageMetadata(value)

      expect(actual).toBe(expected)
    })
  })
})
