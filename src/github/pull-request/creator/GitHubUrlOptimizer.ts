import { URL } from 'url'
import type { Options } from '../../../options'

export class GitHubUrlOptimizer {
  constructor (private readonly options: Options) {}

  /**
   * Convert URL to prevent linking to other repositories.
   */
  optimize (url: string | URL): URL {
    const newUrl = url instanceof URL ? url : new URL(url)

    if (newUrl.host === 'github.com') {
      newUrl.host = this.options.prBodyGithubHost
    }

    return newUrl
  }
}
