import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import { readFile } from '../file'
import type { OutdatedPackage } from '../ncu'
import type { PackageJsonParser } from '../package-json'
import { isNcuResult } from './NcuResult'
import { NcuResultConverter } from './NcuResultConverter'

// TODO: add test
export class Ncu {
  constructor (private readonly packageJsonParser: PackageJsonParser) {}

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
    const packageJson = await readFile('./package.json')
    const pkg = this.packageJsonParser.parse(packageJson)
    const currentDependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies
    }
    const result = await run(options)

    if (!isNcuResult(result)) {
      throw new Error('result is not NcuResult')
    }

    const ncuResultConverter = new NcuResultConverter(currentDependencies)
    return ncuResultConverter.toOutdatedPackages(result)
  }
}
