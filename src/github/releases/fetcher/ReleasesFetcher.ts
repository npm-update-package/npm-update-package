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

// TODO: Add test
export class ReleasesFetcher {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository

  constructor ({
    github,
    gitRepo
  }: {
    github: GitHub
    gitRepo: GitRepository
  }) {
    this.github = github
    this.gitRepo = gitRepo
  }

  async fetch ({
    from,
    to
  }: {
    from: SemVer
    to: SemVer
  }): Promise<Release[]> {
    const releases = await this.github.fetchReleases({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name
    })
    return releases.filter(({ tag_name: version }) => gte(version, from.version) && lte(version, to.version))
  }
}
