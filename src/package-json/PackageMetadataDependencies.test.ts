import { describe, expect, it } from '@jest/globals'
import { isPackageMetadataDependencies } from './PackageMetadataDependencies'
import type { PackageMetadataDependencies } from './PackageMetadataDependencies'

describe('isPackageMetadataDependencies', () => {
  describe('returns whether value is PackageMetadataDependencies', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const dependencies: PackageMetadataDependencies = {
      '@npm-update-package/example': '1.0.0'
    }
    const cases: TestCase[] = [
      {
        value: dependencies,
        expected: true
      },
      {
        value: [dependencies],
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isPackageMetadataDependencies(value)

      expect(actual).toBe(expected)
    })
  })
})
