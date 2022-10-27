import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { Octokit } from '@octokit/rest'
import { range } from '../util'
import { GitHub } from './GitHub'
import type {
  Branch,
  CreatedPullRequest,
  Label,
  PullRequest,
  Repository
} from './GitHub'

const createBranches = (start: number, end: number): Branch[] => {
  return Array.from(range(start, end)).map(num => ({
    name: `branch ${num}`
  } as unknown as Branch))
}

const createPullRequests = (start: number, end: number): PullRequest[] => {
  return Array.from(range(start, end)).map(id => ({ id } as unknown as PullRequest))
}

describe('GitHub', () => {
  const gitDeleteRefMock = jest.fn<Octokit['git']['deleteRef']>()
  const issuesAddAssigneesMock = jest.fn<Octokit['issues']['addAssignees']>()
  const issuesAddLabelsMock = jest.fn<Octokit['issues']['addLabels']>()
  const issuesCreateLabelMock = jest.fn<Octokit['issues']['createLabel']>()
  const issuesGetLabelMock = jest.fn<Octokit['issues']['getLabel']>()
  const pullsCreateMock = jest.fn<Octokit['pulls']['create']>()
  const pullsListMock = jest.fn<Octokit['pulls']['list']>()
  const pullsRequestReviewersMock = jest.fn<Octokit['pulls']['requestReviewers']>()
  const pullsUpdateMock = jest.fn<Octokit['pulls']['update']>()
  const reposGetMock = jest.fn<Octokit['repos']['get']>()
  const reposListBranchesMock = jest.fn<Octokit['repos']['listBranches']>()
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
    jest.resetAllMocks()
  })

  describe('addAssignees', () => {
    it('calls octokit.issues.addAssignees()', async () => {
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

      expect(issuesAddAssigneesMock).toHaveBeenCalledWith({
        owner,
        repo,
        issue_number: issueNumber,
        assignees
      })
    })
  })

  describe('addLabels', () => {
    it('calls octokit.issues.addLabels()', async () => {
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

      expect(issuesAddLabelsMock).toHaveBeenCalledWith({
        owner,
        repo,
        issue_number: issueNumber,
        labels
      })
    })
  })

  describe('closePullRequest', () => {
    it('calls octokit.pulls.update()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const pullNumber = 1

      await github.closePullRequest({
        owner,
        repo,
        pullNumber
      })

      expect(pullsUpdateMock).toHaveBeenCalledWith({
        owner,
        repo,
        pull_number: pullNumber,
        state: 'closed'
      })
    })
  })

  describe('createLabel', () => {
    it('calls octokit.issues.createLabel()', async () => {
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

      expect(issuesCreateLabelMock).toHaveBeenCalledWith({
        owner,
        repo,
        name,
        description,
        color
      })
    })
  })

  describe('createPullRequest', () => {
    it('calls octokit.pulls.create()', async () => {
      const expected = {
        id: 1
      } as unknown as CreatedPullRequest
      pullsCreateMock.mockResolvedValue({ data: expected } as unknown as Awaited<ReturnType<typeof pullsCreateMock>>)
      const owner = 'npm-update-package'
      const repo = 'example'
      const baseBranch = 'master'
      const headBranch = 'develop'
      const title = 'test title'
      const body = 'test body'
      const draft = true

      const actual = await github.createPullRequest({
        owner,
        repo,
        baseBranch,
        headBranch,
        title,
        body,
        draft
      })

      expect(actual).toBe(expected)
      expect(pullsCreateMock).toHaveBeenCalledWith({
        owner,
        repo,
        base: baseBranch,
        head: headBranch,
        title,
        body,
        draft
      })
    })
  })

  describe('deleteBranch', () => {
    it('calls octokit.git.deleteRef()', async () => {
      const owner = 'npm-update-package'
      const repo = 'example'
      const branch = 'develop'

      await github.deleteBranch({
        owner,
        repo,
        branch
      })

      expect(gitDeleteRefMock).toHaveBeenCalledWith({
        owner,
        repo,
        ref: `heads/${branch}`
      })
    })
  })

  describe('fetchBranches', () => {
    it('calls octokit.repos.listBranches()', async () => {
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
      reposListBranchesMock.mockImplementation((async (params) => {
        const branches = params?.page !== undefined ? branchesByPage.get(params.page) : undefined
        return await (branches !== undefined ? Promise.resolve({ data: branches }) : Promise.reject(new Error()))
      }) as Octokit['repos']['listBranches'])
      const owner = 'npm-update-package'
      const repo = 'example'

      const actual = await github.fetchBranches({
        owner,
        repo
      })

      expect.assertions(2 + 10)
      expect(actual).toEqual(Array.from(branchesByPage.values()).flat())
      expect(reposListBranchesMock).toHaveBeenCalledTimes(10)
      Array.from(branchesByPage.keys()).forEach(page => {
        expect(reposListBranchesMock).toHaveBeenCalledWith({
          owner,
          repo,
          per_page: 100,
          page
        })
      })
    })
  })

  describe('fetchLabel', () => {
    it('calls octokit.issues.getLabel()', async () => {
      const expected = {
        id: 1
      } as unknown as Label
      issuesGetLabelMock.mockResolvedValue({ data: expected } as unknown as Awaited<ReturnType<typeof issuesGetLabelMock>>)
      const owner = 'npm-update-package'
      const repo = 'example'
      const name = 'test label'

      const actual = await github.fetchLabel({
        owner,
        repo,
        name
      })

      expect(actual).toBe(expected)
      expect(issuesGetLabelMock).toHaveBeenCalledWith({
        owner,
        repo,
        name
      })
    })
  })

  describe('fetchPullRequests', () => {
    it('calls octokit.pulls.list()', async () => {
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
      pullsListMock.mockImplementation((async (params) => {
        const pullRequests = params?.page !== undefined ? pullRequestsByPage.get(params.page) : undefined
        return await (pullRequests !== undefined ? Promise.resolve({ data: pullRequests }) : Promise.reject(new Error()))
      }) as Octokit['pulls']['list'])
      const owner = 'npm-update-package'
      const repo = 'example'

      const actual = await github.fetchPullRequests({
        owner,
        repo
      })

      expect.assertions(2 + 10)
      expect(actual).toEqual(Array.from(pullRequestsByPage.values()).flat())
      expect(pullsListMock).toHaveBeenCalledTimes(10)
      Array.from(pullRequestsByPage.keys()).forEach(page => {
        expect(pullsListMock).toHaveBeenCalledWith({
          owner,
          repo,
          per_page: 100,
          page
        })
      })
    })
  })

  describe('fetchRepository', () => {
    it('calls octokit.repos.get()', async () => {
      const expected = {
        id: 1
      } as unknown as Repository
      reposGetMock.mockResolvedValue({ data: expected } as unknown as Awaited<ReturnType<typeof reposGetMock>>)
      const owner = 'npm-update-package'
      const repo = 'example'

      const actual = await github.fetchRepository({
        owner,
        repo
      })

      expect(actual).toBe(expected)
      expect(reposGetMock).toHaveBeenCalledWith({
        owner,
        repo
      })
    })
  })

  describe('requestReviewers', () => {
    it('calls octokit.pulls.requestReviewers()', async () => {
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

      expect(pullsRequestReviewersMock).toHaveBeenCalledWith({
        owner,
        repo,
        pull_number: pullNumber,
        reviewers
      })
    })
  })
})
