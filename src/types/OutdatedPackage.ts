import type { UpdateType } from '../enums/UpdateType'
import type { PackageVersion } from '../values'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
  type: UpdateType
}
