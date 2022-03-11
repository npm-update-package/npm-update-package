import type { Octokit } from '@octokit/rest'
import { range } from 'lodash'
import {
  GitHub,
  type Branch,
  type CreatedPullRequest,
  type Label,
  type PullRequest,
  type Release,
  type Repository
} from './GitHub'

describe('GitHub', () => {
  const gitDeleteRefMock = jest.fn()
  const issuesAddLabelsMock = jest.fn()
  const issuesCreateLabelMock = jest.fn()
  const issuesGetLabelMock = jest.fn()
  const pullsCreateMock = jest.fn()
  const pullsListMock = jest.fn()
  const pullsRequestReviewersMock = jest.fn()
  const pullsUpdateMock = jest.fn()
  const reposGetMock = jest.fn()
  const reposListBranchesMock = jest.fn()
  const reposListReleasesMock = jest.fn()
  const octokit = {
    git: {
      deleteRef: gitDeleteRefMock
    },
    issues: {
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
      listBranches: reposListBranchesMock,
      listReleases: reposListReleasesMock
    }
  } as unknown as Octokit
  const github = new GitHub(octokit)

  afterEach(() => {
    gitDeleteRefMock.mockReset()
    issuesAddLabelsMock.mockReset()
    issuesCreateLabelMock.mockReset()
    issuesGetLabelMock.mockReset()
    pullsCreateMock.mockReset()
    pullsListMock.mockReset()
    pullsRequestReviewersMock.mockReset()
    pullsUpdateMock.mockReset()
    reposGetMock.mockReset()
    reposListBranchesMock.mockReset()
    reposListReleasesMock.mockReset()
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

      expect(issuesAddLabelsMock).toBeCalledWith({
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

      expect(pullsUpdateMock).toBeCalledWith({
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

      expect(issuesCreateLabelMock).toBeCalledWith({
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
      pullsCreateMock.mockResolvedValue({ data: expected })

      const owner = 'npm-update-package'
      const repo = 'example'
      const baseBranch = 'master'
      const headBranch = 'develop'
      const title = 'test title'
      const body = 'test body'
      const actual = await github.createPullRequest({
        owner,
        repo,
        baseBranch,
        headBranch,
        title,
        body
      })

      expect(actual).toBe(expected)
      expect(pullsCreateMock).toBeCalledWith({
        owner,
        repo,
        base: baseBranch,
        head: headBranch,
        title,
        body
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

      expect(gitDeleteRefMock).toBeCalledWith({
        owner,
        repo,
        ref: `heads/${branch}`
      })
    })
  })

  describe('fetchBranches', () => {
    it('calls octokit.repos.listBranches()', async () => {
      const createBranches = (start: number, end: number): Branch[] => {
        return range(start, end).map(num => ({
          name: `branch ${num}`
        } as unknown as Branch))
      }
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
      reposListBranchesMock.mockImplementation(async ({ page }: { page: number }) => {
        const branches = branchesByPage.get(page)

        if (branches !== undefined) {
          return await Promise.resolve({ data: branches })
        } else {
          return await Promise.reject(new Error())
        }
      })

      const owner = 'npm-update-package'
      const repo = 'example'
      const actual = await github.fetchBranches({
        owner,
        repo
      })

      expect.assertions(2 + 10)
      expect(actual).toEqual(Array.from(branchesByPage.values()).flat())
      expect(reposListBranchesMock).toBeCalledTimes(10)
      Array.from(branchesByPage.keys()).forEach(page => {
        expect(reposListBranchesMock).toBeCalledWith({
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
      issuesGetLabelMock.mockResolvedValue({ data: expected })

      const owner = 'npm-update-package'
      const repo = 'example'
      const name = 'test label'
      const actual = await github.fetchLabel({
        owner,
        repo,
        name
      })

      expect(actual).toBe(expected)
      expect(issuesGetLabelMock).toBeCalledWith({
        owner,
        repo,
        name
      })
    })
  })

  describe('fetchPullRequests', () => {
    it('calls octokit.pulls.list()', async () => {
      const createPullRequests = (start: number, end: number): PullRequest[] => {
        return range(start, end).map(id => ({ id } as unknown as PullRequest))
      }
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
      pullsListMock.mockImplementation(async ({ page }: { page: number }) => {
        const pullRequests = pullRequestsByPage.get(page)

        if (pullRequests !== undefined) {
          return await Promise.resolve({ data: pullRequests })
        } else {
          return await Promise.reject(new Error())
        }
      })

      const owner = 'npm-update-package'
      const repo = 'example'
      const actual = await github.fetchPullRequests({
        owner,
        repo
      })

      expect.assertions(2 + 10)
      expect(actual).toEqual(Array.from(pullRequestsByPage.values()).flat())
      expect(pullsListMock).toBeCalledTimes(10)
      Array.from(pullRequestsByPage.keys()).forEach(page => {
        expect(pullsListMock).toBeCalledWith({
          owner,
          repo,
          per_page: 100,
          page
        })
      })
    })
  })

  describe('fetchReleases', () => {
    it('calls octokit.repos.listReleases()', async () => {
      const createRelease = (start: number, end: number): Release[] => {
        return range(start, end).map(id => ({ id } as unknown as Release))
      }
      const releasesByPage = new Map([
        [1, createRelease(1, 101)],
        [2, createRelease(101, 201)],
        [3, createRelease(201, 301)],
        [4, createRelease(301, 401)],
        [5, createRelease(401, 501)],
        [6, createRelease(501, 601)],
        [7, createRelease(601, 701)],
        [8, createRelease(701, 801)],
        [9, createRelease(801, 901)],
        [10, []]
      ])
      reposListReleasesMock.mockImplementation(async ({ page }: { page: number }) => {
        const releases = releasesByPage.get(page)

        if (releases !== undefined) {
          return await Promise.resolve({ data: releases })
        } else {
          return await Promise.reject(new Error())
        }
      })

      const owner = 'npm-update-package'
      const repo = 'example'
      const actual = await github.fetchReleases({
        owner,
        repo
      })

      expect.assertions(2 + 10)
      expect(actual).toEqual(Array.from(releasesByPage.values()).flat())
      expect(reposListReleasesMock).toBeCalledTimes(10)
      Array.from(releasesByPage.keys()).forEach(page => {
        expect(reposListReleasesMock).toBeCalledWith({
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
      reposGetMock.mockResolvedValue({ data: expected })

      const owner = 'npm-update-package'
      const repo = 'example'
      const actual = await github.fetchRepository({
        owner,
        repo
      })

      expect(actual).toBe(expected)
      expect(reposGetMock).toBeCalledWith({
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

      expect(pullsRequestReviewersMock).toBeCalledWith({
        owner,
        repo,
        pull_number: pullNumber,
        reviewers
      })
    })
  })
})
