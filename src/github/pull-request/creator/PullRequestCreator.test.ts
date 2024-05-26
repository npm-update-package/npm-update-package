import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { OutdatedPackage } from '../../../core/OutdatedPackage.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import {
  type GitHub,
  type Repository as GitHubRepository,
  type CreatedPullRequest
} from '../../GitHub.js'
import type { AssigneesAdder } from './AssigneesAdder.js'
import type { LabelsAdder } from './LabelsAdder.js'
import type { PullRequestBodyCreator } from './PullRequestBodyCreator.js'
import { PullRequestCreator } from './PullRequestCreator.js'
import type { PullRequestTitleCreator } from './PullRequestTitleCreator.js'
import type { ReviewersAdder } from './ReviewersAdder.js'

await describe('PullRequestCreator', async () => {
  await describe('create', async () => {
    await it('creates pull request', async ({ mock }) => {
      const pullRequestBodyCreatorCreateMock = mock.fn<PullRequestBodyCreator['create']>()
      const pullRequestTitleCreatorCreateMock = mock.fn<PullRequestTitleCreator['create']>()
      const githubAddLabelsMock = mock.fn<GitHub['addLabels']>()
      const githubCreatePullRequestMock = mock.fn<GitHub['createPullRequest']>()
      const labelsAdderAddMock = mock.fn<LabelsAdder['add']>()
      const assigneesAdderAddMock = mock.fn<AssigneesAdder['add']>()
      const reviewersAdderAddMock = mock.fn<ReviewersAdder['add']>()
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
      } as unknown as Options
      const pullRequestCreator = new PullRequestCreator({
        options,
        github,
        gitRepo,
        githubRepo,
        pullRequestTitleCreator,
        pullRequestBodyCreator,
        labelsAdder,
        assigneesAdder,
        reviewersAdder
      })
      const title = 'pull request title'
      pullRequestTitleCreatorCreateMock.mock.mockImplementation(() => title)
      const body = 'pull request body'
      pullRequestBodyCreatorCreateMock.mock.mockImplementation(async () => await Promise.resolve(body))
      const pullRequest = {
        number: 1
      } as unknown as CreatedPullRequest
      githubCreatePullRequestMock.mock.mockImplementation(async () => await Promise.resolve(pullRequest))
      const outdatedPackage = {} as unknown as OutdatedPackage
      const branchName = 'branch name'

      await pullRequestCreator.create({
        outdatedPackage,
        branchName
      })

      assert.strictEqual(pullRequestTitleCreatorCreateMock.mock.callCount(), 1)
      assert.deepStrictEqual(pullRequestTitleCreatorCreateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(pullRequestBodyCreatorCreateMock.mock.callCount(), 1)
      assert.deepStrictEqual(pullRequestBodyCreatorCreateMock.mock.calls.map(call => call.arguments), [
        [outdatedPackage]
      ])
      assert.strictEqual(githubCreatePullRequestMock.mock.callCount(), 1)
      assert.deepStrictEqual(githubCreatePullRequestMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            baseBranch: githubRepo.default_branch,
            headBranch: branchName,
            title,
            body,
            draft: options.draftPr
          }
        ]
      ])
      assert.strictEqual(labelsAdderAddMock.mock.callCount(), 1)
      assert.deepStrictEqual(labelsAdderAddMock.mock.calls.map(call => call.arguments), [
        [pullRequest.number]
      ])
      assert.strictEqual(assigneesAdderAddMock.mock.callCount(), 1)
      assert.deepStrictEqual(assigneesAdderAddMock.mock.calls.map(call => call.arguments), [
        [
          {
            issueNumber: pullRequest.number,
            assignees: options.assignees,
            size: options.assigneesSampleSize
          }
        ]
      ])
      assert.strictEqual(reviewersAdderAddMock.mock.callCount(), 1)
      assert.deepStrictEqual(reviewersAdderAddMock.mock.calls.map(call => call.arguments), [
        [
          {
            pullNumber: pullRequest.number,
            reviewers: options.reviewers,
            size: options.reviewersSampleSize
          }
        ]
      ])
    })
  })
})
