import { extractPullRequestMetadata } from './extractPullRequestMetadata'
import type { PullRequest } from './PullRequest'

// TODO: Add test
export class PullRequestFinder {
  constructor (private readonly pullRequests: PullRequest[]) {}

  findByPackageName (packageName: string): PullRequest[] {
    return this.pullRequests.filter(({ body }) => {
      if (body === null) {
        return false
      }

      const metadata = extractPullRequestMetadata(body)

      if (metadata === undefined) {
        return false
      }

      return metadata.packages.some(({ name }) => name === packageName)
    })
  }
}
