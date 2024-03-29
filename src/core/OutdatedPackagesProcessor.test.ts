import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import {
  left,
  right
} from 'fp-ts/lib/Either'
import type { Either } from 'fp-ts/lib/Either'
import type { OutdatedPackageProcessor } from '../outdated-package-processor'
import { DependencyType } from '../package-json'
import {
  SemVer,
  SemVerLevel
} from '../semver'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import { OutdatedPackagesProcessor } from './OutdatedPackagesProcessor'
import type { SucceededResult } from './SucceededResult'

describe('OutdatedPackagesProcessor', () => {
  describe('process', () => {
    const outdatedPackageProcessorProcessMock = jest.fn<OutdatedPackageProcessor['process']>()
    const outdatedPackageProcessor = {
      process: outdatedPackageProcessorProcessMock
    } as unknown as OutdatedPackageProcessor
    const outdatedPackagesProcessor = new OutdatedPackagesProcessor(outdatedPackageProcessor)

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
      const packageToBeSkipped: OutdatedPackage = {
        name: '@npm-update-package/example-2',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.1.0'),
        level: SemVerLevel.Minor,
        dependencyType: DependencyType.Dependencies
      }
      const skippedResult: Either<FailedResult, SucceededResult> = right({
        outdatedPackage: packageToBeSkipped,
        skipped: true
      })
      const packageToBeFailed: OutdatedPackage = {
        name: '@npm-update-package/example-3',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.0.1'),
        level: SemVerLevel.Patch,
        dependencyType: DependencyType.DevDependencies
      }
      const failedResult: Either<FailedResult, SucceededResult> = left({
        outdatedPackage: packageToBeFailed,
        error: new Error('Failed to update package')
      })
      outdatedPackageProcessorProcessMock.mockImplementation(async (outdatedPackage: OutdatedPackage) => {
        switch (outdatedPackage.name) {
          case packageToBeCreated.name:
            return createdResult
          case packageToBeSkipped.name:
            return skippedResult
          case packageToBeFailed.name:
            return failedResult
          default:
            throw new Error('error')
        }
      })

      const actual = await outdatedPackagesProcessor.process([
        packageToBeCreated,
        packageToBeSkipped,
        packageToBeFailed
      ])

      expect(actual).toEqual([
        createdResult,
        skippedResult,
        failedResult
      ])
      expect(outdatedPackageProcessorProcessMock).toHaveBeenCalledTimes(3)
      expect(outdatedPackageProcessorProcessMock).toHaveBeenCalledWith(packageToBeCreated)
      expect(outdatedPackageProcessorProcessMock).toHaveBeenCalledWith(packageToBeSkipped)
      expect(outdatedPackageProcessorProcessMock).toHaveBeenCalledWith(packageToBeFailed)
    })
  })
})
