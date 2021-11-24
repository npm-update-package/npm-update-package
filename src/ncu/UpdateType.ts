export const UpdateType = {
  Major: 'major',
  Minor: 'minor',
  Patch: 'patch'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type UpdateType = typeof UpdateType[keyof typeof UpdateType]
const updateTypes = Object.values(UpdateType)
export const isUpdateType = (value: any): value is UpdateType => updateTypes.includes(value)
