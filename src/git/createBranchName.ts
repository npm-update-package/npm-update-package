import type { OutdatedPackage } from '../core'

export const createBranchName = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  return `npm-update-package/${packageName}/v${newVersion}`
}
