import type { RestEndpointMethodTypes } from '@octokit/rest'
import type { ValuesType } from 'utility-types'

export type Label = ValuesType<RestEndpointMethodTypes['issues']['addLabels']['response']['data']>
