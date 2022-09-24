import {
  describe,
  expect,
  it
} from '@jest/globals'
import { isPackageMetadataRepository } from './PackageMetadataRepository'
import type { PackageMetadataRepository } from './PackageMetadataRepository'

describe('isPackageMetadataRepository', () => {
  describe('returns whether value is PackageMetadataRepository', () => {
    interface TestCase {
      value: unknown
      expected: boolean
    }
    const repository: PackageMetadataRepository = {
      url: 'https://github.com/npm-update-package/example.git'
    }
    const cases: TestCase[] = [
      {
        value: repository,
        expected: true
      },
      {
        value: {},
        expected: false
      }
    ]

    it.each(cases)('value=$value', ({ value, expected }) => {
      const actual = isPackageMetadataRepository(value)

      expect(actual).toBe(expected)
    })
  })
})
