
import pkg from '../../../../package.json'
import type { OutdatedPackage } from '../../../core'
import type { PullRequestMetadata } from './PullRequestMetadata'

export const createPullRequestMetadata = (outdatedPackages: OutdatedPackage[]): PullRequestMetadata => {
  return {
    version: pkg.version,
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
