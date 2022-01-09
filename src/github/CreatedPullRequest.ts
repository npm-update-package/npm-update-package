import type { RestEndpointMethodTypes } from '@octokit/rest'

export type CreatedPullRequest = RestEndpointMethodTypes['pulls']['create']['response']['data']
