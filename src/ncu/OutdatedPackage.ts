import type {
  SemVer,
  SemVerLevel
} from '../semver'

export interface OutdatedPackage {
  name: string
  currentVersion: SemVer
  newVersion: SemVer
  type: SemVerLevel
}
