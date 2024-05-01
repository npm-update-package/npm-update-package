import type { SemVer } from './SemVer.js'
import { SemVerLevel } from './SemVerLevel.js'

export const compareSemVers = (version1: SemVer, version2: SemVer): SemVerLevel | undefined => {
  if (version1.major !== version2.major) {
    return SemVerLevel.Major
  }

  if (version1.minor !== version2.minor) {
    return SemVerLevel.Minor
  }

  if (version1.patch !== version2.patch) {
    return SemVerLevel.Patch
  }
}
