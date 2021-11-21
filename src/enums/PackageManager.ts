export const PackageManager = {
  Npm: 'npm',
  Yarn: 'yarn'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageManager = typeof PackageManager[keyof typeof PackageManager]
const packageManagers = Object.values(PackageManager)
export const isPackageManager = (value: any): value is PackageManager => packageManagers.includes(value)
