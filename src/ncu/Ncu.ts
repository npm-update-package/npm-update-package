import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import type { OutdatedPackage } from '../ncu'
import type { PackageJsonReader } from '../package-json'
import { isNcuOutdatedPackages } from './NcuOutdatedPackages'
import { NcuOutdatedPackagesConverter } from './NcuOutdatedPackagesConverter'

// TODO: add test
export class Ncu {
  constructor (private readonly packageJsonReader: PackageJsonReader) {}

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
    const pkg = await this.packageJsonReader.read('./package.json')
    const currentDependencies = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
      ...pkg.peerDependencies,
      ...pkg.optionalDependencies
    }
    const result = await run(options)

    if (!isNcuOutdatedPackages(result)) {
      throw new Error('result is not NcuOutdatedPackages')
    }

    const ncuOutdatedPackagesConverter = new NcuOutdatedPackagesConverter(currentDependencies)
    return ncuOutdatedPackagesConverter.toOutdatedPackages(result)
  }
}
