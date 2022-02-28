import {
  gte,
  lte
} from 'semver'
import type { GitRepository } from '../../../git'
import type { SemVer } from '../../../semver'
import type {
  GitHub,
  Release
} from '../../GitHub'

export class ReleasesFetcher {
  constructor (private readonly github: GitHub) {}

  async fetch ({
    gitRepo,
    from,
    to
  }: {
    gitRepo: GitRepository
    from: SemVer
    to: SemVer
  }): Promise<Release[]> {
    const releases = await this.github.fetchReleases({
      owner: gitRepo.owner,
      repo: gitRepo.name
    })
    return releases.filter(({ tag_name: version }) => gte(version, from.version) && lte(version, to.version))
  }
}
