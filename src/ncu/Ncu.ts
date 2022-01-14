import { run } from 'npm-check-updates'
import type { RunOptions } from 'npm-check-updates/build/src/types'
import type { OutdatedPackage } from '../core'
import { readFile } from '../file'
import type { Logger } from '../logger'
import type { PackageJsonParser } from '../package-json'
import { isNcuResult } from './NcuResult'
import { NcuResultConverter } from './NcuResultConverter'

// TODO: add test
export class Ncu {
  private readonly packageJsonParser: PackageJsonParser
  private readonly logger: Logger

  constructor ({
    packageJsonParser,
    logger
  }: {
    packageJsonParser: PackageJsonParser
    logger: Logger
  }) {
    this.packageJsonParser = packageJsonParser
    this.logger = logger
  }

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
    const pkg = this.packageJsonParser.parse(json)
    this.logger.debug(`pkg=${JSON.stringify(pkg)}`)
    const result = await run(options)
    this.logger.debug(`result=${JSON.stringify(result)}`)

    if (!isNcuResult(result)) {
      throw new Error('result is not NcuResult')
    }

    const ncuResultConverter = new NcuResultConverter({
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies
    })
    return ncuResultConverter.toOutdatedPackages(result)
  }
}
