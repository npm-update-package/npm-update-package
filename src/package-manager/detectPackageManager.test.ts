import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import { canReadWrite } from '../file/canReadWrite.js'
import { detectPackageManager } from './detectPackageManager.js'
import { PackageManagerName } from './PackageManagerName.js'

// TODO: Activate when mock.module can use.
await describe.skip('detectPackageManager', async () => {
  const canReadWriteMock = mock.fn(canReadWrite)

  afterEach(() => {
    canReadWriteMock.mock.resetCalls()
  })

  await it('returns PackageManagerName.Npm if package-lock.json exists', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const canReadWriteMockImplementation: typeof canReadWrite = async (path) => await Promise.resolve(path === 'package-lock.json')
    canReadWriteMock.mock.mockImplementation(canReadWriteMockImplementation)

    const actual = await detectPackageManager()

    assert.strictEqual(actual, PackageManagerName.Npm)
    assert.strictEqual(canReadWriteMock.mock.callCount(), 1)
    assert.deepStrictEqual(canReadWriteMock.mock.calls.map(call => call.arguments), [
      ['package-lock.json']
    ])
  })

  await it('returns PackageManagerName.Yarn if package-lock.json does not exist and yarn.lock exists', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const canReadWriteMockImplementation: typeof canReadWrite = async (path) => await Promise.resolve(path === 'yarn.lock')
    canReadWriteMock.mock.mockImplementation(canReadWriteMockImplementation)

    const actual = await detectPackageManager()

    assert.strictEqual(actual, PackageManagerName.Yarn)
    assert.strictEqual(canReadWriteMock.mock.callCount(), 2)
    assert.deepStrictEqual(canReadWriteMock.mock.calls.map(call => call.arguments), [
      ['package-lock.json'],
      ['yarn.lock']
    ])
  })

  await it('throws error if no lock file exists', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const canReadWriteMockImplementation: typeof canReadWrite = async (path) => await Promise.resolve(false)
    canReadWriteMock.mock.mockImplementation(canReadWriteMockImplementation)

    assert.throws(async () => await detectPackageManager(), Error)

    assert.strictEqual(canReadWriteMock.mock.callCount(), 2)
    assert.deepStrictEqual(canReadWriteMock.mock.calls.map(call => call.arguments), [
      ['package-lock.json'],
      ['yarn.lock']
    ])
  })
})
