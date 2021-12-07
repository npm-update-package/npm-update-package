import type { PackageDependencies } from '../package-json'
import type { NcuResult } from './NcuResult'
import type { OutdatedPackage } from './OutdatedPackage'
import { PackageVersion } from './PackageVersion'
import { toUpdateType } from './toUpdateType'

// TODO: add test
export class NcuResultConverter {
  constructor (private readonly currentDependencies: PackageDependencies) {}

  toOutdatedPackages (result: NcuResult): OutdatedPackage[] {
    return Object.entries(result)
      .map(([name, newVersion]) => ({
        name,
        currentVersion: PackageVersion.of(this.currentDependencies[name]),
        newVersion: PackageVersion.of(newVersion)
      }))
      .map(({ name, currentVersion, newVersion }) => ({
        name,
        currentVersion,
        newVersion,
        type: toUpdateType(currentVersion, newVersion)
      }))
  }
}
