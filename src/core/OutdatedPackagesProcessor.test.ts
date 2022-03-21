import {
  left,
  right,
  type Either
} from 'fp-ts/lib/Either'
import {
  createLogger,
  LogLevel
} from '../logger'
import { DependencyType } from '../package-json'
import {
  SemVer,
  SemVerLevel
} from '../semver'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import { OutdatedPackagesProcessor } from './OutdatedPackagesProcessor'
import type { SucceededResult } from './SucceededResult'

describe('OutdatedPackagesProcessor', () => {
  describe('process', () => {
    const outdatedPackageProcessorProcessMock = jest.fn()
    const outdatedPackageProcessor = {
      process: outdatedPackageProcessorProcessMock
    } as unknown as OutdatedPackageProcessor
    const logger = createLogger(LogLevel.Off)
    const outdatedPackagesProcessor = new OutdatedPackagesProcessor({
      outdatedPackageProcessor,
      logger
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('calls OutdatedPackageProcessor.process() by each packages', async () => {
      const packageToBeCreated: OutdatedPackage = {
        name: '@npm-update-package/example-1',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
      const createdResult: Either<FailedResult, SucceededResult> = right({
        outdatedPackage: packageToBeCreated,
        created: true
      })
      const PackageToBeSkipped: OutdatedPackage = {
        name: '@npm-update-package/example-2',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.1.0'),
        level: SemVerLevel.Minor,
        dependencyType: DependencyType.Dependencies
      }
      const skippedResult: Either<FailedResult, SucceededResult> = right({
        outdatedPackage: PackageToBeSkipped,
        skipped: true
      })
      const PackageToBeFailed: OutdatedPackage = {
        name: '@npm-update-package/example-3',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.0.1'),
        level: SemVerLevel.Patch,
        dependencyType: DependencyType.DevDependencies
      }
      const failedResult: Either<FailedResult, SucceededResult> = left({
        outdatedPackage: PackageToBeFailed,
        error: new Error('Failed to update package')
      })
      outdatedPackageProcessorProcessMock.mockImplementation((outdatedPackage: OutdatedPackage) => {
        switch (outdatedPackage.name) {
          case packageToBeCreated.name:
            return createdResult
          case PackageToBeSkipped.name:
            return skippedResult
          case PackageToBeFailed.name:
            return failedResult
        }
      })

      const actual = await outdatedPackagesProcessor.process([
        packageToBeCreated,
        PackageToBeSkipped,
        PackageToBeFailed
      ])

      expect(actual).toEqual([
        createdResult,
        skippedResult,
        failedResult
      ])
      expect(outdatedPackageProcessorProcessMock).toBeCalledTimes(3)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(packageToBeCreated)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(PackageToBeSkipped)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(PackageToBeFailed)
    })
  })
})
