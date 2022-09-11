import type {
  GitHub,
  PullRequest
} from '../../GitHub'
import { PullRequestCloser } from './PullRequestCloser'

describe('PullRequestCloser', () => {
  describe('close', () => {
    const githubClosePullRequestMock = jest.fn()
    const githubDeleteBranchMock = jest.fn()
    const github = {
      closePullRequest: githubClosePullRequestMock,
      deleteBranch: githubDeleteBranchMock
    } as unknown as GitHub
    const pullRequestCreator = new PullRequestCloser(github)

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('closes pull request', async () => {
      const pullRequest = {
        number: 1,
        head: {
          ref: 'new-topic'
        },
        base: {
          repo: {
            name: 'npm-update-package',
            owner: {
              login: 'npm-update-package'
            }
          }
        }
      } as unknown as PullRequest

      await pullRequestCreator.close(pullRequest)

      expect(githubClosePullRequestMock).toHaveBeenCalledWith({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pullNumber: pullRequest.number
      })
      expect(githubDeleteBranchMock).toHaveBeenCalledWith({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        branch: pullRequest.head.ref
      })
    })
  })
})
