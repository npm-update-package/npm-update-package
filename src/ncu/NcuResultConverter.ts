import { isNotUndefined } from 'type-guards'
import type { PackageDependencies } from '../package-json'
import {
  compareSemVers,
  SemVer
} from '../semver'
import type { NcuResult } from './NcuResult'
import type { OutdatedPackage } from './OutdatedPackage'

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

        const currentVersion = SemVer.of(currentVersionString)
        const newVersion = SemVer.of(newVersionString)
        const type = compareSemVers(currentVersion, newVersion)
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
