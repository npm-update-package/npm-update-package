import type {
  Octokit,
  RestEndpointMethodTypes
} from '@octokit/rest'
import type { ValuesType } from 'utility-types'

export type Branch = ValuesType<RestEndpointMethodTypes['repos']['listBranches']['response']['data']>
export type CreatedPullRequest = RestEndpointMethodTypes['pulls']['create']['response']['data']
export type Label = RestEndpointMethodTypes['issues']['getLabel']['response']['data']
export type PullRequest = ValuesType<RestEndpointMethodTypes['pulls']['list']['response']['data']>
export type Repository = RestEndpointMethodTypes['repos']['get']['response']['data']

// TODO: add test
export class GitHub {
  constructor (private readonly octokit: Octokit) {}

  async addLabels ({
    owner,
    repo,
    issueNumber,
    labels
  }: {
    owner: string
    repo: string
    issueNumber: number
    labels: string[]
  }): Promise<void> {
    await this.octokit.issues.addLabels({
      owner,
      repo,
      issue_number: issueNumber,
      labels
    })
  }

  async closePullRequest ({
    owner,
    repo,
    pullNumber
  }: {
    owner: string
    repo: string
    pullNumber: number
  }): Promise<void> {
    await this.octokit.pulls.update({
      owner,
      repo,
      pull_number: pullNumber,
      state: 'closed'
    })
  }

  async createLabel ({
    owner,
    repo,
    name,
    description,
    color
  }: {
    owner: string
    repo: string
    name: string
    description?: string
    color?: string
  }): Promise<void> {
    await this.octokit.issues.createLabel({
      owner,
      repo,
      name,
      description,
      color
    })
  }

  async createPullRequest ({
    owner,
    repo,
    baseBranch,
    headBranch,
    title,
    body
  }: {
    owner: string
    repo: string
    baseBranch: string
    headBranch: string
    title: string
    body: string
  }): Promise<CreatedPullRequest> {
    const { data } = await this.octokit.pulls.create({
      owner,
      repo,
      base: baseBranch,
      head: headBranch,
      title,
      body
    })
    return data
  }

  async deleteBranch ({
    owner,
    repo,
    branch
  }: {
    owner: string
    repo: string
    branch: string
  }): Promise<void> {
    await this.octokit.git.deleteRef({
      owner,
      repo,
      ref: `heads/${branch}`
    })
  }

  // TODO: fetch all branches with page option
  async fetchBranches ({
    owner,
    repo
  }: {
    owner: string
    repo: string
  }): Promise<Branch[]> {
    const { data } = await this.octokit.repos.listBranches({
      owner,
      repo,
      per_page: 100
    })
    return data
  }

  async fetchLabel ({
    owner,
    repo,
    label
  }: {
    owner: string
    repo: string
    label: string
  }): Promise<Label> {
    const { data } = await this.octokit.issues.getLabel({
      owner,
      repo,
      name: label
    })
    return data
  }

  // TODO: fetch all pull requests with page option
  async fetchPullRequests ({
    owner,
    repo
  }: {
    owner: string
    repo: string
  }): Promise<PullRequest[]> {
    const { data } = await this.octokit.pulls.list({
      owner,
      repo,
      per_page: 100
    })
    return data
  }

  async fetchRepository ({
    owner,
    repo
  }: {
    owner: string
    repo: string
  }): Promise<Repository> {
    const { data } = await this.octokit.repos.get({
      owner,
      repo
    })
    return data
  }

  async requestReviewers ({
    owner,
    repo,
    pullNumber,
    reviewers
  }: {
    owner: string
    repo: string
    pullNumber: number
    reviewers: string[]
  }): Promise<void> {
    await this.octokit.pulls.requestReviewers({
      owner,
      repo,
      pull_number: pullNumber,
      reviewers
    })
  }
}
