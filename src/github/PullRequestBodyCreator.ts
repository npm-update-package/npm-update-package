import { render } from 'mustache'
import { app } from '../app'
import type { OutdatedPackage } from '../ncu'

export class PullRequestBodyCreator {
  constructor (private readonly template: string) {}

  create (outdatedPackage: OutdatedPackage): string {
    const appName = app.name
    const appVersion = app.version
    const appWeb = app.web
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    const packageName = outdatedPackage.name
    const updateType = outdatedPackage.type
    return render(this.template, {
      appName,
      appVersion,
      appWeb,
      currentVersion,
      newVersion,
      packageName,
      updateType
    })
  }
}
