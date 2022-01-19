import type { OutdatedPackage } from '../../../core'
import type { GitRepository } from '../../../git'
import {
  createLogger,
  LogLevel
} from '../../../logger'
import type {
  GitHub,
  Repository as GitHubRepository
} from '../../GitHub'
import * as createPullRequestBodyModule from './createPullRequestBody'
import { PullRequestCreator } from './PullRequestCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'

describe('PullRequestCreator', () => {
  describe('create', () => {
    const pullRequestTitleCreatorCreateMock = jest.fn()
    const githubCreatePullRequestMock = jest.fn()
    const githubAddLabelsMock = jest.fn()
    const githubRequestReviewersMock = jest.fn()
    const createPullRequestBodySpy = jest.spyOn(createPullRequestBodyModule, 'createPullRequestBody')

    const github = {
      createPullRequest: githubCreatePullRequestMock,
      addLabels: githubAddLabelsMock,
      requestReviewers: githubRequestReviewersMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'repository owner',
      name: 'repository name'
    } as unknown as GitRepository
    const githubRepo = {
      default_branch: 'master'
    } as unknown as GitHubRepository
    const pullRequestTitleCreator = {
      create: pullRequestTitleCreatorCreateMock
    } as unknown as PullRequestTitleCreator
    const logger = createLogger(LogLevel.Off)
    const outdatedPackage = {} as unknown as OutdatedPackage
    const branchName = 'branch name'

    afterEach(() => {
      pullRequestTitleCreatorCreateMock.mockReset()
      githubCreatePullRequestMock.mockReset()
      githubAddLabelsMock.mockReset()
      githubRequestReviewersMock.mockReset()
      createPullRequestBodySpy.mockReset()
    })

    it('creates pull request', async () => {
      const title = 'pull request title'
      pullRequestTitleCreatorCreateMock.mockReturnValue(title)
      const body = 'pull request body'
      createPullRequestBodySpy.mockReturnValue(body)
      const pullRequest = {
        number: 1
      }
      githubCreatePullRequestMock.mockResolvedValue(pullRequest)

      const reviewers = ['npm-update-package']
      const pullRequestCreator = new PullRequestCreator({
        github,
        gitRepo,
        githubRepo,
        pullRequestTitleCreator,
        logger,
        reviewers
      })
      await pullRequestCreator.create({
        outdatedPackage,
        branchName
      })

      expect(pullRequestTitleCreatorCreateMock).toBeCalledWith(outdatedPackage)
      expect(createPullRequestBodySpy).toBeCalledWith(outdatedPackage)
      expect(githubCreatePullRequestMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        base: githubRepo.default_branch,
        head: branchName,
        title,
        body
      })
      expect(githubAddLabelsMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issue_number: pullRequest.number,
        labels: ['npm-update-package']
      })
      expect(githubRequestReviewersMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        pullNumber: pullRequest.number,
        reviewers
      })
    })
  })
})
