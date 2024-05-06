import fetch from 'node-fetch'
import {
  gte,
  lte,
  valid
} from 'semver'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import type { PackageManager } from '../../../package-manager/PackageManager.js'
import type { SemVer } from '../../../semver/SemVer.js'
import { sleep } from '../../../util/sleep.js'
import type { Release } from '../Release.js'

// TODO: Split into multiple classes and functions
export class ReleasesFetcher {
  private readonly options: Options
  private readonly packageManager: PackageManager

  constructor ({
    options,
    packageManager
  }: {
    options: Options
    packageManager: PackageManager
  }) {
    this.options = options
    this.packageManager = packageManager
  }

  async fetch ({
    gitRepo,
    packageName,
    from,
    to
  }: {
    gitRepo: GitRepository
    packageName: string
    from: SemVer
    to: SemVer
  }): Promise<Release[]> {
    const versions = await this.getVersions({
      packageName,
      from,
      to
    })
    const tags = versions.map(version => `v${version}`)
    return await this.fetchReleasesByTags({
      gitRepo,
      tags
    })
  }

  private async fetchReleaseByTag ({
    gitRepo,
    tag
  }: {
    gitRepo: GitRepository
    tag: string
  }): Promise<Release | undefined> {
    const url = `${gitRepo.url.toString()}/releases/tag/${tag}`
    const resp = await fetch(url)

    if (resp.ok) {
      return {
        tag,
        url
      }
    }
  }

  private async fetchReleasesByTags ({
    gitRepo,
    tags
  }: {
    gitRepo: GitRepository
    tags: string[]
  }): Promise<Release[]> {
    const releases: Release[] = []

    for (const [i, tag] of tags.entries()) {
      if (i > 0) {
        await sleep(this.options.fetchInterval)
      }

      const release = await this.fetchReleaseByTag({
        gitRepo,
        tag
      })

      if (release !== undefined) {
        releases.push(release)
      }
    }

    return releases
  }

  private async getVersions ({
    packageName,
    from,
    to
  }: {
    packageName: string
    from: SemVer
    to: SemVer
  }): Promise<string[]> {
    const versions = await this.packageManager.getVersions(packageName)
    // TODO: Move these to SemVer
    return versions.filter(version => valid(version))
      .filter(version => gte(version, from.version))
      .filter(version => lte(version, to.version))
  }
}
