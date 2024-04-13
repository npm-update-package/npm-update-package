export const PackageManagerName = {
  Npm: 'npm',
  Yarn: 'yarn'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageManagerName = typeof PackageManagerName[keyof typeof PackageManagerName]
const packageManagerNames = Object.values(PackageManagerName)
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const isPackageManagerName = (value: any): value is PackageManagerName => packageManagerNames.includes(value)
