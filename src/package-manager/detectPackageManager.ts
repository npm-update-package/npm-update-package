import { canReadWrite } from '../file'
import { PackageManagerName } from './PackageManagerName'

// TODO: Add test
export const detectPackageManager = async (): Promise<PackageManagerName> => {
  if (await canReadWrite('package-lock.json')) {
    return PackageManagerName.Npm
  }

  if (await canReadWrite('yarn.lock')) {
    return PackageManagerName.Yarn
  }

  throw new Error('No lock file exists.')
}
