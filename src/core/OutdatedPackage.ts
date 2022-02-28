import type { DependencyType } from '../package-json'
import type {
  SemVer,
  SemVerLevel
} from '../semver'

export interface OutdatedPackage {
  name: string
  currentVersion: SemVer
  newVersion: SemVer
  level: SemVerLevel
  dependencyType: DependencyType
}
