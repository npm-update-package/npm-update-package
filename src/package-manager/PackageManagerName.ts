export const PackageManagerName = {
  Npm: 'npm',
  Yarn: 'Yarn'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageManagerName = typeof PackageManagerName[keyof typeof PackageManagerName]
const packageManagerNames = Object.values(PackageManagerName)
export const isPackageManagerName = (value: any): value is PackageManagerName => packageManagerNames.includes(value)
