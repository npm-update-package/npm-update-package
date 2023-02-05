import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type {
  GitHub,
  PullRequest
} from '../../GitHub'
import { PullRequestCloser } from './PullRequestCloser'

describe('PullRequestCloser', () => {
  describe('close', () => {
    const githubClosePullRequestMock = jest.fn<GitHub['closePullRequest']>()
    const githubDeleteBranchMock = jest.fn<GitHub['deleteBranch']>()
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
