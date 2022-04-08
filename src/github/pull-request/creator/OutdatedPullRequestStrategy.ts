export const OutdatedPullRequestStrategy = {
  Recreate: 'recreate'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OutdatedPullRequestStrategy = typeof OutdatedPullRequestStrategy[keyof typeof OutdatedPullRequestStrategy]
const outdatedPullRequestStrategies = Object.values(OutdatedPullRequestStrategy)
export const isOutdatedPullRequestStrategy = (value: any): value is OutdatedPullRequestStrategy => outdatedPullRequestStrategies.includes(value)
