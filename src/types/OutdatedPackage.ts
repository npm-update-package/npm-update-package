import type { PackageVersion } from '../values'
import type { UpdateType } from './UpdateType'

export interface OutdatedPackage {
  name: string
  currentVersion: PackageVersion
  newVersion: PackageVersion
  type: UpdateType
}
