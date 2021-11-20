import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import type { OutdatedPackage } from '../types'
import { logger } from '../logger'
import { toOutdatedPackages } from '../toOutdatedPackages'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'

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
    const result = await run(options)
    logger.debug(`result=${JSON.stringify(result)}`)

    if (!isNcuOutdatedPackages(result)) {
      throw new Error('result is not NcuOutdatedPackages')
    }

    return await toOutdatedPackages(result)
  }
}
