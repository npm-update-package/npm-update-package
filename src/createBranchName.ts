import type { OutdatedPackage } from './types/OutdatedPackage'

export const createBranchName = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const newVersion = outdatedPackage.newVersion.toString()
  return `npm-update-package/${packageName}/v${newVersion}`
}
