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
    const githubCreatePullRequestMock = jest.fn()
    const pullRequestTitleCreatorCreateMock = jest.fn()
    const pullRequestBodyCreatorCreateMock = jest.fn()

    afterEach(() => {
      githubCreatePullRequestMock.mockReset()
      pullRequestTitleCreatorCreateMock.mockReset()
      pullRequestBodyCreatorCreateMock.mockReset()
    })

    it('create pull request', async () => {
      githubCreatePullRequestMock.mockResolvedValue({})
      const title = 'pull request title'
      pullRequestTitleCreatorCreateMock.mockReturnValue(title)
      const body = 'pull request body'
      pullRequestBodyCreatorCreateMock.mockReturnValue(body)

      const github = {
        createPullRequest: githubCreatePullRequestMock
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
      const pullRequestCreator = new PullRequestCreator({
        github,
        gitRepo,
        githubRepo,
        pullRequestTitleCreator,
        pullRequestBodyCreator,
        logger
      })
      const outdatedPackage: OutdatedPackage = {} as unknown as OutdatedPackage
      const branchName = 'branch name'

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
    })
  })
})
