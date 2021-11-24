import type { PackageVersion } from '../values'
import { UpdateType } from './UpdateType'

export const toUpdateType = (currentVersion: PackageVersion, newVersion: PackageVersion): UpdateType => {
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
