import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { Octokit } from '@octokit/rest'
import range from 'lodash/range.js'
import type {
  Branch,
  CreatedPullRequest,
  Label,
  PullRequest,
  Repository
} from './GitHub.js'
import { GitHub } from './GitHub.js'

const createBranches = (start: number, end: number): Branch[] => {
  return range(start, end).map(num => ({ name: `branch ${num}` } as unknown as Branch))
}

const createPullRequests = (start: number, end: number): PullRequest[] => {
  return range(start, end).map(id => ({ id } as unknown as PullRequest))
}

await describe('GitHub', async () => {
  const gitDeleteRefMock = mock.fn<Octokit['git']['deleteRef']>()
  const issuesAddAssigneesMock = mock.fn<Octokit['issues']['addAssignees']>()
  const issuesAddLabelsMock = mock.fn<Octokit['issues']['addLabels']>()
  const issuesCreateLabelMock = mock.fn<Octokit['issues']['createLabel']>()
  const issuesGetLabelMock = mock.fn<Octokit['issues']['getLabel']>()
  const pullsCreateMock = mock.fn<Octokit['pulls']['create']>()
  const pullsListMock = mock.fn<Octokit['pulls']['list']>()
  const pullsRequestReviewersMock = mock.fn<Octokit['pulls']['requestReviewers']>()
  const pullsUpdateMock = mock.fn<Octokit['pulls']['update']>()
  const reposGetMock = mock.fn<Octokit['repos']['get']>()
  const reposListBranchesMock = mock.fn<Octokit['repos']['listBranches']>()
  const octokit = {
    git: {
      deleteRef: gitDeleteRefMock
    },
    issues: {
      addAssignees: issuesAddAssigneesMock,
      addLabels: issuesAddLabelsMock,
      createLabel: issuesCreateLabelMock,
      getLabel: issuesGetLabelMock
    },
    pulls: {
      create: pullsCreateMock,
      list: pullsListMock,
      requestReviewers: pullsRequestReviewersMock,
      update: pullsUpdateMock
    },
    repos: {
      get: reposGetMock,
      listBranches: reposListBranchesMock
    }
  } as unknown as Octokit
  const github = new GitHub(octokit)

  afterEach(() => {
    gitDeleteRefMock.mock.resetCalls()
    issuesAddAssigneesMock.mock.resetCalls()
    issuesAddLabelsMock.mock.resetCalls()
    issuesCreateLabelMock.mock.resetCalls()
    issuesGetLabelMock.mock.resetCalls()
    pullsCreateMock.mock.resetCalls()
    pullsListMock.mock.resetCalls()
    pullsRequestReviewersMock.mock.resetCalls()
    pullsUpdateMock.mock.resetCalls()
    reposGetMock.mock.resetCalls()
    reposListBranchesMock.mock.resetCalls()
  })

  await describe('addAssignees', async () => {
    await it('calls octokit.issues.addAssignees()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const issueNumber = 1
      const assignees = ['npm-update-package-bot']

      await github.addAssignees({
        owner,
        repo,
        issueNumber,
        assignees
      })

      assert.strictEqual(issuesAddAssigneesMock.mock.callCount(), 1)
      assert.deepStrictEqual(issuesAddAssigneesMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            issue_number: issueNumber,
            assignees
          }
        ]
      ])
    })
  })

  await describe('addLabels', async () => {
    await it('calls octokit.issues.addLabels()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const issueNumber = 1
      const labels = ['test label']

      await github.addLabels({
        owner,
        repo,
        issueNumber,
        labels
      })

      assert.strictEqual(issuesAddLabelsMock.mock.callCount(), 1)
      assert.deepStrictEqual(issuesAddLabelsMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            issue_number: issueNumber,
            labels
          }
        ]
      ])
    })
  })

  await describe('closePullRequest', async () => {
    await it('calls octokit.pulls.update()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const pullNumber = 1

      await github.closePullRequest({
        owner,
        repo,
        pullNumber
      })

      assert.strictEqual(pullsUpdateMock.mock.callCount(), 1)
      assert.deepStrictEqual(pullsUpdateMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            pull_number: pullNumber,
            state: 'closed'
          }
        ]
      ])
    })
  })

  await describe('createLabel', async () => {
    await it('calls octokit.issues.createLabel()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const name = 'test label'
      const description = 'test description'
      const color = 'FFFFFF'

      await github.createLabel({
        owner,
        repo,
        name,
        description,
        color
      })

      assert.strictEqual(issuesCreateLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(issuesCreateLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            name,
            description,
            color
          }
        ]
      ])
    })
  })

  await describe('createPullRequest', async () => {
    await it('calls octokit.pulls.create()', async () => {
      const expected = {
        id: 1
      } as unknown as CreatedPullRequest
      const owner = 'npm-update-package'
      const repo = 'example'
      const baseBranch = 'master'
      const headBranch = 'develop'
      const title = 'test title'
      const body = 'test body'
      const draft = true
      pullsCreateMock.mock.mockImplementation(async () => await Promise.resolve({ data: expected } as unknown as Awaited<ReturnType<Octokit['pulls']['create']>>))

      const actual = await github.createPullRequest({
        owner,
        repo,
        baseBranch,
        headBranch,
        title,
        body,
        draft
      })

      assert.strictEqual(actual, expected)
      assert.strictEqual(pullsCreateMock.mock.callCount(), 1)
      assert.deepStrictEqual(pullsCreateMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            base: baseBranch,
            head: headBranch,
            title,
            body,
            draft
          }
        ]
      ])
    })
  })

  await describe('deleteBranch', async () => {
    await it('calls octokit.git.deleteRef()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const branch = 'develop'

      await github.deleteBranch({
        owner,
        repo,
        branch
      })

      assert.strictEqual(gitDeleteRefMock.mock.callCount(), 1)
      assert.deepStrictEqual(gitDeleteRefMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            ref: `heads/${branch}`
          }
        ]
      ])
    })
  })

  await describe('fetchBranches', async () => {
    await it('calls octokit.repos.listBranches()', async () => {
      const branchesByPage = new Map([
        [1, createBranches(1, 101)],
        [2, createBranches(101, 201)],
        [3, createBranches(201, 301)],
        [4, createBranches(301, 401)],
        [5, createBranches(401, 501)],
        [6, createBranches(501, 601)],
        [7, createBranches(601, 701)],
        [8, createBranches(701, 801)],
        [9, createBranches(801, 901)],
        [10, []]
      ])
      const owner = 'npm-update-package'
      const repo = 'example'
      reposListBranchesMock.mock.mockImplementation((async (params) => {
        const branches = params?.page === undefined ? undefined : branchesByPage.get(params.page)
        return await (branches === undefined ? Promise.reject(new Error('error')) : Promise.resolve({ data: branches }))
      }) as Octokit['repos']['listBranches'])

      const actual = await github.fetchBranches({
        owner,
        repo
      })

      assert.deepStrictEqual(actual, Array.from(branchesByPage.values()).flat())
      assert.strictEqual(reposListBranchesMock.mock.callCount(), 10)
      assert.deepStrictEqual(
        reposListBranchesMock.mock.calls.map(call => call.arguments),
        Array.from(branchesByPage.keys()).map(page => [
          {
            owner,
            repo,
            per_page: 100,
            page
          }
        ])
      )
    })
  })

  await describe('fetchLabel', async () => {
    await it('calls octokit.issues.getLabel()', async () => {
      const expected = {
        id: 1
      } as unknown as Label
      const owner = 'npm-update-package'
      const repo = 'example'
      const name = 'test label'
      issuesGetLabelMock.mock.mockImplementation(async () => await Promise.resolve({ data: expected } as unknown as Awaited<ReturnType<Octokit['issues']['getLabel']>>))

      const actual = await github.fetchLabel({
        owner,
        repo,
        name
      })

      assert.strictEqual(actual, expected)
      assert.strictEqual(issuesGetLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(issuesGetLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            name
          }
        ]
      ])
    })
  })

  await describe('fetchPullRequests', async () => {
    await it('calls octokit.pulls.list()', async () => {
      const pullRequestsByPage = new Map([
        [1, createPullRequests(1, 101)],
        [2, createPullRequests(101, 201)],
        [3, createPullRequests(201, 301)],
        [4, createPullRequests(301, 401)],
        [5, createPullRequests(401, 501)],
        [6, createPullRequests(501, 601)],
        [7, createPullRequests(601, 701)],
        [8, createPullRequests(701, 801)],
        [9, createPullRequests(801, 901)],
        [10, []]
      ])
      const owner = 'npm-update-package'
      const repo = 'example'
      pullsListMock.mock.mockImplementation((async (params) => {
        const pullRequests = params?.page === undefined ? undefined : pullRequestsByPage.get(params.page)
        return await (pullRequests === undefined ? Promise.reject(new Error('error')) : Promise.resolve({ data: pullRequests }))
      }) as Octokit['pulls']['list'])

      const actual = await github.fetchPullRequests({
        owner,
        repo
      })

      assert.deepStrictEqual(actual, Array.from(pullRequestsByPage.values()).flat())
      assert.strictEqual(pullsListMock.mock.callCount(), 10)
      assert.deepStrictEqual(
        pullsListMock.mock.calls.map(call => call.arguments),
        Array.from(pullRequestsByPage.keys()).map(page => [
          {
            owner,
            repo,
            per_page: 100,
            page
          }
        ])
      )
    })
  })

  await describe('fetchRepository', async () => {
    await it('calls octokit.repos.get()', async () => {
      const expected = {
        id: 1
      } as unknown as Repository
      const owner = 'npm-update-package'
      const repo = 'example'
      reposGetMock.mock.mockImplementation(async () => await Promise.resolve({ data: expected } as unknown as Awaited<ReturnType<Octokit['repos']['get']>>))

      const actual = await github.fetchRepository({
        owner,
        repo
      })

      assert.strictEqual(actual, expected)
      assert.strictEqual(reposGetMock.mock.callCount(), 1)
      assert.deepStrictEqual(reposGetMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo
          }
        ]
      ])
    })
  })

  await describe('requestReviewers', async () => {
    await it('calls octokit.pulls.requestReviewers()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const pullNumber = 1
      const reviewers = ['npm-update-package-bot']

      await github.requestReviewers({
        owner,
        repo,
        pullNumber,
        reviewers
      })

      assert.strictEqual(pullsRequestReviewersMock.mock.callCount(), 1)
      assert.deepStrictEqual(pullsRequestReviewersMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner,
            repo,
            pull_number: pullNumber,
            reviewers
          }
        ]
      ])
    })
  })
})
