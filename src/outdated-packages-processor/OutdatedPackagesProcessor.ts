import { logger } from '../logger'
import type { OutdatedPackageProcessor } from '../outdated-package-processor'
import type {
  OutdatedPackage,
  Result
} from '../types'

export class OutdatedPackagesProcessor {
  constructor (private readonly outdatedPackageProcessor: OutdatedPackageProcessor) {}

  async process (outdatedPackages: OutdatedPackage[]): Promise<Result[]> {
    const results: Result[] = []

    for (const outdatedPackage of outdatedPackages) {
      logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageProcessor.process(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
