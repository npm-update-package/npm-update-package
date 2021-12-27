import type { GitRepository } from '../git'
import {
  createLogger,
  LogLevel
} from '../logger'
import type { OutdatedPackage } from '../ncu'
import type { GitHub } from './GitHub'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator'
import { PullRequestCreator } from './PullRequestCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'
import type { Repository as GitHubRepository } from './Repository'

describe('PullRequestCreator', () => {
  describe('create', () => {
    const pullRequestTitleCreatorCreateMock = jest.fn()
    const pullRequestBodyCreatorCreateMock = jest.fn()
    const githubCreatePullRequestMock = jest.fn()
    const githubAddLabelsMock = jest.fn()

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
    const pullRequestBodyCreator = {
      create: pullRequestBodyCreatorCreateMock
    } as unknown as PullRequestBodyCreator
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
      pullRequestBodyCreatorCreateMock.mockReturnValue(body)
      githubCreatePullRequestMock.mockResolvedValue(pullRequest)
    })

    afterEach(() => {
      pullRequestTitleCreatorCreateMock.mockReset()
      pullRequestBodyCreatorCreateMock.mockReset()
      githubCreatePullRequestMock.mockReset()
      githubAddLabelsMock.mockReset()
    })

    describe('if labels is undefined', () => {
      const labels = undefined

      it('create pull request', async () => {
        const pullRequestCreator = new PullRequestCreator({
          github,
          gitRepo,
          githubRepo,
          pullRequestTitleCreator,
          pullRequestBodyCreator,
          logger,
          labels
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
          base: githubRepo.default_branch,
          head: branchName,
          title,
          body
        })
        expect(githubAddLabelsMock).not.toBeCalled()
      })
    })

    describe('if labels is not undefined', () => {
      const labels = ['label 1', 'label 2']

      beforeEach(() => {
        githubAddLabelsMock.mockResolvedValue({})
      })

      it('create pull request and add labels to it', async () => {
        const pullRequestCreator = new PullRequestCreator({
          github,
          gitRepo,
          githubRepo,
          pullRequestTitleCreator,
          pullRequestBodyCreator,
          logger,
          labels
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
          base: githubRepo.default_branch,
          head: branchName,
          title,
          body
        })
        expect(githubAddLabelsMock).toBeCalledWith({
          owner: gitRepo.owner,
          repo: gitRepo.name,
          issue_number: pullRequest.number,
          labels
        })
      })
    })
  })
})
