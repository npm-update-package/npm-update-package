import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { SemVer } from './SemVer.js'

await describe('SemVer', async () => {
  await describe('of', async () => {
    await it('returns new SemVer instance if version is valid', () => {
      const actual = SemVer.of('^1.2.3')

      assert.strictEqual(actual.version, '1.2.3')
      assert.strictEqual(actual.major, 1)
      assert.strictEqual(actual.minor, 2)
      assert.strictEqual(actual.patch, 3)
    })

    await it('throws error if version is invalid', () => {
      assert.throws(() => SemVer.of(''), Error)
    })
  })
})
