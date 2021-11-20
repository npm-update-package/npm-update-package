import type { OutdatedPackage } from './types/OutdatedPackage'
import { runNcu } from './runNcu'

// TODO: add test
// TODO: rename to updatePackageJson (or execute PackageManager.install() here)
export const updateOutdatedPackage = async (outdatedPackage: OutdatedPackage): Promise<OutdatedPackage[]> => {
  return await runNcu({
    jsonUpgraded: true,
    filter: outdatedPackage.name,
    upgrade: true
  })
}
