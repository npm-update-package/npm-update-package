import { logger } from '../../../logger/logger.js'
import type { PullRequest } from '../../GitHub.js'
import type { PullRequestCloser } from './PullRequestCloser.js'

export class PullRequestsCloser {
  constructor (private readonly pullRequestCloser: PullRequestCloser) {}

  async close (pullRequests: PullRequest[]): Promise<void> {
    await Promise.all(pullRequests.map(async (pullRequest) => {
      await this.pullRequestCloser.close(pullRequest)
      logger.info(`Pull request #${pullRequest.number} has closed. ${pullRequest.html_url}`)
    }))
  }
}
