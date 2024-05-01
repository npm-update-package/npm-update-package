import type { PullRequest } from '../../GitHub.js'
import { extractPullRequestMetadata } from '../metadata/extractPullRequestMetadata.js'
import { isPullRequestByNpmUpdatePackage } from './isPullRequestByNpmUpdatePackage.js'

export class PullRequestFinder {
  constructor (private readonly pullRequests: PullRequest[]) {}

  findByPackageName (packageName: string): PullRequest[] {
    return this.pullRequests
      .filter(pullRequest => isPullRequestByNpmUpdatePackage(pullRequest))
      .filter(({ body }) => {
        if (body === null) {
          return false
        }

        const metadata = extractPullRequestMetadata(body)

        if (metadata === undefined) {
          return false
        }

        const { packages } = metadata
        return packages.some(({ name }) => name === packageName)
      })
  }
}
