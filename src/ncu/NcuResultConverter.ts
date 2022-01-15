import { isNotUndefined } from 'type-guards'
import type { OutdatedPackage } from '../core'
import type { PackageMetadata } from '../package-json/PackageMetadata'
import {
  compareSemVers,
  SemVer
} from '../semver'
import type { NcuResult } from './NcuResult'

// TODO: add test
export class NcuResultConverter {
  constructor (private readonly packageMetadata: PackageMetadata) {}

  toOutdatedPackages (result: NcuResult): OutdatedPackage[] {
    const {
      dependencies,
      devDependencies,
      peerDependencies,
      optionalDependencies
    } = this.packageMetadata
    const currentDependencies = {
      ...dependencies,
      ...devDependencies,
      ...peerDependencies,
      ...optionalDependencies
    }
    const resultEntries = Object.entries(result)
    const outdatedPackages: OutdatedPackage[] = resultEntries
      .map(([name, newVersionString]) => {
        const currentVersionString = currentDependencies[name]

        if (currentVersionString === undefined) {
          return undefined
        }

        const currentVersion = SemVer.of(currentVersionString)
        const newVersion = SemVer.of(newVersionString)
        const level = compareSemVers(currentVersion, newVersion)

        if (level === undefined) {
          return undefined
        }

        const outdatedPackage: OutdatedPackage = {
          name,
          currentVersion,
          newVersion,
          level
        }
        return outdatedPackage
      })
      .filter(isNotUndefined)

    if (resultEntries.length !== outdatedPackages.length) {
      throw new Error('Failed to convert to outdatedPackages from NcuResult.')
    }

    return outdatedPackages
  }
}
