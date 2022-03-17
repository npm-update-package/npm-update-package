import type { Ncu } from '../ncu'
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
    const packageManagerInstallMock = jest.fn()
    const packageManager = {
      install: packageManagerInstallMock
    } as unknown as PackageManager
    const ncuUpdateMock = jest.fn()
    const ncu = {
      update: ncuUpdateMock
    } as unknown as Ncu
    const outdatedPackage: OutdatedPackage = {
      name: '@npm-update-package/example',
      currentVersion: SemVer.of('1.0.0'),
      newVersion: SemVer.of('2.0.0'),
      level: SemVerLevel.Major,
      dependencyType: DependencyType.Dependencies
    }

    afterEach(() => {
      packageManagerInstallMock.mockReset()
      ncuUpdateMock.mockReset()
    })

    it('returns undefined if succeeded to install package', async () => {
      ncuUpdateMock.mockResolvedValue([outdatedPackage])

      const packageUpdater = new PackageUpdater({
        packageManager,
        ncu
      })
      await packageUpdater.update(outdatedPackage)

      expect(ncuUpdateMock).toBeCalledWith(outdatedPackage)
      expect(packageManagerInstallMock).toBeCalledWith()
    })

    it('throws error if failed to install package', async () => {
      ncuUpdateMock.mockResolvedValue([])

      const packageUpdater = new PackageUpdater({
        packageManager,
        ncu
      })

      await expect(async () => await packageUpdater.update(outdatedPackage)).rejects.toThrow(Error)
      expect(ncuUpdateMock).toBeCalledWith(outdatedPackage)
      expect(packageManagerInstallMock).not.toBeCalled()
    })
  })
})
