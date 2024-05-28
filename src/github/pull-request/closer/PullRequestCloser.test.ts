import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type {
  GitHub,
  PullRequest
} from '../../GitHub.js'
import { PullRequestCloser } from './PullRequestCloser.js'

await describe('PullRequestCloser', async () => {
  await describe('close', async () => {
    await it('closes pull request', async ({ mock }) => {
      const closePullRequestMock = mock.fn<GitHub['closePullRequest']>()
      const deleteBranchMock = mock.fn<GitHub['deleteBranch']>()
      const github = {
        closePullRequest: closePullRequestMock,
        deleteBranch: deleteBranchMock
      } as unknown as GitHub
      const pullRequestCreator = new PullRequestCloser(github)
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

      assert.strictEqual(closePullRequestMock.mock.callCount(), 1)
      assert.deepStrictEqual(closePullRequestMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: pullRequest.base.repo.owner.login,
            repo: pullRequest.base.repo.name,
            pullNumber: pullRequest.number
          }
        ]
      ])
      assert.strictEqual(deleteBranchMock.mock.callCount(), 1)
      assert.deepStrictEqual(deleteBranchMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: pullRequest.base.repo.owner.login,
            repo: pullRequest.base.repo.name,
            branch: pullRequest.head.ref
          }
        ]
      ])
    })
  })
})
