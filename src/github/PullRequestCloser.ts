import type { GitHub } from './GitHub'
import type { PullRequest } from './PullRequest'

// TODO: Add test
export class PullRequestCloser {
  constructor (private readonly github: GitHub) {}

  async close (pullRequest: PullRequest): Promise<void> {
    await this.github.closePullRequest({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      pull_number: pullRequest.number
    })
  }
}
