import type { PackageDependencies } from '../package-json'
import type { NcuOutdatedPackages } from './NcuOutdatedPackages'
import type { OutdatedPackage } from './OutdatedPackage'
import { PackageVersion } from './PackageVersion'
import { toUpdateType } from './toUpdateType'

// TODO: add test
export class NcuOutdatedPackagesConverter {
  constructor (private readonly currentDependencies: PackageDependencies) {}

  toOutdatedPackages (outdatedPackages: NcuOutdatedPackages): OutdatedPackage[] {
    return Object.entries(outdatedPackages)
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
