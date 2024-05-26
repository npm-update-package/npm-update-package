import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import {
  left,
  right
} from 'fp-ts/lib/Either.js'
import type { Either } from 'fp-ts/lib/Either.js'
import type { OutdatedPackageProcessor } from '../outdated-package-processor/OutdatedPackageProcessor.js'
import { DependencyType } from '../package-json/DependencyType.js'
import { SemVer } from '../semver/SemVer.js'
import { SemVerLevel } from '../semver/SemVerLevel.js'
import type { FailedResult } from './FailedResult.js'
import type { OutdatedPackage } from './OutdatedPackage.js'
import { OutdatedPackagesProcessor } from './OutdatedPackagesProcessor.js'
import type { SucceededResult } from './SucceededResult.js'

await describe('OutdatedPackagesProcessor', async () => {
  await describe('process', async () => {
    await it('calls OutdatedPackageProcessor.process() by each packages', async ({ mock }) => {
      const processMock = mock.fn<OutdatedPackageProcessor['process']>()
      const outdatedPackageProcessor = {
        process: processMock
      } as unknown as OutdatedPackageProcessor
      const outdatedPackagesProcessor = new OutdatedPackagesProcessor(outdatedPackageProcessor)
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
      const processMockImplementation: OutdatedPackageProcessor['process'] = async (outdatedPackage) => {
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
      }
      processMock.mock.mockImplementation(processMockImplementation)

      const actual = await outdatedPackagesProcessor.process([
        packageToBeCreated,
        packageToBeSkipped,
        packageToBeFailed
      ])

      assert.deepStrictEqual(actual, [
        createdResult,
        skippedResult,
        failedResult
      ])
      assert.strictEqual(processMock.mock.callCount(), 3)
      assert.deepStrictEqual(processMock.mock.calls.map(call => call.arguments), [
        [packageToBeCreated],
        [packageToBeSkipped],
        [packageToBeFailed]
      ])
    })
  })
})
