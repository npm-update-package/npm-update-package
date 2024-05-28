import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import { createRequirePackageJSON } from '../../../util/createRequirePackageJSON.js'
import type { PullRequestMetadata } from './PullRequestMetadata.js'

const pkg = createRequirePackageJSON(import.meta.url)('../../../../package.json')

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
