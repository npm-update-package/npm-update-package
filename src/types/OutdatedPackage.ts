import type { UpdateType } from '../ncu'
import type { PackageVersion } from '../values'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
  type: UpdateType
}
