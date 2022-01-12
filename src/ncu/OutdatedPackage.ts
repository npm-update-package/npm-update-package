import type { SemVer } from '../semver'
import type { UpdateType } from './UpdateType'

export interface OutdatedPackage {
  name: string
  currentVersion: SemVer
  newVersion: SemVer
  type: UpdateType
}
