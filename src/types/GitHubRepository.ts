import type { RestEndpointMethodTypes } from '@octokit/rest'

export type GitHubRepository = RestEndpointMethodTypes['repos']['get']['response']['data']
