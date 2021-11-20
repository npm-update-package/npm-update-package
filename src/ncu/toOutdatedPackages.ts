import type { OutdatedPackage } from '../types'
import { PackageVersion } from '../values'
import { logger } from '../logger'
import { readAllDependencies } from '../readAllDependencies'
import type { NcuOutdatedPackages } from './NcuOutdatedPackages'

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
