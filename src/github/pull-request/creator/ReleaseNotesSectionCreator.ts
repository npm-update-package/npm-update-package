import { Release } from '../../releases'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer'

export class ReleaseNotesSectionCreator {
  constructor (private readonly gitHubUrlOptimizer: GitHubUrlOptimizer) {}

  create (releases: Release[]): string {
    const items = releases.map(({
      tag,
      url
    }) => {
      const optimizedUrl = this.gitHubUrlOptimizer.optimize(url).toString()
      return `- [${tag}](${optimizedUrl})`
    })
    return `## Release notes

${items.join('\n')}`
  }
}
