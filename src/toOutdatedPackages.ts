import type { NcuOutdatedPackages } from './types/NcuOutdatedPackages'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { PackageVersion } from './PackageVersion'
import { readAllDependencies } from './readAllDependencies'

// TODO: add logs using logger
export const toOutdatedPackages = async (outdatedPackages: NcuOutdatedPackages): Promise<OutdatedPackage[]> => {
  const dependencies = await readAllDependencies('./package.json')
  return Object.entries(outdatedPackages)
    .map(([name, newVersion]) => ({
      name,
      currentVersion: PackageVersion.of(dependencies[name]),
      newVersion: PackageVersion.of(newVersion)
    }))
}
