export interface PackageManager {
  install: () => Promise<void>
}
