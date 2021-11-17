import type { OutdatedPackage } from './types/OutdatedPackage'

// TODO: include update type (major/minor/patch)
// TODO: include current version
export const createPullRequestTitle = (outdatedPackage: OutdatedPackage): string => {
  return `chore(deps): update dependency ${outdatedPackage.name} to v${outdatedPackage.newVersion.version}`
}
