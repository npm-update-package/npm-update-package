import type { OutdatedPackage } from './types/OutdatedPackage'

// TODO: include update type (major/minor/patch)
export const createCommitMessage = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  return `chore(deps): update ${packageName} to v${newVersion}`
}
