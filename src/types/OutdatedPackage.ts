import type { PackageVersion } from '../values/PackageVersion'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
}
