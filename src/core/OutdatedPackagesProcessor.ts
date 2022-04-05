import type { Either } from 'fp-ts/lib/Either'
import { logger } from '../logger'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import type { SucceededResult } from './SucceededResult'

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
