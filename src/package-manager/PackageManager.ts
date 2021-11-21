export interface PackageManager {
  packageFiles: string[]
  install: () => Promise<void>
}
