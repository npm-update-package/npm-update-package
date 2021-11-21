import { logger } from '../logger'
import type { OutdatedPackageUpdater } from '../outdated-package-updater'
import type { OutdatedPackage } from '../types'

export class OutdatedPackagesUpdater {
  constructor (private readonly outdatedPackageUpdater: OutdatedPackageUpdater) {}

  async update (outdatedPackages: OutdatedPackage[]): Promise<void> {
    for (const outdatedPackage of outdatedPackages) {
      logger.debug(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
      await this.outdatedPackageUpdater.update(outdatedPackage)
    }
  }
}
