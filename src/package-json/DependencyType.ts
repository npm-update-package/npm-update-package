export const DependencyType = {
  Dependencies: 'dependencies',
  DevDependencies: 'devDependencies',
  PeerDependencies: 'peerDependencies',
  BundledDependencies: 'bundledDependencies',
  OptionalDependencies: 'optionalDependencies'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type DependencyType = typeof DependencyType[keyof typeof DependencyType]
const dependencyTypes = Object.values(DependencyType)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const isDependencyType = (value: any): value is DependencyType => dependencyTypes.includes(value)
