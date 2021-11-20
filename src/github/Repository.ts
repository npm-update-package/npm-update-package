import type { RestEndpointMethodTypes } from '@octokit/rest'

export type Repository = RestEndpointMethodTypes['repos']['get']['response']['data']
