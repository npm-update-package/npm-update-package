import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { isPackageMetadataDependencies } from './PackageMetadataDependencies.js'
import type { PackageMetadataDependencies } from './PackageMetadataDependencies.js'

await describe('isPackageMetadataDependencies', async () => {
  await describe('returns whether value is PackageMetadataDependencies', async () => {
    const dependencies: PackageMetadataDependencies = {
      '@npm-update-package/example': '1.0.0'
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [dependencies, true],
      [[dependencies], false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isPackageMetadataDependencies(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
