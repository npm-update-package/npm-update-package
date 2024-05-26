import assert from 'node:assert'
import fs from 'node:fs'
import {
  describe,
  it
} from 'node:test'
import { canReadWrite } from './canReadWrite.js'

await describe('canReadWrite', async () => {
  const path = 'package.json'

  await it('returns true if the file is able to access.', async ({ mock }) => {
    const accessMock = mock.method(fs.promises, 'access')
    accessMock.mock.mockImplementation(async () => { await Promise.resolve() })

    const actual = await canReadWrite(path)

    assert.strictEqual(actual, true)
    assert.strictEqual(accessMock.mock.callCount(), 1)
    assert.deepStrictEqual(accessMock.mock.calls.map(call => call.arguments), [
      [path, fs.constants.R_OK | fs.constants.W_OK]
    ])
  })

  await it('returns false if the file is not able to access.', async ({ mock }) => {
    const accessMock = mock.method(fs.promises, 'access')
    accessMock.mock.mockImplementation(async () => { await Promise.reject(new Error('error')) })

    const actual = await canReadWrite(path)

    assert.strictEqual(actual, false)
    assert.strictEqual(accessMock.mock.callCount(), 1)
    assert.deepStrictEqual(accessMock.mock.calls.map(call => call.arguments), [
      [path, fs.constants.R_OK | fs.constants.W_OK]
    ])
  })
})
