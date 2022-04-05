import type { PullRequest } from '../../GitHub'
import type { PullRequestCloser } from './PullRequestCloser'
import { PullRequestsCloser } from './PullRequestsCloser'

describe('PullRequestsCloser', () => {
  describe('close', () => {
    const pullRequestCloserCloseMock = jest.fn()
    const pullRequestCloser = {
      close: pullRequestCloserCloseMock
    } as unknown as PullRequestCloser
    const pullRequestsCloser = new PullRequestsCloser(pullRequestCloser)

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('closes pull requests', async () => {
      const pullRequest1 = {
        number: 1
      } as unknown as PullRequest
      const pullRequest2 = {
        number: 2
      } as unknown as PullRequest
      const pullRequests = [pullRequest1, pullRequest2]

      await pullRequestsCloser.close(pullRequests)

      expect(pullRequestCloserCloseMock).toBeCalledTimes(2)
      expect(pullRequestCloserCloseMock).toBeCalledWith(pullRequest1)
      expect(pullRequestCloserCloseMock).toBeCalledWith(pullRequest2)
    })
  })
})
