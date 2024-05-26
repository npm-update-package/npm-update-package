import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import {
  isPackageManagerName,
  PackageManagerName
} from './PackageManagerName.js'

await describe('isPackageManagerName', async () => {
  await describe('returns whether value is PackageManagerName', async () => {
    const { each } = await import('test-each')
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [PackageManagerName.Npm, true],
      [PackageManagerName.Yarn, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isPackageManagerName(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
