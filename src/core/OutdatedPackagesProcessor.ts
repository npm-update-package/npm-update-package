import type { Either } from 'fp-ts/lib/Either'
import type { Logger } from '../logger'
import type { FailedResult } from './FailedResult'
import type { OutdatedPackage } from './OutdatedPackage'
import type { OutdatedPackageProcessor } from './OutdatedPackageProcessor'
import type { SucceededResult } from './SucceededResult'

// TODO: add test
export class OutdatedPackagesProcessor {
  private readonly outdatedPackageProcessor: OutdatedPackageProcessor
  private readonly logger: Logger

  constructor ({
    outdatedPackageProcessor,
    logger
  }: {
    outdatedPackageProcessor: OutdatedPackageProcessor
    logger: Logger
  }) {
    this.outdatedPackageProcessor = outdatedPackageProcessor
    this.logger = logger
  }

  async process (outdatedPackages: OutdatedPackage[]): Promise<Array<Either<FailedResult, SucceededResult>>> {
    const results: Array<Either<FailedResult, SucceededResult>> = []

    for (const outdatedPackage of outdatedPackages) {
      this.logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageProcessor.process(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
