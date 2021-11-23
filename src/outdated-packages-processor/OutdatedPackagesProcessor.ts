import type { Logger } from '../logger'
import type { OutdatedPackageProcessor } from '../outdated-package-processor'
import type {
  OutdatedPackage,
  Result
} from '../types'

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

  async process (outdatedPackages: OutdatedPackage[]): Promise<Result[]> {
    const results: Result[] = []

    for (const outdatedPackage of outdatedPackages) {
      this.logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageProcessor.process(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
