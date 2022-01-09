import type { GitRepository } from '../git'
import {
  createLogger,
  LogLevel
} from '../logger'
import type { OutdatedPackage } from '../ncu'
import * as createPullRequestBodyModule from './createPullRequestBody'
import type { GitHub } from './GitHub'
import { PullRequestCreator } from './PullRequestCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'
import type { Repository as GitHubRepository } from './Repository'

describe('PullRequestCreator', () => {
  describe('create', () => {
    const pullRequestTitleCreatorCreateMock = jest.fn()
    const githubCreatePullRequestMock = jest.fn()
    const githubAddLabelsMock = jest.fn()
    const createPullRequestBodySpy = jest.spyOn(createPullRequestBodyModule, 'createPullRequestBody')

    const github = {
      createPullRequest: githubCreatePullRequestMock,
      addLabels: githubAddLabelsMock
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
    const title = 'pull request title'
    const body = 'pull request body'
    const pullRequest = {
      number: 1
    }
    const outdatedPackage = {} as unknown as OutdatedPackage
    const branchName = 'branch name'

    beforeEach(() => {
      pullRequestTitleCreatorCreateMock.mockReturnValue(title)
      githubCreatePullRequestMock.mockResolvedValue(pullRequest)
      createPullRequestBodySpy.mockReturnValue(body)
    })

    afterEach(() => {
      pullRequestTitleCreatorCreateMock.mockReset()
      githubCreatePullRequestMock.mockReset()
      githubAddLabelsMock.mockReset()
      createPullRequestBodySpy.mockReset()
    })

    it('creates pull request', async () => {
      const pullRequestCreator = new PullRequestCreator({
        github,
        gitRepo,
        githubRepo,
        pullRequestTitleCreator,
        logger
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
    })
  })
})
