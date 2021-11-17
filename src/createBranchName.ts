import type { OutdatedPackage } from './types/OutdatedPackage'

export const createBranchName = (outdatedPackage: OutdatedPackage): string => {
  return `npm-update-package/${outdatedPackage.name}/v${outdatedPackage.newVersion.version}`
}
