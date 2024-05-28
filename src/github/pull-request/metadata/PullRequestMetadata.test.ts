import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { each } from 'test-each'
import { SemVerLevel } from '../../../semver/SemVerLevel.js'
import { isPullRequestMetadata } from './PullRequestMetadata.js'
import type { PullRequestMetadata } from './PullRequestMetadata.js'

await describe('isPullRequestMetadata', async () => {
  await describe('returns whether value is PullRequestMetadata', async () => {
    const metadata: PullRequestMetadata = {
      version: '1.0.0',
      packages: [
        {
          name: '@npm-update-package/example',
          currentVersion: '1.0.0',
          newVersion: '2.0.0',
          level: SemVerLevel.Major
        }
      ]
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [metadata, true],
      [{ ...metadata, version: undefined }, false],
      [{ ...metadata, packages: undefined }, false]

    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isPullRequestMetadata(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
