import type { PackageVersion } from '../PackageVersion'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
}
