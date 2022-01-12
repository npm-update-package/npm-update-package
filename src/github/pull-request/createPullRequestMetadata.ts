import { app } from '../../app'
import type { OutdatedPackage } from '../../ncu'
import type { PullRequestMetadata } from './PullRequestMetadata'

// TODO: Add test
export const createPullRequestMetadata = (outdatedPackages: OutdatedPackage[]): PullRequestMetadata => {
  return {
    version: app.version,
    packages: outdatedPackages.map(({ name, currentVersion, newVersion, type }) => ({
      name,
      currentVersion: currentVersion.version,
      newVersion: newVersion.version,
      type
    }))
  }
}
