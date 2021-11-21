import { logger } from '../logger'
import type {
  OutdatedPackageProcessor,
  UpdateResult
} from '../outdated-package-processor'
import type { OutdatedPackage } from '../types'

export class OutdatedPackagesProcessor {
  constructor (private readonly outdatedPackageProcessor: OutdatedPackageProcessor) {}

  async process (outdatedPackages: OutdatedPackage[]): Promise<UpdateResult[]> {
    const results: UpdateResult[] = []

    for (const outdatedPackage of outdatedPackages) {
      logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageProcessor.process(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
