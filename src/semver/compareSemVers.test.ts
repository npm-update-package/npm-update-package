import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { compareSemVers } from './compareSemVers.js'
import { SemVer } from './SemVer.js'
import { SemVerLevel } from './SemVerLevel.js'

await describe('compareSemVers', async () => {
  await describe('returns SemVerLevel if both versions are different', async () => {
    const inputs: Array<[version1: string, version2: string, expected: SemVerLevel]> = [
      ['1.0.0', '2.0.0', SemVerLevel.Major],
      ['1.0.0', '1.1.0', SemVerLevel.Minor],
      ['1.0.0', '1.0.1', SemVerLevel.Patch]
    ]
    each(inputs, ({ title }, [version1, version2, expected]) => {
      void it(title, () => {
        const actual = compareSemVers(SemVer.of(version1), SemVer.of(version2))

        assert.strictEqual(actual, expected)
      })
    })
  })

  await it('returns undefined if both versions are same', () => {
    const actual = compareSemVers(SemVer.of('1.0.0'), SemVer.of('1.0.0'))

    assert.strictEqual(actual, undefined)
  })
})
