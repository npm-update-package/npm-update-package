import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { Terminal } from '../../terminal/Terminal.js'
import { Yarn } from './Yarn.js'

await describe('Yarn', async () => {
  const runMock = mock.fn<Terminal['run']>()
  const terminal = {
    run: runMock
  } as unknown as Terminal
  const yarn = new Yarn(terminal)

  afterEach(() => {
    runMock.mock.resetCalls()
  })

  await describe('getVersions', async () => {
    await describe('calls `yarn info <package-name> versions --json', async () => {
      const packageName = '@npm-update-package/example'

      await it('returns versions if stdout is valid', async () => {
        const expected = [
          '1.0.0',
          '2.0.0'
        ]
        runMock.mock.mockImplementation(async () => await Promise.resolve(JSON.stringify({
          type: 'inspect',
          data: expected
        })))

        const actual = await yarn.getVersions(packageName)

        assert.deepStrictEqual(actual, expected)
        assert.strictEqual(runMock.mock.callCount(), 1)
        assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
          ['yarn', 'info', packageName, 'versions', '--json']
        ])
      })

      await it('throws error if stdout is invalid', async () => {
        runMock.mock.mockImplementation(async () => await Promise.resolve(JSON.stringify({})))

        await assert.rejects(async () => await yarn.getVersions(packageName), Error)

        assert.strictEqual(runMock.mock.callCount(), 1)
        assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
          ['yarn', 'info', packageName, 'versions', '--json']
        ])
      })
    })
  })

  await describe('install', async () => {
    await it('calls `yarn install`', async () => {
      runMock.mock.mockImplementation(async () => { await Promise.resolve('') })

      await yarn.install()

      assert.strictEqual(runMock.mock.callCount(), 1)
      assert.deepStrictEqual(runMock.mock.calls.map(call => call.arguments), [
        ['yarn', 'install']
      ])
    })
  })
})
