export interface PackageManager {
  packageFiles: string[]
  packageFile: string
  install: () => Promise<void>
}
