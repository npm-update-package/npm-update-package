import type { RestEndpointMethodTypes } from '@octokit/rest'
import type { ValuesType } from 'utility-types'

export type PullRequest = ValuesType<RestEndpointMethodTypes['pulls']['list']['response']['data']>
