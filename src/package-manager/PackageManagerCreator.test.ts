import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import { each } from 'test-each'
import type { Class } from 'utility-types'
import type { Options } from '../options/Options.js'
import type { Terminal } from '../terminal/Terminal.js'
import { detectPackageManager } from './detectPackageManager.js'
import { Npm } from './npm/Npm.js'
import type { PackageManager } from './PackageManager.js'
import { PackageManagerCreator } from './PackageManagerCreator.js'
import { PackageManagerName } from './PackageManagerName.js'
import { Yarn } from './yarn/Yarn.js'

await describe('PackageManagerCreator', async () => {
  // TODO: Activate when mock.module can use.
  await describe.skip('create', async () => {
    const detectPackageManagerMock = mock.fn(detectPackageManager)
    const terminal = {} as unknown as Terminal
    const inputs: Array<[packageManager: PackageManagerName, expected: Class<PackageManager>]> = [
      [PackageManagerName.Npm, Npm],
      [PackageManagerName.Yarn, Yarn]
    ]

    afterEach(() => {
      detectPackageManagerMock.mock.resetCalls()
    })

    await describe('returns new PackageManager instance if packageManager option exists', () => {
      each(inputs, ({ title }, [packageManager, expected]) => {
        void it(title, async () => {
          const options = {
            packageManager
          } as unknown as Options
          const packageManagerCreator = new PackageManagerCreator(options)

          const actual = await packageManagerCreator.create(terminal)

          assert.ok(actual instanceof expected)
          assert.strictEqual(detectPackageManagerMock.mock.callCount(), 0)
        })
      })
    })

    await describe('returns new PackageManager instance if packageManager option does not exist', () => {
      each(inputs, ({ title }, [packageManager, expected]) => {
        void it(title, async () => {
          const options = {} as unknown as Options
          const packageManagerCreator = new PackageManagerCreator(options)
          detectPackageManagerMock.mock.mockImplementation(() => packageManager)

          const actual = await packageManagerCreator.create(terminal)

          assert.ok(actual instanceof expected)
          assert.strictEqual(detectPackageManagerMock.mock.callCount(), 1)
          assert.deepStrictEqual(detectPackageManagerMock.mock.calls.map(call => call.arguments), [
            []
          ])
        })
      })
    })
  })
})
