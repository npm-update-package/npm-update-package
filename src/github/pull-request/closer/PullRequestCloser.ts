import type {
  GitHub,
  PullRequest
} from '../../GitHub'

export class PullRequestCloser {
  constructor (private readonly github: GitHub) {}

  async close (pullRequest: PullRequest): Promise<void> {
    const owner = pullRequest.base.repo.owner.login
    const repo = pullRequest.base.repo.name
    await this.github.closePullRequest({
      owner,
      repo,
      pullNumber: pullRequest.number
    })
    await this.github.deleteBranch({
      owner,
      repo,
      branch: pullRequest.head.ref
    })
  }
}
