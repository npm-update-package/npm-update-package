import type { RestEndpointMethodTypes } from '@octokit/rest'
import type { ValuesType } from 'utility-types'

export type Branch = ValuesType<RestEndpointMethodTypes['repos']['listBranches']['response']['data']>
