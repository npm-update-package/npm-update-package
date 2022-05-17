import type { OutdatedPackage } from '../../../core'
import type { GitRepository } from '../../../git'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer'

export class PackageDiffsSectionCreator {
  constructor (private readonly gitHubUrlOptimizer: GitHubUrlOptimizer) {}

  create ({
    outdatedPackage,
    gitRepo
  }: {
    outdatedPackage: OutdatedPackage
    gitRepo?: GitRepository
  }): string {
    const packageName = outdatedPackage.name
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    const links: string[] = []

    if (gitRepo?.isGitHub === true) {
      const url = `${gitRepo.url.toString()}/compare/v${currentVersion}...v${newVersion}`
      const optimizedUrl = this.gitHubUrlOptimizer.optimize(url).toString()
      links.push(`- [GitHub](${optimizedUrl})`)
    }

    links.push(
      `- [npmfs](https://npmfs.com/compare/${packageName}/${currentVersion}/${newVersion})`,
      `- [Package Diff](https://diff.intrinsic.com/${packageName}/${currentVersion}/${newVersion})`,
      `- [Renovate Bot Package Diff](https://renovatebot.com/diffs/npm/${packageName}/${currentVersion}/${newVersion})`
    )
    return `## Package diffs

${links.join('\n')}`
  }
}
