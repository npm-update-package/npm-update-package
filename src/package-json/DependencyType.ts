export const DependencyType = {
  Dependencies: 'dependencies',
  DevDependencies: 'devDependencies',
  PeerDependencies: 'peerDependencies',
  OptionalDependencies: 'optionalDependencies'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DependencyType = typeof DependencyType[keyof typeof DependencyType]
const dependencyTypes = Object.values(DependencyType)
export const isDependencyType = (value: any): value is DependencyType => dependencyTypes.includes(value)
