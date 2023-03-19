import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { OutdatedPackage } from '../../../core'
import type { GitRepository } from '../../../git'
import type { Options } from '../../../options'
import type {
  GitHub,
  Repository as GitHubRepository,
  CreatedPullRequest
} from '../../GitHub'
import type { AssigneesAdder } from './AssigneesAdder'
import type { LabelsAdder } from './LabelsAdder'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator'
import { PullRequestCreator } from './PullRequestCreator'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator'
import type { ReviewersAdder } from './ReviewersAdder'

describe('PullRequestCreator', () => {
  describe('create', () => {
    const pullRequestBodyCreatorCreateMock = jest.fn<PullRequestBodyCreator['create']>()
    const pullRequestTitleCreatorCreateMock = jest.fn<PullRequestTitleCreator['create']>()
    const githubAddLabelsMock = jest.fn<GitHub['addLabels']>()
    const githubCreatePullRequestMock = jest.fn<GitHub['createPullRequest']>()
    const labelsAdderAddMock = jest.fn<LabelsAdder['add']>()
    const assigneesAdderAddMock = jest.fn<AssigneesAdder['add']>()
    const reviewersAdderAddMock = jest.fn<ReviewersAdder['add']>()
    const github = {
      addLabels: githubAddLabelsMock,
      createPullRequest: githubCreatePullRequestMock
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
    const labelsAdder = {
      add: labelsAdderAddMock
    } as unknown as LabelsAdder
    const assigneesAdder = {
      add: assigneesAdderAddMock
    } as unknown as AssigneesAdder
    const reviewersAdder = {
      add: reviewersAdderAddMock
    } as unknown as ReviewersAdder
    const options = {
      additionalLabels: ['bot', 'dependencies'],
      assignees: ['alice', 'bob'],
      assigneesSampleSize: 1,
      draftPr: true,
      reviewers: ['carol', 'dave'],
      reviewersSampleSize: 1
    }
    const pullRequestCreator = new PullRequestCreator({
      options: options as Options,
      github,
      gitRepo,
      githubRepo,
      pullRequestTitleCreator,
      pullRequestBodyCreator,
      labelsAdder,
      assigneesAdder,
      reviewersAdder
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('creates pull request', async () => {
      const title = 'pull request title'
      pullRequestTitleCreatorCreateMock.mockReturnValue(title)
      const body = 'pull request body'
      pullRequestBodyCreatorCreateMock.mockResolvedValue(body)
      const pullRequest = {
        number: 1
      } as unknown as CreatedPullRequest
      githubCreatePullRequestMock.mockResolvedValue(pullRequest)
      const outdatedPackage = {} as unknown as OutdatedPackage
      const branchName = 'branch name'

      await pullRequestCreator.create({
        outdatedPackage,
        branchName
      })

      expect(pullRequestTitleCreatorCreateMock).toHaveBeenCalledWith(outdatedPackage)
      expect(pullRequestBodyCreatorCreateMock).toHaveBeenCalledWith(outdatedPackage)
      expect(githubCreatePullRequestMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        baseBranch: githubRepo.default_branch,
        headBranch: branchName,
        title,
        body,
        draft: options.draftPr
      })
      expect(labelsAdderAddMock).toHaveBeenCalledWith(pullRequest.number)
      expect(assigneesAdderAddMock).toHaveBeenCalledWith({
        issueNumber: pullRequest.number,
        assignees: options.assignees,
        size: options.assigneesSampleSize
      })
      expect(reviewersAdderAddMock).toHaveBeenCalledWith({
        pullNumber: pullRequest.number,
        reviewers: options.reviewers,
        size: options.reviewersSampleSize
      })
    })
  })
})
