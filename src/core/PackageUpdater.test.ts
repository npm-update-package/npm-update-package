import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { NpmCheckUpdates } from '../npm-check-updates'
import { DependencyType } from '../package-json'
import type { PackageManager } from '../package-manager'
import {
  SemVer,
  SemVerLevel
} from '../semver'
import { OutdatedPackage } from './OutdatedPackage'
import { PackageUpdater } from './PackageUpdater'

describe('PackageUpdater', () => {
  describe('update', () => {
    const packageManagerInstallMock = jest.fn<PackageManager['install']>()
    const packageManager = {
      install: packageManagerInstallMock
    } as unknown as PackageManager
    const ncuUpdateMock = jest.fn<NpmCheckUpdates['update']>()
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

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('returns undefined if succeeded to install package', async () => {
      ncuUpdateMock.mockResolvedValue([outdatedPackage])

      await packageUpdater.update(outdatedPackage)

      expect(ncuUpdateMock).toHaveBeenCalledWith(outdatedPackage)
      expect(packageManagerInstallMock).toHaveBeenCalledWith()
    })

    it('throws error if failed to install package', async () => {
      ncuUpdateMock.mockResolvedValue([])

      await expect(async () => await packageUpdater.update(outdatedPackage)).rejects.toThrow(Error)

      expect(ncuUpdateMock).toHaveBeenCalledWith(outdatedPackage)
      expect(packageManagerInstallMock).not.toHaveBeenCalled()
    })
  })
})
