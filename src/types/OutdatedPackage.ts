import type { PackageVersion } from '../values'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
}
