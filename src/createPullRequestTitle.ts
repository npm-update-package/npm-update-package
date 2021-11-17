import type { OutdatedPackage } from './types/OutdatedPackage'

// TODO: add logs using logger
// TODO: include update type (major/minor/patch)
// TODO: include current version
export const createPullRequestTitle = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  return `chore(deps): update dependency ${packageName} to v${newVersion}`
}
