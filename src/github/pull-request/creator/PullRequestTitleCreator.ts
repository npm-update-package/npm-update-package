import { render } from 'mustache'
import type { OutdatedPackage } from '../../../core'

export class PullRequestTitleCreator {
  constructor (private readonly template: string) {}

  create (outdatedPackage: OutdatedPackage): string {
    const packageName = outdatedPackage.name
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    // TODO: rename to level
    const updateType = outdatedPackage.level
    return render(this.template, {
      packageName,
      currentVersion,
      newVersion,
      updateType
    })
  }
}
