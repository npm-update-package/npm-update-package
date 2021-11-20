import type {
  Octokit,
  RestEndpointMethodTypes
} from '@octokit/rest'
import type { ValuesType } from 'utility-types'

export type Branch = ValuesType<RestEndpointMethodTypes['repos']['listBranches']['response']['data']>
export type PullRequest = RestEndpointMethodTypes['pulls']['create']['response']['data']
export type Repository = RestEndpointMethodTypes['repos']['get']['response']['data']

export class GitHub {
  constructor (private readonly octokit: Octokit) {}

  async createPullRequest (params: RestEndpointMethodTypes['pulls']['create']['parameters']): Promise<PullRequest> {
    const { data } = await this.octokit.pulls.create(params)
    return data
  }

  async fetchBranches (params: RestEndpointMethodTypes['repos']['listBranches']['parameters']): Promise<Branch[]> {
    const { data } = await this.octokit.repos.listBranches(params)
    return data
  }

  async fetchRepository (params: RestEndpointMethodTypes['repos']['get']['parameters']): Promise<Repository> {
    const { data } = await this.octokit.repos.get(params)
    return data
  }
}
