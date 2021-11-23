import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import { readPackageJson } from '../read-package-json'
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
    const pkg = await readPackageJson('./package.json')
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
