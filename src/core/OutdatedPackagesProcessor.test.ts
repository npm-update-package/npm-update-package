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

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('calls OutdatedPackageProcessor.process() by each packages', async () => {
      const createdPackage: OutdatedPackage = {
        name: '@npm-update-package/example-1',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('2.0.0'),
        level: SemVerLevel.Major,
        dependencyType: DependencyType.Dependencies
      }
      const createdResult: Either<FailedResult, SucceededResult> = right({
        outdatedPackage: createdPackage,
        created: true
      })
      const skippedPackage: OutdatedPackage = {
        name: '@npm-update-package/example-2',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.1.0'),
        level: SemVerLevel.Minor,
        dependencyType: DependencyType.Dependencies
      }
      const skippedResult: Either<FailedResult, SucceededResult> = right({
        outdatedPackage: skippedPackage,
        skipped: true
      })
      const failedPackage: OutdatedPackage = {
        name: '@npm-update-package/example-3',
        currentVersion: SemVer.of('1.0.0'),
        newVersion: SemVer.of('1.0.1'),
        level: SemVerLevel.Patch,
        dependencyType: DependencyType.DevDependencies
      }
      const failedResult: Either<FailedResult, SucceededResult> = left({
        outdatedPackage: failedPackage,
        error: new Error('Failed to update package')
      })
      outdatedPackageProcessorProcessMock.mockImplementation((outdatedPackage: OutdatedPackage) => {
        switch (outdatedPackage.name) {
          case createdPackage.name:
            return createdResult
          case skippedPackage.name:
            return skippedResult
          case failedPackage.name:
            return failedResult
        }
      })

      const outdatedPackagesProcessor = new OutdatedPackagesProcessor({
        outdatedPackageProcessor,
        logger
      })
      const results = await outdatedPackagesProcessor.process([
        createdPackage,
        skippedPackage,
        failedPackage
      ])

      expect(results).toEqual([
        createdResult,
        skippedResult,
        failedResult
      ])
      expect(outdatedPackageProcessorProcessMock).toBeCalledTimes(3)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(createdPackage)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(skippedPackage)
      expect(outdatedPackageProcessorProcessMock).toBeCalledWith(failedPackage)
    })
  })
})
