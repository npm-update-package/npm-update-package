import * as app from '../../../app.js'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import type { PullRequestMetadata } from './PullRequestMetadata.js'

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
