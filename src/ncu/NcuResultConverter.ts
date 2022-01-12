import { isNotUndefined } from 'type-guards'
import type { PackageDependencies } from '../package-json'
import { PackageVersion } from '../semver'
import type { NcuResult } from './NcuResult'
import type { OutdatedPackage } from './OutdatedPackage'
import { toUpdateType } from './toUpdateType'

// TODO: add test
export class NcuResultConverter {
  constructor (private readonly currentDependencies: PackageDependencies) {}

  toOutdatedPackages (result: NcuResult): OutdatedPackage[] {
    const resultEntries = Object.entries(result)
    const outdatedPackages = resultEntries
      .map(([name, newVersionString]) => {
        const currentVersionString = this.currentDependencies[name]

        if (currentVersionString === undefined) {
          return undefined
        }

        const currentVersion = PackageVersion.of(currentVersionString)
        const newVersion = PackageVersion.of(newVersionString)
        const type = toUpdateType(currentVersion, newVersion)
        return {
          name,
          currentVersion,
          newVersion,
          type
        }
      })
      .filter(isNotUndefined)

    if (resultEntries.length !== outdatedPackages.length) {
      throw new Error('Failed to convert to outdatedPackages from NcuResult.')
    }

    return outdatedPackages
  }
}
