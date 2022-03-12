import {
  gte,
  lte,
  valid
} from 'semver'
import { isNotUndefined } from 'type-guards'
import type { GitRepository } from '../../../git'
import type { Logger } from '../../../logger'
import type { PackageManager } from '../../../package-manager'
import type { SemVer } from '../../../semver'
import { isNotFoundError } from '../../errors'
import type {
  GitHub,
  Release
} from '../../GitHub'

export class ReleasesFetcher {
  private readonly github: GitHub
  private readonly packageManager: PackageManager
  private readonly logger: Logger

  constructor ({
    github,
    packageManager,
    logger
  }: {
    github: GitHub
    packageManager: PackageManager
    logger: Logger
  }) {
    this.github = github
    this.packageManager = packageManager
    this.logger = logger
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
      owner: gitRepo.owner,
      repo: gitRepo.name,
      tags
    })
  }

  private async fetchReleaseByTag ({
    owner,
    repo,
    tag
  }: {
    owner: string
    repo: string
    tag: string
  }): Promise<Release | undefined> {
    try {
      return await this.github.fetchReleaseByTag({
        owner,
        repo,
        tag
      })
    } catch (e) {
      if (isNotFoundError(e)) {
        this.logger.warn(e)
        return undefined
      } else {
        // TODO: Add test
        throw e
      }
    }
  }

  private async fetchReleasesByTags ({
    owner,
    repo,
    tags
  }: {
    owner: string
    repo: string
    tags: string[]
  }): Promise<Release[]> {
    const releases = await Promise.all(tags.map(async (tag) => {
      return await this.fetchReleaseByTag({
        owner,
        repo,
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
