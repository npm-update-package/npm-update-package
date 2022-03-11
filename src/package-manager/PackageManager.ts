import type { SemVer } from '../semver'

export interface PackageManager {
  packageFile: string
  lockFile: string
  getVersions: (packageName: string) => Promise<SemVer[]>
  install: () => Promise<void>
}
