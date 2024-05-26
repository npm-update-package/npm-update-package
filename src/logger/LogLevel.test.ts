import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import {
  isLogLevel,
  LogLevel
} from './LogLevel.js'

await describe('isLogLevel', async () => {
  await describe('returns whether value is LogLevel', async () => {
    const { each } = await import('test-each')
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [LogLevel.Debug, true],
      [LogLevel.Error, true],
      [LogLevel.Fatal, true],
      [LogLevel.Info, true],
      [LogLevel.Off, true],
      [LogLevel.Trace, true],
      [LogLevel.Warn, true],
      ['unknown', false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isLogLevel(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
