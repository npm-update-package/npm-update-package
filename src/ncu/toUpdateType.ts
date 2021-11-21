import type { UpdateType } from '../types'
import type { PackageVersion } from '../values'

export const toUpdateType = (currentVersion: PackageVersion, newVersion: PackageVersion): UpdateType => {
  if (currentVersion.major !== newVersion.major) {
    return 'major'
  }

  if (currentVersion.minor !== newVersion.minor) {
    return 'minor'
  }

  if (currentVersion.patch !== newVersion.patch) {
    return 'patch'
  }

  throw new Error('Both versions are same.')
}
