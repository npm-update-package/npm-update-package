import { render } from 'mustache'
import type { OutdatedPackage } from '../ncu'

export class CommitMessageCreator {
  constructor (private readonly template: string) {}

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
