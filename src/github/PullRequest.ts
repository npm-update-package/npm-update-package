import type { RestEndpointMethodTypes } from '@octokit/rest'

export type PullRequest = RestEndpointMethodTypes['pulls']['create']['response']['data']
