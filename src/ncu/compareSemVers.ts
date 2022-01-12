import {
  SemVerLevel,
  type SemVer
} from '../semver'

export const compareSemVers = (currentVersion: SemVer, newVersion: SemVer): SemVerLevel => {
  if (currentVersion.major !== newVersion.major) {
    return SemVerLevel.Major
  }

  if (currentVersion.minor !== newVersion.minor) {
    return SemVerLevel.Minor
  }

  if (currentVersion.patch !== newVersion.patch) {
    return SemVerLevel.Patch
  }

  throw new Error('Both versions are same.')
}
