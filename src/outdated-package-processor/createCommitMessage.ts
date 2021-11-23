import type { OutdatedPackage } from '../types'

export const createCommitMessage = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  const updateType = outdatedPackage.type
  return `chore(deps): ${updateType} update ${packageName} to v${newVersion}`
}
