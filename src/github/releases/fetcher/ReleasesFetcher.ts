import fetch from 'node-fetch'
import {
  gte,
  lte,
  valid
} from 'semver'
import { isNotUndefined } from 'type-guards'
import type { GitRepository } from '../../../git'
import type { PackageManager } from '../../../package-manager'
import type { SemVer } from '../../../semver'
import type { Release } from '../Release'

export class ReleasesFetcher {
  private readonly packageManager: PackageManager

  constructor ({
    packageManager
  }: {
    packageManager: PackageManager
  }) {
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
    const releases = await Promise.all(tags.map(async (tag) => {
      return await this.fetchReleaseByTag({
        gitRepo,
        tag
      })
    }))
    return releases.filter(isNotUndefined)
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
