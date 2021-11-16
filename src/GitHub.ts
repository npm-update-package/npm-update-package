import type {
  Octokit,
  RestEndpointMethodTypes
} from '@octokit/rest'

export class GitHub {
  constructor (private readonly octokit: Octokit) {}

  async fetchRepository (params: RestEndpointMethodTypes['repos']['get']['parameters']): Promise<RestEndpointMethodTypes['repos']['get']['response']['data']> {
    const { data } = await this.octokit.repos.get(params)
    return data
  }

  async fetchBranches (params: RestEndpointMethodTypes['repos']['listBranches']['parameters']): Promise<RestEndpointMethodTypes['repos']['listBranches']['response']['data']> {
    const { data } = await this.octokit.repos.listBranches(params)
    return data
  }

  async createPullRequest (params: RestEndpointMethodTypes['pulls']['create']['parameters']): Promise<RestEndpointMethodTypes['pulls']['create']['response']['data']> {
    const { data } = await this.octokit.pulls.create(params)
    return data
  }
}
