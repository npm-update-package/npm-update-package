import type { Either } from 'fp-ts/lib/Either.js'
import { logger } from '../logger/logger.js'
import type { OutdatedPackageProcessor } from '../outdated-package-processor/OutdatedPackageProcessor.js'
import type { FailedResult } from './FailedResult.js'
import type { OutdatedPackage } from './OutdatedPackage.js'
import type { SucceededResult } from './SucceededResult.js'

export class OutdatedPackagesProcessor {
  constructor (private readonly outdatedPackageProcessor: OutdatedPackageProcessor) {}

  async process (outdatedPackages: OutdatedPackage[]): Promise<Array<Either<FailedResult, SucceededResult>>> {
    const results: Array<Either<FailedResult, SucceededResult>> = []

    for (const outdatedPackage of outdatedPackages) {
      logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageProcessor.process(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
