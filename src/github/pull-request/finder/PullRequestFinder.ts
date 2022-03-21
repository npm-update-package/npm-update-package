import type { PullRequest } from '../../GitHub'
import { extractPullRequestMetadata } from '../metadata'
import { isPullRequestByNpmUpdatePackage } from './isPullRequestByNpmUpdatePackage'

export class PullRequestFinder {
  constructor (private readonly pullRequests: PullRequest[]) {}

  findByPackageName (packageName: string): PullRequest[] {
    return this.pullRequests
      .filter(isPullRequestByNpmUpdatePackage)
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
