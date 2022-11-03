import type { NpmCheckUpdates } from '../npm-check-updates'
import type { PackageManager } from '../package-manager'
import type { OutdatedPackage } from './OutdatedPackage'

export class PackageUpdater {
  private readonly packageManager: PackageManager
  private readonly ncu: NpmCheckUpdates

  constructor ({
    packageManager,
    ncu
  }: {
    packageManager: PackageManager
    ncu: NpmCheckUpdates
  }) {
    this.packageManager = packageManager
    this.ncu = ncu
  }

  async update (outdatedPackage: OutdatedPackage): Promise<void> {
    const updatedPackages = await this.ncu.update(outdatedPackage)

    if (updatedPackages.length !== 1) {
      throw new Error(`Failed to update ${outdatedPackage.name}.`)
    }

    await this.packageManager.install()
  }
}
