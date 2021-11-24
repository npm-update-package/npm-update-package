import type { OutdatedPackage } from '../ncu'

export const createPullRequestTitle = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  const updateType = outdatedPackage.type
  return `chore(deps): ${updateType} update ${packageName} to v${newVersion}`
}
