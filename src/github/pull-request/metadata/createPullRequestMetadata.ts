import { app } from '../../../app'
import type { OutdatedPackage } from '../../../core'
import type { PullRequestMetadata } from './PullRequestMetadata'

export const createPullRequestMetadata = (outdatedPackages: OutdatedPackage[]): PullRequestMetadata => {
  return {
    version: app.version,
    packages: outdatedPackages.map(({
      name,
      currentVersion,
      newVersion,
      level
    }) => ({
      name,
      currentVersion: currentVersion.version,
      newVersion: newVersion.version,
      level
    }))
  }
}
