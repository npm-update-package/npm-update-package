import { run } from 'npm-check-updates'
import type { OutdatedPackage } from '../ncu'
import type { PackageJsonReader } from '../package-json'
import { isNcuResult } from './NcuResult'
import { NcuResultConverter } from './NcuResultConverter'

type Options = NonNullable<Parameters<typeof run>[0]>

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
    const pkg = await this.packageJsonReader.read()
    const result = await run(options)

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
