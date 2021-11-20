import type { OutdatedPackage } from '../types'

export const createBranchName = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.version
  return `npm-update-package/${packageName}/v${newVersion}`
}
