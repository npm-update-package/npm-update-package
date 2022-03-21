import {
  createLogger,
  LogLevel
} from '../../../logger'
import type { PullRequest } from '../../GitHub'
import type { PullRequestCloser } from './PullRequestCloser'
import { PullRequestsCloser } from './PullRequestsCloser'

describe('PullRequestsCloser', () => {
  describe('close', () => {
    const pullRequestCloserCloseMock = jest.fn()
    const pullRequestCloser = {
      close: pullRequestCloserCloseMock
    } as unknown as PullRequestCloser
    const logger = createLogger(LogLevel.Off)
    const pullRequestsCreator = new PullRequestsCloser({
      pullRequestCloser,
      logger
    })

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

      await pullRequestsCreator.close(pullRequests)

      expect(pullRequestCloserCloseMock).toBeCalledTimes(2)
      expect(pullRequestCloserCloseMock).toBeCalledWith(pullRequest1)
      expect(pullRequestCloserCloseMock).toBeCalledWith(pullRequest2)
    })
  })
})
