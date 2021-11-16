import { run } from 'npm-check-updates'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'
import { toOutdatedPackages } from './toOutdatedPackages'

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
