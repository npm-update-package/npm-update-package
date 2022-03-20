import type { Logger } from '../../../logger'
import type { PullRequest } from '../../GitHub'
import type { PullRequestCloser } from './PullRequestCloser'

// TODO: add test
export class PullRequestsCloser {
  private readonly pullRequestCloser: PullRequestCloser
  private readonly logger: Logger

  constructor ({
    pullRequestCloser,
    logger
  }: {
    pullRequestCloser: PullRequestCloser
    logger: Logger
  }) {
    this.pullRequestCloser = pullRequestCloser
    this.logger = logger
  }

  async close (pullRequests: PullRequest[]): Promise<void> {
    await Promise.all(pullRequests.map(async (pullRequest) => {
      await this.pullRequestCloser.close(pullRequest)
      this.logger.info(`Pull request #${pullRequest.number} has closed. ${pullRequest.html_url}`)
    }))
  }
}
