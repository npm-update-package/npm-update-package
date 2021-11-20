import type { NcuOutdatedPackages } from './types/NcuOutdatedPackages'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { PackageVersion } from './values/PackageVersion'
import { logger } from './logger'
import { readAllDependencies } from './readAllDependencies'

// TODO: add test
export const toOutdatedPackages = async (outdatedPackages: NcuOutdatedPackages): Promise<OutdatedPackage[]> => {
  const dependencies = await readAllDependencies('./package.json')
  logger.debug(`dependencies=${JSON.stringify(dependencies)}`)
  return Object.entries(outdatedPackages)
    .map(([name, newVersion]) => ({
      name,
      currentVersion: PackageVersion.of(dependencies[name]),
      newVersion: PackageVersion.of(newVersion)
    }))
}
