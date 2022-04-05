import { logger } from '../../../logger/singleton'
import type { PullRequest } from '../../GitHub'
import type { PullRequestCloser } from './PullRequestCloser'

export class PullRequestsCloser {
  constructor (private readonly pullRequestCloser: PullRequestCloser) {}

  async close (pullRequests: PullRequest[]): Promise<void> {
    await Promise.all(pullRequests.map(async (pullRequest) => {
      await this.pullRequestCloser.close(pullRequest)
      logger.info(`Pull request #${pullRequest.number} has closed. ${pullRequest.html_url}`)
    }))
  }
}
