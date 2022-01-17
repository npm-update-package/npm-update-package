import type {
  GitHub,
  PullRequest
} from '../../GitHub'
import { PullRequestCloser } from './PullRequestCloser'

describe('PullRequestCloser', () => {
  describe('close', () => {
    const githubClosePullRequestMock = jest.fn()

    const github = {
      closePullRequest: githubClosePullRequestMock
    } as unknown as GitHub

    afterEach(() => {
      githubClosePullRequestMock.mockReset()
    })

    it('closes pull request', async () => {
      const pullRequest = {
        number: 1,
        base: {
          repo: {
            name: 'npm-update-package',
            owner: {
              login: 'npm-update-package'
            }
          }
        }
      } as unknown as PullRequest

      const pullRequestCreator = new PullRequestCloser(github)
      await pullRequestCreator.close(pullRequest)

      expect(githubClosePullRequestMock).toBeCalledWith({
        owner: pullRequest.base.repo.owner.login,
        repo: pullRequest.base.repo.name,
        pull_number: pullRequest.number
      })
    })
  })
})
