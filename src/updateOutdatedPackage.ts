import { run } from 'npm-check-updates'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'
import { toOutdatedPackages } from './toOutdatedPackages'

// TODO: add logs using logger
// TODO: rename to updatePackageJson (or execute PackageManager.install() here)
export const updateOutdatedPackage = async (outdatedPackage: OutdatedPackage): Promise<OutdatedPackage[]> => {
  const result = await run({
    jsonUpgraded: true,
    filter: outdatedPackage.name,
    upgrade: true
  })

  if (!isNcuOutdatedPackages(result)) {
    throw new Error('result is not NcuOutdatedPackages')
  }

  return await toOutdatedPackages(result)
}
