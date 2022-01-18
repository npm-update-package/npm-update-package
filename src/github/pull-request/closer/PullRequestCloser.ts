import type {
  GitHub,
  PullRequest
} from '../../GitHub'

export class PullRequestCloser {
  constructor (private readonly github: GitHub) {}

  async close (pullRequest: PullRequest): Promise<void> {
    await this.github.closePullRequest({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      pull_number: pullRequest.number
    })
    await this.github.deleteBranch({
      owner: pullRequest.base.repo.owner.login,
      repo: pullRequest.base.repo.name,
      branch: pullRequest.head.ref
    })
  }
}
