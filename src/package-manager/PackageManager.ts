export interface PackageManager {
  packageFile: string
  lockFile: string
  getVersions: (packageName: string) => Promise<string[]>
  install: () => Promise<void>
}
