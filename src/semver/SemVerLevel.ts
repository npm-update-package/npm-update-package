export const SemVerLevel = {
  Major: 'major',
  Minor: 'minor',
  Patch: 'patch'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type SemVerLevel = typeof SemVerLevel[keyof typeof SemVerLevel]
const semVerLevels = Object.values(SemVerLevel)
export const isSemVerLevel = (value: any): value is SemVerLevel => semVerLevels.includes(value)
