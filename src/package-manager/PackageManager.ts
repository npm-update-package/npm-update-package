export interface PackageManager {
  packageFile: string
  lockFile: string
  // TODO: getVersions
  install: () => Promise<void>
}
