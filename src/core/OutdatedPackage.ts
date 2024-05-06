import type { DependencyType } from '../package-json/DependencyType.js'
import type { SemVer } from '../semver/SemVer.js'
import type { SemVerLevel } from '../semver/SemVerLevel.js'

export interface OutdatedPackage {
  name: string
  currentVersion: SemVer
  newVersion: SemVer
  level: SemVerLevel
  dependencyType: DependencyType
}
