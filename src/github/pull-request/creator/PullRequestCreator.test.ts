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
import type { PullRequestBodyCreator } from './PullRequestBodyCreator'
import { PullRequestCreator } from './PullRequestCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'

describe('PullRequestCreator', () => {
  describe('create', () => {
    const pullRequestBodyCreatorCreateMock = jest.fn()
    const pullRequestTitleCreatorCreateMock = jest.fn()
    const githubCreatePullRequestMock = jest.fn()
    const githubAddLabelsMock = jest.fn()
    const githubRequestReviewersMock = jest.fn()

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
    const pullRequestBodyCreator = {
      create: pullRequestBodyCreatorCreateMock
    } as unknown as PullRequestBodyCreator
    const pullRequestTitleCreator = {
      create: pullRequestTitleCreatorCreateMock
    } as unknown as PullRequestTitleCreator
    const logger = createLogger(LogLevel.Off)
    const outdatedPackage = {} as unknown as OutdatedPackage
    const branchName = 'branch name'

    afterEach(() => {
      pullRequestBodyCreatorCreateMock.mockReset()
      pullRequestTitleCreatorCreateMock.mockReset()
      githubCreatePullRequestMock.mockReset()
      githubAddLabelsMock.mockReset()
      githubRequestReviewersMock.mockReset()
    })

    it('creates pull request', async () => {
      const title = 'pull request title'
      pullRequestTitleCreatorCreateMock.mockReturnValue(title)
      const body = 'pull request body'
      pullRequestBodyCreatorCreateMock.mockResolvedValue(body)
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
        pullRequestBodyCreator,
        logger,
        reviewers
      })
      await pullRequestCreator.create({
        outdatedPackage,
        branchName
      })

      expect(pullRequestTitleCreatorCreateMock).toBeCalledWith(outdatedPackage)
      expect(pullRequestBodyCreatorCreateMock).toBeCalledWith(outdatedPackage)
      expect(githubCreatePullRequestMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        baseBranch: githubRepo.default_branch,
        headBranch: branchName,
        title,
        body
      })
      expect(githubAddLabelsMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber: pullRequest.number,
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
