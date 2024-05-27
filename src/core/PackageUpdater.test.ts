import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { NpmCheckUpdates } from '../npm-check-updates/NpmCheckUpdates.js'
import { DependencyType } from '../package-json/DependencyType.js'
import type { PackageManager } from '../package-manager/PackageManager.js'
import { SemVer } from '../semver/SemVer.js'
import { SemVerLevel } from '../semver/SemVerLevel.js'
import type { OutdatedPackage } from './OutdatedPackage.js'
import { PackageUpdater } from './PackageUpdater.js'

await describe('PackageUpdater', async () => {
  await describe('update', async () => {
    const installMock = mock.fn<PackageManager['install']>()
    const packageManager = {
      install: installMock
    } as unknown as PackageManager
    const updateMock = mock.fn<NpmCheckUpdates['update']>()
    const ncu = {
      update: updateMock
    } as unknown as NpmCheckUpdates
    const packageUpdater = new PackageUpdater({
      packageManager,
      ncu
    })
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    afterEach(() => {
      installMock.mock.resetCalls()
      updateMock.mock.resetCalls()
    })

    await it('returns undefined if succeeded to install package', async () => {
      updateMock.mock.mockImplementation(async () => await Promise.resolve([outdatedPackage]))
      installMock.mock.mockImplementation(async () => { await Promise.resolve() })

      await packageUpdater.update(outdatedPackage)

      assert.strictEqual(updateMock.mock.callCount(), 1)
      assert.deepStrictEqual(updateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(installMock.mock.callCount(), 1)
      assert.deepStrictEqual(installMock.mock.calls.map(call => call.arguments), [
        []
      ])
    })

    await it('throws error if failed to install package', async () => {
      updateMock.mock.mockImplementation(async () => await Promise.resolve([]))
      installMock.mock.mockImplementation(async () => { await Promise.resolve() })

      await assert.rejects(packageUpdater.update(outdatedPackage), Error)

      assert.strictEqual(updateMock.mock.callCount(), 1)
      assert.deepStrictEqual(updateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(installMock.mock.callCount(), 0)
      assert.deepStrictEqual(installMock.mock.calls.map(call => call.arguments), [])
    })
  })
})
