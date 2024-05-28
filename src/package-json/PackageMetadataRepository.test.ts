import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { isPackageMetadataRepository } from './PackageMetadataRepository.js'
import type { PackageMetadataRepository } from './PackageMetadataRepository.js'

await describe('isPackageMetadataRepository', async () => {
  await describe('returns whether value is PackageMetadataRepository', async () => {
    const repository: PackageMetadataRepository = {
      url: 'https://github.com/npm-update-package/example.git'
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [repository, true],
      [{}, false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isPackageMetadataRepository(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
