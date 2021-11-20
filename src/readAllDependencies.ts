import type { PackageDependencies } from './types/PackageDependencies'
import { readPackageJson } from './readPackageJson'

// TODO: add test
// TODO: add logs using logger
export const readAllDependencies = async (filePath: string): Promise<PackageDependencies> => {
  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies
  } = await readPackageJson(filePath)
  return {
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    ...optionalDependencies
  }
}
