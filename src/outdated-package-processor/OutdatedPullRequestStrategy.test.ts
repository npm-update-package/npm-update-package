import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import {
  isOutdatedPullRequestStrategy,
  OutdatedPullRequestStrategy
} from './OutdatedPullRequestStrategy.js'

await describe('isOutdatedPullRequestStrategy', async () => {
  await describe('returns whether value is OutdatedPullRequestStrategy', async () => {
    const { each } = await import('test-each')
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [OutdatedPullRequestStrategy.Create, true],
      [OutdatedPullRequestStrategy.Recreate, true],
      [OutdatedPullRequestStrategy.Skip, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isOutdatedPullRequestStrategy(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
