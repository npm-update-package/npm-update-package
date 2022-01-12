import type { PackageVersion } from '../semver'
import type { UpdateType } from './UpdateType'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
  type: UpdateType
}
