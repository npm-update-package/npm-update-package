import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { PullRequest } from '../../GitHub.js'
import type { PullRequestCloser } from './PullRequestCloser.js'
import { PullRequestsCloser } from './PullRequestsCloser.js'

await describe('PullRequestsCloser', async () => {
  await describe('close', async () => {
    await it('closes pull requests', async ({ mock }) => {
      const closeMock = mock.fn<PullRequestCloser['close']>()
      const pullRequestCloser = {
        close: closeMock
      } as unknown as PullRequestCloser
      const pullRequestsCloser = new PullRequestsCloser(pullRequestCloser)
      const pullRequest1 = {
        number: 1
      } as unknown as PullRequest
      const pullRequest2 = {
        number: 2
      } as unknown as PullRequest
      const pullRequests = [pullRequest1, pullRequest2]

      await pullRequestsCloser.close(pullRequests)

      assert.strictEqual(closeMock.mock.callCount(), 2)
      assert.deepStrictEqual(closeMock.mock.calls.map(call => call.arguments), [
        [pullRequest1],
        [pullRequest2]
      ])
    })
  })
})
