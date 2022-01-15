import { run } from 'npm-check-updates'
import type { RunOptions } from 'npm-check-updates/build/src/types'
import type { OutdatedPackage } from '../core'
import { readFile } from '../file'
import type { Logger } from '../logger'
import { parsePackageJson } from '../package-json'
import { isNcuResult } from './NcuResult'
import { NcuResultConverter } from './NcuResultConverter'

// TODO: add test
export class Ncu {
  constructor (private readonly logger: Logger) {}

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

  private async run (options: RunOptions): Promise<OutdatedPackage[]> {
    const json = await readFile('./package.json')
    const pkg = parsePackageJson(json)
    this.logger.debug(`pkg=${JSON.stringify(pkg)}`)
    const result = await run(options)
    this.logger.debug(`result=${JSON.stringify(result)}`)

    if (!isNcuResult(result)) {
      throw new Error('result is not NcuResult')
    }

    const ncuResultConverter = new NcuResultConverter(pkg)
    return ncuResultConverter.toOutdatedPackages(result)
  }
}
