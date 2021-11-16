import type { OutdatedPackage } from './types/OutdatedPackage'

export const createPullRequestTitle = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  return `chore(deps): update dependency ${packageName} to v${newVersion}`
}
