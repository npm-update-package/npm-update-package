export interface PackageManager {
  packageFile: string
  lockFile: string
  install: () => Promise<void>
}
