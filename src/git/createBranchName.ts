import { render } from 'mustache'
import type { OutdatedPackage } from '../nup'

const TEMPLATE = 'npm-update-package/{{{packageName}}}/v{{newVersion}}'

export const createBranchName = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const currentVersion = outdatedPackage.currentVersion.version
  const newVersion = outdatedPackage.newVersion.version
  const updateType = outdatedPackage.type
  return render(TEMPLATE, {
    packageName,
    currentVersion,
    newVersion,
    updateType
  })
}
