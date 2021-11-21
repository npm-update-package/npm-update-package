import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import { logger } from '../logger'
import { readAllDependencies } from '../read-all-dependencies'
import type { OutdatedPackage } from '../types'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'
import { NcuOutdatedPackagesConverter } from './NcuOutdatedPackagesConverter'

// TODO: add test
export class Ncu {
  async check (): Promise<OutdatedPackage[]> {
    return await this.run({
      jsonUpgraded: true
    })
  }

  async update (outdatedPackage: OutdatedPackage): Promise<OutdatedPackage[]> {
    return await this.run({
      jsonUpgraded: true,
      filter: outdatedPackage.name,
      upgrade: true
    })
  }

  private async run (options: Options): Promise<OutdatedPackage[]> {
    const currentDependencies = await readAllDependencies('./package.json')
    const result = await run(options)
    logger.debug(`result=${JSON.stringify(result)}`)

    if (!isNcuOutdatedPackages(result)) {
      throw new Error('result is not NcuOutdatedPackages')
    }

    const ncuOutdatedPackagesConverter = new NcuOutdatedPackagesConverter(currentDependencies)
    return ncuOutdatedPackagesConverter.toOutdatedPackages(result)
  }
}
