import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { PullRequest } from '../../GitHub.js'
import type { PullRequestCloser } from './PullRequestCloser.js'
import { PullRequestsCloser } from './PullRequestsCloser.js'

describe('PullRequestsCloser', () => {
  describe('close', () => {
    const pullRequestCloserCloseMock = jest.fn<PullRequestCloser['close']>()
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

      expect(pullRequestCloserCloseMock).toHaveBeenCalledTimes(2)
      expect(pullRequestCloserCloseMock).toHaveBeenCalledWith(pullRequest1)
      expect(pullRequestCloserCloseMock).toHaveBeenCalledWith(pullRequest2)
    })
  })
})
