import type { PackageDependencies } from './types/PackageDependencies'
import { readPackageJson } from './readPackageJson'

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
