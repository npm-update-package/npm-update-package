import assert from 'node:assert'
import {
  describe,
  it
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
    await it('returns undefined if succeeded to install package', async ({ mock }) => {
      const packageManagerInstallMock = mock.fn<PackageManager['install']>()
      const packageManager = {
        install: packageManagerInstallMock
      } as unknown as PackageManager
      const ncuUpdateMock = mock.fn<NpmCheckUpdates['update']>()
      const ncu = {
        update: ncuUpdateMock
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
      ncuUpdateMock.mock.mockImplementation(async () => await Promise.resolve([outdatedPackage]))
      packageManagerInstallMock.mock.mockImplementation(async () => { await Promise.resolve() })

      await packageUpdater.update(outdatedPackage)

      assert.strictEqual(ncuUpdateMock.mock.callCount(), 1)
      assert.deepStrictEqual(ncuUpdateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(packageManagerInstallMock.mock.callCount(), 1)
      assert.deepStrictEqual(packageManagerInstallMock.mock.calls.map(call => call.arguments), [
        []
      ])
    })

    await it('throws error if failed to install package', async ({ mock }) => {
      const packageManagerInstallMock = mock.fn<PackageManager['install']>()
      const packageManager = {
        install: packageManagerInstallMock
      } as unknown as PackageManager
      const ncuUpdateMock = mock.fn<NpmCheckUpdates['update']>()
      const ncu = {
        update: ncuUpdateMock
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
      ncuUpdateMock.mock.mockImplementation(async () => await Promise.resolve([]))
      packageManagerInstallMock.mock.mockImplementation(async () => { await Promise.resolve() })

      await assert.rejects(packageUpdater.update(outdatedPackage), Error)

      assert.strictEqual(ncuUpdateMock.mock.callCount(), 1)
      assert.deepStrictEqual(ncuUpdateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(packageManagerInstallMock.mock.callCount(), 0)
    })
  })
})
