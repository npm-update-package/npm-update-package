import { logger } from '../logger'
import type {
  OutdatedPackageUpdater,
  UpdateResult
} from '../outdated-package-updater'
import type { OutdatedPackage } from '../types'

export class OutdatedPackagesUpdater {
  constructor (private readonly outdatedPackageUpdater: OutdatedPackageUpdater) {}

  async update (outdatedPackages: OutdatedPackage[]): Promise<UpdateResult[]> {
    const results: UpdateResult[] = []

    for (const outdatedPackage of outdatedPackages) {
      logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      const result = await this.outdatedPackageUpdater.update(outdatedPackage)
      results.push(result)
    }

    return results
  }
}
