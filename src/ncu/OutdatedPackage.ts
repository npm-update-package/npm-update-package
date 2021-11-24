import type { PackageVersion } from './PackageVersion'
import type { UpdateType } from './UpdateType'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
  type: UpdateType
}
