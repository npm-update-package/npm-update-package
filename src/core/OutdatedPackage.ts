import type {
  SemVer,
  SemVerLevel
} from '../semver'

export interface OutdatedPackage {
  name: string
  currentVersion: SemVer
  newVersion: SemVer
  // TODO: rename to level
  type: SemVerLevel
}
