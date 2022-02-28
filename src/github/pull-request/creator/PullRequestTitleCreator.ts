import { render } from 'mustache'
import type { OutdatedPackage } from '../../../core'

export class PullRequestTitleCreator {
  constructor (private readonly template: string) {}

  create (outdatedPackage: OutdatedPackage): string {
    const packageName = outdatedPackage.name
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    const level = outdatedPackage.level
    const dependencyType = outdatedPackage.dependencyType
    return render(this.template, {
      packageName,
      currentVersion,
      newVersion,
      level,
      dependencyType
    })
  }
}
