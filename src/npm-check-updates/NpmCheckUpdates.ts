import {
  run,
  type RunOptions
} from 'npm-check-updates'
import { isNotUndefined } from 'type-guards'
import type { OutdatedPackage } from '../core/OutdatedPackage.js'
import { logger } from '../logger/logger.js'
import type { Options } from '../options/Options.js'
import { DependencyType } from '../package-json/DependencyType.js'
import type { PackageMetadata } from '../package-json/PackageMetadata.js'
import { readPackageJson } from '../package-json/readPackageJson.js'
import { compareSemVers } from '../semver/compareSemVers.js'
import { SemVer } from '../semver/SemVer.js'
import { createDepOptionValue } from './createDepOptionValue.js'
import { isNpmCheckUpdatesResult } from './NpmCheckUpdatesResult.js'

// TODO: Add test
export class NpmCheckUpdates {
  constructor (private readonly options: Options) {}

  async check (): Promise<OutdatedPackage[]> {
    const dep = createDepOptionValue(this.options.dependencyTypes)
    logger.trace(`dep=${dep}`)
    return await this.run({
      packageManager: this.options.packageManager,
      jsonUpgraded: true,
      dep,
      reject: this.options.ignorePackages
    })
  }

  async update (outdatedPackage: OutdatedPackage): Promise<OutdatedPackage[]> {
    return await this.run({
      packageManager: this.options.packageManager,
      jsonUpgraded: true,
      filter: outdatedPackage.name,
      upgrade: true
    })
  }

  private async run (options: RunOptions): Promise<OutdatedPackage[]> {
    // Read package.json before running npm-check-updates
    const pkg = await readPackageJson('./package.json')
    logger.trace(`pkg=${JSON.stringify(pkg)}`)

    // Run npm-check-updates
    const result = await run(options)
    logger.trace(`result=${JSON.stringify(result)}`)

    if (!isNpmCheckUpdatesResult(result)) {
      throw new Error(`npm-check-updates has outputted unexpected result. result=${JSON.stringify(result)}`)
    }

    const resultEntries = Object.entries(result)
    logger.trace(`resultEntries=${JSON.stringify(resultEntries)}`)

    const outdatedPackages: OutdatedPackage[] = resultEntries
      .map(([name, newVersionString]) => {
        const currentVersionString = this.extractCurrentVersionString(pkg, name)
        logger.trace(`currentVersionString=${String(currentVersionString)}`)

        if (currentVersionString === undefined) {
          return undefined
        }

        const dependencyType = this.extractDependencyType(pkg, name)
        logger.trace(`dependencyType=${String(dependencyType)}`)

        if (dependencyType === undefined) {
          return undefined
        }

        const currentVersion = SemVer.of(currentVersionString)
        const newVersion = SemVer.of(newVersionString)
        const level = compareSemVers(currentVersion, newVersion)
        logger.trace(`level=${String(level)}`)

        if (level === undefined) {
          return undefined
        }

        const outdatedPackage: OutdatedPackage = {
          name,
          currentVersion,
          newVersion,
          level,
          dependencyType
        }
        logger.trace(`outdatedPackage=${JSON.stringify(outdatedPackage)}`)
        return outdatedPackage
      })
      // eslint-disable-next-line unicorn/no-array-callback-reference
      .filter(isNotUndefined)
    logger.trace(`outdatedPackages=${JSON.stringify(outdatedPackages)}`)

    if (resultEntries.length !== outdatedPackages.length) {
      throw new Error(`Failed to running npm-check-updates. result=${JSON.stringify(result)}`)
    }

    return outdatedPackages
  }

  private extractCurrentVersionString (pkg: PackageMetadata, packageName: string): string | undefined {
    const { dependencies, devDependencies, peerDependencies, bundledDependencies, optionalDependencies } = pkg

    if (dependencies?.[packageName] !== undefined) {
      return dependencies[packageName]
    } else if (devDependencies?.[packageName] !== undefined) {
      return devDependencies[packageName]
    } else if (peerDependencies?.[packageName] !== undefined) {
      return peerDependencies[packageName]
    } else if (bundledDependencies?.[packageName] !== undefined) {
      return bundledDependencies[packageName]
    } else if (optionalDependencies?.[packageName] !== undefined) {
      return optionalDependencies[packageName]
    }
  }

  private extractDependencyType (pkg: PackageMetadata, packageName: string): DependencyType | undefined {
    const { dependencies, devDependencies, peerDependencies, bundledDependencies, optionalDependencies } = pkg

    if (dependencies?.[packageName] !== undefined) {
      return DependencyType.Dependencies
    } else if (devDependencies?.[packageName] !== undefined) {
      return DependencyType.DevDependencies
    } else if (peerDependencies?.[packageName] !== undefined) {
      return DependencyType.PeerDependencies
    } else if (bundledDependencies?.[packageName] !== undefined) {
      return DependencyType.BundledDependencies
    } else if (optionalDependencies?.[packageName] !== undefined) {
      return DependencyType.OptionalDependencies
    }
  }
}
