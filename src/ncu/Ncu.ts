import { run } from 'npm-check-updates'
import type { RunOptions } from 'npm-check-updates/build/src/types'
import { isNotUndefined } from 'type-guards'
import type { OutdatedPackage } from '../core'
import { readFile } from '../file'
import type { Logger } from '../logger'
import { PackageMetadata, parsePackageJson } from '../package-json'
import {
  compareSemVers,
  SemVer
} from '../semver'
import {
  isNcuResult,
  type NcuResult
} from './NcuResult'

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
    const packageMetadata = parsePackageJson(json)
    this.logger.debug(`packageMetadata=${JSON.stringify(packageMetadata)}`)
    const result = await run(options)
    this.logger.debug(`result=${JSON.stringify(result)}`)

    if (!isNcuResult(result)) {
      throw new Error('result is not NcuResult')
    }

    return this.createOutdatedPackages({
      result,
      packageMetadata
    })
  }

  private createOutdatedPackages ({
    result,
    packageMetadata
  }: {
    result: NcuResult
    packageMetadata: PackageMetadata
  }): OutdatedPackage[] {
    const {
      dependencies,
      devDependencies,
      peerDependencies,
      optionalDependencies
    } = packageMetadata
    const currentDependencies = {
      ...dependencies,
      ...devDependencies,
      ...peerDependencies,
      ...optionalDependencies
    }
    const resultEntries = Object.entries(result)
    const outdatedPackages: OutdatedPackage[] = resultEntries
      .map(([name, newVersionString]) => {
        const currentVersionString = currentDependencies[name]

        if (currentVersionString === undefined) {
          return undefined
        }

        const currentVersion = SemVer.of(currentVersionString)
        const newVersion = SemVer.of(newVersionString)
        const level = compareSemVers(currentVersion, newVersion)

        if (level === undefined) {
          return undefined
        }

        const outdatedPackage: OutdatedPackage = {
          name,
          currentVersion,
          newVersion,
          level
        }
        return outdatedPackage
      })
      .filter(isNotUndefined)

    if (resultEntries.length !== outdatedPackages.length) {
      throw new Error('Failed to create outdatedPackages.')
    }

    return outdatedPackages
  }
}
