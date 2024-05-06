import type { Release } from '../../releases/Release.js'
import type { GitHubUrlOptimizer } from './GitHubUrlOptimizer.js'

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
