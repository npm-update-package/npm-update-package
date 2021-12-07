export interface PackageManager {
  packageFiles: string[]
  packageFile: string
  lockFile: string
  install: () => Promise<void>
}
