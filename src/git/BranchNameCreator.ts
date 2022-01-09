import { render } from 'mustache'
import type { OutdatedPackage } from '../ncu'

export class BranchNameCreator {
  private readonly template: string = 'npm-update-package/{{{packageName}}}/v{{newVersion}}'

  create (outdatedPackage: OutdatedPackage): string {
    const packageName = outdatedPackage.name
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    const updateType = outdatedPackage.type
    return render(this.template, {
      packageName,
      currentVersion,
      newVersion,
      updateType
    })
  }
}
