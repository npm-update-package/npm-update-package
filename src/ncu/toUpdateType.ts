import type { SemVer } from '../semver'
import { UpdateType } from './UpdateType'

export const toUpdateType = (currentVersion: SemVer, newVersion: SemVer): UpdateType => {
  if (currentVersion.major !== newVersion.major) {
    return UpdateType.Major
  }

  if (currentVersion.minor !== newVersion.minor) {
    return UpdateType.Minor
  }

  if (currentVersion.patch !== newVersion.patch) {
    return UpdateType.Patch
  }

  throw new Error('Both versions are same.')
}
